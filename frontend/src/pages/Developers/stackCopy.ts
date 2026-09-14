// Teknoloji omurgası: yalnızca teknoloji adları ve Türkçe kısa notlar (başarı oranı iddiası yok).
export type StackGroup = {
  mark: string
  title: string
  subtitle: string
  rows: { name: string; note: string }[]
}

export const stackCopy = {
  eyebrow: 'Altyapı',
  title: 'Teknoloji Omurgası',
  lead: 'Kategorize edilmiş, yüksek performanslı ve güvenli modern mimari.',
  groups: [
    {
      mark: 'CPU',
      title: 'Çekirdek ve Backend',
      subtitle: 'Omurga mimarisi',
      rows: [
        { name: 'Laravel', note: 'Sağlam uygulama çatısı' },
        { name: 'PHP 8.5', note: 'Yüksek performans' },
        { name: 'PMSP Server', note: 'Node.js' },
      ],
    },
    {
      mark: 'AI',
      title: 'Yapay Zekâ ve Saha',
      subtitle: 'Uç bilişim',
      rows: [
        { name: 'Python AI', note: 'Derin öğrenme' },
        { name: 'OpenCV', note: 'Görüntü işleme' },
        { name: 'LPR Sistemleri', note: 'Plaka tanıma' },
      ],
    },
    {
      mark: 'OPS',
      title: 'DevOps ve İzleme',
      subtitle: '7/24 sistem sağlığı',
      rows: [
        { name: 'Canlı Pano', note: 'Net genel görünüm' },
        { name: 'Otomatik Görevler', note: 'Arka plan otomasyonu' },
        { name: 'Hata Uyarıları', note: 'Sorun bildirimleri' },
        { name: 'Sunucu Sağlığı', note: 'Sistem durumu' },
      ],
    },
    {
      mark: 'DB',
      title: 'Veri ve Depolama',
      subtitle: 'Senkronizasyon ve yedekleme',
      rows: [
        { name: 'PostgreSQL', note: 'İlişkisel veritabanı' },
        { name: 'Redis', note: 'Önbellek' },
        { name: 'AWS S3', note: 'Nesne depolama' },
      ],
    },
  ] satisfies StackGroup[],
}
