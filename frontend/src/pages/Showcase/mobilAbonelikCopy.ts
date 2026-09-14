import type { PhoneScreen } from './PhoneFan.tsx'

export const phoneFanCopy = {
  id: 'uygulama-ekranlari',
  eyebrow: 'Uygulama ekranları',
  title: 'Aboneliğiniz birkaç dokunuşla hazır.',
  label: 'Abonelik akışının uygulama ekranları',
  caption: 'Visiosoft mobil uygulaması ekranları · demo verisi',
}

// Kaynak: mobil_uygulama_ile_park_aboneligi_nasil_yapilir.png (İngilizce yer tutucu metinli dördüncü ekran kullanılmadı)
export const phoneScreens: PhoneScreen[] = [
  {
    id: 'araclarim',
    step: '01',
    label: 'Araçlarım',
    src: '/img/pages/app-araclarim-crop.webp',
    avif: '/img/pages/app-araclarim-crop.avif',
    alt: 'Abonelikler ekranı: park hakkı detayları ve Araçlarım listesi',
  },
  {
    id: 'plaka-ekle',
    step: '02',
    label: 'Plaka ekle',
    src: '/img/pages/app-plaka-ekle-crop.webp',
    avif: '/img/pages/app-plaka-ekle-crop.avif',
    alt: 'Plaka Ekle penceresi: park alanında kullanılacak aracın plakası giriliyor',
  },
  {
    id: 'abonelik-sec',
    step: '03',
    label: 'Abonelik seç',
    src: '/img/pages/app-abonelik-sec-crop.webp',
    avif: '/img/pages/app-abonelik-sec-crop.avif',
    alt: 'Araç Seç ve Abonelik Seç adımları ile Ödemeye Geç düğmesi',
  },
]

export const howToCopy = {
  id: 'nasil-yapilir',
  headingId: 'nasil-yapilir-baslik',
  eyebrow: 'Nasıl yapılır?',
  title: 'Dört adımda park aboneliği.',
  steps: [
    {
      title: 'Abonelikler ekranını açın',
      description: 'Uygulamada Abonelikler ekranına girin; park hakkı detaylarınızı ve Araçlarım sekmesini görün.',
    },
    {
      title: 'Plakanızı ekleyin',
      description: 'Park alanında kullanılacak aracın plakasını girin ve Araç Ekle ile kaydedin.',
    },
    {
      title: 'Araç ve abonelik seçin',
      description: 'Araç Seç ve Abonelik Seç adımlarında aracınızı ve abonelik türünüzü belirleyin.',
    },
    {
      title: 'Ödemeye geçin',
      description: 'Ödemeye Geç ile işlemi tamamlayın; “Aboneliğiniz Yapıldı” onayı ekranda görünür.',
    },
  ],
}

export const mobilFeaturesCopy = {
  id: 'mobil-ozellikler',
  eyebrow: 'Uygulamada',
  title: 'Abonelik ve ödeme cebinizde.',
  items: [
    {
      key: 'abonelik',
      title: 'Abonelik ve borç ödeme',
      description: 'Park aboneliğinizi başlatın, borçlarınızı uygulama üzerinden ödeyin.',
    },
    {
      key: 'arac',
      title: 'Araçlarınız tek listede',
      description: 'Park alanında kullanacağınız araçları plakalarıyla ekleyin, Araçlarım sekmesinden yönetin.',
    },
    {
      key: 'yardim',
      title: 'Uygulama içi rehber',
      description: 'Abonelikler ekranındaki “Nasıl çalışır?” bağlantısı adımları size hatırlatır.',
    },
  ],
}
