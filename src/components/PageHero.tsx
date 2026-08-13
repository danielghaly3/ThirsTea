import type { ReactNode } from 'react'
import Headline from './Headline'
import type { Feature } from '../data/site'

/** Inner-page hero: charcoal ground, tiled ghost wordmark, two-tone headline. */
export default function PageHero({
  feature,
  eyebrow,
  lead,
  tail,
  intro,
  children,
}: {
  feature: Feature
  eyebrow: string
  lead: string
  tail: string
  intro: string
  children?: ReactNode
}) {
  return (
    <section
      data-feature={feature}
      data-tone="dark"
      className="section-clip relative bg-charcoal text-milk"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {[0, 1, 2].map((row) => (
          <span
            key={row}
            className="u-display absolute whitespace-nowrap text-[clamp(4rem,12vw,9rem)] text-milk"
            style={{ opacity: 0.05, top: `${row * 42 - 14}%`, left: `${row % 2 === 0 ? -5 : -24}%` }}
          >
            ThirsTEA ThirsTEA ThirsTEA
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="u-retint pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-feature opacity-20"
      />

      <div className="relative mx-auto max-w-shell px-[var(--gutter)] pb-20 pt-16 sm:pt-20">
        <p className="u-eyebrow">{eyebrow}</p>
        <Headline
          as="h1"
          tone="cream"
          lead={lead}
          tail={tail}
          className="mt-5 max-w-[14ch] text-[clamp(2.75rem,8vw,6rem)]"
        />
        <p className="mt-7 max-w-measure text-milk-70">{intro}</p>
        {children}
      </div>
    </section>
  )
}
