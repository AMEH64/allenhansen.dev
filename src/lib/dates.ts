type Style = 'long' | 'short' | 'month'

const formats: Record<Style, Intl.DateTimeFormatOptions> = {
  long: { month: 'short', day: 'numeric', year: 'numeric' },
  short: { month: 'short', day: 'numeric' },
  month: { month: 'short', year: 'numeric' },
}

/** Formats a YYYY-MM-DD date: "Oct 8, 2026" (long), "Oct 8" (short), or "Oct 2026" (month). */
export function formatDate(iso: string, style: Style = 'long') {
  return new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-US', {
    ...formats[style],
    timeZone: 'UTC',
  })
}
