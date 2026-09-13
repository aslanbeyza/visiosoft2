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

- `assets/referanslar/logolar/`: 2026-09-13 ana sayfa referans şeridinde küçük gösterildiği için 600 px'e küçültülen iki logonun özgün yüksek çözünürlüklü dosyaları (`sarfit.jpg` 6047 px, `Bakıröy Belediyesi.png` 3125 px).
