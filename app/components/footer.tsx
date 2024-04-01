export const Footer = () => (
  <footer className="w-full border-t border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
    <div className="container mx-auto flex h-14 max-w-screen-2xl flex-1 items-center justify-center gap-4 px-4 sm:px-6 lg:px-8">
      <p className="text-pretty text-sm leading-loose text-zinc-800 dark:text-zinc-200">
        © {new Date().getFullYear()} Allen Hansen
      </p>
    </div>
  </footer>
)
