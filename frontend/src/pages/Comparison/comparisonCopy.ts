import type { ComparisonRow } from '../../components/ComparisonTable/index.ts'
import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

type InfraItem = { icon: FeatureIconName; title: string; description: string }

/** Karşılaştırma sayfası metinleri; mevcut sayfa metninden alınmış, mutlak ifadeler yumuşatılmıştır. */
export const comparisonCopy = {
  seoTitle: 'Visiosoft ve Geleneksel Sistemler - Karşılaştırma',
  seoDescription:
    'Visiosoft otopark sistemlerinin geleneksel yazılım ve altyapı ile karşılaştırması: uzaktan erişim, canlı görüntü izleme, özgür yazılım ve ARM işlemci teknolojisi.',

  hero: {
    eyebrow: 'Her Yerden Canlı Takip',
    title: ['Otoparktaymış', 'gibi yönetin.'],
    lead: 'Nerede olursanız olun, otoparkınızı uzaktan izleyin. Kaçak geçişi en aza indiren tahsilat altyapısıyla gelirinizi kontrol altında tutun.',
    primary: 'Ücretsiz Keşif İste',
    secondary: 'Detaylı karşılaştırma',
  },

  scene: {
    label: 'Uzaktan erişim karşılaştırması',
    toggleLabel: 'Görünümü seçin',
    note: 'Uzaktan erişim · temsilî çizim',
    you: 'Siz',
    youNote: 'Evden, ofisten veya seyahatte',
    lot: 'Otoparkınız',
    modes: {
      traditional: {
        label: 'Geleneksel',
        badge: 'Kör nokta',
        caption: 'Otoparkta olmazsanız ne olduğunu bilemezsiniz.',
      },
      visio: {
        label: 'Visiosoft',
        badge: 'Canlı bağlantı',
        caption: 'Otoparktaymış gibi her şeyi görün ve yönetin.',
      },
    },
    chips: ['Canlı görüntü izleme', 'Uzaktan erişim', 'Bulut yedekli veri'],
  },

  contrast: {
    eyebrow: 'İki yaklaşım',
    // "ya da" bölünmesin diye aradaki boşluk bölünmez boşluktur (TextReveal yalnızca normal boşlukta böler).
    title: 'Kör noktalar ya da tam kontrol.',
    versus: 'ya da',
    traditional: {
      badge: 'Kör noktalar',
      title: 'Geleneksel sistemler',
      body: 'Otoparkta olmazsanız ne olduğunu bilemezsiniz. Kaçak geçişler, kayıp gelirler, kontrol eksikliği.',
      items: ['Uzaktan erişim yok', 'Kaçak geçiş riski', 'Gelir takibi zor'],
    },
    visio: {
      badge: 'Tam kontrol',
      title: 'Visiosoft',
      body: 'Otoparktaymış gibi her şeyi görün ve yönetin. Tahsilat güvence altında, kaçak geçiş en aza iner.',
      items: ['Canlı görüntü izleme', 'Yüksek tahsilat başarısı', 'Pardus ve Ubuntu üzerinde'],
    },
  },

  table: {
    eyebrow: 'Özellik özellik',
    title: 'Detaylı Karşılaştırma',
    lead: 'Özellik bazında farkları keşfedin.',
    caption: 'Geleneksel otopark sistemleri ile Visiosoft özellik karşılaştırması',
    columns: { a: 'Geleneksel', b: 'Visiosoft' },
    rows: [
      { feature: 'İşletim Sistemi', a: 'Windows', b: 'Pardus & Ubuntu', note: 'Pardus ve Ubuntu ücretsiz ve açık kaynaklı Linux dağıtımlarıdır.' },
      { feature: 'Uzaktan Erişim', a: false, b: 'Her yerden', note: 'Evden, ofisten veya seyahatte bile sisteminizi yönetebilirsiniz.' },
      { feature: 'Canlı Görüntü İzleme', a: false, b: 'Gerçek zamanlı', note: 'Tailscale VPN güvenli bağlantı ve Grafana izleme sistemi.' },
      { feature: 'Tahsilat Başarısı', a: 'Değişken', b: 'Yüksek', note: 'Kaçak geçiş en aza iner, gelir takibi kolaylaşır.' },
      { feature: 'Plaka Tanıma', a: 'Karakter Tanıma', b: 'Derin Öğrenme Yapay Zeka', note: 'Yapay zeka modelimiz her ay otoparkınızdan öğrenir.' },
      { feature: 'Mobil Uygulama', a: false, b: 'iOS & Android', note: 'Bildirimleri alın, işlemleri telefonunuzdan yapın.' },
      { feature: 'Veri Güvenliği', a: 'Yerel', b: 'Bulut Yedekli', note: 'Donanım arızası veya hırsızlık durumunda bile verileriniz korunur.' },
      { feature: 'Teknik Destek', a: 'Sınırlı', b: '7/24', note: 'Gece gündüz her zaman yardım alabilirsiniz.' },
      { feature: 'KVKK Uyumlu Veri Yönetimi', a: false, b: true, note: 'Görüntülerdeki yüz ve özel veriler bulanıklaştırılır.' },
      { feature: 'Donanım Altyapısı', a: 'Standart CPU', b: 'Nvidia CUDA & ARM', note: 'Hızlı plaka tanıma ve verimli GPU/CPU performansı.' },
      { feature: 'Otomatik Güncelleme', a: 'Manuel', b: 'Uzaktan (aylık)', note: 'Yeni özellikler ve güvenlik yamaları uzaktan uygulanır.' },
    ] as ComparisonRow[],
  },

  infra: {
    eyebrow: 'Altyapı',
    title: 'Farkı yaratan altyapı.',
    lead: 'Karşılaştırmadaki her satırın arkasında sahada çalışan somut bir teknoloji var.',
    items: [
      { icon: 'settings', title: 'Pardus & Ubuntu', description: 'Sistem, ücretsiz ve açık kaynaklı Linux dağıtımları üzerinde çalışır.' },
      { icon: 'shield', title: 'Tailscale VPN', description: 'Otoparkınıza internet üzerinden güvenli bağlantıyla her yerden erişirsiniz.' },
      { icon: 'chart', title: 'Grafana izleme', description: 'Giriş-çıkış ve cihaz durumu tek bir izleme sisteminde takip edilir.' },
      { icon: 'camera', title: 'Nvidia CUDA & ARM', description: 'Plaka Tanıma Sistemi (PTS) verimli GPU/CPU performansıyla çalışır.' },
    ] as InfraItem[],
  },

  cta: {
    eyebrow: 'Hemen Başlayın',
    title: 'Geleceğe Hazır Mısınız?',
    description: 'Otopark yönetiminizi modernleştirin. Ücretsiz keşif toplantısı için hemen iletişime geçin.',
    primary: 'Ücretsiz Keşif İste',
    secondary: 'İletişime geçin',
  },
}
