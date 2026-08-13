# ThirsTEA — Design Plan (v3)

Multi-page marketing site for ThirsTEA. Unit 3, 26 Dundas St E, Mississauga. Unofficial demo,
shown to a real owner.

> Replaces v1 (paper, tape, tilt) and v2 (cutout-on-tonal-circle). Direction taken from a reference
> site supplied by the client — see §7 on what was and wasn't borrowed.

---

## The thesis

**Condensed type at billboard scale, one saturated colour per drink, deep green everywhere else.**

The hero is a single enormous word with the drink standing in front of it, on a ground that takes
that drink's colour. Arrow to the next drink and the whole hero recolours. Everything below is
forest green type on cream, with product cards that each carry their own drink tint.

---

## 1. Colour

| Token | Hex | Role |
| --- | --- | --- |
| `--forest` | `#0E3D29` | Display type, dark panels, footer, buttons |
| `--forest-2` | `#1A4D2E` | Hover state on forest |
| `--olive` | `#64741B` | The accent word in a two-tone headline |
| `--lime` | `#A6B53D` | On forest only — 2.0:1 on cream, never text there |
| `--amber` | `#EA8F08` | Badge fills. Forest type on it measures 4.9:1 |
| `--amber-ink` | `#A85D00` | Eyebrow text. Raw amber is 2.4:1 on cream and fails |
| `--sand` | `#F4F1EA` | Alternating section bands |
| `--milk` | `#FFF8EE` | Page ground |
| `--ink` | `#111111` | Body copy |

The five drink colours — wood, mango, strawberry, matcha, taro — drive `--feature` and never appear
in a component directly.

```css
[data-feature] {
  --feature: var(--wood);
  --feature-soft: color-mix(in oklab, var(--feature) 18%, var(--milk));
  --feature-deep: color-mix(in oklab, var(--feature) 58%, var(--ink));
  --feature-fill: color-mix(in oklab, var(--feature) 88%, var(--milk));
  --feature-hero: color-mix(in oklab, var(--feature) 82%, var(--forest));
}
```

Derived tints are declared on the **same selector** that sets `--feature`, never on `:root`. A
custom property substitutes `var()` against the element it's declared on, so `--feature-soft` on
`:root` would freeze against the root's colour and never follow a retint.

---

## 2. Type

| Role | Face | Rules |
| --- | --- | --- |
| **Display** | Oswald 700 | Uppercase, `-0.02em`, `line-height: 0.92`. Hero word at `clamp(4.75rem, 25vw, 21rem)` with `-0.05em` |
| **Eyebrow** | Oswald 500 | Uppercase, `0.22em` tracking, 13px, amber-ink |
| **Body / UI** | Mina | 16px → 17px ≥1024px, `1.7` |

**Two-tone headline.** The phrase runs forest and the last word flips olive — one accent word per
headline, never two. On dark grounds it inverts to cream with a lime accent.

---

## 3. Layout vocabulary

1. **Hero** — saturated ground, tiled ghost wordmark, giant word, drink in front occluding it,
   flanking prev/next drinks receding, cream band below with copy · prev/CTA/next · ratings · dots.
2. **Feature row** — three cards on cream, circular icon, forest heading.
3. **Product grid** — cards with a drink-tinted image panel, two-tone name, description,
   price slot + circular feature-coloured button.
4. **Story split** — giant stacked headline with olive last word, body, stat pair; tonal disc right.
5. **Split panel** — cream left, forest right with icon rows, big rounded corners.
6. **Footer** — forest, rounded top corners, four columns, newsletter with lime button.

---

## 4. Motion

- **Scroll reveal** — fade and rise 26px, fires once, never repeats.
- **Hero carousel** — word and product crossfade with a directional x-offset and a slight scale.
  Never auto-advances; a page that recolours itself on a timer looks like it's malfunctioning.
- **Ambient** — pearls drifting on a long loop in the hero.
- **Hover** — cards lift 4px into a soft shadow; the circular button scales 1.05.
- All of it collapses to static under `prefers-reduced-motion`; `Reveal` returns a plain div.

---

## 5. Honesty rules (unchanged across all three directions)

- No prices. `—` with a note that pricing is confirmed in store.
- No hours. One `HOURS_STATUS` flag renders "Hours confirmed by owner before launch".
- No invented ratings. The hero's stat strip is the shop's **real** platform figures.
- No per-item star ratings — we don't have them, so the slot doesn't exist.
- No invented drink names. Confirmed items only; empty categories say so.
- No game titles, no reviewer names, no compass claims on the plaza map.
- The 10-second challenge is one honest line. A website can't hand anyone a drink.

---

## 6. Measured contrast

Every pair checked in-browser, not assumed. Translucent tokens composited before measuring.

| Pair | Ratio |
| --- | --- |
| forest on milk / sand | 11.59 / 10.84 |
| olive on milk / sand | 4.91 / 4.59 |
| amber-ink on milk / sand | 17.91 / 16.74 |
| ink-70 on milk · ink-muted on sand | 6.94 · 5.01 |
| milk / milk-70 / milk-40 on forest | 11.59 / 6.52 / 4.94 |
| lime on forest | 5.41 |
| forest on amber badge · on lime button | 4.91 · 5.41 |

Three failures found and fixed: raw amber on cream was **2.4:1** (eyebrows now use `--amber-ink`),
`--milk-40` at 0.42 alpha was **3.33:1** on forest (raised to 0.62), and the first olive was
4.22:1 against small text (darkened to `#64741B`).

---

## 7. On the reference

The client supplied a reference site and asked for its style and animation. What was taken is
**design language**: the palette structure, the type roles, the layout patterns listed in §3, and
the motion vocabulary in §4.

What was not taken: no copy, no imagery, no icons, no logo, and no code. Every word on this site is
written for ThirsTEA, every figure is one of the shop's verified numbers, and the artwork is our own
placeholder system. Where the reference shows invented prices, per-item ratings and customer counts,
those slots are either filled with ThirsTEA's real figures or left honestly empty.

---

## 8. Quality floor

360 / 768 / 1440 with no breaks and no horizontal overflow. The hero is re-laid-out on mobile — the
cream band flows below the visual instead of being pinned to the bottom. Visible focus rings, real
semantics, alt text, lazy-loaded images, `npm run build` clean, no console errors.
