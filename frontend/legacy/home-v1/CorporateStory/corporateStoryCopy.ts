import { heroCopy } from '../Hero/heroCopy.ts'

export const featuredReferenceFiles = [
  'İstanbul Valiliği.png',
  'YTÜ.png',
  'Crowne Plaza.png',
  'Metropark awm.png',
  'Sarıyer Belediyesi.png',
  'Buyukcekmece Belediyesi.png',
  'başakşehir belediyesi.png',
  'İstanbul Akvaryum.png',
  'İstanbul_Başakşehir_FK (1).png',
  'balıkesir Hiltonn.jpeg',
  'Gaziosmanpasa belediyesi.png',
  'ytü Yıldız teknopark.png',
]

export const corporateStoryCopy = {
  about: {
    kicker: 'Kurumsal',
    title: 'Tek işimiz otopark otomasyonu.',
    lead: 'Yazılım, saha donanımı ve 7/24 operasyonu aynı ekipte tutuyoruz. Plaka tanımadan tahsilata, bariyerden resmi rapora kadar sistem parçalanmaz.',
    aboutLink: 'Hakkımızda',
    points: [
      { title: 'Yazılım ve donanım birlikte', desc: 'Kiosk, kamera ve kontrol kutusu Zone paneliyle aynı dilde çalışır.' },
      { title: 'Sahada kanıtlanmış', desc: 'Belediye, AVM, site ve lojistik sahalarında kurulu, uzaktan izlenen operasyon.' },
      { title: 'Mevzuata uyumlu gelir', desc: 'Tahsilat, fatura ve resmi entegrasyon tek merkezden yürür.' },
    ],
  },
  stats: heroCopy.proof,
  industries: {
    kicker: 'Kullanım alanları',
    title: 'Aynı altyapı, farklı işletme.',
    inspect: 'İncele',
    items: [
      { title: 'Ücretli otopark ve AVM', desc: 'Girişte plaka, çıkışta kiosk veya HGS. Kaçak kapanır, kuyruk kısalır.', route: 'hardware-products.kiosk' },
      { title: 'Site ve rezidans', desc: 'Sakin, misafir ve personel plakadan ayrılır. Yönetim her yerden bakar.', route: 'website-pricing' },
      { title: 'Belediye ve sokak', desc: 'İhlal, doluluk ve serbest geçiş kameralarla izlenir.', route: 'on-street' },
      { title: 'TIR ve lojistik', desc: 'Yüksek kiosk, çekici-dorse ayrımı, ağır vasıta çıkışı.', route: 'hardware-products.tir-kiosk' },
    ],
  },
  process: {
    kicker: 'Çalışma şeklimiz',
    title: 'Keşiften canlı operasyona.',
    steps: [
      { n: '01', title: 'Keşif', desc: 'Giriş-çıkış, tarife ve entegrasyon yerinde netleşir.' },
      { n: '02', title: 'Kurulum', desc: 'Kamera, kiosk ve panel aynı günde devreye alınır.' },
      { n: '03', title: '7/24 izleme', desc: 'Bariyer, tahsilat ve arıza uzaktan takip edilir.' },
    ],
    cta: 'Hizmetleri incele',
  },
  proof: {
    kicker: 'Referanslar',
    title: 'Kurumlar ve işletmeler Visiosoft ile çalışıyor.',
    more: 'Tüm referanslar',
  },
  close: {
    title: 'Sahanızı birlikte planlayalım.',
    lead: 'Keşif ücretsizdir. Giriş-çıkış, tarife ve donanım ihtiyacı yerinde netleşir.',
    primary: 'Ücretsiz keşif',
    secondary: 'Teklif al',
  },
}
