export type HgsCopy = {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
  heroHighlights: { icon: string; label: string }[]
  heroPanelTitle: string
  liveLabel: string
  heroPanelRows: { label: string; description: string }[]
  heroStats: { value: string; label: string }[]
  outcomes: string[]
  paymentTitle: string
  paymentIntro: string
  paymentMethods: { icon: string; title: string; description: string }[]
  advantagesTitle: string
  advantagesIntro: string
  advantages: { icon: string; title: string; description: string }[]
  flowTitle: string
  flowSteps: { step: string; title: string; description: string }[]
  sectorsTitle: string
  sectors: { icon: string; label: string }[]
  ctaTitle: string
  ctaDescription: string
  ctaPrimary: string
  ctaSecondary: string
}

const _en: HgsCopy = {
  metaTitle: 'Unmanned Parking with HGS | Visiosoft',
  metaDescription:
    'Build unmanned parking flows with HGS, POS, QR, and live reporting. Speed up access, protect revenue, and reduce staffing costs.',
  eyebrow: 'UNMANNED PARKING WITH HGS',
  title: 'Maximum revenue. Minimum waiting.',
  subtitle:
    'Recognize vehicles through HGS, collect payment automatically, and route fallback payments to POS or QR when needed. Manage the entire parking flow from a single control layer.',
  primaryCta: 'Get Quote',
  secondaryCta: 'Free Discovery',
  heroHighlights: [
    { icon: 'barrier', label: 'Contactless entry and exit' },
    { icon: 'layers', label: 'HGS + POS + QR payment stack' },
    { icon: 'chart', label: 'Lower leakage risk' },
  ],
  heroPanelTitle: 'Payment Matrix',
  liveLabel: 'Live',
  heroPanelRows: [
    { label: 'HGS', description: 'Primary automatic collection for tagged vehicles' },
    { label: 'POS', description: 'Card or contactless fallback when HGS balance is unavailable' },
    { label: 'QR', description: 'Mobile payment flow completed from the driver phone' },
  ],
  heroStats: [
    { value: 'Single Panel', label: 'Access, payment, and exception management together' },
    { value: '24/7', label: 'Remote monitoring and intervention ready' },
    { value: 'Cashless', label: 'Designed for unmanned operations' },
  ],
  outcomes: ['No queues', 'No fixed cashier dependency', 'No blind spots in collections'],
  paymentTitle: 'Bring payment methods together in one unmanned flow',
  paymentIntro:
    'HGS should be the fastest lane, but not the only lane. The strongest parking experience keeps collection running with multiple automated payment scenarios.',
  paymentMethods: [
    {
      icon: 'wifi',
      title: 'HGS automatic collection',
      description: 'Vehicles with HGS tags are recognized instantly and charged without manual intervention.',
    },
    {
      icon: 'card',
      title: 'POS and contactless card',
      description: 'If HGS is unavailable or insufficient, drivers can complete payment from kiosk or exit point by card.',
    },
    {
      icon: 'qr',
      title: 'QR and mobile payment',
      description: 'Drivers pay from their phone and the payment result appears in the operator panel in real time.',
    },
    {
      icon: 'building',
      title: 'Subscription and fleet scenarios',
      description: 'Residents, tenants, staff, and corporate fleets can pass with predefined rules and centralized billing.',
    },
  ],
  advantagesTitle: 'Why HGS stands out in unmanned parking',
  advantagesIntro:
    'The HGS layer is valuable not only because it speeds up the gate, but because it reduces manual work across the whole revenue operation.',
  advantages: [
    {
      icon: 'gauge',
      title: 'Faster throughput',
      description: 'Reduce stop-and-go traffic at busy hours and move more vehicles through the same lane.',
    },
    {
      icon: 'user',
      title: 'Lower staffing load',
      description: 'Remove constant cashier dependency and shift operators to exception-only management.',
    },
    {
      icon: 'shield',
      title: 'Revenue protection',
      description: 'Every passage is recorded; when HGS fails, the system routes drivers to another payment channel.',
    },
    {
      icon: 'pie',
      title: 'Actionable reporting',
      description: 'Track collections by payment method, barrier, date, and exception scenario from a single dashboard.',
    },
  ],
  flowTitle: 'How it works',
  flowSteps: [
    { step: '1', title: 'Vehicle recognition', description: 'HGS and plate data are matched at entry or exit.' },
    { step: '2', title: 'Scenario selection', description: 'The system decides whether HGS, POS, QR, or subscription logic applies.' },
    { step: '3', title: 'Automatic collection', description: 'Payment is collected and the transaction is written to live reports instantly.' },
    { step: '4', title: 'Barrier release', description: 'The barrier opens and exceptions remain visible for remote follow-up.' },
  ],
  sectorsTitle: 'Who is it ideal for?',
  sectors: [
    { icon: 'mall', label: 'Shopping malls' },
    { icon: 'home', label: 'Sites and residences' },
    { icon: 'hospital', label: 'Hospitals and campuses' },
    { icon: 'city', label: 'Municipal parking' },
    { icon: 'brief', label: 'Business centers' },
    { icon: 'truck', label: 'Commercial parking operations' },
  ],
  ctaTitle: 'Ready to turn your parking operation into an HGS-first unmanned system?',
  ctaDescription: 'We can position HGS, POS, QR, kiosk, barrier, and reporting flows according to your traffic model.',
  ctaPrimary: 'Get Quote',
  ctaSecondary: 'Contact',
}

