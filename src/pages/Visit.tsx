import Headline from '../components/Headline'
import PageHero from '../components/PageHero'
import PlazaMap from '../components/PlazaMap'
import { PillLink } from '../components/Pill'
import {
  ADDRESS_ONE_LINE,
  HOURS,
  HOURS_PENDING_COPY,
  HOURS_STATUS,
  LINKS,
  SHOP,
} from '../data/site'
import { usePageFeature } from '../lib/feature'
import { formatRange } from '../lib/hours'

/** Arrival genuinely is a sequence, so it's the one ordered list on the site. */
const STEPS = [
  'Head for the plaza on Dundas Street East, just along from the Hurontario intersection.',
  'Turn in at the plaza entrance and park — the lot runs the width of the property.',
  'Face the row of shops at the back of the lot. The units are numbered.',
  'ThirsTEA is Unit 3. If you’ve reached the end of the row, you’ve gone too far.',
]

export default function Visit() {
  usePageFeature('matcha')
  return (
    <>
      <PageHero
        feature="matcha"
        eyebrow="People drive past it twice"
        lead="Finding"
        tail="us"
        intro="It’s tucked into a plaza, which is most of why reviews call it a hidden gem. Here’s exactly where to look, so you only have to do this once."
      />

      <section data-feature="matcha" className="section-clip bg-milk pb-[var(--section-y)]">
        <div className="mx-auto max-w-shell px-[var(--gutter)]">
          <div className="rounded-lg2 border border-ink-12 p-4 sm:p-8">
            <PlazaMap />
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <div>
              <Headline
                lead="Getting to the"
                tail="door"
                className="max-w-[14ch] text-[clamp(1.75rem,3.6vw,2.5rem)]"
              />
              <ol className="mt-8 flex flex-col gap-6">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex gap-5">
                    <span
                      aria-hidden
                      className="u-retint mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-feature-fill text-ink"
                    >
                      <span className="u-display text-[1.0625rem]">{i + 1}</span>
                    </span>
                    <span className="text-ink-70">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 max-w-measure text-[0.9375rem] text-ink-muted">
                Several MiWay routes stop at Hurontario and Dundas, and Cooksville GO is about ten
                minutes on foot.
              </p>
            </div>

            <div className="u-retint rounded-lg2 bg-feature-soft p-8 sm:p-10">
              <p className="u-util text-ink-muted">The address</p>
              <p className="u-display mt-3 text-[2rem] leading-tight">{SHOP.unit}</p>
              <address className="mt-2 not-italic text-ink-70">
                {SHOP.street}
                <br />
                {SHOP.city} {SHOP.postal}
              </address>

              <p className="u-util mt-8 text-ink-muted">Phone</p>
              <a
                href={SHOP.phoneHref}
                className="mt-1 inline-flex min-h-[44px] items-center text-ink underline underline-offset-4"
              >
                {SHOP.phone}
              </a>

              <p className="u-util mt-8 text-ink-muted">Hours</p>
              {HOURS_STATUS === 'unconfirmed' || HOURS.length === 0 ? (
                <p className="mt-2 text-ink">{HOURS_PENDING_COPY}</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-1.5">
                  {HOURS.map((h) => (
                    <li key={h.day} className="flex justify-between gap-6 text-ink-70">
                      <span>{h.day}</span>
                      <span className="tabular-nums">{formatRange(h)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-[0.9375rem] text-ink-muted">
                The shop is open later than most cafés nearby.
              </p>

              <PillLink to={LINKS.maps} external variant="fill" className="mt-9">
                Open in maps
              </PillLink>
              <p className="sr-only">{ADDRESS_ONE_LINE}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
