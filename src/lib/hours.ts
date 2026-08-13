import { useEffect, useState } from 'react'
import { HOURS, TIMEZONE } from '../data/site'

/**
 * The only place opening times are formatted, and the only place the site
 * decides whether the shop is open right now.
 *
 * "Right now" is measured on the shop's clock, not the visitor's. Someone
 * checking from another timezone — or from a laptop whose clock is simply
 * wrong — should still be told what the shop is actually doing.
 */

type Row = (typeof HOURS)[number]

/** '11:00' → 660. '24:00' → 1440: midnight closing this day, not opening the next. */
export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** '11:00' → '11 a.m.' · '23:00' → '11 p.m.' · '24:00' → 'Midnight'. */
export function formatTime(hhmm: string) {
  const total = toMinutes(hhmm)
  /* Both ends of the day read as midnight; neither reads as "12 a.m.", which
     half of everyone parses as noon. */
  if (total === 0 || total === 1440) return 'Midnight'
  if (total === 720) return 'Noon'

  const h24 = Math.floor(total / 60) % 24
  const mins = total % 60
  const suffix = h24 < 12 ? 'a.m.' : 'p.m.'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return mins === 0 ? `${h12} ${suffix}` : `${h12}:${String(mins).padStart(2, '0')} ${suffix}`
}

export function formatRange(row: Row) {
  return `${formatTime(row.open)}–${formatTime(row.close)}`
}

/* 'en-US' is pinned rather than left to the visitor's locale: the weekday it
   returns is matched against the day names in HOURS, and a French browser
   would hand back 'lundi' and match nothing. */
const CLOCK = new Intl.DateTimeFormat('en-US', {
  timeZone: TIMEZONE,
  weekday: 'long',
  hour: '2-digit',
  minute: '2-digit',
  /* h23, not hour12:false — some ICU builds render midnight as hour 24 under
     hour12:false, which lands 1440 minutes into a day that has 1439. */
  hourCycle: 'h23',
})

function shopClock() {
  const parts = CLOCK.formatToParts(new Date())
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? '0'
  return {
    weekday: part('weekday'),
    minutes: Number(part('hour')) * 60 + Number(part('minute')),
  }
}

export type ShopStatus = {
  open: boolean
  /** Today's row, so a list can mark which line the visitor is standing in. */
  today: Row | undefined
  /** Reads on its own without the dot beside it: "Open until 11 p.m." */
  label: string
}

/**
 * Pure, and exported so the boundaries can actually be tested — the ones that
 * matter (opening minute, closing minute, Friday's midnight) each happen once
 * a week and would otherwise only ever be checked by a visitor.
 */
export function statusAt(weekday: string, minutes: number): ShopStatus {
  const today = HOURS.find((h) => h.day === weekday)
  if (!today) return { open: false, today: undefined, label: 'Hours vary' }

  const opens = toMinutes(today.open)
  const closes = toMinutes(today.close)

  if (minutes >= opens && minutes < closes) {
    return { open: true, today, label: `Open until ${formatTime(today.close)}` }
  }
  if (minutes < opens) {
    return { open: false, today, label: `Opens at ${formatTime(today.open)}` }
  }

  const tomorrow = HOURS[(HOURS.indexOf(today) + 1) % HOURS.length]
  return { open: false, today, label: `Opens ${formatTime(tomorrow.open)} tomorrow` }
}

function readStatus(): ShopStatus {
  const { weekday, minutes } = shopClock()
  return statusAt(weekday, minutes)
}

/** Re-reads every half minute, so the badge flips on its own at 11 and at close. */
export function useShopStatus(): ShopStatus {
  const [status, setStatus] = useState(readStatus)

  useEffect(() => {
    const id = window.setInterval(() => setStatus(readStatus()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return status
}
