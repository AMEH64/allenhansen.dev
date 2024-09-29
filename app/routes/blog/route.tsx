import { json, Outlet, useLoaderData } from '@remix-run/react'
import React from 'react'
import { Layout } from '~/components/layout'
import type { LoaderFunctionArgs } from '@remix-run/router'
import { getPostBySlug } from '~/utils/blog/posts/get-post-by-slug'
import invariant from 'tiny-invariant'

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const slug = url.pathname.split('/').at(-1)
  invariant(slug, 'Invalid blog post slug')
  const post = getPostBySlug(slug)

  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    })
  }

  return json(post)
}

export default function Route() {
  const post = useLoaderData<typeof loader>()

  return (
    <Layout>
      <article>
        <header className="flex flex-col">
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3">{post.description}</p>
          <time
            dateTime={post.publishedOn}
            className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
          >
            <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
            <span className="ml-3">{post.publishedOn}</span>
          </time>
        </header>
        <div className="prose mt-8 dark:prose-invert">
          <Outlet />
        </div>
      </article>
    </Layout>
  )
}
