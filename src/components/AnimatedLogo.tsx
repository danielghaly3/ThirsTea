import { useId } from 'react'

/**
 * The logo ident: a brown-sugar tide breathing through the wordmark.
 *
 * Pure SVG and CSS, deliberately. This was previously a Remotion Player, and
 * every fault it had was a playback fault — a StrictMode double-mount that
 * left it reporting isPlaying() while its frame loop was detached, a loop that
 * restarted on a blank frame, an imperative play() that silently no-opped.
 * Each needed JavaScript to notice and JavaScript to repair, and the failures
 * were environment-dependent enough to pass every automated check and still
 * show a still frame on a real machine.
 *
 * A CSS animation has none of that surface. It needs no script to start, no
 * ref to attach and no retry to keep it honest; it runs on the compositor and
 * survives tab throttling. There is no state in which this renders a stopped
 * animation, because there is no play state to get wrong.
 *
 * The mark is drawn twice: once in charcoal, and once in cream inside a group
 * masked to the liquid. Where the tide covers a letter, the cream copy shows
 * through — so the liquid isn't decorating the logo, it's drawing it. The
 * charcoal copy is never masked and never animated, which means the wordmark
 * is legible at every instant, including before a single frame has run.
 */

/** Baseline of the tide, in viewBox units. Breathing swings ±7 either side. */
const TIDE_Y = 50

/**
 * One wave, far wider than the frame so it can travel without running out.
 * Period 25, so sliding exactly 25 units returns it to itself — that's what
 * makes the travel loop seamless rather than merely smooth.
 */
const WAVE = (() => {
  const period = 25
  const amp = 2.4
  let d = `M-100,0 q${period / 4},${-amp} ${period / 2},0`
  for (let x = -100 + period / 2; x < 200; x += period / 2) d += ` t${period / 2},0`
  return `${d} V220 H-100 Z`
})()

/** Tapioca, resting below the tide line at every point in the cycle. */
const PEARLS = [
  { cx: 39, cy: 74, r: 3.4, delay: '0s' },
  { cx: 50, cy: 78.5, r: 3.9, delay: '-1.6s' },
  { cx: 61, cy: 74.5, r: 3.2, delay: '-3.1s' },
  { cx: 44.5, cy: 68, r: 2.7, delay: '-2.2s' },
  { cx: 56, cy: 68.5, r: 2.5, delay: '-4.3s' },
]

export default function AnimatedLogo() {
  const id = useId()
  const tide = `${id}-tide`
  const swell = `${id}-swell`

  return (
    <div
      role="img"
      aria-label="ThirsTEA logo"
      className="relative h-full w-full overflow-hidden rounded-full border border-charcoal-12 bg-milk shadow-lift"
    >
      {/* viewBox does the responsive work — the ident is resolution-free and
          needs no breakpoint of its own. */}
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <defs>
          {/* Two masks, same shape, different speeds and depths, so the
              surface reads as a body of liquid rather than one drawn line. */}
          <mask id={swell} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
            <rect width="100" height="100" fill="black" />
            <g transform={`translate(0 ${TIDE_Y + 2.4})`}>
              <g className="ts-tide-breathe" style={{ animationDelay: '-1.2s' }}>
                <g className="ts-tide-drift">
                  <path d={WAVE} fill="white" />
                </g>
              </g>
            </g>
          </mask>

          <mask id={tide} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
            <rect width="100" height="100" fill="black" />
            <g transform={`translate(0 ${TIDE_Y})`}>
              <g className="ts-tide-breathe">
                <g className="ts-tide-travel">
                  <path d={WAVE} fill="white" />
                </g>
              </g>
            </g>
          </mask>
        </defs>

        {/* 1 — the wordmark in charcoal. Never masked, never animated. */}
        <Mark tone="var(--charcoal)" />

        {/* 2 — tapioca. Always below the tide line, so always under liquid. */}
        {PEARLS.map((p) => (
          <circle
            key={p.cx}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="var(--charcoal)"
            className="ts-pearl-bob"
            style={{ animationDelay: p.delay }}
          />
        ))}

        {/* 3 — the back swell, then the tide itself. */}
        <rect width="100" height="100" fill="var(--feature)" opacity="0.4" mask={`url(#${swell})`} />

        <g mask={`url(#${tide})`}>
          <rect width="100" height="100" fill="var(--feature)" opacity="0.94" />
          {/* 4 — the same mark in cream, clipped to the liquid. Where the
              surface crosses a letter, the letter changes colour. */}
          <Mark tone="var(--milk)" />
        </g>
      </svg>
    </div>
  )
}

/**
 * Pearl and wordmark, drawn identically in two colourways.
 *
 * textLength pins the wordmark's width in viewBox units instead of trusting
 * font metrics, so the lockup keeps its proportions and stays inside the
 * circle even on the first paint, before Oswald has loaded.
 */
function Mark({ tone }: { tone: string }) {
  return (
    <g fill={tone}>
      <circle cx="20.5" cy="50" r="6.6" />
      <text
        x="31.5"
        y="50"
        textLength="54"
        lengthAdjust="spacingAndGlyphs"
        dominantBaseline="central"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        THIRSTEA
      </text>
    </g>
  )
}
