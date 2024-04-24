import type { MetaFunction } from '@vercel/remix'
import { Header } from '~/components/header'
import { Footer } from '~/components/footer'
import React from 'react'
import { Badge } from '~/components/ui/badge'
import { Strong, Text } from '~/components/ui/text'

export const meta: MetaFunction = () => {
  return [
    { title: 'Allen Hansen' },
    { name: 'description', content: `Allen Hansen's Portfolio` },
  ]
}

export default function Index() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto flex max-w-3xl flex-1">
          {/*<div*/}
          {/*  className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"*/}
          {/*  aria-hidden="true"*/}
          {/*>*/}
          {/*  <div*/}
          {/*    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-blue-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] dark:bg-blue-500"*/}
          {/*    style={{*/}
          {/*      clipPath:*/}
          {/*        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</div>*/}
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <h1 className="font-display mx-auto max-w-4xl text-balance text-5xl font-medium tracking-normal text-slate-950 sm:text-7xl dark:text-slate-50">
              Building{' '}
              <span className="relative whitespace-nowrap text-blue-600 dark:text-blue-400">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  strokeDasharray="100%"
                  className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-500/50 dark:fill-blue-500/50"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
                </svg>
                <span className="relative">enjoyable</span>
              </span>{' '}
              web experiences.
            </h1>
            <Text className="max-w-prose text-balance text-center">
              Hey, I&apos;m <Strong>Allen Hansen</Strong>, a{' '}
              <Strong>full-stack software developer</Strong> specializing in
              building <Strong>web apps</Strong> and{' '}
              <Strong>microservices</Strong>. I'm passionate about leveraging{' '}
              <Strong>web standards</Strong> to create{' '}
              <Strong>accessible</Strong> and{' '}
              <Strong>intuitive user experiences</Strong> that perform at scale.
            </Text>
            <div className="flex gap-3">
              <Badge color="blue">#react</Badge>
              <Badge color="blue">#typescript</Badge>
              <Badge color="blue">#css</Badge>
              <Badge color="blue">#dotnet</Badge>
              <Badge color="blue">#csharp</Badge>
            </div>
          </div>
          {/*<div*/}
          {/*  className="absolute inset-x-0 top-[calc(50%-50rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"*/}
          {/*  aria-hidden="true"*/}
          {/*>*/}
          {/*  <div*/}
          {/*    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-blue-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] dark:bg-blue-400 dark:opacity-70"*/}
          {/*    style={{*/}
          {/*      clipPath:*/}
          {/*        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
      </main>
      <Footer />
    </div>
  )
}
