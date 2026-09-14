export type HgsParkCopy = {
  metaTitle: string
  metaDescription: string
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  futureEyebrow: string
  futureTitle: string
  futureDescription: string
  futureFeatures: { icon: 'rocket' | 'card'; title: string; description: string }[]
  solutionsEyebrow: string
  solutionsTitle: string
  solutionsDescription: string
  activityTitle: string
  activityItems: { title: string; description: string }[]
  businessTitle: string
  businessItems: string[]
  advantagesTitle: string
  advantagesDescription: string
  advantages: { title: string; description: string }[]
  finalTitle: string
  finalDescription: string
  finalPrimaryCta: string
  finalSecondaryCta: string
}

const _en: HgsParkCopy = {
  metaTitle: 'HGS Park | Unmanned Parking Payment Solution | Visiosoft',
  metaDescription:
    'HGS Park turns existing plate recognition infrastructure into a fast, secure, and low-cost parking payment experience for malls, municipalities, hospitals, and more.',
  heroEyebrow: 'Next-Generation Payment Technology',
  heroTitle: 'HGSPark',
  heroSubtitle: 'Turn time into comfort.',
  heroDescription: 'Meet the new way of secure, comfortable, and fast parking payments.',
  heroPrimaryCta: 'Learn More',
  heroSecondaryCta: 'Contact Us',
  futureEyebrow: 'Future Technology',
  futureTitle: 'Set new standards in parking payments.',
  futureDescription:
    'HGS Park transforms your existing plate recognition system into a modern payment center without requiring expensive infrastructure investments.',
  futureFeatures: [
    {
      icon: 'rocket',
      title: 'Fast Integration',
      description: 'It integrates easily with your current system and does not require extra hardware cost.',
    },
    {
      icon: 'card',
      title: 'Automatic Collection',
      description: 'It collects secure payments through HGS tags within seconds.',
    },
  ],
  solutionsEyebrow: 'Our Solutions',
  solutionsTitle: 'Scope of Service',
  solutionsDescription: 'We offer flexible solutions tailored to every operating model with sector-specific expertise.',
  activityTitle: 'Areas of Operation',
  activityItems: [
    { title: 'Shopping Malls', description: 'Fast and contactless payment experience in mall parking areas.' },
    { title: 'Public & Municipal', description: 'Transparent and reliable collection system for official parking operations.' },
    { title: 'Industrial Sites', description: 'Entry, exit, and payment control for organized industrial areas.' },
    { title: 'Hospitals', description: 'Continuous and practical parking management in healthcare facilities.' },
  ],
  businessTitle: 'Business Models',
  businessItems: [
    'Indoor Parking Management',
    'On-Street Parking Systems',
    'Area and Zone Pricing',
    'Entry/Exit Based Integration',
  ],
  advantagesTitle: 'Advantages of HGS Park',
  advantagesDescription: 'Solutions that create value for both your business and your users.',
  advantages: [
    { title: 'No Cash Flow', description: 'Removing cash handling lowers daily operational load.' },
    { title: 'Loss Prevention', description: 'Loss and leakage scenarios are minimized.' },
    { title: 'Fast Integration', description: 'Easy integration with existing systems and lower maintenance cost.' },
    { title: 'Mobile Application', description: 'Use mobile applications for campaigns and customer communication.' },
  ],
  finalTitle: 'Reduce costs, increase revenue, and improve satisfaction with HGS Park.',
  finalDescription: 'A simpler parking payment experience for operators and drivers.',
  finalPrimaryCta: 'Get Quote',
  finalSecondaryCta: 'Contact',
}

const _ru: HgsParkCopy = {
  metaTitle: 'HGS Park | Решение для оплаты парковки без персонала | Visiosoft',
  metaDescription:
    'HGS Park превращает существующую инфраструктуру распознавания номеров в быстрый, безопасный и экономичный платежный центр для парковок.',
  heroEyebrow: 'Платежная технология нового поколения',
  heroTitle: 'HGSPark',
  heroSubtitle: 'Превращает время в комфорт.',
  heroDescription: 'Познакомьтесь с новым форматом безопасной, удобной и быстрой оплаты парковки.',
  heroPrimaryCta: 'Подробнее',
  heroSecondaryCta: 'Связаться',
  futureEyebrow: 'Технология будущего',
  futureTitle: 'Измените стандарты в парковочных оплатах.',
  futureDescription:
    'HGS Park превращает вашу существующую систему распознавания номеров в современный платежный центр без дорогих инфраструктурных инвестиций.',
  futureFeatures: [
    {
      icon: 'rocket',
      title: 'Быстрая интеграция',
      description: 'Легко интегрируется в текущую систему и не требует дополнительных затрат на оборудование.',
    },
    {
      icon: 'card',
      title: 'Автоматический сбор',
      description: 'Обеспечивает безопасный прием оплаты через HGS за считанные секунды.',
    },
  ],
  solutionsEyebrow: 'Наши решения',
  solutionsTitle: 'Объем услуг',
  solutionsDescription: 'Мы предлагаем гибкие решения для каждой модели эксплуатации с отраслевой экспертизой.',
  activityTitle: 'Сферы деятельности',
  activityItems: [
    { title: 'Торговые центры', description: 'Быстрый и бесконтактный платежный опыт для парковок ТЦ.' },
    { title: 'Госсектор и муниципалитеты', description: 'Прозрачная и надежная система сбора на официальных парковках.' },
    { title: 'Промышленные площадки', description: 'Контроль въезда, выезда и оплаты в организованных промышленных зонах.' },
    { title: 'Больницы', description: 'Непрерывное и практичное управление парковкой в медицинских учреждениях.' },
  ],
  businessTitle: 'Типы эксплуатации',
  businessItems: [
    'Управление закрытыми парковками',
    'Системы уличной парковки',
    'Тарификация по зонам и участкам',
    'Интеграция по въезду и выезду',
  ],
  advantagesTitle: 'Преимущества HGS Park',
  advantagesDescription: 'Решения, которые создают ценность для бизнеса и пользователей.',
  advantages: [
    { title: 'Без наличного потока', description: 'Отказ от наличных снижает операционную нагрузку.' },
    { title: 'Предотвращение потерь', description: 'Сценарии потерь и утечек сводятся к минимуму.' },
    { title: 'Быстрая интеграция', description: 'Легкая интеграция с текущими системами и низкая стоимость обслуживания.' },
    { title: 'Мобильное приложение', description: 'Возможность запускать кампании и информирование через мобильное приложение.' },
  ],
  finalTitle: 'Снижайте расходы, увеличивайте выручку и повышайте удовлетворенность с HGS Park.',
  finalDescription: 'Более простой платежный опыт для операторов и водителей.',
  finalPrimaryCta: 'Получить предложение',
  finalSecondaryCta: 'Связаться',
}

