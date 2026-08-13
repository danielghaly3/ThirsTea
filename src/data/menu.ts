import type { Feature } from './site'

export type MenuItem = {
  id: string
  name: string
  note?: string
  /** True only for items confirmed from the shop's own listings. */
  verified: boolean
}

export type Category = {
  id: string
  name: string
  feature: Feature
  blurb: string
  items: MenuItem[]
}

/**
 * Only drinks we could confirm are listed. Categories with nothing confirmed say
 * so rather than being filled in with plausible guesses — see MENU_STATUS in
 * site.ts and question 2 in OWNER-QUESTIONS.md.
 */
export const CATEGORIES: Category[] = [
  {
    id: 'specials',
    name: 'ThirsTEA Specials',
    feature: 'wood',
    blurb: 'The house list. Start here if it’s your first time.',
    items: [{ id: 'muddy-milk', name: 'Muddy Milk', note: 'Most ordered, by a distance.', verified: true }],
  },
  {
    id: 'milk-tea',
    name: 'Milk Tea',
    feature: 'wood',
    blurb: 'Brewed, not powdered. The long-sit order.',
    items: [{ id: 'taro-milk-tea', name: 'Taro Milk Tea', verified: true }],
  },
  {
    id: 'smoothies',
    name: 'Creamy Smoothies',
    feature: 'mango',
    blurb: 'Thicker than a slush, softer than ice cream.',
    items: [{ id: 'creamy-mango', name: 'Creamy Mango', verified: true }],
  },
  {
    id: 'fruit-tea',
    name: 'Fruit Tea',
    feature: 'strawberry',
    blurb: 'Tea first, fruit second. The lighter end of the menu.',
    items: [],
  },
  {
    id: 'slushes',
    name: 'Slushes',
    feature: 'strawberry',
    blurb: 'The summer half of the shop.',
    items: [
      { id: 'mango-slush', name: 'Mango Slush', verified: true },
      { id: 'strawberry-lychee-slush', name: 'Strawberry Lychee Slush', verified: true },
      { id: 'taro-slush', name: 'Taro Slush', verified: true },
    ],
  },
  {
    id: 'matcha',
    name: 'Matcha',
    feature: 'matcha',
    blurb: 'Bitter on purpose. Adjust it and we won’t take it personally.',
    items: [{ id: 'matcha-latte', name: 'Matcha Latte', verified: true }],
  },
  {
    id: 'coconut',
    name: 'Coconut Series',
    feature: 'matcha',
    blurb: 'Coconut base instead of milk.',
    items: [{ id: 'coconut-matcha', name: 'Coconut Matcha', verified: true }],
  },
  {
    id: 'coffee-yakult',
    name: 'Coffee & Yakult',
    feature: 'wood',
    blurb: 'Coffee, yakult, and the yogurt fusions.',
    items: [],
  },
  {
    id: 'desserts',
    name: 'Desserts & snacks',
    feature: 'mango',
    blurb: 'The reason people stay another hour.',
    items: [{ id: 'bubble-waffle', name: 'Bubble Waffle', note: 'Made to order.', verified: true }],
  },
]

/** Three questions, one drink. For people who freeze at an 80-item menu. */
export type PickerAnswer = 'fruity' | 'creamy' | 'hot' | 'cozy' | 'adventurous' | 'classic'

export const PICKER_QUESTIONS = [
  {
    id: 'base',
    question: 'Fruity or creamy?',
    options: [
      { value: 'fruity' as const, label: 'Fruity' },
      { value: 'creamy' as const, label: 'Creamy' },
    ],
  },
  {
    id: 'weather',
    question: 'Hot day or cozy one?',
    options: [
      { value: 'hot' as const, label: 'Hot day' },
      { value: 'cozy' as const, label: 'Cozy one' },
    ],
  },
  {
    id: 'mood',
    question: 'Feeling adventurous or classic?',
    options: [
      { value: 'adventurous' as const, label: 'Adventurous' },
      { value: 'classic' as const, label: 'Classic' },
    ],
  },
]

/** Every combination resolves to a confirmed drink and one honest reason. */
export const PICKER_RESULTS: Record<string, { drinkId: string; reason: string }> = {
  'fruity|hot|adventurous': {
    drinkId: 'strawberry-lychee-slush',
    reason: 'Lychee is the part most people haven’t had before, and it’s cold enough for July.',
  },
  'fruity|hot|classic': {
    drinkId: 'mango-slush',
    reason: 'The safest cold order on the menu, and still the one that sells out fastest.',
  },
  'fruity|cozy|adventurous': {
    drinkId: 'coconut-matcha',
    reason: 'Not fruit exactly, but it’s the one that surprises people who ask for something lighter.',
  },
  'fruity|cozy|classic': {
    drinkId: 'creamy-mango',
    reason: 'Fruit without the brain freeze. Thick enough to feel like a treat.',
  },
  'creamy|hot|adventurous': {
    drinkId: 'taro-slush',
    reason: 'Taro is nutty and a bit vanilla, and frozen it tastes like nothing else here.',
  },
  'creamy|hot|classic': {
    drinkId: 'creamy-mango',
    reason: 'Cold, smooth, and hard to get wrong.',
  },
  'creamy|cozy|adventurous': {
    drinkId: 'matcha-latte',
    reason: 'Properly bitter. Ask for it sweeter if that’s not your thing — that’s allowed.',
  },
  'creamy|cozy|classic': {
    drinkId: 'muddy-milk',
    reason: 'The one people come back for. If you only order one thing, order this.',
  },
}
