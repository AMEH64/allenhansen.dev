# allenhansen.dev

Allen Hansen's site: a blog, projects, and a résumé, plus About and Now pages
that stay behind [feature flags](#feature-flags) until their copy is final.
Built with [Astro](https://astro.build), MDX, and Tailwind CSS 4, and served as
static files from [Cloudflare Workers](#deploying).

The design is "Letterpress": one spot ink (ultramarine) on a paper stock, with
debossed display type and a "Lights" switch. It's dark first, with a full light
mode, and it prints in light ink on white paper.

## Commands

Run these from the project root:

| Command               | Action                                                              |
| :-------------------- | :------------------------------------------------------------------ |
| `pnpm install`        | Install dependencies                                                |
| `pnpm dev`            | Start the dev server at `localhost:4321`                            |
| `pnpm build`          | Check contrast, type-check, and build the site to `./dist/`         |
| `pnpm preview`        | Build, then serve `./dist/` with `wrangler dev` as Cloudflare would |
| `pnpm run deploy`     | Build, then deploy to the production Worker                         |
| `pnpm check:contrast` | Check that the palette meets WCAG AA on both stocks                 |
| `pnpm check:parity`   | Compare a deployment's routes and headers with the live site        |
| `pnpm format`         | Format everything with Prettier                                     |

## Where things live

```text
src/
├── assets/fonts/        Self-hosted, subset variable fonts (OFL). og/ holds TTF copies and an emoji font for OG images.
├── components/          Header, footer, Lights switch, change log, …
├── config/features.ts   Build-time feature flags.
├── content/blog/        Blog posts (MDX): notes and stories.
├── content/projects/    One JSON file per project card.
├── copy/                Old and new copy for About and Now.
├── flagged-pages/       Pages that are only built while their flag is on: About and Now.
├── lib/                 Palette parsing, OG image renderer, icons, note helpers, flagged pages.
├── pages/               Routes. og/, icons/, favicon.ico, site.webmanifest, and robots.txt are generated.
├── site.config.ts       Copy, links, career start date, and note settings.
└── styles/
    ├── palette.css      Every color on the site.
    ├── global.css       Tailwind import, theme tokens, and variants.
    ├── press.css        What classes can't say: the lamp, paper, pressed type, and post bodies.
    └── about-now.css    About and Now page styles, until those pages leave their flags.
```

## Feature flags

`src/config/features.ts` holds build-time flags. Today they keep About and Now
offline until their copy is final:

| Flag        | Default | What it does                                                                                                                                 |
| :---------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `about`     | `false` | Builds `/about/` and shows every link to it                                                                                                  |
| `now`       | `false` | Builds `/now/`, shows every link to it, and shows the home "Now" line                                                                        |
| `aboutCopy` | `'new'` | `'old'` or `'new'`: picks `src/copy/about-old.astro` or `about-new.astro`                                                                    |
| `nowCopy`   | `'new'` | `'old'` or `'new'`: picks `src/copy/now-old.astro` or `now-new.astro`, plus the home "Now" line and the page description in `site.config.ts` |

While a page is off:

- **It isn't built.** The page lives in `src/flagged-pages/`, not `src/pages/`,
  and `src/lib/flagged-pages.ts` only adds the route while its flag is on.
- **Its links are hidden:** the header nav (which is also the phone menu), the
  home "Now" line, the 404 page's links, and the Now page's "See the about page"
  link.
- **It's not in the sitemap or OG images.**
- **Its URL redirects home** with a temporary 302, for `/about` and `/about/`
  alike, because the old site served both pages and links to them are out there.
  The build writes these to `dist/_redirects` (see
  `src/lib/static-redirects.ts`).

To publish a page, set its flag to `true` and build. Everything comes back as it
was. The new copy has its open questions as code comments next to the text; they
don't render.

## Blog

Posts are MDX files in `src/content/blog/<slug>/index.mdx`, served at
`/blog/<slug>/`. Links to the section come from `BLOG` in `src/lib/posts.ts`; if
the section is ever renamed, change it there and move `src/pages/blog/`. Posts
with `draft: true` only show up in `pnpm dev`.

The content schema in `src/content.config.ts` fails the build unless these are
set:

```yaml
title: Auto-Resizing Form Fields
date: 2024-10-15
type: note # note | story
summary: One line, 160 characters at most.
tags:
  - css # lowercase-with-dashes
```

`updatedDate`, `image`, `draft`, `log`, and `supersededBy` are optional. To
start a new entry, copy `src/content/blog/_note-template.mdx` (it has the
outline: What I was trying to do, What I learned, Code, Gotchas, Links) or
`_story-template.mdx` (no outline). Files starting with `_` aren't published.

Notes and stories look and behave the same; `type` is only a small label on the
list and the post. The top of a post shows when it was published, plus "Updated
{date}" when `updatedDate` is set. The foot shows the change log when the post
has a `log`, then "See something wrong or out of date? Open an issue →".

### Tags

Every post needs 1 to 4 topic tags. Tags are lowercase-with-dashes and name a
topic, like `css` or `productivity`, not a kind of post (that's `type`) or a
mood. Reuse an existing tag before adding one, and keep one spelling: `forms`,
not `form` or `html-forms`. The build fails on a missing, repeated, or fifth
tag. Current tags:

| Tag            | Posts                     |
| :------------- | :------------------------ |
| `blogging`     | Hello World               |
| `css`          | Auto-Resizing Form Fields |
| `forms`        | Auto-Resizing Form Fields |
| `productivity` | Hello World               |

### Filtering

`/blog/` filters from the URL, so a filtered view is a shareable link:
`/blog/?type=story`, `/blog/?tag=css&tag=forms`, or both. A post shows when it
matches the type and any of the selected tags.

- The All, Notes, and Stories pills pick the type and keep the selected tags.
- The tag bar under the pills lists every tag with its post count. It's
  generated at build from the posts. Each tag toggles itself in the URL and
  shows as pressed (`aria-pressed`) while selected.
- Tag links on posts and in the list go to `/blog/?tag=…` for that one tag.
- "Clear" appears whenever a filter is active. The count next to it is announced
  to screen readers.

The inline script in `src/components/blog-filter.astro` reads the params on load
and on back or forward, and hides posts and years that don't match. It only
changes text and colors in the filter bar, never its size, so a filtered link
doesn't move the page. Without JS every post shows and every filter is a plain
link.

### Blog filter performance

`/blog/` renders every post and filters in the browser. To see how far that
holds, `/blog/` was built with synthetic posts. They used the real row markup
and filter script, were 70% notes, and had 1 to 4 of 24 tags each. Lighthouse 12
ran on mobile with default throttling (median of 3 runs). Clicks are 16 filter
clicks per size, timed from the click to the next frame (median / slowest), in
Chromium at normal speed and at 4x CPU slowdown, which is roughly a mid-range
phone.

| Posts | HTML (gzip) | Perf, mobile (filtered link) |    TBT | CLS, filtered link |   LCP |        Click |  Click, 4x CPU |
| ----: | ----------: | :--------------------------- | -----: | -----------------: | ----: | -----------: | -------------: |
|     2 |      5.5 KB | 100 (100)                    |   0 ms |                  0 | 1.6 s |   14 / 18 ms |      9 / 17 ms |
|    50 |     10.2 KB | 100 (100)                    |   0 ms |                  0 | 1.6 s |   13 / 19 ms |     25 / 38 ms |
|   250 |     24.5 KB | 100 (100)                    |   0 ms |                  0 | 1.7 s |   17 / 30 ms |    73 / 155 ms |
|   500 |     41.9 KB | 100 (100)                    |   0 ms |                  0 | 1.7 s |   27 / 68 ms |   105 / 279 ms |
| 1,000 |     76.6 KB | 99 (77)                      |   0 ms |               0.53 | 2.0 s |  47 / 100 ms |   205 / 476 ms |
| 2,000 |      144 KB | 91 (69)                      | 278 ms |               0.53 | 2.3 s | 114 / 391 ms |   380 / 987 ms |
| 5,000 |      343 KB | 66 (44)                      | 928 ms |               0.53 | 3.4 s | 245 / 527 ms | 1053 / 3021 ms |

Desktop Lighthouse scores 100 at every size. The unfiltered list never shifts
layout. Almost all of the click time is the browser laying out rows it shows or
hides, not the script: at 500 posts on a 4x slower CPU, the handler takes 12 ms
and the next frame lands at 105 ms. The synthetic text reuses a small
vocabulary, so it compresses better than real writing. The raw page is 3.3 MB at
5,000 posts.

The static list is comfortable up to about 250 posts. Around 500, the slowest
clicks on a slow phone pass 200 ms, Google's limit for a "good" interaction
(INP). Around 1,000, a filtered link shifts the layout on load, because the
browser paints part of the list before the script at the end of it runs. Revisit
at 300 to 500 posts and move off the static list before 1,000. At the current
pace, that's years away.

Options for later, none built:

- **Hide the list until filtered.** A stopgap near 1,000 posts: when the URL has
  filters, keep the list hidden until the script has run, which removes the
  layout shift. Clicks stay as slow as in the table.
- **Pagination.** Render the newest 50 or so posts, with older ones on
  `/blog/page/2/` and so on. The page stays small, but filters need one of the
  next two options to reach older posts.
- **A prebuilt JSON index.** The build writes `/blog/index.json` (title, date,
  type, tags, summary). The page ships the newest posts as HTML and renders
  filtered results from the index. URLs stay shareable, and without JS the list
  falls back to pagination.
- **Worker SSR with CDN caching.** Render `/blog/?type=…&tag=…` on the server
  and cache each normalized query at the edge. Pages are smallest, nothing
  filters in the browser, and it works without JS. It's the only option that
  needs a server runtime; the site is static today.

When something in a note changes, rewrite the text in place so it reads cleanly,
with nothing struck through, and add a dated entry to the top of the `log` that
says what changed. Use `updated` when the world moved on and `corrected` when
the note was wrong:

```yaml
log:
  - date: 2026-10-13
    kind: updated # published | updated | corrected | tweak
    text: 'Updated: field-sizing is now Baseline 2026'
```

Each entry links to the note file's history on GitHub
(`github.com/AMEH64/allenhansen.dev/commits/main/<path>`), so readers can see
the diff and you don't need a commit hash when you write the entry. To link one
entry straight to its commit, add `commit: <sha>` to it.

When a newer note replaces an older approach, leave the old note as it was, set
`supersededBy` to the newer note's slug, and log it. The old note then opens
with "There's a newer way to do this → <newer note's title>". The build fails if
the slug isn't a note.

```yaml
supersededBy: css-field-sizing
log:
  - date: 2026-10-13
    kind: updated
    text: 'Updated: field-sizing replaces this approach'
```

The "See something wrong or out of date?" link opens
`.github/ISSUE_TEMPLATE/note-correction.yml`. That template adds the
`note-correction` label, which has to exist in the GitHub repository.

## Changing the brand color

The ink color is defined once, as `--brand` in `src/styles/palette.css`:

```css
--brand: light-dark(#2b3fd0, #9daeff);
/*               light stock  dark stock */
```

To change it:

1. Edit both hex values on that line. Keep the `light-dark(#…, #…)` form on one
   line, because the build reads it.
2. Run `pnpm check:contrast`. The brand color must reach at least 4.5:1 (WCAG
   AA) on the light and dark paper, the surface, and the code background. The
   light value usually needs to be darker than you'd pick by eye, and the dark
   value lighter.
3. Run `pnpm dev` and check both stocks with the Lights switch.

Everything else follows automatically:

- Links, focus rings, the wordmark square, rules, list markers, status accents,
  and the photo tint use `var(--brand)` or a `color-mix()` of it.
- The favicon (SVG, PNG, and ICO), the web manifest, `theme-color`, and the OG
  images are generated at build time from the same line through
  `src/lib/palette.ts`.

The icon is the header's ink square on a tile of paper (`src/lib/icons.ts`). The
SVG favicon follows the browser's light or dark mode. The ICO and PNGs can't, so
they use the dark paper. Icon URLs end in `?v=` plus a hash of the icons, so a
change gets a new URL. Browsers still cache favicons hard: after a change, a
hard refresh or a new tab may be needed to see it.

`pnpm build` runs the contrast check first, so a color that fails AA stops the
build (and the deploy) with a message naming the failing pair. The same applies
to `--paper`, `--text`, `--muted`, `--surface`, and `--press`.

## Tailwind theme tokens

`src/styles/global.css` exposes the palette to Tailwind 4 through
`@theme inline`. Each token points at a palette variable, so classes like
`text-brand`, `bg-paper`, and `border-rule` switch with the Lights setting.
Change colors in `palette.css`, not in the tokens.

| Token                     | Value                    | Example class          |
| :------------------------ | :----------------------- | :--------------------- |
| `--color-brand`           | `var(--brand)`           | `text-brand`           |
| `--color-brand-wash`      | `var(--brand-wash)`      | `bg-brand-wash`        |
| `--color-paper`           | `var(--paper)`           | `bg-paper`             |
| `--color-text`            | `var(--text)`            | `text-text`            |
| `--color-muted`           | `var(--muted)`           | `text-muted`           |
| `--color-rule`            | `var(--rule)`            | `border-rule`          |
| `--color-press`           | `var(--press)`           | `bg-press`             |
| `--color-surface`         | `var(--surface)`         | `bg-surface`           |
| `--color-code-bg`         | `var(--code-bg)`         | `bg-code-bg`           |
| `--color-groove-sh`       | `var(--groove-sh)`       | `border-groove-sh`     |
| `--color-groove-hi`       | `var(--groove-hi)`       | `border-groove-hi`     |
| `--color-status-active`   | `var(--status-active)`   | `text-status-active`   |
| `--color-status-paused`   | `var(--status-paused)`   | `text-status-paused`   |
| `--color-status-archived` | `var(--status-archived)` | `text-status-archived` |

Fonts are tokens too: `font-display` (Anybody), `font-sans` (Atkinson
Hyperlegible Next), and `font-mono` (Atkinson Hyperlegible Mono).

### Styling with classes

Style markup with Tailwind classes. The design is drawn in px on a 17px root
(16px on phones), so a few defaults are different:

- **One spacing step is exactly 4px**, so `p-4` is 16px at every breakpoint
  (Tailwind's 0.25rem would be 4.25px on the 17px root). Write values off the
  scale as arbitrary values, like `p-[26px]`, and rem as `px-[1rem]`. Type sizes
  are arbitrary values too: `text-[14.5px]`.
- **`rounded-xs` is 2px**, the site's one corner radius.
- **`phone:`** is the one breakpoint, `max-width: 760px`. The layout is
  desktop-first, so write the desktop style and add `phone:` overrides.
- **`light:`** and **`dark:`** follow the Lights switch.
- **`print:` comes before `phone:`** in the output, and a printed page is
  phone-width, so a `print:` class that overrides a `phone:` one needs `!`, like
  `print:text-[30pt]!`.

`src/styles/press.css` keeps what classes can't say, as custom utilities you use
like any other class. It's plain CSS that reads the theme variables
(`var(--color-brand)`, `calc(var(--spacing) * 4)`, `var(--radius-xs)`) wherever
one has the exact value, and uses `@variant phone` for the breakpoint. Don't use
`@apply`.

| Class               | What it is                                                 |
| :------------------ | :--------------------------------------------------------- |
| `deboss`            | Type pressed blind into the stock, lit by the lamp         |
| `inked`             | Type printed in ink, still catching the lamp (page titles) |
| `relief`            | A lighter impression (post titles)                         |
| `glow`              | The lamp                                                   |
| `paper-layers`      | The paper fiber, lit from the lamp's side                  |
| `rule`              | The pressed groove under headings, rows, and the page      |
| `tag-hash`          | The `#` before a tag, which screen readers skip            |
| `registration-mark` | The footer's registration mark                             |

Each type effect prints flat in the text color with more contrast, forced
colors, or on paper. Post bodies (`.prose`) stay in CSS too, because MDX content
can't carry classes. Class lists that repeat across components live in
`src/lib/classes.ts`.

## Fonts

Anybody and Atkinson Hyperlegible (Next and Mono) are self-hosted through
Astro's Fonts API. They're subset to Latin plus Hawaiian (ʻokina and kahakō),
preloaded, and paired with size-matched fallbacks. Both are under the SIL Open
Font License; see `src/assets/fonts/`.

OG images are drawn at build time from TTF copies in `src/assets/fonts/og/`,
plus Noto Color Emoji (also OFL) for emoji in titles. `og/fonts.conf` keeps the
build machine's own fonts out, so every machine draws the same images.

## Deploying

The site is static: `pnpm build` writes everything to `dist/`, and a Cloudflare
Worker with
[static assets](https://developers.cloudflare.com/workers/static-assets/) serves
it. There's no Worker script. `wrangler.jsonc` holds the settings, and two files
in `dist/` add the rest:

- `_headers`, from `public/_headers`: HSTS, CORS, a year of caching for hashed
  `/_astro/` files, four hours for icons, OG images, and `robots.txt`, and
  `noindex` on the `workers.dev` URL.
- `_redirects`, from `public/_redirects` plus the redirects in
  `astro.config.mjs` and the [feature flags](#feature-flags).

Pages live at their trailing-slash URL (`/blog/hello-world/`); the bare URL
redirects there. Unknown URLs get the 404 page with a 404 status.

`www.allenhansen.dev` is a
[Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
listed under `routes` in `wrangler.jsonc`. Each deploy makes the Worker's
domains and routes match that list, so add new ones there, not in the dashboard.
Redirect rules on the zone send the apex and `http://` to
`https://www.allenhansen.dev`.

`wrangler.jsonc` also sets `build.command` (`pnpm build`), which Wrangler runs
before `wrangler deploy`, `wrangler preview`, `wrangler versions upload`, and
`wrangler dev`. So `dist/` is always fresh. `wrangler dev` watches only `src/`
and `public/`, so the build's own output doesn't start another build.

[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
deploys the site: the GitHub repository is connected to the `allenhansen-dev`
Worker, so no API token or GitHub secret is involved.

- **Pushes to the production branch** (`main`) deploy to production, which also
  answers at `https://allenhansen-dev.ameh64.workers.dev`.
- **Pushes to any other branch** create or update a
  [Preview](https://developers.cloudflare.com/workers/previews/) for that
  branch, and Cloudflare comments the Preview URL on its pull request. Preview
  URLs are public and `noindex`.

The Worker's **Settings → Build**:

| Setting         | Value                                                          |
| :-------------- | :------------------------------------------------------------- |
| Worker name     | `allenhansen-dev`, which must match `name` in `wrangler.jsonc` |
| Root directory  | `/` (the repository root)                                      |
| Build command   | leave empty; Wrangler runs `pnpm build` itself                 |
| Deploy command  | `pnpm exec wrangler deploy`                                    |
| Preview command | `pnpm exec wrangler preview`                                   |
| Build variables | none needed                                                    |

A dashboard build command of `pnpm run build` also works; the site is then just
built twice. The build image reads Node from `.nvmrc` (22.22.2), and pnpm
switches itself to the version in `packageManager`. `pnpm-workspace.yaml` allows
install scripts for esbuild, sharp, and workerd only. Nothing downloads a
browser.

From your machine, after `pnpm wrangler login`:

```sh
pnpm preview       # build, then serve dist/ on :8787 as Cloudflare would
pnpm run deploy    # build, then deploy to production
```

`.github/workflows/ci.yml` runs `pnpm build` (the contrast check, `astro check`,
and the build) on every pull request and every push to `main`. It doesn't
deploy.

To check a deployment against the live site, build first so the check knows
every route, then run:

```sh
pnpm check:parity https://allenhansen-dev.ameh64.workers.dev
pnpm check:parity --hosts   # apex → www and http → https redirects
```

It exits 1 on any difference it doesn't recognize as a platform change, and
`--report <file.md>` writes the full table. Before changing where the live site
is served from, save a snapshot with `--save <file.json>` and compare with
`--reference <file.json>` afterward.
