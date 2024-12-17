import { useLayoutEffect, type ComponentProps } from 'react'
import { Button } from './button'
import SunIcon from './icons/sun-icon.astro'
import MoonIcon from './icons/moon-icon.astro'
import { z } from 'astro/zod'
import { useLocalStorage } from '~/hooks/use-local-storage'

type ColorModeToggleProps = ComponentProps<typeof Button>

const colorModeSchema = z.enum(['light', 'dark'])

const colorModes = colorModeSchema.Values

type ColorMode = z.infer<typeof colorModeSchema>

export const ColorModeToggle = ({ className }: ColorModeToggleProps) => {
  const [colorMode, setColorMode] = useLocalStorage(
    'color-mode',
    colorModeSchema,
    () =>
      matchMedia('(prefers-color-scheme: dark)').matches
        ? colorModes.dark
        : colorModes.light,
  )

  useLayoutEffect(() => {
    document.documentElement.dataset.colorMode = colorMode
  }, [colorMode])

  const handleColorModeToggleClick = () =>
    setColorMode(oldColorMode =>
      oldColorMode === colorModes.light ? colorModes.dark : colorModes.light,
    )

  return (
    <Button
      className={className}
      onClick={handleColorModeToggleClick}
      type="button"
      variant="text"
    >
      <span className="hidden items-center justify-center gap-2 group-data-[color-mode=dark]/document:inline-flex">
        {/* <SunIcon /> */}
        <span className="">Light</span>
      </span>
      <span className="hidden items-center justify-center gap-2 group-data-[color-mode=light]/document:inline-flex">
        {/* <MoonIcon /> */}
        <span className="">Dark</span>
      </span>
    </Button>
  )
}
