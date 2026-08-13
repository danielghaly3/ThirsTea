import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

/**
 * Demo mode — Home is the only page that opens.
 *
 * Every other path redirects to `/`, so the links on the home page all still
 * render exactly as designed and simply land back here. The page components for
 * Menu, Wall, Games, Deals, Catering, Visit and NotFound are all still in
 * src/pages; they're just not imported, so they tree-shake out of the bundle
 * and the demo ships as one page.
 *
 * To put the full site back, restore the imports and swap this block for:
 *
 *   <Route index element={<Home />} />
 *   <Route path="menu" element={<Menu />} />
 *   <Route path="wall" element={<Wall />} />
 *   <Route path="games" element={<Games />} />
 *   <Route path="deals" element={<Deals />} />
 *   <Route path="catering" element={<Catering />} />
 *   <Route path="visit" element={<Visit />} />
 *   <Route path="*" element={<NotFound />} />
 *
 * The catch-all sits inside the Layout route rather than beside it. Outside, a
 * redirect unmounts and remounts the whole shell — nav, footer and the scroll
 * cup all blink — for the one frame it takes to bounce.
 *
 * `replace` matters too: without it, every bounce pushes a history entry and
 * the back button walks the visitor through /wall → / → /wall → / forever.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
