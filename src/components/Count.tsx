import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'

/**
 * A number that counts up the first time it's seen.
 *
 * Every figure on this site is one the shop can stand behind, so the arrival is
 * the only thing being animated — the value lands on exactly what was passed in
 * and stays there. Under reduced motion it renders the final figure and never
 * moves.
 */
export default function Count({
  to,
  decimals = 0,
  duration = 1.2,
  delay = 0,
}: {
  to: number
  decimals?: number
  duration?: number
  delay?: number
}) {
  const reduced = useReducedMotion() ?? false
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true, margin: '-40px' })
  const value = useMotionValue(reduced ? to : 0)
  const shown = useTransform(value, (v) => v.toFixed(decimals))

  useEffect(() => {
    if (reduced || !seen) return
    const controls = animate(value, to, { duration, delay, ease: [0.22, 1, 0.36, 1] })
    return () => controls.stop()
  }, [seen, reduced, to, duration, delay, value])

  return (
    <span ref={ref}>
      <motion.span>{shown}</motion.span>
    </span>
  )
}
