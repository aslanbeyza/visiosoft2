import type { ParkingFlowDevice } from './parkingFlowCopy.ts'

export type LeaderAnchor = 'start' | 'end'
/** Dar sahne çerçevesi [x, y, genişlik, yükseklik] (viewBox birimi). */
export type LeaderFrame = readonly [number, number, number, number]

/**
 * d: cihazdan etiket noktasına dirsekli çizgi; x/y: etiketin tutunduğu nokta; anchor: etiket noktanın sağında (start)
 * ya da solunda (end). frame: dar sahnede etiket alta indiğinde cihazın çevresine çizilen vurgu çerçevesi.
 */
export type Leader = { d: string; x: number; y: number; anchor: LeaderAnchor; frame: LeaderFrame }

/**
 * Vurgu çizgisi: cihazdan etiket noktasına dirsekli mühendislik oku. Etiket DOM'da yüzde konumla durur.
 *
 * Etiketler yalnız üst banda yerleşir (viewBox birimi; 560 px sahnede kapsül ~56 birim yüksek, uzun adlar ~330 birim):
 * kamera gövdesi (y ≥ 118), direk başlığı (y ≥ 120), kiosk tepesi (y ≥ 137) ve kalkık bariyer kolunun ucu (y ≥ 100) bunun
 * altında kalır. Kamera ile kiosk arasındaki orta boşluk kullanılmaz: plakayı okuyan algılama konisi oradan geçer.
 * Bu sınırlar scratchpad/leftovers/flow/geom.mjs ile her cihaz, etiket ve adım pozunda ölçülür.
 *
 * Çerçeveler cihaz yüzünden en az 16 birim dışarıda durur: zemin renkli hale (7 px) ve halka en dar sahnede (~0,3 px/birim)
 * cihazın simgesine ve kenarına binmez; yalnız direk, ayak ve kol gibi çerçeveden geçen ince çizgiler kısa bir boşlukla kesilir.
 */
export const leaders: Record<ParkingFlowDevice, Leader> = {
  // Çerçeve kamera gövdesini ve lensi sarar; sol kenarı direk başlığının (x ≥ 320) solunda kalır.
  camera: { d: 'M362 118V86h58', x: 420, y: 86, anchor: 'start', frame: [306, 102, 108, 75] },
  // Direğin solundan (LED panel x ≤ 220, direk x ≥ 320) üst banda çıkar: etiket plakayı okuyan koninin üstünde durur.
  // Uzun adlar ("Kontrol kutusu · HGS") 560 px sahnede de kiosk tepesinin ve kalkık kolun (y ≥ 100) üstünde kalır.
  controlBox: { d: 'M304 240H296V40h124', x: 420, y: 40, anchor: 'start', frame: [288, 206, 80, 92] },
  // Direk çizgisi başlıktan üst banda çıkar; etiket kameranın ve plaka etiketinin üstündedir.
  // Dar sahne çerçevesi direğin ayağını ve alt gövdesini sarar: kamera ve kontrol kutusu çerçevenin dışında kalır.
  pole: { d: 'M328 120V60h92', x: 420, y: 60, anchor: 'start', frame: [295, 298, 66, 60] },
  // LED panel çizgisi direğin solunda kalır, etiket üst bantta direk başlığının ve kameranın belirgin biçimde üstündedir.
  ledPanel: { d: 'M169 182V52h59', x: 228, y: 52, anchor: 'start', frame: [102, 166, 134, 104] },
  // Kiosk tepesinden üst banda: etiket kioskun solunda, kamera gövdesinin (y ≥ 118) ve plakayı okuyan koninin üstünde
  // biter; kalkık kol kioskun sağında, gövde menteşesinden yukarı kalkar. Dar sahne çerçevesi kioskun tamamını sarar, yeşile dönen ekran görünür kalır.
  kiosk: { d: 'M715 137V78h-35', x: 680, y: 78, anchor: 'end', frame: [668, 121, 94, 237] },
  // Çizgi hareketli koldan değil direğin gövdesinden çıkar, kiosk ile bariyer arasındaki boşluktan üst banda yükselir;
  // etiket kalkık kolun ucunun ve kioskun üstünde durur.
  barrier: { d: 'M928 300H884V62h-14', x: 870, y: 62, anchor: 'end', frame: [904, 246, 82, 210] },
}
