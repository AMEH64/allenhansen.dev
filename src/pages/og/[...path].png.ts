import type { APIRoute, GetStaticPaths } from 'astro'
import { freshness, getNotes } from '~/lib/notes'
import { renderOg, type OgOptions } from '~/lib/og'
import { meta } from '~/site.config'

export const getStaticPaths = (async () => {
  const pages: { path: string; og: OgOptions }[] = [
    {
      path: 'index',
      og: {
        title: 'Allen Hansen',
        eyebrow: 'Notes & projects · Full-stack engineering',
        description:
          'Full-stack engineer. I write down what I learn, and I build small things that each get their own address.',
        pressed: true,
      },
    },
    {
      path: 'notes',
      og: {
        title: 'Notes',
        eyebrow: 'allenhansen.dev / notes',
        description: meta.notes,
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
  for (const note of await getNotes()) {
    pages.push({
      path: `notes/${note.id}`,
      og: {
        title: note.data.title,
        eyebrow: 'allenhansen.dev / notes',
        description: note.data.summary,
        footnote: freshness(note.data).label,
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
