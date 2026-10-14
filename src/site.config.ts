import { features, type Copy } from '~/config/features'

export const notesConfig = {
  /** Where "Open an issue" and the change-log links point. */
  repo: 'AMEH64/allenhansen.dev',
  branch: 'main',
}

/** Month the career started; the years of experience on About and the Résumé count from here. */
export const careerStart = '2017-05'

const [startYear, startMonth] = careerStart.split('-').map(Number)
const today = new Date()
export const yearsOfExperience =
  today.getUTCFullYear() -
  startYear -
  (today.getUTCMonth() + 1 < startMonth ? 1 : 0)

const NUMBER_WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
]
export const yearsInWords =
  NUMBER_WORDS[yearsOfExperience] ?? String(yearsOfExperience)
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const nowLines: Record<Copy, { summary: string; description: string }> = {
  old: {
    summary:
      'Drilling HSK 3 in Verso, learning hula vocabulary, and rebuilding this site, again.',
    description:
      'What Allen Hansen is working on, learning, and reading right now.',
  },
  new: {
    summary:
      'Building AI features at Schneider Electric, and working on Verso and this site.',
    description: 'What Allen Hansen is working on right now.',
  },
}

export const now = {
  updated: 'Oct 2026',
  /** The home page's "Now" line, shown while the Now page is on. */
  summary: nowLines[features.nowCopy].summary,
}

export const links = {
  email: 'me@allenhansen.dev',
  github: 'https://github.com/AMEH64',
  linkedin: 'https://www.linkedin.com/in/allen-hansen',
}

export const meta = {
  index:
    'I’m Allen Hansen, a full-stack engineer. I write short, dated notes on what I learn and build small projects that each get their own subdomain.',
  blog: 'Notes on what I’ve learned, and the stories behind them.',
  projects:
    'Small things I build to learn, each on its own subdomain, each with an honest status.',
  about: `Allen Hansen, senior full-stack engineer. ${capitalize(yearsInWords)} years of making web apps faster and more accessible; lately Python, FastAPI, and AI tooling.`,
  now: nowLines[features.nowCopy].description,
  resume:
    'Résumé of Allen Hansen, senior full-stack software engineer: experience, skills, and education.',
  notFound: 'This page doesn’t exist, or it moved.',
}
