export const hardwareSlugs = [
  'kiosk',
  'tir-kiosk',
  'visiobox',
  'rack-kabin',
  'kamera-muhafaza',
  'kamera-montaj-kulesi',
  'ledli-reklam-paneli',
  'togerbox',
] as const

export type HardwareSlug = (typeof hardwareSlugs)[number]

export type ProductCopy = {
  page_title: string
  meta_desc: string
  eyebrow: string
  name: string
  lead: string
  meta: { label: string; value: string }[]
  request_discovery: string
  show_technical_image: string
  open_catalog: string
  viewer_kicker: string
  viewer_title: string
  viewer_fullscreen: string
  viewer_hint: string
  highlights_title: string
  highlights_desc: string
  dimensions?: string
  features: { title: string; desc: string }[]
  tech_summary_title: string
  summary: string[]
  use_cases_title: string
  use_cases: string[]
  cta_title: string
  cta_desc: string
  get_quote: string
  close: string
}

export type HardwareProductDef = {
  slug: HardwareSlug
  route: string
  model: string
  technicalImage?: string
  navLabel: string
  copy: ProductCopy
}

const loc = <T>(tr: T, _en?: T, _ru?: T): T => tr

const ui = loc(
  {
    request_discovery: 'Ücretsiz Keşif İste',
    show_technical_image: 'Teknik Resim Göster',
    open_catalog: 'Donanım Kataloğunu Aç',
    viewer_kicker: 'Yakından inceleme',
    viewer_title: 'Modeli döndürün, detaylara yakınlaşın.',
    viewer_fullscreen: 'Tam ekran',
    viewer_hint: 'Sürükleyin, yakınlaştırmak için kaydırın.',
    highlights_title: 'Öne çıkanlar',
    tech_summary_title: 'Teknik özet',
    use_cases_title: 'Kullanım alanları',
    cta_title: 'Projeye özel teklif',
    get_quote: 'Teklif Al',
    close: 'Kapat',
  },
  {
    request_discovery: 'Request Free Discovery',
    show_technical_image: 'Show Technical Image',
    open_catalog: 'Open Hardware Catalog',
    viewer_kicker: 'Close-up view',
    viewer_title: 'Rotate the model and zoom in on details.',
    viewer_fullscreen: 'Full screen',
    viewer_hint: 'Drag to rotate, scroll to zoom.',
    highlights_title: 'Highlights',
    tech_summary_title: 'Technical summary',
    use_cases_title: 'Use cases',
    cta_title: 'Project-specific quote',
    get_quote: 'Get Quote',
    close: 'Close',
  },
  {
    request_discovery: 'Запросить бесплатное обследование',
    show_technical_image: 'Показать техническое изображение',
    open_catalog: 'Открыть каталог оборудования',
    viewer_kicker: 'Детальный просмотр',
    viewer_title: 'Поверните модель и увеличьте детали.',
    viewer_fullscreen: 'Полный экран',
    viewer_hint: 'Перетащите для поворота, прокрутите для масштабирования.',
    highlights_title: 'Особенности',
    tech_summary_title: 'Техническая сводка',
    use_cases_title: 'Области применения',
    cta_title: 'Предложение для конкретного проекта',
    get_quote: 'Запросить КП',
    close: 'Закрыть',
  },
)

const withUi = (_locale: string, rest: Omit<ProductCopy, keyof typeof ui>): ProductCopy => ({
  ...ui,
  ...rest,
})

