/** visiosoft-3d `onStreet` — saha kaydı bölümü (video senkron adımları). */
export const hubOnStreetCopy = {
  eyebrow: 'Yol üstü parklandırma · Saha kaydı',
  title: 'Cadde ve sokakta',
  titleAccent: 'tahsilat',
  lede:
    'Özel geliştirdiğimiz yazılım sayesinde yol üzerine yerleştirilen kamera ile plaka tespiti yapılıp HGS üzerinden ücret çekilir. PTS kameraların yanında el terminalleriyle personel üzerinden de tahsilat yapılabilir.',
  note: 'Sahadan gerçek kayıt: önce HGS ile tahsilat, ardından park kaydı olmayan bir araca oturum açma.',
  videoSrc: '/video/yol-ustu-demo.mp4',
  videoAriaLabel:
    'Sahada çekilmiş kayıt: personel el terminaliyle sokaktaki araçların plakasını okutur. Ses yok.',
  points: [
    { title: 'Kamera ile plaka tespiti', description: 'Yola yerleştirilen PTS kamerası aracı ve plakayı tanır.' },
    { title: 'HGS üzerinden tahsilat', description: 'Ücret, HGS etiketi üzerinden çekilir.' },
    {
      title: 'El terminali ile saha tahsilatı',
      description: 'Personel plakayı okutur, tutarı gösterir, ödemeyi yerinde alır.',
    },
  ],
  kayittaLabel: 'Kayıtta',
  transactions: [
    { id: 'tahsilat' as const, label: 'Otopark ödemesi', plate: '34 KOU 014', from: 0, to: 29 },
    { id: 'oturum' as const, label: 'Oturum açma', plate: '50 LC 771', from: 30, to: 54.5 },
  ],
  chapters: [
    { at: 0, label: 'Plaka okutuluyor', group: 'tahsilat' as const },
    { at: 14, label: 'Plaka tanındı, tutar hesaplandı', group: 'tahsilat' as const },
    { at: 24, label: 'HGS ile ödeme seçildi', group: 'tahsilat' as const },
    { at: 28, label: 'Ödeme alındı', group: 'tahsilat' as const },
    { at: 30, label: 'Plaka okutuluyor', group: 'oturum' as const },
    { at: 42, label: 'Park kaydı bulunamadı', group: 'oturum' as const },
    { at: 48, label: 'Oturum açıldı', group: 'oturum' as const },
    { at: 50, label: 'Araç park kaydına eklendi', group: 'oturum' as const },
  ],
}

export type OnStreetTxId = (typeof hubOnStreetCopy.transactions)[number]['id']
