import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'fill' | 'light' | 'outline' | 'text'

type Common = {
  variant?: Variant
  children: ReactNode
  className?: string
}

const base =
  'u-util inline-flex items-center justify-center gap-2.5 rounded-full transition-all duration-200 active:translate-y-px motion-reduce:transition-none'

const styles: Record<Variant, string> = {
  /* Deep green, cream label. The default action. */
  fill: `${base} bg-charcoal px-8 py-4 text-milk hover:bg-charcoal-2 hover:shadow-lift`,
  /* Cream on a saturated ground. */
  light: `${base} bg-milk px-8 py-4 text-charcoal shadow-card hover:shadow-lift`,
  outline: `${base} border-line border-charcoal px-8 py-4 text-charcoal hover:bg-charcoal hover:text-milk`,
  text: 'u-util inline-flex min-h-[44px] items-center gap-2 text-charcoal transition-colors hover:text-accent motion-reduce:transition-none',
}

export function PillLink({
  to,
  variant = 'fill',
  children,
  className = '',
  external,
}: Common & { to: string; external?: boolean }) {
  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noreferrer noopener"
        className={`${styles[variant]} ${className}`}
      >
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={`${styles[variant]} ${className}`}>
      {children}
    </Link>
  )
}

export function PillButton({
  onClick,
  variant = 'fill',
  children,
  className = '',
  type = 'button',
  ...rest
}: Common & {
  onClick?: () => void
  type?: 'button' | 'submit'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} onClick={onClick} className={`${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
