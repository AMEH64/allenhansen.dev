import { useLayoutEffect, type ComponentProps } from 'react'
import { Button } from './button'
import { SunIcon } from './icons/sun-icon'
import { MoonIcon } from './icons/moon-icon'
import { z } from 'zod'
import { useLocalStorage } from '~/hooks/use-local-storage'

type ColorModeToggleProps = Pick<ComponentProps<typeof Button>, 'className'>

const ColorModeSchema = z.enum(['light', 'dark'])

export const ColorModeToggle = ({ className }: ColorModeToggleProps) => {
  const [colorMode, setColorMode] = useLocalStorage(
    'color-mode',
    ColorModeSchema,
    () =>
      matchMedia('(prefers-color-scheme: dark)').matches
        ? ColorModeSchema.Values.dark
        : ColorModeSchema.Values.light,
  )

  useLayoutEffect(() => {
    document.documentElement.dataset.colorMode = colorMode
  }, [colorMode])

  const handleColorModeToggleClick = () =>
    setColorMode(
      oldColorMode =>
        oldColorMode === ColorModeSchema.Values.light
          ? ColorModeSchema.Values.dark
          : ColorModeSchema.Values.light,
    )

  return (
    <Button
      aria-live="polite"
      className={className}
      onClick={handleColorModeToggleClick}
      type="button"
      variant="text"
    >
      {
        {
          light: (
            <>
              <MoonIcon />
              <span className="sm:sr-only">Dark</span>
            </>
          ),
          dark: (
            <>
              <SunIcon />
              <span className="sm:sr-only">Light</span>
            </>
          ),
        }[colorMode]
      }
    </Button>
  )
}
