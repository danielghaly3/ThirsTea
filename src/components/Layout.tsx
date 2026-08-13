import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import ScrollCup from './ScrollCup'
import { FeatureProvider } from '../lib/feature'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <FeatureProvider>
      <ScrollToTop />
      <a
        href="#main"
        className="u-util sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-milk"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      {/* Inside the provider so the tea takes the page's feature colour. */}
      <ScrollCup />
    </FeatureProvider>
  )
}
