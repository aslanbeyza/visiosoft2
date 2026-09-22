/**
 * ============================================================================
 * DEMO PANEL — VERİ ÇEKİRDEĞİ
 * ============================================================================
 *
 * Bu dosya /panel rotasındaki demo yönetim panelinin TEK veri kaynağıdır.
 * Backend yoktur: bütün kayıtlar `buildWorld()` içinde tohumlu (seed'li)
 * sözde-rastgele üreteçle oluşturulur. `buildWorld()` saf bir fonksiyondur,
 * argüman almaz ve HER ZAMAN aynı çıktıyı verir — böylece sunucu tarafı
 * render ile istemcinin ilk render'ı birebir aynıdır, hydration uyuşmazlığı
 * oluşmaz ve tablolar JavaScript çalışmadan da dolu gelir.
 *
 * KULLANIM (modül yazarları için):
 *
 *   import { useWorld, usePark } from '@/components/panel/PanelProvider';
 *   const world = useWorld();
 *   const rows = selectSessions(world, parkId, { tab: 'inside' });
 *
 * ZAMAN MODELİ — hydration'ın en riskli yeri, özel çözüm:
 *   Hiçbir kayıtta mutlak tarih YOKTUR. Bütün zamanlar `BASE_EPOCH`
 *   sabitine göre DAKİKA OFSETİ olarak tutulur (`entryMin`, `createdAtMin`…);
 *   geçmiş kayıtlar negatif değer alır. Provider state'inde tek bir `epochMs`
 *   alanı vardır, başlangıçta BASE_EPOCH'tur (deterministik ilk render),
 *   mount'tan sonra bir kez `Date.now()`a çekilir. Biçimleyiciler
 *   (`formatDate`, `formatRelative`) yalnızca bu tek alanı okur.
 *
 *   Takvim hesabı UTC üzerinden + sabit +03:00 ile yapılır (Türkiye yaz saati
 *   uygulamıyor). `new Date().getHours()` gibi yerel-saat okumaları KULLANILMAZ;
 *   sunucu ile istemcinin saat dilimi farklı olabilir.
 *
 * SAYI BİÇİMİ: `Intl.NumberFormat` KULLANILMAZ (SSR/locale tutarsızlığı).
 *   Türkçe biçimleme elle yazılmış saf fonksiyonlarla yapılır.
 *
 * KVKK: Buradaki hiçbir plaka, kişi, kurum, IP veya seri numarası gerçek
 *   değildir. Plakalar ve kapı adları site içeriğindeki `opsSection`
 *   değerlerinden gelir (zaten uydurma); kişi/şirket adları jeneriktir.
 *
 * SABİT RENK YOKTUR: Bu dosya yalnızca semantik `Tone` döndürür
 *   ('success' | 'danger' | 'warning' | 'info' | 'accent' | 'neutral').
 *   Renk eşlemesi ui.tsx'te tema tokenlarıyla yapılır.
 */

import { seeded, seededInt, pick, pad } from '@/lib/deterministic';
import { opsSection } from '@/lib/content';
import { GROSS_BRACKETS } from '@/lib/tariff';

/* ==========================================================================
   0 · TEMEL YARDIMCILAR
   ========================================================================== */

/** SVG koordinatlarını 2 basamağa yuvarlar — hydration güvenliği. */
export const r2 = (n: number): number => Math.round(n * 100) / 100;

/** Para hesaplarında kuruş yuvarlaması. */
export const money2 = (n: number): number => Math.round(n * 100) / 100;

/** Ağırlıklı deterministik seçim. */
export function weighted<T>(seed: number, table: readonly (readonly [T, number])[]): T {
  const total = table.reduce((s, [, w]) => s + w, 0);
  let r = seeded(seed) * total;
  for (const [value, w] of table) {
    r -= w;
    if (r <= 0) return value;
  }
  return table[table.length - 1][0];
}

/** Deterministik 0..1 gürültü — simülasyon tick'lerinde kullanılır. */
export const noise = (seed: number): number => seeded(seed * 7919 + 13);

/* ==========================================================================
   1 · ZAMAN
   ========================================================================== */

/**
 * Demo dünyasının sıfır noktası: 11 Eylül 2026, 14:36 (İstanbul).
 * paymentFlow.ts'teki örnek oturum saatleriyle uyumludur.
 * UTC olarak 11:36 — Türkiye sabit UTC+3.
 */
export const BASE_EPOCH = Date.UTC(2026, 8, 11, 11, 36, 0);

/** Türkiye sabit saat farkı (yaz saati uygulaması yok). */
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;

const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];
const DAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export interface CalendarParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number; // 0 = Pazar
  monthName: string;
  dayName: string;
}

/** Mutlak ms → İstanbul takvim parçaları (UTC matematiği, sabit +3). */
export function calendar(ms: number): CalendarParts {
  const d = new Date(ms + TZ_OFFSET_MS);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    weekday: d.getUTCDay(),
    monthName: MONTHS_TR[d.getUTCMonth()],
    dayName: DAYS_TR[d.getUTCDay()],
  };
}

/** Dakika ofsetini mutlak ms'ye çevirir. */
export const msOf = (epochMs: number, min: number): number => epochMs + min * 60_000;

/** '11.09.2026 14:36' */
export function formatDateTime(epochMs: number, min: number | null | undefined): string {
  if (min === null || min === undefined) return '—';
  const c = calendar(msOf(epochMs, min));
  return `${pad(c.day)}.${pad(c.month)}.${c.year} ${pad(c.hour)}:${pad(c.minute)}`;
}

/** '11.09.2026' */
export function formatDate(epochMs: number, min: number | null | undefined): string {
  if (min === null || min === undefined) return '—';
  const c = calendar(msOf(epochMs, min));
  return `${pad(c.day)}.${pad(c.month)}.${c.year}`;
}

/** '14:36' */
export function formatTime(epochMs: number, min: number | null | undefined): string {
  if (min === null || min === undefined) return '—';
  const c = calendar(msOf(epochMs, min));
  return `${pad(c.hour)}:${pad(c.minute)}`;
}

/** '11.09.2026 14:36:02' */
export function formatDateTimeSec(epochMs: number, min: number | null | undefined): string {
  if (min === null || min === undefined) return '—';
  const c = calendar(msOf(epochMs, min));
  return `${pad(c.day)}.${pad(c.month)}.${c.year} ${pad(c.hour)}:${pad(c.minute)}:${pad(c.second)}`;
}

/**
 * Aynı gün ise yalnız saat, değilse tam tarih — gerçek panelin çıkış
 * sütunundaki davranış.
 */
export function formatSmartTime(epochMs: number, min: number | null, refMin: number): string {
  if (min === null) return '—';
  const a = calendar(msOf(epochMs, min));
  const b = calendar(msOf(epochMs, refMin));
  if (a.year === b.year && a.month === b.month && a.day === b.day) {
    return `${pad(a.hour)}:${pad(a.minute)}`;
  }
  return formatDateTime(epochMs, min);
}

/** '3 saat önce' · '2 gün önce' · 'az önce' */
export function formatRelative(nowMin: number, min: number): string {
  const diff = Math.round(nowMin - min);
  if (diff < 1) return 'az önce';
  if (diff < 60) return `${diff} dk önce`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h} saat önce`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} gün önce`;
  return `${Math.floor(d / 30)} ay önce`;
}

/**
 * 134 → '2 saat 14 dk' · 17 → '17 dk' · 1500 → '1 gün 1 saat'
 *
 * Gerçek Partner panelinin SÜRE biçimi budur (`zone-panel-tam-envanter.md`
 * §Oturumlar: `2 saat 8 dk` / `17 dk`). POS'un kendi kısaltılmış biçimi
 * (`19 sa 20 dk`) ayrıdır ve `PosPanel.posDuration` içinde durur.
 */
export function formatDuration(min: number | null | undefined): string {
  if (min === null || min === undefined) return '—';
  const m = Math.max(0, Math.round(min));
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const mm = m % 60;
  if (d > 0) return `${d} gün ${h} saat`;
  if (h > 0) return `${h} saat ${mm} dk`;
  return `${mm} dk`;
}

/* ==========================================================================
   2 · SAYI / PARA BİÇİMİ (Intl yok)
   ========================================================================== */

/** 184320 → '184.320' */
export function formatInt(n: number): string {
  const neg = n < 0;
  const s = String(Math.abs(Math.round(n)));
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += '.';
    out += s[i];
  }
  return neg ? `-${out}` : out;
}

/** Para parçaları — kuruş kısmı tabloda küçük ve soluk yazılsın diye ayrı. */
export function formatTLParts(n: number): { major: string; minor: string; neg: boolean } {
  const neg = n < 0;
  const v = Math.abs(money2(n));
  const major = formatInt(Math.floor(v));
  const minor = pad(Math.round((v - Math.floor(v)) * 100));
  return { major, minor, neg };
}

/** 1234.5 → '1.234,50 ₺' */
export function formatTL(n: number): string {
  const p = formatTLParts(n);
  return `${p.neg ? '-' : ''}${p.major},${p.minor} ₺`;
}

/** 0.983 → '%98' (ondalık istenirse digits) */
export function formatPercent(ratio: number, digits = 0): string {
  const v = ratio * 100;
  if (digits === 0) return `%${Math.round(v)}`;
  const f = v.toFixed(digits).replace('.', ',');
  return `%${f}`;
}

/** +0.118 → '+%11,8' · -0.031 → '-%3,1' (trend rozetleri için işaretli) */
export function formatSignedPercent(ratio: number, digits = 1): string {
  const sign = ratio >= 0 ? '+' : '-';
  const body = formatPercent(Math.abs(ratio), digits); // '%11,8'
  return `${sign}${body}`;
}

/* ==========================================================================
   3 · SEMANTİK TON + ENUM SÖZLÜKLERİ
   ========================================================================== */

/** ui.tsx bu tonu tema tokenlarına çevirir. Burada sabit renk YOKTUR. */
export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';

/** ui.tsx `Icon` bileşeninin tanıdığı anahtarlar. */
export type IconKey =
  | 'check' | 'clock' | 'x' | 'star' | 'shield' | 'ban' | 'alert' | 'gift'
  | 'edit' | 'money' | 'car' | 'camera' | 'barrier' | 'device' | 'user'
  | 'ticket' | 'list' | 'chart' | 'home' | 'mobile' | 'wallet' | 'refresh'
  | 'download' | 'upload' | 'filter' | 'search' | 'plus' | 'trash' | 'eye'
  | 'play' | 'pause' | 'pin' | 'copy' | 'print' | 'bell' | 'cog' | 'grid'
  | 'flag' | 'wrench' | 'doc' | 'calendar' | 'map' | 'bolt' | 'info'
  | 'chevron-down' | 'chevron-right' | 'chevron-left' | 'arrow-up' | 'arrow-down'
  | 'arrow-right' | 'arrow-left' | 'sort' | 'menu' | 'signal' | 'lock';

export interface EnumMeta {
  id: number;
  label: string;
  tone: Tone;
  icon: IconKey;
}

const metaMap = (rows: EnumMeta[]) => {
  const m = new Map<number, EnumMeta>();
  rows.forEach((r) => m.set(r.id, r));
  return m;
};

/** ParkSessionStatusEnum — 14 değerin tamamı (gerçek panelle birebir). */
export const SESSION_STATUS: EnumMeta[] = [
  { id: 1, label: 'Normal', tone: 'neutral', icon: 'check' },
  { id: 2, label: 'Beyaz Liste', tone: 'info', icon: 'list' },
  { id: 3, label: 'Abone', tone: 'success', icon: 'star' },
  { id: 4, label: 'Çıkış Belirsiz', tone: 'warning', icon: 'clock' },
  { id: 5, label: 'Hatalı', tone: 'danger', icon: 'alert' },
  { id: 6, label: 'Manuel Oluşturulmuş', tone: 'neutral', icon: 'edit' },
  { id: 7, label: 'İptal edildi', tone: 'danger', icon: 'x' },
  { id: 8, label: 'Ücretsiz', tone: 'info', icon: 'gift' },
  { id: 9, label: 'Kara Liste', tone: 'danger', icon: 'ban' },
  { id: 90, label: 'Reddedildi Hatalı Plaka', tone: 'warning', icon: 'alert' },
  { id: 91, label: 'Reddedildi Hatalı Giriş Kaydı', tone: 'warning', icon: 'alert' },
  { id: 92, label: 'Reddedildi Hatalı Çıkış Kaydı', tone: 'warning', icon: 'alert' },
  { id: 99, label: 'Doğrulama Bekliyor (Atlandı)', tone: 'warning', icon: 'shield' },
  { id: 100, label: 'Yüksek Tutar', tone: 'danger', icon: 'money' },
];
const SESSION_STATUS_MAP = metaMap(SESSION_STATUS);
export const sessionStatus = (id: number): EnumMeta =>
  SESSION_STATUS_MAP.get(id) ?? SESSION_STATUS[0];

/** PaymentStatusEnum — 5 değer. */
export const PAYMENT_STATUS: EnumMeta[] = [
  { id: 2, label: 'Ödendi', tone: 'success', icon: 'check' },
  { id: 3, label: 'Ödenmemiş', tone: 'warning', icon: 'clock' },
  { id: 4, label: 'Başarısız', tone: 'danger', icon: 'x' },
  { id: 5, label: 'Ücretsiz', tone: 'info', icon: 'gift' },
  { id: 6, label: 'İade Edildi', tone: 'neutral', icon: 'refresh' },
];
const PAYMENT_STATUS_MAP = metaMap(PAYMENT_STATUS);
export const paymentStatus = (id: number): EnumMeta =>
  PAYMENT_STATUS_MAP.get(id) ?? PAYMENT_STATUS[1];

/** VehicleClassEnum — 8 değer. */
export const VEHICLE_CLASS: EnumMeta[] = [
  { id: 1, label: 'Otomobil', tone: 'neutral', icon: 'car' },
  { id: 2, label: 'Minibüs', tone: 'neutral', icon: 'car' },
  { id: 3, label: 'Otobüs', tone: 'neutral', icon: 'car' },
  { id: 4, label: 'Kamyonet', tone: 'neutral', icon: 'car' },
  { id: 5, label: 'Kamyon', tone: 'neutral', icon: 'car' },
  { id: 6, label: 'Tır', tone: 'neutral', icon: 'car' },
  { id: 7, label: 'Motosiklet', tone: 'neutral', icon: 'car' },
  { id: 8, label: 'Ticari (Doblo)', tone: 'neutral', icon: 'car' },
];
const VEHICLE_CLASS_MAP = metaMap(VEHICLE_CLASS);
export const vehicleClass = (id: number): EnumMeta =>
  VEHICLE_CLASS_MAP.get(id) ?? VEHICLE_CLASS[0];

/** Araç sınıfı ücret çarpanı — tarife satırı yoksa temel satır bununla ölçeklenir. */
export const VEHICLE_MULTIPLIER: Record<number, number> = {
  1: 1, 2: 1.25, 3: 1.8, 4: 1.3, 5: 1.8, 6: 2.2, 7: 0.5, 8: 1.15,
};

/** PaymentMethodEnum — gerçek panelde tanımlı yöntemler. */
export const PAYMENT_METHOD: EnumMeta[] = [
  { id: 1, label: 'HGS', tone: 'info', icon: 'bolt' },
  { id: 2, label: 'POS', tone: 'accent', icon: 'wallet' },
  { id: 5, label: 'Toger Sanal POS', tone: 'accent', icon: 'wallet' },
  { id: 7, label: 'Banka Havalesi', tone: 'neutral', icon: 'money' },
  { id: 8, label: 'HGS Backend', tone: 'info', icon: 'bolt' },
  { id: 9, label: 'Beyaz Liste', tone: 'info', icon: 'list' },
  { id: 10, label: 'Demirbank POS', tone: 'accent', icon: 'wallet' },
  { id: 11, label: 'QNBPay Sanal POS', tone: 'accent', icon: 'wallet' },
  { id: 12, label: 'Demirbank', tone: 'neutral', icon: 'money' },
  { id: 13, label: 'Demirbank QR', tone: 'accent', icon: 'grid' },
  { id: 14, label: 'PayTR Sanal POS', tone: 'accent', icon: 'wallet' },
  { id: 15, label: 'Nakit', tone: 'neutral', icon: 'money' },
  { id: 16, label: 'Vakıfbank Sanal POS', tone: 'accent', icon: 'wallet' },
  { id: 17, label: 'PayTR Backend', tone: 'accent', icon: 'wallet' },
  { id: 18, label: 'Vakıfbank Backend', tone: 'accent', icon: 'wallet' },
  { id: 19, label: 'Cüzdan', tone: 'success', icon: 'wallet' },
];
const PAYMENT_METHOD_MAP = metaMap(PAYMENT_METHOD);
export const paymentMethod = (id: number): EnumMeta =>
  PAYMENT_METHOD_MAP.get(id) ?? PAYMENT_METHOD[0];

/** Mobil uygulamadan gelen ödemeler bu yöntemle kaydedilir. */
export const MOBILE_PAYMENT_METHOD_ID = 14;

/** DeviceTypeEnum — 0..8 */
export const DEVICE_TYPE: EnumMeta[] = [
  { id: 0, label: 'Bilinmiyor', tone: 'neutral', icon: 'device' },
  { id: 1, label: 'Jetson Orin Nano', tone: 'accent', icon: 'device' },
  { id: 2, label: 'Raspberry Pi 5', tone: 'info', icon: 'device' },
  { id: 3, label: 'Intel Kasa', tone: 'info', icon: 'device' },
  { id: 4, label: 'Kiosk', tone: 'accent', icon: 'grid' },
  { id: 5, label: 'Ön Ödemeli Kiosk', tone: 'accent', icon: 'grid' },
  { id: 6, label: 'Huawei Atlas 200 DK', tone: 'info', icon: 'device' },
  { id: 7, label: 'Tetikleyici', tone: 'neutral', icon: 'bolt' },
  { id: 8, label: 'Reklam', tone: 'neutral', icon: 'doc' },
];
const DEVICE_TYPE_MAP = metaMap(DEVICE_TYPE);
export const deviceType = (id: number): EnumMeta => DEVICE_TYPE_MAP.get(id) ?? DEVICE_TYPE[0];

/** UsageTypeEnum — otoparkın kullanım tipi. */
export const USAGE_TYPE: EnumMeta[] = [
  { id: 1, label: 'Abonelik', tone: 'info', icon: 'star' },
  { id: 2, label: 'Anlık Ödeme', tone: 'accent', icon: 'money' },
  { id: 3, label: 'Abonelik + Anlık Ödeme', tone: 'success', icon: 'check' },
  { id: 4, label: 'Site Otopark (Ücretsiz)', tone: 'neutral', icon: 'home' },
];
const USAGE_TYPE_MAP = metaMap(USAGE_TYPE);
export const usageType = (id: number): EnumMeta => USAGE_TYPE_MAP.get(id) ?? USAGE_TYPE[2];

/** PMSP log seviyeleri. */
export const PMSP_LEVEL: EnumMeta[] = [
  { id: 1, label: 'SUCCESS', tone: 'success', icon: 'check' },
  { id: 2, label: 'WARNING', tone: 'warning', icon: 'alert' },
  { id: 3, label: 'ERROR', tone: 'danger', icon: 'x' },
  { id: 4, label: 'INFO', tone: 'info', icon: 'info' },
];
const PMSP_LEVEL_MAP = metaMap(PMSP_LEVEL);
export const pmspLevel = (id: number): EnumMeta => PMSP_LEVEL_MAP.get(id) ?? PMSP_LEVEL[3];

