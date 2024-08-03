import { Outlet } from '@remix-run/react'
import { Header } from '~/components/header'
import React from 'react'
import { Footer } from '~/components/footer'
import { useMatches } from 'react-router'
import { invariant } from '@remix-run/router/history'

export default function Component() {
  const match = useMatches().at(-1)
  invariant(match)

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="mx-auto flex max-w-screen-xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-md flex-1">
          <div className="prose dark:prose-invert m-auto flex flex-col p-10">
            <h1 className="mb-2">{match.handle.title}</h1>
            <p className="my-0">{match.handle.description}</p>
            <p className="my-0">{match.handle.published}</p>
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