const kiosk = loc(
  withUi('tr', {
    page_title: 'İnsansız Çıkış Ödeme Kiosk | Visiosoft',
    meta_desc:
      'İnsansız Çıkış Ödeme Kiosk ürün sayfası: plaka girişi olmadan temassız ödeme, HGS + POS + QR ve uzaktan 7/24 takip.',
    eyebrow: 'Otopark Kiosk Sistemleri',
    name: 'İnsansız Çıkış Ödeme Kiosk',
    lead:
      'Müşterilerinizin plaka girişi yapmasına gerek kalmadan, çıkış noktasında temassız ödeme almanızı sağlayan kiosk çözümü.',
    meta: [
      { label: 'Kategori', value: 'Kiosk sistemleri' },
      { label: 'Entegrasyon', value: 'HGS / POS / QR / Yazıcı / Ağ' },
      { label: 'Kullanım', value: 'Temassız çıkış tahsilatı' },
      { label: 'İzleme', value: 'Uzaktan 7/24 takip' },
    ],
    highlights_desc: 'Çıkış noktasında plaka girişi gerektirmeyen, çok kanallı insansız tahsilat altyapısı.',
    dimensions: '300mm × 1800mm × 297,50mm',
    features: [
      { title: 'Plaka girişi olmadan ödeme', desc: 'Müşteri, plaka yazmadan çıkışta temassız ödeme işlemini hızlıca tamamlar.' },
      { title: 'HGS + POS + QR tahsilat', desc: 'HGS, POS ve QR kanalları birlikte çalışır; senaryoya uygun tahsilat otomatik yönlendirilir.' },
      { title: 'Serbest geçiş (Freeflow)', desc: 'HGS entegrasyonu sayesinde bariyer kurgusuna uygun serbest geçiş operasyonlarını destekler.' },
      { title: '7/24 uzaktan takip + sesli yönlendirme', desc: 'Cihaz süreçleri uzaktan izlenebilir, kullanıcı akışı sesli yönlendirme ile desteklenir.' },
    ],
    summary: [
      'İnsansız çıkış tahsilatı için optimize edilmiş ödeme deneyimi sunar.',
      'HGS + POS + QR kombinasyonu ile ödeme başarımını üst seviyeye taşır.',
      'Yönetim paneli üzerinden ödeme, geçiş ve alarm süreçleri uzaktan 7/24 izlenebilir.',
      'Sesli yönlendirme desteği ile sürücü etkileşimini kolaylaştırır.',
    ],
    use_cases: [
      'Otopark giriş ve çıkış ödeme noktaları.',
      'Personelsiz otopark işletmeleri.',
      'Serbest geçiş (freeflow) altyapısı kullanan sahalar.',
      'Abonelik, geçiş ve otomatik tahsilat senaryoları.',
    ],
    cta_desc: 'İhtiyaca uygun konfigürasyon ve kurulum için ekibimizle iletişime geçin.',
  }),
  withUi('en', {
    page_title: 'Unmanned Exit Payment Kiosk | Visiosoft',
    meta_desc:
      'Unmanned Exit Payment Kiosk product page with no plate entry requirement, HGS + POS + QR, and 24/7 remote monitoring.',
    eyebrow: 'Parking Kiosk Systems',
    name: 'Unmanned Exit Payment Kiosk',
    lead: 'A kiosk solution that enables contactless exit payment without requiring drivers to manually enter a plate number.',
    meta: [
      { label: 'Category', value: 'Kiosk systems' },
      { label: 'Integration', value: 'HGS / POS / QR / Printer / Network' },
      { label: 'Usage', value: 'Contactless exit collection without plate entry' },
      { label: 'Monitoring', value: 'Remote 24/7 tracking' },
    ],
    highlights_desc: 'A multi-channel unmanned payment stack for contactless exits without plate entry.',
    dimensions: '300mm × 1800mm × 297,50mm',
    features: [
      { title: 'No plate entry required', desc: 'Drivers can complete contactless payment at exit without typing plate information.' },
      { title: 'HGS + POS + QR collection', desc: 'HGS, POS, and QR channels run together and route each payment flow automatically.' },
      { title: 'Freeflow-ready operation', desc: 'Works with HGS-integrated freeflow scenarios and supports barrier-compatible transitions.' },
      { title: '24/7 remote tracking + voice guidance', desc: 'Device operations are tracked remotely and user flow is supported with voice prompts.' },
    ],
    summary: [
      'Optimized for unmanned exit collection workflows.',
      'HGS + POS + QR architecture increases collection success rates.',
      'Payment, passage, and alert events can be monitored remotely 24/7.',
      'Voice guidance improves driver interaction during payment steps.',
    ],
    use_cases: [
      'Parking entry and exit payment points.',
      'Unmanned parking operations.',
      'Sites operating with freeflow infrastructure.',
      'Subscription, access, and automated collection scenarios.',
    ],
    cta_desc: 'Contact our team for a configuration and installation tailored to your needs.',
  }),
  withUi('ru', {
    page_title: 'Киоск бесконтактной оплаты на выезде | Visiosoft',
    meta_desc:
      'Страница киоска бесконтактной оплаты на выезде: без ввода номера, HGS + POS + QR и удаленный контроль 24/7.',
    eyebrow: 'Киосковые системы парковки',
    name: 'Киоск бесконтактной оплаты на выезде',
    lead: 'Киоск позволяет принимать бесконтактную оплату на выезде без ручного ввода номера автомобиля.',
    meta: [
      { label: 'Категория', value: 'Киосковые системы' },
      { label: 'Интеграция', value: 'HGS / POS / QR / Принтер / Сеть' },
      { label: 'Использование', value: 'Бесконтактная оплата на выезде без ввода номера' },
      { label: 'Мониторинг', value: 'Удаленный контроль 24/7' },
    ],
    highlights_desc: 'Многоканальная инфраструктура безоператорной оплаты на выезде без ввода номера.',
    dimensions: '300mm × 1800mm × 297,50mm',
    features: [
      { title: 'Оплата без ввода номера', desc: 'Водитель завершает бесконтактную оплату на выезде без ручного ввода номера.' },
      { title: 'Сбор HGS + POS + QR', desc: 'Каналы HGS, POS и QR работают вместе и автоматически выбирают подходящий сценарий.' },
      { title: 'Поддержка Freeflow', desc: 'Благодаря интеграции HGS поддерживаются сценарии свободного проезда (freeflow).' },
      { title: 'Удаленный контроль 24/7 + голосовые подсказки', desc: 'Работа устройства отслеживается удаленно, пользовательский поток поддерживается голосовыми подсказками.' },
    ],
    summary: [
      'Оптимизирован для безоператорной оплаты на выезде.',
      'Комбинация HGS + POS + QR повышает успешность сбора.',
      'События оплаты, проезда и тревог доступны для удаленного контроля 24/7.',
      'Голосовые подсказки повышают удобство для водителя.',
    ],
    use_cases: [
      'Точки оплаты на въезде и выезде с парковки.',
      'Работа парковки без персонала.',
      'Площадки со сценарием свободного проезда (freeflow).',
      'Сценарии подписки, доступа и автоматического сбора.',
    ],
    cta_desc: 'Свяжитесь с нашей командой для конфигурации и установки, адаптированной к вашим потребностям.',
  }),
)

