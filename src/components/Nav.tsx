import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LINKS, NAV, SHOP } from '../data/site'
import { PillLink } from './Pill'

/**
 * Placeholder lockup — the shop's real mark hasn't been supplied. Built from
 * ThirsTEA's own minimal black branding: a filled circle standing in for a
 * tapioca pearl, plus the wordmark. See question 14 in OWNER-QUESTIONS.md.
 */
export function Lockup({
  tone = 'charcoal',
  size = 'nav',
}: {
  tone?: 'charcoal' | 'cream'
  size?: 'nav' | 'display'
}) {
  const colour = tone === 'cream' ? 'text-milk' : 'text-charcoal'
  const spacing = size === 'display' ? 'gap-3 sm:gap-5' : 'gap-2.5'
  const pearl = size === 'display' ? 'h-14 w-14 sm:h-20 sm:w-20' : 'h-8 w-8'
  const wordmark =
    size === 'display'
      ? 'text-[clamp(2rem,8vw,4.5rem)] tracking-[-0.02em]'
      : 'text-[1.5rem] tracking-[-0.01em]'

  return (
    <span className={`flex min-h-[44px] items-center ${spacing} ${colour}`}>
      <span aria-hidden className={`${pearl} shrink-0 rounded-full bg-current`} />
      <span className={`u-display whitespace-nowrap leading-none text-current ${wordmark}`}>
        ThirsTEA
      </span>
    </span>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  /* On the home page the bar floats over the saturated hero, so it inverts. */
  const tone = onHome ? 'cream' : 'charcoal'
  const link = onHome ? 'text-milk' : 'text-charcoal'

  return (
    <header
      className={`${onHome ? 'absolute inset-x-0 top-0' : 'relative border-b border-charcoal-12 bg-milk'} z-40`}
    >
      {/* On the home page the bar floats over photography, so nothing
          guarantees the cream type has anything dark behind it. Measured across
          the five hero slides, the raw photo leaves the nav at 2.3–3.5:1; the
          scrim has to hold ~60% opacity through the whole nav band to clear
          4.5:1, then it can fade. A gentler gradient looks nicer and fails. */}
      {onHome ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-48"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(30,22,17,0.80) 0%, rgba(30,22,17,0.66) 50%, rgba(30,22,17,0.30) 78%, rgba(30,22,17,0) 100%)',
          }}
        />
      ) : null}
      <div className="relative mx-auto flex max-w-shell items-center justify-between gap-6 px-[var(--gutter)] py-5">
        <NavLink to="/" aria-label={`${SHOP.name} home`}>
          <Lockup tone={tone} />
        </NavLink>

        {/* Desktop: real inline nav. No hamburger above 1000px. */}
        <nav aria-label="Main" className="hidden min-[1000px]:block">
          <ul className="flex items-center gap-9">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `u-util relative py-2 transition-opacity duration-200 hover:opacity-100 motion-reduce:transition-none ${link} ${
                      isActive ? 'opacity-100' : 'opacity-70'
                    } ${
                      isActive
                        ? 'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:rounded-full after:bg-amber after:content-[""]'
                        : ''
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <PillLink
            to={LINKS.uberEats}
            external
            variant={onHome ? 'light' : 'fill'}
            className="hidden !py-3 min-[1000px]:inline-flex"
          >
            Order now
          </PillLink>

          {/* Below 1000px: a different pattern, not a collapsed one. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className={`u-util rounded-full border-line px-5 py-3 min-[1000px]:hidden ${
              onHome ? 'border-milk text-milk' : 'border-charcoal text-charcoal'
            }`}
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="fixed inset-0 z-50 flex flex-col bg-charcoal min-[1000px]:hidden">
          <div className="flex items-center justify-between px-[var(--gutter)] py-5">
            <Lockup tone="cream" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              autoFocus
              className="u-util rounded-full border-line border-milk px-5 py-3 text-milk"
            >
              Close
            </button>
          </div>
          <nav aria-label="Main" className="flex-1 overflow-y-auto px-[var(--gutter)] pb-16 pt-4">
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `u-display block border-b border-milk-14 py-4 text-[2.25rem] ${
                        isActive ? 'text-accent-bright' : 'text-milk'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <PillLink to={LINKS.uberEats} external variant="light" className="mt-9">
              Order now
            </PillLink>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
