import type { APIRoute, GetStaticPaths } from 'astro'
import { iconPng, pngIcons } from '~/lib/icons'

export const getStaticPaths = (() =>
  Object.entries(pngIcons).map(([icon, props]) => ({
    params: { icon },
    props,
  }))) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
  const { size, shape } = props as (typeof pngIcons)[keyof typeof pngIcons]
  return new Response(new Uint8Array(await iconPng(size, shape)), {
    headers: { 'Content-Type': 'image/png' },
  })
}
