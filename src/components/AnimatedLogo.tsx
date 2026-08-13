import { useInView, useReducedMotion } from 'framer-motion'
import { lazy, Suspense, useRef } from 'react'
import { Lockup } from './Nav'

const ThirsteaLogoPlayer = lazy(() => import('../remotion/ThirsteaLogoPlayer'))

function StaticLogo() {
  return (
    <span aria-hidden className="absolute inset-0 flex items-center justify-center px-5 sm:px-8">
      <Lockup size="display" />
    </span>
  )
}

/** Mount the Player only when it can be seen, so the one-shot reveal cannot
 * finish offscreen. Reduced-motion keeps the exact same lockup, without motion. */
export default function AnimatedLogo() {
  const container = useRef<HTMLDivElement>(null)
  const inView = useInView(container, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  return (
    <div
      ref={container}
      role="img"
      aria-label="ThirsTEA logo"
      className="relative h-full w-full overflow-hidden rounded-full border border-charcoal-12 bg-milk shadow-lift"
    >
      {inView && !reduced ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
          {/* Empty while the Player chunk loads, not the static lockup.
              The ident opens on a blank frame, so falling back to the finished
              logo made it appear, vanish, and then rebuild itself — the exact
              impression of a logo that keeps disappearing. Better to show
              nothing for that moment than to show the answer and take it away. */}
          <Suspense fallback={null}>
            <ThirsteaLogoPlayer />
          </Suspense>
        </div>
      ) : (
        <StaticLogo />
      )}
    </div>
  )
}
