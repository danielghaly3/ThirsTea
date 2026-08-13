import Headline from '../components/Headline'
import Reveal from '../components/Reveal'

const CARDS = [
  {
    id: 'adjust',
    title: 'Made to your numbers',
    body: 'Sugar and ice are set when you order, not baked in. If it came out too sweet last time, say a number.',
    icon: (
      <>
        <path d="M4 8h16M4 16h16" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="9" cy="8" r="2.4" strokeWidth="1.7" />
        <circle cx="15" cy="16" r="2.4" strokeWidth="1.7" />
      </>
    ),
  },
  {
    id: 'fresh',
    title: 'Made when you ask',
    body: 'Pearls still warm, waffles cooked after you order them. It’s why there’s occasionally a wait.',
    icon: (
      <>
        <path d="M7 4v3M12 3v4M17 4v3" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M5 10h14v5a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-5Z" strokeWidth="1.7" />
      </>
    ),
  },
  {
    id: 'stay',
    title: 'Nobody rushes you',
    body: 'A shelf of board games, big tables, and open later than most things nearby. People sit for hours.',
    icon: (
      <>
        <rect x="3.5" y="6" width="17" height="12" rx="2.5" strokeWidth="1.7" />
        <circle cx="9" cy="12" r="1.3" strokeWidth="1.7" />
        <circle cx="15" cy="12" r="1.3" strokeWidth="1.7" />
      </>
    ),
  },
]

export default function Experience() {
  return (
    <section className="section-clip bg-sand py-[var(--section-y)]">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <Reveal className="text-center">
          <p className="u-eyebrow">What it’s actually like</p>
          <Headline
            lead="Three things people"
            tail="mention"
            className="mx-auto mt-4 max-w-[18ch] text-[clamp(2.25rem,6vw,4.5rem)]"
          />
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <li key={c.id} className="flex">
              <Reveal delay={i * 0.05} className="flex w-full">
                <div className="flex w-full flex-col rounded-lg2 bg-milk p-9 transition-shadow duration-300 hover:shadow-card motion-reduce:transition-none">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-caramel text-charcoal">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {c.icon}
                    </svg>
                  </span>
                  <h3 className="u-display mt-7 text-[1.5rem]">{c.title}</h3>
                  <p className="mt-3 text-ink-70">{c.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
