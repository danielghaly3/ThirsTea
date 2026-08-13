import Headline from '../components/Headline'
import OpenBadge from '../components/OpenBadge'
import Reveal from '../components/Reveal'
import { Arrow, PillLink } from '../components/Pill'
import { formatRange, useShopStatus } from '../lib/hours'
import {
  HOURS,
  HOURS_PENDING_COPY,
  HOURS_STATUS,
  LINKS,
  SHOP,
} from '../data/site'

const ICONS = {
  pin: 'M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z',
  phone:
    'M6.6 3h3l1.5 4-2 1.4a12 12 0 0 0 5.5 5.5l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3Z',
  clock: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm.9-9.4V6.8h-1.8v5.9l4.2 2.5.9-1.5-3.3-2Z',
}

export default function VisitTeaser() {
  return (
    <section data-feature="matcha" className="section-clip bg-milk py-[var(--section-y)]">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <Reveal>
          <div className="grid overflow-hidden rounded-xl2 lg:grid-cols-[1.15fr_1fr]">
            {/* Left: the hidden-gem problem, stated plainly. */}
            <div className="bg-milk px-8 py-12 sm:px-12 lg:py-16">
              <p className="u-eyebrow">Twenty-nine reviews call it a hidden gem</p>
              <Headline
                lead="People drive past it"
                tail="twice"
                className="mt-5 max-w-[12ch] text-[clamp(2.25rem,5vw,3.75rem)]"
              />
              <p className="mt-6 max-w-measure text-ink-70">
                The shop is set back in a plaza at Hurontario and Dundas, so the sign isn’t what
                you’re looking for — the unit number is.
              </p>

              <p className="u-display mt-10 text-[clamp(3.5rem,9vw,6rem)] leading-none text-charcoal">
                {SHOP.unit}
              </p>
              <address className="mt-3 not-italic text-ink-70">
                {SHOP.street}
                <br />
                {SHOP.city} {SHOP.postal}
              </address>

              <div className="mt-9 flex flex-wrap gap-4">
                <PillLink to="/visit" variant="fill">
                  How to find it <Arrow />
                </PillLink>
                <PillLink to={LINKS.maps} external variant="outline">
                  Open in maps
                </PillLink>
              </div>
            </div>

            {/* Right: the dark panel of contact rows. */}
            <div className="bg-charcoal px-8 py-12 text-milk sm:px-12 lg:py-16">
              <h3 className="u-display text-[1.75rem] text-accent-bright">The details</h3>
              <ul className="mt-9 flex flex-col gap-8">
                <Row icon={ICONS.pin} label="Where">
                  In the plaza, set back from the road. {SHOP.transit}.
                </Row>
                <Row icon={ICONS.phone} label="Phone">
                  <a
                    href={SHOP.phoneHref}
                    className="inline-flex min-h-[44px] items-center text-milk underline underline-offset-4"
                  >
                    {SHOP.phone}
                  </a>
                </Row>
                {/* The full week lives here rather than behind a link. This is
                    the only page in the demo that opens, so "see the visit
                    page" would have sent someone to a door that returns them. */}
                <Row icon={ICONS.clock} label="Hours">
                  {HOURS_STATUS === 'unconfirmed' ? (
                    HOURS_PENDING_COPY
                  ) : (
                    <>
                      <OpenBadge />
                      <WeekTable />
                    </>
                  )}
                </Row>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/**
 * The week, with today picked out. Times are tabular-nums so the right-hand
 * column stays a column — proportional digits make seven near-identical rows
 * look ragged for no reason.
 */
function WeekTable() {
  const { today } = useShopStatus()

  return (
    <ul className="mt-4 flex flex-col gap-1.5">
      {HOURS.map((h) => {
        const isToday = h.day === today?.day
        return (
          <li
            key={h.day}
            aria-current={isToday || undefined}
            className={`flex items-baseline justify-between gap-6 text-[0.9375rem] ${
              isToday ? 'text-milk' : 'text-milk-70'
            }`}
          >
            <span>{h.day}</span>
            <span className="tabular-nums">{formatRange(h)}</span>
          </li>
        )
      })}
    </ul>
  )
}

function Row({
  icon,
  label,
  children,
}: {
  icon: string
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-milk-14 text-accent-bright">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d={icon} />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="u-display block text-[1.125rem] text-milk">{label}</span>
        <span className="mt-1.5 block text-milk-70">{children}</span>
      </span>
    </li>
  )
}
