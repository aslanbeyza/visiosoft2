import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Locale } from '../../lib/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import BarrierStrip from './scene/BarrierStrip.tsx'
import GateCamera from './scene/GateCamera.tsx'
import KioskPanel from './scene/KioskPanel.tsx'
import LedBoard from './scene/LedBoard.tsx'
import { useParkingSequence } from './scene/timeline.ts'
import type { ScenePhase } from './scene/timeline.ts'

const easeApple = [0.25, 1, 0.5, 1] as const
const easeOut = [0.16, 1, 0.3, 1] as const

const PLATE = '34 EUU 483'
const PLATE_COMPACT = '34EUU483'
const DURATION = '01:12'

type SceneCopy = {
  camera: string
  live: string
  status: Record<ScenePhase, string>
  barrierClosed: string
  barrierOpen: string
  confidence: string
  occupancy: string
  accuracy: string
  ledTitle: string
  ledTime: string
  ledPrice: string
  ledRows: { time: string; price: string }[]
  ledLines: Record<ScenePhase, [string, string, string]>
  ledSign: Record<ScenePhase, [string, string, string]>
  barrier: {
    barrier: string
    closed: string
    opening: string
    open: string
    loop: string
    loopBusy: string
    loopFree: string
    cycle: string
    cycleValue: string
  }
  kiosk: {
    title: string
    plateRead: string
    statusLabel: string
    farewell: string
    entry: string
    exit: string
    duration: string
    total: string
    tapCard: string
    processing: string
    approved: string
    receipt: string
    waiting: string
    inCar: string
    methods: string
  }
  cameraId: string
  kioskTag: string
  amount: string
}

type HeroCopy = {
  badge: string
  titleTop: string
  titleAccent: string
  titleBottom: string
  description: string
  primary: string
  secondary: string
  stats: { value: number; decimals: number; suffix: string; label: string }[]
  scene: SceneCopy
}

