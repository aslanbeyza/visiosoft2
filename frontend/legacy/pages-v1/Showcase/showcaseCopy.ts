type ShowcaseCopy = {
  title: string
  paragraphs: string[]
  images: { src: string; alt: string }[]
  cta: string
  ctaRoute: string
  seoTitle: string
  seoDescription: string
}

const byLocale = (tr: ShowcaseCopy, _en?: ShowcaseCopy, _ru?: ShowcaseCopy) => ({ tr })

export const showcaseCopy: Record<string, { tr: ShowcaseCopy }> = {
  team: byLocale(
    {
      title: 'Takımımız',
      paragraphs: ['Geleceğin otopark teknolojilerini inşa eden tutkulu ekibimizle tanışın.'],
      images: [{ src: '/img/pages/visiosoft_visio_takimimiz.webp', alt: 'Visiosoft Takımı' }],
      cta: 'Bize Katılın',
      ctaRoute: 'contact',
      seoTitle: 'Takımımız - Visiosoft',
      seoDescription: 'Visiosoft ekibi ile tanışın. Otopark yönetiminde uzman kadromuz.',
    },
    {
      title: 'Our Team',
      paragraphs: ['Meet the team building the next generation of parking technology.'],
      images: [{ src: '/img/pages/visiosoft_visio_takimimiz.webp', alt: 'Visiosoft Team' }],
      cta: 'Join Us',
      ctaRoute: 'contact',
      seoTitle: 'Our Team - Visiosoft',
      seoDescription: 'Meet the Visiosoft team.',
    },
    {
      title: 'Наша команда',
      paragraphs: ['Познакомьтесь с командой, которая создает технологии парковки будущего.'],
      images: [{ src: '/img/pages/visiosoft_visio_takimimiz.webp', alt: 'Команда Visiosoft' }],
      cta: 'Присоединиться',
      ctaRoute: 'contact',
      seoTitle: 'Наша команда - Visiosoft',
      seoDescription: 'Познакомьтесь с командой Visiosoft.',
    },
  ),
  'kus-bakisi': byLocale(
    {
      title: 'Kuş Bakışı Yönetim',
      paragraphs: [
        'Tüm operasyonunuzu tek bir ekrandan izleyin. Anlık veriler, canlı kameralar ve detaylı raporlar parmaklarınızın ucunda.',
      ],
      images: [
        { src: '/img/pages/kus_bakisi_otopark_yonetimi.webp', alt: 'Kuş Bakışı Otopark Yönetimi' },
        { src: '/img/pages/gercek_otopark_isvev_kus_bakisi.webp', alt: 'Gerçek Otopark İşlev Kuş Bakışı' },
      ],
      cta: 'Hemen Teklif Alın',
      ctaRoute: 'quote.index',
      seoTitle: 'Kuş Bakışı Otopark Yönetimi - Visiosoft',
      seoDescription: 'Tüm otopark operasyonlarınızı tek bir ekrandan, kuş bakışı yönetin. Anlık doluluk, gelir ve arıza takibi.',
    },
    {
      title: 'Bird’s-eye Management',
      paragraphs: ['Monitor the entire operation from one screen: live data, cameras, and reports.'],
      images: [
        { src: '/img/pages/kus_bakisi_otopark_yonetimi.webp', alt: 'Bird’s-eye parking management' },
        { src: '/img/pages/gercek_otopark_isvev_kus_bakisi.webp', alt: 'Live parking bird’s-eye view' },
      ],
      cta: 'Get a Quote',
      ctaRoute: 'quote.index',
      seoTitle: 'Bird’s-eye Parking Management - Visiosoft',
      seoDescription: 'Manage all parking operations from a single screen.',
    },
    {
      title: 'Управление с высоты',
      paragraphs: ['Следите за всей операцией с одного экрана: данные, камеры и отчеты.'],
      images: [
        { src: '/img/pages/kus_bakisi_otopark_yonetimi.webp', alt: 'Управление парковкой с высоты' },
        { src: '/img/pages/gercek_otopark_isvev_kus_bakisi.webp', alt: 'Реальный вид парковки сверху' },
      ],
      cta: 'Получить предложение',
      ctaRoute: 'quote.index',
      seoTitle: 'Управление парковкой с высоты - Visiosoft',
      seoDescription: 'Управляйте всей парковкой с одного экрана.',
    },
  ),
  'mobil-abonelik': byLocale(
    {
      title: 'Mobil Uygulama ile Park Aboneliği',
      paragraphs: ['Mobil uygulamamız üzerinden saniyeler içinde abonelik işlemlerinizi tamamlayın.'],
      images: [
        {
          src: '/img/pages/mobil_uygulama_ile_park_aboneligi_nasil_yapilir.webp',
          alt: 'Mobil Uygulama ile Park Aboneliği Nasıl Yapılır',
        },
      ],
      cta: 'Hemen Teklif Alın',
      ctaRoute: 'quote.index',
      seoTitle: 'Mobil Uygulama ile Park Aboneliği Nasıl Yapılır? - Visiosoft',
      seoDescription: 'Visiosoft mobil uygulaması üzerinden kolayca park aboneliği oluşturma rehberi.',
    },
    {
      title: 'Parking Subscription via Mobile App',
      paragraphs: ['Complete subscription steps in seconds through our mobile app.'],
      images: [
        {
          src: '/img/pages/mobil_uygulama_ile_park_aboneligi_nasil_yapilir.webp',
          alt: 'How to subscribe via the mobile app',
        },
      ],
      cta: 'Get a Quote',
      ctaRoute: 'quote.index',
      seoTitle: 'Mobile Parking Subscription - Visiosoft',
      seoDescription: 'Create a parking subscription through the Visiosoft mobile app.',
    },
    {
      title: 'Подписка на парковку в приложении',
      paragraphs: ['Оформите подписку за секунды в нашем мобильном приложении.'],
      images: [
        {
          src: '/img/pages/mobil_uygulama_ile_park_aboneligi_nasil_yapilir.webp',
          alt: 'Как оформить подписку в приложении',
        },
      ],
      cta: 'Получить предложение',
      ctaRoute: 'quote.index',
      seoTitle: 'Мобильная подписка на парковку - Visiosoft',
      seoDescription: 'Оформите подписку через мобильное приложение Visiosoft.',
    },
  ),
  'designer-tool': byLocale(
    {
      title: 'Designer Kuş Bakışı Çizim Aracı',
      paragraphs: [
        'Bu araç, kuş bakışı otopark yönetimi kurulumunu sağlamak ve otoparkınızı dijital ortamda en verimli şekilde tasarlamak için geliştirilmiştir.',
        'Bu araç kuş bakışı araç takibi için gerekli saha kurulum ve yönetim yazılımıdır. Bu yazılım sayesinde araç slotları çizilir ve panelden kolayca yönetilir. Kamera açıları değiştiğinde kalibrasyon yapmak çok kolaydır.',
      ],
      images: [{ src: '/img/visiosoftPark.webp', alt: 'Visiosoft Park' }],
      cta: 'Bilgi Alın',
      ctaRoute: 'quote.index',
      seoTitle: 'Designer Kuş Bakışı Çizim Aracı - Visiosoft',
      seoDescription: 'Kuş bakışı otopark yönetimi kurulumu için geliştirilmiş çizim aracı.',
    },
    {
      title: 'Designer Bird’s-eye Drawing Tool',
      paragraphs: [
        'This tool is built to set up bird’s-eye parking management and design your lot digitally.',
        'Slots are drawn and managed from the panel. Recalibration stays simple when camera angles change.',
      ],
      images: [{ src: '/img/visiosoftPark.webp', alt: 'Visiosoft Park' }],
      cta: 'Request Info',
      ctaRoute: 'quote.index',
      seoTitle: 'Designer Bird’s-eye Drawing Tool - Visiosoft',
      seoDescription: 'Drawing tool for bird’s-eye parking management setup.',
    },
    {
      title: 'Инструмент проектирования сверху',
      paragraphs: [
        'Инструмент помогает настроить управление парковкой сверху и спроектировать площадку в цифровом виде.',
        'Слоты рисуются и управляются из панели. Калибровка остается простой при смене угла камеры.',
      ],
      images: [{ src: '/img/visiosoftPark.webp', alt: 'Visiosoft Park' }],
      cta: 'Запросить информацию',
      ctaRoute: 'quote.index',
      seoTitle: 'Инструмент проектирования сверху - Visiosoft',
      seoDescription: 'Инструмент чертежа для управления парковкой сверху.',
    },
  ),
  'low-confidence': byLocale(
    {
      title: 'Şansa Bırakmayız',
      paragraphs: [
        'Yapay zeka PTS okuma herhangi nedenden dolayı düşük güven oyu (confidence) aldıysa gerçek insan tarafından onay mekanızmasına düşer.',
        "Geçişleri merkezden yönetiyor, işimizi şansa bırakmıyoruz: yapay zeka destekli PTS okumalarını sürekli kontrol ediyoruz. Sistem emin olamadığında kalan yaklaşık %1'lik düşük confidence geçişler, operatör onay sürecine düşer ve gerçek insan tarafından doğrulanır. Bu çift katmanlı yapı, hem otomasyon hızını korur hem de tahsilat ve güvenlik doğruluğunu en üst seviyede tutar.",
      ],
      images: [{ src: '/img/Visiosoft otopark yazılım.svg', alt: 'Visiosoft' }],
      cta: 'Sistemi İnceleyin',
      ctaRoute: 'quote.index',
      seoTitle: 'Şansa Bırakmayız - Visiosoft',
      seoDescription: 'Yapay zeka PTS okuma düşük güven oyu aldığında devreye giren insan onay mekanizması.',
    },
    {
      title: 'We Leave Nothing to Chance',
      paragraphs: [
        'When AI plate recognition gets a low confidence score, the case goes to a human approval queue.',
        'We supervise passages from the center. The remaining ~1% low-confidence reads are verified by an operator so automation stays fast and collection stays accurate.',
      ],
      images: [{ src: '/img/Visiosoft otopark yazılım.svg', alt: 'Visiosoft' }],
      cta: 'Explore the System',
      ctaRoute: 'quote.index',
      seoTitle: 'We Leave Nothing to Chance - Visiosoft',
      seoDescription: 'Human approval when AI plate recognition confidence is low.',
    },
    {
      title: 'Ничего не оставляем на волю случая',
      paragraphs: [
        'Если ИИ дает низкую уверенность при распознавании номера, случай переходит к оператору.',
        'Около 1% низкоуверенных проездов проверяет человек. Автоматизация остается быстрой, а точность сборов высокой.',
      ],
      images: [{ src: '/img/Visiosoft otopark yazılım.svg', alt: 'Visiosoft' }],
      cta: 'Изучить систему',
      ctaRoute: 'quote.index',
      seoTitle: 'Ничего не оставляем на волю случая - Visiosoft',
      seoDescription: 'Ручное подтверждение при низкой уверенности распознавания номера.',
    },
  ),
}

export function showcaseFor(routeName: string, _locale?: string) {
  return showcaseCopy[routeName]?.tr
}
