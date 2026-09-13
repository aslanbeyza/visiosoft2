export type HgsStepId = 'approach' | 'read' | 'pay' | 'gate'

export type HgsStep = {
  id: HgsStepId
  label: string
  description: string
  channels?: string[]
}

export const homeHgsCopy = {
  eyebrow: 'HGS ile insansız otopark',
  title: 'Maksimum gelir. Minimum bekleme.',
  lead: 'Araçları HGS ile tanıyın, ödemeyi otomatik alın, gerektiğinde POS veya QR senaryosuna geçin.',
  chipsLabel: 'Öne çıkanlar',
  chips: ['Temassız giriş ve çıkış', 'HGS + POS + QR ödeme akışı', 'Gelir kaybı riskini azaltın'],
  primary: { label: 'HGS çözümünü inceleyin', route: 'hgs' },
  secondary: { label: 'HGS Park', route: 'hgs-park' },
  logoAlt: 'HGS Park',
  flow: {
    title: 'Çıkışta tahsilat akışı',
    label: 'HGS ile çıkış akışı',
    channelsLabel: 'Ödeme kanalları',
    steps: [
      { id: 'approach', label: 'Araç yaklaşır', description: 'Giriş veya çıkış şeridine gelen araç kamera ile algılanır.' },
      { id: 'read', label: 'Plaka / HGS okunur', description: 'Araç, plakası ve HGS kaydıyla tanınır.' },
      {
        id: 'pay',
        label: 'Ödeme alınır',
        description: 'Ücret HGS ile otomatik alınır; gerektiğinde POS veya QR ile tamamlanır.',
        channels: ['HGS', 'POS', 'QR'],
      },
      { id: 'gate', label: 'Bariyer açılır', description: 'Ödemesi tamamlanan araç için geçiş açılır.' },
    ] satisfies HgsStep[],
  },
}
