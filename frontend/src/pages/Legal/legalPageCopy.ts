/** Yasal sayfaların çerçeve metinleri. Madde metinlerinin kendisi legalCopy.ts içindedir. */
export const legalPageCopy = {
  // "Yasal Bilgiler" sayfasında başlığı tekrar etmemesi için genel ad kullanılır.
  eyebrow: 'Yasal metinler',
  indexLabel: 'Yasal metinler',
  indexCaption: 'Tüm yasal metinler',
  headingCount: (count: number) => `${count} başlık`,
  factsLabel: 'Şirket bilgileri',
  contactTitle: 'Sorularınız mı var?',
  contactBody: 'Yasal metinlerle ilgili taleplerinizi e-posta ile iletebilirsiniz.',
  contactAction: 'E-posta gönderin',
  /** Belge dizininde görünen sıra; rota adları legalCopy anahtarlarıyla aynıdır. */
  documents: [
    { route: 'legal.privacy', label: 'Gizlilik Politikası' },
    { route: 'legal.terms', label: 'Kullanım Şartları' },
    { route: 'legal.sales', label: 'Satış ve İadeler' },
    { route: 'legal.distance-sales', label: 'Mesafeli Satış Sözleşmesi' },
    { route: 'legal.return-policy', label: 'İade Politikası' },
    { route: 'legal.legal', label: 'Yasal Bilgiler' },
  ],
  /** Hero açıklamaları; mevcut madde metinlerinden özetlenmiştir. */
  leads: {
    'legal.privacy':
      'Web sitemizi ve hizmetlerimizi kullandığınızda verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.',
    'legal.terms': 'Bu web sitesine erişim ve sitenin kullanımı için geçerli olan şartları açıklar.',
    'legal.sales': 'Visiosoft ürün ve hizmetlerinin satış, iade, iptal ve garanti koşullarını özetler.',
    'legal.distance-sales':
      'İnternet sitesi üzerinden verilen siparişlerde satıcı ve alıcının hak ve yükümlülüklerini belirler.',
    'legal.return-policy': 'Yazılım, dijital hizmet ve donanım siparişlerinde iade taleplerinin nasıl değerlendirildiğini açıklar.',
    'legal.legal': 'Visiosoft Teknoloji A.Ş. şirket bilgileri ve telif hakları.',
  } as Record<string, string>,
} as const
