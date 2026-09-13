export type ProcessStepId = 'discovery' | 'install' | 'monitor'

export const homeProcessCopy = {
  eyebrow: 'Çalışma şeklimiz',
  title: 'Keşiften canlı operasyona.',
  cta: 'Ücretsiz keşif',
  steps: [
    { id: 'discovery', title: 'Keşif', description: 'Giriş-çıkış, tarife ve entegrasyon yerinde netleşir.' },
    { id: 'install', title: 'Kurulum', description: 'Kamera, kiosk ve panel planlanan takvimde devreye alınır.' },
    { id: 'monitor', title: '7/24 izleme', description: 'Bariyer, tahsilat ve arıza uzaktan takip edilir.' },
  ] satisfies { id: ProcessStepId; title: string; description: string }[],
}