const tirKiosk = loc(
  withUi('tr', {
    page_title: 'İnsansız Çıkış Ödeme Kiosk TIR Versiyonu | Visiosoft',
    meta_desc:
      'İnsansız Çıkış Ödeme Kiosk TIR Versiyonu ürün sayfası: iki katlı paralel yapı, üst/alt panel ödeme, araç sınıfı ve çekici-dorse tanıma.',
    eyebrow: 'TIR Kiosk',
    name: 'İnsansız Çıkış Ödeme Kiosk TIR Versiyonu',
    lead: 'İki katlı paralel çalışan yapısı sayesinde TIR ve kamyon garajlarına özel geliştirilen insansız çıkış ödeme kioskudur.',
    meta: [
      { label: 'Kategori', value: 'Ağır vasıta ödeme kioskları' },
      { label: 'Kullanım', value: 'Otomobil + Kamyon + TIR aynı anda çalışma' },
      { label: 'Ödeme Paneli', value: 'Üst panel / Alt panel ödeme seçeneği' },
      { label: 'Araç Tanıma', value: 'Sınıf tanıma + Çekici/Dorse ayrımı' },
    ],
    highlights_desc: 'TIR sahalarında yoğun akışa uygun, insansız tahsilat için optimize edilmiş ağır vasıta çözümü.',
    dimensions: '300mm × 2455mm × 430mm',
    features: [
      { title: 'İki katlı paralel yapı', desc: 'TIR ve kamyon garajlarında yüksek araçlar için erişimi optimize eder.' },
      { title: 'Tak-çalıştır çoklu araç desteği', desc: 'Hem otomobil hem kamyon/TIR senaryolarında aynı anda hizmet verebilir.' },
      { title: 'Üst/alt panel ödeme esnekliği', desc: 'Sürücü üst panelden veya alt panelden ödeme yapabilir.' },
      { title: 'Araç sınıfı tanıma', desc: 'Çekici ve dorseyi ayrı ayrı tanır, sınıfa göre süreci yönetir.' },
    ],
    summary: [
      'Ağır vasıta operasyonlarında kesintisiz akış için optimize edilmiştir.',
      'Araç tipi ve panel seçimine göre ödeme adımları otomatik uyarlanır.',
      'Çekici/dorse ayrımı ile daha doğru araç tanımlama yapılır.',
      'Standart kioskun HGS + POS + QR dahil tüm ödeme özelliklerini içerir.',
    ],
    use_cases: [
      'TIR ve kamyon garajı giriş-çıkış noktaları.',
      'Lojistik merkezleri ve terminal sahaları.',
      'Liman, gümrük ve depo operasyon alanları.',
      'Ağır vasıta yoğunluğu yüksek serbest geçiş senaryoları.',
    ],
    cta_desc: 'TIR ve kamyon sahalarınız için en uygun panel kurgusunu birlikte planlayalım.',
  }),
  withUi('en', {
    page_title: 'Unmanned Exit Payment Kiosk TIR Version | Visiosoft',
    meta_desc:
      'Unmanned Exit Payment Kiosk TIR Version product page: dual-level parallel structure, upper/lower panel payment, vehicle class and tractor-trailer recognition.',
    eyebrow: 'Truck Kiosk',
    name: 'Unmanned Exit Payment Kiosk TIR Version',
    lead: 'An unmanned exit payment kiosk built for truck and lorry yards, with a dual-level structure that operates in parallel.',
    meta: [
      { label: 'Category', value: 'Heavy-vehicle payment kiosks' },
      { label: 'Usage', value: 'Car + truck + TIR at the same time' },
      { label: 'Payment panel', value: 'Upper / lower panel payment' },
      { label: 'Vehicle recognition', value: 'Class recognition + tractor/trailer split' },
    ],
    highlights_desc: 'A heavy-vehicle solution optimized for unmanned collection in high-flow truck yards.',
    dimensions: '300mm × 2455mm × 430mm',
    features: [
      { title: 'Dual-level parallel structure', desc: 'Optimizes reach for tall vehicles in truck and lorry yards.' },
      { title: 'Plug-and-play multi-vehicle support', desc: 'Serves car and truck/TIR scenarios at the same time.' },
      { title: 'Upper/lower panel flexibility', desc: 'Drivers can pay from the upper or lower panel.' },
      { title: 'Vehicle class recognition', desc: 'Recognizes tractor and trailer separately and manages the flow by class.' },
    ],
    summary: [
      'Optimized for uninterrupted flow in heavy-vehicle operations.',
      'Payment steps adapt automatically to vehicle type and panel choice.',
      'Tractor/trailer split enables more accurate vehicle identification.',
      'Includes all standard kiosk payment features, including HGS + POS + QR.',
    ],
    use_cases: [
      'Truck and lorry yard entry-exit points.',
      'Logistics hubs and terminal sites.',
      'Port, customs, and warehouse operations.',
      'Freeflow sites with high heavy-vehicle traffic.',
    ],
    cta_desc: 'Let’s plan the right panel setup for your truck and lorry sites.',
  }),
  withUi('ru', {
    page_title: 'Киоск бесконтактной оплаты на выезде (версия TIR) | Visiosoft',
    meta_desc:
      'Страница киоска оплаты на выезде версии TIR: двухуровневая параллельная конструкция, оплата с верхней/нижней панели, распознавание класса и тягач-полуприцеп.',
    eyebrow: 'TIR Киоск',
    name: 'Киоск бесконтактной оплаты на выезде (версия TIR)',
    lead: 'Безоператорный киоск оплаты на выезде для стоянок TIR и грузовиков с двухуровневой параллельной конструкцией.',
    meta: [
      { label: 'Категория', value: 'Киоски оплаты для большегрузов' },
      { label: 'Использование', value: 'Легковые + грузовики + TIR одновременно' },
      { label: 'Панель оплаты', value: 'Оплата с верхней / нижней панели' },
      { label: 'Распознавание ТС', value: 'Класс + разделение тягач/полуприцеп' },
    ],
    highlights_desc: 'Решение для большегрузов, оптимизированное для безоператорного сбора на площадках с интенсивным потоком.',
    dimensions: '300mm × 2455mm × 430mm',
    features: [
      { title: 'Двухуровневая параллельная конструкция', desc: 'Оптимизирует доступ для высоких машин на стоянках TIR и грузовиков.' },
      { title: 'Мультитранспортная поддержка', desc: 'Одновременно обслуживает легковые и грузовые/TIR сценарии.' },
      { title: 'Гибкость верхней/нижней панели', desc: 'Водитель может оплатить с верхней или нижней панели.' },
      { title: 'Распознавание класса ТС', desc: 'Отдельно распознает тягач и полуприцеп и ведет процесс по классу.' },
    ],
    summary: [
      'Оптимизирован для непрерывного потока в операциях с большегрузами.',
      'Шаги оплаты автоматически адаптируются к типу ТС и выбору панели.',
      'Разделение тягач/полуприцеп повышает точность идентификации.',
      'Включает все платежные функции стандартного киоска, включая HGS + POS + QR.',
    ],
    use_cases: [
      'Точки въезда и выезда на стоянках TIR и грузовиков.',
      'Логистические центры и терминалы.',
      'Портовые, таможенные и складские зоны.',
      'Сценарии свободного проезда с высокой долей большегрузов.',
    ],
    cta_desc: 'Давайте вместе спланируем оптимальную схему панелей для ваших площадок TIR и грузовиков.',
  }),
)

