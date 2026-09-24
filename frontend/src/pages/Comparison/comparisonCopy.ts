import type { ComparisonGroup } from '../../components/ComparisonTable/index.ts'
import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

type InfraItem = { icon: FeatureIconName; title: string; description: string }

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
    title: 'Detaylı karşılaştırma',
    lead: 'Erişimden tahsilata, rapordan desteğe kadar geleneksel kurulum ile Visiosoft’un sahada ne fark yarattığını satır satır görün.',
    caption: 'Geleneksel otopark sistemleri ile Visiosoft özellik karşılaştırması',
    columns: { a: 'Geleneksel', b: 'Visiosoft' },
    groups: [
      {
        heading: 'Erişim ve izleme',
        rows: [
          {
            feature: 'Uzaktan erişim',
            a: false,
            b: 'Her yerden güvenli',
            note: 'Evden, ofisten veya seyahatte Tailscale VPN üzerinden panele ve canlı görüntüye bağlanırsınız.',
          },
          {
            feature: 'Canlı görüntü izleme',
            a: false,
            b: 'Gerçek zamanlı',
            note: 'Giriş-çıkış kameraları ve bariyer durumu Grafana izleme ile tek ekranda takip edilir.',
          },
          {
            feature: 'Mobil uygulama',
            a: false,
            b: 'iOS & Android',
            note: 'Olay bildirimleri, oturum ve işlemler telefonda; gişeye bağlı kalmazsınız.',
          },
          {
            feature: 'Çoklu saha yönetimi',
            a: 'Tek lokasyon odaklı',
            b: 'Tek panelden çok saha',
            note: 'Birden fazla otoparkı aynı Zone hesabından izler, raporları birleştirirsiniz.',
          },
        ],
      },
      {
        heading: 'Tahsilat ve operasyon',
        rows: [
          {
            feature: 'Ödeme yöntemleri',
            a: 'Genelde tek kanal',
            b: 'HGS + POS + QR',
            note: 'HGS başarısızsa POS veya QR’a yönlendirilir; tahsilat zinciri kırılmaz.',
          },
          {
            feature: 'Tahsilat başarısı',
            a: 'Değişken / personel bağımlı',
            b: 'Yüksek, yedekli akış',
            note: 'Kaçak geçiş ve “ödemeden çıktı” senaryoları kayıt altına alınır, gelir takibi netleşir.',
          },
          {
            feature: 'Abonelik ve filo',
            a: 'Manuel listeler',
            b: 'Kurallı geçiş & faturalama',
            note: 'Site sakini, personel ve kurumsal filolar paneldan tanımlanır; toplu faturalama desteklenir.',
          },
          {
            feature: 'İsgaliye / park ihlali',
            a: 'Kağıt veya sözlü takip',
            b: 'Dijital kayıt ve süreç',
            note: 'İhlal satırları, süre ve ücret panoda görünür; operatör müdahalesi belgelenir.',
          },
          {
            feature: 'Raporlama',
            a: 'Sınırlı / dışa aktarım zor',
            b: 'Operasyonel + finansal',
            note: 'Ödeme tipi, bariyer, tarih ve istisna kırılımları; günlük operasyon ve amortisman için net özet.',
          },
        ],
      },
      {
        heading: 'Yazılım ve donanım',
        rows: [
          {
            feature: 'İşletim sistemi',
            a: 'Windows lisansı',
            b: 'Pardus & Ubuntu',
            note: 'Pardus ve Ubuntu ücretsiz, açık kaynaklı Linux dağıtımlarıdır; lisans maliyeti düşer.',
          },
          {
            feature: 'Plaka tanıma (PTS)',
            a: 'Klasik karakter tanıma',
            b: 'Derin öğrenme modeli',
            note: 'Model sahadan öğrenmeye devam eder; zor ışık ve kirli plakada daha tutarlı sonuç.',
          },
          {
            feature: 'Donanım altyapısı',
            a: 'Standart CPU',
            b: 'Nvidia CUDA & ARM',
            note: 'Hızlı plaka tanıma ve verimli GPU/CPU kullanımı; sahada düşük gecikme.',
          },
          {
            feature: 'Otomatik güncelleme',
            a: 'Manuel / yerinde',
            b: 'Uzaktan, planlı',
            note: 'Özellik ve güvenlik yamaları uzaktan uygulanır; saha ziyareti ihtiyacı azalır.',
          },
        ],
      },
      {
        heading: 'Güvenlik ve destek',
        rows: [
          {
            feature: 'Veri güvenliği',
            a: 'Yalnızca yerel disk',
            b: 'Bulut yedekli',
            note: 'Donanım arızası veya hırsızlıkta bile oturum ve faturalama kayıtları korunur.',
          },
          {
            feature: 'KVKK uyumlu veri',
            a: false,
            b: true,
            note: 'Görüntülerdeki yüz ve özel alanlar bulanıklaştırılabilir; saklama politikası tanımlanır.',
          },
          {
            feature: 'Teknik destek',
            a: 'Mesai / sınırlı',
            b: '7/24',
            note: 'Gece vardiyası ve yoğun saatlerde de uzaktan müdahale ve yönlendirme alınır.',
          },
        ],
      },
    ] satisfies ComparisonGroup[],
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
