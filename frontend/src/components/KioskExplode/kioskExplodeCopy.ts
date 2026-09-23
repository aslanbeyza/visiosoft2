import { kioskZoomImage } from '../../data/kioskZoom.ts'

export const KIOSK_EXPLODE_ID = 'iceriden'

export const kioskExplodeCopy = {
  id: KIOSK_EXPLODE_ID,
  hint: 'Kaydırarak parçalarına ayırın',
  rail: 'Parçalara ayrılış',
  loading: 'Model yükleniyor',
  step: 'Adım',
  image: kioskZoomImage,
  screen: {
    welcome: 'Hoş geldiniz',
    payLead: 'Ödeme yapmak için',
    payTitle: 'KARTINIZI OKUTUN',
    brand: 'VISIOSOFT',
  },
  phases: [
    {
      at: 0,
      title: 'Çıkışta temassız tahsilat',
      desc: 'Müşterileriniz plaka girmeden çıkış noktasında temassız ödeme yapabilir.',
    },
    {
      at: 0.3,
      title: 'Tek erişim hattı',
      desc: 'HGS, POS, QR, yazıcı ve ağ birimi aynı gövdede toplanır.',
    },
    {
      at: 0.52,
      title: 'Gövde açılıyor',
      desc: 'HGS ile entegre çalışır ve serbest geçiş (freeflow) senaryolarını destekler.',
    },
    {
      at: 0.72,
      title: 'İçeride ne var?',
      desc: 'Uzaktan 7/24 takip edilebilir ve sesli yönlendirme desteği sunar.',
    },
  ],
  parts: [
    {
      partId: 'tabletsc',
      code: 'A-01',
      title: '13" dokunmatik arayüz',
      desc: 'Kullanıcı yönlendirmesi için net ve hızlı arayüz. Sürücü akışı sesli yönlendirme ile desteklenir.',
      side: 'right' as const,
    },
    {
      partId: 'Cube',
      code: 'A-02',
      title: 'Ekran Muhafazası',
      desc: 'Geçiş kararı sahada verilir; bağlantı kesilse de plaka okuma, bariyer kontrolü ve geçiş logları sürer.',
      side: 'left' as const,
    },
    {
      partId: 'pos',
      code: 'A-03',
      title: 'Banka Kartı ve Temassız Ödeme',
      desc: 'Banka POS terminali. HGS, POS ve QR kanalları birlikte çalışır.',
      side: 'left' as const,
    },
    {
      partId: 'printer1',
      code: 'A-04',
      title: 'Termal Fiş Yazıcı',
      desc: '300 metre termal yazıcı rulo desteği sayesinde haftalarca fiş takviyesi gerektirmez.',
      side: 'right' as const,
    },
    {
      partId: 'PC_fan',
      code: 'A-05',
      title: 'Havalandırmalı gövde',
      desc: 'Sürekli çalışmaya uygun iç iklim desteği.',
      side: 'left' as const,
    },
  ],
}

export type KioskExplodePart = (typeof kioskExplodeCopy.parts)[number]
export type KioskExplodePhase = (typeof kioskExplodeCopy.phases)[number]
