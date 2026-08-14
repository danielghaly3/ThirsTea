import { AbsoluteFill, useCurrentFrame } from 'remotion'

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

/*
 * The cup never empties.
 *
 * An earlier cut of this loop poured the tide in and drained it back off the
 * bottom of the frame. Measured, that left 29% of every cycle — nearly a
 * second and a half in five — with no liquid on screen at all, which is
 * indistinguishable from a logo whose animation has stopped. Anyone glancing
 * over during that window saw a still mark and reasonably concluded it was
 * broken.
 *
 * So the tide now breathes between two levels that both keep liquid in frame.
 * At low water it sits just under the letters; at high water it runs up
 * through them. There is no moment where the mark is dry.
 */
const MID_LEVEL = 50
const SWING = 7

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
 * Tapioca, permanently settled under the surface and drifting on the swell.
 *
 * They used to drop in at the top of the cycle and fall out the bottom at the
 * end of it. With a tide that never leaves, there is nothing to drop into and
 * nothing to strand them — so they simply live there, each riding the water on
 * its own offset so the group never moves as one block.
 */
const PEARLS = [
  { x: 39, size: 66, rest: 74, offset: 0 },
  { x: 50, size: 76, rest: 78, offset: 1.1 },
  { x: 61.5, size: 62, rest: 74.5, offset: 2.2 },
  { x: 45, size: 52, rest: 68, offset: 3.4 },
  { x: 56, size: 48, rest: 68.5, offset: 4.6 },
]

export default function ThirsteaLogoReveal() {
  const frame = useCurrentFrame()

  /*
   * Everything below is a pure function of one angle that completes exactly
   * one turn per loop. That is what makes the repeat seamless — not easing the
   * ends together, but never having ends. Every wave count is a whole number
   * of periods, so frame DURATION is bit-for-bit frame 0 and there is no cut
   * to hide.
   */
  const theta = (frame / DURATION) * Math.PI * 2

  /* Low water at the top of the loop, high water halfway through. */
  const level = MID_LEVEL + SWING * Math.cos(theta)

  /* Choppier at high water, calmer at low. Seamless: cos returns to itself. */
  const amplitude = 2.8 - 1.2 * Math.cos(theta)

  /* Three wave periods per loop on the front swell, two the other way on the
     back one. Whole numbers, so both close exactly where they opened. */
  const clipPath = tideClip(level, theta * 3, amplitude)
  const backClip = tideClip(level + 2.4, theta * -2, amplitude * 0.7)

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

      {/* 2 — tapioca, riding the swell under the surface. */}
      {PEARLS.map((p) => {
        /* Rides the same angle as the tide, so it bobs with the water rather
           than against it, and closes the loop for free. */
        const drop = p.rest + 1.8 * Math.sin(theta + p.offset) + SWING * 0.35 * Math.cos(theta)
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
          /* Zero at both ends of the loop, so the sweep's reset is invisible. */
          opacity: Math.max(0, Math.sin(theta)) * 0.75,
          position: 'absolute',
          top: `${level}%`,
          transform: `translateX(${(-55 + (theta / (Math.PI * 2)) * 110).toFixed(2)}%)`,
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
