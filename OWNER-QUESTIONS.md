# Owner questions — ThirsTEA demo

Unofficial pitch demo. Nothing here is client-approved.

Everything below is either unknown or unverified. The site is built so each one is a single edit in
`src/data/`, not a hunt through components.

## The blocking one

**1 · Photography.** The entire visual direction rests on transparent-background product cutouts,
and none exist. Every `image` field in `src/data/` is `null`, which renders a designed stand-in —
a line-drawn silhouette at the correct crop, correctly shadowed, labelled with the filename it's
waiting for. Nothing looks broken, but **the site does not reach the quality of the reference
designs without a photo session.** `public/images/README.md` lists all eighteen slots.

Also needs settling: usage rights in writing, including for customer artwork visible in the sticky
note wall photographs — that's other people's handwriting.

## The rest

| # | Question | Where it lives | Currently rendered as |
| --- | --- | --- | --- |
| 2 | **The full menu.** We could confirm nine drinks out of roughly eighty. Which items are permanent, which are seasonal? | `menu.ts`, `MENU_STATUS` in `site.ts` | Confirmed drinks only. Empty categories say so in plain words rather than being filled with plausible guesses |
| 3 | **Prices** | `menu.ts`, `PRICE_NOTE` | `—`, with a note that pricing is confirmed in store |
| 4 | ~~**Hours**, all seven days, including the real late-night close~~ **ANSWERED** | `HOURS` + `HOURS_STATUS` in `site.ts` | Supplied by the owner and now live: 11am–11pm Sun–Thu, 11am–midnight Fri–Sat. Rendered as the full week plus a live open/closed badge read off the shop's own clock. Set `HOURS_STATUS` back to `'unconfirmed'` and every hours block reverts to saying so |
| 5 | **Which board games are actually on the shelf?** | `games.ts` | Described by type, not by title. Saying a shop stocks a specific game is as much an invented fact as inventing a price |
| 6 | **The deal.** Is *BOGO slushes after 8pm* real, or demo filler? How often does the deal rotate, and who edits it? | `DEAL` in `site.ts` | One config value, labelled demo copy on the page |
| 7 | **The 10-second challenge.** Real tolerance at the counter, attempts per visit, any exclusions | `CHALLENGE` in `site.ts` | One honest line. Deliberately not built as a game — see below |
| 8 | **Catering.** Lead time, minimum order, pricing, and where the enquiry form should actually send | `Catering.tsx` | Front-end only, fake submit, labelled as a demo form |
| 9 | **Too Good To Go** — still active, and roughly when do bags drop? | `giveaways.ts` | Listed with no times claimed |
| 10 | **The Instagram free-topping offer** — still running? | `giveaways.ts` | Listed, flagged here for confirmation |
| 11 | **The Lorax wall** — roughly when was it up? Any photos of past walls at all? | `walls.ts` | "A past season" rather than a date |
| 12 | **A second listing.** At least one third-party listing associates ThirsTEA with a Toronto address. Confirm, then get the stale listing corrected at source | *nowhere on the page, deliberately* | Not rendered — see below |
| 13 | **Domain, analytics, and the demo disclaimer** — when does the footer line come off? | `site.ts`, `Footer.tsx` | Footer states this is an unofficial demo |
| 14 | **The logo.** We have no artwork — no vector, no wordmark file, no usage rules | `Nav.tsx` → `Lockup` | A placeholder built from the shop's own minimal black branding: a filled circle standing in for a tapioca pearl, plus the wordmark set in Oswald. Needs replacing with the real mark |

## Two things we deliberately did not put on the page

**The second listing (12).** This is an internal research question, not a visitor-facing one. A
marketing site that hedges about where it is reads as unsure of itself, and "one shop, on Dundas"
is confirmed, true, and part of why people like the place. Contrast with hours, which *are* flagged
inline — a visitor needs those before they leave the house, so an honest "confirmed before launch"
is useful to them. The listing question is only useful to us.

**The 10-second challenge as a playable game.** A website can't hand anyone a drink, so simulating
the challenge would mean faking the reward. It gets one honest line and a link instead. The page
says so out loud: the whole point is the button on the counter.

## Measured contrast

Every feature colour, checked in the browser rather than assumed. WCAG AA needs 4.5:1 for small
text.

| Pair | Ratio |
| --- | --- |
| forest on milk / sand (all headings) | 11.59 / 10.84 |
| olive on milk / sand (accent word) | 4.91 / 4.59 |
| amber-ink on milk / sand (eyebrows) | 17.91 / 16.74 |
| ink-70 on milk (body) · ink-muted on sand | 6.94 · 5.01 |
| milk / milk-70 / milk-40 on forest | 11.59 / 6.52 / 4.94 |
| lime on forest | 5.41 |
| forest on amber badge · on lime button | 4.91 · 5.41 |
| ink on `--feature-fill`, worst case (wood) | 5.43 |

Four failures found by measuring rather than assuming, all fixed:

- **Raw amber on cream is 2.4:1.** The reference uses bright amber for eyebrow labels on cream and
  it fails badly. Eyebrows now use a darkened `--amber-ink`; the bright amber survives as a badge
  fill, where forest type on it measures 4.9:1.
- **`--milk-40` at 0.42 alpha was 3.33:1** on forest — it carries the footer fine print and the
  hours-pending note. Raised to 0.62.
- **The first olive was 4.22:1**, fine for display sizes but not for the small text that also uses
  it. Darkened to `#64741B`.
- **Raw `--wood` misses AA at 4.47:1**, which is why anything filled uses `--feature-fill` — the
  feature lifted 12% toward cream — rather than the raw colour.

Translucent tokens are composited over their actual background before measuring; the raw rgba is
not what the eye sees.

## Build decisions worth remembering

- **The reference site gave us design language, not content.** The palette structure, type roles,
  layout patterns and motion came from the client's reference; none of its copy, imagery, icons or
  code did. Every word here is written for ThirsTEA and every figure is one of the shop's verified
  numbers. Where the reference shows invented prices, per-item star ratings and customer counts,
  those slots are either filled with real platform figures or left honestly empty.
- **Derived tints are declared on the same selector that sets `--feature`**, never on `:root`.
  A custom property substitutes `var()` against the element it's declared on, so `--feature-soft`
  on `:root` would freeze against the root colour and never follow a retint.
- **Tailwind opacity modifiers do nothing on `var()` colours.** `bg-ink/[0.05]` silently produces
  no background when `ink` is `var(--ink)` rather than raw channels. Neutral fills are real tokens
  (`--neutral`, `--neutral-strong`) for this reason.
- **`color-mix()` computes to an `oklab()` string**, not `rgb()`. Anything auditing colour has to
  resolve it properly — reading the oklab components as if they were RGB reports near-black and
  produces a contrast table that looks catastrophic and is entirely wrong.
- **A new key in `tailwind.config.js` needs a dev-server restart.** Editing the config while Vite is
  running leaves the class uncompiled, so the style silently falls back to inherited.
- **Sections clip on both axes.** An oversized tonal circle escaping vertically lands on top of the
  next section and covers its buttons.
- **Don't name a border-width token the same as a colour token** — `border-ink` would collide with
  the ink colour utility and silently drop the width.