export const PMSP_CATEGORY: EnumMeta[] = [
  { id: 1, label: 'SYSTEM', tone: 'neutral', icon: 'cog' },
  { id: 2, label: 'PAYMENT', tone: 'accent', icon: 'money' },
  { id: 3, label: 'PLATE', tone: 'info', icon: 'car' },
  { id: 4, label: 'CAMERA', tone: 'info', icon: 'camera' },
  { id: 5, label: 'WEBSOCKET', tone: 'accent', icon: 'signal' },
  { id: 6, label: 'API', tone: 'neutral', icon: 'bolt' },
  { id: 7, label: 'MAIL', tone: 'neutral', icon: 'doc' },
  { id: 8, label: 'PLATE_DETECTION', tone: 'info', icon: 'camera' },
  { id: 9, label: 'MEMBERSHIP', tone: 'success', icon: 'star' },
  { id: 10, label: 'LED', tone: 'warning', icon: 'bolt' },
];
const PMSP_CATEGORY_MAP = metaMap(PMSP_CATEGORY);
export const pmspCategory = (id: number): EnumMeta =>
  PMSP_CATEGORY_MAP.get(id) ?? PMSP_CATEGORY[0];

export const PMSP_MESSAGE_TYPES = [
  'BootNotification', 'UnlockBarrier', 'TakeSnapshot', 'SendSnapshot',
  'UpdateWhitelist', 'Reset', 'GetStream', 'SendStreamFrame', 'GetInformation',
  'SendInformation', 'UpdateDevice', 'SendUpdateResult', 'SetConfiguration',
  'SendActionHistory', 'UpdateBlacklist', 'PayWithPos', 'MailNotification',
  'MembershipAction',
] as const;
export type PmspMessageType = (typeof PMSP_MESSAGE_TYPES)[number];

/** Destek talebi durumları. */
export const TICKET_STATUS = [
  { id: 'open', label: 'Açık', tone: 'info' as Tone },
  { id: 'in_progress', label: 'İşlemde', tone: 'accent' as Tone },
  { id: 'waiting_customer', label: 'Müşteri Bekleniyor', tone: 'warning' as Tone },
  { id: 'technical_review', label: 'Teknik İnceleme', tone: 'warning' as Tone },
  { id: 'resolved', label: 'Çözüldü', tone: 'success' as Tone },
  { id: 'closed', label: 'Kapalı', tone: 'neutral' as Tone },
] as const;
export type TicketStatusId = (typeof TICKET_STATUS)[number]['id'];
export const ticketStatus = (id: string) =>
  TICKET_STATUS.find((s) => s.id === id) ?? TICKET_STATUS[0];

export const TICKET_PRIORITY = [
  { id: 'low', label: 'Düşük', tone: 'neutral' as Tone },
  { id: 'normal', label: 'Normal', tone: 'info' as Tone },
  { id: 'high', label: 'Yüksek', tone: 'warning' as Tone },
  { id: 'urgent', label: 'Acil', tone: 'danger' as Tone },
] as const;
export type TicketPriorityId = (typeof TICKET_PRIORITY)[number]['id'];
export const ticketPriority = (id: string) =>
  TICKET_PRIORITY.find((s) => s.id === id) ?? TICKET_PRIORITY[1];

export const TICKET_CATEGORY = [
  { id: 'subscription', label: 'Abonelik' },
  { id: 'accounting', label: 'Muhasebe' },
  { id: 'complaint_suggestion', label: 'Şikayet / Öneri' },
  { id: 'other', label: 'Diğer' },
] as const;
export type TicketCategoryId = (typeof TICKET_CATEGORY)[number]['id'];

/** Abonelik durumları. */
export const MEMBERSHIP_STATUS = [
  { id: 'active', label: 'Aktif', tone: 'success' as Tone },
  { id: 'expired', label: 'Süresi Doldu', tone: 'warning' as Tone },
  { id: 'terminated', label: 'Sonlandırıldı', tone: 'danger' as Tone },
  { id: 'pending', label: 'Beklemede', tone: 'info' as Tone },
  { id: 'doc_pending', label: 'Belge Onayı Bekliyor', tone: 'warning' as Tone },
  { id: 'doc_rejected', label: 'Belge Reddedildi', tone: 'danger' as Tone },
] as const;
export type MembershipStatusId = (typeof MEMBERSHIP_STATUS)[number]['id'];
export const membershipStatus = (id: string) =>
  MEMBERSHIP_STATUS.find((s) => s.id === id) ?? MEMBERSHIP_STATUS[0];

/** Canlı olay akışı tipleri (Watch modülünün karşılığı). */
export const EVENT_KIND = {
  entry: { label: 'Giriş', tone: 'success' as Tone, icon: 'arrow-right' as IconKey },
  exit: { label: 'Çıkış', tone: 'danger' as Tone, icon: 'arrow-left' as IconKey },
  payment: { label: 'Ödeme', tone: 'info' as Tone, icon: 'money' as IconKey },
  payment_init: { label: 'Ödeme Başlatıldı', tone: 'warning' as Tone, icon: 'clock' as IconKey },
  barrier: { label: 'Bariyer', tone: 'accent' as Tone, icon: 'barrier' as IconKey },
  denied: { label: 'Geçiş Reddedildi', tone: 'danger' as Tone, icon: 'ban' as IconKey },
  device: { label: 'Cihaz', tone: 'neutral' as Tone, icon: 'device' as IconKey },
  membership: { label: 'Abonelik', tone: 'success' as Tone, icon: 'star' as IconKey },
} as const;
export type EventKind = keyof typeof EVENT_KIND;

/* ==========================================================================
   4 · VARLIK TİPLERİ
   ========================================================================== */

export interface DemoPark {
  id: number;
  name: string;
  code: string;
  usageTypeId: number;
  statusId: number;
  capacityTotal: number;
  capacityMembership: number;
  membershipUsed: number;
  /** Şu anki doluluk — panelin resmî doluluk kaynağı (content.ts ile uyumlu). */
  occupiedNow: number;
  address: string;
  latitude: number;
  longitude: number;
  maxPrice: number;
  taxPercent: number;
  debtThresholdDays: number;
  barrierIntervalTime: number;
  gapBetweenSession: number;
  idleSessionLimit: number;
  autoApproveSession: boolean;
  /** Mobil uygulamadaki mesafe çipi için (km). */
  distanceKm: number;
  /** Bugünkü ciro — content.ts opsSection KPI'ı ile uyumlu. */
  dailyRevenue: number;
  /** Ortalama oturum süresi (dk). */
  avgDurationMin: number;
}

export interface SessionAction {
  at: number;
  by: string;
  label: string;
  detail?: string;
}

export interface ParkSession {
  id: string;
  parkId: number;
  sessionUid: string;
  plateTxt: string;
  entryMin: number;
  exitMin: number | null;
  amount: number;
  taxPercent: number;
  paymentStatusId: number;
  sessionStatusId: number;
  vehicleClassId: number;
  gateIn: string;
  gateOut: string | null;
  cameraInId: string | null;
  cameraOutId: string | null;
  paymentBy: string | null;
  paymentTransactionId: string | null;
  notes: string;
  actions: SessionAction[];
  isImported: boolean;
  mutabakatIsMatched: boolean;
  createdBy: string;
}

export type PaymentChannel = 'Sistem' | 'Partner' | 'API' | 'Kiosk' | 'Mobil';

export interface Payment {
  id: string;
  parkSessionId: string | null;
  membershipId: string | null;
  parkId: number;
  plateTxt: string;
  serviceId: number;
  amount: number;
  taxPercent: number;
  statusId: number;
  /** 5 = Park Ücreti, 6 = Abonelik */
  categoryId: 5 | 6;
  channel: PaymentChannel;
  intentId: string;
  approveAtMin: number | null;
  createdAtMin: number;
  refundedAtMin: number | null;
  refundReason: string | null;
  serviceMessage: string;
  invoiceStatus: 'sent' | 'completed' | 'failed' | 'skipped' | null;
}

export interface Device {
  id: string;
  name: string;
  parkId: number;
  typeId: number;
  statusId: 1 | 2;
  serialNumber: string;
  ipAddress: string;
  tailscaleIp: string;
  lastOnlineMin: number;
  tailscaleOnline: boolean;
  lensVersion: string;
  cameraCount: number;
  barrierCount: number;
  kioskCount: number;
  ledCount: number;
  /** Simülasyon/komut sonucu geçici durum. */
  serviceState: 'ok' | 'restarting' | 'warning' | 'critical';
}

export interface Camera {
  id: string;
  deviceId: string;
  parkId: number;
  barrierId: string | null;
  name: string;
  /** 1 = Giriş, 2 = Çıkış */
  type: 1 | 2;
  purpose: 'Oturum' | 'Veri Toplama' | 'Güvenlik';
  rtspMasked: string;
  polygon: string;
  minConfidence: number;
  isActive: boolean;
  isBlacklistActive: boolean;
  isWhitelistOnly: boolean;
  lastCaptureMin: number;
  online: boolean;
}

export interface Barrier {
  id: string;
  cameraId: string;
  parkId: number;
  barrierIp: string;
  barrierPort: number;
  relayNumber: number;
  /** Kasıtlı olarak biri true — 'bariyer açık tutuluyor'. */
  relayHeld: boolean;
}

export interface RadarMetric {
  deviceId: string;
  parkId: number;
  sampledAtMin: number;
  cpuLoad: number;
  ramPercent: number;
  diskPercent: number;
  temperature: number;
  backendLatencyMs: number;
  uptimeSeconds: number;
  camerasOnline: number;
  camerasTotal: number;
  isStale: boolean;
}

export interface RadarThresholds {
  temperature: number;
  ram: number;
  disk: number;
  cpu: number;
  latencyMs: number;
  cameraTimeoutMin: number;
}

export interface RadarAlert {
  id: string;
  parkId: number;
  name: string;
  thresholds: RadarThresholds;
  recipients: string[];
  mailFrequency: 'daily' | 'hourly' | 'instant';
  isActive: boolean;
  lastSentMin: number | null;
}

export interface RadarAlertNotification {
  id: string;
  alertId: string;
  deviceId: string;
  parkId: number;
  checks: string[];
  sentAtMin: number;
}

export interface ParkSlot {
  id: string;
  parkId: number;
  floor: number;
  code: string;
  status: 'bos' | 'dolu' | 'abone' | 'engelli';
  sessionId: string | null;
  x: number;
  y: number;
}

export interface MembershipExtension {
  previousUntilMin: number;
  newUntilMin: number;
  type: 'odeme' | 'hediye' | 'duzeltme';
  note: string;
  atMin: number;
}

export interface MembershipActivity {
  atMin: number;
  label: string;
  by: string;
}

export interface Membership {
  id: string;
  parkId: number;
  subUserName: string;
  subUserPhone: string;
  subUserEmail: string;
  companyName: string | null;
  companyVat: string | null;
  plateTxt: string;
  packageId: string;
  amount: number;
  statusId: MembershipStatusId;
  paymentMethodId: number;
  paymentStatusId: number;
  subscribedAtMin: number;
  availableUntilMin: number;
  autoRenew: boolean;
  terminatedAtMin: number | null;
  extensions: MembershipExtension[];
  activities: MembershipActivity[];
  /** Mobil uygulamadan satın alındıysa true. */
  fromMobile: boolean;
}

export interface MembershipPackage {
  id: string;
  parkId: number;
  name: string;
  cost: number;
  durationDays: number;
  audience: 'Bireysel' | 'Kurumsal' | 'Her İkisi';
  vehicleClassId: number;
  paymentMethodIds: number[];
  pricingType: 'Ücretsiz' | 'Yüzde' | 'Sabit İndirim' | 'Sabit Fiyat';
  pricingValue: number;
  pricingUsageType: 'Oturum Başına' | 'Süre Boyunca';
  requiresDocument: boolean;
  active: boolean;
  isPurchasable: boolean;
  description: string;
}

export interface MembershipWaitlist {
  id: string;
  parkId: number;
  position: number;
  name: string;
  phone: string;
  plateTxt: string;
  packageId: string;
  status: 'Bekliyor' | 'Bilgilendirildi' | 'Aboneliğe Çevrildi' | 'İptal';
  createdAtMin: number;
  notifiedAtMin: number | null;
}