const visiobox = loc(
  withUi('tr', {
    page_title: 'Visiobox | Visiosoft',
    meta_desc: 'Visiobox ürün sayfası: Box Lite ve Box Pro seçenekleriyle kompakt kontrol kutusu.',
    eyebrow: 'Kontrol Kutusu',
    name: 'Visiobox',
    lead: 'Box Lite ve Box Pro olmak üzere iki seçenek sunan, otopark kontrolünü sadeleştiren kompakt yönetim kutusu.',
    meta: [
      { label: 'Kategori', value: 'Kontrol kutusu' },
      { label: 'Entegrasyon', value: 'Bariyer ve sensörler' },
      { label: 'Kullanım', value: '7/24 çalışma' },
      { label: 'Destek', value: 'Keşif ve planlama' },
    ],
    highlights_desc: 'Otopark otomasyonunu daha düzenli ve yönetilebilir hale getirir.',
    features: [
      { title: 'Kompakt ve modüler yapı', desc: 'Sahada minimum alanla maksimum kontrol.' },
      { title: 'Kolay servis erişimi', desc: 'Bakım ve müdahale süresini kısaltır.' },
      { title: 'Güç ve ağ yönetimi', desc: 'Düzenli bağlantı ve stabil çalışma.' },
      { title: 'Kurulum dostu tasarım', desc: 'Saha montajında hızlı devreye alma.' },
    ],
    summary: [
      'Korumalı metal gövde ve düzenli iç yerleşim.',
      'Kablo girişleri için güvenli bağlantılar.',
      'Saha koşullarına uygun dayanıklı yapı.',
      'Farklı çevre birimleri ile uyumlu.',
    ],
    use_cases: [
      'Bariyer ve turnike kontrolü.',
      'Plaka tanıma entegrasyonları.',
      'Otopark otomasyon altyapısı.',
      'Saha kontrol ve izleme noktaları.',
    ],
    cta_desc: 'İhtiyaca uygun konfigürasyon ve kurulum için ekibimizle iletişime geçin.',
  }),
  withUi('en', {
    page_title: 'Visiobox | Visiosoft',
    meta_desc: 'Visiobox product page: compact control box with Box Lite and Box Pro options.',
    eyebrow: 'Control Box',
    name: 'Visiobox',
    lead: 'A compact management box that simplifies parking control, offered as Box Lite and Box Pro.',
    meta: [
      { label: 'Category', value: 'Control box' },
      { label: 'Integration', value: 'Barriers and sensors' },
      { label: 'Usage', value: '24/7 operation' },
      { label: 'Support', value: 'Discovery and planning' },
    ],
    highlights_desc: 'Makes parking automation more organized and manageable.',
    features: [
      { title: 'Compact modular structure', desc: 'Maximum control with a minimal site footprint.' },
      { title: 'Easy service access', desc: 'Shortens maintenance and intervention time.' },
      { title: 'Power and network management', desc: 'Organized connections and stable operation.' },
      { title: 'Installation-friendly design', desc: 'Faster commissioning during site install.' },
    ],
    summary: [
      'Protected metal body with an organized interior.',
      'Secure connections for cable entries.',
      'Durable structure for field conditions.',
      'Compatible with different peripherals.',
    ],
    use_cases: [
      'Barrier and turnstile control.',
      'License plate recognition integrations.',
      'Parking automation infrastructure.',
      'Field control and monitoring points.',
    ],
    cta_desc: 'Contact our team for a configuration and installation tailored to your needs.',
  }),
  withUi('ru', {
    page_title: 'Visiobox | Visiosoft',
    meta_desc: 'Страница Visiobox: компактный блок управления с вариантами Box Lite и Box Pro.',
    eyebrow: 'Блок управления',
    name: 'Visiobox',
    lead: 'Компактный блок управления парковкой с двумя вариантами: Box Lite и Box Pro.',
    meta: [
      { label: 'Категория', value: 'Блок управления' },
      { label: 'Интеграция', value: 'Шлагбаумы и датчики' },
      { label: 'Использование', value: 'Работа 24/7' },
      { label: 'Поддержка', value: 'Обследование и планирование' },
    ],
    highlights_desc: 'Делает автоматизацию парковки более упорядоченной и управляемой.',
    features: [
      { title: 'Компактная модульная конструкция', desc: 'Максимум контроля при минимальной площади на объекте.' },
      { title: 'Легкий сервисный доступ', desc: 'Сокращает время обслуживания и вмешательства.' },
      { title: 'Управление питанием и сетью', desc: 'Упорядоченные соединения и стабильная работа.' },
      { title: 'Удобный монтаж', desc: 'Быстрый ввод в эксплуатацию на объекте.' },
    ],
    summary: [
      'Защищенный металлический корпус и упорядоченная внутренняя компоновка.',
      'Безопасные соединения для ввода кабелей.',
      'Прочная конструкция для полевых условий.',
      'Совместимость с различными периферийными устройствами.',
    ],
    use_cases: [
      'Управление шлагбаумами и турникетами.',
      'Интеграции распознавания номеров.',
      'Инфраструктура автоматизации парковки.',
      'Точки контроля и мониторинга на объекте.',
    ],
    cta_desc: 'Свяжитесь с нашей командой для конфигурации и установки, адаптированной к вашим потребностям.',
  }),
)

const rackKabin = loc(
  withUi('tr', {
    page_title: 'Visio Rack Kabin | Visiosoft',
    meta_desc: 'Visio Rack Kabin ürün sayfası: saha ekipmanları için güvenli kabin sistemi.',
    eyebrow: 'Kabin Sistemleri',
    name: 'Visio Rack Kabin',
    lead: 'Saha ekipmanlarını güvenli ve düzenli şekilde barındıran rack kabin.',
    meta: [
      { label: 'Kategori', value: 'Kabin sistemleri' },
      { label: 'Güvenlik', value: 'Kilitli erişim' },
      { label: 'Kurulum', value: 'Saha montaj' },
      { label: 'Destek', value: 'Keşif ve planlama' },
    ],
    highlights_desc: 'Saha ekipmanlarında güvenlik ve düzeni birlikte sunar.',
    dimensions: '485mm × 385mm × 350mm',
    features: [
      { title: 'Güvenli kilit sistemi', desc: 'Ekipman erişimini kontrollü hale getirir.' },
      { title: 'Düzenli kablo yönetimi', desc: 'Temiz ve güvenli bağlantılar.' },
      { title: 'Havalandırma alanları', desc: 'Isı yönetimi için destek.' },
      { title: 'Servis erişimi', desc: 'Bakım ve güncelleme işlemleri için kolay erişim.' },
    ],
    summary: [
      'Dayanıklı gövde, dış koşullara uygun yapı.',
      'İç hacimde ekipman yerleşimi için esneklik.',
      'Saha montajına uygun taban tasarımı.',
      'Güvenli ve düzenli kablolama alanı.',
    ],
    use_cases: [
      'Kontrol ve güç ekipmanları.',
      'Network ve iletişim altyapısı.',
      'Saha otomasyon sistemleri.',
      'Otopark yönetim noktaları.',
    ],
    cta_desc: 'Ekipman kapasitesine uygun kabin çözümünü birlikte planlayalım.',
  }),
  withUi('en', {
    page_title: 'Visio Rack Cabinet | Visiosoft',
    meta_desc: 'Visio Rack Cabinet product page: a secure cabinet system for field equipment.',
    eyebrow: 'Cabinet Systems',
    name: 'Visio Rack Cabinet',
    lead: 'A rack cabinet that houses field equipment in a secure and organized way.',
    meta: [
      { label: 'Category', value: 'Cabinet systems' },
      { label: 'Security', value: 'Locked access' },
      { label: 'Installation', value: 'Field mounting' },
      { label: 'Support', value: 'Discovery and planning' },
    ],
    highlights_desc: 'Combines security and organization for field equipment.',
    dimensions: '485mm × 385mm × 350mm',
    features: [
      { title: 'Secure lock system', desc: 'Keeps equipment access controlled.' },
      { title: 'Organized cable management', desc: 'Clean and safe connections.' },
      { title: 'Ventilation areas', desc: 'Support for heat management.' },
      { title: 'Service access', desc: 'Easy access for maintenance and updates.' },
    ],
    summary: [
      'Durable body suited to outdoor conditions.',
      'Flexible interior space for equipment placement.',
      'Base design suited to field installation.',
      'Safe and organized cabling area.',
    ],
    use_cases: [
      'Control and power equipment.',
      'Network and communication infrastructure.',
      'Field automation systems.',
      'Parking management points.',
    ],
    cta_desc: 'Let’s plan a cabinet solution that matches your equipment capacity.',
  }),
  withUi('ru', {
    page_title: 'Visio Rack Cabin | Visiosoft',
    meta_desc: 'Страница Visio Rack Cabin: безопасный шкаф для полевого оборудования.',
    eyebrow: 'Кабинные системы',
    name: 'Visio Rack Cabin',
    lead: 'Стоечный шкаф, который надежно и упорядоченно размещает полевое оборудование.',
    meta: [
      { label: 'Категория', value: 'Кабинные системы' },
      { label: 'Безопасность', value: 'Доступ с замком' },
      { label: 'Установка', value: 'Полевой монтаж' },
      { label: 'Поддержка', value: 'Обследование и планирование' },
    ],
    highlights_desc: 'Сочетает безопасность и порядок для полевого оборудования.',
    dimensions: '485mm × 385mm × 350mm',
    features: [
      { title: 'Надежная система замка', desc: 'Делает доступ к оборудованию контролируемым.' },
      { title: 'Упорядоченная прокладка кабелей', desc: 'Чистые и безопасные соединения.' },
      { title: 'Зоны вентиляции', desc: 'Поддержка управления теплом.' },
      { title: 'Сервисный доступ', desc: 'Легкий доступ для обслуживания и обновлений.' },
    ],
    summary: [
      'Прочный корпус, подходящий для внешних условий.',
      'Гибкость внутреннего объема для размещения оборудования.',
      'Основание, подходящее для полевого монтажа.',
      'Безопасная и упорядоченная зона кабелей.',
    ],
    use_cases: [
      'Оборудование управления и питания.',
      'Сетевая и коммуникационная инфраструктура.',
      'Системы полевой автоматизации.',
      'Точки управления парковкой.',
    ],
    cta_desc: 'Давайте вместе спланируем решение шкафа под емкость вашего оборудования.',
  }),
)

