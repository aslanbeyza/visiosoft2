import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

export type HubModule = {
  id: string
  mark: string
  title: string
  desc: string
  detail: string
}

export const endToEndCopy = {
  seo: {
    title: 'Uçtan Uca Otopark Sistemi - Visiosoft',
    description:
      'VISIO ile uçtan uca otopark ve şarj otomasyonu. Çağrı merkezi, otopark yönetimi, fatura ve abone yönetimi tek platformda.',
  },
  hero: {
    eyebrow: 'Hub & Spoke Modeli',
    title: 'Uçtan uca otopark sistemi',
    lead: 'Hub & Spoke modeli ile tüm otopark yönetimini tek merkezden yönetin. Çağrı merkezi, otopark yönetimi, fatura ve abone yönetimi VISIO platformunda bir araya gelir.',
    quote: 'Teklif Al',
    contact: 'Daha Fazla Bilgi',
  },
  hub: {
    label: 'VISIO modülleri',
    hint: 'Ayrıntı için bir modül seçin',
    kicker: 'HEPSİ BİR ARADA',
    name: 'VISIO',
    sub: 'Otopark ve Şarj Otomasyonu',
    pause: 'Veri akışı animasyonunu duraklat',
    play: 'Veri akışı animasyonunu oynat',
    pauseShort: 'Duraklat',
    playShort: 'Oynat',
    modulePrefix: 'Modül',
  },
  modules: [
    {
      id: 'cagri-merkezi',
      mark: 'CM',
      title: 'Çağrı Merkezi',
      desc: 'Uzak istasyon',
      detail: 'Sahadaki istasyonlar uzaktan takip edilir; sürücülere sesli yönlendirme ile destek verilir.',
    },
    {
      id: 'otopark-yonetimi',
      mark: 'OY',
      title: 'Otopark Yönetimi',
      desc: 'Saha izleme',
      detail: 'Park alanları, kameralar ve dolu yerler sahanın planı üzerinde görünür; tüm saha tek ekrandan izlenir.',
    },
    {
      id: 'visio-kart',
      mark: 'VK',
      title: 'Visio Kart',
      desc: 'Kart yetkileri',
      detail: 'Kartların geçiş yetkileri tanımlanır ve merkezi panelden yönetilir.',
    },
    {
      id: 'fatura-yonetimi',
      mark: 'FY',
      title: 'Fatura Yönetimi',
      desc: 'e-Fatura ve fiyatlandırma',
      detail: 'Fiyatlandırma, raporlar, e-fatura ve e-arşiv süreçleri aynı panelden yürür.',
    },
    {
      id: 'abone-yonetimi',
      mark: 'AY',
      title: 'Abone Yönetimi',
      desc: 'Kullanıcı ve abonelik',
      detail: 'Kullanıcılar ve aboneler tek yerde toplanır; mobil uygulama ile abonelik ve borç ödeme yapılabilir.',
    },
    {
      id: 'visio-portal',
      mark: 'VP',
      title: 'Visio Portal',
      desc: 'GİB ve EPDK',
      detail:
        'Otopark tahsilatlarında e-fatura ve e-arşiv (GİB), şarj istasyonlarında EPDK entegrasyonu aynı portaldan yürütülür.',
    },
  ] satisfies HubModule[],
  flow: {
    eyebrow: 'Sahada',
    title: 'Girişten çıkışa tek akış',
    lead: 'Plaka tanıma, kayıt doğrulama, ödeme ve bariyer aynı sistemin parçaları olarak birlikte çalışır; her geçiş merkezi panele yansır.',
    label: 'Uçtan uca geçiş akışı',
    caption: 'Temsilî akış çizimi',
  },
  why: {
    eyebrow: 'Avantajlar',
    title: 'Neden Visiosoft?',
    items: [
      {
        icon: 'camera',
        title: 'Her hava koşulunda tanıma',
        description: 'Zorlu ışık ve hava koşullarında bile kesintisiz araç tanıma ve geçiş kontrolü sağlar.',
      },
      {
        icon: 'chart',
        title: 'Merkezi operasyon paneli',
        description: 'Tüm sahaları, kullanıcı akışlarını ve gelir süreçlerini tek ekrandan yönetebilirsiniz.',
      },
      {
        icon: 'invoice',
        title: 'e-fatura ve e-arşiv (GİB)',
        description:
          'Otopark tahsilatları e-fatura ve e-arşiv (GİB) süreçleriyle aynı altyapıda yürür; şarj istasyonlarında EPDK entegrasyonu da desteklenir.',
      },
    ] satisfies { icon: FeatureIconName; title: string; description: string }[],
  },
  cta: {
    eyebrow: 'Uçtan uca',
    title: 'Otoparkınızı tek platformdan yönetin.',
    description: 'Keşif, kurulum ve destek tek muhatapta kalır; bariyer, tahsilat ve arıza uzaktan takip edilir.',
  },
} as const
