import { getCollection, type CollectionEntry } from 'astro:content'
import { notesConfig } from '~/site.config'

export type Note = CollectionEntry<'blog'>
export type LogEntry = Note['data']['log'][number]

/** Published notes, newest first. Drafts only show in `astro dev`. */
export async function getNotes() {
  const notes = await getCollection(
    'blog',
    n => !n.data.draft || import.meta.env.DEV,
  )
  return notes.sort((a, b) => b.data.date.localeCompare(a.data.date))
}

/** The change log, newest first. Empty when the note has no `log`. */
export function noteLog(data: Note['data']): LogEntry[] {
  return [...data.log].sort((a, b) => b.date.localeCompare(a.date))
}

export const kindLabel = { note: 'Note', story: 'Story' } as const

/** A prefilled issue from .github/ISSUE_TEMPLATE/note-correction.yml. No `labels=`: GitHub 404s it for visitors who can't apply labels. */
export function reportUrl(title: string, url: string) {
  const query = new URLSearchParams({
    template: 'note-correction.yml',
    title: `Note: ${title}`,
    'note-title': title,
    'note-url': url,
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
