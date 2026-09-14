// /isgaliye-ve-park-ceza sayfasının Türkçe metinleri (mevcut sayfa metinlerinden derlendi).

export type ViolationId = 'evDouble' | 'doubleSlot' | 'lineCross' | 'outside' | 'disabled' | 'fossil' | 'marked' | 'rented'

export type Violation = { id: ViolationId; label: string; hint: string }

/** Bölüm başlığı kimlikleri (aria-labelledby). */
export const titleIds = { hero: 'isgaliye-baslik', board: 'ihlal-turleri-baslik', audit: 'denetim-baslik', process: 'surec-baslik' }

export const violationsCopy = {
  seo: {
    title: 'İşgaliye ve Park Ceza | Akıllı Park Sistemi - Visiosoft',
    description:
      'Gereksiz kullanım ve işgaliyenin önüne geçerek, Akıllı Park Sistemi ile kazanç kaybınızı önleyin. Hatalı park ve süre aşımı tespiti.',
  },
  hero: {
    eyebrow: 'Yapay Zeka Destekli',
    title: ['İşgaliye ve', 'Park Ceza'],
    lead: 'Gereksiz kullanım ve işgaliyenin önüne geçerek, Akıllı Park Sistemi ile kazanç kaybınızı önleyin.',
    primary: 'Teklif Al',
    secondary: 'İhlal türlerini inceleyin',
  },
  board: {
    id: 'ihlal-turleri',
    eyebrow: 'Akıllı Park Sistemi',
    title: 'İşgaliye ve Park Ceza Durumları',
    lead: 'Bir durumun üzerine gelin ya da seçin; park alanı planında ilgili slot vurgulanır.',
    listLabel: 'İhlal türleri',
    diagramLabel: 'Park alanı planı: slotlar, şarj alanları, engelli ve kiralanmış park yerleri',
    selected: 'Planda gösterilen durum · temsilî çizim',
    pause: 'Otomatik gösterimi duraklat',
    play: 'Otomatik gösterimi başlat',
    legend: [
      { key: 'ev', label: 'Şarj slotu' },
      { key: 'disabled', label: 'Engelli park yeri' },
      { key: 'rented', label: 'Kiralanmış slot' },
      { key: 'marked', label: 'İşaretlenmiş slot' },
    ],
  },
  violations: [
    { id: 'evDouble', label: 'Çift şarj alanına park etme', hint: 'Araç iki şarj slotunu birden kapatır.' },
    { id: 'doubleSlot', label: 'Çift park slotuna park etme', hint: 'Tek araç iki park slotunu kullanır.' },
    { id: 'lineCross', label: 'Hat ihlali park etme', hint: 'Araç slot çizgisinin üzerine taşar.' },
    { id: 'outside', label: 'Slot dışına park etme', hint: 'Araç manevra alanında, slot dışında bekler.' },
    { id: 'disabled', label: 'Engelli araç park yeri', hint: 'Engelli park yeri yetkisiz araçça kullanılır.' },
    { id: 'fossil', label: 'Şarj slotuna fosil yakıtlı araç', hint: 'Şarj slotunu elektrikli olmayan araç kapatır.' },
    { id: 'marked', label: 'İşaretlenmiş slota park etme', hint: 'Park yasağı işaretli alana araç bırakılır.' },
    { id: 'rented', label: 'Kiralanmış slota park etme', hint: 'Kiralanmış slotu başka bir araç kullanır.' },
  ] satisfies Violation[],
  audit: {
    id: 'denetim',
    eyebrow: 'Denetim altyapısı',
    title: 'Kurallara sürekli uyum, daha az kazanç kaybı.',
    lead: 'Yapay zeka destekli denetim altyapısı, park alanındaki ihlalleri tespit ederek kurallara sürekli uyum sağlar.',
    checks: [
      'Gereksiz kullanım ve işgaliyenin önüne geçer',
      'Hatalı park ve süre aşımı tespiti',
      'Şarj, engelli ve kiralanmış slotların doğru kullanımı',
      'Kazanç kaybınızı önlemeye yardımcı olur',
    ],
    chip: 'Kamera görüntüsü',
    caption: 'Kapalı otopark alanı · temsilî görsel',
    alt: 'Sarı şerit ve kolon işaretleri olan boş kapalı otopark koridoru',
  },
  process: {
    id: 'surec',
    eyebrow: 'Nasıl işler',
    title: 'Kuraldan tespite üç adım.',
    steps: [
      {
        title: 'Slot kuralları tanımlanır',
        description: 'Şarj, engelli, kiralanmış ve işaretlenmiş slotlar park alanı planında belirlenir.',
      },
      {
        title: 'Park alanı denetlenir',
        description: 'Yapay zeka destekli denetim altyapısı kurala aykırı park durumlarını tespit eder.',
      },
      {
        title: 'İhlal kayda geçer',
        description: 'Tespit edilen durumlar işgaliye ve park ceza süreçleriniz için raporlanır.',
      },
    ],
  },
  cta: {
    eyebrow: 'Akıllı Park Sistemi',
    title: 'Park alanınızdaki ihlalleri birlikte planlayalım.',
    description: 'Slot yapınızı ve denetlemek istediğiniz durumları paylaşın; size uygun kurulumu önerelim.',
    primary: 'Teklif Al',
    secondary: 'İletişime geçin',
  },
}
