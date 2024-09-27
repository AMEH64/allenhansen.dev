import { Text } from '~/components/ui/text'

export const Footer = () => (
  <footer className="mx-auto flex w-full max-w-7xl px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4">
    <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-center gap-3 sm:flex-row">
      <Text>
        &copy; {new Date().getFullYear()} Allen Hansen. All rights reserved.
      </Text>
    </div>
  </footer>
)
