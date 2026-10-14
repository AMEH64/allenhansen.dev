// Compares every route, redirect, and header of a deployment with the live site.
//
//   pnpm check:parity <candidate>                 compare with https://www.allenhansen.dev
//   pnpm check:parity <candidate> --reference <url | snapshot.json>
//   pnpm check:parity <url> --save <snapshot.json>  record a site to compare with later
//   pnpm check:parity --hosts                     check apex, http, and blog. redirects on the live domains
//
// Routes come from dist/ (run `pnpm build` first), dist/_redirects, the reference sitemap,
// links on every HTML page of both sites, and the edge cases below. Exits 1 on any
// difference that isn't in `expected`. Add --report <file.md> to write the table to a file.
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const LIVE = 'https://www.allenhansen.dev'
const DIST = new URL('../dist/', import.meta.url)
const HEADERS = [
  'content-type',
  'cache-control',
  'strict-transport-security',
  'access-control-allow-origin',
  'x-robots-tag',
]
const EDGE_CASES = [
  '/about',
  '/about/',
  '/now',
  '/now/',
  '/blog?tag=css',
  '/blog/?tag=css&type=note',
  '/blog/rss.xml/',
  '/nope',
  '/blog/nope',
  '/blog/nope/',
  '/_astro/nope.css',
  '/404',
  '/_vercel/insights/script.js',
]

const args = process.argv.slice(2)
const flag = name => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args.splice(i, 2)[1]
}
const hostsOnly = args.includes('--hosts')
const reportFile = flag('--report')
const saveFile = flag('--save')
const referenceArg = flag('--reference') ?? LIVE
const candidate = args.find(a => !a.startsWith('--'))?.replace(/\/$/, '')

if (hostsOnly) process.exit(await checkHosts())
if (!candidate) {
  console.error(
    'Usage: node scripts/check-parity.mjs <candidate-url> [--reference <url|file.json>] [--save <file.json>] [--report <file.md>]',
  )
  process.exit(2)
}

if (saveFile) {
  const snapshot = await crawl(candidate, seedRoutes())
  writeFileSync(
    saveFile,
    JSON.stringify({ base: candidate, routes: snapshot }, null, 2),
  )
  console.log(
    `Saved ${Object.keys(snapshot).length} routes from ${candidate} to ${saveFile}`,
  )
  process.exit(0)
}

const snapshot = /^https?:/.test(referenceArg)
  ? undefined
  : JSON.parse(readFileSync(referenceArg, 'utf8'))
const reference = snapshot?.base ?? referenceArg.replace(/\/$/, '')
const seeds = seedRoutes()
for (const loc of await sitemapPaths(reference)) seeds.add(loc)
const ref = snapshot?.routes ?? (await crawl(reference, seeds))
const cand = await crawl(candidate, new Set([...seeds, ...Object.keys(ref)]))
if (!snapshot)
  Object.assign(ref, await crawl(reference, new Set(Object.keys(cand)), ref))

const refLinks = linkedFrom(ref)
const candLinks = linkedFrom(cand)
const rows = []
for (const path of [
  ...new Set([...Object.keys(ref), ...Object.keys(cand)]),
].sort()) {
  const a = ref[path]
  const b = cand[path]
  if (!a && path.startsWith('/_astro/') && !refLinks.has(path)) {
    rows.push({
      path,
      result: 'expected',
      notes: [
        'hashed name from the candidate build only; the snapshot doesn’t have it',
      ],
    })
    continue
  }
  if (!a || !b) {
    rows.push({
      path,
      result: 'FAIL',
      notes: [`missing from ${a ? 'candidate' : 'reference'}`],
    })
    continue
  }
  if (candLinks.has(path) && b.status >= 400) {
    rows.push({
      path,
      result: 'FAIL',
      notes: [
        `the candidate's own pages link here, but it returns ${b.status}`,
      ],
    })
    continue
  }
  const diffs = compare(a, b)
  if (!diffs.length) {
    rows.push({ path, result: 'same', notes: [summary(b)] })
    continue
  }
  const verdict = expected(path, a, b, diffs)
  rows.push({
    path,
    result: verdict?.result ?? 'FAIL',
    notes: verdict ? [verdict.reason, ...diffs] : diffs,
  })
}

