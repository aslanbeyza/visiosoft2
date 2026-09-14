/** Ana sayfa 4.7: destek, güvenlik ve entegrasyon metinleri (HOME3.md §4.7, birebir). */

export type AssuranceColumnId = 'support' | 'security' | 'integration'
export type WorkStepId = 'discovery' | 'install' | 'monitor'

export const homeAssuranceCopy = {
  eyebrow: 'Güvence',
  title: 'Kesintisiz destek, güvenli veri, açık entegrasyon.',
  support: {
    id: 'support' as const,
    title: 'Destek',
    items: [
      '7/24 uzaktan destek ve çağrı merkezi',
      'Uzaktan sorunlara anında, saha gerektirenlere saatler içinde müdahale',
      'Kurulum öncesi ücretsiz keşif',
      'Donanımda 2 yıl üretici garantisi',
    ],
  },
  security: {
    id: 'security' as const,
    title: 'Güvenlik',
    items: [
      'SSL/TLS ile veri aktarımı, AES-256 ile şifreli depolama',
      'Rol bazlı yetki, değiştirilemez ve zaman damgalı loglar',
      'KVKK uyumlu süreçler',
      'Günlük artımlı, haftalık tam yedekleme',
      'Bulutta ya da kurum içinde kurulum; bağlantı kesilse de sahada çalışma',
    ],
  },
  integration: {
    id: 'integration' as const,
    title: 'Entegrasyon',
    groups: [
      ['HGS', 'POS', 'QR'],
      ['e-fatura', 'e-arşiv (GİB)'],
      ['REST API', 'Webhook', 'WebSocket SDK'],
      ['ONVIF', 'RTSP', 'RS485', 'TCP/IP'],
      ['Muhasebe ve ERP aktarımı'],
    ],
    link: 'Geliştiriciler için',
  },
  steps: {
    title: 'Çalışma şeklimiz',
    items: [
      { id: 'discovery' as const, title: 'Keşif', description: 'Giriş-çıkış, tarife ve entegrasyon yerinde netleşir.' },
      { id: 'install' as const, title: 'Kurulum', description: 'Kamera, kiosk ve panel planlanan takvimde devreye alınır.' },
      { id: 'monitor' as const, title: '7/24 izleme', description: 'Bariyer, tahsilat ve arıza uzaktan takip edilir.' },
    ],
  },
}
