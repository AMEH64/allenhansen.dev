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

export const now = {
  updated: 'Oct 2026',
  /** The home page's "Now" line. */
  summary:
    'Building Resource Advisor+ at Schneider Electric, and working on Verso and this site.',
}

export const links = {
  email: 'me@allenhansen.dev',
  github: 'https://github.com/AMEH64',
  linkedin: 'https://www.linkedin.com/in/allen-hansen',
}

export const meta = {
  index:
    'I’m Allen Hansen, a senior software engineer who likes turning rough ideas into software people enjoy using. I write short, dated notes on what I learn.',
  blog: 'Notes on what I’ve learned, and the stories behind them.',
  projects: 'Side projects, experiments, and tools I’ve built.',
  about: `Senior software engineer, AI and full-stack. ${capitalize(yearsInWords)} years of making web apps faster and more accessible; now building Resource Advisor+ at Schneider Electric.`,
  now: 'What Allen Hansen is working on right now.',
  resume:
    'Résumé of Allen Hansen, senior software engineer: experience, skills, and education.',
  notFound: 'This page doesn’t exist, or it moved.',
}
