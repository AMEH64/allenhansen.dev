/**
 * Build-time feature flags. A page that's off isn't built: every link to it is
 * hidden, it drops out of the sitemap and OG images, and its old URL redirects
 * home (see src/lib/flagged-pages.ts). Turning a flag back on restores all of it.
 */

/** Which version of a page's copy to render: the copy as it was, or the draft. */
export type Copy = 'old' | 'new'

type Features = {
  about: boolean
  now: boolean
  /** src/copy/about-old.astro or src/copy/about-new.astro */
  aboutCopy: Copy
  /** src/copy/now-old.astro or src/copy/now-new.astro, plus the Now lines in site.config.ts */
  nowCopy: Copy
}

export const features: Features = {
  about: false,
  now: false,
  aboutCopy: 'new',
  nowCopy: 'new',
}