const counts = Object.groupBy(rows, r => r.result)
const table = [
  `Reference: ${reference}${snapshot ? ` (snapshot ${referenceArg})` : ''}`,
  `Candidate: ${candidate}`,
  '',
  `${rows.length} routes: ${counts.same?.length ?? 0} same, ${counts.expected?.length ?? 0} expected differences, ${counts.review?.length ?? 0} to review by eye, ${counts.FAIL?.length ?? 0} failures`,
  '',
  '| Route | Result | Notes |',
  '| :---- | :----- | :---- |',
  ...rows.map(
    r =>
      `| \`${r.path}\` | ${r.result} | ${r.notes.join('<br>').replaceAll('|', '\\|')} |`,
  ),
].join('\n')
console.log(table)
if (reportFile) writeFileSync(reportFile, `${table}\n`)
process.exit(counts.FAIL?.length ? 1 : 0)

/**
 * Differences that come from the platform or build machine, not from a broken route.
 * `review` passes but should be checked by eye.
 */
function expected(path, a, b, diffs) {
  const ok = reason => ({ result: 'expected', reason })
  const reasons = []
  let rest = diffs
  const drop = (test, reason) => {
    if (!rest.some(test)) return
    rest = rest.filter(d => !test(d))
    reasons.push(reason)
  }
  if (onWorkersDev()) {
    drop(
      d => /^x-robots-tag – → noindex/.test(d),
      'workers.dev URLs are noindex',
    )
  }
  // Cloudflare's edge sends text types without a charset; wrangler dev adds one.
  // Browsers then take it from <meta charset>, which must sit in the first 1024 bytes.
  const declared = b.ascii || (b.metaCharsetAt >= 0 && b.metaCharsetAt < 1024)
  if (declared) {
    drop(
      d => /^content-type (text\/[a-z]+);charset=utf-8 → \1$/.test(d),
      'no charset in Content-Type; the file is ASCII or declares <meta charset="utf-8"> in its first 1024 bytes',
    )
  }
  if (!rest.length) return ok(reasons.join('; '))
  const only = (...fields) => rest.every(d => fields.some(f => d.startsWith(f)))
  const isHtml = r => r.headers['content-type']?.startsWith('text/html')
  const isRedirect = r => r.status >= 300 && r.status < 400
  const canonical = path
    .replace(/(\?|$)/, '/$1')
    .replace(/\/index\.html\/(\?|$)/, '/$1')
  if (
    a.status === 200 &&
    isHtml(a) &&
    [307, 308].includes(b.status) &&
    b.location === canonical
  ) {
    return ok(
      'Workers redirects to the canonical trailing-slash URL instead of serving a duplicate',
    )
  }
  if (
    isRedirect(a) &&
    a.status === b.status &&
    a.location === b.location &&
    only('content-type', 'cache-control', 'access-control-allow-origin')
  ) {
    return ok('same redirect; only headers on the empty redirect body differ')
  }
  if (/^\/404(\.html|\/)?$/.test(path)) {
    return ok(
      'Workers serves dist/404.html at /404 like any other page; unknown URLs still get a 404',
    )
  }
  if (path.startsWith('/_vercel/')) return ok('Vercel Web Analytics removed')
  if (path.startsWith('/_astro/')) {
    if (
      only('cache-control') &&
      b.headers['cache-control'] === 'public, max-age=31536000, immutable'
    ) {
      return ok(
        'hashed file: the zone Browser Cache TTL cut immutable to 4h on Vercel; it does not apply to Workers',
      )
    }
    const onlyRef = a.status === 200 && b.status === 404 && !candLinks.has(path)
    const onlyCand = b.status === 200 && a.status === 404 && !refLinks.has(path)
    if (onlyRef || onlyCand) {
      return ok(
        `hashed name from the ${onlyRef ? 'reference' : 'candidate'} build only; each build links its own copy`,
      )
    }
  }
  if (
    path === '/blog/rss.xml/' &&
    b.status === 301 &&
    b.location === '/blog/rss.xml'
  ) {
    return ok('feed URL with a trailing slash redirects to the feed')
  }
  if (
    a.status === 404 &&
    [301, 308].includes(b.status) &&
    cand[b.location]?.status === 200
  ) {
    return ok('new redirect from a URL that 404s on the reference')
  }
  if (path.startsWith('/og/') && only('body')) {
    return {
      result: 'review',
      reason:
        'OG images drawn with different fonts: Vercel builds used the machine’s own for emoji, this repo bundles one; compare the images',
    }
  }
  return undefined
}

