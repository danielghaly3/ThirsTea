import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
  type Variants,
} from 'framer-motion'
import Headline from '../components/Headline'
import PhotoSlot from '../components/PhotoSlot'
import Reveal from '../components/Reveal'
import { Arrow } from '../components/Pill'
import { CHALLENGE } from '../data/site'

/**
 * Wall, games, giveaways and the challenge — one at a time, on a deck you throw.
 *
 * The four used to sit in a static four-up grid, which said "here are four
 * things" when the eyebrow above it says "it rotates". So the section now
 * literally rotates: a deck that auto-advances, and that you can drag, flick,
 * arrow through or tab through. Equality is still enforced structurally —
 * every panel gets the identical card, the identical type scale and the
 * identical share of the cycle — it's just serial instead of parallel now.
 */
const PANELS = [
  {
    to: '/wall',
    tag: 'The mural',
    lead: 'The',
    tail: 'wall',
    body: 'Repainted every few months. It’s been The Lorax. It’s been covered in customers’ sticky notes.',
    cue: 'See what it’s been',
    slot: 'wall-sticky-notes.jpg',
    image: '/images/wall-sticky-notes.png',
    feature: 'taro' as const,
  },
  {
    to: '/games',
    tag: 'The shelf',
    lead: 'Board',
    tail: 'games',
    body: 'A shelf of them, and no one hurrying you off the table. Reviews mention the games about as often as the drinks.',
    cue: 'Why people stay',
    slot: 'interior.jpg',
    image: '/images/interior.png',
    feature: 'wood' as const,
  },
  {
    to: '/deals',
    tag: 'Giveaways',
    lead: 'Little',
    tail: 'things',
    body: 'Rose-shaped soaps at Valentine’s. Keychains. A free topping for following on Instagram.',
    cue: 'What’s going around',
    slot: 'giveaway-rose-soap.png',
    image: '/images/giveaway-rose-soap.png',
    feature: 'strawberry' as const,
  },
  {
    to: '/deals',
    tag: 'The challenge',
    lead: 'Ten',
    tail: 'seconds',
    body: `${CHALLENGE.line} ${CHALLENGE.caveat}`,
    cue: 'How it works',
    slot: 'counter-timer.jpg',
    image: '/images/counter-timer.png',
    feature: 'mango' as const,
  },
]

const N = PANELS.length

/** One full turn of the deck, matched by the sweep on the active progress bar. */
const DWELL = 7000

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Deck geometry. The top card sits square and the rest fan up and to the right,
 * rotating about a point below themselves so the fan opens like held cards
 * rather than pinwheeling about their own centres.
 *
 *   0  square, full shadow, draggable
 *   1  scale 0.94, +5°
 *   2  scale 0.88, +10°
 *   3+ hidden — either tucked behind the fan, or parked off to the left when
 *      the deck is running backwards, so a "previous" throws the card back in
 *      from the side it left by.
 */
const SLOTS = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  { x: 26, y: -18, rotate: 5, scale: 0.94, opacity: 1 },
  { x: 50, y: -32, rotate: 10, scale: 0.88, opacity: 1 },
]

const TUCKED = { x: 68, y: -42, rotate: 14, scale: 0.84, opacity: 0 }
const OFFSTAGE = { x: -620, y: 20, rotate: -18, scale: 1, opacity: 0 }

/** A flick past either of these commits; below both, the card springs back. */
const THROW_DISTANCE = 110
const THROW_VELOCITY = 480

