import type { TopicKey } from './glossaryCopy.ts'

export type GlossaryTerm = {
  id: string
  term: string
  also?: readonly string[]
  definition: string
  topic: TopicKey
  route?: string
}

const collator = new Intl.Collator('tr', { sensitivity: 'base' })

/** Türkçe arama için harf katlama: işgaliye ↔ isgaliye, kuş ↔ kus. */
export function fold(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
}

export function letterOf(term: string) {
  const first = term.trim().charAt(0)
  return first ? first.toLocaleUpperCase('tr-TR') : '#'
}

export function letterId(letter: string) {
  return `harf-${letter.toLocaleLowerCase('tr-TR')}`
}

const items: GlossaryTerm[] = [
  {
    id: 'abonelik',
    term: 'Abonelik',
    definition:
      'Sürücünün belirli bir otoparkta süreli geçiş hakkı. ParkBiz uygulamasından alınır; Zone panelinde yönetilir.',
    topic: 'software',
    route: 'mobil-abonelik',
  },
  {
    id: 'alpr',
    term: 'ALPR',
    also: ['Automatic License Plate Recognition'],
    definition:
      'Kameranın plakayı okuyup oturumu başlatması. Sitede plaka tanıma olarak geçer; sürücü bilet almadan geçer.',
    topic: 'recognition',
    route: 'alpr.index',
  },
  {
    id: 'bariyer',
    term: 'Bariyer',
    definition:
      'Şeridi açıp kapatan kol. Plaka doğrulanınca veya ödeme tamamlanınca kalkar; Visiobox şerit kontrolünü yerinde yürütür.',
    topic: 'hardware',
    route: 'hardware-products.visiobox',
  },
  {
    id: 'beyaz-liste',
    term: 'Beyaz liste',
    definition: 'Önceden yetkilendirilmiş plakalar. Bu listedeki araçlar için geçiş kuralı otomatik uygulanır.',
    topic: 'software',
    route: 'parking-software',
  },
  {
    id: 'confidence',
    term: 'Confidence',
    also: ['Düşük confidence'],
    definition:
      'Plaka okumasının emin olma düzeyi. Sistem emin olamazsa karar operatöre geçer; HGS kaydıyla onaylanabilir.',
    topic: 'recognition',
    route: 'low-confidence',
  },
  {
    id: 'doluluk',
    term: 'Doluluk',
    definition: 'Sahadaki dolu ve boş yerlerin anlık durumu. Kuş bakışı haritada park yerleriyle birlikte görünür.',
    topic: 'field',
    route: 'kus-bakisi',
  },
  {
    id: 'e-arsiv',
    term: 'e-arşiv',
    also: ['GİB e-arşiv'],
    definition: 'Otopark tahsilatının GİB e-arşiv sürecine bağlanması. e-fatura ile aynı panelden yürür.',
    topic: 'field',
    route: 'end-to-end',
  },
  {
    id: 'e-fatura',
    term: 'e-fatura',
    also: ['GİB e-fatura'],
    definition: 'Otopark tahsilatının GİB e-fatura sürecine bağlanması. e-arşiv ve gelir raporları aynı altyapıdadır.',
    topic: 'field',
    route: 'end-to-end',
  },
  {
    id: 'gate-sdk',
    term: 'GATE SDK',
    definition:
      'Sahadaki kiosk, bariyer ve ödeme cihazlarından gerçek zamanlı veri almak için yazılım kiti. Olaylar WebSocket ile sizin uygulamanıza akar.',
    topic: 'software',
    route: 'developers',
  },
  {
    id: 'hgs',
    term: 'HGS',
    also: ['Hızlı Geçiş Sistemi'],
    definition:
      'Etiketli araçlarda plaka ve HGS verisi eşleşince tahsilat otomatik tamamlanır. POS ve QR yedek ödeme kanallarıdır.',
    topic: 'payment',
    route: 'hgs',
  },
  {
    id: 'hub-spoke',
    term: 'Hub & Spoke',
    also: ['Uçtan uca sistem'],
    definition: 'Merkez ve saha noktalarını bağlayan model. Birden fazla tesis tek panelden yönetilir.',
    topic: 'software',
    route: 'end-to-end',
  },
  {
    id: 'isgaliye',
    term: 'İşgaliye',
    also: ['Park cezası'],
    definition:
      'Park yerinin hatalı veya süresiz kullanılması. Çift slot, hat ihlali, engelli yeri gibi durumlar tespit edilir.',
    topic: 'field',
    route: 'parking-violations',
  },
  {
    id: 'kara-liste',
    term: 'Kara liste',
    definition: 'Geçişi kısıtlanan plakalar. Zone panelinden yönetilir.',
    topic: 'software',
    route: 'parking-software',
  },
  {
    id: 'kesif',
    term: 'Keşif',
    definition: 'Kurulumdan önce sahada giriş-çıkış, tarife ve donanım yerleşiminin yerinde netleşmesi.',
    topic: 'field',
    route: 'discovery.show',
  },
  {
    id: 'kiosk',
    term: 'Ödeme kiosku',
    also: ['Kiosk'],
    definition:
      'İnsansız çıkış ödeme noktası. Plakayı eşler, ücreti gösterir; HGS, POS ve QR ile tahsilatı tamamlar.',
    topic: 'hardware',
    route: 'hardware-products.kiosk',
  },
  {
    id: 'kus-bakisi',
    term: 'Kuş bakışı',
    definition: 'Sahanın tamamının tek ekrandan izlenmesi. Park yerleri, kameralar ve doluluk aynı planda durur.',
    topic: 'software',
    route: 'kus-bakisi',
  },
  {
    id: 'led-panel',
    term: 'LED bilgilendirme paneli',
    definition: 'Ücret, yönlendirme ve uyarı mesajlarını sürücüye gösteren saha ekranı.',
    topic: 'hardware',
    route: 'hardware-products.ledli-reklam-paneli',
  },
  {
    id: 'oturum',
    term: 'Oturum',
    definition:
      'Bir aracın girişinden çıkışına kadar tutulan kayıt. Plaka, süre, ücret ve ödeme durumu aynı satırdadır.',
    topic: 'software',
    route: 'parking-software',
  },
  {
    id: 'parkbiz',
    term: 'ParkBiz',
    definition: 'Sürücü uygulaması. Otoparkı bulma, borç ödeme ve abonelik telefondan yürür.',
    topic: 'software',
    route: 'mobil-abonelik',
  },
  {
    id: 'plaka-tanima',
    term: 'Plaka tanıma',
    also: ['Plaka okuma'],
    definition:
      "Giriş ve çıkış kamerasının plakayı okuması. Kayıt Zone'a işlenir; abone, beyaz/kara liste ve HGS ile eşlenir.",
    topic: 'recognition',
    route: 'plate-recognition-system',
  },
  {
    id: 'pos',
    term: 'POS',
    also: ['Temassız kart'],
    definition: 'Banka kartı ve temassız ödeme. HGS bakiyesi yoksa kioskta yedek tahsilat kanalı.',
    topic: 'payment',
    route: 'hgs',
  },
  {
    id: 'qr',
    term: 'QR',
    also: ['Mobil ödeme'],
    definition: 'Sürücünün telefondan tamamladığı ödeme. Sonuç operatör paneline düşer, bariyer açılır.',
    topic: 'payment',
    route: 'hgs',
  },
  {
    id: 'rack-kabin',
    term: 'Rack kabin',
    definition: 'Saha ekipmanının durduğu korumalı kabin.',
    topic: 'hardware',
    route: 'hardware-products.rack-kabin',
  },
  {
    id: 'raporlar',
    term: 'Raporlar',
    definition: "Operasyon, finans ve abonelik dökümleri. Gelir, oturum ve cihaz durumu Zone'dan alınır.",
    topic: 'software',
    route: 'parking-reports',
  },
  {
    id: 'tir-kiosk',
    term: 'TIR ödeme kiosku',
    definition: 'Ağır vasıta şeridine göre yüksek insansız ödeme noktası. Tahsilat kanalları kiosk ile aynıdır.',
    topic: 'hardware',
    route: 'hardware-products.tir-kiosk',
  },
  {
    id: 'togerbox',
    term: 'Togerbox',
    definition: 'Bariyer ve çevre birimlerini toplayan kompakt kontrol kutusu.',
    topic: 'hardware',
    route: 'hardware-products.togerbox',
  },
  {
    id: 'visio-kamera',
    term: 'Visio Kamera',
    also: ['Kamera muhafazası'],
    definition: 'Plaka tanıma kamerası için dış ortam muhafazası. Giriş ve çıkışta plakayı okur.',
    topic: 'hardware',
    route: 'hardware-products.kamera-muhafaza',
  },
  {
    id: 'visiobox',
    term: 'Visiobox',
    definition: 'Bariyer ve saha cihazlarını tek kutuda toplayan şerit kontrol ünitesi.',
    topic: 'hardware',
    route: 'hardware-products.visiobox',
  },
  {
    id: 'webhook',
    term: 'Webhook',
    definition:
      "ZONE API'nin ödeme, ihlal veya cihaz olayını sizin sisteminize bildirmesi. ERP ve raporlama bağları buradan kurulur.",
    topic: 'software',
    route: 'developers',
  },
  {
    id: 'yol-ustu',
    term: 'Yol üstü parklandırma',
    definition: 'Cadde ve sokakta kamera ve HGS ile park tespiti ve tahsilat.',
    topic: 'field',
    route: 'on-street',
  },
  {
    id: 'zone',
    term: 'Zone',
    definition: 'Oturum, tahsilat, abonelik ve cihazların yönetildiği merkezi panel.',
    topic: 'software',
    route: 'parking-software',
  },
  {
    id: 'zone-api',
    term: 'ZONE API',
    definition: 'Zone verisini ERP, CRM veya kendi uygulamanıza bağlayan REST arayüzü.',
    topic: 'software',
    route: 'developers',
  },
]

export const glossaryTerms = [...items].sort((a, b) => collator.compare(a.term, b.term))

export type TermGroup = { letter: string; items: GlossaryTerm[] }

export function groupByLetter(list: GlossaryTerm[]): TermGroup[] {
  const buckets = new Map<string, GlossaryTerm[]>()
  for (const item of list) {
    const letter = letterOf(item.term)
    const bucket = buckets.get(letter)
    if (bucket) bucket.push(item)
    else buckets.set(letter, [item])
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => collator.compare(a, b))
    .map(([letter, group]) => ({ letter, items: group }))
}
