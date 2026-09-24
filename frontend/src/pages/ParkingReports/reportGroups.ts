import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

export type ReportGroup = {
  anchor: string
  label: string
  short: string
  icon: FeatureIconName
  headline: string
  summary: string
  items: { title: string; description: string }[]
}

export const reportGroups: ReportGroup[] = [
  {
    anchor: 'operasyonel',
    label: 'Operasyonel Raporlar',
    short: 'Operasyonel',
    icon: 'camera',
    headline: 'Saha trafiğini net ve hızlı takip edin.',
    summary: 'Giriş-çıkış, doluluk ve geçiş verilerini tek ekranda görün.',
    items: [
      { title: 'Günlük / Aylık / Tarih Aralıklı Giriş-Çıkış Raporu', description: 'Seçtiğiniz dönem için giriş-çıkış adetlerini gösterir.' },
      { title: 'Anlık Otopark Doluluk Raporu', description: 'Anlık dolu, boş ve toplam kapasite bilgisini sunar.' },
      { title: 'Saatlik Yoğunluk Analizi', description: 'Saat bazında yoğun saatleri net şekilde çıkarır.' },
      { title: 'Kapı / Bariyer Bazlı Geçiş Raporu', description: 'Kapı ve bariyer bazında geçiş sayılarını listeler.' },
      { title: 'Kamera Bazlı Geçiş Kayıtları', description: 'Kamera tespit kayıtlarını zaman bilgisiyle gösterir.' },
      { title: 'Beyaz Liste / Kara Liste Geçiş Raporu', description: 'Beyaz ve kara liste geçişlerini ayrı raporlar.' },
      { title: 'HGS İşlem Raporu', description: 'HGS işlemlerini ve hatalı kayıtları raporlar.' },
      {
        title: 'Ortalama Oturum Süresi Raporu',
        description: 'Araçların otoparkta ortalama ne kadar kaldığını gösterir; tarife ve kapasite planlamasında kullanılır.',
      },
    ],
  },
  {
    anchor: 'finansal',
    label: 'Finansal Raporlar',
    short: 'Finansal',
    icon: 'invoice',
    headline: 'Gelir ve tahsilatı sade raporlarla izleyin.',
    summary: 'Ciro, ödeme tipleri ve iadeleri kolayca kontrol edin.',
    items: [
      { title: 'Günlük Ciro Raporu', description: 'Günlük toplam cironuzu özetler.' },
      { title: 'Tarih Aralıklı Gelir Raporu', description: 'Seçilen dönem için toplam geliri gösterir.' },
      { title: 'Ödeme Yöntemine Göre Tahsilat Raporu (HGS / POS / Nakit vb.)', description: 'Tahsilatları ödeme türüne göre ayırır.' },
      { title: 'Ücretlendirme Tarifesi Bazlı Gelir Raporu', description: 'Tarife bazında gelir dağılımını sunar.' },
      { title: 'Abonelik Gelir Raporu', description: 'Abonelik gelirlerini dönemsel olarak gösterir.' },
      { title: 'İade Raporu', description: 'İade işlemlerini tutar ve zaman bilgisiyle listeler.' },
      { title: 'Borç / Alacak Raporu', description: 'Borç ve alacak durumunu özetler.' },
    ],
  },
  {
    anchor: 'abonelik',
    label: 'Abonelik ve Müşteri Raporları',
    short: 'Abonelik',
    icon: 'users',
    headline: 'Aboneleri ve paketleri tek yerden yönetin.',
    summary: 'Durum, kullanım ve satış eğilimlerini kolayca izleyin.',
    items: [
      { title: 'Aktif / Pasif Abonelik Listesi', description: 'Aktif, pasif ve süresi dolan aboneleri listeler.' },
      { title: 'Abonelik Başlangıç-Bitiş Raporu', description: 'Abonelik başlangıç ve bitiş tarihlerini gösterir.' },
      { title: 'Abone Kullanım Raporu', description: 'Abonelerin kullanım sıklığını ve alışkanlıklarını raporlar.' },
      { title: 'Paket Satış Raporu', description: 'Paket satış adet ve gelirini gösterir.' },
    ],
  },
]
