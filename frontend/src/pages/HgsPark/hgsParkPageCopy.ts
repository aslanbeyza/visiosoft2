import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

const description =
  'HGS Park, mevcut plaka tanıma altyapınızı hızlı, güvenli ve düşük maliyetli bir otopark ödeme merkezine dönüştürür. AVM, belediye, sanayi sitesi ve hastaneler için uygundur.'

export const hgsParkPageCopy = {
  seo: {
    title: 'HGS Park | İnsansız Otopark Ödeme Çözümü | Visiosoft',
    description,
  },
  hero: {
    eyebrow: 'Yeni Nesil Ödeme Teknolojisi',
    logoAlt: 'HGS Park',
    title: 'Zamanı konfora dönüştürür.',
    lead: 'Güvenli, konforlu ve hızlı ödemenin yeni yolu ile tanışın.',
    primary: 'Daha Fazla Bilgi',
    secondary: 'İletişime Geçin',
  },
  future: {
    id: 'hgs-park-detay',
    eyebrow: 'Geleceğin Teknolojisi',
    title: 'Otopark ödemelerinde standartları değiştirin.',
    lead: 'HGS Park, pahalı altyapı yatırımlarına gerek kalmadan, mevcut plaka tanıma sisteminizi modern bir ödeme merkezine dönüştürür.',
    diagramLabel: 'HGS Park ile dönüşüm',
    diagram: [
      { kicker: 'Bugün', title: 'Mevcut plaka tanıma sistemi' },
      { kicker: 'Katman', title: 'HGS Park' },
      { kicker: 'Sonuç', title: 'Modern ödeme merkezi' },
    ],
    label: 'HGS Park özellikleri',
    features: [
      {
        icon: 'settings',
        title: 'Hızlı Entegrasyon',
        description: 'Mevcut sisteminize kolayca entegre olur, ek donanım maliyeti gerektirmez.',
      },
      {
        icon: 'card',
        title: 'Otomatik Tahsilat',
        description: 'HGS etiketi üzerinden saniyeler içinde güvenli ödeme alır.',
      },
    ] satisfies { icon: FeatureIconName; title: string; description: string }[],
  },
  scope: {
    id: 'hizmet-kapsami',
    eyebrow: 'Çözümlerimiz',
    title: 'Hizmet Kapsamımız',
    lead: 'Sektör bazlı uzmanlığımızla her işletme modeline uygun esnek çözümler sunuyoruz.',
    activity: {
      title: 'Faaliyet Alanları',
      items: [
        'AVM — alışveriş merkezlerinde hızlı ve temassız ödeme deneyimi',
        'Kamu & Belediye — resmi otoparklarda şeffaf ve güvenilir tahsilat sistemi',
        'Sanayi Sitesi — organize bölgelerde giriş-çıkış ve ödeme kontrolü',
        'Hastane — sağlık kurumlarında kesintisiz ve pratik otopark yönetimi',
      ],
    },
    business: {
      title: 'İşletme Türleri',
      items: [
        'Kapalı Otopark Yönetimi',
        'Yol Üstü Otopark Sistemleri',
        'Alan ve Bölge Ücretlendirme',
        'Giriş/Çıkış Bazlı Entegrasyon',
      ],
    },
  },
  advantages: {
    id: 'avantajlar',
    eyebrow: 'Avantajlar',
    title: 'HGS Park’ın Avantajları',
    lead: 'İşletmeniz ve kullanıcılarınız için değer yaratan çözümler.',
    label: 'HGS Park avantajları',
    items: [
      { title: 'Nakitsiz Tahsilat', description: 'Nakit kullanımı ortadan kalktığı için kasa ve sayım yükü azalır.' },
      { title: 'Kayıp ve Kaçak Önleme', description: 'Kayıp ve kaçak durumları minimum seviyeye indirilir.' },
      { title: 'Hızlı Entegrasyon', description: 'Mevcut sistemlerle kolay entegrasyon ve düşük bakım maliyeti.' },
      { title: 'Mobil Uygulama', description: 'Mobil uygulama aracılığıyla kampanya ve bilgilendirme imkânı.' },
    ],
  },
  cta: {
    eyebrow: 'HGS Park',
    title: 'HGS Park ile maliyeti düşürün, geliri artırın, memnuniyeti yükseltin.',
    description: 'İşletmeniz için daha düzenli tahsilat, kullanıcılarınız için daha konforlu bir çıkış deneyimi.',
    primary: 'Teklif Al',
    secondary: 'İletişim',
  },
  schema: {
    name: 'HGS Park',
    serviceType: 'Otopark ödeme ve tahsilat sistemi',
    areaServed: 'TR',
    description,
  },
}
