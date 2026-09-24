
export const navbarCopy = {
  skipLink: 'İçeriğe geç',
  navLabel: 'Ana menü',
  homeLabel: 'Visiosoft ana sayfa',
  openMenu: 'Menüyü aç',
  closeMenu: 'Menüyü kapat',
  submenu: (label: string) => `${label} alt menüsü`,
  contactTitle: 'Bize ulaşın',
  whatsappHint: 'WhatsApp, yeni sekmede açılır',
  accessoryLabel: 'Aksesuar',
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
    text: 'Kiosk, kontrol ünitesi, kabin ve kamera ekipmanları aynı sistemle çalışır.',
    linkLabel: 'Tüm donanımları görüntüle',
  },
  software: {
    eyebrow: 'Park Yazılım',
    title: 'Tek panelden otopark yönetimi',
    text: 'Oturum, tahsilat, abonelik ve cihazlar merkezi panelden yönetilir.',
    linkLabel: 'Tüm yazılım ürünleri',
  },
}

export type MenuCta = {
  title: string
  text: string
  linkLabel: string
  route: string
}

export const menuCtas: Record<'hardware' | 'software', MenuCta> = {
  hardware: {
    title: 'Hangi donanım size uygun?',
    text: 'Giriş-çıkış yapınıza göre sistemi birlikte planlayalım.',
    linkLabel: 'Sistemini Oluştur',
    route: 'parking-quote-engine.index',
  },
  software: {
    title: 'Hangi çözüm size uygun?',
    text: 'Klasik otopark yönetimiyle farkları tek tabloda görün.',
    linkLabel: 'Karşılaştırmayı İncele',
    route: 'comparison',
  },
}
