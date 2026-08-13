import { motion, useReducedMotion } from 'framer-motion'
import { useShopStatus } from '../lib/hours'

/**
 * Open / closed, right now, on the shop's clock.
 *
 * The dot is never the only signal — the label beside it says "Open until 11
 * p.m." or "Opens at 11 a.m." in words, so the state survives both colour
 * blindness and a screen reader. The pulse only runs while the shop is
 * actually open; a closed shop gets a still dot, which is the point.
 */
export default function OpenBadge({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const reduced = useReducedMotion() ?? false
  const { open, label } = useShopStatus()

  const onDark = tone === 'dark'

  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 ${
        onDark ? 'bg-milk-14 text-milk' : 'bg-neutral text-charcoal'
      }`}
    >
      <span className="relative grid h-2.5 w-2.5 shrink-0 place-items-center">
        {open && !reduced ? (
          <motion.span
            aria-hidden
            className="absolute h-2.5 w-2.5 rounded-full"
            style={{ background: 'var(--matcha)' }}
            animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
          />
        ) : null}
        <span
          aria-hidden
          className="relative h-2.5 w-2.5 rounded-full"
          style={{ background: open ? 'var(--matcha)' : 'var(--ink-muted)' }}
        />
      </span>
      <span className="u-util text-[0.6875rem]">{label}</span>
    </span>
  )
}
