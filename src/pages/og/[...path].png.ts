import type { APIRoute, GetStaticPaths } from 'astro'
import { formatDate } from '~/lib/dates'
import { BLOG, getPosts } from '~/lib/posts'
import { renderOg, type OgOptions } from '~/lib/og'
import { meta } from '~/site.config'

const section = BLOG.slice(1, -1)

export const getStaticPaths = (async () => {
  const pages: { path: string; og: OgOptions }[] = [
    {
      path: 'index',
      og: {
        title: 'Allen Hansen',
        eyebrow: 'Blog & projects · AI & full-stack engineering',
        description:
          'Senior software engineer who likes turning rough ideas into software people enjoy using.',
        pressed: true,
      },
    },
    {
      path: section,
      og: {
        title: 'Blog',
        eyebrow: `allenhansen.dev / ${section}`,
        description: meta.blog,
        pressed: true,
      },
    },
    {
      path: 'projects',
      og: {
        title: 'Projects',
        eyebrow: 'allenhansen.dev / projects',
        description: meta.projects,
        pressed: true,
      },
    },
    {
      path: 'about',
      og: {
        title: 'About',
        eyebrow: 'allenhansen.dev / about',
        description: meta.about,
        pressed: true,
      },
    },
    {
      path: 'now',
      og: {
        title: 'Now',
        eyebrow: 'allenhansen.dev / now',
        description: meta.now,
        pressed: true,
      },
    },
    {
      path: 'resume',
      og: {
        title: 'Résumé',
        eyebrow: 'allenhansen.dev / résumé',
        description: meta.resume,
        pressed: true,
      },
    },
  ]
  for (const note of await getPosts()) {
    pages.push({
      path: `${section}/${note.id}`,
      og: {
        title: note.data.title,
        eyebrow: `allenhansen.dev / ${section}`,
        description: note.data.summary,
        footnote: note.data.updatedDate
          ? `Updated ${formatDate(note.data.updatedDate)}`
          : formatDate(note.data.date),
      },
    })
  }
  return pages.map(({ path, og }) => ({ params: { path }, props: og }))
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props as OgOptions)
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  })
}
