
export type SlotId = 'alpr' | 'visiobox' | 'camera' | 'bentoExtra' | 'hgs'

export type VideoSource = { src: string; type: string }

export type VideoSlotDef = {
  file: string
  sources: VideoSource[]
  poster?: string
  fallbackImage?: string
  startImage?: string
  aspect: string
  duration: string
  prompt: string
}

export const videoSlots: Record<SlotId, VideoSlotDef> = {
  alpr: {
    file: 'public/video/bento/alpr.mp4',
    sources: [{ src: '/video/bento/alpr.mp4', type: 'video/mp4' }],
    poster: '/video/bento/alpr.jpg',
    fallbackImage: '/img/kamera_muhafazasi.webp',
    startImage: '/img/kamera_muhafazasi.webp',
    aspect: '16:9',
    duration: '5–7 sn',
    prompt:
      'Bu karedeki kırmızı-beyaz plaka tanıma kamerasını birebir koru. Parlak kırmızı güneşlik, mat beyaz gövde, ön cam, vidalar ve yan yazı aynı kalsın. Yavaş 3D yörünge, 25 derece, merceğe hafif yaklaş. Açık high-key stüdyo, #f5f5f7 beyaz zemin, yumuşak gölge. Fotogerçekçi ürün filmi, 35mm. Yeni yazı, HUD yok. Gece ve neon yok.',
  },
  visiobox: {
    file: 'public/video/bento/visiobox.mp4',
    sources: [{ src: '/video/bento/visiobox.mp4', type: 'video/mp4' }],
    poster: '/video/bento/visiobox.jpg',
    fallbackImage: '/img/visio_parking_box_pro.webp',
    startImage: '/img/visio_parking_box_pro.webp',
    aspect: '16:9',
    duration: '5–7 sn',
    prompt:
      'Bu karedeki kırmızı kapaklı beyaz kontrol kutusunu birebir koru. Kilit, güç girişi, kablo rakorları ve fan ızgarası aynı kalsın. Yavaş 3D yörünge, 25 derece, kapak ve ön panel net görünsün. Açık high-key stüdyo, #f5f5f7 beyaz zemin, yumuşak gölge. Fotogerçekçi ürün filmi, 35mm. Yeni yazı, HUD yok. Gece ve neon yok.',
  },
  camera: {
    file: 'public/video/bento/camera.mp4',
    sources: [{ src: '/video/bento/camera.mp4', type: 'video/mp4' }],
    poster: '/video/bento/camera.jpg',
    fallbackImage: '/img/kamera_muhafazasi.webp',
    startImage: '/img/kamera_muhafazasi.webp',
    aspect: '16:9',
    duration: '5–7 sn',
    prompt:
      'Bu karedeki kırmızı-beyaz kamera muhafazasını birebir koru. Güneşlik, ön cam ve vidalar aynı. Yavaş 3D yörünge, 25 derece, ürün stüdyoda döner gibi. Açık high-key stüdyo, #f5f5f7 beyaz zemin, yumuşak gölge. Fotogerçekçi ürün filmi, 35mm. Yeni yazı, HUD yok. Gece ve neon yok.',
  },
  bentoExtra: {
    file: 'public/video/bento/flow.mp4',
    sources: [{ src: '/video/bento/flow.mp4', type: 'video/mp4' }],
    poster: '/video/bento/flow.jpg',
    fallbackImage: '/img/kamera-montaj-kulesi.png',
    startImage: '/img/kamera-montaj-kulesi.png',
    aspect: '16:9',
    duration: '4–6 sn',
    prompt:
      'Bu karedeki beyaz kamera montaj kulesini birebir koru. Kırmızı tepe kapak, kırmızı yan paneller ve beyaz kaide aynı kalsın. Yavaş 3D yörünge, 25 derece, alttan üste dikey tanıtım. Açık high-key stüdyo, #f5f5f7 beyaz zemin, yumuşak gölge. Fotogerçekçi ürün filmi, 35mm. Yeni yazı, HUD yok. Gece ve neon yok.',
  },
  hgs: {
    file: 'public/video/story/hgs.mp4',
    sources: [{ src: '/video/story/hgs.mp4', type: 'video/mp4' }],
    poster: '/video/story/hgs.jpg',
    fallbackImage: '/img/ucret_gostergesi_led_reklam.webp',
    startImage: '/img/ucret_gostergesi_led_reklam.webp',
    aspect: '16:9',
    duration: '6–8 sn',
    prompt:
      'Bu karedeki beyaz gövdeli, kırmızı kaideli ücret ve HGS panelini birebir koru. Üst LED, orta marka ve alt tarife tablosu aynı kalsın. Yavaş 3D yörünge, 25 derece. LED hafif yanar, yeni yazı ekleme. Açık high-key stüdyo, #f5f5f7 beyaz zemin, yumuşak gölge. Fotogerçekçi ürün filmi, 35mm. HUD yok. Gece ve neon yok.',
  },
}

export const slotUi = {
  drop: 'Videoyu bu adla kaydet',
  copy: 'Promptu kopyala',
  copied: 'Kopyalandı',
  engine: 'Google Flow',
  missing: 'Video bekleniyor',
  start: 'Başlangıç',
}