const tr: HgsParkCopy = {
  metaTitle: 'HGS Park | İnsansız Otopark Ödeme Çözümü | Visiosoft',
  metaDescription:
    'HGS Park, mevcut plaka tanıma altyapınızı hızlı, güvenli ve düşük maliyetli bir otopark ödeme merkezine dönüştürür. AVM, belediye, sanayi sitesi ve hastaneler için uygundur.',
  heroEyebrow: 'Yeni Nesil Ödeme Teknolojisi',
  heroTitle: 'HGSPark',
  heroSubtitle: 'Zamanı konfora dönüştürür.',
  heroDescription: 'Güvenli, konforlu ve hızlı ödemenin yeni yolu ile tanışın.',
  heroPrimaryCta: 'Daha Fazla Bilgi',
  heroSecondaryCta: 'İletişime Geç',
  futureEyebrow: 'Geleceğin Teknolojisi',
  futureTitle: 'Otopark ödemelerinde standartları değiştirin.',
  futureDescription:
    'HGS Park, pahalı altyapı yatırımlarına gerek kalmadan, mevcut plaka tanıma sisteminizi modern bir ödeme merkezine dönüştürür.',
  futureFeatures: [
    {
      icon: 'rocket',
      title: 'Hızlı Entegrasyon',
      description: 'Mevcut sisteminize kolayca entegre olur, ek donanım maliyeti gerektirmez.',
    },
    {
      icon: 'card',
      title: 'Otomatik Tahsilat',
      description: 'HGS etiketi üzerinden saniyeler içinde, %100 güvenli ödeme alır.',
    },
  ],
  solutionsEyebrow: 'Çözümlerimiz',
  solutionsTitle: 'Hizmet Kapsamımız',
  solutionsDescription: 'Sektör bazlı uzmanlığımızla her işletme modeline uygun esnek çözümler sunuyoruz.',
  activityTitle: 'Faaliyet Alanları',
  activityItems: [
    { title: 'AVM', description: 'Alışveriş merkezlerinde hızlı ve temassız ödeme deneyimi.' },
    { title: 'Kamu & Belediye', description: 'Resmi otoparklarda şeffaf ve güvenilir tahsilat sistemi.' },
    { title: 'Sanayi Sitesi', description: 'Organize bölgelerde giriş-çıkış ve ödeme kontrolü.' },
    { title: 'Hastane', description: 'Sağlık kurumlarında kesintisiz ve pratik otopark yönetimi.' },
  ],
  businessTitle: 'İşletme Türleri',
  businessItems: [
    'Kapalı Otopark Yönetimi',
    'Yol Üstü Otopark Sistemleri',
    'Alan ve Bölge Ücretlendirme',
    'Giriş/Çıkış Bazlı Entegrasyon',
  ],
  advantagesTitle: "HGS Park'ın Avantajları",
  advantagesDescription: 'İşletmeniz ve kullanıcılarınız için değer yaratan çözümler.',
  advantages: [
    { title: 'Nakit Akışı Yok', description: 'Nakit akışı ortadan kaldırılarak operasyonel yük azaltılır.' },
    { title: 'Kayıp Kaçak Önleme', description: 'Kayıp ve kaçak durumları minimum seviyeye indirilir.' },
    { title: 'Hızlı Entegrasyon', description: 'Mevcut sistemlerle kolay entegrasyon ve düşük bakım maliyeti.' },
    { title: 'Mobil Uygulama', description: 'Mobil uygulama aracılığıyla kampanya ve bilgilendirme imkanı.' },
  ],
  finalTitle: 'HGS Park ile maliyeti düşürün, geliri artırın, memnuniyeti yükseltin.',
  finalDescription: 'İşletmeniz için daha düzenli tahsilat, kullanıcılarınız için daha konforlu bir çıkış deneyimi.',
  finalPrimaryCta: 'Teklif Al',
  finalSecondaryCta: 'İletişim',
}

export function hgsParkCopy(): HgsParkCopy {
  return tr
}

void _en
void _ru
