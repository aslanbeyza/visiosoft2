/**
 * ÜCRET TARİFESİ — SİTEDEKİ TEK ÖRNEK TARİFE
 *
 * Bu basamaklar önceden yalnızca panel demosunun içindeydi (lib/panelDemo.ts
 * · tarife motoru). Hero'daki ledli panelin alt yüzüne aynı tarife basıldığı
 * için tek adrese taşındı: panelin tarife motoru (buildPricings) ve sahnedeki
 * pano AYNI basamaklardan türetilir; kaynakta bir basamak değişirse ikisi
 * birlikte değişir.
 *
 * ÜÇ FARK BİLEREK VAR:
 *  · Panelin Fiyat Tarifesi listesi tutarı KDV HARİÇ gösterir (brüt / 1,2);
 *    pano KDV dahil brütü yazar.
 *  · Panelde oluşturucuyla kaydedilen tarife yalnız panel ekranlarını
 *    değiştirir; sahnedeki pano durağandır.
 *  · Panel demosu gece dönemi katsayısı ve araç sınıfı çarpanı da uygular;
 *    pano yalnız otomobil gündüz tarifesini gösterir ve bunu başlığında yazar.
 *
 * ÖRNEK TARİFEDİR, Visiosoft'un yayınlanmış bir fiyat listesi değildir.
 * Tutarlar brüttür (KDV dahil). Ortalama ≈66 ₺/saattir ve paymentFlow.ts'teki
 * örnek oturumlarla BİREBİR uyuşur:
 *   67 dk → 72,50 ₺ · 102 dk → 112,00 ₺ · 134 dk → 148,00 ₺ · 292 dk → 310,00 ₺
 *
 * Panoda tarife göstermenin kaynağı ürünün kendi sayfasıdır. Ledli reklam
 * paneli · kullanım alanları: "Kampanya ve tarife duyuruları."
 * (Modules/Website/resources/views/parking-product-3d/ledli-reklam-paneli/index.blade.php)
 */

export interface TariffBracket {
  /** Dilimin başladığı dakika */
  from: number;
  /** Dilimin bittiği dakika */
  to: number;
  /** Brüt tutar, KDV dahil (₺) */
  gross: number;
  /** Paneldeki tarife satırının adı */
  label: string;
}

export const GROSS_BRACKETS: TariffBracket[] = [
  { from: 0, to: 15, gross: 0, label: 'İlk 15 Dk' },
  { from: 15, to: 30, gross: 33, label: '15 Dk - 30 Dk' },
  { from: 30, to: 60, gross: 66, label: '30 Dk - 1 Saat' },
  { from: 60, to: 80, gross: 72.5, label: '1 Saat - 1 Sa 20 Dk' },
  { from: 80, to: 100, gross: 99, label: '1 Sa 20 Dk - 1 Sa 40 Dk' },
  { from: 100, to: 120, gross: 112, label: '1 Sa 40 Dk - 2 Saat' },
  { from: 120, to: 150, gross: 148, label: '2 Saat - 2 Sa 30 Dk' },
  { from: 150, to: 180, gross: 180, label: '2 Sa 30 Dk - 3 Saat' },
  { from: 180, to: 240, gross: 235, label: '3 Saat - 4 Saat' },
  { from: 240, to: 300, gross: 310, label: '4 Saat - 5 Saat' },
  { from: 300, to: 360, gross: 360, label: '5 Saat - 6 Saat' },
  { from: 360, to: 480, gross: 450, label: '6 Saat - 8 Saat' },
  { from: 480, to: 720, gross: 560, label: '8 Saat - 12 Saat' },
  { from: 720, to: 1440, gross: 720, label: '12 Saat - 24 Saat' },
];

/* ------------------------------------------------------------------ */
/* SAHNEDEKİ PANO                                                       */
/* ------------------------------------------------------------------ */

/**
 * PANO SATIRLARI — BASAMAKLAR SAAT ARALIKLARINA TOPLANIR.
 *
 * 14 basamak, sahnede yüz piksel boyundaki bir panoya okunur biçimde sığmaz.
 * Basamaklar altı aralığa toplanır ve her satır o aralıktaki EN DÜŞÜK ile EN
 * YÜKSEK tutarı yazar. Böylece pano ödeme bölümündeki örnek oturumların
 * hiçbiriyle çelişmez (hepsi gündüz girişli, otomobil): 1 saat
 * 07 dakika kalan araç 72,50 ₺ öder, pano da "1 – 2 SAAT · 72,50 – 112" der.
 * Yalnız üst sınırı yazmak ("1 – 2 SAAT · 112") ödeme bölümündeki 72,50 ₺'lik
 * işlemle çelişirdi.
 *
 * Aralık sınırları basamak sınırlarıyla hizalı OLMAK ZORUNDADIR; hizasız bir
 * aralık bir basamağı sessizce dışarıda bırakırdı. Aşağıdaki denetim bunu
 * geliştirme sırasında yakalar.
 */
const BOARD_BANDS: readonly (readonly [number, number])[] = [
  [0, 15],
  [15, 60],
  [60, 120],
  [120, 180],
  [180, 300],
  [300, 1440],
];

export interface TariffBoardRow {
  /** Süre aralığı: "1 – 2 SAAT" */
  range: string;
  /** Tutar ya da tutar aralığı, para birimi başlıkta yazar */
  price: string;
  /** Ücretsiz dilim ayrı tonda basılır */
  free: boolean;
}

export interface TariffBoard {
  title: string;
  note: string;
  rows: TariffBoardRow[];
}

/** 72.5 → "72,50" · 112 → "112" — Türkçe ondalık ayırıcı virgüldür */
const money = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace('.', ','));

const duration = (min: number) => (min < 60 ? `${min} DK` : `${min / 60} SAAT`);

function rangeLabel(from: number, to: number): string {
  if (from === 0) return `İLK ${duration(to)}`;
  if (from >= 60) return `${from / 60} – ${to / 60} SAAT`;
  return `${duration(from)} – ${duration(to)}`;
}

const inBand = (lo: number, hi: number) => GROSS_BRACKETS.filter((b) => b.from >= lo && b.to <= hi);

export const TARIFF_BOARD: TariffBoard = {
  title: 'ÜCRET TARİFESİ',
  note: 'OTOMOBİL · GÜNDÜZ · KDV DAHİL · ₺',
  rows: BOARD_BANDS.map(([lo, hi]) => {
    const prices = inBand(lo, hi).map((b) => b.gross);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const free = max === 0;
    return {
      range: rangeLabel(lo, hi),
      price: free ? 'ÜCRETSİZ' : min === max ? money(min) : `${money(min)} – ${money(max)}`,
      free,
    };
  }),
};

if (import.meta.env.DEV) {
  const covered = BOARD_BANDS.reduce((n, [lo, hi]) => n + inBand(lo, hi).length, 0);
  if (covered !== GROSS_BRACKETS.length) {
    console.error(
      `[tariff] Pano aralıkları basamak sınırlarıyla hizalı değil: ${GROSS_BRACKETS.length} basamaktan ${covered} tanesi panoda.`
    );
  }
}