const kameraMuhafaza = loc(
  withUi('tr', {
    page_title: 'Visio Kamera | Visiosoft',
    meta_desc: 'Visio Kamera ürün sayfası: dış ortam kameraları için koruma donanımı.',
    eyebrow: 'Koruma Donanımı',
    name: 'Visio Kamera',
    lead: 'Kameraları dış koşullara karşı koruyan, kompakt ve sağlam muhafaza.',
    meta: [
      { label: 'Kategori', value: 'Koruma donanımı' },
      { label: 'Koruma', value: 'Dış ortam' },
      { label: 'Kurulum', value: 'Kolay montaj' },
      { label: 'Destek', value: 'Keşif ve planlama' },
    ],
    highlights_desc: 'Dış ortam kameraları için dengeli koruma ve kolay servis.',
    features: [
      { title: 'Yüksek dayanımlı gövde', desc: 'Darbe ve hava koşullarına karşı koruma.' },
      { title: 'Ayarlanabilir montaj ayağı', desc: 'Açı ve yön için pratik ayar.' },
      { title: 'Servis kapağı erişimi', desc: 'Bakım ve temizlik için hızlı erişim.' },
      { title: 'Kablo geçiş düzeni', desc: 'Kabloları koruyan düzenli çıkış.' },
    ],
    summary: [
      'Kompakt tasarım, sahada minimum yer kaplar.',
      'Koruyucu kaplama ile uzun ömür.',
      'Montaj aparatlarıyla uyumlu yapı.',
      'Dış ortam uygulamalarına uygun gövde.',
    ],
    use_cases: [
      'Plaka tanıma kameraları.',
      'Giriş ve çıkış kontrol noktaları.',
      'Perimeter ve saha güvenliği.',
      'Çatı ve direk montajları.',
    ],
    cta_desc: 'Kameralarınız için uygun muhafaza çözümünü birlikte belirleyelim.',
  }),
  withUi('en', {
    page_title: 'Visio Camera | Visiosoft',
    meta_desc: 'Visio Camera product page: protective hardware for outdoor cameras.',
    eyebrow: 'Protective Hardware',
    name: 'Visio Camera',
    lead: 'A compact, rugged housing that protects cameras from outdoor conditions.',
    meta: [
      { label: 'Category', value: 'Protective hardware' },
      { label: 'Protection', value: 'Outdoor' },
      { label: 'Installation', value: 'Easy mounting' },
      { label: 'Support', value: 'Discovery and planning' },
    ],
    highlights_desc: 'Balanced protection and easy service for outdoor cameras.',
    features: [
      { title: 'High-strength body', desc: 'Protection against impact and weather.' },
      { title: 'Adjustable mounting foot', desc: 'Easy angle and direction adjustment.' },
      { title: 'Service cover access', desc: 'Fast access for maintenance and cleaning.' },
      { title: 'Cable pass-through layout', desc: 'Organized exits that protect cables.' },
    ],
    summary: [
      'Compact design that minimizes footprint on site.',
      'Long life with protective coating.',
      'Compatible with mounting accessories.',
      'Housing suited for outdoor applications.',
    ],
    use_cases: [
      'License plate recognition cameras.',
      'Entry and exit control points.',
      'Perimeter and site security.',
      'Roof and pole mounts.',
    ],
    cta_desc: "Let's define the right housing solution for your cameras.",
  }),
  withUi('ru', {
    page_title: 'Visio камера | Visiosoft',
    meta_desc: 'Страница Visio камеры: защитное оборудование для наружных камер.',
    eyebrow: 'Защитное оборудование',
    name: 'Visio камера',
    lead: 'Компактный прочный корпус, защищающий камеры от внешних условий.',
    meta: [
      { label: 'Категория', value: 'Защитное оборудование' },
      { label: 'Защита', value: 'Наружная среда' },
      { label: 'Установка', value: 'Легкий монтаж' },
      { label: 'Поддержка', value: 'Обследование и планирование' },
    ],
    highlights_desc: 'Сбалансированная защита и легкое обслуживание для наружных камер.',
    features: [
      { title: 'Высокопрочный корпус', desc: 'Защита от ударов и погодных условий.' },
      { title: 'Регулируемый монтажный кронштейн', desc: 'Практическая регулировка угла и направления.' },
      { title: 'Доступ к сервисной крышке', desc: 'Быстрый доступ для обслуживания и чистки.' },
      { title: 'Порядок прохода кабеля', desc: 'Организованный выход, защищающий кабели.' },
    ],
    summary: [
      'Компактный дизайн, занимает минимум места на объекте.',
      'Длительный срок службы с защитным покрытием.',
      'Конструкция, совместимая с монтажными приспособлениями.',
      'Корпус, подходящий для наружного применения.',
    ],
    use_cases: [
      'Камеры распознавания номерных знаков.',
      'Контрольные точки въезда и выезда.',
      'Периметр и безопасность объекта.',
      'Монтаж на крышах и столбах.',
    ],
    cta_desc: 'Давайте вместе определим подходящее решение для корпуса ваших камер.',
  }),
)

