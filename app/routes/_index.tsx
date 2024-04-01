import type { MetaFunction } from '@vercel/remix'
import { Header } from '~/components/header'
import { Footer } from '~/components/footer'

export const meta: MetaFunction = () => {
  return [
    { title: 'Allen Hansen' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <div
      style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}
      className="flex min-h-svh flex-col"
    >
      <Header />
      <main className="mx-auto flex max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-1">
          <div className="m-3 flex flex-col items-center justify-center rounded-md p-6">
            <h1 className="self-center text-balance text-4xl">Welcome!</h1>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
