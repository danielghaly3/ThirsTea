import { motion, useReducedMotion } from 'framer-motion'
import AnimatedLogo from '../components/AnimatedLogo'
import Count from '../components/Count'
import Headline from '../components/Headline'
import Reveal from '../components/Reveal'
import { PillLink, Arrow } from '../components/Pill'
import { MENU_ITEM_ESTIMATE, SHOP } from '../data/site'

/**
 * The shop itself — where it is, how long it's been there, what's in the room.
 *
 * This slot used to be a second essay about the wall, which the panel below it
 * and the whole /wall page already cover. The one thing nothing else on the
 * home page says plainly is what ThirsTEA actually *is*: one unit at Hurontario
 * and Dundas, since 2018, still run by the people standing in it.
 *
 * Every figure below is one of the shop's own. Years open is computed rather
 * than typed, so the section can't quietly go stale in a year's time.
 */

/** Ticker copy. Each item is something stated elsewhere on the site as fact. */
const RIBBON = [
  'Bubble tea',
  'Bubble waffles',
  'Board games',
  'Sugar 0–100%',
  'Made to order',
  'Cooksville',
  `Since ${SHOP.since}`,
]

export default function Story() {
  const reduced = useReducedMotion() ?? false
  const years = new Date().getFullYear() - SHOP.since

  const stats = [
    { to: 1, label: 'Location', note: 'No second one' },
    { to: years, label: 'Years on Dundas', note: `Open since ${SHOP.since}` },
    { to: MENU_ITEM_ESTIMATE, label: 'Drinks, roughly', prefix: '≈', note: 'The full list is longer' },
    { to: 10, label: 'Min from the GO', note: 'Cooksville, on foot' },
  ]

  return (
    <section data-feature="wood" className="section-clip bg-milk py-[var(--section-y)]">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="u-eyebrow">One shop, since {SHOP.since}</p>
            <Headline
              lead="Still one shop on"
              tail="Dundas"
              className="mt-5 max-w-[11ch] text-[clamp(2.75rem,7vw,5.5rem)]"
            />
            {/* Prose is written out rather than assembled from SHOP strings —
                a .replace() against a data value fails silently the moment the
                owner edits it. Only the stable figures are interpolated. */}
            <p className="mt-7 max-w-measure text-ink-70">
              {SHOP.unit}, at Hurontario and Dundas in Cooksville — ten minutes on foot from the GO
              station. Bubble tea made to your numbers, waffles cooked after you order them, and a
              shelf of board games nobody will ask you to put away.
            </p>
            <p className="mt-4 max-w-measure text-ink-70">
              One location, run by the people who are in it. The wall gets repainted, the giveaways
              change with the season, the deals rotate — and it’s still the same small room it’s
              been since {SHOP.since}.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <PillLink to="/visit" variant="fill" className="group">
                Find the shop{' '}
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
              </PillLink>
              <PillLink to="/menu" variant="text" className="group">
                See the menu{' '}
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
              </PillLink>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative mx-auto aspect-square w-full max-w-[32rem]">
              <div aria-hidden className="u-retint absolute inset-0 rounded-[50%] bg-feature-soft" />

              {/* A dashed ring turning around the room, slowly. The shop is the
                  fixed thing on this page; everything around it rotates. */}
              <div aria-hidden className="u-turn absolute inset-[2%]">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="var(--feature-deep)"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                    strokeDasharray="0.4 4"
                    opacity="0.5"
                  />
                </svg>
              </div>

              <div className="absolute inset-[12%]">
                <AnimatedLogo />
              </div>

              {/* The address, on a plaque that never quite settles. */}
              <motion.div
                animate={reduced ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-2 bottom-2 max-w-[15rem] rounded-card bg-milk p-5 shadow-lift sm:-left-6 sm:bottom-6"
              >
                <p className="u-eyebrow">Where it is</p>
                <p className="u-display mt-2 text-[1.25rem] leading-tight">
                  {SHOP.unit}, {SHOP.street}
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-muted">
                  {SHOP.city} · {SHOP.transit}
                </p>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed ticker. Tilted and run past both edges so it reads as a band
          the page is sitting on rather than another boxed row. */}
      <div aria-hidden className="relative mt-20 -rotate-[1.6deg]">
        <div className="w-[106%] -translate-x-[3%] overflow-hidden bg-charcoal py-4">
          <motion.div
            className="flex w-max"
            animate={reduced ? undefined : { x: ['0%', '-50%'] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          >
            {/* Rendered twice; the loop resets at exactly one copy's width. */}
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {RIBBON.map((word) => (
                  <span key={`${copy}-${word}`} className="flex shrink-0 items-center">
                    <span className="u-display whitespace-nowrap px-6 text-[1.5rem] text-milk sm:text-[1.875rem]">
                      {word}
                    </span>
                    {/* A pearl between the words — the same mark as the logo. */}
                    <span className="block h-2 w-2 shrink-0 rounded-full bg-caramel" />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-shell px-[var(--gutter)]">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
          {stats.map((s, i) => (
            <li key={s.label}>
              <Reveal delay={i * 0.07}>
                <p className="u-display text-[clamp(2.5rem,6vw,3.75rem)] leading-none text-charcoal">
                  {s.prefix}
                  <Count to={s.to} delay={0.15 + i * 0.08} />
                </p>
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: reduced ? 0 : 0.6,
                    delay: reduced ? 0 : 0.25 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="u-retint mt-4 block h-[3px] w-12 origin-left rounded-full bg-feature"
                />
                <p className="u-util mt-4 text-charcoal">{s.label}</p>
                <p className="mt-1 text-[0.8125rem] text-ink-muted">{s.note}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
