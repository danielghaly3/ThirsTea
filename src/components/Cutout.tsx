type Props = {
  /** Real transparent-background PNG once it exists. Null renders the stand-in. */
  src: string | null
  alt: string
  /** Filename this slot is waiting for — shown on the stand-in. */
  slot: string
  className?: string
  /** Cups are tall; waffles and objects are wider. */
  shape?: 'cup' | 'object'
  /** The filename chip is noise below about 8rem — the silhouette carries it. */
  showSlot?: boolean
  /**
   * Fills the silhouette so it occludes whatever sits behind it. The hero layers
   * the product over giant type, and line art alone lets the letters show
   * straight through the cup.
   */
  solid?: boolean
  /** Hero artwork should be fetched immediately; card artwork can remain lazy. */
  priority?: boolean
}

/**
 * The whole aesthetic rests on cutouts that don't exist yet, so the stand-in is
 * designed rather than defaulted: a silhouette at the real crop size, correctly
 * shadowed, labelled with the shot it's waiting for. Composition, scale and
 * overlap all read properly, and dropping in the real PNG is a one-prop change.
 */
export default function Cutout({
  src,
  alt,
  slot,
  className = '',
  shape = 'cup',
  showSlot = true,
  solid = false,
  priority = false,
}: Props) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        /* Without this the browser starts a native image drag and swallows the
           pointerup, so a swipe never completes. */
        draggable={false}
        className={`h-full w-full select-none object-contain drop-shadow-[0_18px_28px_rgba(26,22,19,0.28)] ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${alt} — photograph pending`}
      className={`relative flex h-full w-full flex-col items-center justify-center ${className}`}
    >
      {shape === 'cup' ? <CupLine solid={solid} /> : <ObjectLine solid={solid} />}
      {showSlot ? (
        <span className="u-util mt-3 rounded-full border border-ink-12 bg-milk px-3 py-1 text-[0.625rem] text-ink-muted">
          {slot}
        </span>
      ) : null}
    </div>
  )
}

function CupLine({ solid }: { solid: boolean }) {
  // Takes the drink's own colour so it reads against the cream display word.
  const body = solid ? 'var(--feature-fill, var(--milk))' : 'none'
  return (
    <svg
      viewBox="0 0 120 184"
      aria-hidden
      className="h-[min(100%,30rem)] w-auto max-w-full drop-shadow-[0_16px_24px_rgba(26,22,19,0.2)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M74 6 L86 6 L70 44" />
      <path
        d="M16 40 h88 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-88 a4 4 0 0 1 -4 -4 v-8 a4 4 0 0 1 4 -4 z"
        fill={body}
      />
      <path d="M20 60 L30 168 a8 8 0 0 0 8 7 h44 a8 8 0 0 0 8 -7 L100 60 Z" fill={body} />
      <path d="M24 96 L96 96" opacity="0.35" />
      <circle cx="42" cy="152" r="7" fill="currentColor" opacity="0.9" stroke="none" />
      <circle cx="60" cy="158" r="7" fill="currentColor" opacity="0.9" stroke="none" />
      <circle cx="78" cy="150" r="7" fill="currentColor" opacity="0.9" stroke="none" />
      <circle cx="51" cy="138" r="7" fill="currentColor" opacity="0.9" stroke="none" />
      <circle cx="69" cy="139" r="7" fill="currentColor" opacity="0.9" stroke="none" />
    </svg>
  )
}

function ObjectLine({ solid }: { solid: boolean }) {
  // Takes the drink's own colour so it reads against the cream display word.
  const body = solid ? 'var(--feature-fill, var(--milk))' : 'none'
  return (
    <svg
      viewBox="0 0 160 120"
      aria-hidden
      className="max-h-full w-[min(100%,22rem)] drop-shadow-[0_16px_24px_rgba(26,22,19,0.2)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* A rounded object sitting on a surface, not an arch. */}
      <path
        d="M22 84 C22 48 48 26 80 26 C112 26 138 48 138 84 C138 93 130 99 120 99 L40 99 C30 99 22 93 22 84 Z"
        fill={body}
      />
      <path d="M46 84 C46 60 60 46 80 46" opacity="0.3" />
      <ellipse cx="80" cy="108" rx="46" ry="5" opacity="0.18" />
    </svg>
  )
}
