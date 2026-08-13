import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Count from '../components/Count'
import Cutout from '../components/Cutout'
import { Arrow, PillLink } from '../components/Pill'
import { BESTSELLERS, HERO_CROWN, HERO_IDS } from '../data/bestsellers'
import { LINKS, RATINGS } from '../data/site'
import { usePageFeature } from '../lib/feature'

const SLIDES = HERO_IDS.map((id) => BESTSELLERS.find((d) => d.id === id)!).filter(Boolean)
const N = SLIDES.length

/**
 * Slot geometry measured off the reference hero. Every card exists at once and
 * animates between slots — they do not crossfade in place, which is what gives
 * the carousel its depth.
 *
 *   centre  scale 1.6                          opacity 1    blur 0    z 50
 *   sides   scale 0.9 rotate ±15° x ±450px     opacity 0.8  blur 4px  z 40
 *   hidden  scale 0.5                          opacity 0    blur 10px z 10
 *
 * Card base box is 350x500, so the centre renders at 560x800.
 */
const CARD = { w: 350, h: 500 }

function slot(offset: number, spread: number, wide: boolean) {
  if (offset === 0) return { scale: 1.6, x: 0, rotate: 0, opacity: 1, blur: 0, z: 50 }
  /* The reference holds the side cards a fixed 450px out, which puts them
     entirely off a phone screen. Below lg they'd only clip in as blurred
     slivers, so they're hidden rather than half-shown. */
  const sideOpacity = wide ? 0.8 : 0
  if (offset === 1) return { scale: 0.9, x: spread, rotate: 15, opacity: sideOpacity, blur: 4, z: 40 }
  if (offset === -1) return { scale: 0.9, x: -spread, rotate: -15, opacity: sideOpacity, blur: 4, z: 40 }
  return { scale: 0.5, x: 0, rotate: 0, opacity: 0, blur: 10, z: 10 }
}

/** "COFFEE" is six characters; longer drink names have to give ground. */
function wordSize(word: string) {
  return `clamp(3.5rem, ${Math.min(34, 204 / word.length).toFixed(1)}vw, 30rem)`
}

