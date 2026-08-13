import { useRef, useState } from 'react'
import Headline from '../components/Headline'
import PageHero from '../components/PageHero'
import { PillButton } from '../components/Pill'
import Reveal from '../components/Reveal'
import { SHOP } from '../data/site'
import { usePageFeature } from '../lib/feature'

const OCCASIONS = [
  { id: 'birthdays', title: 'Birthdays', body: 'Trays of drinks instead of a cake nobody finishes.' },
  { id: 'offices', title: 'Offices', body: 'A run for the floor. Tell us how many and roughly what people like.' },
  { id: 'weddings', title: 'Weddings', body: 'Usually late in the night, when the bar has stopped being the answer.' },
  { id: 'study', title: 'Study groups', body: 'Exam season. Big orders, one pickup, everyone gets what they asked for.' },
]

type FieldName = 'name' | 'email' | 'date' | 'people' | 'detail'
type Errors = Partial<Record<FieldName, string>>

/** Messages say what went wrong and how to fix it, never just "invalid". */
function validate(name: FieldName, value: string): string | undefined {
  const v = value.trim()
  switch (name) {
    case 'name':
      return v ? undefined : 'Add a name so we know who to reply to.'
    case 'email':
      if (!v) return 'We need an email to reply to.'
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? undefined
        : 'That address is missing an @ or a domain.'
    case 'date':
      return v ? undefined : 'Pick the date you need the order for.'
    case 'people':
      if (!v) return 'Roughly how many people — an estimate is fine.'
      return Number(v) > 0 ? undefined : 'Enter a number greater than zero.'
    case 'detail':
      return v ? undefined : 'A sentence about the occasion is enough.'
  }
}

export default function Catering() {
  usePageFeature('strawberry')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const onBlur = (name: FieldName) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validate(name, e.target.value) }))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next: Errors = {}
    ;(['name', 'email', 'date', 'people', 'detail'] as FieldName[]).forEach((n) => {
      const msg = validate(n, String(data.get(n) ?? ''))
      if (msg) next[n] = msg
    })
    setErrors(next)
    setTouched({ name: true, email: true, date: true, people: true, detail: true })

    const first = Object.keys(next)[0] as FieldName | undefined
    if (first) {
      // Send focus to the first thing that needs fixing.
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 700)
  }

  return (
    <>
      <PageHero
        feature="strawberry"
        eyebrow="Bigger orders"
        lead="Bring it to your"
        tail="people"
        intro="Birthdays, offices, weddings and study groups. It’s the same drinks, made in volume, with enough notice that nobody has to rush."
      />

      <section data-feature="strawberry" className="section-clip bg-milk py-[var(--section-y)]">
        <div className="mx-auto max-w-shell px-[var(--gutter)]">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OCCASIONS.map((o, i) => (
              <li key={o.id} className="flex">
                <Reveal delay={i * 0.05} className="flex w-full">
                  <div className="u-retint w-full rounded-lg2 bg-sand p-7">
                    <h2 className="u-display text-[1.375rem]">{o.title}</h2>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-70">{o.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-start">
            <Reveal>
              <Headline
                lead="Tell us what you’re"
                tail="planning"
                className="max-w-[14ch] text-[clamp(2rem,4.5vw,3.25rem)]"
              />
              <p className="mt-5 max-w-measure text-ink-70">
                Lead times, minimum orders and pricing all come from the shop directly — we haven’t
                published numbers here because they aren’t confirmed yet.
              </p>
              <p className="mt-6 text-ink-70">
                In a hurry? Call{' '}
                <a
                  href={SHOP.phoneHref}
                  className="inline-flex min-h-[44px] items-center text-ink underline underline-offset-4"
                >
                  {SHOP.phone}
                </a>
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              {/* Success replaces the form, and announces itself. */}
              <div aria-live="polite">
                {status === 'sent' ? (
                  <div className="rounded-lg2 border-line border-charcoal p-9">
                    <h2 className="u-display text-[1.75rem]">That’s in.</h2>
                    <p className="mt-4 text-ink-70">
                      Nothing was actually sent — this is a demo form with no address behind it yet.
                      On the live site it would reach the shop directly.
                    </p>
                    <PillButton
                      variant="outline"
                      onClick={() => {
                        setStatus('idle')
                        setErrors({})
                        setTouched({})
                      }}
                      className="mt-7"
                    >
                      Send another
                    </PillButton>
                  </div>
                ) : (
                  <form
                    ref={formRef}
                    onSubmit={onSubmit}
                    noValidate
                    className="rounded-lg2 border border-charcoal-12 p-7 sm:p-9"
                  >
                    <p className="text-[0.875rem] text-ink-muted">
                      All fields required unless noted.
                    </p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <Field
                        name="name"
                        label="Your name"
                        autoComplete="name"
                        error={touched.name ? errors.name : undefined}
                        onBlur={onBlur('name')}
                      />
                      <Field
                        name="email"
                        label="Email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        error={touched.email ? errors.email : undefined}
                        onBlur={onBlur('email')}
                      />
                      <Field
                        name="date"
                        label="Date you need it"
                        type="date"
                        error={touched.date ? errors.date : undefined}
                        onBlur={onBlur('date')}
                      />
                      <Field
                        name="people"
                        label="Roughly how many"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        helper="An estimate is fine."
                        error={touched.people ? errors.people : undefined}
                        onBlur={onBlur('people')}
                      />
                    </div>

                    <Field
                      name="detail"
                      label="What’s the occasion"
                      as="textarea"
                      className="mt-5"
                      helper="Drinks, timing, pickup or delivery — whatever you already know."
                      error={touched.detail ? errors.detail : undefined}
                      onBlur={onBlur('detail')}
                    />

                    <PillButton
                      type="submit"
                      disabled={status === 'sending'}
                      className="mt-7 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {status === 'sending' ? 'Sending…' : 'Send enquiry'}
                    </PillButton>
                    <p className="mt-4 text-[0.875rem] text-ink-muted">
                      Demo form — it doesn’t send anywhere yet.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

function Field({
  name,
  label,
  type = 'text',
  as = 'input',
  helper,
  error,
  className = '',
  ...rest
}: {
  name: FieldName
  label: string
  type?: string
  as?: 'input' | 'textarea'
  helper?: string
  error?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const helperId = `${name}-helper`
  const errorId = `${name}-error`
  const describedBy = [helper ? helperId : null, error ? errorId : null].filter(Boolean).join(' ')

  const field =
    'mt-2 w-full rounded-card border bg-milk px-4 py-3 text-ink transition-colors focus:outline-none motion-reduce:transition-none ' +
    (error ? 'border-danger' : 'border-charcoal-12 focus:border-charcoal')

  return (
    <div className={className}>
      <label htmlFor={name} className="u-util block text-ink-70">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={field}
          {...rest}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={field}
          {...rest}
        />
      )}
      {helper ? (
        <p id={helperId} className="mt-1.5 text-[0.8125rem] text-ink-muted">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] text-danger">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden className="mt-0.5 shrink-0">
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.9 12.1H9.1v-1.8h1.8v1.8Zm0-3.2H9.1V5.6h1.8v5.3Z" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  )
}
