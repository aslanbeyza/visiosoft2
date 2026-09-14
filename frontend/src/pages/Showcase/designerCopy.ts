// Kaynak: /img/visiosoftPark.webp — kişi adı/avatar içeren üst şerit kırpıldı (1600 × 722 ve yakınlaştırma için 2400 × 1084)
export const designerImage = {
  src: '/img/pages/designer-ekran-crop.webp',
  avif: '/img/pages/designer-ekran-crop.avif',
  width: 1600,
  height: 722,
  alt: 'Designer ekranı: kamera görüntüsü üzerinde çizilmiş A-1, A-2, A-3 ve A-4 park slotları ile slot listesi',
}

export const designerZoomImage = {
  src: '/img/pages/designer-ekran-2400-crop.webp',
  avif: '/img/pages/designer-ekran-2400-crop.avif',
  width: 2400,
  height: 1084,
  alt: designerImage.alt,
}

/** Slot köşeleri, 1600 × 722 kırpımın piksel koordinatlarında (ekrandaki mavi çizimlerin üzerinden). */
export const designerSlots = [
  { id: 'A-1', d: 'M91 405 L310 401 L397 562 L120 584 Z', chip: { x: 12.6, y: 50.5 } },
  { id: 'A-2', d: 'M348 399 L575 394 L724 554 L451 566 Z', chip: { x: 28.9, y: 49.8 } },
  { id: 'A-3', d: 'M612 398 L811 393 L1009 541 L761 556 Z', chip: { x: 44.5, y: 49.6 } },
  { id: 'A-4', d: 'M856 393 L1087 386 L1323 517 L1054 533 Z', chip: { x: 60.3, y: 48.9 } },
]

export const slotDrawCopy = {
  id: 'cizim',
  headingId: 'cizim-baslik',
  eyebrow: 'Designer ekranı',
  title: 'Slotlar kamera görüntüsü üzerine çizilir.',
  lead: 'Araç slotları çizilir, panelden kolayca yönetilir; kamera açıları değiştiğinde kalibrasyon çok kolaydır.',
  caption: 'Designer — kamera görüntüsü üzerinde slot çizimi · demo verisi',
  phasesLabel: 'Designer ile kurulum adımları',
  phases: ['Slotları çizin', 'Panelden yönetin', 'Açı değişince kalibre edin'],
  replay: 'Çizimi yeniden oynat',
  open: 'Ekranı büyütün',
}

export const designerStoryCopy = {
  id: 'designer-saha-kurulumu',
  eyebrow: 'Saha kurulum ve yönetim yazılımı',
  title: 'Kuş bakışı takibin temeli.',
  checksLabel: 'Designer ile yapılanlar',
  checks: [
    'Araç slotları kamera görüntüsü üzerine çizilir',
    'Slotlar panelden kolayca yönetilir',
    'Kamera açısı değiştiğinde kalibrasyon kolaydır',
    'Otopark dijital ortamda en verimli şekilde tasarlanır',
  ],
}
