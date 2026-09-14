import { references } from '../../pages/References/references.ts'
import bakirkoyLogo from './logos/bakirkoy-belediyesi.webp'
import basaksehirFkLogo from './logos/basaksehir-fk.webp'

/**
 * Ana sayfadaki seçili 12 referans logosu (HOME3.md §4.2 sırası).
 * - size: kullanılan dosyanın gerçek piksel ölçüsü (HomeReferences/homeReferencesCopy.ts `logoSizes` kopyası).
 * - crop: logonun şeffaf/beyaz kenar dışındaki içerik kutusu [x, y, genişlik, yükseklik] (piksel; tarayıcı canvas'ı ile ölçüldü).
 * - width: kutunun hücre genişliğine oranı (%); optik alan eşitlemesi ile hesaplandı: hedef alan sabit,
 *   yoğun (dolu zeminli) logolar küçültülür, ince yazı logoları büyütülür, en/boy sınırları hücre içinde kalır.
 * - lift: açık gri zeminli dosyalar; zemin, parlaklık artışıyla beyaza çekilir.
 * - solid: dolu, koyu zeminli işaretler; gri hâlde daha düşük opaklıkla çizgi logolarla aynı optik ağırlığa çekilir.
 * - src: gösterim ölçüsünün çok üstündeki PNG'lerin yerine, içerik kutusuna kırpılmış ~2× webp kopyası (./logos).
 */
type CuratedLogo = {
  file: string
  size: [number, number]
  crop: [number, number, number, number]
  width: number
  lift?: boolean
  solid?: boolean
  src?: string
}

const curated: CuratedLogo[] = [
  { file: 'İstanbul Valiliği.png', size: [144, 107], crop: [10, 8, 125, 85], width: 42 },
  // 600×600 PNG yerine içerik kutusu kırpılmış 400×114 webp.
  { file: 'Bakıröy Belediyesi.png', size: [400, 114], crop: [2, 2, 396, 110], width: 66, src: bakirkoyLogo },
  { file: 'başakşehir belediyesi.png', size: [144, 130], crop: [14, 14, 116, 102], width: 39, lift: true },
  { file: 'Sarıyer Belediyesi.png', size: [139, 125], crop: [14, 13, 112, 102], width: 36 },
  { file: 'eyupsultan belediyesi.png', size: [111, 175], crop: [14, 13, 83, 148], width: 20 },
  { file: 'Buyukcekmece Belediyesi.png', size: [138, 126], crop: [10, 14, 114, 98], width: 36 },
  { file: 'YTÜ.png', size: [123, 67], crop: [14, 12, 96, 42], width: 54 },
  { file: 'ytü Yıldız teknopark.png', size: [134, 54], crop: [14, 14, 106, 26], width: 66 },
  { file: 'Crowne Plaza.png', size: [141, 72], crop: [13, 14, 114, 45], width: 60 },
  { file: 'İstanbul Akvaryum.png', size: [121, 93], crop: [13, 14, 94, 65], width: 44 },
  // 316×400 PNG yerine içerik kutusu kırpılmış 164×212 webp.
  { file: 'İstanbul_Başakşehir_FK (1).png', size: [164, 212], crop: [2, 2, 160, 208], width: 24, solid: true, src: basaksehirFkLogo },
  { file: 'Metropark awm.png', size: [143, 145], crop: [9, 14, 121, 117], width: 24, lift: true, solid: true },
]

/** Kenar yumuşatması kesilmesin diye içerik kutusu her yönde 2 px genişletilir. */
const PAD = 2

export type TrustLogo = {
  key: string
  src: string
  name: string
  website: string | null
  width: number
  height: number
  /** Kırpma kutusunun en/boy oranı. */
  ratio: number
  /** Kutunun hücre genişliğine oranı (%). */
  boxWidth: number
  /** Görselin kırpma kutusuna göre konumu ve ölçüsü (%). */
  imgStyle: { width: string; height: string; left: string; top: string }
  lift: boolean
  solid: boolean
}

const pct = (value: number) => `${(value * 100).toFixed(3)}%`

export const trustLogos: TrustLogo[] = curated.flatMap((logo) => {
  const ref = references.find((item) => item.file === logo.file)
  if (!ref) return []
  const [w, h] = logo.size
  const x = Math.max(0, logo.crop[0] - PAD)
  const y = Math.max(0, logo.crop[1] - PAD)
  const cw = Math.min(w, logo.crop[0] + logo.crop[2] + PAD) - x
  const ch = Math.min(h, logo.crop[1] + logo.crop[3] + PAD) - y
  return [
    {
      key: logo.file,
      src: logo.src ?? ref.url,
      name: ref.name,
      website: ref.website,
      width: w,
      height: h,
      ratio: cw / ch,
      boxWidth: logo.width,
      imgStyle: { width: pct(w / cw), height: pct(h / ch), left: pct(-x / cw), top: pct(-y / ch) },
      lift: Boolean(logo.lift),
      solid: Boolean(logo.solid),
    },
  ]
})
