import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type PropsWithChildren,
} from 'react'
import { classNames } from '~/utils/class-names'

const variants = {
  primary:
    'bg-blue-600 dark:bg-blue-400 text-blue-50 dark:text-blue-950 hover:bg-blue-500',
  secondary:
    'bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20',
  outline:
    'border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 bg-transparent active:bg-zinc-500/10 hover:bg-zinc-500/10',
  text: 'text-zinc-950 dark:text-zinc-50 [&>[data-slot=icon]]:text-zinc-600 dark:[&>[data-slot=icon]]:text-zinc-400 bg-transparent active:bg-zinc-500/10 hover:bg-zinc-500/10',
} as const

type Variant = keyof typeof variants

type ButtonProps<T extends ElementType> = {
  as?: T extends 'a' ? 'a' : 'button' | undefined
  variant?: Variant
} & PropsWithChildren &
  ComponentPropsWithoutRef<T>

export const Button = <T extends ElementType>({
  as: Tag = 'button',
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps<T>) => (
  <Tag
    className={classNames(
      className,
      'relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-all',
      'gap-x-2 px-4 py-3',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      'focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400',
      'disabled:pointer-events-none disabled:opacity-50',
      '[&>[data-slot=icon]]:my-1 [&>[data-slot=icon]]:size-4 [&>[data-slot=icon]]:shrink-0',
      variants[variant],
    )}
    {...props}
  >
    {children}
  </Tag>
)