export interface MembershipApproval {
  id: string;
  parkId: number;
  name: string;
  phone: string;
  plateTxt: string;
  packageId: string;
  documentNames: string[];
  createdAtMin: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ListEntry {
  id: string;
  parkId: number;
  kind: 'white' | 'black';
  plateTxt: string;
  name: string;
  companyName: string;
  phone: string;
  description: string;
  expiryAtMin: number | null;
  createdAtMin: number;
  deleted: boolean;
}

export interface TicketAttachment {
  name: string;
  sizeKb: number;
}

export interface TicketReply {
  id: string;
  sender: 'partner' | 'agent';
  body: string;
  attachments: TicketAttachment[];
  createdAtMin: number;
  isInternalNote: boolean;
  /** 'AI Yanıt Önerisi' ile üretilen metinler dürüstçe işaretlenir. */
  isTemplate?: boolean;
}

export interface SupportTicket {
  id: string;
  parkId: number;
  subject: string;
  content: string;
  category: TicketCategoryId;
  status: TicketStatusId;
  priority: TicketPriorityId;
  source: 'portal' | 'mobil';
  createdBy: string;
  assignedTo: string | null;
  plateTxt: string | null;
  createdAtMin: number;
  updatedAtMin: number;
  closedAtMin: number | null;
  attachments: TicketAttachment[];
  replies: TicketReply[];
}

export interface BarrierLog {
  id: string;
  userName: string;
  parkId: number;
  cameraId: string;
  deviceSerial: string;
  barrierIp: string;
  action: string;
  outcome: 'opened' | 'failed' | 'unconfirmed';
  transport: 'gate' | 'pmsp';
  description: string;
  createdAtMin: number;
}

export interface PmspLog {
  id: string;
  parkId: number;
  recordedAtMin: number;
  level: number;
  category: number;
  messageType: PmspMessageType;
  deviceId: string | null;
  cameraId: string | null;
  barrierId: string | null;
  payload: string;
  response: string;
  messageUid: string;
}

export interface ParkPricing {
  id: string;
  parkId: number;
  periodId: string;
  name: string;
  fromMinute: number;
  toMinute: number;
  /** KDV hariç net tutar. */
  amount: number;
  taxPercent: number;
  vehicleClassId: number;
}

export interface ParkPricingPeriod {
  id: string;
  parkId: number;
  name: string;
  timeFrom: number; // saat (0-23)
  timeTo: number;
  factor: number;
}

export interface DailyPoint {
  parkId: number;
  /** 0 = bugün, -1 = dün … */
  dayOffset: number;
  revenue: number;
  collected: number;
  uncollected: number;
  pending: number;
  membership: number;
  passes: number;
  entries: number;
  exits: number;
  freePasses: number;
  memberPasses: number;
  whitelistPasses: number;
  hgsPending: number;
}

export interface MonthlyRevenue {
  parkId: number;
  monthOffset: number; // 0 = bu ay, -1 = geçen ay
  label: string;
  totalRevenue: number;
  collected: number;
  uncollected: number;
  pending: number;
  sessionCount: number;
  memberRevenue: number;
  expense: number;
}

export interface InvoiceOrder {
  id: string;
  referenceId: string;
  paymentId: string | null;
  membershipId: string | null;
  plateTxt: string;
  status: 'sent' | 'completed' | 'failed' | 'skipped';
  orderNumber: string;
  errorMessage: string | null;
  sentAtMin: number;
  settledAtMin: number | null;
}

export interface HourlyBucket {
  parkId: number;
  hour: number;
  passCount: number;
  revenue: number;
  occupancy: number;
  occupancyRate: number;
}

export interface LiveEvent {
  id: string;
  kind: EventKind;
  parkId: number;
  atMin: number;
  plate: string | null;
  cameraId: string | null;
  barrierId: string | null;
  amount: number | null;
  text: string;
  read: boolean;
}

/* --- Mobil uygulama dünyası ------------------------------------------- */

export interface MobileUser {
  name: string;
  email: string;
  phone: string;
  notificationsEnabled: boolean;
}

export interface Vehicle {
  id: string;
  plateTxt: string;
  isDefault: boolean;
}

/**
 * GÜVENLİK: Tam kart numarası HİÇBİR YERDE saklanmaz — yalnızca marka,
 * son 3 hane ve kart sahibi adı tutulur. Form alanları maskelidir.
 */
export interface SavedCard {
  id: string;
  brand: string;
  last3: string;
  holderName: string;
  expireMonth: number;
  expireYear: number;
  isDefault: boolean;
  isExpired: boolean;
}

export interface BridgeRecord {
  id: string;
  atMin: number;
  label: string;
  detail: string;
  targetModule: ModuleId;
  targetId: string | null;
}

/* --- Türetilmiş: Dikkat Kuyruğu --------------------------------------- */

export type AttentionKind =
  | 'radar' | 'high_amount' | 'pending_verify' | 'hgs_approval'
  | 'offline_camera' | 'unpaid_debt' | 'idle_session' | 'doc_approval';

export interface AttentionItem {
  id: string;
  kind: AttentionKind;
  refId: string;
  parkId: number;
  severity: Tone;
  label: string;
  detail: string;
  targetModule: ModuleId;
  targetTab?: string;
  targetFilter?: Record<string, string>;
}

/* --- Bildirim / toast -------------------------------------------------- */

export interface PanelNotification {
  id: string;
  title: string;
  body: string;
  tone: Tone;
  atMin: number;
  read: boolean;
  targetModule?: ModuleId;
  targetTab?: string;
}

export interface Toast {
  id: string;
  title: string;
  body?: string;
  tone: Tone;
  /** ms; 0 = kalıcı (elle kapatılır) */
  duration: number;
}

/* --- Muhasebe düzeltmeleri -------------------------------------------- */

/**
 * Kullanıcı etkileşimlerinin (iade, borç tahsili, mobil ödeme, abonelik
 * satışı) finansal özete yansıması için tutulan delta. Raporlar bu deltayı
 * günlük seriye EKLER — böylece "iade edilince ciro düşer" kuralı
 * ek kod olmadan çalışır.
 */
export interface LedgerDelta {
  revenue: number;
  collected: number;
  uncollected: number;
  pending: number;
  membership: number;
  refunded: number;
  passes: number;
}

export const EMPTY_LEDGER: LedgerDelta = {
  revenue: 0, collected: 0, uncollected: 0, pending: 0,
  membership: 0, refunded: 0, passes: 0,
};

/* --- Dünya ------------------------------------------------------------- */

export interface DemoWorld {
  parks: DemoPark[];
  sessions: ParkSession[];
  payments: Payment[];
  devices: Device[];
  cameras: Camera[];
  barriers: Barrier[];
  radar: RadarMetric[];
  radarAlerts: RadarAlert[];
  radarNotifications: RadarAlertNotification[];
  slots: ParkSlot[];
  memberships: Membership[];
  packages: MembershipPackage[];
  waitlist: MembershipWaitlist[];
  approvals: MembershipApproval[];
  lists: ListEntry[];
  tickets: SupportTicket[];
  barrierLogs: BarrierLog[];
  pmspLogs: PmspLog[];
  pricings: ParkPricing[];
  pricingPeriods: ParkPricingPeriod[];
  daily: DailyPoint[];
  monthly: MonthlyRevenue[];
  invoices: InvoiceOrder[];
  hourly: HourlyBucket[];
  events: LiveEvent[];
  mobileUser: MobileUser;
  vehicles: Vehicle[];
  cards: SavedCard[];
  ledger: Record<number, LedgerDelta>;
  /** Artan sayaç — yeni kayıt id'leri buradan üretilir (deterministik). */
  seq: number;
}

/* ==========================================================================
   5 · MODÜL META
   ========================================================================== */

export type ModuleId =
  | 'welcome' | 'sessions' | 'barriers' | 'finance' | 'reports'
  | 'payments' | 'memberships' | 'devices' | 'lists' | 'support' | 'mobile'
  /* Gerçek panelde ayrı rotası olan, sonradan yazılan ekranlar */
  | 'hgs-approvals' | 'park-settings' | 'plate-photos' | 'period-comparison'
  /* Partner menüsündeki "Paneli Değiştir > POS Panel" */
  | 'pos';

export type PanelRole = 'admin' | 'shift' | 'accounting';

export interface ModuleMeta {
  id: ModuleId;
  title: string;
  /** Sol menüdeki grup başlığı; null ise grupsuz. */
  group: string | null;
  icon: IconKey;
  /** Tek cümlelik açıklama — launchpad kartlarında kullanılır. */
  desc: string;
  /** Gerçek Zone panelindeki karşılığı. */
  mirrors: string;
  /** Bu modül hangi rollerde görünür. */
  roles: PanelRole[];
  /** Ücretsiz (Site Otopark) tesiste gizlenir mi? */
  hiddenForFreePark?: boolean;
  /** Gerçek panelde karşılığı olmayan demo eki. */
  demoExtra?: boolean;
}

export const MODULES: ModuleMeta[] = [
  {
    id: 'welcome', title: 'Ana Ekran', group: null, icon: 'home',
    desc: 'Tesis bağlamı, günlük özet ve hızlı erişim kartları.',
    mirrors: '/partner/{t}/welcome', roles: ['admin', 'shift', 'accounting'],
  },
  {
    id: 'hgs-approvals', title: 'HGS Onayı', group: 'Park Yönetimi', icon: 'shield',
    desc: 'Kameradan eşleşen geçişlerin tek tek doğrulanıp HGS’ye gönderildiği onay kuyruğu.',
    mirrors: '/partner/{t}/hgs-approvals', roles: ['admin', 'accounting'],
    hiddenForFreePark: true,
  },
  {
    id: 'park-settings', title: 'Ayarlar', group: 'Park Yönetimi', icon: 'cog',
    desc: 'Otoparkın temel bilgileri, kapasite, oturum kuralları ve otomatik onay kriterleri.',
    mirrors: '/partner/{t}/profile', roles: ['admin'],
  },
  {
    id: 'sessions', title: 'Oturumlar', group: 'Park Yönetimi', icon: 'car',
    desc: 'Araç giriş/çıkış oturumları; filtre, detay ve 15 oturum aksiyonu.',
    mirrors: '/partner/{t}/park-sessions', roles: ['admin', 'shift', 'accounting'],
  },
  {
    id: 'plate-photos', title: 'Plaka Fotoğrafları', group: 'Park Yönetimi', icon: 'camera',
    desc: 'Kameraların çektiği her plaka okumasının görsel arşivi ve fotoğraf detayı.',
    mirrors: '/partner/{t}/plate-photos', roles: ['admin', 'shift', 'accounting'],
  },
  {
    id: 'finance', title: 'Finansal Özet', group: 'Finansal', icon: 'chart',
    desc: 'Ciro, tahsilat oranı, ödeme yöntemi kırılımı ve dönem karşılaştırması.',
    mirrors: '/partner/{t}/multi-parks-dashboard', roles: ['admin', 'accounting'],
    hiddenForFreePark: true,
  },
  {
    id: 'reports', title: 'Detaylı Raporlar', group: 'Finansal', icon: 'grid',
    desc: 'Tek tesisin geçiş, doluluk, kamera ve tarife analizi.',
    mirrors: '/partner/{t}/park-performance-report', roles: ['admin', 'accounting'],
    hiddenForFreePark: true,
  },
  {
    id: 'period-comparison', title: 'Dönem Karşılaştırması', group: 'Finansal', icon: 'calendar',
    desc: 'İki dönemin otopark bazında ciro, abone ve oturum kırılımıyla karşılaştırılması.',
    mirrors: '/partner/{t}/period-comparison', roles: ['admin', 'accounting'],
    hiddenForFreePark: true,
  },
  {
    id: 'payments', title: 'Tahsilat', group: 'Finansal', icon: 'money',
    desc: 'Ödemeler, borç listesi ve gişeden ödeme alma.',
    mirrors: '/partner/{t}/payments · /debt-list · /odeme-al',
    roles: ['admin', 'accounting'], hiddenForFreePark: true,
  },
  {
    id: 'memberships', title: 'Abonelikler', group: 'Abonelik', icon: 'star',
    desc: 'Abone kayıtları, paketler, onay kuyruğu ve bekleme listesi.',
    mirrors: '/partner/{t}/member-ships', roles: ['admin', 'accounting'],
  },
  {
    id: 'barriers', title: 'Kamera & Bariyer', group: 'Kamera & Bariyer', icon: 'camera',
    desc: 'Canlı kamera kartları, bariyer kumandası ve olay akışı.',
    mirrors: '/partner/{t}/barriers', roles: ['admin', 'shift'],
  },
  {
    id: 'devices', title: 'Cihazlar & Teknik', group: 'Kamera & Bariyer', icon: 'device',
    desc: 'Cihaz envanteri, topoloji, radar, bariyer kayıtları ve PMSP logları.',
    mirrors: '/partner/{t}/devices · /topology · /radar · /barrier-logs · /pmsp-logs',
    roles: ['admin'],
  },
  {
    id: 'lists', title: 'Beyaz / Kara Liste', group: 'Listeler', icon: 'list',
    desc: 'Ücretsiz geçiş yetkili ve girişi engellenen plakalar.',
    mirrors: '/partner/{t}/white-lists · /black-lists', roles: ['admin', 'shift'],
  },
  {
    id: 'support', title: 'Destek', group: null, icon: 'ticket',
    desc: 'Visiosoft ekibine açılan talepler ve yazışma.',
    mirrors: '/partner/{t}/supports', roles: ['admin', 'shift', 'accounting'],
  },
  {
    id: 'pos', title: 'POS Paneli', group: null, icon: 'wallet',
    desc: 'Gişe uçbirimi — 7 bölüm, kendi açık iOS temasıyla. Partner menüsündeki "Paneli Değiştir > POS Panel".',
    mirrors: '/pos', roles: ['admin', 'shift', 'accounting'],
  },
  {
    id: 'mobile', title: 'Mobil Uygulama', group: null, icon: 'mobile',
    desc: 'Gerçek mobil uygulamanın etkileşimli telefon simülasyonu.',
    mirrors: '— (gerçek Zone panelinde karşılığı yoktur)',
    roles: ['admin', 'shift', 'accounting'], demoExtra: true,
  },
];

export const MODULE_MAP: Record<ModuleId, ModuleMeta> = MODULES.reduce(
  (acc, m) => { acc[m.id] = m; return acc; },
  {} as Record<ModuleId, ModuleMeta>
);

/**
 * Sol menüdeki grup sırası — gerçek panelin sırasıyla aynı
 * (`zone-panel-tam-envanter.md` §1.6). Gerçekte araya giren
 * `Kullanıcılar`, `Mutabakat` ve `Pool` grupları demo kapsamında
 * ayrı ekran olarak yazılmadı; Pool içeriği `Expert` sekmesinde durur.
 * Kalan grupların SIRASI gerçeğiyle birebirdir: Listeler → Expert → Radar → Sistem.
 */
export const MENU_GROUPS = [
  'Park Yönetimi', 'Finansal', 'Abonelik', 'Kamera & Bariyer', 'Listeler',
  'Expert', 'Radar', 'Sistem',
] as const;

/* --------------------------------------------------------------------------
   5.1 · SOL MENÜ — gerçek panelin bağlantı bağlantı karşılığı
   --------------------------------------------------------------------------
   Gerçek Zone'da menünün her satırı AYRI BİR ROTADIR; demoda bu rotaların bir
   kısmı tek modülün sekmeleridir (ör. Ödeme Al / Fiyat Tarifesi / Borç Listesi
   / Ödemeler hepsi `payments` modülünün sekmeleri). Menü bu yüzden modül
   listesinden DEĞİL, aşağıdaki `MENU` tablosundan çizilir: satır sırası,
   grupları ve etiketleri gerçeğin `zone-panel-tam-envanter.md §1.6` listesiyle
   birebirdir; her satır bir (modül, sekme) çiftine bağlanır.
   -------------------------------------------------------------------------- */

export interface MenuEntry {
  /** Menü satırının benzersiz kimliği — sabitleme (pin) anahtarı da budur. */
  id: string;
  label: string;
  module: ModuleId;
  /** Modül içindeki sekme; verilirse satıra basınca o sekme açılır. */
  tab?: string;
  group: string | null;
  icon: IconKey;
  /** Gerçek paneldeki rota. */
  mirrors: string;
  /** Gerçekte olduğu gibi yalnızca TEK otopark seçiliyken görünür. */
  parkOnly?: boolean;
  /** Modülün rollerini daraltır; verilmezse modülün rolleri geçerlidir. */
  roles?: PanelRole[];
  /** Gerçek panelde karşılığı olmayan demo eki. */
  demoExtra?: boolean;
}

export const MENU: MenuEntry[] = [
  /* ---- grupsuz (üst) ---- */
  { id: 'welcome', label: 'Ana Ekran', module: 'welcome', group: null, icon: 'home', mirrors: '/partner/{t}/welcome' },
  { id: 'odeme-al', label: 'Ödeme Al', module: 'payments', tab: 'receive', group: null, icon: 'wallet', mirrors: '/partner/{t}/odeme-al', parkOnly: true },
  { id: 'supports', label: 'Destek', module: 'support', group: null, icon: 'ticket', mirrors: '/partner/{t}/supports' },

  /* ---- Park Yönetimi ---- */
  { id: 'hgs-approvals', label: 'HGS Onayı', module: 'hgs-approvals', group: 'Park Yönetimi', icon: 'shield', mirrors: '/partner/{t}/hgs-approvals', parkOnly: true },
  /* Gerçekte `Ayarlar` Tüm Otoparklar'da da menüdedir; tıklanınca ekran
     "Otopark Seçimi Gerekli" der. parkOnly YAPILMAZ (envanter §1.6: yalnız
     odeme-al, hgs-approvals, payment-methods ve topology otopark bağımlıdır). */
  { id: 'profile', label: 'Ayarlar', module: 'park-settings', group: 'Park Yönetimi', icon: 'cog', mirrors: '/partner/{t}/profile' },
  { id: 'park-sessions', label: 'Oturumlar', module: 'sessions', group: 'Park Yönetimi', icon: 'car', mirrors: '/partner/{t}/park-sessions' },
  { id: 'park-pricings', label: 'Fiyat Tarifesi', module: 'payments', tab: 'pricing', group: 'Park Yönetimi', icon: 'money', mirrors: '/partner/{t}/park-pricings' },
  { id: 'debt-list', label: 'Borç Listesi', module: 'payments', tab: 'debts', group: 'Park Yönetimi', icon: 'alert', mirrors: '/partner/{t}/debt-list' },
  { id: 'plate-photos', label: 'Plaka Fotoğrafları', module: 'plate-photos', group: 'Park Yönetimi', icon: 'camera', mirrors: '/partner/{t}/plate-photos' },

  /* ---- Finansal ---- */
  { id: 'multi-parks-dashboard', label: 'Finansal Özet', module: 'finance', group: 'Finansal', icon: 'chart', mirrors: '/partner/{t}/multi-parks-dashboard' },
  { id: 'park-performance-report', label: 'Detaylı Raporlar', module: 'reports', group: 'Finansal', icon: 'grid', mirrors: '/partner/{t}/park-performance-report' },
  { id: 'period-comparison', label: 'Dönem Karşılaştırması', module: 'period-comparison', group: 'Finansal', icon: 'calendar', mirrors: '/partner/{t}/period-comparison' },
  { id: 'payments', label: 'Ödemeler', module: 'payments', tab: 'payments', group: 'Finansal', icon: 'money', mirrors: '/partner/{t}/payments' },

  /* ---- Abonelik ---- */
  { id: 'member-ship-packages', label: 'Abonelik Paketleri', module: 'memberships', tab: 'packages', group: 'Abonelik', icon: 'gift', mirrors: '/partner/{t}/member-ship-packages' },
  { id: 'member-ships', label: 'Abonelikler', module: 'memberships', tab: 'list', group: 'Abonelik', icon: 'star', mirrors: '/partner/{t}/member-ships' },
  { id: 'membership-waitlists', label: 'Abonelik Sıraları', module: 'memberships', tab: 'approvals', group: 'Abonelik', icon: 'clock', mirrors: '/partner/{t}/membership-waitlists' },

  /* ---- Kamera & Bariyer ---- */
  { id: 'barrier-logs', label: 'Bariyer Kayıtları', module: 'devices', tab: 'barrier-logs', group: 'Kamera & Bariyer', icon: 'doc', mirrors: '/partner/{t}/barrier-logs' },
  { id: 'cameras', label: 'Kameralar', module: 'devices', tab: 'cameras', group: 'Kamera & Bariyer', icon: 'camera', mirrors: '/partner/{t}/cameras' },
  { id: 'devices', label: 'Cihazlar', module: 'devices', tab: 'devices', group: 'Kamera & Bariyer', icon: 'device', mirrors: '/partner/{t}/devices' },
  { id: 'payment-methods', label: 'Ödeme Ayarları', module: 'devices', tab: 'payment-methods', group: 'Kamera & Bariyer', icon: 'wallet', mirrors: '/partner/{t}/payment-methods', parkOnly: true },
  { id: 'barriers', label: 'Kamera & Bariyer', module: 'barriers', group: 'Kamera & Bariyer', icon: 'barrier', mirrors: '/partner/{t}/barriers' },
  { id: 'topology', label: 'Topoloji', module: 'devices', tab: 'topology', group: 'Kamera & Bariyer', icon: 'map', mirrors: '/partner/{t}/topology', parkOnly: true },

  /* ---- Listeler ---- */
  { id: 'white-lists', label: 'Beyaz Listeler', module: 'lists', tab: 'white', group: 'Listeler', icon: 'shield', mirrors: '/partner/{t}/white-lists' },
  { id: 'black-lists', label: 'Kara Listeler', module: 'lists', tab: 'black', group: 'Listeler', icon: 'ban', mirrors: '/partner/{t}/black-lists' },

  /* ---- Radar ---- */
  { id: 'radar', label: 'Radar', module: 'devices', tab: 'radar', group: 'Radar', icon: 'signal', mirrors: '/partner/{t}/radar' },
  { id: 'radar-alerts', label: 'Radar Uyarıları', module: 'devices', tab: 'radar-alerts', group: 'Radar', icon: 'alert', mirrors: '/partner/{t}/radar-alerts' },
  { id: 'radar-alert-notifications', label: 'Radar Uyarı Logları', module: 'devices', tab: 'radar-alert-logs', group: 'Radar', icon: 'bell', mirrors: '/partner/{t}/radar-alert-notifications' },

  /* ---- Expert ---- */
  { id: 'tablet-devices', label: 'Tabletler', module: 'devices', tab: 'expert', group: 'Expert', icon: 'device', mirrors: '/partner/{t}/tablet-devices' },

  /* ---- Sistem ---- */
  { id: 'pmsp-logs', label: 'PMSP Logları', module: 'devices', tab: 'pmsp-logs', group: 'Sistem', icon: 'doc', mirrors: '/partner/{t}/pmsp-logs' },

  /* ---- grupsuz (alt) ---- */
  { id: 'pos', label: 'POS Paneli', module: 'pos', group: null, icon: 'wallet', mirrors: '/pos' },
  { id: 'mobile', label: 'Mobil Uygulama', module: 'mobile', group: null, icon: 'mobile', mirrors: '— (mobil uygulama)', demoExtra: true },
];

/** Menü satırı bu rol + tesis bağlamında görünür mü? */
export function menuVisible(entry: MenuEntry, role: PanelRole, park: DemoPark | null): boolean {
  const meta = MODULE_MAP[entry.module];
  if (!meta || !moduleVisible(meta, role, park)) return false;
  if (entry.roles && !entry.roles.includes(role)) return false;
  // Gerçekte "yalnız otopark seçiliyken" görünen satırlar Tüm Otoparklar'da yok.
  if (entry.parkOnly && park === null) return false;
  return true;
}

/** Bir modülün menüdeki BİRİNCİL satır kimliği (sabitleme anahtarı). */
export function menuIdForModule(module: ModuleId): string {
  const ofModule = MENU.filter((e) => e.module === module);
  return (ofModule.find((e) => e.tab === undefined) ?? ofModule[0])?.id ?? module;
}

/** Seçili (modül, sekme) çiftine karşılık gelen menü satırı. */
export function activeMenuEntry(module: ModuleId, tab: string | undefined): MenuEntry | null {
  const ofModule = MENU.filter((e) => e.module === module);
  if (ofModule.length === 0) return null;
  return (
    ofModule.find((e) => e.tab !== undefined && e.tab === tab) ??
    ofModule.find((e) => e.tab === undefined) ??
    ofModule[0]
  );
}

export const ROLES: { id: PanelRole; label: string; desc: string }[] = [
  { id: 'admin', label: 'Yönetici', desc: 'Tüm modüller açık.' },
  { id: 'shift', label: 'Vardiya Görevlisi', desc: 'Oturumlar, Kamera & Bariyer, Listeler.' },
  { id: 'accounting', label: 'Muhasebe', desc: 'Finansal modüller; teknik grup kapalı.' },
];

/** Üst bardaki otomatik yenileme çipleri. */
export const REFRESH_OPTIONS: { value: number | null; label: string }[] = [
  { value: 2000, label: '2 sn' },
  { value: 5000, label: '5 sn' },
  { value: 10000, label: '10 sn' },
  { value: 30000, label: '30 sn' },
  { value: 60000, label: '1 dk' },
  { value: null, label: 'Kapalı' },
];

/** Rol maskesi — gerçek panelin partner_menu_access davranışını taklit eder. */
export function moduleVisible(meta: ModuleMeta, role: PanelRole, park: DemoPark | null): boolean {
  if (!meta.roles.includes(role)) return false;
  if (meta.hiddenForFreePark && park && park.usageTypeId === 4) return false;
  return true;
}

export function visibleModules(role: PanelRole, park: DemoPark | null): ModuleMeta[] {
  return MODULES.filter((m) => moduleVisible(m, role, park));
}

/* ==========================================================================
   6 · SABİT DEMO SÖZLÜKLERİ (KVKK-temiz, tamamen uydurma)
   ========================================================================== */

const PLATES = opsSection.plates;
const GATES = opsSection.gates;

/** Havuz dışında plaka gerekirse buradan türetilir. */
const PLATE_CITIES = ['34', '06', '35', '16', '07', '01', '41', '55', '38', '27'];
const PLATE_LETTERS = ['VSF', 'ABC', 'KLM', 'TGR', 'PRK', 'NDR', 'BLT', 'ZYN', 'DNZ', 'KYS'];

export function makePlate(seed: number): string {
  const c = PLATE_CITIES[Math.floor(seeded(seed) * PLATE_CITIES.length) % PLATE_CITIES.length];
  const l = PLATE_LETTERS[Math.floor(seeded(seed + 1.7) * PLATE_LETTERS.length) % PLATE_LETTERS.length];
  const n = seededInt(seed + 3.1, 100, 999);
  return `${c} ${l} ${n}`;
}

/** Jenerik, tamamen uydurma kişi/şirket adları. */
const DEMO_FIRST = ['Deniz', 'Ekin', 'Bora', 'Yağmur', 'Aras', 'Selin', 'Kaan', 'Elif', 'Umut', 'Derya', 'Tuna', 'Ceren'];
const DEMO_LAST = ['Demir', 'Aydın', 'Yılmaz', 'Koç', 'Çelik', 'Şahin', 'Aslan', 'Kaya', 'Doğan', 'Erden'];
const DEMO_COMPANY = [
  'Demo Lojistik A.Ş.', 'Örnek Kurye Hizmetleri', 'Numune Gıda Ltd. Şti.',
  'Deneme Teknoloji A.Ş.', 'Model Tesis Yönetimi', 'Prova Kargo Ltd.',
  'Taslak Enerji A.Ş.', 'Şablon Sağlık Hizmetleri',
];

export function demoName(seed: number): string {
  return `${pick(DEMO_FIRST, seed)} ${pick(DEMO_LAST, seed + 2.3)}`;
}
export function demoCompany(seed: number): string {
  return pick(DEMO_COMPANY, seed);
}
export function demoPhone(seed: number): string {
  return `0${seededInt(seed, 530, 559)} ${seededInt(seed + 1, 100, 999)} ${seededInt(seed + 2, 10, 99)} ${seededInt(seed + 3, 10, 99)}`;
}
export function demoEmail(seed: number, name: string): string {
  const slug = name.toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü ]/g, '').replace(/ /g, '.')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o')
    .replace(/ş/g, 's').replace(/ü/g, 'u');
  return `${slug}${seededInt(seed, 10, 99)}@ornek-demo.test`;
}

