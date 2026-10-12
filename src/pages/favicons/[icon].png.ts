import type { APIRoute, GetStaticPaths } from 'astro'
import { iconPng } from '~/lib/icons'

const icons = {
  'favicon-16x16': { size: 16, radius: 3 },
  'favicon-32x32': { size: 32, radius: 3 },
  'apple-touch-icon': { size: 180, radius: 0 },
  'android-chrome-192x192': { size: 192, radius: 0 },
  'android-chrome-512x512': { size: 512, radius: 0 },
}

export const getStaticPaths = (() =>
  Object.entries(icons).map(([icon, props]) => ({
    params: { icon },
    props,
  }))) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
  const { size, radius } = props as (typeof icons)[keyof typeof icons]
  return new Response(new Uint8Array(await iconPng(size, { radius })), {
    headers: { 'Content-Type': 'image/png' },
  })
}
