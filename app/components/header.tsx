import { XIcon } from '~/components/icons/x-icon'
import { Button } from '~/components/ui/button'
import { GitHubIcon } from '~/components/icons/git-hub-icon'

export const Header = () => (
  <header className="sticky top-0 z-10 w-full border-b border-zinc-300/40 bg-white shadow backdrop-blur supports-[backdrop-filter]:bg-white/65 dark:border-zinc-700/40 dark:bg-zinc-900 dark:shadow-zinc-950 dark:supports-[backdrop-filter]:bg-zinc-900/65">
    <div className="mx-auto flex h-16 max-w-screen-2xl flex-1 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-start gap-3">
        <Button to="/" className="font-mono italic tracking-tight" plain>
          &lt;AllenHansen&nbsp;/&gt;
        </Button>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button
          aria-label="Allen's GitHub Profile"
          to="https://github.com/AMEH64"
          target="_blank"
          rel="noreferrer"
          plain
        >
          <GitHubIcon className="[--btn-icon:theme(colors.zinc.950)] dark:[--btn-icon:theme(colors.zinc.50)]" />
        </Button>
        <Button
          aria-label="Allen's Twitter Profile"
          to="https://x.com/ameh64"
          target="_blank"
          rel="noreferrer"
          plain
        >
          <XIcon className="[--btn-icon:theme(colors.zinc.950)] dark:[--btn-icon:theme(colors.zinc.50)]" />
        </Button>
      </div>
    </div>
  </header>
)
