// /isgaliye-ve-park-ceza sayfasının Türkçe metinleri (mevcut sayfa metinlerinden derlendi).

export type ViolationId = 'evDouble' | 'doubleSlot' | 'lineCross' | 'outside' | 'disabled' | 'fossil' | 'marked' | 'rented'

export type Violation = { id: ViolationId; label: string; hint: string }

/** Bölüm başlığı kimlikleri (aria-labelledby). */
export const titleIds = { hero: 'isgaliye-baslik', board: 'ihlal-turleri-baslik', audit: 'denetim-baslik', process: 'surec-baslik' }

export const violationsCopy = {
  seo: {
    title: 'İşgaliye ve Park Ceza | Visiosoft',
    description:
      'Yanlış park, çift slot kullanımı ve süre aşımı tespiti. Şarj, engelli ve kiralanmış slotların doğru kullanımı için kamera denetimi.',
  },
  hero: {
    eyebrow: 'Otopark ihlali',
    title: ['İşgaliye ve', 'park cezası'],
    lead: 'Kural dışı park ve slot işgalini görüntüden tespit edin; boşa giden kapasiteyi ve gelir kaybını azaltın.',
    primary: 'Teklif Al',
    secondary: 'İhlal türlerini inceleyin',
  },
  board: {
    id: 'ihlal-turleri',
    eyebrow: 'İhlal türleri',
    title: 'Sık görülen park ihlalleri',
    lead: 'Plandaki 1–8 numaraları listedeki sırayla aynıdır. Numaraya veya satıra tıklayın; ilgili slot vurgulanır.',
    listLabel: 'Sekiz ihlal türü',
    diagramLabel: 'Park alanı planı: slotlar, şarj alanları, engelli ve kiralanmış park yerleri',
  },
  violations: [
    { id: 'evDouble', label: 'Çift şarj alanına park etme', hint: 'Araç iki şarj slotunu birden kapatır.' },
    { id: 'doubleSlot', label: 'Çift park slotuna park etme', hint: 'Tek araç iki park slotunu kullanır.' },
    { id: 'lineCross', label: 'Hat ihlali park etme', hint: 'Araç slot çizgisinin üzerine taşar.' },
    { id: 'disabled', label: 'Engelli araç park yeri', hint: 'Engelli park yeri yetkisiz araçça kullanılır.' },
    { id: 'marked', label: 'İşaretlenmiş slota park etme', hint: 'Park yasağı işaretli alana araç bırakılır.' },
    { id: 'outside', label: 'Slot dışına park etme', hint: 'Araç manevra alanında, slot dışında bekler.' },
    { id: 'fossil', label: 'Şarj slotuna fosil yakıtlı araç', hint: 'Şarj slotunu elektrikli olmayan araç kapatır.' },
    { id: 'rented', label: 'Kiralanmış slota park etme', hint: 'Kiralanmış slotu başka bir araç kullanır.' },
  ] satisfies Violation[],
  audit: {
    id: 'denetim',
    eyebrow: 'Denetim altyapısı',
    title: 'Kurallara sürekli uyum, daha az kazanç kaybı.',
    lead: 'Kamera görüntüsü üzerinden slot kurallarına aykırı park durumları sürekli denetlenir.',
    checks: [
      'Gereksiz kullanım ve işgaliyenin önüne geçer',
      'Hatalı park ve süre aşımı tespiti',
      'Şarj, engelli ve kiralanmış slotların doğru kullanımı',
      'Kazanç kaybınızı önlemeye yardımcı olur',
    ],
    chip: 'Kamera görüntüsü',
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
        description: 'Kamera ve yazılım kurala aykırı park durumlarını işaretler.',
      },
      {
        title: 'İhlal kayda geçer',
        description: 'Tespit edilen durumlar işgaliye ve park ceza süreçleriniz için raporlanır.',
      },
    ],
  },
}