const _ru: HgsCopy = {
  metaTitle: 'Безлюдная парковка с HGS | Visiosoft',
  metaDescription:
    'Постройте безлюдный парковочный сценарий с HGS, POS, QR и онлайн-отчетностью. Ускоряйте проезд, защищайте выручку и снижайте затраты на персонал.',
  eyebrow: 'БЕЗЛЮДНАЯ ПАРКОВКА С HGS',
  title: 'Максимум выручки. Минимум ожидания.',
  subtitle:
    'Определяйте автомобили через HGS, списывайте оплату автоматически и при необходимости переключайте сценарий на POS или QR. Управляйте всем парковочным потоком из единого контрольного слоя.',
  primaryCta: 'Получить предложение',
  secondaryCta: 'Бесплатный аудит',
  heroHighlights: [
    { icon: 'barrier', label: 'Бесконтактный въезд и выезд' },
    { icon: 'layers', label: 'Платежный стек HGS + POS + QR' },
    { icon: 'chart', label: 'Меньше риска потери выручки' },
  ],
  heroPanelTitle: 'Платежная матрица',
  liveLabel: 'Онлайн',
  heroPanelRows: [
    { label: 'HGS', description: 'Основной автоматический сбор для автомобилей с меткой' },
    { label: 'POS', description: 'Резервный сценарий карты и contactless при отсутствии баланса HGS' },
    { label: 'QR', description: 'Оплата с телефона водителя с мгновенной фиксацией в панели' },
  ],
  heroStats: [
    { value: 'Единая панель', label: 'Проезд, оплата и исключения в одном интерфейсе' },
    { value: '24/7', label: 'Удаленный мониторинг и вмешательство' },
    { value: 'Без кассы', label: 'Подходит для безлюдной эксплуатации' },
  ],
  outcomes: ['Без очередей', 'Без постоянной кассы', 'Без слепых зон в оплатах'],
  paymentTitle: 'Объедините способы оплаты в одном безлюдном потоке',
  paymentIntro:
    'HGS должен быть самым быстрым маршрутом, но не единственным. Сильный парковочный сценарий сохраняет сбор выручки благодаря нескольким автоматическим путям оплаты.',
  paymentMethods: [
    {
      icon: 'wifi',
      title: 'Автоматический сбор через HGS',
      description: 'Автомобили с меткой HGS определяются мгновенно и оплачиваются без ручного участия.',
    },
    {
      icon: 'card',
      title: 'POS и бесконтактная карта',
      description: 'Если HGS недоступен или баланса недостаточно, водитель завершает оплату картой на киоске или точке выезда.',
    },
    {
      icon: 'qr',
      title: 'QR и мобильная оплата',
      description: 'Водитель платит со смартфона, а результат сразу отображается в операторской панели.',
    },
    {
      icon: 'building',
      title: 'Абонементы и корпоративные автопарки',
      description:
        'Жильцы, сотрудники, арендаторы и корпоративные автомобили проходят по заранее заданным правилам и централизованному биллингу.',
    },
  ],
  advantagesTitle: 'Почему HGS особенно силен в безлюдной парковке',
  advantagesIntro:
    'Ценность слоя HGS не только в скорости шлагбаума, но и в снижении ручной нагрузки по всей выручке и эксплуатации.',
  advantages: [
    {
      icon: 'gauge',
      title: 'Быстрее пропускная способность',
      description: 'Снижайте stop-and-go в часы пик и пропускайте больше машин через ту же полосу.',
    },
    {
      icon: 'user',
      title: 'Меньше нагрузки на персонал',
      description: 'Уберите постоянную зависимость от кассира и оставьте операторам только исключения.',
    },
    {
      icon: 'shield',
      title: 'Защита выручки',
      description: 'Каждый проезд фиксируется, а при сбое HGS система переводит водителя на другой канал оплаты.',
    },
    {
      icon: 'pie',
      title: 'Отчетность для управления',
      description: 'Контролируйте сборы по типу оплаты, дате, шлагбауму и исключениям из одной панели.',
    },
  ],
  flowTitle: 'Как это работает',
  flowSteps: [
    { step: '1', title: 'Распознавание автомобиля', description: 'Данные HGS и номерного знака сопоставляются на въезде или выезде.' },
    { step: '2', title: 'Выбор сценария', description: 'Система определяет, применять HGS, POS, QR или абонементную логику.' },
    { step: '3', title: 'Автоматическое списание', description: 'Оплата принимается, а транзакция мгновенно попадает в онлайн-отчеты.' },
    { step: '4', title: 'Открытие шлагбаума', description: 'Шлагбаум открывается, а исключения остаются видимыми для удаленного контроля.' },
  ],
  sectorsTitle: 'Для кого это подходит?',
  sectors: [
    { icon: 'mall', label: 'Торговые центры' },
    { icon: 'home', label: 'Жилые комплексы' },
    { icon: 'hospital', label: 'Больницы и кампусы' },
    { icon: 'city', label: 'Муниципальные парковки' },
    { icon: 'brief', label: 'Бизнес-центры' },
    { icon: 'truck', label: 'Коммерческие парковки' },
  ],
  ctaTitle: 'Готовы перевести парковку на безлюдную модель с HGS в основе?',
  ctaDescription: 'Подберем архитектуру HGS, POS, QR, киосков, шлагбаумов и отчетности под вашу интенсивность движения.',
  ctaPrimary: 'Получить предложение',
  ctaSecondary: 'Связаться',
}