const copy: Record<Locale, HeroCopy> = {
  tr: {
    badge: 'Yapay zekâ destekli plaka tanıma',
    titleTop: 'Otoparkınızı',
    titleAccent: 'akıllı teknolojiyle',
    titleBottom: 'yönetin.',
    description:
      'Visiosoft; plaka tanıma, kiosk ödeme ve bariyer otomasyonunu tek platformda birleştirir. Personelsiz çalışır, kaçağı sıfırlar, gelirinizi anlık görünür kılar.',
    primary: 'Teklif Al',
    secondary: 'Çözümleri Keşfet',
    stats: [
      { value: 99.9, decimals: 1, suffix: '%', label: 'plaka tanıma doğruluğu' },
      { value: 0.3, decimals: 1, suffix: ' sn', label: 'ortalama geçiş süresi' },
      { value: 400, decimals: 0, suffix: '+', label: 'aktif otopark sahası' },
      { value: 24, decimals: 0, suffix: '/7', label: 'izleme ve destek' },
    ],
    scene: {
      camera: 'TOGER 4K · ÇIKIŞ KAPISI 02',
      live: 'CANLI',
      status: {
        approach: 'Araç sensörü tetiklendi',
        scan: 'Plaka taranıyor…',
        locked: 'Plaka doğrulandı',
        kiosk: 'Kiosk ödemesi bekleniyor',
        paying: 'Ödeme alınıyor…',
        paid: 'Ödeme alındı',
        open: 'Bariyer açıldı',
        pass: 'Çıkış tamamlandı',
        closing: 'Bariyer kapanıyor',
      },
      barrierClosed: 'BARİYER KAPALI',
      barrierOpen: 'BARİYER AÇIK',
      confidence: 'güven',
      occupancy: 'Doluluk',
      accuracy: 'Doğruluk',
      ledTitle: 'Otopark Tarifesi',
      ledTime: 'Süre',
      ledPrice: 'Ücret',
      ledRows: [
        { time: '1 Saat', price: '120 TL' },
        { time: '2 Saat', price: '200 TL' },
        { time: '3 Saat', price: '300 TL' },
        { time: '3-6 Saat', price: '500 TL' },
        { time: '24 Saat', price: '750 TL' },
      ],
      ledLines: {
        approach: ['ARAC ALGILANDI', 'LUTFEN', 'BEKLEYINIZ'],
        scan: ['PLAKA', 'OKUNUYOR', '. . .'],
        locked: [PLATE_COMPACT, `SURE ${DURATION}`, 'CIKIS 02'],
        kiosk: [PLATE_COMPACT, '200 TL', 'ODEME BEKLIYOR'],
        paying: [PLATE_COMPACT, '200 TL', 'ISLENIYOR'],
        paid: [PLATE_COMPACT, '200 TL', 'ODENDI'],
        open: [PLATE_COMPACT, 'BARIYER ACIK', 'IYI YOLCULUKLAR'],
        pass: [PLATE_COMPACT, 'CIKIS ONAYLI', 'IYI YOLCULUKLAR'],
        closing: [PLATE_COMPACT, 'ODENDI', 'TESEKKURLER'],
      },
      ledSign: {
        approach: ['ARAÇ ALGILANDI', 'LÜTFEN', 'BEKLEYİNİZ'],
        scan: ['PLAKA', 'OKUNUYOR', '. . .'],
        locked: ['PLAKA TANINDI', PLATE, 'ÇIKIŞ KAPISI 02'],
        kiosk: ['ÜCRET 200 TL', 'ÖDEME', 'BEKLENİYOR'],
        paying: ['ÖDEME ALINIYOR', 'LÜTFEN', 'BEKLEYİNİZ'],
        paid: ['PLAKA TANINDI', 'ÖDEME ALINDI', 'İYİ YOLCULUKLAR'],
        open: ['BARİYER AÇILDI', 'GEÇEBİLİRSİNİZ', 'İYİ YOLCULUKLAR'],
        pass: ['ÇIKIŞ TAMAMLANDI', 'TEŞEKKÜRLER', 'İYİ YOLCULUKLAR'],
        closing: ['BARİYER KAPANIYOR', 'TEŞEKKÜRLER', 'İYİ YOLCULUKLAR'],
      },
      barrier: {
        barrier: 'Bariyer',
        closed: 'Kapalı',
        opening: 'Açılıyor',
        open: 'Açık',
        loop: 'Loop dedektör',
        loopBusy: 'Araç var',
        loopFree: 'Boş',
        cycle: 'Açılma süresi',
        cycleValue: '0,8 sn',
      },
      kiosk: {
        title: 'Kiosk · Ödeme',
        plateRead: 'Plaka okundu',
        statusLabel: 'Durum',
        farewell: 'İyi yolculuklar',
        entry: 'Giriş',
        exit: 'Çıkış',
        duration: 'Süre',
        total: 'Toplam tutar',
        tapCard: 'Kartınızı okutunuz',
        processing: 'Ödeme işleniyor…',
        approved: 'ÖDEME ALINDI',
        receipt: 'Fiş yazdırılıyor · e-Arşiv gönderildi',
        waiting: 'Araç bekleniyor',
        inCar: 'Araçtan inmeden ödeme',
        methods: 'Temassız kart · QR · HGS',
      },
      cameraId: '020-1-C',
      kioskTag: 'Kiosk',
      amount: '200,00 ₺',
    },
  },
  en: {
    badge: 'AI powered license plate recognition',
    titleTop: 'Run your parking',
    titleAccent: 'on smart technology',
    titleBottom: 'end to end.',
    description:
      'Visiosoft brings plate recognition, kiosk payment and barrier automation into one platform. It runs without staff, eliminates leakage and makes your revenue visible in real time.',
    primary: 'Get a Quote',
    secondary: 'Explore Solutions',
    stats: [
      { value: 99.9, decimals: 1, suffix: '%', label: 'plate recognition accuracy' },
      { value: 0.3, decimals: 1, suffix: ' s', label: 'average passage time' },
      { value: 400, decimals: 0, suffix: '+', label: 'active parking sites' },
      { value: 24, decimals: 0, suffix: '/7', label: 'monitoring and support' },
    ],
    scene: {
      camera: 'TOGER 4K · EXIT GATE 02',
      live: 'LIVE',
      status: {
        approach: 'Loop detector triggered',
        scan: 'Scanning plate…',
        locked: 'Plate verified',
        kiosk: 'Waiting for kiosk payment',
        paying: 'Taking payment…',
        paid: 'Payment received',
        open: 'Barrier opened',
        pass: 'Exit completed',
        closing: 'Barrier closing',
      },
      barrierClosed: 'BARRIER CLOSED',
      barrierOpen: 'BARRIER OPEN',
      confidence: 'confidence',
      occupancy: 'Occupancy',
      accuracy: 'Accuracy',
      ledTitle: 'Parking Tariff',
      ledTime: 'Duration',
      ledPrice: 'Fee',
      ledRows: [
        { time: '1 Hour', price: '120 TL' },
        { time: '2 Hours', price: '200 TL' },
        { time: '3 Hours', price: '300 TL' },
        { time: '3-6 Hours', price: '500 TL' },
        { time: '24 Hours', price: '750 TL' },
      ],
      ledLines: {
        approach: ['VEHICLE DETECTED', 'PLEASE', 'WAIT'],
        scan: ['READING', 'PLATE', '. . .'],
        locked: [PLATE_COMPACT, `TIME ${DURATION}`, 'EXIT 02'],
        kiosk: [PLATE_COMPACT, '200 TL', 'AWAITING PAYMENT'],
        paying: [PLATE_COMPACT, '200 TL', 'PROCESSING'],
        paid: [PLATE_COMPACT, '200 TL', 'PAID'],
        open: [PLATE_COMPACT, 'BARRIER OPEN', 'SAFE JOURNEY'],
        pass: [PLATE_COMPACT, 'EXIT APPROVED', 'SAFE JOURNEY'],
        closing: [PLATE_COMPACT, 'PAID', 'THANK YOU'],
      },
      ledSign: {
        approach: ['VEHICLE DETECTED', 'PLEASE', 'WAIT'],
        scan: ['READING', 'PLATE', '. . .'],
        locked: ['PLATE RECOGNISED', PLATE, 'EXIT GATE 02'],
        kiosk: ['FEE 200 TL', 'AWAITING', 'PAYMENT'],
        paying: ['TAKING PAYMENT', 'PLEASE', 'WAIT'],
        paid: ['PLATE RECOGNISED', 'PAYMENT RECEIVED', 'SAFE JOURNEY'],
        open: ['BARRIER OPEN', 'YOU MAY PROCEED', 'SAFE JOURNEY'],
        pass: ['EXIT COMPLETED', 'THANK YOU', 'SAFE JOURNEY'],
        closing: ['BARRIER CLOSING', 'THANK YOU', 'SAFE JOURNEY'],
      },
      barrier: {
        barrier: 'Barrier',
        closed: 'Closed',
        opening: 'Opening',
        open: 'Open',
        loop: 'Loop detector',
        loopBusy: 'Occupied',
        loopFree: 'Clear',
        cycle: 'Open time',
        cycleValue: '0.8 s',
      },
      kiosk: {
        title: 'Kiosk · Payment',
        plateRead: 'Plate read',
        statusLabel: 'Status',
        farewell: 'Safe journey',
        entry: 'Entry',
        exit: 'Exit',
        duration: 'Duration',
        total: 'Total due',
        tapCard: 'Tap your card',
        processing: 'Processing payment…',
        approved: 'PAYMENT RECEIVED',
        receipt: 'Printing receipt · e-invoice sent',
        waiting: 'Waiting for vehicle',
        inCar: 'Pay without leaving the car',
        methods: 'Contactless · QR · HGS',
      },
      cameraId: '020-1-C',
      kioskTag: 'Kiosk',
      amount: '200.00 ₺',
    },
  },
  ru: {
    badge: 'Распознавание номеров на базе ИИ',
    titleTop: 'Управляйте парковкой',
    titleAccent: 'умными технологиями',
    titleBottom: 'от въезда до оплаты.',
    description:
      'Visiosoft объединяет распознавание номеров, оплату через киоск и автоматику шлагбаума в одной платформе. Работает без персонала, исключает потери и показывает доход в реальном времени.',
    primary: 'Получить предложение',
    secondary: 'Смотреть решения',
    stats: [
      { value: 99.9, decimals: 1, suffix: '%', label: 'точность распознавания' },
      { value: 0.3, decimals: 1, suffix: ' с', label: 'среднее время проезда' },
      { value: 400, decimals: 0, suffix: '+', label: 'объектов парковки' },
      { value: 24, decimals: 0, suffix: '/7', label: 'мониторинг и поддержка' },
    ],
    scene: {
      camera: 'TOGER 4K · ВЫЕЗД 02',
      live: 'ОНЛАЙН',
      status: {
        approach: 'Сработал датчик петли',
        scan: 'Сканирование номера…',
        locked: 'Номер подтверждён',
        kiosk: 'Ожидание оплаты в киоске',
        paying: 'Приём оплаты…',
        paid: 'Оплата принята',
        open: 'Шлагбаум открыт',
        pass: 'Выезд завершён',
        closing: 'Шлагбаум закрывается',
      },
      barrierClosed: 'ШЛАГБАУМ ЗАКРЫТ',
      barrierOpen: 'ШЛАГБАУМ ОТКРЫТ',
      confidence: 'уверенность',
      occupancy: 'Заполненность',
      accuracy: 'Точность',
      ledTitle: 'Тариф парковки',
      ledTime: 'Время',
      ledPrice: 'Цена',
      ledRows: [
        { time: '1 час', price: '120 TL' },
        { time: '2 часа', price: '200 TL' },
        { time: '3 часа', price: '300 TL' },
        { time: '3-6 часов', price: '500 TL' },
        { time: '24 часа', price: '750 TL' },
      ],
      ledLines: {
        approach: ['АВТО ОБНАРУЖЕНО', 'ПОЖАЛУЙСТА', 'ПОДОЖДИТЕ'],
        scan: ['ЧТЕНИЕ', 'НОМЕРА', '. . .'],
        locked: [PLATE_COMPACT, `ВРЕМЯ ${DURATION}`, 'ВЫЕЗД 02'],
        kiosk: [PLATE_COMPACT, '200 TL', 'ОЖИДАНИЕ ОПЛАТЫ'],
        paying: [PLATE_COMPACT, '200 TL', 'ОБРАБОТКА'],
        paid: [PLATE_COMPACT, '200 TL', 'ОПЛАЧЕНО'],
        open: [PLATE_COMPACT, 'ШЛАГБАУМ ОТКРЫТ', 'СЧАСТЛИВОГО ПУТИ'],
        pass: [PLATE_COMPACT, 'ВЫЕЗД РАЗРЕШЁН', 'СЧАСТЛИВОГО ПУТИ'],
        closing: [PLATE_COMPACT, 'ОПЛАЧЕНО', 'СПАСИБО'],
      },
      ledSign: {
        approach: ['АВТО ОБНАРУЖЕНО', 'ПОЖАЛУЙСТА', 'ПОДОЖДИТЕ'],
        scan: ['ЧТЕНИЕ', 'НОМЕРА', '. . .'],
        locked: ['НОМЕР РАСПОЗНАН', PLATE, 'ВЫЕЗД 02'],
        kiosk: ['СУММА 200 TL', 'ОЖИДАНИЕ', 'ОПЛАТЫ'],
        paying: ['ПРИЁМ ОПЛАТЫ', 'ПОЖАЛУЙСТА', 'ПОДОЖДИТЕ'],
        paid: ['НОМЕР РАСПОЗНАН', 'ОПЛАТА ПРИНЯТА', 'СЧАСТЛИВОГО ПУТИ'],
        open: ['ШЛАГБАУМ ОТКРЫТ', 'МОЖЕТЕ ПРОЕХАТЬ', 'СЧАСТЛИВОГО ПУТИ'],
        pass: ['ВЫЕЗД ЗАВЕРШЁН', 'СПАСИБО', 'СЧАСТЛИВОГО ПУТИ'],
        closing: ['ШЛАГБАУМ ЗАКРЫВАЕТСЯ', 'СПАСИБО', 'СЧАСТЛИВОГО ПУТИ'],
      },
      barrier: {
        barrier: 'Шлагбаум',
        closed: 'Закрыт',
        opening: 'Открывается',
        open: 'Открыт',
        loop: 'Петлевой датчик',
        loopBusy: 'Занят',
        loopFree: 'Свободен',
        cycle: 'Время открытия',
        cycleValue: '0,8 с',
      },
      kiosk: {
        title: 'Киоск · Оплата',
        plateRead: 'Номер считан',
        statusLabel: 'Статус',
        farewell: 'Счастливого пути',
        entry: 'Въезд',
        exit: 'Выезд',
        duration: 'Время',
        total: 'К оплате',
        tapCard: 'Приложите карту',
        processing: 'Обработка оплаты…',
        approved: 'ОПЛАТА ПРИНЯТА',
        receipt: 'Печать чека · э-квитанция отправлена',
        waiting: 'Ожидание автомобиля',
        inCar: 'Оплата не выходя из авто',
        methods: 'Бесконтактно · QR · HGS',
      },
      cameraId: '020-1-C',
      kioskTag: 'Киоск',
      amount: '200,00 ₺',
    },
  },
}