export default function HeroCarousel() {
  const reduced = useReducedMotion() ?? false
  const [index, setIndex] = useState(0)
  const [wide, setWide] = useState(true)
  const drink = SLIDES[index]
  usePageFeature(drink.feature)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setWide(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    SLIDES.map((s) => s.image)
      .filter((src): src is string => Boolean(src))
      .forEach((src) => {
        const img = new Image()
        img.src = src
      })
  }, [])

  const go = useCallback((step: number) => {
    setIndex((i) => (i + step + N) % N)
  }, [])

  const dragFrom = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    dragFrom.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const from = dragFrom.current
    dragFrom.current = null
    if (from === null) return
    const dx = e.clientX - from
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  }
  const onPointerCancel = () => {
    dragFrom.current = null
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    }
  }

  /* The reference keeps the side cards a fixed 450px out, which pushes them off
     a phone screen entirely. Scaling the spread and the card keeps the same
     composition at widths it was never laid out for. */
  const spread = wide ? 450 : 200
  const cardScale = wide ? 1 : 0.55

  return (
    <section
      data-feature={drink.feature}
      aria-roledescription="carousel"
      aria-label="Featured drinks"
      className="section-clip u-retint relative h-[100svh] min-h-[36rem] bg-feature-hero"
      onKeyDown={onKeyDown}
    >
      <p aria-live="polite" className="sr-only">
        {`${drink.lead} ${drink.tail}. ${drink.category}. Drink ${index + 1} of ${N}.`}
      </p>

      {/* Background artwork, crossfading with the drink. The reference uses a
          flat colour plate here; this shop has real artwork, so it sits on the
          plate and the plate shows through wherever a slide has none. */}
      <AnimatePresence initial={false}>
        {drink.heroImage ? (
          <motion.img
            key={drink.heroImage}
            src={drink.heroImage}
            alt=""
            aria-hidden
            draggable={false}
            loading="eager"
            fetchPriority="high"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
          />
        ) : null}
      </AnimatePresence>

      {/* Vignette over the artwork. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      {/* Tiled wordmark: dense rows, rotated 12°, held at 7% opacity. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-[200vh] w-[200vw] flex-col"
            style={{ transform: 'rotate(12deg) scale(1.1)' }}
          >
            {Array.from({ length: 12 }, (_, row) => (
              <div key={row} className="flex overflow-hidden whitespace-nowrap">
                {Array.from({ length: 14 }, (_, col) => (
                  <span
                    key={col}
                    className="u-display mx-8 text-[15vh] uppercase leading-none text-milk"
                    style={{ opacity: 0.07 }}
                  >
                    ThirsTEA
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage */}
      <div
        className="absolute inset-0"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{ touchAction: 'pan-y' }}
      >
        {/* The giant word. scaleY 1.3 and a -5% lift, as measured. The wrapper
            owns those so Framer's transform on the inner element can't drop them. */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 flex items-center justify-center pb-24 lg:pb-0"
        >
          <div style={{ transform: 'scaleY(1.3) translateY(-5%)' }}>
            <motion.p
              key={drink.id}
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="u-display whitespace-nowrap text-center text-milk"
              style={{
                fontSize: wordSize(drink.lead),
                lineHeight: 1,
                letterSpacing: '-0.05em',
              }}
            >
              {drink.lead}
            </motion.p>
          </div>
        </div>
        <h1 className="sr-only">{`${drink.lead} ${drink.tail}`}</h1>

        {/* The cards. All present, each animating to its slot. */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center pb-24 lg:pb-0"
          style={{ perspective: 1000 }}
        >
          <div className="relative flex h-full w-full items-center justify-center">
            {SLIDES.map((s, i) => {
              let offset = (i - index + N) % N
              if (offset > N / 2) offset -= N
              const t = slot(offset, spread, wide)
              const active = offset === 0
              return (
                <motion.div
                  key={s.id}
                  aria-hidden={!active}
                  data-feature={s.feature}
                  className="absolute text-charcoal"
                  style={{
                    width: CARD.w * cardScale,
                    height: CARD.h * cardScale,
                    zIndex: t.z,
                  }}
                  animate={{
                    scale: t.scale,
                    x: t.x,
                    rotate: t.rotate,
                    opacity: t.opacity,
                    filter: `blur(${t.blur}px)`,
                  }}
                  initial={false}
                  transition={{
                    duration: reduced ? 0 : 0.55,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Cutout
                    src={s.image}
                    alt={active ? `${s.lead} ${s.tail}` : ''}
                    slot={s.imageSlot}
                    shape={s.id === 'bubble-waffle' ? 'object' : 'cup'}
                    showSlot={false}
                    solid
                    priority={i === 0}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* The cream band. It dissolves into the artwork rather than cutting it:
          the curved cream shape that used to sit here met the photograph at a
          hard edge, and a curved seam is still a seam. The drink now stands in
          the cream instead of being sliced off by it. */}
      <div className="absolute inset-x-0 bottom-0 z-30">
        <div
          aria-hidden
          /* One pixel taller than its offset, so the gradient's solid end
             overlaps the band. Flush edges can land on a subpixel boundary and
             leave a hairline — the exact seam this replaced. */
          className="pointer-events-none absolute -top-32 h-[calc(8rem+1px)] w-full sm:-top-48 sm:h-[calc(12rem+1px)]"
          style={{ backgroundImage: 'var(--fade-milk)' }}
        />

        <div className="relative bg-milk">
          <div className="mx-auto max-w-shell px-[var(--gutter)] pb-6 pt-2 sm:pb-8">
            {/* Row one — what this drink is, and what the shop scores. */}
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={drink.id}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="min-w-[16rem] flex-1"
                >
                  <p className="u-eyebrow flex items-center gap-2.5">
                    {/* A bead of the drink itself, sitting in front of its name. */}
                    <motion.span
                      key={`${drink.id}-bead`}
                      aria-hidden
                      initial={reduced ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.08 }}
                      className="u-retint block h-2.5 w-2.5 rounded-full bg-feature-deep"
                    />
                    {drink.id === 'muddy-milk' ? HERO_CROWN : drink.category}
                  </p>
                  <p className="mt-2 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-70">
                    {drink.note}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Where the reference invents customer counts, these are the shop's
                  real platform figures — counted up rather than asserted. */}
              <div className="shrink-0">
                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
                  className="flex items-stretch"
                >
                  {RATINGS.map((r, i) => (
                    <motion.li
                      key={r.platform}
                      variants={{
                        hidden: { opacity: 0, y: reduced ? 0 : 12 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      className="border-l border-charcoal-12 pl-4 pr-4 first:border-l-0 first:pl-0 last:pr-0 sm:pl-6 sm:pr-6"
                    >
                      <p className="flex items-baseline gap-1.5">
                        <Star delay={0.3 + i * 0.1} reduced={reduced} />
                        <span className="u-display text-[1.5rem] leading-none text-charcoal">
                          <Count to={Number(r.score)} decimals={1} delay={0.3 + i * 0.1} />
                        </span>
                      </p>
                      <p className="mt-1.5 text-[0.6875rem] leading-tight text-ink-muted">
                        {r.platform}
                        <br />
                        {r.count}
                      </p>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>

            {/* Row two — the counter rail. The drinks are named rather than
                reduced to dots: five anonymous circles told you how many slides
                there were and nothing about what was on them.

                The steppers are outlined, not filled. Two solid black discs
                either side of a solid black CTA gave the row three things with
                equal weight; there is one primary action here and it says
                Order now. */}
            <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="flex shrink-0 items-center gap-2">
                  <Step label="Previous drink" onClick={() => go(-1)} side="left" />
                  <Step label="Next drink" onClick={() => go(1)} side="right" />
                </div>

                <DrinkRail slides={SLIDES} index={index} onPick={setIndex} reduced={reduced} />
              </div>

              <PillLink
                to={LINKS.uberEats}
                external
                variant="fill"
                className="group shrink-0 !px-8 max-lg:w-full"
              >
                Order now
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
              </PillLink>
            </div>

            {/* Fine print, kept well away from the real figures above it — set
                beside the ratings it read as a caveat on the ratings. */}
            <p className="mt-6 text-[0.6875rem] text-ink-muted">
              Drink artwork is placeholder — photography pending
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The counter rail. Every drink is named and reachable in one press, and the
 * active marker is a single element that slides between them — one object
 * moving along the rail rather than five lights taking turns.
 */
function DrinkRail({
  slides,
  index,
  onPick,
  reduced,
}: {
  slides: typeof SLIDES
  index: number
  onPick: (i: number) => void
  reduced: boolean
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  /* On a narrow rail the active drink can sit off the end. `nearest` keeps the
     page itself from scrolling while the rail catches up. */
  useEffect(() => {
    const active = trackRef.current?.querySelector<HTMLElement>('[data-active="true"]')
    active?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [index, reduced])

  return (
    <div
      ref={trackRef}
      role="group"
      aria-label="Choose a drink"
      className="u-rail -mx-2 min-w-0 overflow-x-auto px-2"
    >
      {/* No track behind the names. A filled pill stretched across the row left
          a slab of dead grey after the last drink; the underline only ever
          occupies the word it belongs to. */}
      <div className="flex min-w-max items-center">
        {slides.map((s, i) => {
          const active = i === index
          return (
            <button
              key={s.id}
              type="button"
              data-feature={s.feature}
              data-active={active}
              onClick={() => onPick(i)}
              aria-current={active}
              className="relative min-h-[44px] shrink-0 px-3 pb-3 pt-2 sm:px-4"
            >
              <span
                className={`u-util whitespace-nowrap text-[0.75rem] transition-colors duration-200 motion-reduce:transition-none ${
                  active ? 'text-charcoal' : 'text-ink-muted hover:text-charcoal'
                }`}
              >
                {s.lead} {s.tail}
              </span>
              {active ? (
                <motion.span
                  layoutId="hero-rail-marker"
                  aria-hidden
                  className="u-retint absolute inset-x-3 bottom-1 h-[3px] rounded-full bg-feature-deep sm:inset-x-4"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 420, damping: 38, mass: 0.8 }
                  }
                />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Caramel, not the feature colour — the ratings are a fact about the shop and
    have no business changing when the drink does. */
function Star({ delay, reduced }: { delay: number; reduced: boolean }) {
  return (
    <motion.svg
      width="13"
      height="13"
      viewBox="0 0 12 12"
      aria-hidden
      className="shrink-0 self-center"
      initial={reduced ? false : { scale: 0, rotate: -60 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={
        reduced ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 14, delay }
      }
    >
      <path
        d="M6 0.6 L7.55 4.05 L11.3 4.47 L8.5 7 L9.27 10.7 L6 8.85 L2.73 10.7 L3.5 7 L0.7 4.47 L4.45 4.05 Z"
        fill="var(--caramel)"
      />
    </motion.svg>
  )
}

function Step({
  label,
  onClick,
  side,
}: {
  label: string
  onClick: () => void
  side: 'left' | 'right'
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      className="group grid h-11 w-11 shrink-0 place-items-center rounded-full border-line border-charcoal-12 text-charcoal transition-colors duration-200 hover:border-charcoal hover:bg-charcoal hover:text-milk motion-reduce:transition-none"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d={side === 'left' ? 'M10 3 L5 8 L10 13' : 'M6 3 L11 8 L6 13'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 motion-reduce:transition-none ${
            side === 'left' ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'
          }`}
        />
      </svg>
    </motion.button>
  )
}
