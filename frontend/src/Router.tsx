import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LocaleProvider } from './context/Locale/index.ts'
import { marketingRouteNames, pathFor, redirectToTurkish } from './lib/index.ts'
import MainLayout from './layout/MainLayout/index.ts'
import Marketing from './pages/Marketing/index.ts'
import { pages } from './pages/registry.ts'

/*
 * Tüm sayfalar registry üzerinden tembel yüklenir; tek Suspense sınırı MainLayout içindeki PageTransition'dadır.
 * Marketing küçük bir dağıtıcıdır ve kendi içinde aynı registry'den tembel bileşenler kullanır.
 */
const Home = lazy(pages.home)
const SoftwareProducts = lazy(pages.softwareProducts)
const Contact = lazy(pages.contact)
const Quote = lazy(pages.quote)
const Discovery = lazy(pages.discovery)
const ParkingQuote = lazy(pages.parkingQuote)
const BlogIndex = lazy(pages.blogIndex)
const BlogShow = lazy(pages.blogShow)
const FieldManual = lazy(pages.fieldManual)
const Sitemap = lazy(pages.sitemap)
const Payment = lazy(pages.payment)
const NotFound = lazy(pages.notFound)

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
