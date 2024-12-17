import { useLayoutEffect, type ComponentProps } from 'react'
import { Button } from './button'
import { SunIcon } from './icons/sun-icon'
import { MoonIcon } from './icons/moon-icon'
import { z } from 'astro/zod'
import { useLocalStorage } from '~/hooks/use-local-storage'

type ColorModeToggleProps = Pick<ComponentProps<typeof Button>, 'className'>

const colorModeSchema = z.enum(['light', 'dark'])

const colorModes = colorModeSchema.Values

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
      <SunIcon className="hidden group-data-[color-mode=dark]/document:inline-flex" />
      <span className="hidden group-data-[color-mode=dark]/document:inline-flex sm:sr-only">
        Light
      </span>
      <MoonIcon className="hidden group-data-[color-mode=light]/document:inline-flex" />
      <span className="hidden group-data-[color-mode=light]/document:inline-flex sm:sr-only">
        Dark
      </span>
    </Button>
  )
}
