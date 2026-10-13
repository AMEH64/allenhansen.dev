import { getCollection, type CollectionEntry } from 'astro:content'
import { notesConfig } from '~/site.config'
import { formatDate, isoDate, monthsBetween } from './dates'

export type Note = CollectionEntry<'blog'>
export type LogEntry = Note['data']['log'][number]
export type FreshnessState = 'checked' | 'updated' | 'stale' | 'story'

/** Published notes, newest first. Drafts only show in `astro dev`. */
export async function getNotes() {
  const notes = await getCollection(
    'blog',
    n => !n.data.draft || import.meta.env.DEV,
  )
  return notes.sort((a, b) => b.data.date.localeCompare(a.data.date))
}

/** The change log, newest first. Falls back to date and updatedDate when the note has no log. */
export function noteLog(data: Note['data']): LogEntry[] {
  const log: LogEntry[] = data.log.length
    ? [...data.log]
    : [
        ...(data.updatedDate
          ? [
              {
                date: data.updatedDate,
                kind: 'updated' as const,
                text: 'Updated.',
              },
            ]
          : []),
        { date: data.date, kind: 'published' as const, text: 'Published.' },
      ]
  return log.sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Derives the freshness label from the change log; it's never set by hand.
 * The last check is the newest entry that isn't a wording tweak. Stories get no freshness
 * label, just "Written {date}".
 */
export function freshness(data: Note['data'], today = isoDate()) {
  const log = noteLog(data)
  const last = log.find(e => e.kind !== 'tweak') ?? log[log.length - 1]
  const checked = last.date
  const month = formatDate(checked, 'month')
  let state: FreshnessState
  let label: string
  if (data.kind === 'story') {
    state = 'story'
    label = `Written ${formatDate(data.date)}`
  } else if (monthsBetween(checked, today) >= notesConfig.recheckMonths) {
    state = 'stale'
    label = `Last checked ${month} · some details may be out of date`
  } else if (last.kind === 'updated' || last.kind === 'corrected') {
    state = 'updated'
    label = `Updated ${month}`
  } else {
    state = 'checked'
    label = `Checked ${month}`
  }
  return { state, label, checked }
}

/** A prefilled issue from .github/ISSUE_TEMPLATE/note-correction.yml. No `labels=`: GitHub 404s it for visitors who can't apply labels. */
export function reportUrl(title: string, url: string, lastChecked: string) {
  const query = new URLSearchParams({
    template: 'note-correction.yml',
    title: `Note: ${title}`,
    'note-title': title,
    'note-url': url,
    'last-checked': lastChecked,
  })
  return `https://github.com/${notesConfig.repo}/issues/new?${query}`
}

/** Where a change-log entry links: its commit when it names one, else the note file's history. */
export function changeUrl(entry: LogEntry, filePath?: string) {
  const base = `https://github.com/${notesConfig.repo}`
  if (entry.commit) return `${base}/commit/${entry.commit}`
  return filePath
    ? `${base}/commits/${notesConfig.branch}/${filePath}`
    : undefined
}

export function readingMinutes(body = '') {
  const words = body
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 230))
}
