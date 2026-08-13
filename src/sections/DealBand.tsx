import Headline from '../components/Headline'
import Reveal from '../components/Reveal'
import { Arrow, PillLink } from '../components/Pill'
import { DEAL } from '../data/site'

/** The promo band: ghosted wordmark behind, amber badge, one accent word. */
export default function DealBand() {
  if (!DEAL.active) return null

  return (
    <section className="section-clip bg-milk pb-[var(--section-y)] pt-[var(--section-y)]">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <Reveal>
          {/* The brand colour as a surface — the one full-caramel block. */}
          <div className="relative overflow-hidden rounded-xl2 bg-caramel px-8 py-14 sm:px-12">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {[0, 1, 2].map((row) => (
                <span
                  key={row}
                  className="u-display absolute whitespace-nowrap text-[clamp(4rem,12vw,9rem)] text-charcoal"
                  style={{
                    opacity: 0.04,
                    top: `${row * 40 - 16}%`,
                    left: `${row % 2 === 0 ? -6 : -26}%`,
                  }}
                >
                  ThirsTEA ThirsTEA ThirsTEA
                </span>
              ))}
            </div>

            <div className="relative flex flex-col items-start gap-7 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="u-util inline-block rounded-full bg-charcoal px-4 py-2 text-milk">
                  {DEAL.badge}
                </span>
                <Headline
                  tone="brand"
                  lead="Buy one, get one on all"
                  tail="slushes"
                  className="mt-6 max-w-[14ch] text-[clamp(2rem,5vw,3.5rem)]"
                />
                {/* Charcoal on caramel measures 5.2:1; milk on it is only 3.1,
                    so the type on this block stays dark. */}
                <p className="mt-4 text-charcoal">After 8pm, while the slush machine holds out.</p>
                <p className="mt-2 text-[0.875rem] text-charcoal opacity-75">{DEAL.note}</p>
              </div>

              <PillLink to="/deals" variant="fill" className="shrink-0">
                All the deals <Arrow />
              </PillLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
