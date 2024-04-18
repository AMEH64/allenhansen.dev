import { Text } from '~/components/ui/text'

export const Footer = () => (
  <footer className="w-full border-t border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
    <div className="container mx-auto flex h-14 max-w-screen-2xl flex-1 items-center justify-center gap-4 px-4 sm:px-6 lg:px-8">
      <Text>
        &copy; {new Date().getFullYear()} Allen Hansen. All rights reserved.
      </Text>
    </div>
  </footer>
)