/** Demo kullanıcı adları (panelde işlem yapan personel). */
export const DEMO_USERS = ['Vardiya Görevlisi 01', 'Vardiya Görevlisi 02', 'Tesis Yöneticisi', 'Muhasebe Uzmanı'];
export const DEMO_AGENTS = ['Visiosoft Destek', 'Visiosoft Teknik Ekip'];

/* ==========================================================================
   7 · TARİFE MOTORU
   ========================================================================== */

/*
 * Brüt (KDV dahil) tarife basamakları artık lib/tariff.ts içindedir.
 * Sahnedeki ledli panelin tarife panosu da aynı basamakları okuduğu için
 * tek adrese taşındı; paymentFlow.ts'teki örnek oturumlarla uyum notu da
 * orada duruyor. Pricing satırında saklanan `amount` bunun KDV'siz karşılığıdır.
 */

export interface FeeBreakdownRow {
  label: string;
  fromMinute: number;
  toMinute: number;
  net: number;
  gross: number;
}

export interface FeeBreakdown {
  durationMin: number;
  rows: FeeBreakdownRow[];
  net: number;
  taxPercent: number;
  tax: number;
  gross: number;
  capped: boolean;
  periodName: string;
  vehicleLabel: string;
  vehicleMultiplier: number;
}

/**
 * Ücret hesabı — gerçek şemayı izler ve GERÇEKTEN `world.pricings`
 * satırlarından okur:
 *   park_pricings satırlarından süre dilimine düşen satır bulunur →
 *   araç sınıfına ait satır yoksa temel satır sınıf çarpanıyla ölçeklenir →
 *   tarife dönemi katsayısı uygulanır → tax_percent eklenir →
 *   parks.max_price tavanı uygulanır.
 *
 * Bu yüzden "Ücreti Yeniden Hesapla" aksiyonu tutarı gerçekten tarife
 * tablosundan yeniden türetir; sabit bir sayı döndürmez.
 */
export function computeFee(
  world: DemoWorld,
  parkId: number,
  entryMin: number,
  exitMin: number,
  vehicleClassId: number
): FeeBreakdown {
  const park = world.parks.find((p) => p.id === parkId) ?? world.parks[0];
  const duration = Math.max(0, Math.round(exitMin - entryMin));
  const vLabel = vehicleClass(vehicleClassId).label;

  const free = (reason: string): FeeBreakdown => ({
    durationMin: duration, rows: [], net: 0, taxPercent: 0, tax: 0, gross: 0,
    capped: false, periodName: reason, vehicleLabel: vLabel, vehicleMultiplier: 1,
  });

  if (park.usageTypeId === 4) return free('Ücretsiz Tesis');

  // Araç sınıfına ait satırlar yoksa temel (Otomobil) satırlar çarpanla kullanılır
  const parkRows = world.pricings.filter((p) => p.parkId === parkId);
  const own = parkRows.filter((p) => p.vehicleClassId === vehicleClassId);
  const base = own.length > 0 ? own : parkRows.filter((p) => p.vehicleClassId === 1);
  if (base.length === 0) return free('Tarife tanımlanmamış');
  const mult = own.length > 0 ? 1 : (VEHICLE_MULTIPLIER[vehicleClassId] ?? 1);

  // Giriş saatine göre tarife dönemi
  const hour = calendar(msOf(BASE_EPOCH, entryMin)).hour;
  const periods = world.pricingPeriods.filter((p) => p.parkId === parkId);
  const period =
    periods.find((p) =>
      p.timeFrom <= p.timeTo ? hour >= p.timeFrom && hour < p.timeTo : hour >= p.timeFrom || hour < p.timeTo
    ) ?? periods[0];
  const factor = period?.factor ?? 1;

  const days = Math.floor(duration / 1440);
  const rest = duration % 1440;

  const rows: FeeBreakdownRow[] = [];
  let gross = 0;

  const grossOf = (row: ParkPricing) => money2(row.amount * (1 + row.taxPercent / 100) * mult * factor);

  if (days > 0) {
    const dayRow = base[base.length - 1];
    const g = money2(grossOf(dayRow) * days);
    rows.push({ label: `${days} tam gün`, fromMinute: 0, toMinute: days * 1440, net: money2(g / 1.2), gross: g });
    gross += g;
  }

  const row = base.find((r) => rest >= r.fromMinute && rest < r.toMinute) ?? base[base.length - 1];
  const rg = grossOf(row);
  rows.push({ label: row.name, fromMinute: row.fromMinute, toMinute: row.toMinute, net: money2(rg / 1.2), gross: rg });
  gross += rg;

  gross = money2(gross);
  let capped = false;
  if (gross > park.maxPrice) {
    gross = park.maxPrice;
    capped = true;
  }

  const net = money2(gross / (1 + park.taxPercent / 100));
  return {
    durationMin: duration,
    rows,
    net,
    taxPercent: park.taxPercent,
    tax: money2(gross - net),
    gross,
    capped,
    periodName: period?.name ?? 'Varsayılan',
    vehicleLabel: vLabel,
    vehicleMultiplier: mult,
  };
}

/* ==========================================================================
   8 · DÜNYA ÜRETİMİ
   ========================================================================== */

/* --- 8.1 Tesisler ------------------------------------------------------ */

/** parkId = 0 sanal kiracısı: "Tüm Otoparklar". */
export const ALL_PARKS_ID = 0;
export const ALL_PARKS_NAME = 'Tüm Otoparklar';

function buildParks(): DemoPark[] {
  return [
    {
      id: 1,
      name: 'Örnek Tesis · Merkez',
      code: 'MRK-01',
      usageTypeId: 3,
      statusId: 1,
      capacityTotal: 1200,
      capacityMembership: 240,
      membershipUsed: 228,
      occupiedNow: 847,
      address: 'Örnek Mahallesi, Demo Caddesi No: 12, Şişli / İstanbul',
      latitude: 41.0602,
      longitude: 28.9872,
      maxPrice: 1000,
      taxPercent: 20,
      debtThresholdDays: 30,
      barrierIntervalTime: 8,
      gapBetweenSession: 5,
      idleSessionLimit: 1440,
      autoApproveSession: true,
      distanceKm: 1.2,
      dailyRevenue: 184320,
      avgDurationMin: 134,
    },
    {
      id: 2,
      name: 'Örnek Tesis · Sahil',
      code: 'SHL-02',
      usageTypeId: 2,
      statusId: 1,
      capacityTotal: 420,
      capacityMembership: 0,
      membershipUsed: 0,
      occupiedNow: 268,
      address: 'Numune Sahil Yolu No: 4, Kadıköy / İstanbul',
      latitude: 40.9821,
      longitude: 29.0271,
      maxPrice: 1000,
      taxPercent: 20,
      debtThresholdDays: 21,
      barrierIntervalTime: 8,
      gapBetweenSession: 5,
      idleSessionLimit: 720,
      autoApproveSession: true,
      distanceKm: 4.8,
      dailyRevenue: 61240,
      avgDurationMin: 96,
    },
    {
      id: 3,
      name: 'Örnek Site Otoparkı',
      code: 'STE-03',
      usageTypeId: 4,
      statusId: 1,
      capacityTotal: 180,
      capacityMembership: 180,
      membershipUsed: 164,
      occupiedNow: 96,
      address: 'Model Konutları, Taslak Sokak No: 1, Ataşehir / İstanbul',
      latitude: 40.9903,
      longitude: 29.1284,
      maxPrice: 0,
      taxPercent: 0,
      debtThresholdDays: 0,
      barrierIntervalTime: 10,
      gapBetweenSession: 10,
      idleSessionLimit: 2880,
      autoApproveSession: true,
      distanceKm: 9.4,
      dailyRevenue: 0,
      avgDurationMin: 612,
    },
  ];
}

/* --- 8.2 Tarife -------------------------------------------------------- */

function buildPricingPeriods(): ParkPricingPeriod[] {
  const out: ParkPricingPeriod[] = [];
  [1, 2].forEach((parkId) => {
    out.push({ id: `PP-${parkId}-1`, parkId, name: 'Gündüz Tarifesi', timeFrom: 6, timeTo: 20, factor: 1 });
    out.push({ id: `PP-${parkId}-2`, parkId, name: 'Gece Tarifesi', timeFrom: 20, timeTo: 6, factor: 0.8 });
  });
  // Üçüncü tesis ücretsiz; yine de şemaya sadık kalınsın diye tanımlı dönem bırakılır.
  out.push({ id: 'PP-3-1', parkId: 3, name: 'Site Tarifesi (Ücretsiz)', timeFrom: 0, timeTo: 24, factor: 0 });
  out.push({ id: 'PP-3-2', parkId: 3, name: 'Misafir Tarifesi (Ücretsiz)', timeFrom: 0, timeTo: 24, factor: 0 });
  return out;
}

function buildPricings(periods: ParkPricingPeriod[]): ParkPricing[] {
  const out: ParkPricing[] = [];
  let i = 0;
  // Merkez tesiste Otomobil ve Motosiklet için ayrı satırlar, Sahil'de yalnızca
  // temel (Otomobil) satırlar tanımlıdır. Diğer sınıflar computeFee içinde
  // VEHICLE_MULTIPLIER ile temel satırdan türetilir — gerçek panelde de her
  // sınıf için satır tanımlamak zorunlu değildir. Toplam 42 satır.
  const plan: [number, number[]][] = [[1, [1, 7]], [2, [1]]];
  plan.forEach(([parkId, classes]) => {
    const period = periods.find((p) => p.parkId === parkId && p.factor === 1)!;
    classes.forEach((vcid) => {
      const vm = VEHICLE_MULTIPLIER[vcid];
      GROSS_BRACKETS.forEach((b) => {
        out.push({
          id: `PR-${pad(++i, 3)}`,
          parkId,
          periodId: period.id,
          name: b.label,
          fromMinute: b.from,
          toMinute: b.to,
          amount: money2((b.gross * vm) / 1.2),
          taxPercent: 20,
          vehicleClassId: vcid,
        });
      });
    });
  });
  return out;
}

/* --- 8.3 Cihaz / kamera / bariyer -------------------------------------- */

/** content.ts opsSection.devices'taki 12 çekirdek kayıt birebir korunur. */
const CORE_DEVICES = opsSection.devices;

const DEVICE_TYPE_BY_PREFIX: Record<string, number> = {
  PTS: 1, BAR: 7, KIOSK: 4, LED: 8, VBOX: 3, RACK: 6,
};

/**
 * Cihaz envanteri.
 *
 * ANA TESİS (Örnek Tesis · Merkez) TAM 38 CİHAZ taşır ve hepsi çevrimiçidir —
 * content.ts opsSection.kpis'teki "Çevrimiçi cihaz 38 / 38 · %100" değeri
 * birebir buradan gelir. Diğer iki tesis kendi küçük filolarına sahiptir
 * (8 ve 5), böylece Topoloji/Radar ekranları onlarda da boş kalmaz;
 * "Tüm Otoparklar" görünümü bu üçünün toplamını gösterir.
 */
function buildDevices(): Device[] {
  const out: Device[] = [];
  const seedBase = 50_000;

  const mk = (
    id: string, name: string, parkId: number, i: number, forceStatus?: 'ok' | 'warning'
  ): Device => {
    const prefix = id.split('-')[0];
    const typeId = DEVICE_TYPE_BY_PREFIX[prefix] ?? 0;
    // Ana tesisin tüm cihazları çevrimiçi (KPI 38/38 · %100)
    const online = parkId === 1 ? true : seeded(seedBase + i * 3) > 0.08;
    return {
      id,
      name,
      parkId,
      typeId,
      statusId: online ? 1 : 2,
      serialNumber: `VSF-${pad(seededInt(seedBase + i * 5, 100000, 999999), 6)}`,
      ipAddress: `10.${20 + parkId}.${seededInt(seedBase + i * 7, 1, 8)}.${seededInt(seedBase + i * 11, 10, 240)}`,
      tailscaleIp: `100.${seededInt(seedBase + i * 13, 64, 120)}.${seededInt(seedBase + i * 17, 0, 255)}.${seededInt(seedBase + i * 19, 1, 254)}`,
      lastOnlineMin: -seededInt(seedBase + i * 23, 0, 14),
      tailscaleOnline: online,
      lensVersion: `2.${seededInt(seedBase + i * 29, 4, 9)}.${seededInt(seedBase + i * 31, 0, 20)}`,
      cameraCount: prefix === 'PTS' ? 1 : prefix === 'VBOX' ? 4 : prefix === 'RACK' ? 6 : 0,
      barrierCount: prefix === 'BAR' ? 1 : 0,
      kioskCount: prefix === 'KIOSK' ? 1 : 0,
      ledCount: prefix === 'LED' ? 1 : 0,
      serviceState: forceStatus === 'warning' ? 'warning' : 'ok',
    };
  };

  // 12 çekirdek kayıt (content.ts opsSection.devices) — birebir korunur
  CORE_DEVICES.forEach((d, i) => {
    out.push(mk(d.id, d.name, 1, i, d.status === 'warn' ? 'warning' : 'ok'));
  });

  // Ana tesisin kalan 26 cihazı — aynı adlandırma şemasıyla türetilir (12 + 26 = 38)
  const centre: [string, string][] = [
    ['PTS-06', 'Giriş Kamerası C'], ['PTS-07', 'Çıkış Kamerası B'],
    ['PTS-08', 'TIR Kapısı Kamerası'], ['PTS-09', 'Kat 2 Rampa'],
    ['PTS-10', 'Kat 3 Rampa'], ['PTS-11', 'Kat 2 Çıkış Kamerası'],
    ['PTS-12', 'Kuzey Çıkış Kamerası'], ['PTS-13', 'Kuzey Giriş Kamerası'],
    ['PTS-14', 'Otopark İçi Yol Üstü'], ['PTS-15', 'Kat 1 Rampa'],
    ['PTS-16', 'Kat 3 Çıkış Kamerası'], ['PTS-17', 'Servis Girişi Kamerası'],
    ['PTS-18', 'Servis Çıkışı Kamerası'], ['PTS-19', 'Bisiklet Kapısı Kamerası'],
    ['BAR-03', 'Bariyer · TIR'], ['BAR-04', 'Bariyer · Kat 2 Giriş'],
    ['BAR-05', 'Bariyer · Kat 2 Çıkış'], ['BAR-06', 'Bariyer · Kuzey Çıkış'],
    ['KIOSK-04', 'Ödeme Kiosk · Kat 2'], ['KIOSK-05', 'Ödeme Kiosk · Kuzey'],
    ['KIOSK-06', 'Ön Ödemeli Kiosk · Giriş'], ['LED-02', 'Kat Yönlendirme LED'],
    ['LED-03', 'Kuzey Doluluk LED'], ['VBOX-02', 'Visiobox · Kat 2'],
    ['VBOX-03', 'Visiobox · Kuzey'], ['RACK-02', 'Rack Kabin · Yedek'],
  ];
  centre.forEach(([id, name], i) => out.push(mk(id, name, 1, 12 + i)));

  // Sahil tesisi (8) ve Site otoparkı (5)
  const others: [string, string, number][] = [
    ['PTS-20', 'Sahil Giriş Kamerası', 2], ['PTS-21', 'Sahil Çıkış Kamerası', 2],
    ['PTS-22', 'Sahil Yan Giriş Kamerası', 2], ['BAR-07', 'Bariyer · Sahil Giriş', 2],
    ['BAR-08', 'Bariyer · Sahil Çıkış', 2], ['KIOSK-07', 'Ödeme Kiosk · Sahil', 2],
    ['VBOX-04', 'Visiobox · Sahil', 2], ['RACK-03', 'Rack Kabin · Sahil', 2],
    ['PTS-23', 'Site Giriş Kamerası', 3], ['PTS-24', 'Site Çıkış Kamerası', 3],
    ['BAR-09', 'Bariyer · Site Giriş', 3], ['BAR-10', 'Bariyer · Site Çıkış', 3],
    ['RACK-04', 'Rack Kabin · Site', 3],
  ];
  others.forEach(([id, name, parkId], i) => out.push(mk(id, name, parkId, 38 + i)));

  return out;
}

function buildCamerasAndBarriers(devices: Device[]): { cameras: Camera[]; barriers: Barrier[] } {
  const cameras: Camera[] = [];
  const barriers: Barrier[] = [];
  const seedBase = 55_000;

  const ptsDevices = devices.filter((d) => d.id.startsWith('PTS'));
  const barDevices = devices.filter((d) => d.id.startsWith('BAR'));

  ptsDevices.forEach((d, i) => {
    const isExit = /Çıkış|Yol Üstü/.test(d.name);
    const camId = `CAM-${pad(i + 1, 2)}`;
    const online = d.statusId === 1 && seeded(seedBase + i * 3) > 0.06;
    cameras.push({
      id: camId,
      deviceId: d.id,
      parkId: d.parkId,
      barrierId: null,
      name: d.name,
      type: isExit ? 2 : 1,
      purpose: /Yol Üstü|Rampa/.test(d.name) ? 'Veri Toplama' : 'Oturum',
      rtspMasked: `rtsp://•••••:•••••@${d.ipAddress}:554/stream1`,
      polygon: '12,78 88,74 92,96 8,98',
      minConfidence: seededInt(seedBase + i * 7, 72, 92),
      isActive: true,
      isBlacklistActive: !isExit,
      isWhitelistOnly: false,
      lastCaptureMin: -seededInt(seedBase + i * 11, 0, 9),
      online,
    });
  });

  // Her bariyer cihazı bir kameraya bağlanır
  barDevices.forEach((d, i) => {
    const cam = cameras.find((c) => c.parkId === d.parkId && c.barrierId === null &&
      (d.name.includes('Çıkış') ? c.type === 2 : c.type === 1));
    const barId = `BRR-${pad(i + 1, 2)}`;
    barriers.push({
      id: barId,
      cameraId: cam?.id ?? cameras[0].id,
      parkId: d.parkId,
      barrierIp: d.ipAddress,
      barrierPort: 8899,
      relayNumber: 1 + (i % 2),
      // BAR-02 (Çıkış) kasıtlı olarak "açık tutuluyor" modunda bırakıldı.
      relayHeld: d.id === 'BAR-02',
    });
    if (cam) cam.barrierId = barId;
  });

  // Kameralardan bazıları sahipsiz bırakılır ("Bağlanmamış" bölümü için)
  const extraCams = 24 - cameras.length;
  for (let i = 0; i < Math.max(0, extraCams); i++) {
    const parkId = (i % 3) + 1;
    cameras.push({
      id: `CAM-${pad(cameras.length + 1, 2)}`,
      deviceId: '',
      parkId,
      barrierId: null,
      name: `Güvenlik Kamerası ${i + 1}`,
      type: 1,
      purpose: 'Güvenlik',
      rtspMasked: 'rtsp://•••••:•••••@10.20.9.' + (30 + i) + ':554/stream1',
      polygon: '10,80 90,76 94,97 6,99',
      minConfidence: 70,
      isActive: true,
      isBlacklistActive: false,
      isWhitelistOnly: false,
      lastCaptureMin: -seededInt(seedBase + 900 + i, 1, 30),
      online: seeded(seedBase + 950 + i) > 0.2,
    });
  }

  return { cameras, barriers };
}

