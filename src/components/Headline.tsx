/**
 * The two-tone headline: the phrase runs in one colour and the last word flips
 * to the accent. One accent word per headline, never two.
 *
 *   dark   — on cream and sand
 *   cream  — on espresso
 *   brand  — on the caramel panel, where neither of the above works: the
 *            on-cream accent is caramel-on-caramel (2.0:1) and the on-dark
 *            accent is barely better. Charcoal reads 5.2:1 there and milk 3.1,
 *            so the pair splits across the two instead.
 */
const TONES = {
  dark: { lead: 'text-charcoal', tail: 'text-accent' },
  cream: { lead: 'text-milk', tail: 'text-accent-bright' },
  brand: { lead: 'text-charcoal', tail: 'text-milk' },
} as const

export default function Headline({
  lead,
  tail,
  className = '',
  as: Tag = 'h2',
  tone = 'dark',
}: {
  lead: string
  tail: string
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  tone?: keyof typeof TONES
}) {
  const t = TONES[tone]
  return (
    <Tag className={`u-display ${t.lead} ${className}`}>
      {lead} <span className={t.tail}>{tail}</span>
    </Tag>
  )
}
