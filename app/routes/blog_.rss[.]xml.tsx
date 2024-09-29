import type { LoaderFunctionArgs } from '@remix-run/router'
import { allPosts } from '~/utils/blog/posts/all-posts'
import { compareDesc } from 'date-fns/compareDesc'
import { formatDate } from 'date-fns/format'

const cdata = (s: string) => `<![CDATA[${s}]]>`

export async function loader({ request }: LoaderFunctionArgs) {
  const posts = Object.entries(allPosts)
    .sort(([, p1], [, p2]) => compareDesc(p1.publishedOn, p2.publishedOn))
    .map(([slug, post]) => ({ slug, ...post }))

  const blogUrl = request.url.split('/').slice(0, -1).join('/')

  const rss = `
    <rss xmlns:blogChannel="${blogUrl}" version="2.0">
      <channel>
        <title>Allen Hansen's Blog</title>
        <link>${blogUrl}</link>
        <description>The Blog of Allen Hansen</description>
        <language>en-US</language>
        <generator>Allen Hansen</generator>
        <ttl>40</ttl>
        ${posts
          .map(post =>
            `
            <item>
              <title>${cdata(post.title)}</title>
              <description>${cdata(post.description)}</description>
              <pubDate>${formatDate(post.publishedOn, 'yyyy-MM-ii')}</pubDate>
              <link>${blogUrl}/${post.slug}</link>
              <guid>${blogUrl}/${post.slug}</guid>
            </item>
          `.trim(),
          )
          .join('\n')}
      </channel>
    </rss>
  `.trim()

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(rss)),
    },
  })
}
