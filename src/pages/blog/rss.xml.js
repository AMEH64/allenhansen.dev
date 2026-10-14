import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE } from '../../consts'
import { meta } from '../../site.config'
import { postPath } from '../../lib/posts'

export async function GET(context) {
  const notes = (await getCollection('blog', n => !n.data.draft)).sort((a, b) =>
    b.data.date.localeCompare(a.data.date),
  )
  return rss({
    title: `${SITE_TITLE}: Blog`,
    description: meta.blog,
    site: context.site,
    items: notes.map(note => ({
      title: note.data.title,
      description: note.data.summary,
      pubDate: new Date(note.data.date),
      categories: note.data.tags,
      link: postPath(note.id),
    })),
  })
}
