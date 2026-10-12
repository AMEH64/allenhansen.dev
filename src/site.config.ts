export const notesConfig = {
  /** A note reads "Due for a re-check" after this many months without a check. */
  recheckMonths: 12,
  /** Where "Spot something wrong or outdated?" opens an issue. */
  repo: 'AMEH64/allenhansen.dev',
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
  summary:
    'Drilling HSK 3 in Verso, learning hula vocabulary, and rebuilding this site, again.',
}

export const links = {
  email: 'me@allenhansen.dev',
  github: 'https://github.com/AMEH64',
  linkedin: 'https://www.linkedin.com/in/allen-hansen',
}

export const meta = {
  index:
    'I’m Allen Hansen, a full-stack engineer. I write short, dated notes on what I learn and build small projects that each get their own subdomain.',
  notes:
    'Short, dated notes on what I learn as a full-stack engineer, re-checked over time and corrected in the open.',
  projects:
    'Small things I build to learn, each on its own subdomain, each with an honest status.',
  about: `Allen Hansen, senior full-stack engineer. ${capitalize(yearsInWords)} years of making web apps faster and more accessible; lately Python, FastAPI, and AI tooling.`,
  now: 'What Allen Hansen is working on, learning, and reading right now.',
  resume:
    'Résumé of Allen Hansen, senior full-stack software engineer: experience, skills, and education.',
  notFound: 'This page doesn’t exist, or it moved.',
}
