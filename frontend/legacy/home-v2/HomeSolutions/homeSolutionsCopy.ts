export type SolutionIconId = 'parking' | 'residence' | 'street' | 'truck'

export const homeSolutionsCopy = {
  eyebrow: 'Kullanım alanları',
  title: 'Aynı altyapı, farklı işletme.',
  inspect: 'İncele',
  items: [
    {
      title: 'Ücretli otopark ve AVM',
      description: 'Girişte plaka, çıkışta kiosk veya HGS. Kaçak kapanır, kuyruk kısalır.',
      route: 'hardware-products.kiosk',
      icon: 'parking',
    },
    {
      title: 'Site ve rezidans',
      description: 'Sakin, misafir ve personel plakadan ayrılır. Yönetim her yerden bakar.',
      route: 'website-pricing',
      icon: 'residence',
    },
    {
      title: 'Belediye ve sokak',
      description: 'İhlal, doluluk ve serbest geçiş kameralarla izlenir.',
      route: 'on-street',
      icon: 'street',
    },
    {
      title: 'TIR ve lojistik',
      description: 'Yüksek kiosk, çekici-dorse ayrımı, ağır vasıta çıkışı.',
      route: 'hardware-products.tir-kiosk',
      icon: 'truck',
    },
  ] satisfies { title: string; description: string; route: string; icon: SolutionIconId }[],
}