const kameraMontajKulesi = loc(
  withUi('tr', {
    page_title: 'Visio Kamera Montaj Kulesi | Visiosoft',
    meta_desc: 'Visio Kamera Montaj Kulesi ürün sayfası: yüksek montaj için modüler kule.',
    eyebrow: 'Montaj Sistemleri',
    name: 'Visio Kamera Montaj Kulesi',
    lead: 'Kameraları yüksekten konumlandırmak için modüler ve dayanıklı montaj kulesi.',
    meta: [
      { label: 'Kategori', value: 'Montaj sistemleri' },
      { label: 'Kullanım', value: 'Dış ortam' },
      { label: 'Kurulum', value: 'Modüler yükseklik' },
      { label: 'Destek', value: 'Keşif ve planlama' },
    ],
    highlights_desc: 'Sahada güvenli ve düzenli kurulum için tasarlandı.',
    features: [
      { title: 'Modüler yükseklik seçenekleri', desc: 'Saha ihtiyaçlarına göre esnek kurulum.' },
      { title: 'Güvenli sabitleme tabanı', desc: 'Zemin ankrajına uygun sağlam yapı.' },
      { title: 'Kablo düzeni için iç kanal', desc: 'Kablolamayı koruyan düzenli geçiş.' },
      { title: 'Bakım erişimi kolay', desc: 'Kurulum sonrası servis için pratik erişim.' },
    ],
    summary: [
      'Dayanıklı metal gövde ve koruyucu kaplama.',
      'Kamera ağırlığına uygun dengeli tasarım.',
      'Kurulum ve bakım için hızlı montaj.',
      'Saha koşullarına uygun uzun ömürlü yapı.',
    ],
    use_cases: [
      'Açık otopark izleme noktaları.',
      'Giriş ve çıkış şeritleri.',
      'Geniş saha ve perimeter güvenliği.',
      'PTS kamera uygulamaları.',
    ],
    cta_desc: 'Kurulum yüksekliği ve saha koşulları için uygun çözümü birlikte planlayalım.',
  }),
  withUi('en', {
    page_title: 'Visio Camera Mount Tower | Visiosoft',
    meta_desc: 'Visio Camera Mount Tower product page for modular elevated camera mounting.',
    eyebrow: 'Mounting Systems',
    name: 'Visio Camera Mount Tower',
    lead: 'Modular, durable mount tower for elevated camera positioning.',
    meta: [
      { label: 'Category', value: 'Mounting systems' },
      { label: 'Usage', value: 'Outdoor' },
      { label: 'Installation', value: 'Modular height' },
      { label: 'Support', value: 'Discovery and planning' },
    ],
    highlights_desc: 'Designed for secure and organized field installation.',
    features: [
      { title: 'Modular height options', desc: 'Flexible installation for site needs.' },
      { title: 'Secure base anchoring', desc: 'Solid structure for ground anchoring.' },
      { title: 'Internal cable channel', desc: 'Organized routing that protects cabling.' },
      { title: 'Easy maintenance access', desc: 'Practical access for post-install service.' },
    ],
    summary: [
      'Durable metal body with protective coating.',
      'Balanced design for camera weight.',
      'Fast installation and maintenance.',
      'Long-lasting structure for field conditions.',
    ],
    use_cases: [
      'Open parking monitoring points.',
      'Entry and exit lanes.',
      'Large sites and perimeter security.',
      'Camera-based plate recognition.',
    ],
    cta_desc: "Let's plan the right solution for mounting height and site conditions.",
  }),
  withUi('ru', {
    page_title: 'Visio монтажная башня камеры | Visiosoft',
    meta_desc: 'Страница продукта монтажной башни камеры Visio: модульная башня для высокого монтажа.',
    eyebrow: 'Монтажные системы',
    name: 'Visio монтажная башня камеры',
    lead: 'Модульная и прочная монтажная башня для высокого позиционирования камер.',
    meta: [
      { label: 'Категория', value: 'Монтажные системы' },
      { label: 'Использование', value: 'Наружная среда' },
      { label: 'Установка', value: 'Модульная высота' },
      { label: 'Поддержка', value: 'Обследование и планирование' },
    ],
    highlights_desc: 'Разработана для безопасной и организованной установки на объекте.',
    features: [
      { title: 'Модульные варианты высоты', desc: 'Гибкая установка в соответствии с потребностями объекта.' },
      { title: 'Безопасное основание для крепления', desc: 'Прочная конструкция, подходящая для анкеровки к земле.' },
      { title: 'Внутренний канал для прокладки кабелей', desc: 'Организованный проход, защищающий кабели.' },
      { title: 'Легкий доступ к обслуживанию', desc: 'Практический доступ для обслуживания после установки.' },
    ],
    summary: [
      'Прочный металлический корпус и защитное покрытие.',
      'Сбалансированная конструкция, подходящая для веса камеры.',
      'Быстрый монтаж для установки и обслуживания.',
      'Долговечная конструкция, подходящая для полевых условий.',
    ],
    use_cases: [
      'Точки мониторинга открытых парковок.',
      'Полосы въезда и выезда.',
      'Широкая территория и безопасность периметра.',
      'Применения ANPR камер.',
    ],
    cta_desc: 'Давайте вместе спланируем подходящее решение для высоты установки и полевых условий.',
  }),
)

