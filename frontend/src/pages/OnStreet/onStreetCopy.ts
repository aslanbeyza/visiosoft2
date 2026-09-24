import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

type IconText = { icon: FeatureIconName; title: string; description: string }

export const onStreetCopy = {
  seo: {
    title: 'Yol Üstü Parklandırma - Visiosoft',
    description: 'Yol kenarı park yerlerinde kamera ile yapay zeka destekli çözüm. HGS entegrasyonu ile otomatik ücretlendirme.',
  },
  hero: {
    eyebrow: 'Kamera ve HGS ile cadde parkı',
    title: 'Yol Üstü Parklandırma',
    lead: 'Yol kenarı park yerlerinde kamera ile yapay zeka destekli çözüm.',
    aside:
      'Yol üzerine yerleştirilen kamera plakayı tespit eder, park ücreti HGS üzerinden çekilir. Gerektiğinde personel el terminalleri ile ödeme alır.',
    primary: 'Daha Fazla Bilgi',
    secondary: 'Teklif Al',
  },
  scene: {
    alt: 'Yol kenarında sıralanmış park hâlindeki araçlar, P levhası ve direğe monte dome kamera çizimi',
    detect: 'Plaka tespiti',
    charge: 'HGS ile ücretlendirme',
    camera: 'PTS kamera',
  },
  how: {
    eyebrow: 'Nasıl çalışır',
    title: 'Kameradan tahsilata dört adım',
    lead: 'Visiosoft’un özel olarak geliştirdiği yazılım, yol üstü park yerlerinden ücret alma sürecini kamera görüntüsü üzerinden yürütür.',
    steps: [
      {
        icon: 'camera',
        title: 'Kamera yerleştirilir',
        description: 'PTS kameralar, yol üstü park yerlerini görecek şekilde yol üzerine konumlandırılır.',
      },
      {
        icon: 'plate',
        title: 'Plaka tespit edilir',
        description: 'Yapay zeka destekli yazılım, kamera görüntüsünden park eden aracın plakasını tespit eder.',
      },
      {
        icon: 'card',
        title: 'Ücret HGS’den çekilir',
        description: 'Tespit edilen plakaya ait park ücreti HGS üzerinden otomatik olarak tahsil edilir.',
      },
      {
        icon: 'phone',
        title: 'Personel tahsilatı',
        description: 'Dilerseniz el terminalleri ile personel kullanarak sahada ödeme alınabilir.',
      },
    ] satisfies IconText[],
  },
  benefits: {
    eyebrow: 'Avantajlar',
    title: 'Cadde parkında ücretlendirme kolaylaşır',
    items: [
      {
        icon: 'plate',
        title: 'Yapay zeka destekli tespit',
        description: 'Yol kenarı park yerlerinde plaka, yol üzerine yerleştirilen kamera ile tespit edilir.',
      },
      {
        icon: 'card',
        title: 'HGS ile otomatik ücretlendirme',
        description: 'HGS entegrasyonu sayesinde park ücreti tespit edilen plaka üzerinden otomatik olarak çekilir.',
      },
      {
        icon: 'users',
        title: 'Personel ile esnek tahsilat',
        description: 'El terminalleri sayesinde personel, HGS dışındaki ödemeleri sahada alabilir.',
      },
    ] satisfies IconText[],
  },
} as const