function onWorkersDev() {
  return new URL(candidate).host.endsWith('.workers.dev')
}

/** Paths that a site's own HTML pages link to. */
function linkedFrom(results) {
  return new Set(Object.values(results).flatMap(r => r.links ?? []))
}

function compare(a, b) {
  const diffs = []
  if (a.status !== b.status) diffs.push(`status ${a.status} → ${b.status}`)
  if (a.location !== b.location)
    diffs.push(`location ${a.location ?? '–'} → ${b.location ?? '–'}`)
  for (const h of HEADERS) {
    if (a.headers[h] !== b.headers[h]) {
      diffs.push(`${h} ${a.headers[h] ?? '–'} → ${b.headers[h] ?? '–'}`)
    }
  }
  if (a.status === 200 && b.status === 200) {
    if (a.html || b.html) {
      for (const key of new Set([
        ...Object.keys(a.html ?? {}),
        ...Object.keys(b.html ?? {}),
      ])) {
        const x = JSON.stringify(a.html?.[key])
        const y = JSON.stringify(b.html?.[key])
        if (x !== y) diffs.push(`html ${key} ${x} → ${y}`)
      }
    } else if (a.sha256 !== b.sha256) {
      diffs.push(`body ${a.size} B → ${b.size} B (content differs)`)
    }
  }
  return diffs
}

function summary(r) {
  if (r.location) return `${r.status} → ${r.location}`
  return `${r.status} ${r.headers['content-type'] ?? ''}, ${r.headers['cache-control'] ?? ''}`
}

/** Every file in dist/, each page with and without its trailing slash and index.html, and the edge cases. */
function seedRoutes() {
  const routes = new Set(EDGE_CASES)
  if (!existsSync(DIST)) return routes
  const root = DIST.pathname
  const walk = dir =>
    readdirSync(dir, { withFileTypes: true }).flatMap(e =>
      e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
    )
  for (const file of walk(root)) {
    const path = `/${relative(root, file).split(sep).join('/')}`
    if (path === '/_headers') continue
    if (path === '/_redirects') {
      for (const line of readFileSync(file, 'utf8').split('\n')) {
        const source = line.trim().split(/\s+/)[0]
        if (source?.startsWith('/')) routes.add(source)
      }
      continue
    }
    routes.add(path)
    if (path.endsWith('/index.html')) {
      const dir = path.slice(0, -'index.html'.length)
      routes.add(dir)
      if (dir !== '/') routes.add(dir.slice(0, -1))
    }
  }
  return routes
}

async function sitemapPaths(base) {
  const locs = async url => {
    const res = await fetch(url).catch(() => undefined)
    if (!res?.ok) return []
    return [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      m => m[1],
    )
  }
  const paths = []
  for (const sitemap of await locs(`${base}/sitemap-index.xml`)) {
    for (const loc of await locs(sitemap.replace(LIVE, base))) {
      paths.push(new URL(loc).pathname)
    }
  }
  return paths
}

/** Fetches each route without following redirects, then any same-site links found on HTML pages. */
async function crawl(base, routes, known = {}) {
  const results = {}
  const queue = [...routes].filter(r => !known[r])
  const seen = new Set(queue)
  const worker = async () => {
    for (let path = queue.shift(); path; path = queue.shift()) {
      const result = await probe(base, path)
      results[path] = result
      for (const link of result.links ?? []) {
        if (!seen.has(link) && !known[link]) {
          seen.add(link)
          queue.push(link)
        }
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker))
  return results
}

async function probe(base, path) {
  const res = await fetch(base + path, {
    redirect: 'manual',
    headers: { 'user-agent': 'allenhansen.dev parity check' },
  })
  const body = Buffer.from(await res.arrayBuffer())
  const headers = Object.fromEntries(
    HEADERS.flatMap(h => {
      const v = res.headers.get(h)
      return v === null
        ? []
        : [[h, h === 'content-type' ? v.toLowerCase().replaceAll(' ', '') : v]]
    }),
  )
  const location = res.headers.get('location')
  const result = {
    status: res.status,
    ...(location && { location: sameSite(location, base) }),
    headers,
    size: body.length,
    sha256: createHash('sha256').update(body).digest('hex'),
  }
  if (headers['content-type']?.startsWith('text/')) {
    result.ascii = body.every(byte => byte < 0x80)
  }
  if (headers['content-type']?.startsWith('text/html')) {
    const html = body.toString('utf8')
    result.metaCharsetAt = body.indexOf('<meta charset="utf-8"')
    result.html = signature(html)
    result.links = [...links(html, base)]
  }
  return result
}

/** A location on the same site (either base, or the live domain) as a path, so sites compare. */
function sameSite(href, base) {
  const url = new URL(href, base)
  if (url.origin === new URL(base).origin || url.origin === LIVE) {
    return url.pathname + url.search
  }
  return url.href
}

/** What a page says about itself. Scripts and Cloudflare's email obfuscation are left out: the zone injects them. */
function signature(html) {
  const meta = re => html.match(re)?.[1]
  const text = s =>
    s
      ?.replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  return {
    title: meta(/<title>([^<]*)<\/title>/),
    description: meta(/<meta name="description" content="([^"]*)"/),
    canonical: meta(/<link rel="canonical" href="([^"]*)"/),
    ogImage: meta(/<meta property="og:image" content="([^"]*)"/),
    h1: text(meta(/<h1[^>]*>([\s\S]*?)<\/h1>/)),
    anchors: [
      ...new Set(
        [...html.matchAll(/<a [^>]*href="([^"]+)"/g)]
          .map(m => m[1])
          .filter(h => !h.startsWith('/cdn-cgi/') && !h.startsWith('mailto:')),
      ),
    ].sort(),
  }
}

