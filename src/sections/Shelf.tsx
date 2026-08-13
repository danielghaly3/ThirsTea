import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Cutout from '../components/Cutout'
import Headline from '../components/Headline'
import Reveal from '../components/Reveal'
import { Arrow, PillLink } from '../components/Pill'
import { BESTSELLERS, HERO_CROWN } from '../data/bestsellers'
import { PRICE_NOTE, PRICE_PLACEHOLDER } from '../data/site'

export default function Shelf() {
  const reduced = useReducedMotion()
  const signatures = BESTSELLERS.slice(0, 4)

  // The one full-espresso section on the home page. The drink tints on the
  // cards only register as colour against something dark.
  return (
    <section data-tone="dark" className="section-clip bg-charcoal py-[var(--section-y)]">
      <div className="mx-auto w-full max-w-[1920px] px-8 md:px-24">
        <Reveal className="text-center">
          <p className="u-eyebrow">Choose your flavour</p>
          <Headline
            tone="cream"
            lead="Our signature"
            tail="menu"
            className="mx-auto mt-4 max-w-[16ch] text-[clamp(2.75rem,6vw,5rem)]"
          />
        </Reveal>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {signatures.map((drink, i) => (
            <li key={drink.id} className="flex">
              <motion.article
                initial={reduced ? false : { opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{
                  duration: reduced ? 0 : 0.45,
                  delay: reduced ? 0 : i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex w-full"
              >
                <div
                  data-feature={drink.feature}
                  className="group relative flex w-full flex-col items-center rounded-[2rem] bg-milk p-6 shadow-xl lg:h-[507px]"
                >
                  <div className="relative mb-6 flex h-64 w-full items-center justify-center text-charcoal">
                    <span
                      aria-hidden
                      className="u-retint absolute inset-x-[8%] bottom-[6%] h-[58%] rounded-[45%] bg-feature-soft opacity-75"
                    />
                    <Cutout
                      src={drink.image}
                      alt={`${drink.lead} ${drink.tail}`}
                      slot={drink.imageSlot}
                      shape={drink.id === 'bubble-waffle' ? 'object' : 'cup'}
                      showSlot={false}
                      className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-4 group-focus-within:-translate-y-4 motion-reduce:transform-none motion-reduce:transition-none"
                    />
                    {drink.id === 'muddy-milk' ? (
                      <span className="u-util absolute left-1 top-1 z-20 rounded-full bg-charcoal px-3 py-1.5 text-[0.6875rem] text-milk">
                        {HERO_CROWN}
                      </span>
                    ) : null}
                  </div>

                  <p className="u-util flex items-center justify-center gap-2 text-[0.6875rem] text-amber-ink">
                    <span aria-hidden className="text-[0.9rem] text-amber">★</span>
                    {drink.category}
                  </p>

                  <h3 className="u-display mt-3 text-center text-[1.5rem]">
                    {drink.lead} <span className="text-accent">{drink.tail}</span>
                  </h3>
                  <p className="mt-3 flex-1 text-center text-[0.875rem] leading-relaxed text-ink-70">
                    {drink.note}
                  </p>

                  <div className="mt-7 flex w-full items-center justify-between">
                    <span className="u-display text-[1.25rem] text-charcoal">
                      {PRICE_PLACEHOLDER}
                    </span>
                    <Link
                      to="/menu"
                      aria-label={`See ${drink.lead} ${drink.tail} on the menu`}
                      className="grid h-12 w-12 place-items-center rounded-full bg-charcoal text-milk transition-colors duration-300 hover:bg-charcoal-2 motion-reduce:transition-none"
                    >
                      <Arrow />
                    </Link>
                  </div>
                </div>
              </motion.article>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12 text-center">
          <PillLink to="/menu" variant="light" className="group gap-2 transition-all hover:gap-4">
            View full menu <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </PillLink>
          <p className="mt-5 text-[0.9375rem] text-milk-40">{PRICE_NOTE}.</p>
        </Reveal>
      </div>
    </section>
  )
}
