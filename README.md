# allenhansen.dev

Allen Hansen's site: a blog, projects, an about page, a now page, and a résumé.
Built with [Astro](https://astro.build), MDX, and Tailwind CSS 4, deployed on
Vercel.

The design is "Letterpress": one spot ink (ultramarine) on a paper stock, with
debossed display type and a "Lights" switch. It's dark first, with a full light
mode, and it prints in light ink on white paper.

## Commands

Run these from the project root:

| Command               | Action                                                      |
| :-------------------- | :---------------------------------------------------------- |
| `pnpm install`        | Install dependencies                                        |
| `pnpm dev`            | Start the dev server at `localhost:4321`                    |
| `pnpm build`          | Check contrast, type-check, and build the site to `./dist/` |
| `pnpm preview`        | Preview the build locally                                   |
| `pnpm check:contrast` | Check that the palette meets WCAG AA on both stocks         |
| `pnpm format`         | Format everything with Prettier                             |

## Where things live

```text
src/
├── assets/fonts/        Self-hosted, subset variable fonts (OFL). og/ holds TTF copies for OG images.
├── components/          Header, footer, Lights switch, change log, …
├── content/blog/        Blog posts (MDX): notes and stories.
├── content/projects/    One JSON file per project card.
├── lib/                 Palette parsing, OG image renderer, icons, note helpers.
├── pages/               Routes. og/, icons/, favicon.ico, site.webmanifest, and robots.txt are generated.
├── site.config.ts       Copy, links, career start date, and note settings.
└── styles/
    ├── palette.css      Every color on the site.
    ├── global.css       Tailwind import and theme tokens.
    └── press.css        The Letterpress components.
```

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
build (and the Vercel deploy) with a message naming the failing pair. The same
applies to `--paper`, `--text`, `--muted`, `--surface`, and `--press`.

## Tailwind theme tokens

`src/styles/global.css` exposes the palette to Tailwind 4 through
`@theme inline`. Each token points at a palette variable, so classes like
`text-brand`, `bg-paper`, and `border-rule` switch with the Lights setting.
Change colors in `palette.css`, not in the tokens.

| Token                     | Value                    | Example class          |
| :------------------------ | :----------------------- | :--------------------- |
| `--color-brand`           | `var(--brand)`           | `text-brand`           |
| `--color-paper`           | `var(--paper)`           | `bg-paper`             |
| `--color-text`            | `var(--text)`            | `text-text`            |
| `--color-muted`           | `var(--muted)`           | `text-muted`           |
| `--color-rule`            | `var(--rule)`            | `border-rule`          |
| `--color-press`           | `var(--press)`           | `bg-press`             |
| `--color-surface`         | `var(--surface)`         | `bg-surface`           |
| `--color-status-active`   | `var(--status-active)`   | `text-status-active`   |
| `--color-status-paused`   | `var(--status-paused)`   | `text-status-paused`   |
| `--color-status-archived` | `var(--status-archived)` | `text-status-archived` |

Fonts are tokens too: `font-display` (Anybody), `font-sans` (Atkinson
Hyperlegible Next), and `font-mono` (Atkinson Hyperlegible Mono).

## Fonts

Anybody and Atkinson Hyperlegible (Next and Mono) are self-hosted through
Astro's Fonts API. They're subset to Latin plus Hawaiian (ʻokina and kahakō),
preloaded, and paired with size-matched fallbacks. Both are under the SIL Open
Font License; see `src/assets/fonts/`.
