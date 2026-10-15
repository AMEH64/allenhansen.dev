// Class lists shared by markup in more than one component.

/** A list row with a pressed groove under it. Add the grid columns where it's used. */
export const row =
  'relative grid items-baseline gap-20 py-16 after:absolute after:inset-x-0 after:bottom-0 after:rule phone:gap-4'
export const rowTitle =
  'text-[18px] leading-[1.35] font-[520] no-underline hover:underline hover:decoration-brand hover:decoration-auto'
export const rowDesc = 'mt-3 block text-[14.5px] leading-[1.5] text-muted'

/** The note or story label, the same on the list and the post. */
export const postType =
  'font-mono text-[11px] tracking-[0.1em] text-brand uppercase'

/** A project's status: Active, Paused, or Archived. */
export const status = {
  base: 'inline-flex items-center rounded-xs border-[1.5px] border-current px-8 py-3 font-mono text-[12px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase',
  active: 'text-status-active',
  paused: 'text-status-paused',
  archived: 'border-dashed text-status-archived',
} as const

/** A note set off from the text, with an ink edge. Add the edge width: border-l-3. */
export const callout =
  'rounded-xs border border-rule border-l-brand px-18 py-14 text-[16px] leading-[1.6]'