function Counter({ value, decimals, suffix, locale }: { value: number; decimals: number; suffix: string; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setDisplay(value)
      return
    }
    const controls = animate(0, value, { duration: 1.4, ease: easeOut, onUpdate: (latest) => setDisplay(latest) })
    return () => controls.stop()
  }, [inView, reduce, value])

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display)

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  )
}

function useCameraClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

const statusTone: Record<ScenePhase, string> = {
  approach: 'border-sky-400/30 bg-sky-500/15 text-sky-100',
  scan: 'border-cyan-400/30 bg-cyan-500/15 text-cyan-100',
  locked: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
  kiosk: 'border-amber-400/30 bg-amber-500/15 text-amber-100',
  paying: 'border-sky-400/30 bg-sky-500/15 text-sky-100',
  paid: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
  open: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
  pass: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
  closing: 'border-sky-400/30 bg-sky-500/15 text-sky-100',
}

function LiveGateScene({ scene, locale, reduce }: { scene: SceneCopy; locale: string; reduce: boolean | null }) {
  const { phase, reached } = useParkingSequence(!reduce)

  const open = phase === 'open' || phase === 'pass'
  const loopActive = phase !== 'pass' && phase !== 'closing'
  const plateLocked = reached('locked') && phase !== 'closing'
  const kioskActive = phase === 'kiosk' || phase === 'paying' || phase === 'paid'
  const kioskPaid = phase === 'paid' || phase === 'open' || phase === 'pass'
  const timestamp = useCameraClock()

  const times = useMemo(() => {
    const exit = new Date()
    const entry = new Date(exit.getTime() - 72 * 60_000)
    const format = (date: Date) => date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false })
    return { entry: format(entry), exit: format(exit), duration: DURATION, amount: scene.amount }
  }, [locale, scene.amount])

  return (
    <div className="relative mx-auto w-full max-w-[36rem] lg:max-w-none">
      <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.2),transparent_65%)] blur-2xl" aria-hidden="true" />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: easeApple, delay: 0.25 }}
        className="relative rounded-[1.75rem] border border-white/12 bg-[#0c0c11]/85 p-2 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:p-2.5"
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 px-1 pb-1 sm:px-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                </span>
                <span className="truncate text-[0.68rem] font-medium text-white/45 sm:text-xs">{scene.camera}</span>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-wider text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  {reduce ? null : <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {scene.live}
              </span>
            </div>

            <GateCamera
              phase={phase}
              plate={PLATE}
              ledLines={scene.ledSign[phase]}
              plateLocked={plateLocked}
              scanning={phase === 'scan'}
              kioskActive={kioskActive}
              kioskPaid={kioskPaid}
              cameraId={scene.cameraId}
              timestamp={timestamp}
              reduce={reduce}
            >
              <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2 sm:inset-x-3.5 sm:top-3.5">
                <span className="flex min-w-0 flex-col items-start gap-1.5">
                  <motion.span
                    key={`status-${phase}`}
                    initial={reduce ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: easeApple }}
                    className={`rounded-lg border px-2.5 py-1 text-[0.62rem] font-semibold backdrop-blur-md sm:text-xs ${statusTone[phase]}`}
                  >
                    {scene.status[phase]}
                  </motion.span>

                  <motion.span
                    initial={false}
                    animate={{ opacity: plateLocked ? 1 : 0, y: plateLocked ? 0 : -8 }}
                    transition={{ duration: 0.4, ease: easeApple }}
                    className="flex items-center gap-2 rounded-xl border border-white/12 bg-black/65 px-2 py-1.5 backdrop-blur-md sm:px-2.5"
                  >
                    <span className="flex items-center overflow-hidden rounded-[4px] bg-white">
                      <span className="bg-[#1140c4] px-1 py-1 text-[0.5rem] font-bold text-white">TR</span>
                      <span className="px-1.5 py-0.5 font-mono text-[0.72rem] font-bold tracking-wide text-slate-900 sm:text-sm">
                        {PLATE}
                      </span>
                    </span>
                    <span className="text-[0.58rem] leading-tight text-white/55 sm:text-[0.68rem]">
                      <span className="block font-semibold text-emerald-300">99.4%</span>
                      {scene.confidence}
                    </span>
                  </motion.span>
                </span>
                <span className="mt-5 hidden rounded-lg border border-white/10 bg-black/55 px-2 py-1 font-mono text-[0.55rem] text-white/50 backdrop-blur-md sm:mt-6 sm:inline-block sm:text-[0.62rem]">
                  3840×2160 · 30fps · {scene.occupancy} %78
                </span>
              </div>

              <motion.span
                initial={false}
                animate={{ opacity: kioskActive || open ? 1 : 0.45 }}
                transition={{ duration: 0.35 }}
                className="absolute left-[71%] top-[76%] flex flex-col rounded-[3px] border border-white/15 bg-black/80 px-1.5 py-1 backdrop-blur-sm"
              >
                <span className="text-[0.4rem] font-bold uppercase tracking-[0.12em] text-white/40 sm:text-[0.48rem]">
                  {scene.kioskTag}
                </span>
                <motion.span
                  key={`kiosk-${phase}`}
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`text-[0.45rem] font-bold uppercase tracking-wide sm:text-[0.55rem] ${
                    kioskPaid ? 'text-emerald-400 [text-shadow:0_0_8px_rgba(52,211,153,0.7)]' : 'text-sky-200'
                  }`}
                >
                  {kioskPaid ? scene.kiosk.approved : phase === 'paying' ? scene.kiosk.processing : phase === 'kiosk' ? scene.kiosk.tapCard : scene.kiosk.waiting}
                </motion.span>
              </motion.span>

              <div className="absolute inset-x-2.5 bottom-2.5 flex items-end justify-end gap-2 sm:inset-x-3.5 sm:bottom-3.5">
                <motion.span
                  animate={{
                    borderColor: open ? 'rgba(52,211,153,0.35)' : 'rgba(248,113,113,0.35)',
                    color: open ? '#6ee7b7' : '#fca5a5',
                  }}
                  transition={{ duration: 0.35 }}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border bg-black/65 px-2 py-1 text-[0.55rem] font-bold uppercase tracking-wider backdrop-blur-md sm:text-[0.62rem]"
                >
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full"
                    animate={{ backgroundColor: open ? '#34d399' : '#f87171' }}
                    transition={{ duration: 0.3 }}
                  />
                  {open ? scene.barrierOpen : scene.barrierClosed}
                </motion.span>
              </div>
            </GateCamera>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div>
                <LedBoard
                  lines={scene.ledLines[phase]}
                  title={scene.ledTitle}
                  colTime={scene.ledTime}
                  colPrice={scene.ledPrice}
                  rows={scene.ledRows}
                  highlight={kioskActive || open ? scene.ledRows[1].time : null}
                  reduce={reduce}
                />
              </div>
              <KioskPanel phase={phase} plate={PLATE} labels={scene.kiosk} values={times} reduce={reduce} />
            </div>
            <BarrierStrip open={open} loopActive={loopActive} labels={scene.barrier} reduce={reduce} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, x: 18 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: [0, -7, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.9 },
          x: { duration: 0.6, delay: 0.9, ease: easeApple },
          y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
        }}
        className="absolute -right-3 top-[13%] hidden items-center gap-2 rounded-2xl border border-white/12 bg-[#0d0d12]/90 px-3 py-2.5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl lg:flex"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <span>
          <span className="block text-sm font-bold leading-none text-white">%99.9</span>
          <span className="mt-1 block text-[0.65rem] text-white/45">{scene.accuracy}</span>
        </span>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  const { locale } = useLocale()
  const path = usePath()
  const reduce = useReducedMotion()
  const text = copy[locale] ?? copy.tr

  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#07070a] pb-16 pt-28 text-white sm:pt-32 lg:pb-24 lg:pt-36">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_35%,transparent_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(ellipse_60%_45%_at_50%_-5%,rgba(56,189,248,0.28),transparent_70%)]"
        aria-hidden="true"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.28),transparent_65%)] blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-[28rem] -z-10 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.2),transparent_65%)] blur-3xl"
        animate={reduce ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[#07070a]" aria-hidden="true" />

      <div className="mx-auto w-[min(80rem,calc(100%-2rem))]">
        <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 xl:gap-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
            className="text-center lg:text-left"
          >
            <motion.div variants={rise} transition={{ duration: 0.6, ease: easeApple }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] py-1.5 pl-1.5 pr-3.5 text-[0.72rem] font-medium text-white/75 backdrop-blur-md sm:text-[0.8rem]">
                <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-white sm:text-[0.68rem]">
                  <span className="relative flex h-1.5 w-1.5">
                    {reduce ? null : <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />}
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  ALPR
                </span>
                {text.badge}
              </span>
            </motion.div>

            <motion.h1
              variants={rise}
              transition={{ duration: 0.7, ease: easeApple }}
              className="mt-6 text-[clamp(2.2rem,6.6vw,4rem)] font-bold leading-[1.05] tracking-[-0.035em]"
            >
              <span className="block text-white">{text.titleTop}</span>
              <span className="block bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                {text.titleAccent}
              </span>
              <span className="block text-white/55">{text.titleBottom}</span>
            </motion.h1>

            <motion.p
              variants={rise}
              transition={{ duration: 0.7, ease: easeApple }}
              className="mx-auto mt-6 max-w-xl text-[0.96rem] leading-relaxed text-white/55 sm:text-lg lg:mx-0"
            >
              {text.description}
            </motion.p>

            <motion.div
              variants={rise}
              transition={{ duration: 0.7, ease: easeApple }}
              className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <Link
                to={path('quote.index')}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-sky-400 to-blue-600 px-6 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_18px_40px_-14px_rgba(14,165,233,0.85)] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-sky-300 sm:px-7"
              >
                <span className="relative z-10">{text.primary}</span>
                <svg viewBox="0 0 24 24" className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>

              <Link
                to={path('software-products')}
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-[0.95rem] font-semibold text-white/85 backdrop-blur-md outline-none transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.09] hover:text-white focus-visible:ring-2 focus-visible:ring-sky-400/70 sm:px-7"
              >
                {text.secondary}
                <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-60 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          <LiveGateScene scene={text.scene} locale={locale} reduce={reduce} />
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-10 sm:gap-x-8 lg:mt-24 lg:grid-cols-4">
          {text.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: easeApple, delay: index * 0.08 }}
              className="flex flex-col text-center lg:text-left"
            >
              <dt className="order-2 mt-2 text-[0.78rem] leading-snug text-white/45 sm:text-sm">{stat.label}</dt>
              <dd className="order-1 bg-gradient-to-b from-white to-white/60 bg-clip-text text-[clamp(1.75rem,4.5vw,2.6rem)] font-bold tracking-tight text-transparent">
                <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} locale={locale} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  )
}
