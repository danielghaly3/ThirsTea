import Headline from '../components/Headline'
import PhotoSlot from '../components/PhotoSlot'
import PageHero from '../components/PageHero'
import { PillLink } from '../components/Pill'
import { LINKS } from '../data/site'
import { WALL_INTRO, WALLS } from '../data/walls'
import { usePageFeature } from '../lib/feature'

export default function Wall() {
  usePageFeature('taro')
  return (
    <>
      <PageHero
        feature="taro"
        eyebrow="It never stays the same"
        lead="The"
        tail="wall"
        intro={WALL_INTRO}
      />

      <section data-feature="taro" className="section-clip bg-milk pb-[var(--section-y)]">
        <div className="mx-auto max-w-shell px-[var(--gutter)]">
          <ul className="grid gap-8 md:grid-cols-3">
            {WALLS.map((wall) => (
              <li key={wall.id} className="flex flex-col">
                <div
                  className={`u-retint flex aspect-[4/3] items-center justify-center rounded-card ${
                    wall.upcoming
                      ? 'border-line border-dashed border-ink-12 bg-milk'
                      : 'bg-feature-soft'
                  }`}
                >
                  {wall.upcoming ? (
                    <p className="u-util max-w-[16ch] px-6 text-center text-ink-muted">
                      Nothing here yet
                    </p>
                  ) : (
                    <PhotoSlot src={wall.image} alt={wall.title} slot={wall.imageSlot} />
                  )}
                </div>
                <p className="u-util mt-6 text-ink-muted">{wall.when}</p>
                <h2 className="u-display mt-2 text-[1.5rem]">{wall.title}</h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-70">{wall.body}</p>
              </li>
            ))}
          </ul>

          <div className="u-retint mt-16 rounded-lg2 bg-feature-soft px-6 py-12 sm:px-12">
            <Headline
              lead="You’ll know before we"
              tail="do"
              className="max-w-[18ch] text-[clamp(1.75rem,3.6vw,2.5rem)]"
            />
            <p className="mt-4 max-w-measure text-ink-70">
              There’s no schedule for this. When the wall changes it turns up on Instagram first,
              usually as a photo taken about ten minutes after the paint dried.
            </p>
            <PillLink to={LINKS.instagram} external variant="fill" className="mt-8">
              Follow {LINKS.instagramHandle}
            </PillLink>
          </div>
        </div>
      </section>
    </>
  )
}
