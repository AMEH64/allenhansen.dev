import { Header } from '~/components/header'
import React from 'react'
import { Footer } from '~/components/footer'
import { allPosts } from 'content-collections'
import { formatISO } from 'date-fns/formatISO'
import { MDXContent } from '@content-collections/mdx/react'

// export const loader = async () => {
//   const { default: Blog, frontmatter } = await import(
//     '../blog.hello-world/route.mdx'
//   )
//   const content = renderToString(<Blog />)
//   return json({ content, frontmatter })
// }

export default function Component() {
  // const { content, frontmatter } = useLoaderData<typeof loader>()

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="mx-auto flex max-w-screen-xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-md flex-1">
          <div className="prose m-auto flex flex-col p-10 dark:prose-invert">
            {allPosts
              .filter(p => p._meta.directory === 'hello-world')
              .map(post => (
                <article
                  className="prose m-auto flex flex-col p-10 dark:prose-invert"
                  key={post._meta.path}
                >
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
                    <p className="my-0">{post.summary}</p>
                  </header>
                  <main>
                    <MDXContent code={post.mdx} />
                  </main>
                </article>
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
