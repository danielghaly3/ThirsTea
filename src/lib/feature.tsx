import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Feature } from '../data/site'

/**
 * The header sits outside every section, so it has no [data-feature] ancestor
 * to read — which left the active nav underline with no colour at all. This
 * lifts the current feature to a wrapper above the header, so the nav retints
 * along with the hero carousel and the menu categories.
 *
 * Sections still set their own data-feature locally and override within their
 * own subtree; this only supplies the page-level default.
 */
const FeatureContext = createContext<(f: Feature) => void>(() => {})

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [feature, setFeature] = useState<Feature>('taro')
  return (
    <FeatureContext.Provider value={setFeature}>
      <div data-feature={feature}>{children}</div>
    </FeatureContext.Provider>
  )
}

/** Publishes a page's (or a carousel slide's) feature colour to the shell. */
export function usePageFeature(feature: Feature) {
  const setFeature = useContext(FeatureContext)
  useEffect(() => {
    setFeature(feature)
  }, [feature, setFeature])
}