function links(html, base) {
  const found = new Set()
  const add = href => {
    if (!/^(\/[^/]|\/$|https?:)/.test(href ?? '')) return
    let url
    try {
      url = new URL(href.replaceAll('&amp;', '&'), base)
    } catch {
      return
    }
    if (url.origin !== new URL(base).origin && url.origin !== LIVE) return
    if (url.pathname.startsWith('/cdn-cgi/')) return
    found.add(url.pathname + url.search)
  }
  for (const [, href] of html.matchAll(/\s(?:href|src|content)="([^"]+)"/g))
    add(href)
  for (const [, set] of html.matchAll(/\ssrcset="([^"]+)"/g)) {
    for (const part of set.split(',')) add(part.trim().split(/\s+/)[0])
  }
  for (const [, url] of html.matchAll(/url\((\/[^)'"]+)\)/g)) add(url)
  return found
}

/** Domain-level redirects that live outside the build: apex → www, http → https, and the old blog subdomain. */
async function checkHosts() {
  const checks = [
    {
      url: 'https://allenhansen.dev/blog/hello-world/?from=parity',
      status: [308],
      location: 'https://www.allenhansen.dev/blog/hello-world/?from=parity',
    },
    {
      url: 'https://allenhansen.dev/',
      status: [308],
      location: 'https://www.allenhansen.dev/',
    },
    {
      url: 'http://www.allenhansen.dev/blog/',
      status: [301, 308],
      location: 'https://www.allenhansen.dev/blog/',
    },
    {
      url: 'http://allenhansen.dev/',
      status: [301, 308],
      final: 'https://www.allenhansen.dev/',
    },
    {
      url: 'https://blog.allenhansen.dev/',
      status: [301, 308],
      location: 'https://www.allenhansen.dev/',
    },
    {
      url: 'https://blog.allenhansen.dev/hello-world',
      status: [301, 308],
      location: 'https://www.allenhansen.dev/hello-world',
    },
    { url: 'https://www.allenhansen.dev/', status: [200], hsts: true },
  ]
  let failed = 0
  for (const c of checks) {
    const res = await fetch(c.url, { redirect: 'manual' })
    const location = res.headers.get('location')
    let final
    if (c.final) {
      final = (await fetch(c.url)).url
    }
    const problems = [
      !c.status.includes(res.status) &&
        `status ${res.status}, want ${c.status.join(' or ')}`,
      c.location &&
        location !== c.location &&
        `location ${location}, want ${c.location}`,
      c.final && final !== c.final && `ends at ${final}, want ${c.final}`,
      c.hsts &&
        !res.headers.get('strict-transport-security') &&
        'no Strict-Transport-Security',
    ].filter(Boolean)
    if (problems.length) failed++
    console.log(
      `${problems.length ? 'FAIL' : 'pass'}  ${c.url} → ${res.status} ${location ?? ''}${problems.length ? `  (${problems.join('; ')})` : ''}`,
    )
  }
  return failed ? 1 : 0
}
