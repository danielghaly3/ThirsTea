import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'

/**
 * The logo ident: the drink pours in and fills the name.
 *
 * The idea is the shop's signature cup rather than a generic logo build. A
 * brown-sugar tide rises through the wordmark, and wherever it covers a letter
 * that letter turns cream — so the liquid isn't decorating the mark, it's
 * drawing it. Tapioca drops in first and settles under the surface.
 *
 * One rule shapes everything here: THE WORDMARK IS OPAQUE ON EVERY FRAME,
 * frame 0 included. The previous ident opened on an empty stage and faded its
 * letters in, which meant any frame it stalled on — a paused player, a
 * throttled tab, a loop returning to the start — showed an empty circle where
 * the logo should be. Nothing in here animates the wordmark's opacity. The
 * animation only ever changes what colour it is and what's behind it, so the
 * worst case is a still logo instead of a missing one.
 */

const DURATION = 150

/* Where the tide comes to rest.
   Tuned to land partway UP the letterforms, not below them: the two-tone
   wordmark is the point of the ident, so it has to hold there for most of the
   cycle rather than flashing past mid-pour. */
const REST_LEVEL = 48.5

/* Off the bottom of the frame. The cycle begins and ends here, which is what
   makes the loop seamless: the tide is out of sight at both ends, so the wave
   phase resetting is invisible and there is no cut. */
const OFF_FRAME = 130

/** Sine-edged fill line, as a percentage-based polygon clip. */
function tideClip(level: number, phase: number, amplitude: number) {
  const steps = 16
  const points: string[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const y = level + amplitude * Math.sin(t * Math.PI * 3 + phase)
    points.push(`${(t * 100).toFixed(2)}% ${y.toFixed(2)}%`)
  }

  /* Close the shape off the bottom of the frame so only the top edge waves. */
  points.push('100% 140%', '0% 140%')
  return `polygon(${points.join(', ')})`
}

/**
 * Tapioca. Each lands on its own beat so they read as poured, not placed.
 *
 * `from: 0` on the first one: the cycle starts moving on frame 0 with nothing
 * held back, so a loop never sits on a still frame waiting to begin.
 *
 * They leave down the bottom as the cup empties. That matters for the loop —
 * left behind, they'd be stranded as black circles on bare cream once the tide
 * drained out from under them.
 */
const PEARLS = [
  { x: 39, size: 66, from: 0, to: 26, rest: 74 },
  { x: 50, size: 76, from: 3, to: 30, rest: 78 },
  { x: 61.5, size: 62, from: 6, to: 34, rest: 74.5 },
  { x: 45, size: 52, from: 9, to: 36, rest: 68 },
  { x: 56, size: 48, from: 12, to: 38, rest: 68.5 },
]

/** The cycle: pour, hold, sip it back down, repeat. */
const POURED = 42
const SETTLED = 58
const DRAIN_FROM = 102
const DRAIN_TO = 144

export default function ThirsteaLogoReveal() {
  const frame = useCurrentFrame()

  /* The tide, over one full cycle. It moves on frame 0 — no lead-in — pours
     past its resting line, settles back, holds through the middle of the loop,
     then drains away to exactly where it started. Beginning and end are both
     off the bottom of the frame, so the repeat has no seam. */
  const level = interpolate(
    frame,
    [0, POURED, SETTLED, DRAIN_FROM, DRAIN_TO],
    [OFF_FRAME, REST_LEVEL - 3.5, REST_LEVEL, REST_LEVEL, OFF_FRAME],
    {
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  )

  /* Choppy while pouring, almost flat at rest, stirred up again on the way out. */
  const amplitude = interpolate(
    frame,
    [0, POURED, SETTLED + 20, DRAIN_FROM, DRAIN_TO],
    [6, 3.2, 1.2, 2.4, 5],
    {
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  )

  const phase = frame * 0.14
  const clipPath = tideClip(level, phase, amplitude)
  /* The back swell runs the other way and sits a touch deeper, so the surface
     reads as a body of liquid rather than a single drawn line. */
  const backClip = tideClip(level + 2.4, -phase * 0.8, amplitude * 0.7)

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        backgroundColor: 'var(--milk)',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 1 — the wordmark, charcoal. Present and opaque from frame 0. */}
      <Lockup tone="var(--charcoal)" pearlTone="var(--charcoal)" />

      {/* 2 — tapioca, dropped in before the tide arrives to cover them. */}
      {PEARLS.map((p) => {
        const drop = interpolate(
          frame,
          [p.from, p.to, DRAIN_FROM, DRAIN_TO - 4],
          [-40, p.rest, p.rest, 150],
          {
            easing: Easing.spring({ damping: 11, mass: 0.6, stiffness: 120 }),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          },
        )
        return (
          <div
            key={p.x}
            data-logo-pearl
            style={{
              backgroundColor: 'var(--charcoal)',
              borderRadius: '50%',
              height: p.size,
              left: `${p.x}%`,
              position: 'absolute',
              top: `${drop}%`,
              transform: 'translate(-50%, -50%)',
              width: p.size,
            }}
          />
        )
      })}

      {/* 3 — the brown sugar tide, in two swells. */}
      <div
        style={{
          backgroundColor: 'var(--feature)',
          clipPath: backClip,
          inset: 0,
          opacity: 0.42,
          position: 'absolute',
        }}
      />
      <div
        style={{
          backgroundColor: 'var(--feature)',
          clipPath,
          inset: 0,
          opacity: 0.94,
          position: 'absolute',
        }}
      />

      {/*
        4 — the same lockup again in cream, clipped to the identical tide.
        This is the whole trick: one wordmark sits under the liquid and one on
        top of it, sharing a clip path, so the letters appear to change colour
        exactly where the surface crosses them. No text fades, ever.
      */}
      <div style={{ clipPath, inset: 0, position: 'absolute' }}>
        <AbsoluteFill style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
          <Lockup tone="var(--milk)" pearlTone="var(--milk)" />
        </AbsoluteFill>
      </div>

      {/* 5 — a highlight travelling the surface once the pour has landed. */}
      <div
        style={{
          background:
            'linear-gradient(90deg, rgba(251,244,233,0) 0%, rgba(251,244,233,0.5) 50%, rgba(251,244,233,0) 100%)',
          clipPath,
          height: 10,
          left: 0,
          opacity: interpolate(frame, [SETTLED, SETTLED + 14, DRAIN_FROM - 6], [0, 0.9, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          position: 'absolute',
          top: `${level}%`,
          transform: `translateX(${interpolate(frame, [SETTLED, DRAIN_FROM - 6], [-60, 60], {
            easing: Easing.bezier(0.22, 1, 0.36, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}%)`,
          width: '100%',
        }}
      />
    </AbsoluteFill>
  )
}

/** Pearl-and-wordmark, drawn twice at the same place in two colourways. */
function Lockup({ tone, pearlTone }: { tone: string; pearlTone: string }) {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        gap: 36,
        justifyContent: 'center',
        paddingBottom: 40,
        width: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: pearlTone,
          borderRadius: '50%',
          flex: '0 0 auto',
          height: 132,
          width: 132,
        }}
      />
      <div
        style={{
          color: tone,
          fontFamily: 'var(--font-display)',
          fontSize: 150,
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 0.92,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        ThirsTEA
      </div>
    </div>
  )
}

export { DURATION }