export default function RightNow() {
  const reduced = useReducedMotion() ?? false
  const navigate = useNavigate()

  const [index, setIndex] = useState(0)
  /* Which way the deck is turning. Read by the hidden slot, so a card leaving
     forwards tucks into the fan and a card arriving backwards flies in. */
  const [dir, setDir] = useState<1 | -1>(1)
  const [exiting, setExiting] = useState<{ flyX: 1 | -1 } | null>(null)
  const [held, setHeld] = useState(false)
  const [touched, setTouched] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { amount: 0.35 })
  const busy = useRef(false)

  const panel = PANELS[index]
  const playing = inView && !held && !exiting && !reduced

  const next = useCallback((flyX: 1 | -1 = -1) => {
    if (busy.current) return
    busy.current = true
    setTouched(true)
    setDir(1)
    setExiting({ flyX })
  }, [])

  const exited = useCallback(() => {
    setIndex((i) => (i + 1) % N)
    setExiting(null)
    busy.current = false
  }, [])

  /* Backwards and jumps don't throw a card — they turn the deck. The direction
     has to land a frame before the index so the incoming card can reposition
     while it's still invisible, otherwise it fades in on the spot instead of
     sweeping back in. */
  const turnTo = useCallback((to: number, way: 1 | -1) => {
    if (busy.current) return
    busy.current = true
    setTouched(true)
    setDir(way)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setIndex(to)
        busy.current = false
      }),
    )
  }, [])

  const prev = useCallback(() => turnTo((index - 1 + N) % N, -1), [index, turnTo])

  const jump = useCallback(
    (to: number) => {
      if (to !== index) turnTo(to, to > index ? 1 : -1)
    },
    [index, turnTo],
  )

  /* Autoplay that survives a pause. The remaining time is carried across the
     hover rather than reset, so the timer and the frozen progress bar stay
     describing the same moment. */
  const remaining = useRef(DWELL)
  useEffect(() => {
    remaining.current = DWELL
  }, [index])

  useEffect(() => {
    if (!playing) return
    const started = performance.now()
    const t = window.setTimeout(() => next(-1), remaining.current)
    return () => {
      window.clearTimeout(t)
      remaining.current = Math.max(0, remaining.current - (performance.now() - started))
    }
  }, [playing, index, next])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      next(-1)
    }
  }

  return (
    <section
      ref={sectionRef}
      data-feature={panel.feature}
      aria-roledescription="carousel"
      aria-label="What’s happening now"
      className="section-clip u-retint relative bg-sand py-[var(--section-y)]"
      onKeyDown={onKeyDown}
      /* Hovering pauses the turn; a touch shouldn't, or the first tap on a
         phone would stop the deck for good. */
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setHeld(true)
      }}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      {/* Tonal discs, drifting on two clocks and retinting with the panel. They
          run past the section edge; .section-clip owns the crop. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="u-drift-a u-retint absolute -left-[14%] top-[8%] block h-[34rem] w-[34rem] rounded-full bg-feature-soft opacity-60" />
        <span className="u-drift-b u-retint absolute -right-[10%] bottom-[-12%] block h-[28rem] w-[28rem] rounded-full bg-feature-soft opacity-50" />
      </div>

      <div className="relative mx-auto max-w-shell px-[var(--gutter)]">
        <Reveal className="text-center">
          <p className="u-eyebrow">It rotates, which is the point</p>
          <Headline
            lead="What’s happening"
            tail="now"
            className="mx-auto mt-4 max-w-[16ch] text-[clamp(2.25rem,6vw,4.5rem)]"
          />
        </Reveal>

        <div className="mt-14 grid items-center gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-y-0">
          {/* ── The deck ───────────────────────────────────────────────── */}
          <Reveal className="order-1">
            <div className="relative mx-auto w-full max-w-[21rem] lg:mx-0">
              {/* Hollow numeral behind the fan, changing with the deck. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-10 select-none sm:-right-16 sm:-top-14"
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    key={index}
                    initial={reduced ? false : { opacity: 0, y: 28, rotate: -14 }}
                    animate={{ opacity: 0.16, y: 0, rotate: -8 }}
                    exit={{ opacity: 0, y: -28, rotate: -2 }}
                    transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                    className="u-display u-outline block text-[7rem] leading-none sm:text-[11rem]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div
                className="relative aspect-[3/4] w-full touch-pan-y select-none"
                style={{ perspective: 1400 }}
                role="group"
                aria-label="Drag or use the left and right arrow keys to turn the deck"
                tabIndex={0}
              >
                {PANELS.map((p, i) => {
                  const offset = (i - index + N) % N
                  return (
                    <DeckCard
                      key={p.tag}
                      panel={p}
                      offset={offset}
                      isTop={offset === 0}
                      dir={dir}
                      reduced={reduced}
                      exiting={offset === 0 ? exiting : null}
                      onExited={exited}
                      onThrow={next}
                      onOpen={() => navigate(p.to)}
                    />
                  )
                })}

                {/* The swipe badge: a dial that turns on its own, so the
                    affordance is doing the thing it's asking for. Fades out
                    once the deck has been touched. */}
                <motion.div
                  aria-hidden
                  animate={{ opacity: touched ? 0 : 1, scale: touched ? 0.85 : 1 }}
                  transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                  className="pointer-events-none absolute -bottom-7 -left-4 h-24 w-24 sm:-bottom-8 sm:-left-11 sm:h-32 sm:w-32"
                >
                  <div className="u-turn absolute inset-0">
                    <svg viewBox="0 0 120 120" className="h-full w-full">
                      <defs>
                        <path
                          id="rn-ring"
                          d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"
                          fill="none"
                        />
                      </defs>
                      <text
                        className="u-display"
                        fontSize="12.5"
                        letterSpacing="3.1"
                        fill="var(--charcoal)"
                        opacity="0.62"
                      >
                        <textPath href="#rn-ring" startOffset="0">
                          DRAG TO TURN · DRAG TO TURN ·
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  <div className="u-retint absolute inset-[26%] grid place-items-center rounded-full bg-charcoal text-milk">
                    <svg width="26" height="14" viewBox="0 0 26 14" fill="none" aria-hidden>
                      <motion.path
                        d="M9 2 L4 7 L9 12"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        animate={{ x: [0, -2, 0], opacity: [0.45, 1, 0.45] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <motion.path
                        d="M17 2 L22 7 L17 12"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        animate={{ x: [0, 2, 0], opacity: [0.45, 1, 0.45] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.15,
                        }}
                      />
                    </svg>
                  </div>
                </motion.div>
              </div>
            </div>
          </Reveal>

          {/* ── The copy, swapping with the deck ───────────────────────── */}
          <Reveal delay={0.08} className="order-2">
            <div className="lg:min-h-[22rem]">
              <p aria-live="polite" className="sr-only">
                {`${panel.lead} ${panel.tail}. ${panel.body} Item ${index + 1} of ${N}.`}
              </p>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={index}
                  variants={stack(reduced, dir)}
                  initial="hidden"
                  animate="show"
                  exit="out"
                  style={{ perspective: 900 }}
                >
                  <motion.div variants={rise} className="flex items-center gap-4">
                    <span className="u-util u-retint inline-flex items-center rounded-full bg-feature-fill px-4 py-1.5 text-charcoal">
                      {panel.tag}
                    </span>
                    <span className="u-util text-ink-muted">
                      {String(index + 1).padStart(2, '0')}
                      <span className="opacity-45"> / {String(N).padStart(2, '0')}</span>
                    </span>
                  </motion.div>

                  <motion.h3
                    variants={letters(reduced)}
                    className="u-display mt-6 text-[clamp(2.5rem,7vw,4.25rem)]"
                    aria-label={`${panel.lead} ${panel.tail}`}
                  >
                    <Glyphs word={panel.lead} reduced={reduced} />{' '}
                    <Glyphs word={panel.tail} reduced={reduced} className="text-accent" />
                  </motion.h3>

                  <motion.p
                    variants={rise}
                    className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-70"
                  >
                    {panel.body}
                  </motion.p>

                  <motion.div variants={rise} className="mt-8">
                    <Link
                      to={panel.to}
                      className="group u-util inline-flex min-h-[44px] items-center gap-2.5 text-charcoal transition-colors hover:text-accent motion-reduce:transition-none"
                    >
                      <span className="relative">
                        {panel.cue}
                        {/* Rule that draws itself in from the left on hover. */}
                        <span className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
                      </span>
                      <Arrow className="transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* ── Controls ─────────────────────────────────────────── */}
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="flex min-w-[11rem] flex-1 items-center gap-2">
                  {PANELS.map((p, i) => (
                    <button
                      key={p.tag}
                      type="button"
                      onClick={() => jump(i)}
                      aria-label={`${p.lead} ${p.tail}`}
                      aria-current={i === index}
                      className="group relative h-11 flex-1"
                    >
                      {/* The active track is marked on the track itself, not
                          only by the sweep — a bar frozen at 0% by a hover
                          still has to say which one it is. */}
                      <span
                        className={`u-retint absolute inset-x-0 top-1/2 block -translate-y-1/2 overflow-hidden rounded-full transition-all duration-300 motion-reduce:transition-none ${
                          i === index
                            ? 'h-[5px] bg-feature-soft'
                            : 'h-[3px] bg-charcoal-12 group-hover:h-[5px]'
                        }`}
                      >
                        <span
                          key={index}
                          className="u-retint block h-full w-full origin-left rounded-full bg-feature-deep"
                          style={
                            i === index
                              ? {
                                  animation: `ts-sweep ${DWELL}ms linear forwards`,
                                  animationPlayState: playing ? 'running' : 'paused',
                                  /* Frozen or unplayable, the bar still has to
                                     read as "this one" rather than as empty. */
                                  transform: playing ? undefined : 'scaleX(1)',
                                }
                              : { transform: i < index ? 'scaleX(1)' : 'scaleX(0)' }
                          }
                        />
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Step label="Previous" onClick={prev} side="left" />
                  <Step label="Next" onClick={() => next(-1)} side="right" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Deck card ─────────────────────────────────────────────────────────── */

/**
 * Two nested motion elements on purpose. The outer one owns the card's slot in
 * the fan and is animated by React state; the inner one owns the drag offset
 * and the tilt derived from it. Kept on one element, the slot rotation and the
 * drag rotation would be the same motion value fighting over who writes to it.
 */
function DeckCard({
  panel,
  offset,
  isTop,
  dir,
  reduced,
  exiting,
  onExited,
  onThrow,
  onOpen,
}: {
  panel: (typeof PANELS)[number]
  offset: number
  isTop: boolean
  dir: 1 | -1
  reduced: boolean
  exiting: { flyX: 1 | -1 } | null
  onExited: () => void
  onThrow: (flyX: 1 | -1) => void
  onOpen: () => void
}) {
  const x = useMotionValue(0)
  const controls = useAnimationControls()
  const tilt = useTransform(x, [-260, 0, 260], [-15, 0, 15])
  /* The photo lags the card it sits in — a small parallax that makes the card
     feel like a window rather than a printed tile. */
  const photoX = useTransform(x, [-260, 260], [26, -26])
  const grabbed = useRef<{ x: number; y: number } | null>(null)

  const hidden = offset >= SLOTS.length
  const target = hidden ? (dir === -1 ? OFFSTAGE : TUCKED) : SLOTS[offset]

  /* A card thrown off-screen has to be back at rest before it reappears at the
     bottom of the fan. It's already invisible by then, so this never shows. */
  useEffect(() => {
    if (!isTop) controls.set({ x: 0, opacity: 1 })
  }, [isTop, controls])

  useEffect(() => {
    if (!exiting) return
    let live = true
    controls
      .start({
        x: exiting.flyX * 640,
        opacity: 0,
        transition: { duration: reduced ? 0 : 0.42, ease: [0.32, 0, 0.26, 1] },
      })
      .then(() => {
        if (live) onExited()
      })
    return () => {
      live = false
    }
  }, [exiting, controls, reduced, onExited])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const far = Math.abs(info.offset.x) > THROW_DISTANCE
    const fast = Math.abs(info.velocity.x) > THROW_VELOCITY
    if (far || fast) onThrow(info.offset.x < 0 ? -1 : 1)
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: N - offset, transformOrigin: '50% 130%' }}
      initial={false}
      animate={target}
      transition={
        hidden || reduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: 240, damping: 28, mass: 0.9 }
      }
    >
      <motion.div
        className={`h-full w-full ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
        style={{ x, rotate: tilt }}
        animate={controls}
        drag={isTop && !exiting ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.72}
        dragMomentum={false}
        onDragEnd={onDragEnd}
        onPointerDown={(e) => {
          grabbed.current = { x: e.clientX, y: e.clientY }
        }}
        onClick={(e) => {
          const from = grabbed.current
          grabbed.current = null
          /* A throw ends in a click event too. Only a pointer that barely
             moved counts as someone tapping the card. */
          if (!from) return
          if (Math.hypot(e.clientX - from.x, e.clientY - from.y) < 6) onOpen()
        }}
      >
        <div
          data-feature={panel.feature}
          aria-hidden={!isTop}
          className={`u-retint relative h-full w-full overflow-hidden rounded-lg2 bg-feature-soft ${
            isTop ? 'shadow-deck' : 'shadow-card'
          }`}
        >
          <motion.div className="absolute inset-0 scale-[1.12]" style={{ x: photoX }}>
            <PhotoSlot
              src={panel.image}
              alt={`${panel.lead} ${panel.tail}`}
              slot={panel.slot}
              className="!rounded-none"
            />
          </motion.div>

          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: 'var(--scrim)' }}
          />

          <span className="u-util u-retint absolute left-6 top-6 inline-flex items-center rounded-full bg-feature-fill px-3.5 py-1.5 text-[0.6875rem] text-charcoal">
            {panel.tag}
          </span>

          <h3 className="u-display absolute inset-x-6 bottom-6 text-[1.75rem] text-milk">
            {panel.lead} <span className="text-accent-bright">{panel.tail}</span>
          </h3>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Copy animation ────────────────────────────────────────────────────── */

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

/** The whole copy block leaves in the direction the deck is turning. */
function stack(reduced: boolean, dir: 1 | -1): Variants {
  if (reduced) {
    return { hidden: { opacity: 1 }, show: { opacity: 1 }, out: { opacity: 1 } }
  }
  return {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
    out: {
      opacity: 0,
      x: dir * -26,
      transition: { duration: 0.2, ease: 'easeIn', staggerChildren: 0 },
    },
  }
}

function letters(reduced: boolean): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.026 } },
  }
}

const glyph: Variants = {
  hidden: { opacity: 0, y: '0.45em', rotateX: -75 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.5, ease: EASE } },
}

/**
 * The word, flipped up character by character. Marked aria-hidden — the heading
 * carries the whole phrase as an aria-label, so a screen reader never has to
 * hear it spelt out one span at a time.
 */
function Glyphs({
  word,
  reduced,
  className = '',
}: {
  word: string
  reduced: boolean
  className?: string
}) {
  if (reduced) return <span className={className}>{word}</span>
  return (
    <span aria-hidden className={`inline-block ${className}`}>
      {word.split('').map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          variants={glyph}
          className="inline-block"
          style={{ transformOrigin: '50% 100%' }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/* ── Controls ──────────────────────────────────────────────────────────── */

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
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      className="group grid h-12 w-12 shrink-0 place-items-center rounded-full bg-charcoal text-milk transition-colors duration-200 hover:bg-charcoal-2 motion-reduce:transition-none"
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
