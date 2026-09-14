/** Ana sayfa 4.2 Kurumsal bölümünün metinleri (HOME3.md §4.2, müşteri onaylı). */
export const homeTrustCopy = {
  eyebrow: 'Kurumsal',
  title: 'Tek işimiz otopark otomasyonu.',
  // "Kurulumdan desteğe" ifadesi 2. ilkede tekrarlandığı için kısaltıldı (tekrar önleme).
  lead: 'Donanımdan yazılıma tüm süreç aynı ekipte.',
  pillars: [
    {
      icon: 'system',
      title: 'Yazılım ve donanım tek sistemde',
      text: 'Kiosk, kamera, kontrol kutusu ve Zone paneli birlikte tasarlanır; parçalar birbirini tamamlar.',
    },
    {
      icon: 'support',
      title: 'Kurulumdan desteğe tek muhatap',
      // Müdahale süresi cümlesi Güvence bölümünde geçtiği için burada kısaltıldı (entegrasyon, tekrar önleme).
      text: 'Keşif, kurulum ve destek aynı ekipten.',
    },
    {
      icon: 'records',
      title: 'Her işlem kayıtlı ve raporlanabilir',
      // e-fatura/e-arşiv, Sistem akışının 6. adımında anlatılıyor; burada kısaltıldı.
      text: 'Giriş, çıkış, ödeme ve bariyer komutları zaman damgalı loglanır ve raporlara aktarılır.',
    },
  ],
  statsLabel: 'Visiosoft rakamlarla',
  stats: {
    since: { value: '2018', label: 'yılından beri hizmette', sr: '2018 yılından beri hizmette' },
    references: { value: 33, label: 'kurumsal referans', sr: '33 kurumsal referans' },
    plate: { value: 100, prefix: '<', suffix: ' ms', label: 'altında plaka tanıma', sr: '100 milisaniyenin altında plaka tanıma' },
    support: { value: '7/24', label: 'uzaktan destek', sr: '7/24 uzaktan destek' },
  },
  logosLabel: 'Seçili referanslar',
  allReferences: '33 referansın tümü',
  external: 'yeni sekmede açılır',
} as const

export type PillarIcon = (typeof homeTrustCopy.pillars)[number]['icon']
