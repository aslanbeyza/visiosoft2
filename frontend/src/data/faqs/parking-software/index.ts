import tr from './tr.json'

export type ParkingSoftwareFaqItem = {
  question: string
  answer: string
}

export type ParkingSoftwareFaq = {
  meta_description: string
  meta_keywords: string
  section_title: string
  section_intro: string
  question_label: string
  answer_label: string
  items: ParkingSoftwareFaqItem[]
}

const fallback: ParkingSoftwareFaq = {
  meta_description:
    'Bulut tabanlı otopark yazılımı ile otoparkınızı verimli yönetin. Plaka tanıma, ödeme entegrasyonu, KVKK uyumlu veri yönetimi ve belediye otopark yönetim sistemi için sıkça sorulan sorular bu sayfada.',
  meta_keywords:
    'otopark yazılımı, otopark yazılımı sık sorulan sorular, belediye otopark yönetim sistemi, park yönetim yazılımı, parking management software, parking management system, otopark otomasyon, plaka tanıma sistemi, KVKK uyumlu otopark sistemi, car park management software',
  section_title: 'Otopark Yönetim Sistemi Sıkça Sorulan Sorular',
  section_intro:
    'Bu bölümde otopark yazılımı, plaka tanıma sistemi, gelir yönetimi, entegrasyon ve KVKK uyum süreçleri hakkında en çok sorulan soruların net cevaplarını bulabilirsiniz.',
  question_label: 'Soru :',
  answer_label: 'Cevap :',
  items: [],
}

export function parkingSoftwareFaq(): ParkingSoftwareFaq {
  const selected = tr as ParkingSoftwareFaq
  return {
    ...fallback,
    ...selected,
    items: Array.isArray(selected.items) ? selected.items : [],
  }
}
