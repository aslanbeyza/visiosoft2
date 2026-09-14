export type BankField = {
  label: string
  /** Panoya kopyalanan değer (boşluksuz). */
  value: string
  /** Ekranda gösterilen biçim. */
  display?: string
  mono?: boolean
}

export type BankAccount = {
  code: string
  name: string
  holder: string
  ibans: BankField[]
  /** Kopyalanabilir ek bilgiler (hesap no, SWIFT). */
  codes: BankField[]
  /** Yalnızca okunur ek bilgiler (şube). */
  details: { label: string; value: string }[]
}

export const bankAccountsCopy = {
  seoTitle: 'Banka Hesapları | Visiosoft',
  seoDescription:
    'Visiosoft Teknoloji A.Ş. banka hesap bilgileri: Türkiye Ekonomi Bankası ve Kuveyt Türk IBAN numaraları, hesap numarası ve SWIFT kodu.',

  breadcrumbs: { home: 'Ana sayfa', contact: 'İletişim', current: 'Banka Hesapları' },
  eyebrow: 'Ödeme bilgileri',
  title: 'Banka Hesaplarımız',
  lead: 'Ödemeleriniz için aşağıdaki banka hesaplarımızı kullanabilirsiniz.',

  listLabel: 'Banka hesapları',
  holderLabel: 'Hesap sahibi',
  ibanGroupLabel: 'IBAN numaraları',
  copyLabel: 'Kopyala',
  copiedLabel: 'Kopyalandı',
  hint: 'IBAN numaralarını yanlarındaki “Kopyala” düğmesiyle kopyalayabilirsiniz; numaranın üzerine tıkladığınızda da tamamı seçilir.',

  help: {
    title: 'Ödeme ile ilgili bir sorunuz mu var?',
    text: 'Ödeme ve fatura sorularınız için satış ve destek ekibimize ulaşabilirsiniz.',
    email: 'E-posta gönderin',
    whatsapp: 'WhatsApp ile yazın',
    contact: 'Şirket bilgileri',
  },

  banks: [
    {
      code: 'TEB',
      name: 'Türkiye Ekonomi Bankası',
      holder: 'VİSİOSOFT TEKNOLOJİ AŞ',
      ibans: [
        { label: 'TL IBAN', display: 'TR75 0003 2000 0000 0063 1568 23', value: 'TR750003200000000063156823', mono: true },
        { label: 'USD IBAN', display: 'TR64 0003 2000 0000 0063 1568 27', value: 'TR640003200000000063156827', mono: true },
      ],
      codes: [{ label: 'Hesap No', value: '63156823', mono: true }],
      details: [{ label: 'Şube', value: '32 - MERTER' }],
    },
    {
      code: 'KT',
      name: 'Kuveyt Türk',
      holder: 'VİSİOSOFT TEKNOLOJİ AŞ',
      ibans: [
        { label: 'TL IBAN', display: 'TR02 0020 5000 0961 1910 1000 01', value: 'TR020020500009611910100001', mono: true },
        { label: 'EURO IBAN', display: 'TR88 0020 5000 0961 1910 1001 02', value: 'TR880020500009611910100102', mono: true },
        { label: 'USD IBAN', display: 'TR18 0020 5000 0961 1910 1001 01', value: 'TR180020500009611910100101', mono: true },
      ],
      codes: [{ label: 'SWIFT Code', value: 'KTEFTRISXXX', mono: true }],
      details: [],
    },
  ] satisfies BankAccount[],
}
