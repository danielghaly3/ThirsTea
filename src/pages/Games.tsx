import Headline from '../components/Headline'
import PageHero from '../components/PageHero'
import { PillLink } from '../components/Pill'
import { GAMES_INTRO, SHELF, STAYING } from '../data/games'
import { usePageFeature } from '../lib/feature'

export default function Games() {
  usePageFeature('wood')
  return (
    <>
      <PageHero
        feature="wood"
        eyebrow="Come for the boba, stay for the table"
        lead="Games & long"
        tail="sits"
        intro={GAMES_INTRO}
      />

      <section data-feature="wood" className="section-clip bg-milk pb-[var(--section-y)]">
        <div className="mx-auto max-w-shell px-[var(--gutter)]">
          <ul className="grid gap-5 md:grid-cols-3">
            {SHELF.map((s) => (
              <li key={s.id} className="u-retint rounded-card bg-feature-soft p-8">
                <h2 className="u-display text-[1.5rem]">{s.title}</h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-70">{s.body}</p>
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-measure text-[0.9375rem] text-ink-muted">
            We’ve deliberately not listed titles — the shelf changes, and we’d rather not tell you a
            game is there and be wrong. Ask what’s on it.
          </p>

          <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <Headline
                lead="Nobody’s counting your"
                tail="hours"
                className="max-w-[14ch] text-[clamp(1.75rem,3.6vw,2.5rem)]"
              />
              <p className="mt-4 max-w-measure text-ink-70">
                The room does three different jobs depending on when you turn up, and the staff have
                never once hovered by a table waiting for it back.
              </p>
              <PillLink to="/visit" variant="outline" className="mt-8">
                Where to find it
              </PillLink>
            </div>

            <ul className="flex flex-col gap-px overflow-hidden rounded-card border border-ink-12">
              {STAYING.map((s) => (
                <li key={s.id} className="bg-milk p-7">
                  <h3 className="u-util text-ink-muted">{s.title}</h3>
                  <p className="mt-2 text-ink-70">{s.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
