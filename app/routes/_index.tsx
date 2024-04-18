import type { MetaFunction } from '@vercel/remix'
import { Header } from '~/components/header'
import { Footer } from '~/components/footer'
import React from 'react'
import { Badge } from '~/components/ui/badge'
import { Strong, Text } from '~/components/ui/text'

export const meta: MetaFunction = () => {
  return [
    { title: 'Allen Hansen' },
    { name: 'description', content: 'Welcome to Remix!' },
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
            <h1 className="text-balance text-4xl font-semibold text-blue-600 sm:text-5xl dark:text-blue-400">
              Building enjoyable web experiences
            </h1>
            <Text className="max-w-prose text-balance text-center">
              Hey, I&apos;m <Strong>Allen Hansen</Strong>, a full-stack software
              developer specializing in building engaging{' '}
              <Strong>web apps</Strong> powered by robust{' '}
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
