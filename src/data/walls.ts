export type Wall = {
  id: string
  title: string
  when: string
  body: string
  image: string | null
  imageSlot: string
  /** The frame that hasn't been painted yet. */
  upcoming?: boolean
}

export const WALL_INTRO =
  'Every few months the wall gets painted over and becomes something else. Nobody photographs it properly, which is part of the problem, so here are the ones people remember.'

export const WALLS: Wall[] = [
  {
    id: 'lorax',
    title: 'The Lorax',
    when: 'A past season',
    body: 'Truffula trees, the whole width of the room. It’s the one people still bring up, usually while pointing at whatever’s there now.',
    image: '/images/wall-lorax.png',
    imageSlot: 'wall-lorax.jpg',
  },
  {
    id: 'sticky-notes',
    title: 'The sticky note wall',
    when: 'More recently',
    body: 'It started with a few notes and ended with customers covering the whole thing — messages, drawings, inside jokes nobody else can follow. The staff stopped tidying it on purpose.',
    image: '/images/wall-sticky-notes.png',
    imageSlot: 'wall-sticky-notes.jpg',
  },
  {
    id: 'next',
    title: 'Next one’s not painted yet',
    when: 'Soon',
    body: 'That’s genuinely all we know. It changes when it changes.',
    image: null,
    imageSlot: '—',
    upcoming: true,
  },
]
