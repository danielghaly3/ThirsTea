/**
 * Deliberately no specific game titles. What's on the shelf changes and we
 * haven't confirmed it — claiming a shop stocks a particular game is as much an
 * invented fact as inventing a price. See question 5 in OWNER-QUESTIONS.md.
 */

export const GAMES_INTRO =
  'There’s a shelf of board games and nobody rushes you off the table. Reviews mention the games about as often as they mention the drinks, which tells you what the room is actually for.'

export type Shelf = {
  id: string
  title: string
  body: string
}

export const SHELF: Shelf[] = [
  {
    id: 'long',
    title: 'The long ones',
    body: 'Strategy games that eat an evening. This is what the milk teas are for — they last, and so does the ice.',
  },
  {
    id: 'quick',
    title: 'The quick ones',
    body: 'Card games and fillers for when you’ve got twenty minutes and one slush between two people.',
  },
  {
    id: 'loud',
    title: 'The loud ones',
    body: 'Party games. Best after eight, when the room stops being a study spot and starts being a hangout.',
  },
]

export const STAYING = [
  {
    id: 'study',
    title: 'Studying',
    body: 'Afternoons are quiet and the tables are big enough for a laptop and a drink. People sit for hours and nobody minds.',
  },
  {
    id: 'late',
    title: 'Late nights',
    body: 'The shop stays open later than most things nearby, which is how it ends up being where people go after everything else has closed.',
  },
  {
    id: 'groups',
    title: 'Groups',
    body: 'Tables get pushed together. It happens most evenings and it’s fine — just say how many of you there are.',
  },
]
