/**
 * For scene photography — rooms, walls, the counter — as opposed to masked
 * product cutouts. Same idea as Cutout: a designed stand-in that holds the real
 * crop and names the shot it's waiting for.
 */
export default function PhotoSlot({
  src,
  alt,
  slot,
  className = '',
}: {
  src: string | null
  alt: string
  slot: string
  className?: string
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full rounded-card object-cover ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${alt} — photograph pending`}
      className={`u-retint flex h-full w-full flex-col items-center justify-center gap-3 rounded-card bg-feature-soft ${className}`}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden className="text-ink">
        <rect
          x="2.5"
          y="4.5"
          width="19"
          height="15"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.6"
          opacity="0.5"
        />
        <circle cx="8.5" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.6" opacity="0.5" />
        <path
          d="M3.5 16.5 L9 11.5 L14 15.5 L17 13 L20.5 16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>
      <span className="u-util px-4 text-center text-[0.625rem] text-ink-muted">{slot}</span>
    </div>
  )
}
