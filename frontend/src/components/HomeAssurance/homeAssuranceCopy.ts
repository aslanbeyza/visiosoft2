/** Ana sayfa güvence metinleri. Güvenlik etiketleri otopark yazılımı metinleriyle aynı kaynaktan. */

export type AssuranceColumnId = 'support' | 'security' | 'integration'
export type WorkStepId = 'discovery' | 'install' | 'monitor'

export const homeAssuranceCopy = {
  eyebrow: 'Güvence',
  title: 'Sahada kesintisiz, veride güvenli, entegrasyonda özgür.',
  lead: 'Uzman destek, kurumsal güvenlik ve açık altyapı.',
  cta: 'Teknik altyapıyı incele',
  support: {
    id: 'support' as const,
    title: 'Kesintisiz Destek',
    lead: 'Sisteminiz yalnız kalmaz.',
    proofs: ['7/24 Destek', 'Saha Ekibi', 'Ücretsiz keşif'],
  },
  security: {
    id: 'security' as const,
    title: 'Kurumsal Güvenlik',
    lead: 'Veriniz her aşamada korunur.',
    proofs: ['SSL/TLS', 'AES-256', 'KVKK'],
  },
  integration: {
    id: 'integration' as const,
    title: 'Açık Entegrasyon',
    lead: 'Mevcut altyapınıza bağlanır.',
    proofs: ['HGS', 'POS', 'QR', 'e-Fatura', 'e-Arşiv', 'REST API', 'Webhook', 'ONVIF', 'ERP'],
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
