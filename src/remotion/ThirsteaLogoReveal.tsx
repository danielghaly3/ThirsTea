import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from 'remotion'

/**
 * A short logo ident built for the embedded Remotion Player on the home page.
 * Every movement is derived from the Remotion frame so the sequence is
 * deterministic in the browser and remains renderable later if needed.
 */
export default function ThirsteaLogoReveal() {
  const frame = useCurrentFrame()

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
      <Interactive.Div
        name="Feature halo"
        style={{
          border: '3px solid var(--feature-deep)',
          borderRadius: '50%',
          height: '74%',
          opacity: interpolate(frame, [0, 26, 52], [0, 0.22, 0], {
            easing: Easing.bezier(0.22, 1, 0.36, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          position: 'absolute',
          scale: interpolate(frame, [0, 52], [0.54, 1.08], {
            easing: Easing.bezier(0.22, 1, 0.36, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            output: 'perceptual-scale',
          }),
          width: '74%',
        }}
      />

      <Interactive.Div
        name="Logo lockup"
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: 34,
          justifyContent: 'center',
          padding: '0 68px',
          width: '100%',
        }}
      >
        <Interactive.Div
          name="Tapioca pearl"
          style={{
            backgroundColor: 'var(--charcoal)',
            borderRadius: '50%',
            boxShadow: '0 20px 34px -22px rgba(30, 22, 17, 0.72)',
            flex: '0 0 auto',
            height: 142,
            opacity: interpolate(frame, [0, 5], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            scale: interpolate(frame, [0, 32], [0.14, 1], {
              easing: Easing.spring({ damping: 12, mass: 0.7, stiffness: 115 }),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              output: 'perceptual-scale',
            }),
            translate: interpolate(frame, [0, 32], ['0px -300px', '0px 0px'], {
              easing: Easing.spring({ damping: 12, mass: 0.7, stiffness: 115 }),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            width: 142,
          }}
        >
          <Interactive.Div
            name="Pearl highlight"
            style={{
              backgroundColor: 'var(--milk)',
              borderRadius: '50%',
              height: 28,
              left: 28,
              opacity: interpolate(frame, [26, 42], [0, 0.34], {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              position: 'absolute',
              top: 24,
              width: 28,
            }}
          />
        </Interactive.Div>

        <Interactive.Div
          name="Wordmark group"
          style={{
            overflow: 'hidden',
            padding: '22px 0 30px',
          }}
        >
          <Interactive.Div
            name="ThirsTEA wordmark"
            style={{
              color: 'var(--charcoal)',
              fontFamily: 'var(--font-display)',
              fontSize: 144,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 0.92,
              opacity: interpolate(frame, [12, 34], [0, 1], {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              textTransform: 'uppercase',
              translate: interpolate(frame, [12, 38], ['80px 0px', '0px 0px'], {
                easing: Easing.spring({ damping: 18, mass: 0.8, stiffness: 105 }),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              whiteSpace: 'nowrap',
            }}
          >
            ThirsTEA
          </Interactive.Div>

          <Interactive.Div
            name="Caramel underline"
            style={{
              backgroundColor: 'var(--caramel)',
              borderRadius: 999,
              height: 12,
              marginTop: 20,
              scale: interpolate(frame, [30, 54], [0, 1], {
                easing: Easing.bezier(0.22, 1, 0.36, 1),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                output: 'perceptual-scale',
              }),
              transformOrigin: 'left center',
              width: '100%',
            }}
          />
        </Interactive.Div>
      </Interactive.Div>

      <Interactive.Div
        name="First orbiting pearl"
        style={{
          backgroundColor: 'var(--caramel)',
          borderRadius: '50%',
          height: 26,
          opacity: interpolate(frame, [38, 54], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          position: 'absolute',
          right: '14%',
          scale: interpolate(frame, [38, 62], [0.2, 1], {
            easing: Easing.spring({ damping: 14 }),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            output: 'perceptual-scale',
          }),
          top: '20%',
          translate: interpolate(frame, [38, 62], ['48px 48px', '0px 0px'], {
            easing: Easing.spring({ damping: 14 }),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          width: 26,
        }}
      />

      <Interactive.Div
        name="Second orbiting pearl"
        style={{
          backgroundColor: 'var(--feature-deep)',
          borderRadius: '50%',
          bottom: '19%',
          height: 18,
          left: '17%',
          opacity: interpolate(frame, [46, 62], [0, 0.78], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          position: 'absolute',
          scale: interpolate(frame, [46, 70], [0.2, 1], {
            easing: Easing.spring({ damping: 14 }),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            output: 'perceptual-scale',
          }),
          translate: interpolate(frame, [46, 70], ['-42px -34px', '0px 0px'], {
            easing: Easing.spring({ damping: 14 }),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          width: 18,
        }}
      />
    </AbsoluteFill>
  )
}