const tr: HgsCopy = {
  metaTitle: 'HGS ile İnsansız Otopark Sistemi | Visiosoft',
  metaDescription:
    'HGS, POS, QR ve canlı raporlama ile insansız otopark akışı kurun. Geçişleri hızlandırın, geliri koruyun, personel maliyetini düşürün.',
  eyebrow: 'HGS İLE İNSANSIZ OTOPARK',
  title: 'Maksimum gelir. Minimum bekleme.',
  subtitle:
    'Araçları HGS ile tanıyın, ödemeyi otomatik alın, gerektiğinde POS veya QR senaryosuna geçin. Tüm otopark akışını tek kontrol katmanından yönetin.',
  primaryCta: 'Teklif Al',
  secondaryCta: 'Ücretsiz Keşif',
  heroHighlights: [
    { icon: 'barrier', label: 'Temassız giriş ve çıkış' },
    { icon: 'layers', label: 'HGS + POS + QR ödeme akışı' },
    { icon: 'chart', label: 'Gelir kaybı riskini azaltın' },
  ],
  heroPanelTitle: 'Ödeme Matrisi',
  liveLabel: 'Canlı',
  heroPanelRows: [
    { label: 'HGS', description: 'Etiketli araçlar için ilk tercih otomatik tahsilat' },
    { label: 'POS', description: 'HGS bakiyesi yoksa kart veya temassız yedek ödeme' },
    { label: 'QR', description: 'Sürücünün telefonundan tamamlanan mobil ödeme akışı' },
  ],
  heroStats: [
    { value: 'Tek Panel', label: 'Geçiş, ödeme ve istisna yönetimi birlikte' },
    { value: '7/24', label: 'Uzaktan izleme ve müdahale hazır' },
    { value: 'Nakit Yok', label: 'İnsansız işletime uygun kurgu' },
  ],
  outcomes: ['Bekleme yok', 'Sabit gişe bağımlılığı yok', 'Tahsilatta kör nokta yok'],
  paymentTitle: 'Ödeme yöntemlerini tek bir insansız akışta birleştirin',
  paymentIntro:
    'HGS en hızlı kanalınız olsun, ama tek kanalınız olmasın. Güçlü otopark deneyimi, farklı ödeme senaryolarını aynı operasyon içinde yedekli şekilde yürütür.',
  paymentMethods: [
    {
      icon: 'wifi',
      title: 'HGS ile otomatik tahsilat',
      description: 'HGS etiketi olan araçlar anında tanınır, manuel işlem olmadan ödeme tamamlanır.',
    },
    {
      icon: 'card',
      title: 'POS ve temassız kart',
      description: 'HGS uygun değilse sürücü kiosk veya çıkış noktasında kart ile işlemi tamamlar.',
    },
    {
      icon: 'qr',
      title: 'QR ve mobil ödeme',
      description: 'Sürücü cep telefonundan öder, sonuç operatör paneline ve raporlara anında düşer.',
    },
    {
      icon: 'building',
      title: 'Abonelik ve filo senaryoları',
      description: 'Site sakinleri, personel, kiracılar ve kurumsal filolar için kurallı geçiş ve toplu faturalama yönetilir.',
    },
  ],
  advantagesTitle: 'HGS insansız otoparkta neden fark yaratır?',
  advantagesIntro:
    'HGS katmanı sadece bariyeri hızlandırmaz; gelir operasyonundaki manuel yükü, itirazları ve işlem süresini de azaltır.',
  advantages: [
    {
      icon: 'gauge',
      title: 'Daha hızlı araç akışı',
      description: 'Yoğun saatlerde dur-kalkı azaltır, aynı şeritten daha fazla araç geçirmenizi sağlar.',
    },
    {
      icon: 'user',
      title: 'Daha düşük personel yükü',
      description: 'Sürekli gişe personeli ihtiyacını azaltır, ekibi sadece istisna yönetimine yönlendirir.',
    },
    {
      icon: 'shield',
      title: 'Geliri koruyan akış',
      description: 'Her geçiş kayıt altına alınır; HGS başarısızsa sistem başka ödeme kanalına yönlendirir.',
    },
    {
      icon: 'pie',
      title: 'Yönetilebilir raporlama',
      description: 'Tahsilatı ödeme tipine, tarihe, bariyere ve istisnaya göre tek panelden analiz edin.',
    },
  ],
  flowTitle: 'Nasıl çalışır?',
  flowSteps: [
    { step: '1', title: 'Araç tanıma', description: 'HGS ve plaka verisi girişte veya çıkışta eşleştirilir.' },
    { step: '2', title: 'Senaryo seçimi', description: 'Sistem HGS, POS, QR veya abonelik mantığını otomatik belirler.' },
    { step: '3', title: 'Tahsilat', description: 'Ödeme alınır ve işlem canlı raporlara anında işlenir.' },
    { step: '4', title: 'Bariyer açılışı', description: 'Bariyer açılır, istisnalar uzaktan takip için görünür kalır.' },
  ],
  sectorsTitle: 'Kimler için ideal?',
  sectors: [
    { icon: 'mall', label: 'AVM otoparkları' },
    { icon: 'home', label: 'Site ve rezidanslar' },
    { icon: 'hospital', label: 'Hastane ve kampüsler' },
    { icon: 'city', label: 'Belediye otoparkları' },
    { icon: 'brief', label: 'İş merkezleri' },
    { icon: 'truck', label: 'Ticari otopark işletmeleri' },
  ],
  ctaTitle: 'Otoparkınızı HGS merkezli insansız sisteme dönüştürmeye hazır mısınız?',
  ctaDescription: 'HGS, POS, QR, kiosk, bariyer ve raporlama katmanlarını trafik modelinize göre birlikte kurgulayalım.',
  ctaPrimary: 'Teklif Al',
  ctaSecondary: 'İletişim',
}

export function hgsCopy(): HgsCopy {
  return tr
}

void _en
void _ru
