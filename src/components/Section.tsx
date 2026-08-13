import type { ReactNode } from 'react'
import type { Feature } from '../data/site'

/**
 * A page section. `feature` sets --feature for everything inside it, which is
 * how the retint stays a one-line change rather than a prop drilled everywhere.
 */
export default function Section({
  id,
  feature,
  children,
  className = '',
  tone = 'milk',
}: {
  id?: string
  feature?: Feature
  children: ReactNode
  className?: string
  tone?: 'milk' | 'soft'
}) {
  return (
    <section
      id={id}
      data-feature={feature}
      className={`section-clip relative ${tone === 'soft' ? 'u-retint bg-feature-soft' : 'bg-milk'} ${className}`}
    >
      <div className="mx-auto max-w-shell px-[var(--gutter)] py-[var(--section-y)]">{children}</div>
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="u-util text-ink-muted">{children}</p>
}

/** The oversized tonal disc the references put behind everything. */
export function TonalCircle({
  className = '',
  size = '46rem',
}: {
  className?: string
  size?: string
}) {
  return (
    <div
      aria-hidden
      className={`u-retint pointer-events-none absolute rounded-full bg-feature-soft ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
