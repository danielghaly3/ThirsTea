import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

/**
 * Back to top, as a cup you fill by reading.
 *
 * The scroll position is the fill level: empty at the top of the page, full at
 * the bottom, tea sloshing at whatever line you've reached. Pressing it scrolls
 * home — and because the fill is bound to the scroll and not to a canned
 * animation, the cup drains on the way up on its own. The gesture and the
 * feedback are the same quantity.
 *
 * It takes its tea from the page's feature colour, so it holds taro on the wall
 * page and mango on a mango slide.
 */

/* Cup interior, in viewBox units. The liquid surface travels between these. */
const EMPTY_Y = 66
const FULL_Y = 23.5

/* One wave period. The wave path is four periods wide, so sliding it exactly
   one period and starting over is seamless. */
const PERIOD = 32

const WAVE =
  'M-16,0 q8,-3.4 16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 V64 H-16 Z'

/** Tapioca, resting on the bottom of the cup where it belongs. */
const PEARLS = [
  { cx: 20.5, cy: 60.5, r: 2.9, dur: 3.1, delay: 0 },
  { cx: 27.5, cy: 61.8, r: 3.1, dur: 3.7, delay: 0.4 },
  { cx: 34.6, cy: 60.6, r: 2.8, dur: 3.3, delay: 0.8 },
  { cx: 24, cy: 55.6, r: 2.6, dur: 4.1, delay: 0.2 },
  { cx: 31.2, cy: 55.9, r: 2.5, dur: 3.5, delay: 1 },
]

export default function ScrollCup() {
  const reduced = useReducedMotion() ?? false
  const { scrollY, scrollYProgress } = useScroll()

  const [shown, setShown] = useState(false)
  const [full, setFull] = useState(false)
  /* Bumped on every press. Re-keys the straw bubbles so they replay. */
  const [sip, setSip] = useState(0)

  /* The raw progress jumps a whole wheel-notch at a time; the spring turns that
     into liquid that settles. Under reduced motion the raw value is used
     directly — no overshoot, no slosh. */
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })
  const surfaceSmooth = useTransform(smooth, [0, 1], [EMPTY_Y, FULL_Y])
  const surfaceInstant = useTransform(scrollYProgress, [0, 1], [EMPTY_Y, FULL_Y])

  useMotionValueEvent(scrollY, 'change', (y) => setShown(y > 180))
  useMotionValueEvent(scrollYProgress, 'change', (p) => setFull(p > 0.985))

  /* A route change scrolls to 0 without a scroll event on some browsers, which
     would leave the cup hanging there over a fresh page. */
  useEffect(() => {
    setShown(window.scrollY > 180)
  }, [])

  const toTop = () => {
    setSip((n) => n + 1)
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <AnimatePresence>
      {shown ? (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          /* Lands under the mobile nav sheet (z-50) on purpose — the cup has no
             business floating over a full-screen menu. */
          className="group fixed bottom-5 right-4 z-[45] grid place-items-center sm:bottom-8 sm:right-7"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 28, rotate: -18 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20, rotate: 12 }}
          transition={
            reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 20, mass: 0.7 }
          }
          whileHover={reduced ? undefined : { scale: 1.09, rotate: -5 }}
          whileTap={reduced ? undefined : { scale: 0.9, rotate: 3 }}
        >
          {/* Label, sliding out from behind the cup on hover. */}
          <span
            /* No breakpoint on the transform utilities — a `sm:` variant would
               sort after `group-hover` and win, freezing the slide. */
            className="u-util pointer-events-none absolute right-full mr-3 hidden translate-x-3 whitespace-nowrap rounded-full bg-charcoal px-4 py-2 text-[0.6875rem] text-milk opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none sm:block"
            aria-hidden
          >
            Back to top
          </span>

          {/* Ring that breathes once the cup is full — the only moment the
              button has anything extra to say. */}
          {full && !reduced ? (
            <motion.span
              aria-hidden
              className="u-retint absolute inset-0 -z-10 rounded-full bg-feature"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: [0, 0.3, 0], scale: [0.7, 1.35, 1.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
          ) : null}

          <svg
            viewBox="0 0 56 74"
            className="h-[4.5rem] w-[3.4rem]"
            style={{ filter: 'var(--cup-shadow)' }}
            aria-hidden
          >
            <defs>
              {/* The inside of the cup. Everything wet is clipped to this. */}
              <clipPath id="cup-inside">
                <path d="M10.8,23.6 H45.2 L40.6,61.8 Q40.2,64.6 37.3,64.6 H18.7 Q15.8,64.6 15.4,61.8 Z" />
              </clipPath>
            </defs>

            {/* Straw. Drawn first so the lid caps it where it enters. */}
            <g
              className="transition-transform duration-500 ease-out group-hover:-rotate-[7deg] motion-reduce:transition-none"
              style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
            >
              <path
                d="M32.5,60 L47,3"
                stroke="var(--charcoal)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M35,48 L45,9"
                stroke="var(--milk)"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
                opacity="0.3"
              />
            </g>

            {/* Cup wall */}
            <path
              d="M9,22 H47 L42,62 Q41.6,66 37.6,66 H18.4 Q14.4,66 14,62 Z"
              fill="var(--milk)"
              stroke="var(--charcoal)"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            <g clipPath="url(#cup-inside)">
              {/* Pearls sit under the tea. The liquid over them is translucent,
                  so a submerged pearl takes the drink's colour and a dry one
                  stays black — the wetting is free, not drawn twice. */}
              {PEARLS.map((p) => (
                <motion.circle
                  key={`${p.cx}-${p.cy}`}
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r}
                  fill="var(--charcoal)"
                  animate={reduced ? undefined : { y: [0, -1.4, 0] }}
                  transition={{
                    duration: p.dur,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}

              {/* The tea. One group carries the level, two nested groups carry
                  the slosh in opposite directions. */}
              <motion.g style={{ y: reduced ? surfaceInstant : surfaceSmooth }}>
                <motion.g
                  animate={reduced ? undefined : { x: [0, -PERIOD] }}
                  transition={{ duration: 4.6, repeat: Infinity, ease: 'linear' }}
                >
                  <path d={WAVE} fill="var(--feature)" opacity="0.4" transform="translate(0,2)" />
                </motion.g>
                <motion.g
                  animate={reduced ? undefined : { x: [-PERIOD, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                >
                  {/* Not opaque — a submerged pearl has to read through it. */}
                  <path d={WAVE} fill="var(--feature)" opacity="0.82" />
                </motion.g>
              </motion.g>

              {/* Sheen down the inside of the near wall. */}
              <path
                d="M17.8,29 L19.4,48"
                stroke="var(--milk)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.3"
                fill="none"
              />
            </g>

            {/* Lid and rim, over the top of the wall and the straw. */}
            <rect x="6" y="13" width="44" height="9.5" rx="4.75" fill="var(--charcoal)" />
            <path
              d="M9.5,17.8 H46.5"
              stroke="var(--milk)"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.26"
            />

            {/* Bubbles up the straw on every press — the sip that takes you
                back to the top. */}
            {sip > 0 && !reduced ? (
              <g key={sip}>
                {[0, 0.13, 0.26].map((delay, i) => (
                  <motion.circle
                    key={i}
                    cx={33.5}
                    cy={56}
                    r={1.5 - i * 0.25}
                    fill="var(--feature)"
                    /* Travels along the straw's own gradient, not straight up. */
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 1, 0], x: 11, y: -44 }}
                    transition={{ duration: 0.85, delay, ease: 'easeOut' }}
                  />
                ))}
              </g>
            ) : null}
          </svg>
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
