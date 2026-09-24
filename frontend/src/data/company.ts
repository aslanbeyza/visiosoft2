
export const company = {
  legalName: 'Visiosoft Teknoloji A.Ş.',
  foundedYear: 2018,
  email: 'info@visiosoft.com.tr',
  whatsapp: {
    waId: '905015045034',
    display: '+90 (501) 504 5034',
    message: 'Otoparkım için keşif istiyorum',
  },
  locations: [
    {
      key: 'showroom',
      label: 'Showroom',
      address: 'Halil Rıfat Paşa Mahallesi, Darülaceze Caddesi, Perpa Ticaret Merkezi A Blok, Kat 8 No:1036, Şişli / İstanbul',
    },
    {
      key: 'depo',
      label: 'Depo',
      address: 'A Blok Kat 4 No:277, Perpa Ticaret Merkezi, Halil Rıfat Paşa Mahallesi, No:2200, 34384 Şişli / İstanbul',
    },
    {
      key: 'living-lab',
      label: 'Living LAB',
      address: 'Başak Mahallesi, Abdülhamithan Cd No:5, Başakşehir İnovasyon Merkezi, Başakşehir - İstanbul',
    },
    {
      key: 'teknopark',
      label: 'Teknopark',
      address: 'Yıldız Teknik Üniversitesi, İkitelli Teknopark 1B24, 34490 Başakşehir / İstanbul',
    },
  ],
}

export const whatsappUrl = (waId: string = company.whatsapp.waId, message: string = company.whatsapp.message) =>
  `https://wa.me/${waId}?text=${encodeURIComponent(message)}`
