import { footerGroups, legalLinks, primaryNav, softwareMenu } from '../../data/siteNav.ts'

export type SitemapLink = { route: string; label: string }
export type SitemapGroup = { id: string; title: string; links: SitemapLink[] }

export const sitemapCopy = {
  seoTitle: 'Site Haritası | Visiosoft',
  seoDescription: 'Visiosoft web sitesindeki ürün, çözüm, kurumsal, destek ve yasal sayfaların tamamı tek listede.',
  eyebrow: 'Site haritası',
  title: 'Sitedeki tüm sayfalar',
  lead: 'Plaka tanıma, donanım, park yazılımı, kurumsal, destek ve yasal sayfalara tek yerden ulaşın.',
  treeLabel: 'Site ağacı',
  homeLabel: 'Ana sayfa',
  pagesSuffix: ' sayfa',
  groupsLabel: 'Sayfa grupları',
} as const

const footerLinks = (title: string) => footerGroups.find((group) => group.title === title)?.links ?? []

const navLabel = (route: string, fallback: string) =>
  primaryNav.find((item) => item.route === route)?.label ?? softwareMenu.find((item) => item.route === route)?.label ?? fallback

const groups: SitemapGroup[] = [
  {
    id: 'plaka-tanima',
    title: 'Plaka tanıma',
    links: [
      { route: 'alpr.index', label: navLabel('alpr.index', 'Plaka Tanıma') },
      { route: 'plate-recognition-system', label: 'Plaka Tanıma Sistemi' },
      { route: 'alpr.landing', label: 'Uçtan Uca Plaka Tanıma Çözümü' },
    ],
  },
  {
    id: 'donanim',
    title: 'Donanım',
    links: [
      ...footerLinks('Donanım').slice(0, 1),
      { route: 'hardware-products.catalog', label: 'Donanım Kataloğu' },
      { route: 'product-gallery', label: 'Ürün Galerisi' },
      ...footerLinks('Donanım').slice(1),
    ],
  },
  {
    id: 'yazilim',
    title: 'Yazılım ve çözümler',
    links: [
      ...footerLinks('Yazılım ve çözümler'),
      { route: 'website-pricing', label: navLabel('website-pricing', 'Site Otopark Yönetimi') },
      { route: 'hgs-park', label: 'HGS Park' },
      { route: 'designer-tool', label: 'Designer Aracı' },
      { route: 'low-confidence', label: 'HGS ile Onay' },
    ],
  },
  { id: 'kurumsal', title: 'Kurumsal', links: footerLinks('Kurumsal') },
  {
    id: 'destek',
    title: 'Teklif ve destek',
    links: [
      ...footerLinks('Destek'),
      { route: 'parking-quote-engine.index', label: 'Otopark Teklif Motoru' },
      { route: 'payment', label: 'Ödeme' },
    ],
  },
  {
    id: 'yasal',
    title: 'Yasal metinler',
    links: [
      ...legalLinks,
      { route: 'legal.terms', label: 'Kullanım Şartları' },
      { route: 'legal.sales', label: 'Satış ve İadeler' },
      { route: 'legal.legal', label: 'Yasal Bilgiler' },
    ],
  },
]

function dedupe(list: SitemapGroup[]) {
  const seen = new Set<string>()
  return list
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => {
        if (seen.has(link.route)) return false
        seen.add(link.route)
        return true
      }),
    }))
    .filter((group) => group.links.length > 0)
}

export const sitemapGroups = dedupe(groups)
