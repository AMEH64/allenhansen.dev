import { XIcon } from '~/components/icons/x-icon'
import { Button } from '~/components/ui/button'
import { GitHubIcon } from '~/components/icons/git-hub-icon'

export const Header = () => (
  <header className="sticky top-0 z-10 w-full border-b border-zinc-300/40 bg-zinc-100 backdrop-blur supports-[backdrop-filter]:bg-zinc-100/50 dark:border-zinc-700/40 dark:bg-zinc-900 dark:supports-[backdrop-filter]:bg-zinc-900/50">
    <div className="flex h-14 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div>
        <Button to="/" className="font-mono italic tracking-tight" plain>
          &lt;AllenHansen&nbsp;/&gt;
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <Button
          to="https://github.com/AMEH64"
          target="_blank"
          rel="noreferrer"
          plain
        >
          <GitHubIcon title="Allen's GitHub Profile" />
        </Button>
        <Button
          to="https://x.com/ameh64"
          target="_blank"
          rel="noreferrer"
          plain
        >
          <XIcon title="Allen's Twitter Profile" />
        </Button>
      </div>
    </div>
  </header>
)
