import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lockup } from './Nav'
import OpenBadge from './OpenBadge'
import { formatRange, useShopStatus } from '../lib/hours'
import {
  ADDRESS_ONE_LINE,
  HOURS_PENDING_COPY,
  HOURS_STATUS,
  LINKS,
  NAV,
  SHOP,
} from '../data/site'

/** Today's line only. The full week is on the page itself, not in the footer. */
function TodayLine() {
  const { today } = useShopStatus()
  if (!today) return null
  return (
    <p className="mt-3 text-[0.9375rem] text-milk-40">
      {today.day} · <span className="tabular-nums">{formatRange(today)}</span>
    </p>
  )
}

const SOCIAL = [
  {
    label: `Instagram, ${LINKS.instagramHandle}`,
    href: LINKS.instagram,
    path: 'M12 2.2c3.2 0 3.6 0 4.9.07 3.25.15 4.77 1.69 4.92 4.92.06 1.28.07 1.67.07 4.88 0 3.22 0 3.6-.07 4.88-.15 3.23-1.66 4.77-4.92 4.92-1.28.06-1.67.07-4.9.07-3.2 0-3.6 0-4.88-.07-3.26-.15-4.77-1.7-4.92-4.92C2.14 15.67 2.13 15.28 2.13 12c0-3.2 0-3.6.07-4.88.15-3.23 1.66-4.77 4.92-4.92C8.4 2.14 8.8 2.13 12 2.13Zm0 3.18A6.62 6.62 0 1 0 18.62 12 6.62 6.62 0 0 0 12 5.38Zm0 10.92A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.88-10.6a1.55 1.55 0 1 0-1.55-1.54 1.55 1.55 0 0 0 1.55 1.54Z',
  },
]

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer className="section-clip bg-milk pt-8">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <div className="rounded-t-xl2 bg-charcoal px-[var(--gutter)] pb-10 pt-16 text-milk sm:px-10 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_1fr_1.2fr]">
            <div>
              <Lockup tone="cream" />
              <p className="mt-6 max-w-[34ch] text-milk-70">
                One shop, on Dundas, since {SHOP.since}. Bubble tea, waffles, board games, and a
                wall that keeps changing.
              </p>
            </div>

            <div>
              <h2 className="u-display text-[1.25rem] text-accent-bright">Explore</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {NAV.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="u-util flex min-h-[44px] w-full items-center text-milk-70 transition-colors hover:text-milk motion-reduce:transition-none"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="u-display text-[1.25rem] text-accent-bright">Find us</h2>
              <address className="mt-5 not-italic text-milk-70">
                <span className="block">{ADDRESS_ONE_LINE}</span>
                <a
                  href={SHOP.phoneHref}
                  className="mt-2 inline-flex min-h-[44px] items-center text-milk underline underline-offset-4"
                >
                  {SHOP.phone}
                </a>
              </address>
              {HOURS_STATUS === 'unconfirmed' ? (
                <p className="mt-4 text-[0.9375rem] text-milk-40">{HOURS_PENDING_COPY}</p>
              ) : (
                <div className="mt-5">
                  <OpenBadge />
                  <TodayLine />
                </div>
              )}
            </div>

            <div>
              <h2 className="u-display text-[1.25rem] text-accent-bright">Order & follow</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {[
                  { label: 'Uber Eats', href: LINKS.uberEats },
                  { label: 'DoorDash', href: LINKS.doorDash },
                  { label: 'Too Good To Go', href: LINKS.tooGoodToGo },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="u-util flex min-h-[44px] w-full items-center text-milk-70 transition-colors hover:text-milk motion-reduce:transition-none"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubscribed(true)
                }}
                className="mt-7"
              >
                <label htmlFor="footer-email" className="u-util block text-milk-40">
                  Keep up with the wall
                </label>
                <div aria-live="polite">
                {subscribed ? (
                  <p className="mt-3 rounded-full bg-milk-14 px-5 py-3 text-[0.9375rem] text-milk">
                    Noted — though this demo form has nowhere to send it yet.
                  </p>
                ) : (
                  <div className="mt-3 flex overflow-hidden rounded-full bg-milk-14">
                    <input
                      id="footer-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="min-w-0 flex-1 bg-transparent px-5 py-3 text-milk placeholder:text-milk-40 focus:outline-none"
                    />
                    <button
                      type="submit"
                      /* Same light pill as the nav CTA — one button system. */
                      className="u-util shrink-0 bg-milk px-5 text-charcoal transition-opacity hover:opacity-90 motion-reduce:transition-none"
                    >
                      Join
                    </button>
                  </div>
                )}
                </div>
              </form>

              <ul className="mt-6 flex gap-3">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={s.label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-milk-40 text-milk transition-colors hover:bg-milk hover:text-charcoal motion-reduce:transition-none"
                    >
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d={s.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 border-t border-milk-14 pt-7">
            <p className="max-w-[68ch] text-[0.9375rem] text-milk-40">
              This is an unofficial demo site built as a design pitch. It isn’t affiliated with or
              endorsed by ThirsTEA. Hours are the shop’s own; prices and offers shown here are still
              pending the owner’s confirmation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
