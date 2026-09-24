
export const opsSection = {
  eyebrow: 'Uzaktan İzleme · Gelir Yönetimi',
  title: 'Bulut tabanlı',
  titleAccent: 'otopark otomasyonu',

  lede: 'Gelir raporları, kaçak önleme ve otomatik tahsilat tek panelde. Kameraları canlı izleyin, ödemeyi uzaktan yönetin, resmi muhasebeye aktarın. Mimari hibrittir; talep edilirse sistem tamamen kurum veri merkezinde kurulur.',
  kpis: [
    { label: 'Anlık doluluk', value: '847', unit: '/ 1.200', trend: '+4.2%' },
    { label: 'Günlük ciro', value: '184.320', unit: '₺', trend: '+11.8%' },
    { label: 'Ortalama süre', value: '2s 14dk', unit: '', trend: '-3.1%' },
    { label: 'Çevrimiçi cihaz', value: '38', unit: '/ 38', trend: '100%' },
  ],
  devices: [
    { id: 'PTS-01', name: 'Giriş Kamerası A', status: 'online' as const },
    { id: 'PTS-02', name: 'Giriş Kamerası B', status: 'online' as const },
    { id: 'BAR-01', name: 'Bariyer · Giriş', status: 'online' as const },
    { id: 'KIOSK-01', name: 'Ödeme Kiosk · Kat 1', status: 'online' as const },
    { id: 'KIOSK-02', name: 'Ödeme Kiosk · Kat 3', status: 'busy' as const },
    { id: 'PTS-03', name: 'Çıkış Kamerası', status: 'online' as const },
    { id: 'BAR-02', name: 'Bariyer · Çıkış', status: 'online' as const },
    { id: 'LED-01', name: 'Visio Ledli Reklam Paneli', status: 'online' as const },
    { id: 'VBOX-01', name: 'Visiobox · Saha', status: 'online' as const },
    { id: 'RACK-01', name: 'Rack Kabin · Sistem', status: 'warn' as const },
    { id: 'KIOSK-03', name: 'TIR Kiosk · Kuzey', status: 'online' as const },
    { id: 'PTS-05', name: 'Yol Üstü · Sokak 4', status: 'online' as const },
  ],
  plates: [
    '34 VSF 2026', '06 ABC 118', '35 KLM 940', '16 TRE 077', '41 HGS 512',
    '07 DNZ 383', '01 ADN 224', '55 SMS 661', '34 PRK 909', '38 KYS 145',
    '27 GZT 730', '31 HTY 458', '42 KNY 812', '61 TRB 306', '20 DNZ 599',
  ],
  gates: ['Giriş A', 'Giriş B', 'Çıkış A', 'Çıkış B', 'TIR Kapısı'],
  actions: ['Oturum açıldı', 'Ödeme alındı', 'Bariyer açıldı', 'Abone geçişi', 'Beyaz liste', 'Oturum kapandı'],
};

export const corporate = {
  legalName: 'VİSİOSOFT TEKNOLOJİ A.Ş.',
  founded: '07-09-2018',
  taxOffice: 'İKİTELLİ',
  taxNo: '9251021443',
  mersis: '0925102144300001',
  duns: '595600260',

  tradeRegistry: '154166-5',

  eNotification: '25929-47072-05048',

  supportPhone: '0212 909 56 76',
  supportPhoneHref: '+902129095676',

  whatsapp: '+90 501 504 5034',
  whatsappHref: 'https://wa.me/905015045034',
  email: 'info@visiosoft.com.tr',
  locations: [
    {
      k: 'Depo',
      v: 'A Blok Kat 4 No:277, Perpa Ticaret Merkezi, Halil Rıfat Paşa Mahallesi, No:2200, 34384 Şişli / İstanbul',
      note: 'Araç ile 4. kata giriş yaparak ürün teslim alabilirsiniz.',
    },
    {
      k: 'Showroom',
      v: 'Halil Rıfat Paşa Mahallesi, Darülaceze Caddesi, Perpa Ticaret Merkezi A Blok, Kat 8 No:1036, Şişli / İstanbul',
    },
    {
      k: 'Living LAB',
      v: 'Başak Mahallesi, Abdülhamithan Cd No:5, Başakşehir İnovasyon Merkezi, Başakşehir - İstanbul',
    },
    {
      k: 'Teknopark',
      v: 'Yıldız Teknik Üniversitesi, İkitelli Teknopark 1B24, 34490 Başakşehir / İstanbul',
    },
  ] as { k: string; v: string; note?: string }[],
};
