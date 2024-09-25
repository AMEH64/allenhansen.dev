import { Header } from '~/components/header'
import React from 'react'
import { Footer } from '~/components/footer'
import { allPosts } from 'content-collections'
import { formatISO } from 'date-fns/formatISO'

// export const meta = () => [
//   { title: allPosts[0].title },
//   {
//     name: 'summary',
//     content: allPosts[0].summary,
//   },
//   // {
//   //     name: 'published',
//   //     content: allPosts[0].publishedOn,
//   // },
// ]

export default function Component() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="mx-auto flex max-w-screen-xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-md flex-1">
          <div className="prose m-auto flex flex-col p-10 dark:prose-invert">
            <h1>Posts</h1>
            <ul>
              {allPosts
                .filter(p => p._meta.directory === 'hello-world')
                .map(post => (
                  <li className="list-none" key={post._meta.path}>
                    <article className="prose m-auto flex flex-col p-10 dark:prose-invert">
                      <header>
                        <h1>{post.title}</h1>
                        <p>
                          <time dateTime={post.publishedOn}>
                            {formatISO(post.publishedOn)}
                          </time>
                        </p>
                        <p>
                          <time dateTime={post.lastModifiedOn}>
                            {formatISO(post.lastModifiedOn)}
                          </time>
                        </p>
                      </header>
                      <p className="my-0">{post.summary}</p>
                    </article>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
