type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'facts'; items: { label: string; value: string }[] }

export type LegalPage = {
  title: string
  description: string
  updated?: boolean
  blocks: LegalBlock[]
}

export const legalPages: Record<string, LegalPage> = {
  'legal.privacy': {
    title: 'Gizlilik Politikası',
    description: 'Visiosoft Teknoloji A.Ş. Gizlilik Politikası.',
    updated: true,
    blocks: [
      { type: 'h2', text: '1. Giriş' },
      {
        type: 'p',
        text: 'Visiosoft Teknoloji A.Ş. olarak gizliliğinize önem veriyoruz. Bu Gizlilik Politikası, web sitemizi ve hizmetlerimizi kullandığınızda verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.',
      },
      { type: 'h2', text: '2. Toplanan Veriler' },
      { type: 'p', text: 'Hizmetlerimizi sağlamak ve geliştirmek için aşağıdaki türde bilgileri toplayabiliriz:' },
      {
        type: 'ul',
        items: [
          'Kişisel bilgiler (Ad, e-posta adresi, telefon numarası vb.)',
          'Kullanım verileri ve çerezler',
          'Teknik veriler (IP adresi, tarayıcı türü vb.)',
        ],
      },
      { type: 'h2', text: '3. Verilerin Kullanımı' },
      { type: 'p', text: 'Topladığımız verileri şu amaçlarla kullanıyoruz:' },
      {
        type: 'ul',
        items: [
          'Hizmetlerimizi sunmak ve sürdürmek',
          'Müşteri desteği sağlamak',
          'Hizmetlerimizi analiz etmek ve geliştirmek',
          'Yasal yükümlülüklere uymak',
        ],
      },
      { type: 'h2', text: '4. Veri Güvenliği' },
      {
        type: 'p',
        text: 'Verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri uyguluyoruz. Ancak, internet üzerinden yapılan hiçbir iletimin %100 güvenli olmadığını unutmayın.',
      },
      { type: 'h2', text: '5. İletişim' },
      {
        type: 'p',
        text: 'Gizlilik politikamızla ilgili sorularınız için info@visiosoft.com.tr adresinden bizimle iletişime geçebilirsiniz.',
      },
    ],
  },
  'legal.terms': {
    title: 'Kullanım Şartları',
    description: 'Visiosoft Teknoloji A.Ş. Kullanım Şartları.',
    updated: true,
    blocks: [
      { type: 'h2', text: '1. Kabul' },
      {
        type: 'p',
        text: 'Bu web sitesine erişerek ve kullanarak, bu Kullanım Şartlarını kabul etmiş olursunuz. Bu şartları kabul etmiyorsanız, lütfen sitemizi kullanmayın.',
      },
      { type: 'h2', text: '2. Hizmetlerin Kullanımı' },
      {
        type: 'p',
        text: 'Sitemizi ve hizmetlerimizi yalnızca yasal amaçlarla ve bu şartlara uygun olarak kullanmayı kabul edersiniz. Sitemizin güvenliğini ihlal etmemeyi veya diğer kullanıcıların erişimini engellememeyi taahhüt edersiniz.',
      },
      { type: 'h2', text: '3. Fikri Mülkiyet' },
      {
        type: 'p',
        text: "Bu sitedeki tüm içerik (metinler, grafikler, logolar, görseller vb.) Visiosoft Teknoloji A.Ş.'nin mülkiyetindedir ve telif hakkı yasalarıyla korunmaktadır.",
      },
      { type: 'h2', text: '4. Sorumluluk Reddi' },
      { type: 'p', text: 'Hizmetlerimiz "olduğu gibi" sunulmaktadır. Visiosoft, hizmetlerin kesintisiz veya hatasız olacağını garanti etmez.' },
      { type: 'h2', text: '5. Değişiklikler' },
      {
        type: 'p',
        text: 'Bu şartları zaman zaman güncelleme hakkımız saklıdır. Değişiklikler bu sayfada yayınlandığı andan itibaren geçerli olacaktır.',
      },
    ],
  },
  'legal.sales': {
    title: 'Satış ve İadeler',
    description: 'Visiosoft Teknoloji A.Ş. Satış ve İade Politikası.',
    blocks: [
      { type: 'h2', text: 'Satış Politikası' },
      {
        type: 'p',
        text: 'Visiosoft ürün ve hizmetlerinin satışı, taraflar arasında imzalanan sözleşmelere ve teklif formlarına tabidir. Fiyatlar ve ödeme koşulları, teklif aşamasında belirtilir.',
      },
      { type: 'h2', text: 'İade ve İptal' },
      { type: 'p', text: 'Yazılım ürünleri ve lisanslamalar, doğası gereği iade edilemez. Donanım ürünlerinde ise, üretim hatası olması durumunda garanti koşulları geçerlidir.' },
      { type: 'p', text: 'Özel projeler ve hizmetler için iptal koşulları, ilgili hizmet sözleşmesinde belirtilen şartlara göre belirlenir.' },
      { type: 'h2', text: 'Garanti' },
      {
        type: 'p',
        text: 'Donanım ürünlerimiz, aksi belirtilmedikçe 2 yıl üretici garantisi altındadır. Yazılım ürünlerimiz için bakım ve destek anlaşmaları kapsamında hizmet verilmektedir.',
      },
      { type: 'h2', text: 'İletişim' },
      {
        type: 'p',
        text: 'Satış ve iade ile ilgili sorularınız için satış temsilcinizle veya info@visiosoft.com.tr adresi üzerinden bizimle iletişime geçebilirsiniz.',
      },
    ],
  },
  'legal.distance-sales': {
    title: 'Mesafeli Satış Sözleşmesi',
    description: 'Visiosoft Teknoloji A.Ş. Mesafeli Satış Sözleşmesi.',
    updated: true,
    blocks: [
      { type: 'h2', text: '1. Taraflar' },
      {
        type: 'p',
        text: 'Bu sözleşme, VİSİOSOFT TEKNOLOJİ A.Ş. (Satıcı) ile internet sitesi üzerinden sipariş veren müşteri (Alıcı) arasında elektronik ortamda kurulmuştur.',
      },
      { type: 'h2', text: '2. Konu' },
      {
        type: 'p',
        text: "İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden sipariş verdiği ürün ve/veya hizmetlerin satışı, teslimi ve kullanım koşullarına ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.",
      },
      { type: 'h2', text: '3. Sipariş ve Ödeme' },
      {
        type: 'p',
        text: 'Alıcı, sipariş sırasında beyan ettiği bilgilerin doğru olduğunu kabul eder. Ürün/hizmet bedeli, ödeme ekranında seçilen yöntem ile tahsil edilir ve sipariş onayı sonrası süreç başlatılır.',
      },
      { type: 'h2', text: '4. Teslimat ve İfa' },
      {
        type: 'p',
        text: 'Dijital ürün ve yazılım hizmetlerinde teslimat, elektronik ortamda erişim sağlanması veya hesap aktivasyonu ile gerçekleştirilir. Fiziksel ürünler için teslimat süresi ve koşulları sipariş özetinde belirtilir.',
      },
      { type: 'h2', text: '5. Cayma Hakkı' },
      {
        type: 'p',
        text: 'Alıcı, mevzuat kapsamında cayma hakkına sahiptir. Ancak elektronik ortamda anında ifa edilen hizmetler, lisans anahtarı teslim edilen yazılımlar ve kişiye/kuruma özel hazırlanan ürün-hizmetler için cayma hakkı mevzuatta öngörülen istisnalar kapsamında sınırlı olabilir.',
      },
      { type: 'h2', text: '6. Uyuşmazlıkların Çözümü' },
      {
        type: 'p',
        text: 'İşbu sözleşmeden doğabilecek uyuşmazlıklarda, yürürlükteki Türk hukuku uygulanır. Taraflar, ilgili tüketici hakem heyetleri ve tüketici mahkemelerinin yetkisini kabul eder.',
      },
      { type: 'h2', text: '7. İletişim' },
      {
        type: 'p',
        text: 'Mesafeli satış sözleşmesi ile ilgili sorularınız için info@visiosoft.com.tr adresinden bizimle iletişime geçebilirsiniz.',
      },
    ],
  },
  'legal.return-policy': {
    title: 'İade Politikası',
    description: 'Visiosoft Teknoloji A.Ş. İade Politikası.',
    updated: true,
    blocks: [
      { type: 'h2', text: '1. Genel Esaslar' },
      {
        type: 'p',
        text: 'İade talepleri, sipariş türü (yazılım, hizmet, donanım) ve sözleşme kapsamına göre değerlendirilir. Alıcı, iade talebini yazılı olarak iletmelidir.',
      },
      { type: 'h2', text: '2. Yazılım ve Dijital Hizmetler' },
      {
        type: 'p',
        text: 'Lisans anahtarı teslim edilmiş, hesap aktivasyonu tamamlanmış veya ifasına başlanmış dijital ürün/hizmetlerde iade, ilgili mevzuat istisnaları ve sözleşme hükümleri doğrultusunda değerlendirilir.',
      },
      { type: 'h2', text: '3. Donanım Ürünleri' },
      {
        type: 'p',
        text: 'Donanım ürünlerinde iade; ürünün kullanılmamış, hasarsız ve orijinal ambalajı ile birlikte olması şartına bağlıdır. Üretim hatası veya arıza durumunda garanti süreçleri ayrıca işletilir.',
      },
      { type: 'h2', text: '4. İade Süreci' },
      {
        type: 'ul',
        items: [
          'İade talebi e-posta ile iletilir.',
          'Talep, sözleşme ve ürün/hizmet tipi açısından incelenir.',
          "Uygun bulunan iadelerde onay bilgisi Alıcı'ya yazılı olarak iletilir.",
          "İade onayı sonrası bedel, ödeme yöntemi dikkate alınarak mevzuata uygun sürede Alıcı'ya iade edilir.",
        ],
      },
      { type: 'h2', text: '5. İstisnalar' },
      {
        type: 'p',
        text: 'Kişiye veya kuruma özel üretilen/uyarlanan ürünler, kurulum ve entegrasyon hizmetleri ile anında ifa edilen dijital hizmetler için iade hakkı mevzuat ve sözleşme kapsamındaki istisnalara tabi olabilir.',
      },
      { type: 'h2', text: '6. İletişim' },
      { type: 'p', text: 'İade süreçleriyle ilgili talepleriniz için info@visiosoft.com.tr adresine yazabilirsiniz.' },
    ],
  },
  'legal.legal': {
    title: 'Yasal Bilgiler',
    description: 'Visiosoft Teknoloji A.Ş. Yasal Bilgiler.',
    blocks: [
      { type: 'h2', text: 'Şirket Bilgileri' },
      {
        type: 'facts',
        items: [
          { label: 'Unvan', value: 'VİSİOSOFT TEKNOLOJİ ANONİM ŞİRKETİ' },
          { label: 'Adres', value: 'Yıldız Teknik Üniversitesi İkitelli Teknopark 1B24-C 34490 Başakşehir / İstanbul' },
          { label: 'Vergi Dairesi', value: 'İKİTELLİ' },
          { label: 'Vergi No', value: '9251021443' },
          { label: 'Mersis No', value: '0925102144300001' },
          { label: 'E-posta', value: 'info@visiosoft.com.tr' },
        ],
      },
      { type: 'h2', text: 'Telif Hakları' },
      {
        type: 'p',
        text: "Bu web sitesindeki tüm içerik, tasarım, logo ve yazılımlar Visiosoft Teknoloji A.Ş.'ye aittir ve uluslararası telif hakkı yasaları ile korunmaktadır. İzinsiz kullanımı yasaktır.",
      },
    ],
  },
}