/* --- 8.4 Oturumlar ----------------------------------------------------- */

/** Günün yoğunluk eğrisi — 08-10 ve 17-19 tepe. */
const HOUR_WEIGHTS = [
  0.6, 0.4, 0.3, 0.3, 0.4, 0.8, 1.6, 3.2, 6.4, 6.0, 4.6, 4.2,
  4.4, 4.0, 3.8, 4.0, 4.8, 6.6, 6.2, 4.4, 3.0, 2.2, 1.6, 1.0,
];

function pickHour(seed: number): number {
  const total = HOUR_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = seeded(seed) * total;
  for (let h = 0; h < 24; h++) {
    r -= HOUR_WEIGHTS[h];
    if (r <= 0) return h;
  }
  return 12;
}

const SESSION_STATUS_MIX: readonly (readonly [number, number])[] = [
  [1, 70], [3, 8], [2, 6], [4, 5], [7, 4], [8, 3], [9, 2], [100, 1], [99, 1],
];
const PAYMENT_STATUS_MIX: readonly (readonly [number, number])[] = [
  [2, 62], [3, 22], [4, 8], [5, 6], [6, 2],
];
const DURATION_MIX: readonly (readonly [readonly [number, number], number])[] = [
  [[12, 45], 18], [[45, 90], 24], [[90, 150], 22], [[150, 300], 18],
  [[300, 540], 12], [[540, 1500], 6],
];

function buildSessions(world: Pick<DemoWorld, 'parks' | 'pricings' | 'pricingPeriods' | 'cameras'>): ParkSession[] {
  const out: ParkSession[] = [];
  const seedBase = 1_000;
  const parkMix: readonly (readonly [number, number])[] = [[1, 60], [2, 26], [3, 14]];

  for (let i = 0; i < 462; i++) {
    const s = seedBase + i * 37;
    const parkId = weighted(s, parkMix);
    const park = world.parks.find((p) => p.id === parkId)!;

    // Son 30 gün; son günler daha yoğun
    const dayBias = seeded(s + 1);
    const dayOffset = -Math.floor(dayBias * dayBias * 30);
    const hour = pickHour(s + 2);
    const minute = seededInt(s + 3, 0, 59);

    // Bugünün 00:00'ına göre dakika ofseti
    const todayMidnight = -(calendar(BASE_EPOCH).hour * 60 + calendar(BASE_EPOCH).minute);
    const entryMin = todayMidnight + dayOffset * 1440 + hour * 60 + minute;

    const [dMin, dMax] = weighted<readonly [number, number]>(s + 4, DURATION_MIX);
    const duration = seededInt(s + 5, dMin, dMax);

    // ~%18 hâlâ içeride (yalnızca son 2 günden)
    const stillInside = dayOffset > -2 && seeded(s + 6) < 0.42;
    const exitMin = stillInside ? null : entryMin + duration;

    let sessionStatusId = weighted(s + 7, SESSION_STATUS_MIX);
    let paymentStatusId = stillInside ? 3 : weighted(s + 8, PAYMENT_STATUS_MIX);

    // Ücretsiz tesiste her şey ücretsiz
    if (park.usageTypeId === 4) {
      sessionStatusId = seeded(s + 9) > 0.25 ? 3 : 8;
      paymentStatusId = 5;
    }
    if (sessionStatusId === 2 || sessionStatusId === 3 || sessionStatusId === 8) paymentStatusId = 5;
    if (sessionStatusId === 7) paymentStatusId = 3;

    const vehicleClassId = weighted(s + 10, [
      [1, 74], [4, 8], [7, 6], [8, 5], [2, 3], [5, 2], [6, 1], [3, 1],
    ] as const);

    const fee = exitMin === null
      ? computeFee(world as DemoWorld, parkId, entryMin, entryMin + duration, vehicleClassId)
      : computeFee(world as DemoWorld, parkId, entryMin, exitMin, vehicleClassId);

    let amount = paymentStatusId === 5 ? 0 : fee.gross;
    if (sessionStatusId === 100) amount = money2(amount * 3.4); // yüksek tutar
    if (sessionStatusId === 7) amount = 0;

    const parkCams = world.cameras.filter((c) => c.parkId === parkId);
    const inCam = parkCams.filter((c) => c.type === 1)[i % Math.max(1, parkCams.filter((c) => c.type === 1).length)];
    const outCam = parkCams.filter((c) => c.type === 2)[i % Math.max(1, parkCams.filter((c) => c.type === 2).length)];

    const plate = i < PLATES.length * 6 ? pick(PLATES, s + 11) : makePlate(s + 11);

    out.push({
      id: `SES-${pad(1000 + i, 5)}`,
      parkId,
      sessionUid: `PS-2026-${pad(462 - i, 6)}`,
      plateTxt: plate,
      entryMin,
      exitMin,
      amount,
      taxPercent: park.taxPercent,
      paymentStatusId,
      sessionStatusId,
      vehicleClassId,
      gateIn: GATES[Math.floor(seeded(s + 12) * 2)],
      gateOut: exitMin === null ? null : GATES[2 + Math.floor(seeded(s + 13) * 2)],
      cameraInId: inCam?.id ?? null,
      cameraOutId: exitMin === null ? null : outCam?.id ?? null,
      paymentBy: paymentStatusId === 2 ? paymentMethod(weighted(s + 14, [[1, 44], [2, 22], [14, 14], [13, 8], [15, 7], [19, 5]] as const)).label : null,
      paymentTransactionId: paymentStatusId === 2 ? `TX-${pad(seededInt(s + 15, 1000000, 9999999), 7)}` : null,
      notes: seeded(s + 16) > 0.88 ? 'Gişe notu: plaka görüntüsü elle doğrulandı.' : '',
      actions: [
        { at: entryMin, by: 'Sistem', label: 'Oturum açıldı', detail: `Kamera: ${inCam?.name ?? '—'}` },
        ...(exitMin !== null
          ? [{ at: exitMin, by: 'Sistem', label: 'Oturum kapandı', detail: `Süre: ${formatDuration(duration)}` }]
          : []),
      ],
      isImported: seeded(s + 17) > 0.93,
      mutabakatIsMatched: paymentStatusId === 2 && seeded(s + 18) > 0.18,
      createdBy: sessionStatusId === 6 ? pick(DEMO_USERS, s + 19) : 'Sistem',
    });
  }

  return out.sort((a, b) => b.entryMin - a.entryMin);
}

/* --- 8.5 Ödemeler ------------------------------------------------------ */

function buildPayments(sessions: ParkSession[], memberships: Membership[]): Payment[] {
  const out: Payment[] = [];
  const seedBase = 20_000;
  let n = 0;

  // Ödendi / Başarısız / İade edilmiş oturumların yanı sıra, çıkış yapmış ama
  // tahsil edilememiş oturumlar da "Bekliyor" durumunda birer Payment satırı
  // üretir — gerçek sistemde de tahsilat denemesi kayıt bırakır.
  sessions
    .filter(
      (s) =>
        s.paymentStatusId === 2 || s.paymentStatusId === 4 || s.paymentStatusId === 6 ||
        (s.paymentStatusId === 3 && s.exitMin !== null && s.amount > 0)
    )
    .forEach((s, i) => {
      const seed = seedBase + i * 13;
      const serviceId = weighted(seed, [[1, 40], [2, 20], [14, 14], [13, 9], [15, 8], [11, 5], [19, 4]] as const);
      const statusId = s.paymentStatusId;
      out.push({
        id: `PAY-${pad(5000 + n++, 5)}`,
        parkSessionId: s.id,
        membershipId: null,
        parkId: s.parkId,
        plateTxt: s.plateTxt,
        serviceId,
        amount: s.amount,
        taxPercent: s.taxPercent,
        statusId,
        categoryId: 5,
        channel: weighted(seed + 1, [['Sistem', 58], ['Kiosk', 18], ['Partner', 12], ['Mobil', 8], ['API', 4]] as const),
        intentId: `IN-${pad(seededInt(seed + 2, 10000000, 99999999), 8)}`,
        approveAtMin: statusId === 2 ? (s.exitMin ?? s.entryMin) + 1 : null,
        createdAtMin: (s.exitMin ?? s.entryMin) + 1,
        refundedAtMin: statusId === 6 ? (s.exitMin ?? s.entryMin) + seededInt(seed + 3, 60, 2880) : null,
        refundReason: statusId === 6 ? 'Hatalı ücretlendirme' : null,
        serviceMessage:
          statusId === 4 ? 'Yetersiz bakiye'
            : statusId === 3 ? 'Tahsilat bekleniyor'
              : 'İşlem onaylandı',
        invoiceStatus: weighted(seed + 4, [['completed', 30], ['sent', 20], ['skipped', 45], ['failed', 5]] as const),
      });
    });

  // Abonelik ödemeleri
  memberships.forEach((m, i) => {
    const seed = seedBase + 9000 + i * 7;
    out.push({
      id: `PAY-${pad(5000 + n++, 5)}`,
      parkSessionId: null,
      membershipId: m.id,
      parkId: m.parkId,
      plateTxt: m.plateTxt,
      serviceId: m.paymentMethodId,
      amount: m.amount,
      taxPercent: 20,
      statusId: m.paymentStatusId,
      categoryId: 6,
      channel: m.fromMobile ? 'Mobil' : weighted(seed, [['Partner', 60], ['API', 25], ['Sistem', 15]] as const),
      intentId: `IN-${pad(seededInt(seed + 1, 10000000, 99999999), 8)}`,
      approveAtMin: m.paymentStatusId === 2 ? m.subscribedAtMin : null,
      createdAtMin: m.subscribedAtMin,
      refundedAtMin: null,
      refundReason: null,
      serviceMessage: 'Abonelik tahsilatı',
      invoiceStatus: weighted(seed + 2, [['completed', 55], ['sent', 25], ['skipped', 15], ['failed', 5]] as const),
    });
  });

  return out.sort((a, b) => b.createdAtMin - a.createdAtMin);
}

/* --- 8.6 Abonelikler --------------------------------------------------- */

function buildPackages(): MembershipPackage[] {
  const rows: Omit<MembershipPackage, 'id'>[] = [
    { parkId: 1, name: 'Aylık Bireysel', cost: 2450, durationDays: 30, audience: 'Bireysel', vehicleClassId: 1, paymentMethodIds: [14, 15, 7], pricingType: 'Ücretsiz', pricingValue: 0, pricingUsageType: 'Süre Boyunca', requiresDocument: false, active: true, isPurchasable: true, description: '30 gün boyunca sınırsız giriş-çıkış.' },
    { parkId: 1, name: '3 Aylık Bireysel', cost: 6600, durationDays: 90, audience: 'Bireysel', vehicleClassId: 1, paymentMethodIds: [14, 7], pricingType: 'Ücretsiz', pricingValue: 0, pricingUsageType: 'Süre Boyunca', requiresDocument: false, active: true, isPurchasable: true, description: 'Üç aylık peşin ödemede indirimli paket.' },
    { parkId: 1, name: 'Kurumsal Filo', cost: 9800, durationDays: 30, audience: 'Kurumsal', vehicleClassId: 4, paymentMethodIds: [7], pricingType: 'Yüzde', pricingValue: 15, pricingUsageType: 'Oturum Başına', requiresDocument: true, active: true, isPurchasable: true, description: 'Filo araçları için kurumsal fatura ve belge onayı gerektirir.' },
    { parkId: 1, name: 'Gece Aboneliği', cost: 1250, durationDays: 30, audience: 'Bireysel', vehicleClassId: 1, paymentMethodIds: [14], pricingType: 'Sabit Fiyat', pricingValue: 0, pricingUsageType: 'Süre Boyunca', requiresDocument: false, active: true, isPurchasable: true, description: '20:00 - 08:00 arası sınırsız kullanım.' },
    { parkId: 1, name: 'Motosiklet Aylık', cost: 980, durationDays: 30, audience: 'Bireysel', vehicleClassId: 7, paymentMethodIds: [14, 15], pricingType: 'Ücretsiz', pricingValue: 0, pricingUsageType: 'Süre Boyunca', requiresDocument: false, active: true, isPurchasable: true, description: 'Motosiklet park alanı için aylık abonelik.' },
    { parkId: 2, name: 'Sahil Aylık', cost: 1850, durationDays: 30, audience: 'Bireysel', vehicleClassId: 1, paymentMethodIds: [14, 15], pricingType: 'Ücretsiz', pricingValue: 0, pricingUsageType: 'Süre Boyunca', requiresDocument: false, active: true, isPurchasable: true, description: 'Sahil tesisinde 30 gün geçerli.' },
    { parkId: 2, name: 'Sahil Hafta Sonu', cost: 760, durationDays: 30, audience: 'Bireysel', vehicleClassId: 1, paymentMethodIds: [14], pricingType: 'Sabit İndirim', pricingValue: 40, pricingUsageType: 'Oturum Başına', requiresDocument: false, active: true, isPurchasable: false, description: 'Cumartesi-Pazar günleri geçerli indirimli paket.' },
    { parkId: 3, name: 'Site Sakini', cost: 0, durationDays: 365, audience: 'Bireysel', vehicleClassId: 1, paymentMethodIds: [], pricingType: 'Ücretsiz', pricingValue: 0, pricingUsageType: 'Süre Boyunca', requiresDocument: true, active: true, isPurchasable: false, description: 'Daire sahibi araçları — ücretsiz, belge onaylıdır.' },
    { parkId: 3, name: 'Site Misafir', cost: 0, durationDays: 30, audience: 'Her İkisi', vehicleClassId: 1, paymentMethodIds: [], pricingType: 'Ücretsiz', pricingValue: 0, pricingUsageType: 'Oturum Başına', requiresDocument: false, active: true, isPurchasable: false, description: 'Misafir araçlar için geçici kayıt.' },
  ];
  return rows.map((r, i) => ({ ...r, id: `PKG-${pad(i + 1, 2)}` }));
}

function buildMemberships(packages: MembershipPackage[]): Membership[] {
  const out: Membership[] = [];
  const seedBase = 80_000;
  const statusMix: readonly (readonly [MembershipStatusId, number])[] = [
    ['active', 66], ['expired', 12], ['terminated', 7], ['pending', 5],
    ['doc_pending', 7], ['doc_rejected', 3],
  ];

  for (let i = 0; i < 64; i++) {
    const s = seedBase + i * 29;
    const parkId = weighted(s, [[1, 60], [3, 28], [2, 12]] as const);
    const parkPackages = packages.filter((p) => p.parkId === parkId);
    const pkg = parkPackages[Math.floor(seeded(s + 1) * parkPackages.length) % parkPackages.length];
    const statusId = weighted(s + 2, statusMix);
    const name = demoName(s + 3);
    const isCompany = pkg.audience === 'Kurumsal' || seeded(s + 4) > 0.78;
    const startDay = -seededInt(s + 5, 2, 300);
    const subscribedAtMin = startDay * 1440 + seededInt(s + 6, 0, 1439);
    let availableUntilMin = subscribedAtMin + pkg.durationDays * 1440;
    if (statusId === 'expired') availableUntilMin = -seededInt(s + 7, 60, 20000);
    if (statusId === 'active' && availableUntilMin < 0) availableUntilMin = seededInt(s + 8, 1440, 60 * 1440);

    const extCount = statusId === 'active' ? seededInt(s + 9, 0, 3) : 0;
    const extensions: MembershipExtension[] = [];
    let cursor = subscribedAtMin + pkg.durationDays * 1440;
    for (let e = 0; e < extCount; e++) {
      const add = seededInt(s + 10 + e, 15, 60) * 1440;
      extensions.push({
        previousUntilMin: cursor,
        newUntilMin: cursor + add,
        type: weighted(s + 20 + e, [['odeme', 70], ['hediye', 20], ['duzeltme', 10]] as const),
        note: 'Abonelik uzatma işlemi.',
        atMin: cursor - seededInt(s + 30 + e, 60, 2880),
      });
      cursor += add;
    }
    if (extCount > 0 && statusId === 'active') availableUntilMin = cursor;

    out.push({
      id: `MEM-${pad(2000 + i, 5)}`,
      parkId,
      subUserName: name,
      subUserPhone: demoPhone(s + 40),
      subUserEmail: demoEmail(s + 41, name),
      companyName: isCompany ? demoCompany(s + 42) : null,
      companyVat: isCompany ? String(seededInt(s + 43, 1000000000, 9999999999)) : null,
      plateTxt: seeded(s + 44) > 0.5 ? pick(PLATES, s + 45) : makePlate(s + 46),
      packageId: pkg.id,
      amount: pkg.cost,
      statusId,
      paymentMethodId: pkg.paymentMethodIds[0] ?? 9,
      paymentStatusId: statusId === 'active' ? 2 : statusId === 'pending' ? 3 : statusId === 'terminated' ? 6 : 2,
      subscribedAtMin,
      availableUntilMin,
      autoRenew: statusId === 'active' && seeded(s + 47) > 0.45,
      terminatedAtMin: statusId === 'terminated' ? -seededInt(s + 48, 100, 9000) : null,
      extensions,
      activities: [
        { atMin: subscribedAtMin, label: 'Abonelik oluşturuldu', by: 'Sistem' },
        ...(statusId === 'active' ? [{ atMin: subscribedAtMin + 2, label: 'Ödeme onaylandı', by: 'Sistem' }] : []),
        ...extensions.map((e) => ({ atMin: e.atMin, label: 'Abonelik uzatıldı', by: pick(DEMO_USERS, e.atMin) })),
      ],
      fromMobile: seeded(s + 49) > 0.62,
    });
  }
  return out.sort((a, b) => b.subscribedAtMin - a.subscribedAtMin);
}

function buildWaitlist(packages: MembershipPackage[]): MembershipWaitlist[] {
  const out: MembershipWaitlist[] = [];
  const seedBase = 85_000;
  for (let i = 0; i < 11; i++) {
    const s = seedBase + i * 17;
    const parkId = seeded(s) > 0.35 ? 1 : 3;
    const parkPackages = packages.filter((p) => p.parkId === parkId);
    out.push({
      id: `WL-${pad(i + 1, 3)}`,
      parkId,
      position: i + 1,
      name: demoName(s + 1),
      phone: demoPhone(s + 2),
      plateTxt: makePlate(s + 3),
      packageId: parkPackages[i % parkPackages.length].id,
      status: weighted(s + 4, [['Bekliyor', 62], ['Bilgilendirildi', 20], ['Aboneliğe Çevrildi', 12], ['İptal', 6]] as const),
      createdAtMin: -seededInt(s + 5, 1440, 40000),
      notifiedAtMin: seeded(s + 6) > 0.7 ? -seededInt(s + 7, 100, 4000) : null,
    });
  }
  return out;
}

