import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LocaleProvider } from './context/Locale/index.ts'
import { marketingRouteNames, pathFor, redirectToTurkish } from './lib/index.ts'
import MainLayout from './layout/MainLayout/index.ts'
import BlogIndex from './pages/BlogIndex/index.ts'
import BlogShow from './pages/BlogShow/index.ts'
import Contact from './pages/Contact/index.ts'
import Discovery from './pages/Discovery/index.ts'
import FieldManual from './pages/FieldManual/index.ts'
import Home from './pages/Home/index.ts'
import Marketing from './pages/Marketing/index.ts'
import NotFound from './pages/NotFound/index.ts'
import ParkingQuote from './pages/ParkingQuote/index.ts'
import Payment from './pages/Payment/index.ts'
import Quote from './pages/Quote/index.ts'
import Sitemap from './pages/Sitemap/index.ts'
import SoftwareProducts from './pages/SoftwareProducts/index.ts'

function LegacyLocaleRedirect() {
  const { pathname } = useLocation()
  return <Navigate to={redirectToTurkish(pathname)} replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={pathFor('home')} element={<Home />} />
            <Route path={pathFor('software-products')} element={<SoftwareProducts />} />
            <Route path={pathFor('contact')} element={<Contact />} />
            <Route path={pathFor('quote.index')} element={<Quote />} />
            <Route path={pathFor('discovery.show')} element={<Discovery />} />
            <Route path={pathFor('parking-quote-engine.index')} element={<ParkingQuote />} />
            <Route path={pathFor('blog.index')} element={<BlogIndex />} />
            <Route path={`${pathFor('blog.index')}/:slug`} element={<BlogShow />} />
            <Route path={pathFor('field-manual')} element={<FieldManual />} />
            <Route path={pathFor('sitemap')} element={<Sitemap />} />
            <Route path={pathFor('payment')} element={<Payment />} />
            <Route path={pathFor('hgs-park')} element={<Marketing routeName="hgs-park" />} />
            {marketingRouteNames.map((name) => (
              <Route key={name} path={pathFor(name)} element={<Marketing routeName={name} />} />
            ))}
            <Route path="/en" element={<LegacyLocaleRedirect />} />
            <Route path="/en/*" element={<LegacyLocaleRedirect />} />
            <Route path="/ru" element={<LegacyLocaleRedirect />} />
            <Route path="/ru/*" element={<LegacyLocaleRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </LocaleProvider>
    </BrowserRouter>
  )
}
