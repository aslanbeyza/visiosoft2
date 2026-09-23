/** /otopark-terimleri — keşif ve saha dilindeki Visiosoft terimleri. */
export const glossaryCopy = {
  seoTitle: 'Otopark Terimleri | Visiosoft',
  seoDescription:
    'Plaka tanıma, HGS, kiosk, Zone, işgaliye ve saha operasyonunda geçen otopark terimlerinin kısa açıklamaları.',
  eyebrow: 'Destek',
  title: 'Otopark terimleri',
  lead: 'Keşifte, kurulumda ve panelde geçen saha dilini kısa maddelerle açıklıyoruz. Genel yazılım sözlüğü değil; otopark operasyonunun kendi kelimeleri.',
  count: (n: number) => `${n} terim`,
  searchLabel: 'Terim ara',
  searchPlaceholder: 'Plaka tanıma, HGS, kiosk…',
  filterLabel: 'Konu süzgeci',
  all: 'Tümü',
  lettersLabel: 'Harfe göre atla',
  result: (n: number) => (n === 1 ? '1 terim' : `${n} terim`),
  emptyTitle: 'Bu aramaya uyan terim yok',
  emptyBody: 'Başka bir kelime deneyin ya da süzgeci temizleyin. Aradığınız saha terimi listede yoksa ekibimize sorun.',
  clear: 'Süzgeci temizle',
  related: 'İlgili sayfa',
  also: 'Ayrıca',
} as const

export const topicLabels = {
  recognition: 'Plaka tanıma',
  hardware: 'Donanım',
  payment: 'Tahsilat',
  software: 'Yazılım',
  field: 'Saha',
} as const

export type TopicKey = keyof typeof topicLabels

export const topicOrder: TopicKey[] = ['recognition', 'hardware', 'payment', 'software', 'field']