function buildApprovals(packages: MembershipPackage[]): MembershipApproval[] {
  const out: MembershipApproval[] = [];
  const seedBase = 87_000;
  for (let i = 0; i < 7; i++) {
    const s = seedBase + i * 23;
    const parkId = seeded(s) > 0.5 ? 1 : 3;
    const parkPackages = packages.filter((p) => p.parkId === parkId && p.requiresDocument);
    out.push({
      id: `APR-${pad(i + 1, 3)}`,
      parkId,
      name: demoName(s + 1),
      phone: demoPhone(s + 2),
      plateTxt: makePlate(s + 3),
      packageId: (parkPackages[0] ?? packages[0]).id,
      documentNames: ['ruhsat-onyuz.jpg', 'ikametgah.pdf'].slice(0, seededInt(s + 4, 1, 2)),
      createdAtMin: -seededInt(s + 5, 1440, 14 * 1440),
      status: 'pending',
    });
  }
  return out;
}

/* --- 8.7 Listeler ------------------------------------------------------ */

function buildLists(): ListEntry[] {
  const out: ListEntry[] = [];
  const seedBase = 90_000;
  for (let i = 0; i < 34; i++) {
    const s = seedBase + i * 11;
    out.push({
      id: `WLE-${pad(i + 1, 3)}`,
      parkId: weighted(s, [[1, 60], [2, 20], [3, 20]] as const),
      kind: 'white',
      plateTxt: seeded(s + 1) > 0.6 ? pick(PLATES, s + 2) : makePlate(s + 3),
      name: seeded(s + 4) > 0.4 ? demoName(s + 5) : `Tesis Personeli ${pad(i + 1)}`,
      companyName: seeded(s + 6) > 0.45 ? demoCompany(s + 7) : '',
      phone: demoPhone(s + 8),
      description: pick(['Personel aracı', 'Resmî araç', 'Abone aracı', 'Tedarikçi', 'Engelli aracı'], s + 9),
      expiryAtMin: seeded(s + 10) > 0.6 ? seededInt(s + 11, 5, 200) * 1440 : null,
      createdAtMin: -seededInt(s + 12, 1440, 200 * 1440),
      deleted: false,
    });
  }
  for (let i = 0; i < 12; i++) {
    const s = seedBase + 5000 + i * 13;
    out.push({
      id: `BLE-${pad(i + 1, 3)}`,
      parkId: weighted(s, [[1, 62], [2, 24], [3, 14]] as const),
      kind: 'black',
      plateTxt: makePlate(s + 1),
      name: demoName(s + 2),
      companyName: seeded(s + 3) > 0.7 ? demoCompany(s + 4) : '',
      phone: demoPhone(s + 5),
      description: pick(['Tekrarlayan ödenmemiş borç', 'Bariyer hasarı', 'Sahte plaka şüphesi', 'Yönetim kararı'], s + 6),
      expiryAtMin: seeded(s + 7) > 0.5 ? seededInt(s + 8, 10, 120) * 1440 : null,
      createdAtMin: -seededInt(s + 9, 1440, 120 * 1440),
      deleted: false,
    });
  }
  return out;
}

/* --- 8.8 Destek -------------------------------------------------------- */

const TICKET_SUBJECTS = [
  'Kiosk fiş yazıcısı kâğıt hatası veriyor',
  'Abonelik ödemesi iki kez çekildi',
  'Çıkış bariyeri gece açılmıyor',
  'Plaka tanıma sisli havada düşüyor',
  'Mutabakat raporunda fark var',
  'Yeni kullanıcı ekleyemiyorum',
  'Kat 3 kiosk ekranı donuyor',
  'HGS tahsilatı bekliyor görünüyor',
  'Mobil uygulamada borç görünmüyor',
  'LED panel yanlış doluluk gösteriyor',
  'Kamera poligonu güncellenmeli',
  'Beyaz liste cihazlara gitmiyor',
  'Fatura numarası oluşmadı',
  'Raporda dönem karşılaştırması boş geliyor',
  'Tır kapısı kamerası offline',
  'Abonelik kotası dolu uyarısı',
];

function buildTickets(): SupportTicket[] {
  const out: SupportTicket[] = [];
  const seedBase = 95_000;
  for (let i = 0; i < 16; i++) {
    const s = seedBase + i * 31;
    const status = weighted<TicketStatusId>(s, [
      ['open', 26], ['in_progress', 22], ['waiting_customer', 14],
      ['technical_review', 12], ['resolved', 14], ['closed', 12],
    ] as const);
    const createdAtMin = -seededInt(s + 1, 120, 40 * 1440);
    const replyCount = seededInt(s + 2, 0, 4);
    const replies: TicketReply[] = [];
    for (let r = 0; r < replyCount; r++) {
      const isAgent = r % 2 === 0;
      replies.push({
        id: `REP-${pad(i, 2)}-${r}`,
        sender: isAgent ? 'agent' : 'partner',
        body: isAgent
          ? 'Talebiniz teknik ekibe iletildi. Cihaz loglarını inceliyoruz; 24 saat içinde dönüş yapacağız.'
          : 'Sorun bugün tekrar yaşandı, ekran görüntüsünü ekliyorum.',
        attachments: !isAgent && seeded(s + 10 + r) > 0.7 ? [{ name: 'ekran-goruntusu.png', sizeKb: seededInt(s + 20 + r, 120, 2400) }] : [],
        createdAtMin: createdAtMin + (r + 1) * seededInt(s + 30 + r, 60, 900),
        isInternalNote: false,
      });
    }
    const source = seeded(s + 3) > 0.62 ? 'mobil' : 'portal';
    out.push({
      id: `SUP-${pad(400 + i, 4)}`,
      parkId: weighted(s + 4, [[1, 58], [2, 26], [3, 16]] as const),
      subject: TICKET_SUBJECTS[i],
      content: 'Merhaba, aşağıdaki durumu paylaşmak istiyorum. Sorun dün akşam saatlerinde başladı ve bugün de devam ediyor. Yardımcı olabilir misiniz?',
      category: weighted<TicketCategoryId>(s + 5, [['other', 34], ['accounting', 26], ['subscription', 24], ['complaint_suggestion', 16]] as const),
      status,
      priority: weighted<TicketPriorityId>(s + 6, [['normal', 48], ['high', 26], ['low', 16], ['urgent', 10]] as const),
      source,
      createdBy: source === 'mobil' ? 'Mobil Kullanıcı' : pick(DEMO_USERS, s + 7),
      assignedTo: status === 'open' ? null : pick(DEMO_AGENTS, s + 8),
      plateTxt: seeded(s + 9) > 0.6 ? pick(PLATES, s + 11) : null,
      createdAtMin,
      updatedAtMin: replies.length ? replies[replies.length - 1].createdAtMin : createdAtMin,
      closedAtMin: status === 'closed' || status === 'resolved' ? createdAtMin + seededInt(s + 12, 900, 5000) : null,
      attachments: seeded(s + 13) > 0.7 ? [{ name: 'kiosk-hata.jpg', sizeKb: seededInt(s + 14, 200, 3200) }] : [],
      replies,
    });
  }
  return out.sort((a, b) => b.updatedAtMin - a.updatedAtMin);
}

/* --- 8.9 Radar / loglar ------------------------------------------------ */

function buildRadar(devices: Device[]): RadarMetric[] {
  const seedBase = 60_000;
  return devices.map((d, i) => {
    const s = seedBase + i * 19;
    // RACK-01 kasıtlı olarak eşik aşar (alarm tetikler, Dikkat Kuyruğu'nda görünür)
    const critical = d.id === 'RACK-01';
    return {
      deviceId: d.id,
      parkId: d.parkId,
      sampledAtMin: -seededInt(s, 0, 20),
      cpuLoad: critical ? 88 : seededInt(s + 1, 15, 75),
      ramPercent: critical ? 91 : seededInt(s + 2, 35, 85),
      diskPercent: critical ? 94 : seededInt(s + 3, 40, 80),
      temperature: critical ? 92 : seededInt(s + 4, 45, 78),
      backendLatencyMs: critical ? 480 : seededInt(s + 5, 40, 350),
      uptimeSeconds: seededInt(s + 6, 3600, 86400 * 90),
      camerasOnline: d.cameraCount === 0 ? 0 : Math.max(0, d.cameraCount - (seeded(s + 7) > 0.9 ? 1 : 0)),
      camerasTotal: d.cameraCount,
      isStale: d.statusId === 2 || seeded(s + 8) > 0.94,
    };
  });
}

const DEFAULT_THRESHOLDS: RadarThresholds = {
  temperature: 90, ram: 90, disk: 90, cpu: 90, latencyMs: 1000, cameraTimeoutMin: 5,
};

function buildRadarAlerts(): RadarAlert[] {
  const names = [
    'Sıcaklık Eşiği · Merkez', 'Disk Doluluk · Merkez', 'CPU Yükü · Sahil',
    'Kamera Erişimi · Merkez', 'Backend Gecikmesi · Tümü', 'Bellek · Site',
  ];
  return names.map((name, i) => ({
    id: `RAL-${pad(i + 1, 2)}`,
    parkId: i === 2 ? 2 : i === 5 ? 3 : 1,
    name,
    thresholds: { ...DEFAULT_THRESHOLDS },
    recipients: ['operasyon@ornek-demo.test'],
    mailFrequency: 'daily',
    isActive: i !== 4,
    lastSentMin: i < 3 ? -seededInt(62_000 + i, 60, 3000) : null,
  }));
}

function buildRadarNotifications(alerts: RadarAlert[]): RadarAlertNotification[] {
  const out: RadarAlertNotification[] = [];
  for (let i = 0; i < 14; i++) {
    const s = 63_000 + i * 7;
    const alert = alerts[i % alerts.length];
    out.push({
      id: `RAN-${pad(i + 1, 3)}`,
      alertId: alert.id,
      deviceId: i % 3 === 0 ? 'RACK-01' : `PTS-${pad(seededInt(s, 1, 9))}`,
      parkId: alert.parkId,
      checks: i % 3 === 0 ? ['Sıcaklık 92 °C > 90 °C', 'Disk %94 > %90'] : ['Backend gecikmesi eşiği aşıldı'],
      sentAtMin: -seededInt(s + 1, 30, 20000),
    });
  }
  return out;
}

function buildBarrierLogs(cameras: Camera[], barriers: Barrier[]): BarrierLog[] {
  const out: BarrierLog[] = [];
  const seedBase = 100_000;
  for (let i = 0; i < 60; i++) {
    const s = seedBase + i * 13;
    const barrier = barriers[i % barriers.length];
    const cam = cameras.find((c) => c.id === barrier.cameraId) ?? cameras[0];
    out.push({
      id: `BLG-${pad(i + 1, 4)}`,
      userName: pick(DEMO_USERS, s),
      parkId: barrier.parkId,
      cameraId: cam.id,
      deviceSerial: `VSF-${pad(seededInt(s + 1, 100000, 999999), 6)}`,
      barrierIp: barrier.barrierIp,
      action: 'Bariyer Aç',
      outcome: weighted(s + 2, [['opened', 82], ['failed', 12], ['unconfirmed', 6]] as const),
      transport: weighted(s + 3, [['pmsp', 72], ['gate', 28]] as const),
      description: pick(['Ödeme sonrası manuel açma', 'Plaka okunamadı', 'Acil durum', 'Abone aracı doğrulandı', 'Kiosk arızası'], s + 4),
      createdAtMin: -seededInt(s + 5, 5, 30 * 1440),
    });
  }
  return out.sort((a, b) => b.createdAtMin - a.createdAtMin);
}

function buildPmspLogs(devices: Device[], cameras: Camera[], barriers: Barrier[]): PmspLog[] {
  const out: PmspLog[] = [];
  const seedBase = 110_000;
  for (let i = 0; i < 220; i++) {
    const s = seedBase + i * 7;
    const device = devices[i % devices.length];
    const messageType = weighted<PmspMessageType>(s, [
      ['UnlockBarrier', 18], ['TakeSnapshot', 16], ['SendSnapshot', 14],
      ['BootNotification', 10], ['PayWithPos', 12], ['UpdateWhitelist', 9],
      ['GetInformation', 7], ['SendInformation', 6], ['SetConfiguration', 4],
      ['UpdateBlacklist', 4],
    ] as const);
    const level = weighted(s + 1, [[1, 56], [4, 22], [2, 14], [3, 8]] as const);
    out.push({
      id: `PMS-${pad(i + 1, 4)}`,
      parkId: device.parkId,
      recordedAtMin: -seededInt(s + 2, 1, 3 * 1440),
      level,
      category: weighted(s + 3, [[1, 20], [2, 18], [3, 16], [4, 16], [5, 12], [6, 10], [8, 8]] as const),
      messageType,
      deviceId: device.id,
      cameraId: cameras[i % cameras.length]?.id ?? null,
      barrierId: messageType === 'UnlockBarrier' ? barriers[i % barriers.length].id : null,
      payload: `{"type":"${messageType}","device":"${device.id}","seq":${1000 + i}}`,
      response: level === 3
        ? `{"status":"ERROR","message":"TIMEOUT"}`
        : `{"status":"OK","code":200,"note":"${messageType === 'UnlockBarrier' ? 'EXIT GRANTED' : 'ACK'}"}`,
      messageUid: `MU-${pad(seededInt(s + 4, 100000, 999999), 6)}`,
    });
  }
  return out.sort((a, b) => b.recordedAtMin - a.recordedAtMin);
}

/* --- 8.10 Doluluk şeması ---------------------------------------------- */

function buildSlots(sessions: ParkSession[]): ParkSlot[] {
  const out: ParkSlot[] = [];
  const seedBase = 65_000;
  const inside = sessions.filter((s) => s.parkId === 1 && s.exitMin === null);
  let insideIdx = 0;
  for (let floor = 1; floor <= 3; floor++) {
    for (let i = 0; i < 62; i++) {
      const s = seedBase + floor * 1000 + i * 3;
      const col = i % 31;
      const row = Math.floor(i / 31);
      const status = weighted(s, [['dolu', 58], ['bos', 26], ['abone', 12], ['engelli', 4]] as const);
      const session = status === 'dolu' && insideIdx < inside.length ? inside[insideIdx++] : null;
      out.push({
        id: `SLOT-${floor}-${pad(i + 1, 2)}`,
        parkId: 1,
        floor,
        code: `K${floor}-${String.fromCharCode(65 + row)}${pad(col + 1)}`,
        status,
        sessionId: session?.id ?? null,
        x: r2(6 + col * 3.05),
        y: r2(18 + row * 34),
      });
    }
  }
  return out;
}

/* --- 8.11 Finansal seriler -------------------------------------------- */

/** Haftanın gününe göre ciro katsayısı (0 = Pazar). */
const WEEKDAY_FACTOR = [0.72, 1.04, 1.06, 1.05, 1.08, 1.16, 0.89];

function buildDaily(parks: DemoPark[]): DailyPoint[] {
  const out: DailyPoint[] = [];
  const seedBase = 70_000;
  parks.forEach((park) => {
    for (let d = 0; d >= -179; d--) {
      const s = seedBase + park.id * 10_000 + Math.abs(d) * 13;
      const cal = calendar(BASE_EPOCH + d * 86_400_000);
      const wf = WEEKDAY_FACTOR[cal.weekday];
      const drift = 1 + (seeded(s) - 0.5) * 0.16 + (d / 179) * 0.06;
      const revenue = d === 0 && park.dailyRevenue > 0
        ? park.dailyRevenue
        : Math.round(park.dailyRevenue * wf * drift);
      const collectRate = 0.88 + seeded(s + 1) * 0.08;
      const collected = Math.round(revenue * collectRate);
      const uncollected = Math.round(revenue * (1 - collectRate) * 0.62);
      const pending = Math.max(0, revenue - collected - uncollected);
      const passes = Math.round((revenue > 0 ? revenue / 118 : 0) + park.capacityTotal * 0.55 * (revenue > 0 ? 1 : 0.4));
      out.push({
        parkId: park.id,
        dayOffset: d,
        revenue,
        collected,
        uncollected,
        pending,
        membership: Math.round(park.capacityMembership * 62 * wf * (0.9 + seeded(s + 2) * 0.3)),
        passes,
        entries: Math.round(passes * 0.51),
        exits: Math.round(passes * 0.49),
        freePasses: Math.round(passes * 0.04),
        memberPasses: Math.round(passes * (park.usageTypeId === 4 ? 0.86 : 0.14)),
        whitelistPasses: Math.round(passes * 0.05),
        hgsPending: Math.round(passes * 0.018),
      });
    }
  });
  return out;
}

function buildMonthly(parks: DemoPark[], daily: DailyPoint[]): MonthlyRevenue[] {
  const out: MonthlyRevenue[] = [];
  parks.forEach((park) => {
    for (let m = 0; m >= -11; m--) {
      const s = 120_000 + park.id * 100 + Math.abs(m);
      const cal = calendar(BASE_EPOCH + m * 30 * 86_400_000);
      const base = park.dailyRevenue * 30 * (0.92 + seeded(s) * 0.2);
      const collected = Math.round(base * (0.88 + seeded(s + 1) * 0.07));
      const uncollected = Math.round(base * 0.05);
      out.push({
        parkId: park.id,
        monthOffset: m,
        label: `${cal.monthName} ${cal.year}`,
        totalRevenue: Math.round(base),
        collected,
        uncollected,
        pending: Math.max(0, Math.round(base) - collected - uncollected),
        sessionCount: Math.round(park.capacityTotal * 16 * (0.9 + seeded(s + 2) * 0.2)),
        memberRevenue: Math.round(park.capacityMembership * 1850 * (0.85 + seeded(s + 3) * 0.3)),
        expense: Math.round(base * (0.34 + seeded(s + 4) * 0.1)),
      });
    }
  });
  // `daily` parametresi ileride gün bazlı düzeltme için tutuluyor
  void daily;
  return out;
}

function buildHourly(parks: DemoPark[]): HourlyBucket[] {
  const out: HourlyBucket[] = [];
  const total = HOUR_WEIGHTS.reduce((a, b) => a + b, 0);
  parks.forEach((park) => {
    const dayPasses = Math.round(park.capacityTotal * 1.6);
    let occ = Math.round(park.occupiedNow * 0.42);
    for (let h = 0; h < 24; h++) {
      const share = HOUR_WEIGHTS[h] / total;
      const passCount = Math.round(dayPasses * share);
      const delta = h >= 7 && h <= 10 ? 1 : h >= 17 && h <= 20 ? -1 : 0;
      occ = Math.max(0, Math.min(park.capacityTotal, occ + Math.round(passCount * 0.42 * delta) + seededInt(75_000 + park.id * 100 + h, -12, 12)));
      out.push({
        parkId: park.id,
        hour: h,
        passCount,
        revenue: Math.round(park.dailyRevenue * share),
        occupancy: occ,
        occupancyRate: r2(occ / park.capacityTotal),
      });
    }
  });
  return out;
}

