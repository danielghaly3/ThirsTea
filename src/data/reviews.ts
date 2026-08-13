/**
 * Paraphrased themes only. No reviewer names, no quotes attributed to anyone,
 * no invented star counts. These are patterns across public reviews, written in
 * our own words — the platform scores in site.ts are the only numbers claimed.
 */

export type Theme = {
  id: string
  theme: string
  body: string
}

export const REVIEW_THEMES: Theme[] = [
  {
    id: 'staff',
    theme: 'The staff',
    body: 'The thing mentioned most often, usually before the drinks. People remember being treated well.',
  },
  {
    id: 'fresh',
    theme: 'Freshness',
    body: 'Pearls that are actually warm, waffles made after you order them.',
  },
  {
    id: 'study',
    theme: 'Good for studying',
    body: 'Quiet afternoons, big tables, nobody watching how long you’ve been there.',
  },
  {
    id: 'hidden',
    theme: 'Hidden gem',
    body: 'Said constantly — often in the same breath as “we drove past it twice”.',
  },
  {
    id: 'games',
    theme: 'The board games',
    body: 'Brought up about as often as the menu is.',
  },
  {
    id: 'menu',
    theme: 'The size of the menu',
    body: 'Meant as a compliment, mostly. Occasionally as a cry for help.',
  },
]
