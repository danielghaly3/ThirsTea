/** Everything the owner might change without opening a component. */

export type Feature = 'taro' | 'mango' | 'strawberry' | 'matcha' | 'wood'

export const SHOP = {
  name: 'ThirsTEA',
  unit: 'Unit 3',
  street: '26 Dundas Street East',
  city: 'Mississauga, ON',
  postal: 'L5A 1W2',
  phone: '(905) 896-0489',
  phoneHref: 'tel:+19058960489',
  transit: '10 minutes on foot from Cooksville GO',
  crossroads: 'Hurontario & Dundas, in Cooksville',
  since: 2018,
  /**
   * Taken off the shop's own Google Maps place entry, not geocoded from the
   * address string. Reverse-geocoding these lands in Cooksville Four Corners —
   * the plaza at Hurontario and Dundas that PlazaMap draws — which is the
   * confirmation that the pin and the address describe the same place.
   */
  lat: 43.5805912,
  lng: -79.6153276,
} as const

export const ADDRESS_ONE_LINE = `${SHOP.unit}, ${SHOP.street}, ${SHOP.city} ${SHOP.postal}`

/**
 * Confirmed by the owner. Kept for the reverse trip: set back to 'unconfirmed'
 * and every hours block on the site returns to saying so, rather than showing
 * times nobody has checked.
 */
export const HOURS_STATUS: 'unconfirmed' | 'confirmed' = 'confirmed'
export const HOURS_PENDING_COPY = 'Hours confirmed by owner before launch'

/** The shop's own clock. A visitor in another timezone still gets its hours. */
export const TIMEZONE = 'America/Toronto'

/**
 * Times are 24-hour so no component has to parse them back out of a display
 * string — src/lib/hours.ts is the only place that formats them for reading,
 * and the only place that decides whether the shop is open right now.
 *
 * '24:00' is midnight at the END of that day. Written that way rather than as
 * '00:00' because a close of 00:00 sorts before its own opening time, which
 * makes every "is it open" comparison wrong in a way that only shows up on
 * Friday nights.
 */
export const HOURS: { day: string; open: string; close: string }[] = [
  { day: 'Monday', open: '11:00', close: '23:00' },
  { day: 'Tuesday', open: '11:00', close: '23:00' },
  { day: 'Wednesday', open: '11:00', close: '23:00' },
  { day: 'Thursday', open: '11:00', close: '23:00' },
  { day: 'Friday', open: '11:00', close: '24:00' },
  { day: 'Saturday', open: '11:00', close: '24:00' },
  { day: 'Sunday', open: '11:00', close: '23:00' },
]

/** Prices are unconfirmed everywhere. Stated once, here. */
export const PRICE_PLACEHOLDER = '—'
export const PRICE_NOTE = 'In-store pricing confirmed by the owner before launch'

/**
 * The demo lists only drinks we could verify. The real menu is around 80 items.
 * Flip to 'complete' once the owner supplies the full list.
 */
export const MENU_STATUS: 'partial' | 'complete' = 'partial'
/** The owner's own rough figure. Stated once so no component types it again. */
export const MENU_ITEM_ESTIMATE = 80
export const MENU_PENDING_COPY = `This demo shows the drinks we could confirm. The full menu — around ${MENU_ITEM_ESTIMATE} of them — comes from the owner before launch.`

/** The one deal slot. One line, one owner, no competing offers. */
export const DEAL = {
  badge: 'Today',
  text: 'Buy one, get one on all slushes after 8pm',
  note: 'Demo copy — the real rotating deal comes from the owner',
  active: true,
} as const

export const LINKS = {
  instagram: 'https://www.instagram.com/thirstea_mississauga/',
  instagramHandle: '@thirstea_mississauga',
  /**
   * The shop's actual Uber Eats storefront, supplied by the owner. Every
   * "Order now" on the site — both nav buttons, the hero band and the footer —
   * reads this one value, so the demo's placeholder homepage link is gone from
   * all four at once.
   */
  uberEats:
    'https://www.ubereats.com/ca/store/thirstea/iMBtRMsVRBCcgLlB8by71w?diningMode=DELIVERY&surfaceName=',
  /* Still the platform homepage — no DoorDash store URL supplied yet, and the
     footer link is labelled "DoorDash", so it can't be pointed at Uber Eats. */
  doorDash: 'https://www.doordash.com/',
  tooGoodToGo: 'https://www.toogoodtogo.com/',
  /**
   * The shop's actual Google Maps listing, supplied by the owner.
   *
   * This replaces an address-search URL, which asked Google to re-find the shop
   * from a string every time it was opened — that resolves to whatever Google
   * decides matches today, not necessarily this shop, and it is one of the ways
   * the stale second listing in OWNER-QUESTIONS §12 could surface on our own
   * page. A place link can only ever open this place.
   */
  maps: 'https://maps.app.goo.gl/S3eFFMTNPYqmwEEo8',
  /** Equivalent long form, in case the short link ever needs decoding. */
  mapsPlaceCid: 'https://maps.google.com/?cid=13775898091576333183',
  /** Turn-by-turn to the verified pin rather than to a re-geocoded address. */
  directions: `https://www.google.com/maps/dir/?api=1&destination=${SHOP.lat},${SHOP.lng}`,
} as const

export const RATINGS = [
  { platform: 'Google', score: '4.5', count: '859 reviews' },
  { platform: 'Uber Eats', score: '4.6', count: '1,500+ ratings' },
  { platform: 'DoorDash', score: '4.5', count: '500+ ratings' },
] as const

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/wall', label: 'The Wall' },
  { to: '/games', label: 'Games' },
  { to: '/deals', label: 'Deals' },
  { to: '/catering', label: 'Catering' },
  { to: '/visit', label: 'Visit' },
] as const

/** The in-store challenge. One honest line — a website cannot hand anyone a drink. */
export const CHALLENGE = {
  title: 'The 10-second challenge',
  line: "There's a button by the counter and a timer you can't see. Stop it at exactly ten seconds and your drink's free.",
  caveat: 'It only counts in the shop.',
} as const

export const ADJUSTABLE = ['sugar 0–100%', 'ice your way', 'toppings extra'] as const