function buildInvoices(payments: Payment[]): InvoiceOrder[] {
  const out: InvoiceOrder[] = [];
  const seedBase = 125_000;
  const invoiceable = payments.filter((p) => p.categoryId === 6).slice(0, 22);
  invoiceable.forEach((p, i) => {
    const s = seedBase + i * 11;
    const status = weighted(s, [['completed', 55], ['sent', 24], ['failed', 12], ['skipped', 9]] as const);
    out.push({
      id: `INV-${pad(i + 1, 3)}`,
      referenceId: `REF-${pad(seededInt(s + 1, 100000, 999999), 6)}`,
      paymentId: p.id,
      membershipId: p.membershipId,
      plateTxt: p.plateTxt,
      status,
      orderNumber: `EF-${pad(seededInt(s + 2, 10000, 99999), 5)}`,
      errorMessage: status === 'failed' ? 'Vergi numarası doğrulanamadı.' : null,
      sentAtMin: p.createdAtMin + 4,
      settledAtMin: status === 'completed' ? p.createdAtMin + seededInt(s + 3, 10, 240) : null,
    });
  });
  return out;
}

/* --- 8.12 Mobil kullanıcı dünyası -------------------------------------- */

function buildMobile(): { user: MobileUser; vehicles: Vehicle[]; cards: SavedCard[] } {
  return {
    user: {
      name: 'Demo Kullanıcı',
      email: 'demo@ornek-demo.test',
      phone: '0500 000 00 00',
      notificationsEnabled: true,
    },
    vehicles: [
      { id: 'VHC-1', plateTxt: PLATES[0], isDefault: true },
      { id: 'VHC-2', plateTxt: PLATES[3], isDefault: false },
      { id: 'VHC-3', plateTxt: PLATES[8], isDefault: false },
      { id: 'VHC-4', plateTxt: PLATES[12], isDefault: false },
    ],
    // GÜVENLİK: tam kart numarası hiçbir yerde tutulmaz.
    cards: [
      { id: 'CRD-1', brand: 'Visa', last3: '123', holderName: 'DEMO KULLANICI', expireMonth: 11, expireYear: 29, isDefault: true, isExpired: false },
      { id: 'CRD-2', brand: 'Mastercard', last3: '456', holderName: 'DEMO KULLANICI', expireMonth: 4, expireYear: 27, isDefault: false, isExpired: false },
      { id: 'CRD-3', brand: 'Troy', last3: '789', holderName: 'DEMO KULLANICI', expireMonth: 2, expireYear: 25, isDefault: false, isExpired: true },
    ],
  };
}

/* --- 8.13 Olay akışı çekirdeği ---------------------------------------- */

function buildEvents(sessions: ParkSession[]): LiveEvent[] {
  const recent = sessions.slice(0, 26);
  return recent.map((s, i) => {
    const kind: EventKind = s.exitMin === null ? 'entry' : s.paymentStatusId === 2 ? 'payment' : 'exit';
    return {
      id: `EVT-${pad(i + 1, 4)}`,
      kind,
      parkId: s.parkId,
      atMin: s.exitMin ?? s.entryMin,
      plate: s.plateTxt,
      cameraId: s.exitMin === null ? s.cameraInId : s.cameraOutId,
      barrierId: null,
      amount: kind === 'payment' ? s.amount : null,
      text:
        kind === 'entry' ? `${s.plateTxt} · ${s.gateIn} girişi`
          : kind === 'payment' ? `${s.plateTxt} · ${formatTL(s.amount)} tahsil edildi`
            : `${s.plateTxt} · ${s.gateOut ?? 'Çıkış'} çıkışı`,
      read: i > 6,
    };
  });
}

/* --- 8.14 buildWorld --------------------------------------------------- */

/**
 * Tüm demo dünyasını üretir. SAF FONKSİYON: argüman almaz, yan etkisi
 * yoktur ve her çağrıda aynı çıktıyı verir.
 */
export function buildWorld(): DemoWorld {
  const parks = buildParks();
  const pricingPeriods = buildPricingPeriods();
  const pricings = buildPricings(pricingPeriods);
  const devices = buildDevices();
  const { cameras, barriers } = buildCamerasAndBarriers(devices);

  const partial = { parks, pricings, pricingPeriods, cameras };
  const sessions = buildSessions(partial);

  const packages = buildPackages();
  const memberships = buildMemberships(packages);
  const payments = buildPayments(sessions, memberships);

  const daily = buildDaily(parks);
  const ledger: Record<number, LedgerDelta> = {};
  parks.forEach((p) => { ledger[p.id] = { ...EMPTY_LEDGER }; });

  return {
    parks,
    sessions,
    payments,
    devices,
    cameras,
    barriers,
    radar: buildRadar(devices),
    radarAlerts: buildRadarAlerts(),
    radarNotifications: buildRadarNotifications(buildRadarAlerts()),
    slots: buildSlots(sessions),
    memberships,
    packages,
    waitlist: buildWaitlist(packages),
    approvals: buildApprovals(packages),
    lists: buildLists(),
    tickets: buildTickets(),
    barrierLogs: buildBarrierLogs(cameras, barriers),
    pmspLogs: buildPmspLogs(devices, cameras, barriers),
    pricings,
    pricingPeriods,
    daily,
    monthly: buildMonthly(parks, daily),
    invoices: buildInvoices(payments),
    hourly: buildHourly(parks),
    events: buildEvents(sessions),
    mobileUser: buildMobile().user,
    vehicles: buildMobile().vehicles,
    cards: buildMobile().cards,
    ledger,
    seq: 1,
  };
}

/* ==========================================================================
   9 · SELECTOR'LAR — modül yazarları bunları kullanır
   ========================================================================== */

/** parkId = 0 ise filtre uygulanmaz ("Tüm Otoparklar"). */
export const inPark = <T extends { parkId: number }>(rows: T[], parkId: number): T[] =>
  parkId === ALL_PARKS_ID ? rows : rows.filter((r) => r.parkId === parkId);

export const findPark = (world: DemoWorld, parkId: number): DemoPark | null =>
  world.parks.find((p) => p.id === parkId) ?? null;

export const parkName = (world: DemoWorld, parkId: number): string =>
  parkId === ALL_PARKS_ID ? ALL_PARKS_NAME : (findPark(world, parkId)?.name ?? '—');

export interface HeadlineKpis {
  occupied: number;
  capacity: number;
  occupancyRate: number;
  dailyRevenue: number;
  avgDurationMin: number;
  devicesOnline: number;
  devicesTotal: number;
}

/**
 * Panelin RESMÎ KPI kaynağı. Tek tesis seçiliyken 1. tesis için
 * content.ts opsSection.kpis ile birebir aynı sayıları verir
 * (847/1.200 · 184.320 ₺ · 2s 14dk · 38/38).
 */
export function selectHeadlineKpis(world: DemoWorld, parkId: number): HeadlineKpis {
  const parks = parkId === ALL_PARKS_ID ? world.parks : world.parks.filter((p) => p.id === parkId);
  const devices = inPark(world.devices, parkId);
  const occupied = parks.reduce((s, p) => s + p.occupiedNow, 0);
  const capacity = parks.reduce((s, p) => s + p.capacityTotal, 0);
  const ledger = parkId === ALL_PARKS_ID
    ? world.parks.reduce((s, p) => s + (world.ledger[p.id]?.revenue ?? 0), 0)
    : (world.ledger[parkId]?.revenue ?? 0);
  const revenue = parks.reduce((s, p) => s + p.dailyRevenue, 0) + ledger;
  const avg = parks.length
    ? Math.round(parks.reduce((s, p) => s + p.avgDurationMin * p.capacityTotal, 0) / Math.max(1, capacity))
    : 0;
  return {
    occupied,
    capacity,
    occupancyRate: capacity ? occupied / capacity : 0,
    dailyRevenue: revenue,
    avgDurationMin: avg,
    devicesOnline: devices.filter((d) => d.statusId === 1).length,
    devicesTotal: devices.length,
  };
}

export type PeriodKey =
  | 'today' | 'week' | 'month' | 'last24' | 'last7' | 'last30' | 'all' | 'custom';

export const PERIODS: { key: PeriodKey; label: string; group: 'calendar' | 'rolling' | 'other' }[] = [
  { key: 'today', label: 'Bugün', group: 'calendar' },
  { key: 'week', label: 'Bu Hafta', group: 'calendar' },
  { key: 'month', label: 'Bu Ay', group: 'calendar' },
  { key: 'last24', label: 'Son 24 Saat', group: 'rolling' },
  { key: 'last7', label: 'Son 7 Gün', group: 'rolling' },
  { key: 'last30', label: 'Son 30 Gün', group: 'rolling' },
  { key: 'all', label: 'Tüm Zamanlar', group: 'other' },
  { key: 'custom', label: 'Özel', group: 'other' },
];

/** Dönem → gün ofset aralığı [from, 0]. */
export function periodRange(key: PeriodKey, epochMs: number): { from: number; to: number; days: number } {
  const cal = calendar(epochMs);
  switch (key) {
    case 'today': case 'last24': return { from: 0, to: 0, days: 1 };
    case 'week': return { from: -(cal.weekday === 0 ? 6 : cal.weekday - 1), to: 0, days: cal.weekday === 0 ? 7 : cal.weekday };
    case 'month': return { from: -(cal.day - 1), to: 0, days: cal.day };
    case 'last7': return { from: -6, to: 0, days: 7 };
    case 'last30': return { from: -29, to: 0, days: 30 };
    default: return { from: -179, to: 0, days: 180 };
  }
}

export interface FinanceSummary {
  revenue: number;
  collected: number;
  uncollected: number;
  pending: number;
  membership: number;
  refunded: number;
  grandTotal: number;
  collectRate: number;
  failRate: number;
  passes: number;
  entries: number;
  exits: number;
  freePasses: number;
  memberPasses: number;
  whitelistPasses: number;
  hgsPending: number;
  days: number;
}

/**
 * Dönem finansal özeti — günlük seriden toplanır ve kullanıcı
 * etkileşimlerinin deltası (`world.ledger`) eklenir. Bu yüzden bir iade
 * yapıldığında ciro rakamı EK KOD OLMADAN düşer.
 */
export function selectFinanceSummary(
  world: DemoWorld,
  parkId: number,
  period: PeriodKey,
  epochMs: number,
  custom?: { from: number; to: number }
): FinanceSummary {
  const range = period === 'custom' && custom ? custom : periodRange(period, epochMs);
  const rows = inPark(world.daily, parkId).filter(
    (d) => d.dayOffset >= range.from && d.dayOffset <= range.to
  );
  const sum = (fn: (d: DailyPoint) => number) => rows.reduce((s, d) => s + fn(d), 0);

  const parkIds = parkId === ALL_PARKS_ID ? world.parks.map((p) => p.id) : [parkId];
  const led = parkIds.reduce<LedgerDelta>((acc, id) => {
    const l = world.ledger[id] ?? EMPTY_LEDGER;
    return {
      revenue: acc.revenue + l.revenue,
      collected: acc.collected + l.collected,
      uncollected: acc.uncollected + l.uncollected,
      pending: acc.pending + l.pending,
      membership: acc.membership + l.membership,
      refunded: acc.refunded + l.refunded,
      passes: acc.passes + l.passes,
    };
  }, { ...EMPTY_LEDGER });

  const revenue = Math.max(0, sum((d) => d.revenue) + led.revenue);
  const collected = Math.max(0, sum((d) => d.collected) + led.collected);
  const uncollected = Math.max(0, sum((d) => d.uncollected) + led.uncollected);
  const pending = Math.max(0, sum((d) => d.pending) + led.pending);
  const membership = Math.max(0, sum((d) => d.membership) + led.membership);
  const passes = sum((d) => d.passes) + led.passes;

  return {
    revenue,
    collected,
    uncollected,
    pending,
    membership,
    refunded: led.refunded,
    grandTotal: revenue + membership,
    collectRate: revenue ? collected / revenue : 0,
    failRate: revenue ? uncollected / revenue : 0,
    passes,
    entries: sum((d) => d.entries),
    exits: sum((d) => d.exits),
    freePasses: sum((d) => d.freePasses),
    memberPasses: sum((d) => d.memberPasses),
    whitelistPasses: sum((d) => d.whitelistPasses),
    hgsPending: sum((d) => d.hgsPending),
    days: rows.length,
  };
}

/** Ödeme yöntemi kırılımı — dönem toplamı sabit bir karışım oranına dağıtılır. */
export interface MethodBreakdownRow {
  serviceId: number;
  label: string;
  amount: number;
  count: number;
  vehicles: number;
  share: number;
}

const METHOD_MIX: [number, number][] = [
  [1, 0.41], [2, 0.19], [14, 0.13], [13, 0.08], [15, 0.07],
  [11, 0.05], [19, 0.04], [9, 0.03],
];

export function selectMethodBreakdown(total: number, passes: number): MethodBreakdownRow[] {
  return METHOD_MIX.map(([serviceId, share]) => ({
    serviceId,
    label: paymentMethod(serviceId).label,
    amount: Math.round(total * share),
    count: Math.round(passes * share),
    vehicles: Math.round(passes * share * 0.94),
    share,
  }));
}

/* --- Oturum filtreleri ------------------------------------------------- */

export interface SessionFilter {
  /** 'all' | 'inside' | 'exited' | 'paid' | 'unpaid' */
  tab?: string;
  search?: string;
  paymentStatusId?: number | null;
  sessionStatusId?: number | null;
  vehicleClassId?: number | null;
  parkId?: number | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  minDuration?: number | null;
  maxDuration?: number | null;
  entryFromMin?: number | null;
  entryToMin?: number | null;
  imported?: 'all' | 'yes' | 'no';
}

export const sessionDuration = (s: ParkSession, nowMin: number): number =>
  Math.max(0, Math.round((s.exitMin ?? nowMin) - s.entryMin));

export function selectSessions(
  world: DemoWorld,
  parkId: number,
  filter: SessionFilter,
  nowMin = 0
): ParkSession[] {
  let rows = inPark(world.sessions, parkId);
  const f = filter;

  if (f.tab === 'inside') rows = rows.filter((s) => s.exitMin === null);
  else if (f.tab === 'exited') rows = rows.filter((s) => s.exitMin !== null);
  else if (f.tab === 'paid') rows = rows.filter((s) => s.paymentStatusId === 2);
  else if (f.tab === 'unpaid') rows = rows.filter((s) => s.paymentStatusId === 3 || s.paymentStatusId === 4);

  if (f.search) {
    const q = f.search.toLocaleUpperCase('tr-TR').replace(/\s/g, '');
    rows = rows.filter(
      (s) => s.plateTxt.replace(/\s/g, '').includes(q) || s.sessionUid.includes(q) || s.id.includes(q)
    );
  }
  if (f.parkId) rows = rows.filter((s) => s.parkId === f.parkId);
  if (f.paymentStatusId) rows = rows.filter((s) => s.paymentStatusId === f.paymentStatusId);
  if (f.sessionStatusId) rows = rows.filter((s) => s.sessionStatusId === f.sessionStatusId);
  if (f.vehicleClassId) rows = rows.filter((s) => s.vehicleClassId === f.vehicleClassId);
  if (f.minAmount != null) rows = rows.filter((s) => s.amount >= f.minAmount!);
  if (f.maxAmount != null) rows = rows.filter((s) => s.amount <= f.maxAmount!);
  if (f.minDuration != null) rows = rows.filter((s) => sessionDuration(s, nowMin) >= f.minDuration!);
  if (f.maxDuration != null) rows = rows.filter((s) => sessionDuration(s, nowMin) <= f.maxDuration!);
  if (f.entryFromMin != null) rows = rows.filter((s) => s.entryMin >= f.entryFromMin!);
  if (f.entryToMin != null) rows = rows.filter((s) => s.entryMin <= f.entryToMin!);
  if (f.imported === 'yes') rows = rows.filter((s) => s.isImported);
  if (f.imported === 'no') rows = rows.filter((s) => !s.isImported);

  return rows;
}

/** Genel amaçlı sıralama — Table bileşeniyle birlikte kullanılır. */
export function sortRows<T>(
  rows: T[],
  key: string | null,
  dir: 'asc' | 'desc',
  accessor: (row: T, key: string) => string | number | null
): T[] {
  if (!key) return rows;
  const out = [...rows];
  out.sort((a, b) => {
    const va = accessor(a, key);
    const vb = accessor(b, key);
    if (va === null || va === undefined) return 1;
    if (vb === null || vb === undefined) return -1;
    if (typeof va === 'number' && typeof vb === 'number') return dir === 'asc' ? va - vb : vb - va;
    const cmp = String(va).localeCompare(String(vb), 'tr-TR');
    return dir === 'asc' ? cmp : -cmp;
  });
  return out;
}

/** Sayfa dilimi — 462 satır hiçbir zaman tek seferde DOM'a basılmaz. */
export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export const pageCount = (total: number, pageSize: number): number =>
  Math.max(1, Math.ceil(total / pageSize));

/* --- Borç listesi ------------------------------------------------------ */

export function selectDebts(world: DemoWorld, parkId: number): ParkSession[] {
  const parks = parkId === ALL_PARKS_ID ? world.parks : world.parks.filter((p) => p.id === parkId);
  const ids = new Set(parks.filter((p) => p.usageTypeId !== 4).map((p) => p.id));
  return world.sessions.filter(
    (s) => ids.has(s.parkId) && s.exitMin !== null && s.amount > 0 &&
      (s.paymentStatusId === 3 || s.paymentStatusId === 4) && s.sessionStatusId !== 7
  );
}

/* --- Dikkat Kuyruğu ---------------------------------------------------- */

/**
 * Gerçek Zone panelinde "ihlal" diye bir varlık yoktur. Bu kuyruk,
 * gerçek enum değerlerine dayanan kalemleri tek yerde toplar.
 */
