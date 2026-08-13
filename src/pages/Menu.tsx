import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Cutout from '../components/Cutout'
import Headline from '../components/Headline'
import PageHero from '../components/PageHero'
import { PillButton } from '../components/Pill'
import { BESTSELLERS } from '../data/bestsellers'
import { CATEGORIES, PICKER_QUESTIONS, PICKER_RESULTS } from '../data/menu'
import type { PickerAnswer } from '../data/menu'
import {
  ADJUSTABLE,
  MENU_PENDING_COPY,
  MENU_STATUS,
  PRICE_NOTE,
  PRICE_PLACEHOLDER,
} from '../data/site'
import { usePageFeature } from '../lib/feature'

export default function Menu() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id)
  const active = CATEGORIES.find((c) => c.id === activeId)!
  const reduced = useReducedMotion()
  usePageFeature(active.feature)

  return (
    <>
      <PageHero
        feature={active.feature}
        eyebrow="Around eighty drinks"
        lead="The whole"
        tail="menu"
        intro="Pick a category and the page takes its colour. Everything is made when you order it, and everything is adjustable."
      />

      <section data-feature={active.feature} className="section-clip bg-milk pb-[var(--section-y)]">
        <div className="mx-auto max-w-shell px-[var(--gutter)]">
          {/* The review complaint, answered before the list starts. */}
          <div className="u-retint flex flex-wrap items-center gap-x-8 gap-y-2 rounded-card bg-feature-soft px-6 py-5">
            {ADJUSTABLE.map((a) => (
              <span key={a} className="u-util text-ink">
                {a}
              </span>
            ))}
          </div>

          <nav aria-label="Menu categories" className="mt-10">
            <ul className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((c) => {
                const isActive = c.id === activeId
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      aria-current={isActive}
                      className={`u-util u-retint rounded-full px-5 py-3 transition-colors duration-200 motion-reduce:transition-none ${
                        isActive
                          ? 'bg-feature-fill text-ink'
                          : 'border border-ink-12 text-ink-70 hover:border-ink hover:text-ink'
                      }`}
                    >
                      {c.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="mt-12">
            <Headline
              as="h2"
              lead={active.name.split(' ').slice(0, -1).join(' ') || active.name}
              tail={active.name.split(' ').slice(-1)[0]}
              className="text-[clamp(1.75rem,3.4vw,2.5rem)]"
            />
            <p className="mt-3 max-w-measure text-ink-70">{active.blurb}</p>

            <AnimatePresence mode="wait">
              <motion.ul
                key={active.id}
                initial={{ opacity: 0, y: reduced ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -10 }}
                transition={{ duration: reduced ? 0 : 0.28 }}
                className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {active.items.map((item) => {
                  const drink = BESTSELLERS.find((d) => d.id === item.id)
                  return (
                    <li
                      key={item.id}
                      className="flex items-center gap-5 rounded-card border border-ink-12 p-6"
                    >
                      {drink ? (
                        <span className="block h-24 w-20 shrink-0 text-ink">
                          <Cutout
                            src={drink.image}
                            alt={item.name}
                            slot={drink.imageSlot}
                            shape={drink.id === 'bubble-waffle' ? 'object' : 'cup'}
                            showSlot={false}
                          />
                        </span>
                      ) : (
                        <span aria-hidden className="u-retint h-4 w-4 shrink-0 rounded-full bg-feature" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-ink">{item.name}</span>
                        {item.note ? (
                          <span className="mt-1 block text-[0.9375rem] text-ink-70">{item.note}</span>
                        ) : null}
                        <span className="mt-2 block text-[0.9375rem] text-ink-muted">
                          {PRICE_PLACEHOLDER}
                        </span>
                      </span>
                    </li>
                  )
                })}

                {active.items.length === 0 ? (
                  <li className="rounded-card border border-dashed border-ink-12 p-8 sm:col-span-2 lg:col-span-3">
                    <p className="text-ink">
                      We haven’t confirmed the {active.name.toLowerCase()} list yet.
                    </p>
                    <p className="mt-2 max-w-measure text-[0.9375rem] text-ink-muted">
                      Rather than guess at drink names, this space stays empty until the owner sends
                      the real list. Ask at the counter in the meantime — they’ll talk you through
                      it.
                    </p>
                  </li>
                ) : null}
              </motion.ul>
            </AnimatePresence>

            <p className="mt-6 text-[0.9375rem] text-ink-muted">{PRICE_NOTE}.</p>
            {MENU_STATUS === 'partial' ? (
              <p className="mt-2 max-w-measure text-[0.9375rem] text-ink-muted">{MENU_PENDING_COPY}</p>
            ) : null}
          </div>
        </div>
      </section>

      <Picker />
    </>
  )
}

function Picker() {
  const [open, setOpen] = useState(false)
  const [answers, setAnswers] = useState<PickerAnswer[]>([])
  const reduced = useReducedMotion()

  const result = useMemo(() => {
    if (answers.length < 3) return null
    const key = answers.join('|')
    const hit = PICKER_RESULTS[key]
    if (!hit) return null
    const drink = BESTSELLERS.find((d) => d.id === hit.drinkId)
    return drink ? { drink, reason: hit.reason } : null
  }, [answers])

  const step = answers.length

  return (
    <section
      data-feature={result?.drink.feature ?? 'taro'}
      className="section-clip bg-milk pb-[var(--section-y)]"
    >
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <div className="u-retint rounded-lg2 bg-feature-soft px-6 py-12 sm:px-12">
          {!open ? (
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <Headline
                  lead="Not sure what to"
                  tail="order"
                  className="max-w-[14ch] text-[clamp(1.75rem,3.6vw,2.5rem)]"
                />
                <p className="mt-3 max-w-[46ch] text-ink-70">
                  Three questions. One drink. No upselling — it’s the same answer the person at the
                  counter would give you.
                </p>
              </div>
              <PillButton onClick={() => setOpen(true)} className="shrink-0">
                Start
              </PillButton>
            </div>
          ) : (
            <div>
              {step < 3 ? (
                <div>
                  <p className="u-util text-ink-muted">
                    Question {step + 1} of {PICKER_QUESTIONS.length}
                  </p>
                  <h2 className="u-display mt-4 text-[clamp(1.75rem,3.6vw,2.5rem)]">
                    {PICKER_QUESTIONS[step].question}
                  </h2>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {PICKER_QUESTIONS[step].options.map((o) => (
                      <PillButton
                        key={o.value}
                        variant="outline"
                        onClick={() => setAnswers((a) => [...a, o.value])}
                      >
                        {o.label}
                      </PillButton>
                    ))}
                  </div>
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setAnswers((a) => a.slice(0, -1))}
                      className="u-util mt-8 text-ink-muted underline underline-offset-4 hover:text-ink"
                    >
                      Back
                    </button>
                  ) : null}
                </div>
              ) : null}

              <AnimatePresence>
                {result ? (
                  <motion.div
                    initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduced ? 0 : 0.35 }}
                    className="flex flex-col items-start gap-8 md:flex-row md:items-center"
                  >
                    <span className="block h-40 w-32 shrink-0 text-ink">
                      <Cutout
                        src={result.drink.image}
                        alt={`${result.drink.lead} ${result.drink.tail}`}
                        slot={result.drink.imageSlot}
                        shape={result.drink.id === 'bubble-waffle' ? 'object' : 'cup'}
                      />
                    </span>
                    <div>
                      <p className="u-util text-ink-muted">Order this</p>
                      <Headline
                        as="h2"
                        lead={result.drink.lead}
                        tail={result.drink.tail}
                        className="mt-3 text-[clamp(2rem,4.4vw,3rem)]"
                      />
                      <p className="mt-4 max-w-[46ch] text-ink-70">{result.reason}</p>
                      <button
                        type="button"
                        onClick={() => setAnswers([])}
                        className="u-util mt-6 text-ink underline underline-offset-4"
                      >
                        Ask again
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
