import { getCollection, type CollectionEntry } from 'astro:content'
import { notesConfig } from '~/site.config'
import { formatDate, isoDate, monthsBetween } from './dates'

export type Note = CollectionEntry<'blog'>
export type LogEntry = Note['data']['log'][number]
export type FreshnessState = 'true' | 'updated' | 'due' | 'timeless'

/** Published notes, newest first. Drafts only show in `astro dev`. */
export async function getNotes() {
  const notes = await getCollection(
    'blog',
    n => !n.data.draft || import.meta.env.DEV,
  )
  return notes.sort((a, b) => b.data.pubDate.localeCompare(a.data.pubDate))
}

/** The change log, newest first. Falls back to pubDate and updatedDate when the note has no log. */
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
        { date: data.pubDate, kind: 'published' as const, text: 'Published.' },
      ]
  return log.sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Derives the freshness label from the change log; it's never set by hand.
 * The last check is the newest entry that isn't a wording tweak.
 */
export function freshness(data: Note['data'], today = isoDate()) {
  const log = noteLog(data)
  const last = log.find(e => e.kind !== 'tweak') ?? log[log.length - 1]
  const checked = last.date
  let state: FreshnessState
  let label: string
  if (data.timeless) {
    state = 'timeless'
    label = `Written ${formatDate(data.pubDate, 'month')}`
  } else if (monthsBetween(checked, today) >= notesConfig.recheckMonths) {
    state = 'due'
    label = 'Due for a re-check'
  } else if (last.kind === 'updated' || last.kind === 'corrected') {
    state = 'updated'
    label = `Updated ${formatDate(checked, 'short')}`
  } else {
    state = 'true'
    label = `Still true · checked ${formatDate(checked, 'short')}`
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

export function readingMinutes(body = '') {
  const words = body
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 230))
}
