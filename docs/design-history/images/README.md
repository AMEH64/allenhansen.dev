# Images

[Design history](../README.md)

Every screenshot shared during the redesign, grouped by stage. Each folder has
an `index.md` with a caption for every image. These files are reference material
only. They live outside `src/` and `public/`, so the site build never includes
them.

| Folder                                                      | Stage                                                           | Images |
| :---------------------------------------------------------- | :-------------------------------------------------------------- | -----: |
| [01-site-history](01-site-history/index.md)                 | Earlier versions of the site, 2018 to 2025                      |     11 |
| [02-pre-redesign-site](02-pre-redesign-site/index.md)       | The site before the redesign (v5.3.0), as audited in round 1    |     10 |
| [03-round-1-brief](03-round-1-brief/index.md)               | Round 1 brand directions                                        |      3 |
| [04-round-2-magazine](04-round-2-magazine/index.md)         | Round 2 home-page mockups and the Verso reference               |      5 |
| [05-round-3-concepts](05-round-3-concepts/index.md)         | Round 3's six interaction-led concepts                          |      9 |
| [06-round-4-raking-light](06-round-4-raking-light/index.md) | Round 4's four Raking Light variations, comparisons, and QA     |    132 |
| [07-round-5-letterpress](07-round-5-letterpress/index.md)   | Round 5's two options, photo and toggle studies, and dark stock |     51 |
| [08-build](08-build/index.md)                               | Building Letterpress in #136, and the follow-up PRs             |     85 |
| [09-about-now](09-about-now/index.md)                       | Publishing About and Now in #151                                |     17 |
| [10-releases](10-releases/index.md)                         | Release screenshots for every version from v1.0.0 to v6.0.0     |    125 |

The counts are files stored in each folder. 35 more screenshots were
byte-identical to one stored elsewhere, so each is listed in its folder's index
with a link to the stored copy instead of being saved twice.

## How the files were prepared

The originals were PNG and JPEG captures. Each was converted to WebP with its
metadata stripped. Most were scaled to fit within 1600 pixels on the long edge.
Full-page captures that are much taller than they are wide kept their full
height so the text stays readable, and were scaled by width instead, to 1000
pixels for desktop pages and 600 for phone pages. The indexes link those tall
captures instead of showing them inline.

## What was left out or edited

The original photo shoot isn't here. None of those twelve photos were on the
live site when this was written, and the photos on About and Now come from #151,
whose screenshots are in [09-about-now](09-about-now/index.md). A round 1 crop
plan made from the same shoot is left out for the same reason.

A screenshot of a coworker's personal site, which was a reference in round 2, is
left out because it isn't Allen's site.

In 77 prototype and build screenshots, lines of draft copy are blurred. They
held personal details that were written for the mockups but never went on the
site. Each affected image says so in its caption. The text that later shipped,
such as the Verso project card, is left as it is.

In [08-build/favicon-audit.webp](08-build/favicon-audit.webp), the hostname of a
Workers preview deployment is removed.

Interaction videos and PDF exports aren't included because they aren't images.
Where a video had a contact sheet of frames, the sheet is here.
