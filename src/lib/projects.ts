import { getCollection, type CollectionEntry } from 'astro:content'

type Status = CollectionEntry<'projects'>['data']['status']

export const statusLabel: Record<Status, string> = {
  active: 'Active',
  paused: 'Paused',
  tinkering: 'Tinkering',
  idea: 'Idea',
  archived: 'Archived',
}

export async function getProjects() {
  const projects = await getCollection('projects')
  return projects.sort((a, b) => a.data.order - b.data.order)
}

/** "https://verso.allenhansen.dev/" -> "verso.allenhansen.dev" */
export function displayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}
