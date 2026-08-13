import Cutout from '../components/Cutout'
import Headline from '../components/Headline'
import PageHero from '../components/PageHero'
import { PillLink } from '../components/Pill'
import DealBand from '../sections/DealBand'
import { GIVEAWAYS, GIVEAWAYS_INTRO, TOO_GOOD_TO_GO } from '../data/giveaways'
import { CHALLENGE, LINKS } from '../data/site'
import { usePageFeature } from '../lib/feature'

export default function Deals() {
  usePageFeature('mango')
  return (
    <>
      <PageHero
        feature="mango"
        eyebrow="Rotating, seasonal, unannounced"
        lead="Little"
        tail="things"
        intro={GIVEAWAYS_INTRO}
      />

      <DealBand />

      <section data-feature="mango" className="section-clip bg-milk py-[var(--section-y)]">
        <div className="mx-auto max-w-shell px-[var(--gutter)]">
          <Headline
            lead="What’s been given"
            tail="away"
            className="max-w-[14ch] text-[clamp(2rem,4.4vw,3rem)]"
          />

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GIVEAWAYS.map((g) => (
              <li
                key={g.id}
                className={`flex flex-col rounded-card p-7 ${
                  g.pending ? 'border-line border-dashed border-ink-12' : 'border border-ink-12'
                }`}
              >
                <span className="mb-5 block h-24 text-ink">
                  {g.pending ? (
                    <span className="u-retint flex h-full items-center justify-center rounded-card bg-feature-soft">
                      <span className="u-util text-ink-muted">Not announced</span>
                    </span>
                  ) : (
                    <Cutout src={g.image} alt={g.title} slot={g.imageSlot} shape="object" />
                  )}
                </span>
                <span className="u-util text-ink-muted">{g.when}</span>
                <h2 className="u-display mt-2 text-[1.375rem]">{g.title}</h2>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-70">{g.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {/* The challenge. One honest line — a website can't hand anyone a drink. */}
            <div className="u-retint rounded-card bg-feature-soft p-9">
              <h2 className="u-display text-[1.75rem]">{CHALLENGE.title}</h2>
              <p className="mt-4 text-ink-70">{CHALLENGE.line}</p>
              <p className="mt-3 text-ink">{CHALLENGE.caveat}</p>
              <p className="mt-6 text-[0.9375rem] text-ink-muted">
                We haven’t built it as a game here on purpose. The whole point is the button on the
                counter, and no website can pour you the drink at the end of it.
              </p>
            </div>

            <div className="rounded-card border border-ink-12 p-9">
              <h2 className="u-display text-[1.75rem]">{TOO_GOOD_TO_GO.title}</h2>
              <p className="mt-4 text-ink-70">{TOO_GOOD_TO_GO.body}</p>
              <p className="mt-3 text-[0.9375rem] text-ink-muted">{TOO_GOOD_TO_GO.pendingNote}.</p>
              <PillLink to={LINKS.tooGoodToGo} external variant="outline" className="mt-7">
                Too Good To Go
              </PillLink>
            </div>
          </div>

          <p className="mt-12 max-w-measure text-ink-70">
            Most of this lands on Instagram first, usually with about a day’s notice.{' '}
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink underline underline-offset-4"
            >
              {LINKS.instagramHandle}
            </a>{' '}
            is where to look.
          </p>
        </div>
      </section>
    </>
  )
}
