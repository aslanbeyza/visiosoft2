
import { hardwareItems } from './data.ts'

const productNames = hardwareItems.map((item) => item.name)

export const listingSeo = {
  title: 'Donanım Ürünleri | Visiosoft',
  description: `Visiosoft donanım ürünleri: ${productNames.slice(0, -1).join(', ')} ve ${productNames.at(-1)}.`,
}

export const heroCopy = {
  eyebrow: 'Visiosoft donanım',
  titleLines: ['Otopark', 'donanımları.'],
  lead: 'Kiosk, kabin, kontrol kutusu ve saha ekipmanlarını geliştiriyor, kurulum sonrası destekliyoruz.',
  primary: 'Ürünleri inceleyin',
  secondary: 'Donanım Kataloğunu Aç',
  lineupLabel: 'Ürün dizisi',
  lineupNote: 'Yükseklikler ürün ölçülerine göre orantılanmıştır; ölçüsü belirtilmeyen ürünler temsilî ölçektedir.',
  heightUnit: 'mm',
  heightLabel: 'Yükseklik',
}

export const productsCopy = {
  eyebrow: 'Ürünler',
  title: 'Donanım ürünleri.',
  description: 'Kiosk, kontrol kutusu, kabin ve saha bileşenlerini inceleyin.',
  filterLabel: 'Kategoriye göre filtrele',
  all: 'Tümü',
  action: 'İncele',
  resultSuffix: 'ürün gösteriliyor',
}

export const systemTileCopy = {
  eyebrow: 'Birlikte çalışır',
  title: 'Bir çıkış noktası, tek sistem.',
  description: 'Donanımlar birlikte çalışacak şekilde tasarlanır; kurulum ve destek tek çözüm ortağından.',
  link: 'Uçtan uca sistemi inceleyin',
  steps: [
    { slug: 'kamera-muhafaza', role: 'Kamerayı dış ortamda korur', height: 0.34 },
    { slug: 'kiosk', role: 'Çıkışta temassız ödeme alır', height: 1 },
    { slug: 'visiobox', role: 'Bariyer ve sensörleri yönetir', height: 0.4 },
    { slug: 'rack-kabin', role: 'Saha ekipmanlarını barındırır', height: 0.56 },
  ],
} as const

export const categoriesCopy = {
  eyebrow: 'Kategoriler',
  title: 'Sahadaki her nokta için bir donanım.',
  description:
    'İhtiyacınız olan otopark donanımlarını tek çözüm ortağından temin edersiniz; tüm ürünler birlikte çalışacak şekilde tasarlanır.',
  showProducts: 'ürünlerini göster',
  productUnit: 'ürün',
  statsLabel: 'Donanım ve şirket bilgileri',
  stats: {
    products: 'Donanım ürünü',
    categories: 'Ürün kategorisi',
    locations: 'Lokasyon',
    locationsNote: 'Showroom, depo, Living LAB ve Teknopark',
    founded: 'Kuruluş yılı',
  },
}

export const catalogTeaserCopy = {
  eyebrow: 'Katalog',
  title: 'Yazdırılabilir donanım kataloğu.',
  description:
    'Tüm ürünler; görsel, kategori, ölçü ve öne çıkan dört özellikle A4 düzeninde tek belgede. Ekranda inceleyin ya da yazdırın.',
  open: 'Donanım Kataloğunu Aç',
  pages: 'sayfa',
  sheetsLabel: 'Katalog sayfalarından örnekler',
}

export const ctaCopy = {
  eyebrow: 'Projeye özel teklif',
  title: 'Sahanız için doğru donanımı birlikte seçelim.',
  description: 'İhtiyaca uygun konfigürasyon ve kurulum için ekibimizle iletişime geçin.',
}
