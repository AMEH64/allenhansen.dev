import { DataInteractive as HeadlessDataInteractive } from '@headlessui/react'
import { Link as RemixLink, type LinkProps } from '@remix-run/react'
import React from 'react'

export const Link = React.forwardRef(function Link(
  props: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <HeadlessDataInteractive>
      <RemixLink {...props} ref={ref} />
    </HeadlessDataInteractive>
  )
})
