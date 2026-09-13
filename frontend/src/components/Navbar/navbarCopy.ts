/** Navbar, mega menü ve mobil menüdeki Türkçe arayüz metinleri. */
export const navbarCopy = {
  skipLink: 'İçeriğe geç',
  navLabel: 'Ana menü',
  homeLabel: 'Visiosoft ana sayfa',
  openMenu: 'Menüyü aç',
  closeMenu: 'Menüyü kapat',
  submenu: (label: string) => `${label} alt menüsü`,
  contactTitle: 'Bize ulaşın',
  whatsappHint: 'WhatsApp, yeni sekmede açılır',
}

export type MenuIntro = {
  eyebrow: string
  title: string
  text: string
  linkLabel: string
}

export const menuIntros: Record<'hardware' | 'software', MenuIntro> = {
  hardware: {
    eyebrow: 'Donanım',
    title: 'Sahaya uygun otopark donanımları',
    text: 'Kiosk, kontrol kutusu, kabin ve kamera ekipmanları aynı sistem dilinde çalışır.',
    linkLabel: 'Tüm donanımlar',
  },
  software: {
    eyebrow: 'Yazılım',
    title: 'Tek panelden otopark yönetimi',
    text: 'Oturumlar, tahsilat, abonelik ve cihazlar merkezi panelden yönetilir; sahadaki durum anlık izlenir.',
    linkLabel: 'Tüm yazılım ürünleri',
  },
}

/** Donanım menüsünün son hücresindeki keşif yönlendirmesi. */
export const discoveryPromo = {
  eyebrow: 'Keşif',
  title: 'Ücretsiz keşif',
  text: 'Giriş-çıkış, tarife ve donanım ihtiyacı yerinde netleşir.',
}