export function selectAttentionItems(world: DemoWorld, parkId: number): AttentionItem[] {
  const out: AttentionItem[] = [];
  const alert = world.radarAlerts[0]?.thresholds ?? DEFAULT_THRESHOLDS;

  inPark(world.radar, parkId).forEach((m) => {
    const breaches: string[] = [];
    if (m.temperature >= alert.temperature) breaches.push(`Sıcaklık ${m.temperature} °C`);
    if (m.diskPercent >= alert.disk) breaches.push(`Disk %${m.diskPercent}`);
    if (m.ramPercent >= alert.ram) breaches.push(`Bellek %${m.ramPercent}`);
    if (m.cpuLoad >= alert.cpu) breaches.push(`CPU %${m.cpuLoad}`);
    if (m.backendLatencyMs >= alert.latencyMs) breaches.push(`Gecikme ${m.backendLatencyMs} ms`);
    if (breaches.length) {
      out.push({
        id: `AT-RAD-${m.deviceId}`, kind: 'radar', refId: m.deviceId, parkId: m.parkId,
        severity: 'danger', label: `${m.deviceId} eşik aşımı`, detail: breaches.join(' · '),
        targetModule: 'devices', targetTab: 'radar',
      });
    }
  });

  inPark(world.cameras, parkId).filter((c) => !c.online).forEach((c) => {
    out.push({
      id: `AT-CAM-${c.id}`, kind: 'offline_camera', refId: c.id, parkId: c.parkId,
      severity: 'warning', label: `${c.name} çevrimdışı`, detail: 'Kamera görüntü göndermiyor.',
      targetModule: 'barriers',
    });
  });

  inPark(world.sessions, parkId).forEach((s) => {
    if (s.sessionStatusId === 99) {
      out.push({
        id: `AT-VER-${s.id}`, kind: 'pending_verify', refId: s.id, parkId: s.parkId,
        severity: 'warning', label: `${s.plateTxt} doğrulama bekliyor`,
        detail: `Giriş ${formatDuration(Math.abs(s.entryMin))} önce`,
        targetModule: 'sessions', targetFilter: { sessionStatusId: '99' },
      });
    }
    if (s.sessionStatusId === 100) {
      out.push({
        id: `AT-AMT-${s.id}`, kind: 'high_amount', refId: s.id, parkId: s.parkId,
        severity: 'danger', label: `${s.plateTxt} yüksek tutar`, detail: formatTL(s.amount),
        targetModule: 'sessions', targetFilter: { sessionStatusId: '100' },
      });
    }
    if (s.sessionStatusId === 4) {
      out.push({
        id: `AT-IDL-${s.id}`, kind: 'idle_session', refId: s.id, parkId: s.parkId,
        severity: 'warning', label: `${s.plateTxt} çıkışı belirsiz`,
        detail: 'Oturum kapanmadı; çıkış kaydı doğrulanmalı.',
        targetModule: 'sessions', targetFilter: { sessionStatusId: '4' },
      });
    }
  });

  inPark(world.approvals, parkId).filter((a) => a.status === 'pending').forEach((a) => {
    out.push({
      id: `AT-DOC-${a.id}`, kind: 'doc_approval', refId: a.id, parkId: a.parkId,
      severity: 'info', label: `${a.name} belge onayı bekliyor`,
      detail: `${a.plateTxt} · ${a.documentNames.length} belge`,
      targetModule: 'memberships', targetTab: 'approvals',
    });
  });

  selectDebts(world, parkId).slice(0, 18).forEach((s) => {
    out.push({
      id: `AT-DEBT-${s.id}`, kind: 'unpaid_debt', refId: s.id, parkId: s.parkId,
      severity: 'warning', label: `${s.plateTxt} borcu`, detail: formatTL(s.amount),
      targetModule: 'payments', targetTab: 'debts',
    });
  });

  const hgs = inPark(world.daily, parkId).filter((d) => d.dayOffset === 0)
    .reduce((s, d) => s + d.hgsPending, 0);
  if (hgs > 0) {
    out.push({
      id: 'AT-HGS', kind: 'hgs_approval', refId: 'hgs', parkId: parkId,
      severity: 'info', label: `HGS onayı bekleyen ${formatInt(hgs)} araç`,
      detail: 'Bugünkü geçişler onay kuyruğunda.', targetModule: 'payments', targetTab: 'payments',
    });
  }

  return out;
}

/* ==========================================================================
   10 · SAF MUTASYON YARDIMCILARI
   ==========================================================================
   Hem panel aksiyonları hem de MOBİL aksiyonlar bu yardımcıları kullanır —
   köprü kuralının can alıcı noktası budur: mobil ödeme, paneldeki tahsilat
   ile AYNI kodu çalıştırır, dolayısıyla panelde birebir görünür.
   ========================================================================== */

/**
 * Çalışma sırasında üretilen kayıt id'si. 'U' (kullanıcı/çalışma zamanı)
 * ön eki, tohumlu kayıtlarla (PAY-05012, SES-01314 …) karışmasını ve
 * id çakışmasını imkânsız kılar.
 */
export const nextId = (world: DemoWorld, prefix: string): string =>
  `${prefix}-U${pad(world.seq, 5)}`;

export function addLedger(world: DemoWorld, parkId: number, delta: Partial<LedgerDelta>): Record<number, LedgerDelta> {
  const cur = world.ledger[parkId] ?? EMPTY_LEDGER;
  return {
    ...world.ledger,
    [parkId]: {
      revenue: cur.revenue + (delta.revenue ?? 0),
      collected: cur.collected + (delta.collected ?? 0),
      uncollected: cur.uncollected + (delta.uncollected ?? 0),
      pending: cur.pending + (delta.pending ?? 0),
      membership: cur.membership + (delta.membership ?? 0),
      refunded: cur.refunded + (delta.refunded ?? 0),
      passes: cur.passes + (delta.passes ?? 0),
    },
  };
}

export interface CreatePaymentInput {
  session?: ParkSession | null;
  membershipId?: string | null;
  parkId: number;
  plateTxt: string;
  serviceId: number;
  amount: number;
  channel: PaymentChannel;
  categoryId?: 5 | 6;
  atMin: number;
  statusId?: number;
}

export function makePayment(world: DemoWorld, input: CreatePaymentInput): Payment {
  const seed = world.seq * 97 + 13;
  return {
    id: nextId(world, 'PAY'),
    parkSessionId: input.session?.id ?? null,
    membershipId: input.membershipId ?? null,
    parkId: input.parkId,
    plateTxt: input.plateTxt,
    serviceId: input.serviceId,
    amount: money2(input.amount),
    taxPercent: findPark(world, input.parkId)?.taxPercent ?? 20,
    statusId: input.statusId ?? 2,
    categoryId: input.categoryId ?? 5,
    channel: input.channel,
    intentId: `IN-${pad(seededInt(seed, 10000000, 99999999), 8)}`,
    approveAtMin: input.atMin,
    createdAtMin: input.atMin,
    refundedAtMin: null,
    refundReason: null,
    serviceMessage: 'İşlem onaylandı',
    invoiceStatus: input.categoryId === 6 ? 'sent' : 'skipped',
  };
}

export function pushSessionAction(s: ParkSession, action: SessionAction): ParkSession {
  return { ...s, actions: [...s.actions, action] };
}

/** Bir oturumu ödenmiş hâle getirir; panel ve mobil aynı yolu kullanır. */
export function markSessionPaid(s: ParkSession, by: string, atMin: number): ParkSession {
  return pushSessionAction(
    { ...s, paymentStatusId: 2, paymentBy: by, paymentTransactionId: `TX-${pad(Math.abs(Math.round(atMin * 977)) % 10_000_000, 7)}` },
    { at: atMin, by, label: 'Ödeme alındı', detail: formatTL(s.amount) }
  );
}

export function makeBarrierLog(
  world: DemoWorld,
  input: Omit<BarrierLog, 'id'>
): BarrierLog {
  return { ...input, id: nextId(world, 'BLG') };
}

export function makeEvent(
  world: DemoWorld,
  kind: EventKind,
  parkId: number,
  text: string,
  extra?: Partial<LiveEvent>
): LiveEvent {
  return {
    id: nextId(world, 'EVT'),
    kind,
    parkId,
    atMin: extra?.atMin ?? 0,
    plate: extra?.plate ?? null,
    cameraId: extra?.cameraId ?? null,
    barrierId: extra?.barrierId ?? null,
    amount: extra?.amount ?? null,
    text,
    read: false,
  };
}

/* ==========================================================================
   11 · SİMÜLASYON
   ========================================================================== */

/** Liste tavanları — bellek ve render maliyeti sabit kalsın diye. */
export const CAPS = { sessions: 600, events: 120, pmspLogs: 300, barrierLogs: 200, payments: 520 };

export interface TickResult {
  world: DemoWorld;
  notifications: PanelNotification[];
}

/**
 * Tek bir simülasyon adımı — TAMAMEN DETERMİNİSTİK.
 * `Math.random` ve `Date.now` kullanılmaz; her şey `tick` tohumundan türer.
 *
 * Üretilenler: yeni araç girişi, çıkış + ücret + ödeme/borç, bariyer
 * olayı, kara liste reddi, radar dalgalanması ve PMSP log satırı.
 */
export function simulateTick(world: DemoWorld, tick: number, nowMin: number): TickResult {
  const s = tick * 7919;
  const notifications: PanelNotification[] = [];

  let sessions = world.sessions;
  let payments = world.payments;
  let events = world.events;
  let pmspLogs = world.pmspLogs;
  let barrierLogs = world.barrierLogs;
  let ledger = world.ledger;
  let seq = world.seq;

  const next = { ...world };
  const bump = () => { seq += 1; next.seq = seq; };

  const activeParks = world.parks;
  const hour = calendar(msOf(BASE_EPOCH, nowMin)).hour;
  const intensity = HOUR_WEIGHTS[hour] / 6.6; // 0..1

  /* --- 1) Yeni giriş(ler) --------------------------------------------- */
  const entryCount = seeded(s + 1) < intensity * 0.85 ? (seeded(s + 2) > 0.75 ? 2 : 1) : 0;
  for (let i = 0; i < entryCount; i++) {
    const seed = s + 10 + i * 3;
    const park = activeParks[Math.floor(seeded(seed) * activeParks.length) % activeParks.length];
    const plate = seeded(seed + 1) > 0.45 ? pick(PLATES, seed + 2) : makePlate(seed + 3);
    const cams = world.cameras.filter((c) => c.parkId === park.id && c.type === 1);
    const cam = cams[Math.floor(seeded(seed + 4) * Math.max(1, cams.length)) % Math.max(1, cams.length)];

    // Kara liste kontrolü — liste modülüne eklenen plaka burada gerçekten iş yapar
    const black = world.lists.find(
      (l) => l.kind === 'black' && !l.deleted && l.plateTxt === plate &&
        (l.parkId === park.id || l.parkId === ALL_PARKS_ID)
    );
    if (black) {
      bump();
      events = [makeEvent(next, 'denied', park.id, `${plate} · kara liste — geçiş reddedildi`, { atMin: nowMin, plate, cameraId: cam?.id ?? null }), ...events];
      continue;
    }

    const white = world.lists.find(
      (l) => l.kind === 'white' && !l.deleted && l.plateTxt === plate && l.parkId === park.id
    );
    const member = world.memberships.find(
      (m) => m.plateTxt === plate && m.parkId === park.id && m.statusId === 'active'
    );

    bump();
    const session: ParkSession = {
      id: nextId(next, 'SES'),
      parkId: park.id,
      sessionUid: `PS-2026-${pad(500000 + seq, 6)}`,
      plateTxt: plate,
      entryMin: nowMin,
      exitMin: null,
      amount: 0,
      taxPercent: park.taxPercent,
      paymentStatusId: white || member || park.usageTypeId === 4 ? 5 : 3,
      sessionStatusId: white ? 2 : member ? 3 : park.usageTypeId === 4 ? 8 : 1,
      vehicleClassId: weighted(seed + 5, [[1, 78], [4, 8], [7, 6], [8, 4], [2, 2], [6, 2]] as const),
      gateIn: GATES[Math.floor(seeded(seed + 6) * 2)],
      gateOut: null,
      cameraInId: cam?.id ?? null,
      cameraOutId: null,
      paymentBy: null,
      paymentTransactionId: null,
      notes: '',
      actions: [{ at: nowMin, by: 'Sistem', label: 'Oturum açıldı', detail: `Kamera: ${cam?.name ?? '—'}` }],
      isImported: false,
      mutabakatIsMatched: false,
      createdBy: 'Sistem',
    };
    sessions = [session, ...sessions];
    events = [makeEvent(next, 'entry', park.id, `${plate} · ${session.gateIn} girişi`, { atMin: nowMin, plate, cameraId: cam?.id ?? null }), ...events];
    bump();
  }

  /* --- 2) Çıkış + tahsilat -------------------------------------------- */
  if (seeded(s + 40) < intensity * 0.7) {
    const active = sessions.filter((x) => x.exitMin === null && x.sessionStatusId !== 7);
    if (active.length) {
      const idx = Math.floor(seeded(s + 41) * active.length) % active.length;
      const target = active[idx];
      const park = findPark(world, target.parkId)!;
      const outCams = world.cameras.filter((c) => c.parkId === park.id && c.type === 2);
      const outCam = outCams[Math.floor(seeded(s + 42) * Math.max(1, outCams.length)) % Math.max(1, outCams.length)];
      const duration = Math.max(3, Math.round(nowMin - target.entryMin));
      const free = target.paymentStatusId === 5;
      const fee = free ? null : computeFee(world, park.id, target.entryMin, target.entryMin + duration, target.vehicleClassId);
      const amount = fee ? fee.gross : 0;

      // Ödeme yolu — paymentFlow.ts'teki RouteId kümesiyle aynı mantık
      const routeSeed = seeded(s + 43);
      const paid = free || routeSeed > 0.22;
      const serviceId = free ? 9 : weighted(s + 44, [[1, 46], [2, 20], [13, 12], [14, 12], [15, 10]] as const);

      const updated: ParkSession = {
        ...target,
        exitMin: nowMin,
        gateOut: GATES[2 + Math.floor(seeded(s + 45) * 2)],
        cameraOutId: outCam?.id ?? null,
        amount,
        paymentStatusId: free ? 5 : paid ? 2 : 3,
        paymentBy: free ? 'Beyaz Liste' : paid ? paymentMethod(serviceId).label : null,
        actions: [...target.actions, { at: nowMin, by: 'Sistem', label: 'Oturum kapandı', detail: `Süre: ${formatDuration(duration)}` }],
      };
      sessions = sessions.map((x) => (x.id === target.id ? updated : x));

      events = [makeEvent(next, 'exit', park.id, `${target.plateTxt} · ${updated.gateOut} çıkışı`, { atMin: nowMin, plate: target.plateTxt, cameraId: outCam?.id ?? null }), ...events];
      bump();

      if (!free && paid) {
        bump();
        const payment = makePayment(next, {
          session: updated, parkId: park.id, plateTxt: target.plateTxt,
          serviceId, amount, channel: 'Sistem', atMin: nowMin,
        });
        payments = [payment, ...payments];
        ledger = addLedger({ ...next, ledger }, park.id, { revenue: amount, collected: amount, passes: 1 });
        events = [makeEvent(next, 'payment', park.id, `${target.plateTxt} · ${formatTL(amount)} tahsil edildi`, { atMin: nowMin, plate: target.plateTxt, amount }), ...events];
        bump();
      } else if (!free && !paid) {
        ledger = addLedger({ ...next, ledger }, park.id, { revenue: amount, uncollected: amount, passes: 1 });
        events = [makeEvent(next, 'payment_init', park.id, `${target.plateTxt} · tahsilat başarısız, borca düştü`, { atMin: nowMin, plate: target.plateTxt, amount }), ...events];
        bump();
      }

      // Çıkış bariyeri
      const barrier = world.barriers.find((b) => b.cameraId === outCam?.id);
      if (barrier) {
        events = [makeEvent(next, 'barrier', park.id, `${barrier.id} · çıkış bariyeri açıldı`, { atMin: nowMin, barrierId: barrier.id }), ...events];
        bump();
      }
    }
  }

  /* --- 3) PMSP log satırı --------------------------------------------- */
  if (seeded(s + 60) > 0.35) {
    const device = world.devices[Math.floor(seeded(s + 61) * world.devices.length) % world.devices.length];
    const messageType = weighted<PmspMessageType>(s + 62, [
      ['TakeSnapshot', 24], ['UnlockBarrier', 20], ['SendSnapshot', 18],
      ['PayWithPos', 14], ['UpdateWhitelist', 12], ['BootNotification', 12],
    ] as const);
    const level = weighted(s + 63, [[1, 62], [4, 22], [2, 11], [3, 5]] as const);
    bump();
    pmspLogs = [{
      id: nextId(next, 'PMS'),
      parkId: device.parkId,
      recordedAtMin: nowMin,
      level,
      category: weighted(s + 64, [[1, 22], [2, 20], [4, 20], [3, 18], [5, 12], [6, 8]] as const),
      messageType,
      deviceId: device.id,
      cameraId: null,
      barrierId: null,
      payload: `{"type":"${messageType}","device":"${device.id}","seq":${seq}}`,
      response: level === 3 ? '{"status":"ERROR","message":"TIMEOUT"}' : '{"status":"OK","code":200}',
      messageUid: `MU-${pad(seq, 6)}`,
    }, ...pmspLogs];
  }

  /* --- 4) Radar dalgalanması ------------------------------------------ */
  const radar = world.radar.map((m, i) => {
    const d = (seeded(s + 200 + i) - 0.5) * 0.06;
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(v)));
    const critical = m.deviceId === 'RACK-01';
    return {
      ...m,
      cpuLoad: critical ? m.cpuLoad : clamp(m.cpuLoad * (1 + d), 10, 96),
      ramPercent: critical ? m.ramPercent : clamp(m.ramPercent * (1 + d), 25, 96),
      diskPercent: critical ? m.diskPercent : clamp(m.diskPercent * (1 + d * 0.2), 30, 96),
      temperature: critical ? m.temperature : clamp(m.temperature * (1 + d * 0.5), 38, 88),
      backendLatencyMs: critical ? m.backendLatencyMs : clamp(m.backendLatencyMs * (1 + d * 3), 25, 900),
      sampledAtMin: nowMin,
    };
  });

  /* --- 5) Kamera son yakalama zamanı ---------------------------------- */
  const cameras = world.cameras.map((c, i) =>
    c.online && seeded(s + 300 + i) > 0.55 ? { ...c, lastCaptureMin: nowMin } : c
  );

  /* --- 6) Ara sıra bildirim ------------------------------------------- */
  if (tick > 0 && tick % 12 === 0) {
    bump();
    const kinds = [
      { title: 'Dışa aktarma hazır', body: 'Oturum listesi CSV dosyanız hazırlandı.', tone: 'success' as Tone, targetModule: 'sessions' as ModuleId },
      { title: 'Radar alarmı', body: 'RACK-01 sıcaklık eşiğini aşmaya devam ediyor.', tone: 'danger' as Tone, targetModule: 'devices' as ModuleId },
      { title: 'HGS onayı bekliyor', body: 'Bugünkü geçişlerin bir kısmı onay kuyruğunda.', tone: 'warning' as Tone, targetModule: 'payments' as ModuleId },
    ];
    const k = kinds[Math.floor(seeded(s + 400) * kinds.length) % kinds.length];
    notifications.push({
      id: nextId(next, 'NTF'),
      title: k.title, body: k.body, tone: k.tone, atMin: nowMin, read: false,
      targetModule: k.targetModule,
    });
  }

  return {
    world: {
      ...world,
      sessions: sessions.slice(0, CAPS.sessions),
      payments: payments.slice(0, CAPS.payments),
      events: events.slice(0, CAPS.events),
      pmspLogs: pmspLogs.slice(0, CAPS.pmspLogs),
      barrierLogs: barrierLogs.slice(0, CAPS.barrierLogs),
      radar,
      cameras,
      ledger,
      seq,
    },
    notifications,
  };
}

/* ==========================================================================
   12 · CSV
   ========================================================================== */

/** Basit, güvenli CSV üretimi (Excel Türkçe uyumu için ; ayırıcı). */
export function toCsv(headers: string[], rows: (string | number | null)[][]): string {
  const esc = (v: string | number | null) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.map(esc).join(';'), ...rows.map((r) => r.map(esc).join(';'))].join('\n');
}

/**
 * CSV metnini satır dizisine çevirir (içe aktarma için).
 *
 * Ayırıcı ilk satırdan tespit edilir: `;` varsa `;`, yoksa sekme, yoksa `,`.
 * Bu ÖNEMLİDİR — Türkçe tutarlarda ondalık ayırıcı virgüldür ('148,00'),
 * körü körüne virgülden bölmek tutarı ikiye ayırır.
 * Tırnak içindeki ayırıcılar yok sayılır.
 */
export function parseCsv(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const head = lines[0];
  const delim = head.includes(';') ? ';' : head.includes('\t') ? '\t' : ',';

  const splitLine = (line: string): string[] => {
    const cells: string[] = [];
    let cur = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') { cur += '"'; i++; }
        else quoted = !quoted;
      } else if (ch === delim && !quoted) {
        cells.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    cells.push(cur.trim());
    return cells;
  };

  // BOM temizliği (downloadCsv başa ﻿ ekler)
  return lines.map((l, i) => splitLine(i === 0 ? l.replace(/^﻿/, '') : l));
}