const ledliReklamPaneli = loc(
  withUi('tr', {
    page_title: 'LED Bilgilendirme Paneli | Visiosoft',
    meta_desc: 'LED Bilgilendirme Paneli ürün sayfası: yönlendirme ve duyuru için yüksek görünürlüklü panel.',
    eyebrow: 'Bilgilendirme ve Reklam',
    name: 'LED Bilgilendirme Paneli',
    lead: 'Girişlerde ve yönlendirmede yüksek görünürlüklü LED panel çözümü.',
    meta: [
      { label: 'Kategori', value: 'Bilgilendirme panelleri' },
      { label: 'Görünürlük', value: 'Yüksek parlaklık' },
      { label: 'Kullanım', value: 'İç ve dış ortam' },
      { label: 'Destek', value: 'Keşif ve planlama' },
    ],
    highlights_desc: 'Yönlendirme ve duyuru mesajları için güçlü görünürlük.',
    dimensions: '715mm × 1900mm × 100mm',
    features: [
      { title: 'Yüksek görünürlük', desc: 'Gündüz ve gece net mesaj iletimi.' },
      { title: 'Dinamik mesaj alanı', desc: 'Kampanya ve yönlendirme için esnek kullanım.' },
      { title: 'Enerji verimli LED', desc: 'Uzun süreli kullanımda düşük tüketim.' },
      { title: 'Kurumsal tasarım', desc: 'Saha estetiğine uygun sade görünüm.' },
    ],
    summary: [
      'Modüler panel gövdesi ve sağlam taşıyıcı yapı.',
      'Kablo düzeni için korumalı bağlantılar.',
      'Saha koşullarına uygun kaplama.',
      'Kurumsal mesajlar için geniş görünür alan.',
    ],
    use_cases: [
      'Otopark giriş bilgilendirmesi.',
      'Yönlendirme ve duyuru panoları.',
      'Kampanya ve tarife duyuruları.',
      'Aciliyet ve uyarı mesajları.',
    ],
    cta_desc: 'Kurumsal mesajlarınız için uygun panel çözümünü birlikte belirleyelim.',
  }),
  withUi('en', {
    page_title: 'Visio LED Advertising Panel | Visiosoft',
    meta_desc: 'Visio LED Advertising Panel product page for guidance and announcements.',
    eyebrow: 'Information & Advertising',
    name: 'Visio LED Advertising Panel',
    lead: 'High-visibility LED panel solution for entries and wayfinding.',
    meta: [
      { label: 'Category', value: 'Information panels' },
      { label: 'Visibility', value: 'High brightness' },
      { label: 'Usage', value: 'Indoor and outdoor' },
      { label: 'Support', value: 'Discovery and planning' },
    ],
    highlights_desc: 'Powerful visibility for guidance and announcement messages.',
    dimensions: '715mm × 1900mm × 100mm',
    features: [
      { title: 'High visibility', desc: 'Clear messaging day and night.' },
      { title: 'Dynamic message area', desc: 'Flexible use for campaigns and guidance.' },
      { title: 'Energy-efficient LED', desc: 'Low consumption for long-term use.' },
      { title: 'Corporate design', desc: 'Clean look aligned with site aesthetics.' },
    ],
    summary: [
      'Modular panel body with a sturdy carrier structure.',
      'Protected connections for cable management.',
      'Coating suited for field conditions.',
      'Wide visibility area for corporate messages.',
    ],
    use_cases: [
      'Parking entry information.',
      'Wayfinding and announcement boards.',
      'Campaign and tariff announcements.',
      'Urgent and warning messages.',
    ],
    cta_desc: "Let's define the right panel solution for your corporate messages.",
  }),
  withUi('ru', {
    page_title: 'Visio LED рекламная панель | Visiosoft',
    meta_desc: 'Страница продукта LED рекламной панели Visio: панель с высокой видимостью для навигации и объявлений.',
    eyebrow: 'Информация и реклама',
    name: 'Visio LED рекламная панель',
    lead: 'Решение LED панели с высокой видимостью для входов и навигации.',
    meta: [
      { label: 'Категория', value: 'Информационные панели' },
      { label: 'Видимость', value: 'Высокая яркость' },
      { label: 'Использование', value: 'Внутри и снаружи' },
      { label: 'Поддержка', value: 'Обследование и планирование' },
    ],
    highlights_desc: 'Мощная видимость для сообщений навигации и объявлений.',
    dimensions: '715mm × 1900mm × 100mm',
    features: [
      { title: 'Высокая видимость', desc: 'Четкая передача сообщений днем и ночью.' },
      { title: 'Динамическая область сообщений', desc: 'Гибкое использование для кампаний и навигации.' },
      { title: 'Энергоэффективный LED', desc: 'Низкое потребление при длительном использовании.' },
      { title: 'Корпоративный дизайн', desc: 'Простой вид, подходящий для эстетики объекта.' },
    ],
    summary: [
      'Модульный корпус панели и прочная несущая конструкция.',
      'Защищенные соединения для прокладки кабелей.',
      'Покрытие, подходящее для полевых условий.',
      'Широкая видимая область для корпоративных сообщений.',
    ],
    use_cases: [
      'Информация о въезде на парковку.',
      'Панели навигации и объявлений.',
      'Объявления кампаний и тарифов.',
      'Срочные и предупреждающие сообщения.',
    ],
    cta_desc: 'Давайте вместе определим подходящее решение для панелей для ваших корпоративных сообщений.',
  }),
)

