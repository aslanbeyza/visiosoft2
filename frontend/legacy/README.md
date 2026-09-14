# legacy

Eski (yeni tasarımla değiştirilen) bileşenlerin yedeği. `src` dışında olduğu için derlemeye dahil edilmez.

- `hero-v1/`: 2026-09-07 tarihinde video tabanlı Hero ile değiştirilen, div'lerle çizilmiş "canlı kapı sahnesi" hero'su.
  Geri almak için `hero-v1/Hero.tsx` ve `hero-v1/scene/` klasörünü `src/components/Hero/` altına taşımanız yeterli.
- `home-v1/`: 2026-09-13 kurumsal yeniden tasarımda ana sayfadan kaldırılan bölümler (`CorporateStory`, `ParkSoftware`, `StoryFrame`, `VideoSlot`, `ClipExpand`, `AnimatedTitle`, `BentoTilt`), eski `Home/` (Home.tsx + Home.module.css) ve yeniden stillendirme öncesi `SystemShowcase-pre-restyle/`.
  Geri almak için klasörleri `src/components/` altına, `Home/` içeriğini `src/pages/Home/` altına taşıyın.
- `navbar-v1/`: 2026-09-13 kurumsal yeniden tasarımda CSS modülleriyle yeniden yazılan eski Tailwind navbar (`Navbar.tsx`).
- `footer-v1/`, `whatsapp-button-v1/`: aynı tarihte yenilenen eski footer ve WhatsApp butonu.
- `header-v1/`, `logo-v1/`: hiçbir yerde kullanılmayan eski koyu header ve ona bağlı logo bileşeni.
- `feature-bento-v1/`: 2026-09-13 tarihinde `SystemShowcase` ("Sahada çalışan sistem") ile değiştirilen, 3D model kartlı ana sayfa ürün bölümü (`FeatureBento`).
  Geri almak için klasörü `src/components/FeatureBento/` olarak taşıyıp `pages/Home/Home.tsx` içinde `SystemShowcase` yerine kullanın.

- `home-v2/`: 2026-09-14 yazılım önde ana sayfa (HOME3) ile değiştirilen bölümler: `HomeIntro`, `HomeProducts`, `SystemShowcase`, `HomeSoftware`, `HomeSolutions`, `HomeHgs`, `HomeProcess`, `HomeReferences` ve eski `pages-Home/homeCopy.ts`.
  Yeni ana sayfa `Hero`, `HomeTrust`, `HomeSystemFlow`, `HomeZone`, `HomeSectors`, `HomeFlagships`, `KioskZoom`, `HomeAssurance`, `HomeCta` kullanır. Geri almak için klasörleri `src/components/` altına, `homeCopy.ts` dosyasını `src/pages/Home/` altına taşıyıp `Home.tsx` içinde kullanın.

- `assets/referanslar/logolar/`: 2026-09-13 ana sayfa referans şeridinde küçük gösterildiği için 600 px'e küçültülen iki logonun özgün yüksek çözünürlüklü dosyaları (`sarfit.jpg` 6047 px, `Bakıröy Belediyesi.png` 3125 px).
- `assets/demirbank-lineup/`: 2026-09-14 tarihinde donanım sayfası ürün dizisinden çıkarılan, DemirBank markası görünen özgün kiosk ve rack kabin kesimleri (`kiosk.avif`, `kiosk.webp`, `rack-kabin.avif`, `rack-kabin.webp`).
  Yerlerini `src/pages/HardwareProducts/img/kiosk-lineup.*` ve `rack-lineup.*` aldı; bu dosyalar `public/` altına geri konmamalıdır.

## 2026-09-13/14 kurumsal yeniden tasarım (paylaşılan bloklar ve sayfalar)

Paylaşılan altyapı (B aşaması):

- `page-hero-v1/`: blok kütüphanesiyle yeniden yazılan eski `PageHero` (`PageHero.tsx`, `.module.css`, eski `index.ts` kopyası). Yeni sürüm aynı `{eyebrow, title, description, actions}` özelliklerini destekler.
- `splash-v1/`: gri, sessionStorage'ı effect içinde okuyan eski açılış perdesi (`Splash.tsx`, `.module.css`). Yenisi lacivert perde + `splashState.ts`.
- `seo-v1/`: yalnızca başlık/açıklama yazan eski `Seo.tsx` (canonical, og ve twitter etiketleri yoktu).
- `main-layout-v1/`: kaydırmayı effect'le başa alan, düz `<Outlet/>` kullanan eski `MainLayout.tsx` (+ o günkü `.module.css` kopyası, canlı dosyayla aynı).
- `router-v1/`: sayfaları statik içe aktaran eski `Router.tsx` (yenisi `src/pages/registry.ts` üzerinden tembel yükler).
- `marketing-v1/`: sayfaları statik içe aktaran eski `Marketing.tsx` dağıtıcısı.
- `product-viewer-v1/`: 3D `<model-viewer>` tabanlı `ProductViewer` (tsx, css, index.ts). Hiçbir sayfa kullanmıyor.
- `lead-form-v1/` diye bir klasör yoktur: eski `LeadForm` sayfası `pages-v1/LeadForm/` altındadır (`src/components/LeadForm` bileşeni yerinde durur).

`pages-v1/`: C aşamasında yeniden yazılan sayfaların eski dosyaları, `src/pages/<Ad>/` ile aynı klasör adlarıyla.
Aksi belirtilmedikçe her klasörde `<Ad>.tsx` + `<Ad>.module.css` vardır; "index" eski `index.ts` kopyası demektir.
Geri almak için dosyaları `src/pages/<Ad>/` altına taşıyıp o klasörün `index.ts` dosyasını eski bileşene çevirin.

- Yazılım: `SoftwareProducts` (index), `ParkingSoftware` (index + `faqs-parking-software-tr.json`, verideki dosyanın aynısı), `ParkingReports` (index), `Developers` (index), `Comparison`, `Services`, `WebsitePricing` (index).
- Plaka tanıma: `PlakaTanima`, `PlateRecognitionSystem` (index), `AlprLanding` (index + `alprLandingCopy.ts`).
- Donanım: `HardwareProducts` (+ `copy.ts`), `ProductDetail` (ProductHero, FeatureList, HowItWorks, TechnicalDrawing, DrawingDialog, SpecLists bileşenleri + `productDetailCopy.ts` + index), `HardwareProduct` (+ `model-viewer.d.ts` + index; `src/pages/HardwareProduct/products.ts` ve yönlendiren `index.ts` yerinde kalır).
- HGS ve saha: `Hgs` (+ `hgsCopy.ts`, EN/RU metinleri içerir), `HgsPark` (+ `hgsParkCopy.ts`, EN/RU), `EndToEnd` (index), `OnStreet` (index), `ParkingViolations` (index).
- Kurumsal: `About` (+ `aboutCopy.ts`), `Contact`, `BankAccounts`, `References`, `Showcase` (+ eski TR/EN/RU `showcaseCopy.ts`).
- Formlar ve teklif: `LeadForm`, `Quote`, `Discovery`, `ParkingQuote` (her biri + index).
- İçerik ve sistem: `Legal` (`legalCopy.ts` src'de kullanılmaya devam eder), `BlogIndex`, `BlogShow`, `FieldManual`, `Sitemap`, `NotFound`, `Payment`.
