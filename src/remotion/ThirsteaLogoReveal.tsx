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

const DURATION = 100

/* Where the tide comes to rest.
   Tuned to land partway UP the letterforms, not below them: the two-tone
   wordmark is the whole point of the ident, so it has to survive into the
   frame that gets held rather than flashing past mid-pour. */
const REST_LEVEL = 48.5

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

/** Tapioca. Each lands on its own beat so they read as poured, not placed. */
const PEARLS = [
  { x: 39, size: 66, from: 6, to: 30, rest: 74 },
  { x: 50, size: 76, from: 10, to: 36, rest: 78 },
  { x: 61.5, size: 62, from: 14, to: 40, rest: 74.5 },
  { x: 45, size: 52, from: 18, to: 44, rest: 68 },
  { x: 56, size: 48, from: 22, to: 47, rest: 68.5 },
]

export default function ThirsteaLogoReveal() {
  const frame = useCurrentFrame()

  /* The tide. Starts below the frame, overshoots slightly, settles back — the
     way liquid actually behaves when it stops moving. */
  const level = interpolate(frame, [6, 52, 68, 82], [128, REST_LEVEL - 3, REST_LEVEL + 1.5, REST_LEVEL], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  /* Choppy while pouring, almost flat once it settles. */
  const amplitude = interpolate(frame, [6, 52, 88], [5.5, 3.2, 1.1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

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
        const drop = interpolate(frame, [p.from, p.to], [-40, p.rest], {
          easing: Easing.spring({ damping: 11, mass: 0.6, stiffness: 120 }),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
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
          opacity: interpolate(frame, [58, 70, 92], [0, 0.9, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          position: 'absolute',
          top: `${level}%`,
          transform: `translateX(${interpolate(frame, [58, 92], [-60, 60], {
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
