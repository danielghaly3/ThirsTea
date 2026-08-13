export type Giveaway = {
  id: string
  title: string
  when: string
  body: string
  image: string | null
  imageSlot: string
  pending?: boolean
}

export const GIVEAWAYS_INTRO =
  'Small things, handed over without much ceremony. They’re seasonal, they’re not announced far in advance, and they run out.'

export const GIVEAWAYS: Giveaway[] = [
  {
    id: 'rose-soap',
    title: 'Rose-shaped soaps',
    when: 'Valentine’s',
    body: 'Given out with orders one February. Not sold, not promoted — just handed over with the drink.',
    image: '/images/giveaway-rose-soap.png',
    imageSlot: 'giveaway-rose-soap.png',
  },
  {
    id: 'keychains',
    title: 'Bubble tea keychains',
    when: 'Occasionally',
    body: 'Tiny plastic cups on a ring. They show up now and then and disappear quickly.',
    image: '/images/giveaway-keychain.png',
    imageSlot: 'giveaway-keychain.png',
  },
  {
    id: 'free-topping',
    title: 'A free topping',
    when: 'Ongoing',
    body: 'Follow the shop on Instagram and ask at the counter. That’s the whole mechanic.',
    image: '/images/giveaway-topping.png',
    imageSlot: 'giveaway-topping.png',
  },
  {
    id: 'next',
    title: 'Whatever’s next',
    when: 'Unannounced',
    body: 'Instagram is where these land first, usually with about a day’s notice.',
    image: null,
    imageSlot: '—',
    pending: true,
  },
]

export const TOO_GOOD_TO_GO = {
  title: 'Surprise bags',
  body: 'ThirsTEA lists surprise bags on Too Good To Go. What’s in one depends on the day.',
  pendingNote: 'Timing and availability to be confirmed by the owner',
}
