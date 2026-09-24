export type PillarId = 'stack' | 'operation' | 'revenue'

export const homeIntroCopy = {

  eyebrow: 'Kurumsal',
  title: 'Tek işimiz otopark otomasyonu.',
  statement:
    'Yazılım, saha donanımı ve 7/24 operasyonu aynı ekipte tutuyoruz. Plaka tanımadan tahsilata, bariyerden resmi rapora kadar sistem parçalanmaz.',
  pillarsLabel: 'Çalışma ilkelerimiz',
  pillars: [
    {
      id: 'stack',
      title: 'Yazılım ve donanım aynı elde',
      description:
        'Kiosk, kamera, kontrol kutusu ve Zone paneli ayrı tedarikçilerin birleşimi değil. Saha ile yazılım birbirini tamamlar.',
    },
    {
      id: 'operation',
      title: 'Operasyon parçalanmaz',
      description: 'Keşif, kurulum ve 7/24 destek tek muhatapta kalır. Bariyer, tahsilat ve arıza uzaktan takip edilir.',
    },
    {
      id: 'revenue',
      title: 'Gelir resmi kayda döner',
      description: 'EPDK ve GİB entegrasyonu, fatura ve raporlama merkezi panelden yürür.',
    },
  ] satisfies { id: PillarId; title: string; description: string }[],
}
