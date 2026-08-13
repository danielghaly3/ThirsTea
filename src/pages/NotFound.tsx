import Headline from '../components/Headline'
import { PillLink } from '../components/Pill'
import { usePageFeature } from '../lib/feature'

export default function NotFound() {
  usePageFeature('taro')
  return (
    <section data-feature="taro" className="section-clip bg-milk">
      <div className="mx-auto max-w-shell px-[var(--gutter)] py-[var(--section-y)]">
        <p className="u-util text-ink-muted">Nothing here</p>
        <Headline
          as="h1"
          lead="This page doesn’t"
          tail="exist"
          className="mt-4 max-w-[14ch] text-[clamp(2.5rem,6.5vw,4.5rem)]"
        />
        <p className="mt-6 max-w-measure text-ink-70">
          Easily done — the shop is hard to find too. The menu is probably what you were after.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <PillLink to="/menu" variant="fill">
            See the menu
          </PillLink>
          <PillLink to="/" variant="text">
            Back home
          </PillLink>
        </div>
      </div>
    </section>
  )
}
