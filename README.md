# allenhansen.dev

Allen Hansen's site: notes, projects, an about page, a now page, and a résumé.
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
├── components/          Header, footer, Lights switch, freshness label, change log, …
├── content/blog/        Notes (MDX). The folder keeps its old name so GitCMS keeps working.
├── content/projects/    One JSON file per project card.
├── lib/                 Palette parsing, OG image renderer, icons, note helpers.
├── pages/               Routes. og/, favicon*, site.webmanifest, and robots.txt are generated.
├── site.config.ts       Copy, links, career start date, and note settings.
└── styles/
    ├── palette.css      Every color on the site.
    ├── global.css       Tailwind import and theme tokens.
    └── press.css        The Letterpress components.
```

## Notes

Notes are MDX files in `src/content/blog/<slug>/index.mdx`, served at
`/notes/<slug>/`. Old `/blog/*` URLs redirect to `/notes/*`. Posts with
`draft: true` only show up in `pnpm dev`.

The content schema in `src/content.config.ts` fails the build unless these are
set:

```yaml
title: Auto-Resizing Form Fields
date: 2024-10-15
kind: note # note | story
summary: One line, 160 characters at most.
tags:
  - css # lowercase-with-dashes
```

`updatedDate`, `image`, `draft`, and `log` are optional. To start a new entry,
copy `src/content/blog/_note-template.mdx` (it has the outline: What I was
trying to do, What I learned, Code, Gotchas, Links) or `_story-template.mdx` (no
outline). Files starting with `_` aren't published. The same fields are set up
for GitCMS in `gitcms.md`.

A story shows only when it was written. A note carries a freshness label and a
dated change log:

| Entry                | Reads                                                   |
| :------------------- | :------------------------------------------------------ |
| Story                | Written Nov 19, 2022                                    |
| Checked recently     | Checked Oct 2026                                        |
| Updated or corrected | Updated Oct 2026 (links to the change log)              |
| Not checked lately   | Last checked Oct 2024 · some details may be out of date |

The labels come from the `log`:

```yaml
log:
  - date: 2026-10-12
    kind: checked # published | checked | updated | corrected | tweak
    text: Re-checked browser support; still accurate.
```

Without a `log`, the change log is built from `date` and `updatedDate`. A note
reads "some details may be out of date" once its last check is older than
`notesConfig.recheckMonths` (12) in `src/site.config.ts`.

When something in a note changes, rewrite the text in place so it reads cleanly,
with nothing struck through, and add a dated entry to the top of the `log` that
says what changed. Use `updated` when the world moved on and `corrected` when
the note was wrong:

```yaml
log:
  - date: 2026-10-13
    kind: updated
    text: 'Updated: field-sizing is now Baseline 2026'
```

The "Spot something wrong or outdated?" link opens
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
