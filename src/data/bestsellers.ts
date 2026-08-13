import type { Feature } from './site'

export type Drink = {
  id: string
  /** Headline pair: heavy sans, then one Fraunces italic word. Never two. */
  lead: string
  tail: string
  category: string
  feature: Feature
  /** One honest sentence. No tasting-note theatre. */
  note: string
  /** Set to a path once real cutout photography exists. See public/images/README.md. */
  image: string | null
  /** Wide generated artwork used only behind the foreground cup in the hero. */
  heroImage: string | null
  imageSlot: string
}

/** Muddy Milk is not equal to the others — it's the most-ordered item by a wide margin. */
export const HERO_CROWN = 'Most ordered'

/** Hero slides, ordered so the page walks through all five feature colours. */
export const HERO_IDS = [
  'muddy-milk',
  'mango-slush',
  'taro-slush',
  'strawberry-lychee-slush',
  'matcha-latte',
]

export const BESTSELLERS: Drink[] = [
  {
    id: 'muddy-milk',
    lead: 'Muddy',
    tail: 'Milk',
    category: 'ThirsTEA Specials',
    feature: 'wood',
    note: 'The one people come back for. Brown sugar, milk, and pearls still warm.',
    image: '/images/muddy-milk.png',
    heroImage: '/images/hero-muddy-milk-clean.png',
    imageSlot: 'muddy-milk.png',
  },
  {
    id: 'mango-slush',
    lead: 'Mango',
    tail: 'Slush',
    category: 'Slushes',
    feature: 'mango',
    note: 'Cold enough to hurt a little. Best drink in the plaza in August.',
    image: '/images/mango-slush.png',
    heroImage: '/images/hero-mango-slush-clean.png',
    imageSlot: 'mango-slush.png',
  },
  {
    id: 'strawberry-lychee-slush',
    lead: 'Strawberry',
    tail: 'Lychee',
    category: 'Slushes',
    feature: 'strawberry',
    note: 'Strawberry does the sweet, lychee does the floral. Nobody orders it once.',
    image: '/images/strawberry-lychee.png',
    heroImage: '/images/hero-strawberry-lychee-clean.png',
    imageSlot: 'strawberry-lychee.png',
  },
  {
    id: 'creamy-mango',
    lead: 'Creamy',
    tail: 'Mango',
    category: 'Creamy Smoothies',
    feature: 'mango',
    note: 'The slush with the edges rounded off. Thick enough to need the wide straw.',
    image: '/images/creamy-mango.png',
    heroImage: null,
    imageSlot: 'creamy-mango.png',
  },
  {
    id: 'taro-slush',
    lead: 'Taro',
    tail: 'Slush',
    category: 'Slushes',
    feature: 'taro',
    note: 'Nutty, a bit vanilla, and the exact colour of the wall two summers ago.',
    image: '/images/taro-slush.png',
    heroImage: '/images/hero-taro-slush-clean.png',
    imageSlot: 'taro-slush.png',
  },
  {
    id: 'taro-milk-tea',
    lead: 'Taro',
    tail: 'Tea',
    category: 'Milk Tea',
    feature: 'taro',
    note: 'The one that outlasts a board game. Order it with pearls.',
    image: '/images/taro-milk-tea.png',
    heroImage: null,
    imageSlot: 'taro-milk-tea.png',
  },
  {
    id: 'matcha-latte',
    lead: 'Matcha',
    tail: 'Latte',
    category: 'Matcha',
    feature: 'matcha',
    note: 'Properly green and properly bitter. Say the word if you want it sweeter.',
    image: '/images/matcha-latte.png',
    heroImage: '/images/hero-matcha-latte-clean.png',
    imageSlot: 'matcha-latte.png',
  },
  {
    id: 'bubble-waffle',
    lead: 'Bubble',
    tail: 'Waffle',
    category: 'Desserts & snacks',
    feature: 'mango',
    note: 'Made when you order it, which is why it takes a minute. Worth the minute.',
    image: '/images/bubble-waffle.png',
    heroImage: null,
    imageSlot: 'bubble-waffle.png',
  },
]
