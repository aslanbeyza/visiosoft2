import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

type InfraItem = { icon: FeatureIconName; title: string; description: string }

export const comparisonCopy = {
  seoTitle: 'Visiosoft ve Geleneksel Sistemler - Karşılaştırma',
  seoDescription:
    'Visiosoft otopark sistemlerinin geleneksel yazılım ve altyapı ile karşılaştırması: uzaktan erişim, canlı görüntü izleme, özgür yazılım ve ARM işlemci teknolojisi.',

  contrast: {
    eyebrow: 'İki yaklaşım',

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
    title: 'Neler değişir?',
    columns: { question: 'Soru', old: 'Geleneksel sistem', new: 'Visiosoft' },
    rows: [
      {
        question: 'Otoparkı nereden izlersiniz?',
        old: 'Sahada, gişenin başında.',
        new: 'Telefondan ya da ofisten; canlı görüntü ve bariyer durumu tek ekranda.',
      },
      {
        question: 'Sürücü nasıl öder?',
        old: 'Çoğunlukla tek kanaldan.',
        new: 'HGS, POS ve QR ile. HGS geçmezse sistem POS ya da QR’a yönlendirir.',
      },
      {
        question: 'Ödemeden çıkan araç ne olur?',
        old: 'Görevlinin dikkatine kalır.',
        new: 'Her geçiş kayda geçer; kaçak geçiş raporda görünür.',
      },
      {
        question: 'Aboneler ve filolar nasıl yönetilir?',
        old: 'Elle tutulan listelerle.',
        new: 'Panelden tanımlanır, toplu faturalanır.',
      },
      {
        question: 'Birden fazla otoparkınız varsa?',
        old: 'Her saha ayrı yönetilir.',
        new: 'Hepsi tek hesaptan izlenir, raporlar birleşir.',
      },
      {
        question: 'Gece bir sorun çıkarsa?',
        old: 'Mesai saatini beklersiniz.',
        new: '7/24 uzaktan müdahale edilir.',
      },
    ],
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
}