const togerbox = loc(
  withUi('tr', {
    page_title: 'Togerbox | Visiosoft',
    meta_desc: 'Togerbox ürün sayfası: kompakt kontrol kutusu.',
    eyebrow: 'Kontrol Kutusu',
    name: 'Togerbox',
    lead: 'Otopark kontrolünü sadeleştiren kompakt yönetim kutusu.',
    meta: [
      { label: 'Kategori', value: 'Kontrol kutusu' },
      { label: 'Entegrasyon', value: 'Bariyer ve sensörler' },
      { label: 'Kullanım', value: '7/24 çalışma' },
      { label: 'Destek', value: 'Keşif ve planlama' },
    ],
    highlights_desc: 'Otopark otomasyonunu daha düzenli ve yönetilebilir hale getirir.',
    features: [
      { title: 'Kompakt ve modüler yapı', desc: 'Sahada minimum alanla maksimum kontrol.' },
      { title: 'Kolay servis erişimi', desc: 'Bakım ve müdahale süresini kısaltır.' },
      { title: 'Güç ve ağ yönetimi', desc: 'Düzenli bağlantı ve stabil çalışma.' },
      { title: 'Kurulum dostu tasarım', desc: 'Saha montajında hızlı devreye alma.' },
    ],
    summary: [
      'Korumalı metal gövde ve düzenli iç yerleşim.',
      'Kablo girişleri için güvenli bağlantılar.',
      'Saha koşullarına uygun dayanıklı yapı.',
      'Farklı çevre birimleri ile uyumlu.',
    ],
    use_cases: [
      'Bariyer ve turnike kontrolü.',
      'Plaka tanıma entegrasyonları.',
      'Otopark otomasyon altyapısı.',
      'Saha kontrol ve izleme noktaları.',
    ],
    cta_desc: 'İhtiyaca uygun konfigürasyon ve kurulum için ekibimizle iletişime geçin.',
  }),
  withUi('en', {
    page_title: 'Togerbox | Visiosoft',
    meta_desc: 'Togerbox product page: compact control box.',
    eyebrow: 'Control Box',
    name: 'Togerbox',
    lead: 'A compact management box that simplifies parking control.',
    meta: [
      { label: 'Category', value: 'Control box' },
      { label: 'Integration', value: 'Barriers and sensors' },
      { label: 'Usage', value: '24/7 operation' },
      { label: 'Support', value: 'Discovery and planning' },
    ],
    highlights_desc: 'Makes parking automation more organized and manageable.',
    features: [
      { title: 'Compact modular structure', desc: 'Maximum control with a minimal site footprint.' },
      { title: 'Easy service access', desc: 'Shortens maintenance and intervention time.' },
      { title: 'Power and network management', desc: 'Organized connections and stable operation.' },
      { title: 'Installation-friendly design', desc: 'Faster commissioning during site install.' },
    ],
    summary: [
      'Protected metal body with an organized interior.',
      'Secure connections for cable entries.',
      'Durable structure for field conditions.',
      'Compatible with different peripherals.',
    ],
    use_cases: [
      'Barrier and turnstile control.',
      'License plate recognition integrations.',
      'Parking automation infrastructure.',
      'Field control and monitoring points.',
    ],
    cta_desc: 'Contact our team for a configuration and installation tailored to your needs.',
  }),
  withUi('ru', {
    page_title: 'Togerbox | Visiosoft',
    meta_desc: 'Страница Togerbox: компактный блок управления.',
    eyebrow: 'Блок управления',
    name: 'Togerbox',
    lead: 'Компактный блок управления, упрощающий контроль парковки.',
    meta: [
      { label: 'Категория', value: 'Блок управления' },
      { label: 'Интеграция', value: 'Шлагбаумы и датчики' },
      { label: 'Использование', value: 'Работа 24/7' },
      { label: 'Поддержка', value: 'Обследование и планирование' },
    ],
    highlights_desc: 'Делает автоматизацию парковки более упорядоченной и управляемой.',
    features: [
      { title: 'Компактная модульная конструкция', desc: 'Максимум контроля при минимальной площади на объекте.' },
      { title: 'Легкий сервисный доступ', desc: 'Сокращает время обслуживания и вмешательства.' },
      { title: 'Управление питанием и сетью', desc: 'Упорядоченные соединения и стабильная работа.' },
      { title: 'Удобный монтаж', desc: 'Быстрый ввод в эксплуатацию на объекте.' },
    ],
    summary: [
      'Защищенный металлический корпус и упорядоченная внутренняя компоновка.',
      'Безопасные соединения для ввода кабелей.',
      'Прочная конструкция для полевых условий.',
      'Совместимость с различными периферийными устройствами.',
    ],
    use_cases: [
      'Управление шлагбаумами и турникетами.',
      'Интеграции распознавания номеров.',
      'Инфраструктура автоматизации парковки.',
      'Точки контроля и мониторинга на объекте.',
    ],
    cta_desc: 'Свяжитесь с нашей командой для конфигурации и установки, адаптированной к вашим потребностям.',
  }),
)

export const products: Record<HardwareSlug, HardwareProductDef> = {
  kiosk: {
    slug: 'kiosk',
    route: 'hardware-products.kiosk',
    model: '/parking-product-3d/kiosk/kiosk.glb',
    technicalImage: '/parking-product-3d/kiosk/kiosk.png',
    // Kısa adlar müşterinin onayladığı menü adlarıyla aynıdır (siteNav hardwareMenu).
    navLabel: loc('Ödeme Kiosku', 'Kiosk', 'Киоск'),
    copy: kiosk,
  },
  'tir-kiosk': {
    slug: 'tir-kiosk',
    route: 'hardware-products.tir-kiosk',
    model: '/parking-product-3d/tir-kiosk/truck_kiosk.glb',
    technicalImage: '/parking-product-3d/tir-kiosk/tir_kiosk.png',
    navLabel: loc('TIR Ödeme Kiosku', 'Truck Kiosk', 'TIR Киоск'),
    copy: tirKiosk,
  },
  visiobox: {
    slug: 'visiobox',
    route: 'hardware-products.visiobox',
    model: '/parking-product-3d/visiobox/visiobox.glb',
    technicalImage: '/parking-product-3d/visiobox/visiobox.png',
    navLabel: loc('Visiobox', 'Visiobox', 'Visiobox'),
    copy: visiobox,
  },
  'rack-kabin': {
    slug: 'rack-kabin',
    route: 'hardware-products.rack-kabin',
    model: '/parking-product-3d/rack-kabin/visio-rack-kabin.glb',
    technicalImage: '/parking-product-3d/rack-kabin/rack_kabin.png',
    navLabel: loc('Rack Kabin', 'Rack Cabinet', 'Rack Cabin'),
    copy: rackKabin,
  },
  'kamera-muhafaza': {
    slug: 'kamera-muhafaza',
    route: 'hardware-products.kamera-muhafaza',
    model: '/parking-product-3d/kamera-muhafaza/camera.glb',
    technicalImage: '/parking-product-3d/kamera-muhafaza/technical.png',
    navLabel: loc('Visio Kamera', 'Camera Housing', 'Корпус камеры'),
    copy: kameraMuhafaza,
  },
  'kamera-montaj-kulesi': {
    slug: 'kamera-montaj-kulesi',
    route: 'hardware-products.kamera-montaj-kulesi',
    model: '/parking-product-3d/kamera-montaj-kulesi/visio-kamera-montaj-kulesi.glb',
    navLabel: loc('Kamera Montaj Kulesi', 'Camera Mount Tower', 'Монтажная башня камеры'),
    copy: kameraMontajKulesi,
  },
  'ledli-reklam-paneli': {
    slug: 'ledli-reklam-paneli',
    route: 'hardware-products.ledli-reklam-paneli',
    model: '/parking-product-3d/ledli-reklam-paneli/visio-ledli-reklam-paneli.glb',
    technicalImage: '/parking-product-3d/ledli-reklam-paneli/led_panel.png',
    navLabel: loc('LED Bilgilendirme Paneli', 'LED Panel', 'LED рекламная панель'),
    copy: ledliReklamPaneli,
  },
  togerbox: {
    slug: 'togerbox',
    route: 'hardware-products.togerbox',
    model: '/parking-product-3d/togerbox/togerbox.glb',
    navLabel: loc('Togerbox', 'Togerbox', 'Togerbox'),
    copy: togerbox,
  },
}

export const productNav = [
  products.kiosk,
  products['tir-kiosk'],
  products.visiobox,
  products['rack-kabin'],
  products['kamera-muhafaza'],
  products['kamera-montaj-kulesi'],
  products['ledli-reklam-paneli'],
] as const

export function isHardwareSlug(slug: string): slug is HardwareSlug {
  return (hardwareSlugs as readonly string[]).includes(slug)
}

export function getHardwareProduct(slug: string): HardwareProductDef {
  return isHardwareSlug(slug) ? products[slug] : products.kiosk
}
