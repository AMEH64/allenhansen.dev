import { Outlet, useMatches } from '@remix-run/react'
import React from 'react'
import { Layout } from '~/components/layout'
import { intlFormat } from 'date-fns/intlFormat'
import { postMetaSchema } from '~/types/blog/post-meta'

export default function Route() {
  const matches = useMatches()

  const postMeta = postMetaSchema.parse(
    matches
      .filter(m => m.handle)
      .map(m => m.handle)
      .at(0),
  )

  return (
    <Layout>
      <article>
        <header className="flex flex-col">
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {postMeta.title}
          </h1>
          <p className="mt-3">{postMeta.description}</p>
          <time
            dateTime={postMeta.publishedOn}
            className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
          >
            <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
            <span className="ml-3">{intlFormat(postMeta.publishedOn)}</span>
          </time>
        </header>
        <div className="prose mt-8 dark:prose-invert">
          <Outlet />
        </div>
      </article>
    </Layout>
  )
}
