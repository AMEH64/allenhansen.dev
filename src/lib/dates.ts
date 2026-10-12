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

/** Whole months from `from` to `to`, both YYYY-MM-DD. */
export function monthsBetween(from: string, to: string) {
  const [fy, fm, fd] = from.split('-').map(Number)
  const [ty, tm, td] = to.split('-').map(Number)
  return (ty - fy) * 12 + (tm - fm) - (td < fd ? 1 : 0)
}

export function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10)
}
