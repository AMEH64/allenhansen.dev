import React from 'react'
import { Layout } from '~/components/layout'
import { allPosts } from '~/utils/blog/posts/all-posts'
import { compareDesc } from 'date-fns/compareDesc'
import { json, Link, useLoaderData } from '@remix-run/react'
import { intlFormat } from 'date-fns/intlFormat'
import { ChevronRightIcon, RssIcon } from '@heroicons/react/16/solid'
import { Button } from '~/components/ui/button'

export const loader = () => {
  const posts = Object.entries(allPosts)
    .sort(([, p1], [, p2]) => compareDesc(p1.publishedOn, p2.publishedOn))
    .map(([slug, post]) => ({ slug, ...post }))
  return json(posts)
}

export default function Route() {
  const posts = useLoaderData<typeof loader>()

  return (
    <Layout>
      <div className="flex w-full flex-col items-center justify-center">
        <header className="w-full max-w-prose self-start">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Notes from a full stack developer.
          </h1>
          <p className="mt-6 text-pretty text-base text-zinc-600 dark:text-zinc-400">
            All of my thoughts on programming, life, and more, collected in
            reverse chronological order.
          </p>
          <Button className="mt-3" to="./rss.xml" outline reloadDocument>
            <RssIcon /> RSS Feed
          </Button>
        </header>
        <div className="mt-16 flex w-full flex-col space-y-16 md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          {posts.map(post => (
            <article
              className="md:grid md:grid-cols-4 md:items-baseline"
              key={post.slug}
            >
              <div className="group relative flex flex-col items-start md:col-span-3">
                <h2 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                  <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800/50"></div>
                  <Link to={`./${post.slug}`}>
                    <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
                    <span className="relative z-10">{post.title}</span>
                  </Link>
                </h2>
                <time
                  className="relative z-10 order-first mb-3 flex items-center pl-3.5 text-sm text-zinc-400 md:hidden dark:text-zinc-500"
                  dateTime={post.publishedOn}
                >
                  <span
                    className="absolute inset-y-0 left-0 flex items-center"
                    aria-hidden="true"
                  >
                    <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
                  </span>
                  {intlFormat(post.publishedOn)}
                </time>
                <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {post.description}
                </p>
                <div
                  aria-hidden="true"
                  className="relative z-10 mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400"
                >
                  Read article
                  <ChevronRightIcon className="size-4" />
                </div>
              </div>
              <time
                className="relative z-10 order-first mb-3 mt-1 hidden items-center text-sm text-zinc-400 md:block dark:text-zinc-500"
                dateTime={post.publishedOn}
              >
                {intlFormat(post.publishedOn)}
              </time>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  )
}
