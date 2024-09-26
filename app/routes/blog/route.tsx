import { Outlet } from '@remix-run/react'

export default function Layout() {
  return (
    <article className="prose dark:prose-invert">
      <h1>Hello world!</h1>
      <Outlet />
    </article>
  )
}
