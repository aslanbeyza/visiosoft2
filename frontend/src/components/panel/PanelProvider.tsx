'use client';

/**
 * ============================================================================
 * DEMO PANEL — DURUM ÇEKİRDEĞİ (context + reducer + simülasyon)
 * ============================================================================
 *
 * TEK CONTEXT + TEK REDUCER. On modül VE mobil uygulama sekmesi aynı store'u
 * paylaşır; ayrı state yok, prop drilling yok.
 *
 * `state.world` TEK GERÇEKLİK KAYNAĞIDIR. Oturumlar tablosu, borç listesi,
 * finansal KPI'lar ve mobil borç sorgulama HEPSİ aynı `world.sessions`
 * dizisinden türetilir; kopyalanmış ikinci bir liste yoktur. Bu yüzden bir
 * yerdeki değişiklik her yerde anında görünür.
 *
 * KÖPRÜ KURALI: Mobil aksiyonların reducer dalları `world`'ü panel
 * aksiyonlarıyla AYNI saf yardımcılarla (panelDemo.ts §10) değiştirir.
 * Örneğin `MOBILE_PAY_DEBT` tek geçişte: oturumu 'Ödendi' yapar, kanalı
 * 'Mobil' olan bir Payment üretir, bildirim + toast düşürür ve köprü
 * kaydını `mobile.bridge`'e ekler.
 *
 * KULLANIM
 *
 *   // Sayfa kökünde
 *   <PanelProvider><PanelShell /></PanelProvider>
 *
 *   // Modül içinde
 *   const state = usePanelState();
 *   const dispatch = usePanelDispatch();
 *   const world = useWorld();
 *   const park = useCurrentPark();          // null = Tüm Otoparklar
 *   const ui = useModuleUi('sessions');
 *   const { toast, notify, openBarrier, restartDevice, exportCsv } = usePanelHelpers();
 *
 * YAN ETKİ KURALI: Reducer SAFTIR. Zamanlayıcı, localStorage, hash senkronu,
 * CSV indirme gibi yan etkiler yalnızca Provider'ın useEffect'lerinde veya
 * `usePanelHelpers()` içinde yaşar.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react';
import { upperTR } from '@/lib/text';
import {
  ALL_PARKS_ID,
  BASE_EPOCH,
  EMPTY_LEDGER,
  MENU,
  MOBILE_PAYMENT_METHOD_ID,
  MODULES,
  addLedger,
  buildWorld,
  computeFee,
  findPark,
  formatTL,
  makeBarrierLog,
  makeEvent,
  makePayment,
  markSessionPaid,
  menuVisible,
  moduleVisible,
  paymentMethod,
  pushSessionAction,
  simulateTick,
  vehicleClass,
  type BridgeRecord,
  type DemoPark,
  type DemoWorld,
  type ListEntry,
  type Membership,
  type MembershipPackage,
  type MembershipStatusId,
  type ModuleId,
  type PanelNotification,
  type PanelRole,
  type ParkSession,
  type RadarThresholds,
  type SupportTicket,
  type TicketCategoryId,
  type TicketPriorityId,
  type TicketStatusId,
  type Toast,
  type Tone,
} from '@/lib/panelDemo';

/* ==========================================================================
   1 · DURUM TİPLERİ
   ========================================================================== */

export interface SortState {
  key: string;
  dir: 'asc' | 'desc';
}

/** Her modülün kendi sekme/filtre/sıralama/sayfa/seçim durumu. */
export interface ModuleUiState {
  tab: string;
  search: string;
  /** Bütün filtreler string olarak tutulur; modül kendi tipine çevirir. */
  filters: Record<string, string>;
  sort: SortState | null;
  page: number;
  pageSize: number;
  selection: string[];
}

/** Satır detayı (z 60). */
export interface SheetState {
  kind: string;
  id: string;
  data?: Record<string, string | number | boolean | null>;
}

/** Üstteki alt modal (z 70–80). */
export interface ModalState {
  kind: string;
  id?: string;
  level?: number;
  data?: Record<string, string | number | boolean | null>;
}

export type MobileTab = 'parkings' | 'subscriptions' | 'debts' | 'profile';

export type MobileRouteName =
  | 'login' | 'parkings' | 'parking-detail' | 'debts' | 'debt-result' | 'debt-pay'
  | 'subscriptions' | 'subscription-detail' | 'buy-membership'
  | 'vehicles' | 'add-vehicle' | 'cards' | 'add-card'
  | 'support' | 'support-detail' | 'new-support'
  | 'payment-history' | 'profile' | 'contact';

export interface MobileRoute {
  name: MobileRouteName;
  params?: Record<string, string>;
}

export interface MobileSheet {
  kind: string;
  params?: Record<string, string>;
}

export interface MobileState {
  authed: boolean;
  tab: MobileTab;
  /** expo-router yığını taklidi. */
  stack: MobileRoute[];
  sheet: MobileSheet | null;
  /** Serbest form alanları (plaka girişi, kart formu, talep metni…). */
  forms: Record<string, string>;
  /** Mobilde yapılan işlemin panelde nereye düştüğünü gösteren köprü kayıtları. */
  bridge: BridgeRecord[];
  /**
   * Telefon çerçevesi ölçeği: dar ekran ↔ gerçek cihaz ↔ büyütülmüş.
   * 0.75, 416px'lik gövdeyi ~312px'e indirir; 360px'lik telefonlarda
   * simülasyon yatay kaydırma olmadan sığar.
   */
  scale: 0.75 | 1 | 1.25;
  notice: { text: string; tone: Tone } | null;
}

export interface PanelState {
  world: DemoWorld;
  /** Tüm göreli zaman biçimleyicileri bunu okur. BASE_EPOCH → mount'ta Date.now(). */
  epochMs: number;
  /** Gerçek "şimdi"nin epochMs'ye göre dakika ofseti. */
  nowMin: number;
  clockSynced: boolean;
  tick: number;
  refreshMs: number | null;
  parkId: number;
  role: PanelRole;
  module: ModuleId;
  /** Sabitlenen MENÜ satırlarının kimlikleri (MenuEntry.id). */
  pins: string[];
  sidebarCollapsed: boolean;
  ui: Record<ModuleId, ModuleUiState>;
  sheet: SheetState | null;
  modal: ModalState | null;
  toasts: Toast[];
  notifications: PanelNotification[];
  /** Komut bekleyen varlık id'leri (bariyer açılıyor, cihaz yeniden başlıyor…). */
  busy: string[];
  /**
   * MODÜL EKRANLARININ KALICI VERİSİ.
   *
   * `PanelShell` yalnızca seçili modülü render eder; diğerleri UNMOUNT olur.
   * Bu yüzden bir ekranın `useState`'inde tutulan KULLANICI ÜRETİMİ kayıt
   * (eklenen tablet, düzenlenen kamera, kaydedilen ödeme yöntemi sırası…)
   * başka bir modüle geçilip geri dönüldüğünde kayboluyordu. Bu harita
   * reducer'da yaşadığı için modül değişiminden etkilenmez.
   *
   * Yalnızca KALICI OLMASI GEREKEN veri buraya konur; modal açık/kapalı,
   * taslak form, filtre paneli gibi geçici UI durumu ekranın kendi
   * `useState`'inde kalır (kapanınca sıfırlanması DOĞRU davranıştır).
   *
   * Anahtarlar modül adıyla ad alanına alınır: `'devices.tablets'`.
   */
  moduleData: Record<string, unknown>;
  mobile: MobileState;
}

/* ==========================================================================
   2 · VARSAYILANLAR
   ========================================================================== */

const DEFAULT_TABS: Record<ModuleId, string> = {
  welcome: 'overview',
  sessions: 'all',
  barriers: 'cameras',
  finance: 'today',
  reports: 'last7',
  payments: 'payments',
  memberships: 'list',
  devices: 'devices',
  lists: 'white',
  support: 'all',
  mobile: 'phone',
  'hgs-approvals': 'queue',
  'park-settings': 'general',
  'plate-photos': 'list',
  'period-comparison': 'yesterday',
  pos: 'sessions',
};

const emptyUi = (module: ModuleId): ModuleUiState => ({
  tab: DEFAULT_TABS[module],
  search: '',
  filters: {},
  sort: null,
  page: 1,
  pageSize: 25,
  selection: [],
});

function initialUi(): Record<ModuleId, ModuleUiState> {
  const out = {} as Record<ModuleId, ModuleUiState>;
  MODULES.forEach((m) => { out[m.id] = emptyUi(m.id); });
  return out;
}

const INITIAL_MOBILE: MobileState = {
  authed: true,
  tab: 'parkings',
  stack: [{ name: 'parkings' }],
  sheet: null,
  forms: {},
  bridge: [],
  scale: 1,
  notice: null,
};

/**
 * İlk durum — SAF ve DETERMİNİSTİK. `Date.now()` burada ÇAĞRILMAZ;
 * sunucu ile istemcinin ilk render'ı birebir aynı olur.
 */
export function createInitialState(): PanelState {
  return {
    world: buildWorld(),
    epochMs: BASE_EPOCH,
    nowMin: 0,
    clockSynced: false,
    tick: 0,
    refreshMs: 2000,
    parkId: 1,
    role: 'admin',
    module: 'pos',
    pins: [],
    sidebarCollapsed: false,
    ui: initialUi(),
    sheet: null,
    modal: null,
    toasts: [],
    notifications: [],
    busy: [],
    moduleData: {},
    mobile: INITIAL_MOBILE,
  };
}

/* ==========================================================================
   3 · AKSİYONLAR
   ========================================================================== */

export type PanelAction =
  /* --- kabuk --- */
  | { type: 'SET_MODULE'; module: ModuleId; tab?: string; filters?: Record<string, string> }
  | { type: 'SET_PARK'; parkId: number }
  | { type: 'SET_ROLE'; role: PanelRole }
  | { type: 'SET_REFRESH'; ms: number | null }
  | { type: 'TOGGLE_PIN'; id: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; collapsed: boolean }
  | { type: 'SYNC_CLOCK'; epochMs: number }
  | { type: 'SIM_TICK'; nowMin: number }
  | { type: 'RESTORE_PREFS'; pins?: string[]; sidebarCollapsed?: boolean; refreshMs?: number | null }
  /* --- modül UI --- */
  | { type: 'SET_TAB'; module: ModuleId; tab: string }
  | { type: 'SET_SEARCH'; module: ModuleId; search: string }
  | { type: 'SET_FILTER'; module: ModuleId; key: string; value: string }
  | { type: 'SET_FILTERS'; module: ModuleId; filters: Record<string, string> }
  | { type: 'RESET_FILTERS'; module: ModuleId }
  | { type: 'SET_SORT'; module: ModuleId; key: string }
  | { type: 'SET_PAGE'; module: ModuleId; page: number }
  | { type: 'SET_PAGE_SIZE'; module: ModuleId; size: number }
  /**
   * Modül ekranının kalıcı verisini yazar. `updater` verilirse ÖNCEKİ değer
   * reducer'ın İÇİNDE çözülür; böylece aynı olay içinde arka arkaya yapılan
   * güncellemeler (React toplu işlerken) birbirini ezmez. Reducer saf kalır:
   * çıktı yalnızca (state, action) ikilisine bağlıdır.
   */
  | { type: 'SET_MODULE_DATA'; key: string; value?: unknown; updater?: (prev: unknown) => unknown; fallback?: unknown }
  | { type: 'TOGGLE_ROW'; module: ModuleId; id: string }
  | { type: 'TOGGLE_ALL'; module: ModuleId; ids: string[] }
  | { type: 'CLEAR_SELECTION'; module: ModuleId }
  /* --- katmanlar --- */
  | { type: 'OPEN_SHEET'; sheet: SheetState }
  | { type: 'CLOSE_SHEET' }
  | { type: 'OPEN_MODAL'; modal: ModalState }
  | { type: 'CLOSE_MODAL' }
  | { type: 'PUSH_TOAST'; toast: Omit<Toast, 'id'> & { id?: string } }
  | { type: 'DISMISS_TOAST'; id: string }
  | { type: 'PUSH_NOTICE'; notice: Omit<PanelNotification, 'id' | 'atMin' | 'read'> }
  | { type: 'READ_NOTICE'; id?: string }
  | { type: 'READ_EVENTS' }
  /* --- oturum aksiyonları (15) --- */
  | { type: 'SESSION_UPDATE_PLATE'; id: string; plate: string }
  | { type: 'SESSION_ADD_NOTE'; id: string; note: string }
  | { type: 'SESSION_SET_FREE'; id: string }
  | { type: 'SESSION_BLACKLIST'; id: string; description?: string }
  | { type: 'SESSION_SET_CLASS'; id: string; vehicleClassId: number }
  | { type: 'SESSION_COLLECT'; id: string; serviceId: number }
  | { type: 'SESSION_SEND_POS'; id: string; deviceId: string }
  | { type: 'SESSION_NORMALIZE'; id: string }
  | { type: 'SESSION_CANCEL'; id: string; reason: string }
  | { type: 'SESSION_REFUND_HGS'; id: string; reason: string }
  | { type: 'SESSION_EDIT_TIMES'; id: string; entryMin?: number; exitMin?: number | null }
  | { type: 'SESSION_CLEAR_EXIT'; id: string }
  | { type: 'SESSION_FINISH'; id: string }
  | { type: 'SESSION_RECALC'; id: string }
  | { type: 'SESSION_CREATE'; parkId: number; plate: string; entryMin: number; exitMin: number | null; vehicleClassId: number; notes?: string }
  | { type: 'SESSIONS_BULK_CANCEL'; ids: string[]; reason: string }
  | { type: 'SESSIONS_IMPORT'; parkId: number; rows: { plate: string; entryMin: number; exitMin: number | null; vehicleClassId: number }[] }
  /* --- park ayarları --- */
  | { type: 'PARK_UPDATE'; parkId: number; patch: Partial<DemoPark> }
  /* --- tahsilat --- */
  | { type: 'PAYMENT_REFUND'; id: string; reason: string }
  | { type: 'DEBT_PAY'; sessionId: string; serviceId: number }
  | { type: 'RECEIVE_PAYMENT'; parkId: number; plate: string; entryMin: number; exitMin: number; vehicleClassId: number; serviceId: number; amount: number; notes?: string }
  /* --- abonelik --- */
  | { type: 'MEMBERSHIP_EXTEND'; id: string; days: number; kind: 'odeme' | 'hediye' | 'duzeltme'; note: string; collect: boolean }
  | { type: 'MEMBERSHIP_DEDUCT'; id: string; days: number }
  | { type: 'MEMBERSHIP_CANCEL'; id: string; reason: string }
  | { type: 'MEMBERSHIP_TOGGLE_AUTORENEW'; id: string }
  | { type: 'MEMBERSHIP_PAY'; id: string; cardId?: string }
  | { type: 'MEMBERSHIP_APPROVE'; approvalId: string }
  | { type: 'MEMBERSHIP_REJECT'; approvalId: string; reason: string }
  | { type: 'PACKAGE_SAVE'; pkg: MembershipPackage }
  | { type: 'PACKAGE_DELETE'; id: string }
  | { type: 'WAITLIST_NOTIFY'; id: string }
  | { type: 'WAITLIST_CONVERT'; id: string }
  /* --- cihaz / bariyer --- */
  | { type: 'BARRIER_OPEN_START'; barrierId: string }
  | { type: 'BARRIER_OPEN_RESULT'; barrierId: string; outcome: 'opened' | 'failed' | 'unconfirmed'; transport: 'gate' | 'pmsp'; reason: string }
  | { type: 'DEVICE_RESTART'; deviceId: string }
  | { type: 'DEVICE_RESTART_DONE'; deviceId: string }
  | { type: 'RADAR_SET_THRESHOLD'; alertId: string; key: keyof RadarThresholds; value: number }
  | { type: 'CAMERA_SNAPSHOT'; cameraId: string }
  /* --- listeler --- */
  | { type: 'LIST_ADD'; entry: Omit<ListEntry, 'id' | 'createdAtMin' | 'deleted'> }
  | { type: 'LIST_UPDATE'; id: string; patch: Partial<ListEntry> }
  | { type: 'LIST_REMOVE'; id: string }
  | { type: 'LIST_IMPORT'; kind: 'white' | 'black'; parkId: number; rows: { plate: string; name: string; company: string; phone: string; description: string }[] }
  /* --- destek --- */
  | { type: 'TICKET_CREATE'; parkId: number; subject: string; content: string; category: TicketCategoryId; priority: TicketPriorityId; source: 'portal' | 'mobil'; plate?: string | null; attachments?: { name: string; sizeKb: number }[] }
  | { type: 'TICKET_REPLY'; id: string; body: string; sender: 'partner' | 'agent'; attachments?: { name: string; sizeKb: number }[]; isTemplate?: boolean }
  | { type: 'TICKET_SET_STATUS'; id: string; status: TicketStatusId }
  | { type: 'TICKET_ASSIGN'; id: string; assignee: string | null }
  | { type: 'TICKET_CLOSE'; id: string }
  /* --- mobil --- */
  | { type: 'MOBILE_NAV'; op: 'push' | 'pop' | 'replace' | 'reset'; route?: MobileRoute }
  | { type: 'MOBILE_SET_TAB'; tab: MobileTab }
  | { type: 'MOBILE_SHEET'; sheet: MobileSheet | null }
  | { type: 'MOBILE_SET_FORM'; key: string; value: string }
  | { type: 'MOBILE_CLEAR_FORMS'; keys?: string[] }
  | { type: 'MOBILE_NOTICE'; text: string | null; tone?: Tone }
  | { type: 'MOBILE_SET_SCALE'; scale: 0.75 | 1 | 1.25 }
  | { type: 'MOBILE_LOGIN' }
  | { type: 'MOBILE_LOGOUT' }
  | { type: 'MOBILE_RESET' }
  | { type: 'MOBILE_PAY_DEBT'; sessionIds: string[]; cardId: string }
  | { type: 'MOBILE_BUY_MEMBERSHIP'; parkId: number; packageId: string; plate: string; cardId: string; phone: string; companyName?: string | null; companyVat?: string | null }
  | { type: 'MOBILE_ADD_VEHICLE'; plate: string }
  | { type: 'MOBILE_REMOVE_VEHICLE'; id: string }
  | { type: 'MOBILE_ADD_CARD'; brand: string; last3: string; holderName: string; expireMonth: number; expireYear: number }
  | { type: 'MOBILE_SET_DEFAULT_CARD'; id: string }
  | { type: 'MOBILE_DELETE_CARD'; id: string }
  | { type: 'MOBILE_CREATE_TICKET'; parkId: number; subject: string; content: string; category: TicketCategoryId; plate?: string | null; attachments?: { name: string; sizeKb: number }[] }
  | { type: 'MOBILE_REPLY_TICKET'; id: string; body: string }
  | { type: 'MOBILE_TOGGLE_AUTORENEW'; membershipId: string }
  | { type: 'MOBILE_TOGGLE_NOTIFICATIONS' };

/* ==========================================================================
   4 · REDUCER YARDIMCILARI
   ========================================================================== */

/** panelDemo.nextId ile aynı biçim; bump'tan ÖNCE çağrıldığı için +1. */
const seqId = (world: DemoWorld, prefix: string) =>
  `${prefix}-U${String(world.seq + 1).padStart(5, '0')}`;

function pushToast(state: PanelState, t: Omit<Toast, 'id'> & { id?: string }): Toast[] {
  const toast: Toast = { id: t.id ?? seqId(state.world, 'TST'), ...t };
  return [...state.toasts.slice(-3), toast];
}

function pushNotice(
  state: PanelState,
  n: Omit<PanelNotification, 'id' | 'atMin' | 'read'>
): PanelNotification[] {
  return [
    { id: seqId(state.world, 'NTF'), atMin: state.nowMin, read: false, ...n },
    ...state.notifications,
  ].slice(0, 40);
}

function bumpSeq(world: DemoWorld, by = 1): DemoWorld {
  return { ...world, seq: world.seq + by };
}

function patchUi(
  state: PanelState,
  module: ModuleId,
  patch: Partial<ModuleUiState>
): Record<ModuleId, ModuleUiState> {
  return { ...state.ui, [module]: { ...state.ui[module], ...patch } };
}

function mapSession(
  world: DemoWorld,
  id: string,
  fn: (s: ParkSession) => ParkSession
): DemoWorld {
  return { ...world, sessions: world.sessions.map((s) => (s.id === id ? fn(s) : s)) };
}

const findSession = (world: DemoWorld, id: string) => world.sessions.find((s) => s.id === id) ?? null;

function addBridge(mobile: MobileState, rec: BridgeRecord): MobileState {
  return { ...mobile, bridge: [rec, ...mobile.bridge].slice(0, 12) };
}

/** Ödeme alma — panel ve mobil aynı yolu kullanır (köprü kuralı). */
function collect(
  state: PanelState,
  session: ParkSession,
  serviceId: number,
  channel: 'Partner' | 'Mobil' | 'Kiosk' | 'Sistem'
): { world: DemoWorld; payment: ReturnType<typeof makePayment> } {
  let world = bumpSeq(state.world);
  const label = channel === 'Mobil' ? 'Mobil · Kredi Kartı' : paymentMethod(serviceId).label;
  const updated = markSessionPaid(session, label, state.nowMin);
  world = { ...world, sessions: world.sessions.map((s) => (s.id === session.id ? updated : s)) };

  const payment = makePayment(world, {
    session: updated,
    parkId: session.parkId,
    plateTxt: session.plateTxt,
    serviceId,
    amount: session.amount,
    channel,
    atMin: state.nowMin,
  });
  world = bumpSeq(world);
  world = { ...world, payments: [payment, ...world.payments] };
  world = {
    ...world,
    ledger: addLedger(world, session.parkId, {
      collected: session.amount,
      uncollected: -session.amount,
    }),
  };
  world = bumpSeq(world);
  world = {
    ...world,
    events: [
      makeEvent(world, 'payment', session.parkId, `${session.plateTxt} · ${formatTL(session.amount)} tahsil edildi`, {
        atMin: state.nowMin, plate: session.plateTxt, amount: session.amount,
      }),
      ...world.events,
    ].slice(0, 120),
  };
  return { world, payment };
}

/* ==========================================================================
   5 · REDUCER
   ========================================================================== */

export function panelReducer(state: PanelState, action: PanelAction): PanelState {
  switch (action.type) {
    /* ---------------- kabuk ---------------- */
    case 'SET_MODULE': {
      // Rol maskesi ve ücretsiz-tesis kısıtı burada da uygulanır: derin bağlantı
      // veya kısayol, erişilemez bir modüle geçemez (menüde gizli olan sayfanın
      // rotası gerçek panelde de 403 verir).
      const meta = MODULES.find((m) => m.id === action.module);
      const park = findPark(state.world, state.parkId);
      if (!meta || !moduleVisible(meta, state.role, park)) {
        return {
          ...state,
          world: bumpSeq(state.world),
          toasts: pushToast(state, {
            title: 'Erişim yok',
            body: `${meta?.title ?? 'Bu modül'} seçili rol veya tesis için kapalı.`,
            tone: 'warning',
            duration: 4000,
          }),
        };
      }
      // Derin bağlantı filtresi hedef modülün filtrelerini DEĞİŞTİRİR, üstüne
      // eklemez: önceki ekranda kalan filtreyle kesişince kullanıcı "filtre
      // uygulandı" bildirimini görüp beklediğinden az kayıt buluyordu.
      // Seçim de sıfırlanır — görünmeyen satırlar toplu işleme girmesin.
      const ui = action.tab || action.filters
        ? patchUi(state, action.module, {
          ...(action.tab ? { tab: action.tab } : {}),
          ...(action.filters ? { filters: { ...action.filters }, selection: [] } : {}),
          page: 1,
        })
        : state.ui;
      return { ...state, module: action.module, ui, sheet: null, modal: null };
    }

    case 'SET_PARK': {
      const park = findPark(state.world, action.parkId);
      // Geçersiz tesis (ör. elle düzenlenmiş '#sessions?park=99' bağlantısı)
      // yok sayılır. Aksi halde panel var olmayan bir tesise kilitlenir ve
      // bütün modüller boş liste gösterirdi.
      if (park === null && action.parkId !== ALL_PARKS_ID) return state;
      // Tesis değişimi tüm modüllerin sayfa ve seçimini sıfırlar
      const ui = {} as Record<ModuleId, ModuleUiState>;
      MODULES.forEach((m) => { ui[m.id] = { ...state.ui[m.id], page: 1, selection: [] }; });
      // Erişilemez hâle gelen modülden çık
      const meta = MODULES.find((m) => m.id === state.module)!;
      const module = moduleVisible(meta, state.role, park) ? state.module : 'welcome';
      return { ...state, parkId: action.parkId, ui, module, sheet: null, modal: null };
    }

    case 'SET_ROLE': {
      const park = findPark(state.world, state.parkId);
      const meta = MODULES.find((m) => m.id === state.module)!;
      const module = moduleVisible(meta, action.role, park) ? state.module : 'welcome';
      const pins = state.pins.filter((p) => {
        const entry = MENU.find((e) => e.id === p);
        return entry ? menuVisible(entry, action.role, park) : false;
      });
      return { ...state, role: action.role, module, pins, sheet: null, modal: null };
    }

    case 'SET_REFRESH':
      return { ...state, refreshMs: action.ms };

    /* Park Ayarları ekranının kaydı — dünyayı GERÇEKTEN değiştirir: kapasite,
       kullanım türü, oturum kuralları ve borç eşiği tüm modüllerde okunur.
       Kullanım türü "Site Otopark (Ücretsiz)" yapılırsa finansal modüller
       gerçek panelde olduğu gibi menüden kalkar; o sırada açık olan modül
       erişilemez hâle gelirse Ana Ekran'a düşülür. */
    case 'PARK_UPDATE': {
      const parks = state.world.parks.map((p) =>
        p.id === action.parkId ? { ...p, ...action.patch } : p
      );
      const world = bumpSeq({ ...state.world, parks });
      const park = findPark(world, state.parkId);
      const meta = MODULES.find((m) => m.id === state.module);
      const module = meta && moduleVisible(meta, state.role, park) ? state.module : 'welcome';
      return { ...state, world, module };
    }

    case 'TOGGLE_PIN':
      return {
        ...state,
        pins: state.pins.includes(action.id)
          ? state.pins.filter((p) => p !== action.id)
          : [...state.pins, action.id],
      };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'SET_SIDEBAR':
      return { ...state, sidebarCollapsed: action.collapsed };

    case 'SYNC_CLOCK':
      return { ...state, epochMs: action.epochMs, nowMin: 0, clockSynced: true };

    case 'SIM_TICK': {
      const tick = state.tick + 1;
      const result = simulateTick(state.world, tick, action.nowMin);
      const notifications = result.notifications.length
        ? [...result.notifications, ...state.notifications].slice(0, 40)
        : state.notifications;
      return { ...state, tick, nowMin: action.nowMin, world: result.world, notifications };
    }

    case 'RESTORE_PREFS':
      return {
        ...state,
        pins: action.pins ?? state.pins,
        sidebarCollapsed: action.sidebarCollapsed ?? state.sidebarCollapsed,
        refreshMs: action.refreshMs === undefined ? state.refreshMs : action.refreshMs,
      };

    /* ---------------- modül UI ---------------- */
    case 'SET_TAB':
      return { ...state, ui: patchUi(state, action.module, { tab: action.tab, page: 1, selection: [] }) };

    case 'SET_SEARCH':
      return { ...state, ui: patchUi(state, action.module, { search: action.search, page: 1 }) };

    case 'SET_FILTER': {
      const filters = { ...state.ui[action.module].filters };
      if (action.value === '') delete filters[action.key];
      else filters[action.key] = action.value;
      return { ...state, ui: patchUi(state, action.module, { filters, page: 1 }) };
    }

    case 'SET_FILTERS':
      return { ...state, ui: patchUi(state, action.module, { filters: action.filters, page: 1 }) };

    case 'RESET_FILTERS':
      return { ...state, ui: patchUi(state, action.module, { filters: {}, search: '', page: 1 }) };

    case 'SET_SORT': {
      const cur = state.ui[action.module].sort;
      const sort: SortState =
        cur && cur.key === action.key
          ? { key: action.key, dir: cur.dir === 'asc' ? 'desc' : 'asc' }
          : { key: action.key, dir: 'asc' };
      return { ...state, ui: patchUi(state, action.module, { sort, page: 1 }) };
    }

    case 'SET_PAGE':
      return { ...state, ui: patchUi(state, action.module, { page: Math.max(1, action.page) }) };

    case 'SET_PAGE_SIZE':
      return { ...state, ui: patchUi(state, action.module, { pageSize: action.size, page: 1 }) };

    case 'TOGGLE_ROW': {
      const cur = state.ui[action.module].selection;
      const selection = cur.includes(action.id) ? cur.filter((x) => x !== action.id) : [...cur, action.id];
      return { ...state, ui: patchUi(state, action.module, { selection }) };
    }

    case 'TOGGLE_ALL': {
      // `ids` yalnızca GÖRÜNEN SAYFANIN satırlarıdır. Seçimi bu listeyle
      // değiştirmek, başka sayfada yapılmış seçimi sessizce siliyordu; bu
      // yüzden birleşim/çıkarma yapılır: sayfanın tamamı seçiliyse yalnızca o
      // sayfa seçimden düşer, değilse eksik kalanlar seçime eklenir.
      const cur = state.ui[action.module].selection;
      const allOn = action.ids.length > 0 && action.ids.every((i) => cur.includes(i));
      const selection = allOn
        ? cur.filter((id) => !action.ids.includes(id))
        : [...cur, ...action.ids.filter((id) => !cur.includes(id))];
      return { ...state, ui: patchUi(state, action.module, { selection }) };
    }

    case 'CLEAR_SELECTION':
      return { ...state, ui: patchUi(state, action.module, { selection: [] }) };

    case 'SET_MODULE_DATA': {
      const has = Object.prototype.hasOwnProperty.call(state.moduleData, action.key);
      const prev = has ? state.moduleData[action.key] : action.fallback;
      const next = action.updater ? action.updater(prev) : action.value;
      if (has && Object.is(prev, next)) return state;
      return { ...state, moduleData: { ...state.moduleData, [action.key]: next } };
    }

    /* ---------------- katmanlar ---------------- */
    case 'OPEN_SHEET':
      return { ...state, sheet: action.sheet };
    case 'CLOSE_SHEET':
      return { ...state, sheet: null, modal: null };
    case 'OPEN_MODAL':
      return { ...state, modal: action.modal };
    case 'CLOSE_MODAL':
      return { ...state, modal: null };
    case 'PUSH_TOAST':
      return { ...state, world: bumpSeq(state.world), toasts: pushToast(state, action.toast) };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'PUSH_NOTICE':
      return { ...state, world: bumpSeq(state.world), notifications: pushNotice(state, action.notice) };
    case 'READ_NOTICE':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          action.id === undefined || n.id === action.id ? { ...n, read: true } : n
        ),
      };
    case 'READ_EVENTS':
      return { ...state, world: { ...state.world, events: state.world.events.map((e) => ({ ...e, read: true })) } };

    /* ---------------- oturum aksiyonları ---------------- */
    case 'SESSION_UPDATE_PLATE': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      const plate = upperTR(action.plate).trim();
      const world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, plateTxt: plate }, {
          at: state.nowMin, by: 'Partner', label: 'Plaka değiştirildi', detail: `${s.plateTxt} → ${plate}`,
        })
      );
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Plaka güncellendi', body: `${s.plateTxt} → ${plate}`, tone: 'success', duration: 4000 }),
      };
    }

    case 'SESSION_ADD_NOTE': {
      const world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, notes: action.note }, {
          at: state.nowMin, by: 'Partner', label: 'Not eklendi', detail: action.note.slice(0, 80),
        })
      );
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Not kaydedildi', tone: 'success', duration: 3000 }),
      };
    }

    case 'SESSION_SET_FREE': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      let world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, amount: 0, paymentStatusId: 5, sessionStatusId: 8, paymentBy: 'Ücretsiz' }, {
          at: state.nowMin, by: 'Partner', label: 'Ücretsiz yapıldı', detail: 'Bu işlem sistem kayıtlarına yazıldı.',
        })
      );
      world = { ...world, ledger: addLedger(world, s.parkId, { revenue: -s.amount, uncollected: -s.amount }) };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Oturum ücretsiz yapıldı', body: `${s.plateTxt} · işlem loglandı`, tone: 'info', duration: 4000 }),
      };
    }

    case 'SESSION_BLACKLIST': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      let world = bumpSeq(state.world);
      const entry: ListEntry = {
        id: seqId(world, 'BLE'),
        parkId: s.parkId,
        kind: 'black',
        plateTxt: s.plateTxt,
        name: '—',
        companyName: '',
        phone: '',
        description: action.description ?? 'Oturum detayından eklendi',
        expiryAtMin: null,
        createdAtMin: state.nowMin,
        deleted: false,
      };
      world = { ...world, lists: [entry, ...world.lists] };
      world = mapSession(world, action.id, (x) =>
        pushSessionAction({ ...x, sessionStatusId: 9 }, {
          at: state.nowMin, by: 'Partner', label: 'Kara listeye eklendi', detail: s.plateTxt,
        })
      );
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Kara listeye eklendi', body: 'Cihazlara senkronize edildi.', tone: 'danger', duration: 4500 }),
      };
    }

    case 'SESSION_SET_CLASS': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      const fee = s.exitMin === null ? null : computeFee(state.world, s.parkId, s.entryMin, s.exitMin, action.vehicleClassId);
      const amount = fee && s.paymentStatusId !== 5 ? fee.gross : s.amount;
      const world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, vehicleClassId: action.vehicleClassId, amount }, {
          at: state.nowMin, by: 'Partner', label: 'Araç sınıfı değiştirildi',
          detail: `${vehicleClass(s.vehicleClassId).label} → ${vehicleClass(action.vehicleClassId).label}`,
        })
      );
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Araç sınıfı güncellendi', body: `Yeni tutar: ${formatTL(amount)}`, tone: 'success', duration: 4000 }),
      };
    }

    case 'SESSION_COLLECT': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      const { world } = collect(state, s, action.serviceId, 'Partner');
      return {
        ...state, world,
        toasts: pushToast(state, { title: 'Ödeme alındı', body: `${s.plateTxt} · ${formatTL(s.amount)}`, tone: 'success', duration: 4500 }),
      };
    }

    case 'SESSION_SEND_POS': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      const world = mapSession(state.world, action.id, (x) =>
        pushSessionAction(x, { at: state.nowMin, by: 'Partner', label: 'POS’a gönderildi', detail: action.deviceId })
      );
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Ödeme isteği gönderildi', body: `${action.deviceId} cihazında bekleniyor.`, tone: 'info', duration: 4000 }),
      };
    }

    case 'SESSION_NORMALIZE': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      const fee = s.exitMin === null ? null : computeFee(state.world, s.parkId, s.entryMin, s.exitMin, s.vehicleClassId);
      const world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, sessionStatusId: 1, amount: fee ? fee.gross : x.amount }, {
          at: state.nowMin, by: 'Partner', label: 'Normale döndürüldü',
        })
      );
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Oturum normale döndürüldü', tone: 'success', duration: 3500 }),
      };
    }

    case 'SESSION_CANCEL': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      let world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, sessionStatusId: 7, amount: 0, paymentStatusId: 3 }, {
          at: state.nowMin, by: 'Partner', label: 'Oturum iptal edildi', detail: action.reason,
        })
      );
      world = { ...world, ledger: addLedger(world, s.parkId, { revenue: -s.amount, uncollected: -s.amount }) };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Oturum iptal edildi', body: action.reason, tone: 'danger', duration: 4000 }),
      };
    }

    case 'SESSION_REFUND_HGS': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      let world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, paymentStatusId: 6 }, {
          at: state.nowMin, by: 'Partner', label: 'HGS iadesi yapıldı', detail: action.reason,
        })
      );
      world = {
        ...world,
        payments: world.payments.map((p) =>
          p.parkSessionId === s.id ? { ...p, statusId: 6, refundedAtMin: state.nowMin, refundReason: action.reason } : p
        ),
        ledger: addLedger(world, s.parkId, { revenue: -s.amount, collected: -s.amount, refunded: s.amount }),
      };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'HGS iadesi tamamlandı', body: formatTL(s.amount), tone: 'neutral', duration: 4000 }),
      };
    }

    case 'SESSION_EDIT_TIMES': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      const entryMin = action.entryMin ?? s.entryMin;
      const exitMin = action.exitMin === undefined ? s.exitMin : action.exitMin;
      const fee = exitMin === null ? null : computeFee(state.world, s.parkId, entryMin, exitMin, s.vehicleClassId);
      const world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, entryMin, exitMin, amount: fee && x.paymentStatusId !== 5 ? fee.gross : x.amount }, {
          at: state.nowMin, by: 'Partner', label: 'Giriş/çıkış saati düzenlendi',
        })
      );
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Saatler güncellendi', body: fee ? `Yeni tutar: ${formatTL(fee.gross)}` : undefined, tone: 'success', duration: 4000 }),
      };
    }

    case 'SESSION_CLEAR_EXIT': {
      const world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, exitMin: null, gateOut: null, cameraOutId: null, sessionStatusId: 4 }, {
          at: state.nowMin, by: 'Partner', label: 'Çıkış kaydı temizlendi',
        })
      );
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Çıkış temizlendi', body: 'Oturum yeniden aktif.', tone: 'warning', duration: 3500 }),
      };
    }

    case 'SESSION_FINISH': {
      const s = findSession(state.world, action.id);
      if (!s || s.exitMin !== null) return state;
      const fee = computeFee(state.world, s.parkId, s.entryMin, state.nowMin, s.vehicleClassId);
      const free = s.paymentStatusId === 5;
      let world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, exitMin: state.nowMin, amount: free ? 0 : fee.gross, paymentStatusId: free ? 5 : 3 }, {
          at: state.nowMin, by: 'Partner', label: 'Oturum elle bitirildi', detail: formatTL(free ? 0 : fee.gross),
        })
      );
      if (!free) world = { ...world, ledger: addLedger(world, s.parkId, { revenue: fee.gross, uncollected: fee.gross, passes: 1 }) };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Oturum bitirildi', body: free ? 'Ücretsiz' : formatTL(fee.gross), tone: 'success', duration: 4000 }),
      };
    }

    case 'SESSION_RECALC': {
      const s = findSession(state.world, action.id);
      if (!s) return state;
      const end = s.exitMin ?? state.nowMin;
      const fee = computeFee(state.world, s.parkId, s.entryMin, end, s.vehicleClassId);
      const world = mapSession(state.world, action.id, (x) =>
        pushSessionAction({ ...x, amount: x.paymentStatusId === 5 ? 0 : fee.gross }, {
          at: state.nowMin, by: 'Partner', label: 'Ücret yeniden hesaplandı',
          detail: `${formatTL(s.amount)} → ${formatTL(fee.gross)}`,
        })
      );
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Ücret yeniden hesaplandı', body: `${formatTL(s.amount)} → ${formatTL(fee.gross)}`, tone: 'info', duration: 4500 }),
      };
    }

    case 'SESSION_CREATE': {
      let world = bumpSeq(state.world);
      const fee = action.exitMin === null
        ? null
        : computeFee(world, action.parkId, action.entryMin, action.exitMin, action.vehicleClassId);
      const session: ParkSession = {
        id: seqId(world, 'SES'),
        parkId: action.parkId,
        sessionUid: `PS-2026-${String(600000 + world.seq).padStart(6, '0')}`,
        plateTxt: upperTR(action.plate).trim(),
        entryMin: action.entryMin,
        exitMin: action.exitMin,
        amount: fee ? fee.gross : 0,
        taxPercent: findPark(world, action.parkId)?.taxPercent ?? 20,
        paymentStatusId: action.exitMin === null ? 3 : 3,
        sessionStatusId: 6,
        vehicleClassId: action.vehicleClassId,
        gateIn: 'Giriş A',
        gateOut: action.exitMin === null ? null : 'Çıkış A',
        cameraInId: null,
        cameraOutId: null,
        paymentBy: null,
        paymentTransactionId: null,
        notes: action.notes ?? '',
        actions: [{ at: state.nowMin, by: 'Partner', label: 'Oturum elle oluşturuldu' }],
        isImported: false,
        mutabakatIsMatched: false,
        createdBy: 'Partner',
      };
      world = { ...world, sessions: [session, ...world.sessions] };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Oturum oluşturuldu', body: session.plateTxt, tone: 'success', duration: 4000 }),
      };
    }

    case 'SESSIONS_BULK_CANCEL': {
      const ids = new Set(action.ids);
      let world = {
        ...state.world,
        sessions: state.world.sessions.map((s) =>
          ids.has(s.id)
            ? pushSessionAction({ ...s, sessionStatusId: 7, amount: 0 }, {
              at: state.nowMin, by: 'Partner', label: 'Toplu iptal', detail: action.reason,
            })
            : s
        ),
      };
      world = bumpSeq(world);
      return {
        ...state, world,
        ui: patchUi(state, 'sessions', { selection: [] }),
        toasts: pushToast(state, { title: `${action.ids.length} oturum iptal edildi`, body: action.reason, tone: 'danger', duration: 4500 }),
      };
    }

    case 'SESSIONS_IMPORT': {
      let world = bumpSeq(state.world);
      const created: ParkSession[] = action.rows.map((r, i) => {
        const fee = r.exitMin === null ? null : computeFee(world, action.parkId, r.entryMin, r.exitMin, r.vehicleClassId);
        return {
          id: `SES-IMP-${world.seq}-${i}`,
          parkId: action.parkId,
          sessionUid: `PS-2026-${String(700000 + world.seq + i).padStart(6, '0')}`,
          plateTxt: upperTR(r.plate).trim(),
          entryMin: r.entryMin,
          exitMin: r.exitMin,
          amount: fee ? fee.gross : 0,
          taxPercent: findPark(world, action.parkId)?.taxPercent ?? 20,
          paymentStatusId: 3,
          sessionStatusId: 6,
          vehicleClassId: r.vehicleClassId,
          gateIn: 'Giriş A',
          gateOut: r.exitMin === null ? null : 'Çıkış A',
          cameraInId: null,
          cameraOutId: null,
          paymentBy: null,
          paymentTransactionId: null,
          notes: '',
          actions: [{ at: state.nowMin, by: 'Partner', label: 'Toplu içe aktarım' }],
          isImported: true,
          mutabakatIsMatched: false,
          createdBy: 'Partner',
        };
      });
      world = { ...world, sessions: [...created, ...world.sessions] };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: `${created.length} kayıt içe aktarıldı`, tone: 'success', duration: 4500 }),
      };
    }

    /* ---------------- tahsilat ---------------- */
    case 'PAYMENT_REFUND': {
      const p = state.world.payments.find((x) => x.id === action.id);
      if (!p) return state;
      // Faturası kesilmiş ödemenin iadesi engellenir (gerçek sistemdeki kural)
      if (p.invoiceStatus === 'completed') {
        return {
          ...state, world: bumpSeq(state.world),
          toasts: pushToast(state, {
            title: 'İade engellendi',
            body: 'Faturası kesilmiş ödeme iade edilemez.',
            tone: 'danger', duration: 5000,
          }),
        };
      }
      let world: DemoWorld = {
        ...state.world,
        payments: state.world.payments.map((x) =>
          x.id === action.id ? { ...x, statusId: 6, refundedAtMin: state.nowMin, refundReason: action.reason } : x
        ),
      };
      if (p.parkSessionId) {
        world = mapSession(world, p.parkSessionId, (s) =>
          pushSessionAction({ ...s, paymentStatusId: 6 }, {
            at: state.nowMin, by: 'Partner', label: 'Ödeme iade edildi', detail: action.reason,
          })
        );
      }
      world = {
        ...world,
        ledger: addLedger(world, p.parkId, {
          revenue: -p.amount,
          collected: -p.amount,
          refunded: p.amount,
          ...(p.categoryId === 6 ? { membership: -p.amount } : {}),
        }),
      };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'İade tamamlandı', body: `${p.plateTxt} · ${formatTL(p.amount)}`, tone: 'neutral', duration: 4500 }),
      };
    }

    case 'DEBT_PAY': {
      const s = findSession(state.world, action.sessionId);
      if (!s) return state;
      const { world } = collect(state, s, action.serviceId, 'Partner');
      return {
        ...state, world,
        toasts: pushToast(state, {
          title: 'Borç tahsil edildi',
          body: `${s.plateTxt} · ${formatTL(s.amount)} · ${paymentMethod(action.serviceId).label}`,
          tone: 'success', duration: 4500,
        }),
      };
    }

    case 'RECEIVE_PAYMENT': {
      let world = bumpSeq(state.world);
      const session: ParkSession = {
        id: seqId(world, 'SES'),
        parkId: action.parkId,
        sessionUid: `PS-2026-${String(800000 + world.seq).padStart(6, '0')}`,
        plateTxt: upperTR(action.plate).trim(),
        entryMin: action.entryMin,
        exitMin: action.exitMin,
        amount: action.amount,
        taxPercent: findPark(world, action.parkId)?.taxPercent ?? 20,
        paymentStatusId: 3,
        sessionStatusId: 6,
        vehicleClassId: action.vehicleClassId,
        gateIn: 'Giriş A',
        gateOut: 'Çıkış A',
        cameraInId: null,
        cameraOutId: null,
        paymentBy: null,
        paymentTransactionId: null,
        notes: action.notes ?? '',
        actions: [{ at: state.nowMin, by: 'Partner', label: 'Gişeden oturum oluşturuldu' }],
        isImported: false,
        mutabakatIsMatched: false,
        createdBy: 'Partner',
      };
      world = { ...world, sessions: [session, ...world.sessions] };
      const next = collect({ ...state, world }, session, action.serviceId, 'Partner');
      let w2 = next.world;
      w2 = { ...w2, ledger: addLedger(w2, action.parkId, { revenue: action.amount, passes: 1 }) };
      return {
        ...state, world: bumpSeq(w2),
        toasts: pushToast(state, {
          title: 'Ödeme alındı',
          body: `${session.plateTxt} · ${formatTL(action.amount)} · ${paymentMethod(action.serviceId).label}`,
          tone: 'success', duration: 5000,
        }),
      };
    }

    /* ---------------- abonelik ---------------- */
    case 'MEMBERSHIP_EXTEND': {
      const m = state.world.memberships.find((x) => x.id === action.id);
      if (!m) return state;
      const add = action.days * 1440;
      const base = Math.max(m.availableUntilMin, state.nowMin);
      const updated: Membership = {
        ...m,
        availableUntilMin: base + add,
        statusId: 'active',
        extensions: [
          ...m.extensions,
          { previousUntilMin: m.availableUntilMin, newUntilMin: base + add, type: action.kind, note: action.note, atMin: state.nowMin },
        ],
        activities: [...m.activities, { atMin: state.nowMin, label: `Abonelik ${action.days} gün uzatıldı`, by: 'Partner' }],
      };
      let world: DemoWorld = { ...state.world, memberships: state.world.memberships.map((x) => (x.id === m.id ? updated : x)) };
      if (action.collect) {
        world = bumpSeq(world);
        const payment = makePayment(world, {
          membershipId: m.id, parkId: m.parkId, plateTxt: m.plateTxt,
          serviceId: m.paymentMethodId, amount: m.amount, channel: 'Partner',
          categoryId: 6, atMin: state.nowMin,
        });
        world = { ...world, payments: [payment, ...world.payments] };
        world = { ...world, ledger: addLedger(world, m.parkId, { membership: m.amount }) };
      }
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, {
          title: 'Abonelik uzatıldı',
          body: `${m.subUserName} · +${action.days} gün${action.collect ? ' · tahsil edildi' : ''}`,
          tone: 'success', duration: 4500,
        }),
      };
    }

    case 'MEMBERSHIP_DEDUCT': {
      const m = state.world.memberships.find((x) => x.id === action.id);
      if (!m) return state;
      const until = m.availableUntilMin - action.days * 1440;
      const world: DemoWorld = {
        ...state.world,
        memberships: state.world.memberships.map((x) =>
          x.id === m.id
            ? {
              ...x,
              availableUntilMin: until,
              statusId: (until < state.nowMin ? 'expired' : x.statusId) as MembershipStatusId,
              extensions: [...x.extensions, { previousUntilMin: m.availableUntilMin, newUntilMin: until, type: 'duzeltme', note: `${action.days} gün düşüldü`, atMin: state.nowMin }],
              activities: [...x.activities, { atMin: state.nowMin, label: `${action.days} gün düşüldü`, by: 'Partner' }],
            }
            : x
        ),
      };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: `${action.days} gün düşüldü`, body: m.subUserName, tone: 'warning', duration: 4000 }),
      };
    }

    case 'MEMBERSHIP_CANCEL': {
      const m = state.world.memberships.find((x) => x.id === action.id);
      if (!m) return state;
      const park = findPark(state.world, m.parkId);
      const world: DemoWorld = {
        ...state.world,
        memberships: state.world.memberships.map((x) =>
          x.id === m.id
            ? {
              ...x, statusId: 'terminated' as MembershipStatusId, terminatedAtMin: state.nowMin, autoRenew: false,
              activities: [...x.activities, { atMin: state.nowMin, label: `Abonelik iptal edildi — ${action.reason}`, by: 'Partner' }],
            }
            : x
        ),
        parks: park
          ? state.world.parks.map((p) => (p.id === park.id ? { ...p, membershipUsed: Math.max(0, p.membershipUsed - 1) } : p))
          : state.world.parks,
      };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Abonelik iptal edildi', body: m.subUserName, tone: 'danger', duration: 4500 }),
      };
    }

    case 'MEMBERSHIP_TOGGLE_AUTORENEW':
    case 'MOBILE_TOGGLE_AUTORENEW': {
      const id = action.type === 'MEMBERSHIP_TOGGLE_AUTORENEW' ? action.id : action.membershipId;
      const m = state.world.memberships.find((x) => x.id === id);
      if (!m) return state;
      const next = !m.autoRenew;
      const world: DemoWorld = {
        ...state.world,
        memberships: state.world.memberships.map((x) =>
          x.id === id
            ? { ...x, autoRenew: next, activities: [...x.activities, { atMin: state.nowMin, label: `Otomatik yenileme ${next ? 'açıldı' : 'kapatıldı'}`, by: action.type === 'MOBILE_TOGGLE_AUTORENEW' ? 'Mobil' : 'Partner' }] }
            : x
        ),
      };
      const base = {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: `Otomatik yenileme ${next ? 'açıldı' : 'kapatıldı'}`, tone: next ? 'success' : 'neutral', duration: 3500 }),
      };
      if (action.type === 'MOBILE_TOGGLE_AUTORENEW') {
        return {
          ...base,
          mobile: addBridge(state.mobile, {
            id: seqId(world, 'BRG'), atMin: state.nowMin,
            label: `Otomatik yenileme ${next ? 'açıldı' : 'kapatıldı'}`,
            detail: 'Abonelikler listesinde güncellendi',
            targetModule: 'memberships', targetId: m.id,
          }),
        };
      }
      return base;
    }

    case 'MEMBERSHIP_PAY': {
      const m = state.world.memberships.find((x) => x.id === action.id);
      if (!m) return state;
      let world = bumpSeq(state.world);
      const payment = makePayment(world, {
        membershipId: m.id, parkId: m.parkId, plateTxt: m.plateTxt,
        serviceId: m.paymentMethodId, amount: m.amount, channel: 'Partner',
        categoryId: 6, atMin: state.nowMin,
      });
      world = {
        ...world,
        payments: [payment, ...world.payments],
        memberships: world.memberships.map((x) =>
          x.id === m.id
            ? { ...x, paymentStatusId: 2, statusId: 'active' as MembershipStatusId, activities: [...x.activities, { atMin: state.nowMin, label: 'Kayıtlı kartla tahsil edildi', by: 'Partner' }] }
            : x
        ),
        ledger: addLedger(world, m.parkId, { membership: m.amount }),
      };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Abonelik tahsil edildi', body: formatTL(m.amount), tone: 'success', duration: 4500 }),
      };
    }

    case 'MEMBERSHIP_APPROVE': {
      const a = state.world.approvals.find((x) => x.id === action.approvalId);
      if (!a) return state;
      let world = bumpSeq(state.world);
      const pkg = world.packages.find((p) => p.id === a.packageId);
      const membership: Membership = {
        id: seqId(world, 'MEM'),
        parkId: a.parkId,
        subUserName: a.name,
        subUserPhone: a.phone,
        subUserEmail: '—',
        companyName: null,
        companyVat: null,
        plateTxt: a.plateTxt,
        packageId: a.packageId,
        amount: pkg?.cost ?? 0,
        statusId: 'active',
        paymentMethodId: pkg?.paymentMethodIds[0] ?? 9,
        paymentStatusId: 2,
        subscribedAtMin: state.nowMin,
        availableUntilMin: state.nowMin + (pkg?.durationDays ?? 30) * 1440,
        autoRenew: false,
        terminatedAtMin: null,
        extensions: [],
        activities: [{ atMin: state.nowMin, label: 'Belge onaylandı, abonelik açıldı', by: 'Partner' }],
        fromMobile: false,
      };
      world = {
        ...world,
        memberships: [membership, ...world.memberships],
        approvals: world.approvals.filter((x) => x.id !== a.id),
        parks: world.parks.map((p) => (p.id === a.parkId ? { ...p, membershipUsed: p.membershipUsed + 1 } : p)),
      };
      // Kota doluysa sıradaki kişi 'Bilgilendirildi' olur
      const park = findPark(world, a.parkId);
      if (park && park.membershipUsed < park.capacityMembership) {
        const idx = world.waitlist.findIndex((w) => w.parkId === a.parkId && w.status === 'Bekliyor');
        if (idx >= 0) {
          const wl = [...world.waitlist];
          wl[idx] = { ...wl[idx], status: 'Bilgilendirildi', notifiedAtMin: state.nowMin };
          world = { ...world, waitlist: wl };
        }
      }
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Başvuru onaylandı', body: `${a.name} · ${a.plateTxt}`, tone: 'success', duration: 4500 }),
      };
    }

    case 'MEMBERSHIP_REJECT': {
      const a = state.world.approvals.find((x) => x.id === action.approvalId);
      if (!a) return state;
      const world: DemoWorld = {
        ...state.world,
        approvals: state.world.approvals.map((x) => (x.id === a.id ? { ...x, status: 'rejected' } : x)),
      };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Başvuru reddedildi', body: action.reason, tone: 'danger', duration: 4500 }),
      };
    }

    case 'PACKAGE_SAVE': {
      const exists = state.world.packages.some((p) => p.id === action.pkg.id);
      const world: DemoWorld = {
        ...state.world,
        packages: exists
          ? state.world.packages.map((p) => (p.id === action.pkg.id ? action.pkg : p))
          : [...state.world.packages, action.pkg],
      };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: exists ? 'Paket güncellendi' : 'Paket oluşturuldu', body: action.pkg.name, tone: 'success', duration: 4000 }),
      };
    }

    case 'PACKAGE_DELETE': {
      const inUse = state.world.memberships.some((m) => m.packageId === action.id);
      if (inUse) {
        return {
          ...state, world: bumpSeq(state.world),
          toasts: pushToast(state, { title: 'Silinemedi', body: 'Kullanımdaki abonelik paketi silinemez.', tone: 'danger', duration: 5000 }),
        };
      }
      return {
        ...state,
        world: bumpSeq({ ...state.world, packages: state.world.packages.filter((p) => p.id !== action.id) }),
        toasts: pushToast(state, { title: 'Paket silindi', tone: 'neutral', duration: 3500 }),
      };
    }

    case 'WAITLIST_NOTIFY': {
      const world: DemoWorld = {
        ...state.world,
        waitlist: state.world.waitlist.map((w) =>
          w.id === action.id ? { ...w, status: 'Bilgilendirildi', notifiedAtMin: state.nowMin } : w
        ),
      };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Bilgilendirme gönderildi', tone: 'info', duration: 3500 }),
      };
    }

    case 'WAITLIST_CONVERT': {
      const w = state.world.waitlist.find((x) => x.id === action.id);
      if (!w) return state;
      let world = bumpSeq(state.world);
      const pkg = world.packages.find((p) => p.id === w.packageId);
      const membership: Membership = {
        id: seqId(world, 'MEM'),
        parkId: w.parkId, subUserName: w.name, subUserPhone: w.phone, subUserEmail: '—',
        companyName: null, companyVat: null, plateTxt: w.plateTxt, packageId: w.packageId,
        amount: pkg?.cost ?? 0, statusId: 'active', paymentMethodId: pkg?.paymentMethodIds[0] ?? 9,
        paymentStatusId: 3, subscribedAtMin: state.nowMin,
        availableUntilMin: state.nowMin + (pkg?.durationDays ?? 30) * 1440,
        autoRenew: false, terminatedAtMin: null, extensions: [],
        activities: [{ atMin: state.nowMin, label: 'Bekleme listesinden aboneliğe çevrildi', by: 'Partner' }],
        fromMobile: false,
      };
      world = {
        ...world,
        memberships: [membership, ...world.memberships],
        waitlist: world.waitlist.map((x) => (x.id === w.id ? { ...x, status: 'Aboneliğe Çevrildi' } : x)),
        parks: world.parks.map((p) => (p.id === w.parkId ? { ...p, membershipUsed: p.membershipUsed + 1 } : p)),
      };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Aboneliğe çevrildi', body: w.name, tone: 'success', duration: 4500 }),
      };
    }

    /* ---------------- cihaz / bariyer ---------------- */
    case 'BARRIER_OPEN_START':
      return { ...state, busy: [...state.busy, action.barrierId] };

    case 'BARRIER_OPEN_RESULT': {
      const barrier = state.world.barriers.find((b) => b.id === action.barrierId);
      if (!barrier) return { ...state, busy: state.busy.filter((b) => b !== action.barrierId) };
      const cam = state.world.cameras.find((c) => c.id === barrier.cameraId);
      let world = bumpSeq(state.world);
      const log = makeBarrierLog(world, {
        userName: 'Tesis Yöneticisi',
        parkId: barrier.parkId,
        cameraId: barrier.cameraId,
        deviceSerial: state.world.devices.find((d) => d.id === cam?.deviceId)?.serialNumber ?? '—',
        barrierIp: barrier.barrierIp,
        action: 'Bariyer Aç',
        outcome: action.outcome,
        transport: action.transport,
        description: action.reason,
        createdAtMin: state.nowMin,
      });
      world = { ...world, barrierLogs: [log, ...world.barrierLogs].slice(0, 200) };
      world = bumpSeq(world);
      world = {
        ...world,
        events: [
          makeEvent(world, action.outcome === 'opened' ? 'barrier' : 'denied', barrier.parkId,
            action.outcome === 'opened'
              ? `${barrier.id} · bariyer elle açıldı (${action.transport.toUpperCase()})`
              : `${barrier.id} · bariyer komutu başarısız`,
            { atMin: state.nowMin, barrierId: barrier.id, cameraId: barrier.cameraId }),
          ...world.events,
        ].slice(0, 120),
      };
      const tone: Tone = action.outcome === 'opened' ? 'success' : action.outcome === 'failed' ? 'danger' : 'warning';
      const title =
        action.outcome === 'opened' ? 'Bariyer açıldı'
          : action.outcome === 'failed' ? 'Bariyer açılmadı'
            : 'Komut doğrulanamadı';
      return {
        ...state,
        world: bumpSeq(world),
        busy: state.busy.filter((b) => b !== action.barrierId),
        toasts: pushToast(state, {
          title,
          body: `${action.transport === 'pmsp' ? 'PMSP' : 'Tailscale'} üzerinden denendi · ${barrier.barrierIp}`,
          tone, duration: 5000,
        }),
      };
    }

    case 'DEVICE_RESTART': {
      const world: DemoWorld = {
        ...state.world,
        devices: state.world.devices.map((d) => (d.id === action.deviceId ? { ...d, serviceState: 'restarting' } : d)),
      };
      return {
        ...state, world: bumpSeq(world), busy: [...state.busy, action.deviceId],
        toasts: pushToast(state, { title: 'Servisler yeniden başlatılıyor', body: `${action.deviceId} · bu işlem 20 sn sürebilir.`, tone: 'warning', duration: 5000 }),
      };
    }

    case 'DEVICE_RESTART_DONE': {
      const world: DemoWorld = {
        ...state.world,
        devices: state.world.devices.map((d) =>
          d.id === action.deviceId ? { ...d, serviceState: 'ok', statusId: 1, lastOnlineMin: state.nowMin } : d
        ),
      };
      return {
        ...state, world: bumpSeq(world), busy: state.busy.filter((b) => b !== action.deviceId),
        toasts: pushToast(state, { title: 'Servisler yeniden başlatıldı', body: action.deviceId, tone: 'success', duration: 4000 }),
      };
    }

    case 'RADAR_SET_THRESHOLD': {
      const world: DemoWorld = {
        ...state.world,
        radarAlerts: state.world.radarAlerts.map((a) =>
          a.id === action.alertId ? { ...a, thresholds: { ...a.thresholds, [action.key]: action.value } } : a
        ),
      };
      return { ...state, world };
    }

    case 'CAMERA_SNAPSHOT': {
      const world: DemoWorld = {
        ...state.world,
        cameras: state.world.cameras.map((c) => (c.id === action.cameraId ? { ...c, lastCaptureMin: state.nowMin } : c)),
      };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Anlık görüntü alındı', body: action.cameraId, tone: 'info', duration: 3000 }),
      };
    }

    /* ---------------- listeler ---------------- */
    case 'LIST_ADD': {
      let world = bumpSeq(state.world);
      const entry: ListEntry = {
        ...action.entry,
        plateTxt: upperTR(action.entry.plateTxt).trim(),
        id: seqId(world, action.entry.kind === 'white' ? 'WLE' : 'BLE'),
        createdAtMin: state.nowMin,
        deleted: false,
      };
      world = { ...world, lists: [entry, ...world.lists] };

      // Beyaz listeye eklenen plakanın AKTİF oturumu gerçekten ücretsize döner
      if (entry.kind === 'white') {
        world = {
          ...world,
          sessions: world.sessions.map((s) =>
            s.plateTxt === entry.plateTxt && s.parkId === entry.parkId && s.exitMin === null
              ? pushSessionAction({ ...s, sessionStatusId: 2, paymentStatusId: 5, amount: 0 }, {
                at: state.nowMin, by: 'Sistem', label: 'Beyaz liste uygulandı',
              })
              : s
          ),
        };
      }
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, {
          title: entry.kind === 'white' ? 'Beyaz listeye eklendi' : 'Kara listeye eklendi',
          body: `${entry.plateTxt} · cihazlara senkronize edildi`,
          tone: entry.kind === 'white' ? 'success' : 'danger', duration: 4500,
        }),
      };
    }

    case 'LIST_UPDATE':
      return {
        ...state,
        world: bumpSeq({
          ...state.world,
          lists: state.world.lists.map((l) => (l.id === action.id ? { ...l, ...action.patch } : l)),
        }),
        toasts: pushToast(state, { title: 'Kayıt güncellendi', tone: 'success', duration: 3000 }),
      };

    case 'LIST_REMOVE':
      return {
        ...state,
        world: bumpSeq({ ...state.world, lists: state.world.lists.filter((l) => l.id !== action.id) }),
        toasts: pushToast(state, { title: 'Kayıt silindi', body: 'Cihazlara senkronize edildi.', tone: 'neutral', duration: 3500 }),
      };

    case 'LIST_IMPORT': {
      let world = bumpSeq(state.world);
      const entries: ListEntry[] = action.rows.map((r, i) => ({
        id: `${action.kind === 'white' ? 'WLE' : 'BLE'}-IMP-${world.seq}-${i}`,
        parkId: action.parkId,
        kind: action.kind,
        plateTxt: upperTR(r.plate).trim(),
        name: r.name,
        companyName: r.company,
        phone: r.phone,
        description: r.description,
        expiryAtMin: null,
        createdAtMin: state.nowMin,
        deleted: false,
      }));
      world = { ...world, lists: [...entries, ...world.lists] };
      return {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: `${entries.length} kayıt içe aktarıldı`, body: 'Cihazlara senkronize edildi.', tone: 'success', duration: 4500 }),
      };
    }

    /* ---------------- destek ---------------- */
    case 'TICKET_CREATE':
    case 'MOBILE_CREATE_TICKET': {
      let world = bumpSeq(state.world);
      const isMobile = action.type === 'MOBILE_CREATE_TICKET';
      const ticket: SupportTicket = {
        id: seqId(world, 'SUP'),
        parkId: action.parkId,
        subject: action.subject,
        content: action.content,
        category: action.category,
        status: 'open',
        priority: isMobile ? 'normal' : action.priority,
        source: isMobile ? 'mobil' : action.source,
        createdBy: isMobile ? world.mobileUser.name : 'Tesis Yöneticisi',
        assignedTo: null,
        plateTxt: action.plate ?? null,
        createdAtMin: state.nowMin,
        updatedAtMin: state.nowMin,
        closedAtMin: null,
        attachments: action.attachments ?? [],
        replies: [],
      };
      world = { ...world, tickets: [ticket, ...world.tickets] };
      const base: PanelState = {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Destek talebi oluşturuldu', body: `${ticket.id} · ${ticket.subject}`, tone: 'success', duration: 4500 }),
      };
      if (!isMobile) return base;
      return {
        ...base,
        notifications: pushNotice(state, {
          title: 'Mobilden destek talebi', body: `${ticket.subject}`, tone: 'info', targetModule: 'support',
        }),
        mobile: addBridge(
          { ...state.mobile, stack: [...state.mobile.stack.slice(0, -1), { name: 'support' }] },
          {
            id: seqId(world, 'BRG'), atMin: state.nowMin,
            label: 'Destek talebi açıldı',
            detail: `Destek modülüne kaynak='mobil' etiketiyle düştü`,
            targetModule: 'support', targetId: ticket.id,
          }
        ),
      };
    }

    case 'TICKET_REPLY':
    case 'MOBILE_REPLY_TICKET': {
      const isMobile = action.type === 'MOBILE_REPLY_TICKET';
      const sender: 'partner' | 'agent' = isMobile ? 'partner' : action.sender;
      let world = bumpSeq(state.world);
      const reply = {
        id: seqId(world, 'REP'),
        sender,
        body: action.body,
        attachments: isMobile ? [] : (action.attachments ?? []),
        createdAtMin: state.nowMin,
        isInternalNote: false,
        isTemplate: isMobile ? false : action.isTemplate,
      };
      world = {
        ...world,
        tickets: world.tickets.map((t) =>
          t.id === action.id
            ? { ...t, replies: [...t.replies, reply], updatedAtMin: state.nowMin, status: t.status === 'closed' ? 'open' : t.status }
            : t
        ),
      };
      const base: PanelState = {
        ...state, world: bumpSeq(world),
        toasts: pushToast(state, { title: 'Yanıt gönderildi', tone: 'success', duration: 3500 }),
      };
      if (!isMobile) return base;
      return {
        ...base,
        mobile: addBridge(state.mobile, {
          id: seqId(world, 'BRG'), atMin: state.nowMin,
          label: 'Talebe yanıt yazıldı',
          detail: 'Destek modülündeki sohbette görünür',
          targetModule: 'support', targetId: action.id,
        }),
      };
    }

    case 'TICKET_SET_STATUS':
      return {
        ...state,
        world: bumpSeq({
          ...state.world,
          tickets: state.world.tickets.map((t) =>
            t.id === action.id ? { ...t, status: action.status, updatedAtMin: state.nowMin } : t
          ),
        }),
        toasts: pushToast(state, { title: 'Durum güncellendi', tone: 'info', duration: 3000 }),
      };

    case 'TICKET_ASSIGN':
      return {
        ...state,
        world: bumpSeq({
          ...state.world,
          tickets: state.world.tickets.map((t) =>
            t.id === action.id ? { ...t, assignedTo: action.assignee, status: t.status === 'open' ? 'in_progress' : t.status, updatedAtMin: state.nowMin } : t
          ),
        }),
        toasts: pushToast(state, { title: action.assignee ? `Atandı: ${action.assignee}` : 'Atama kaldırıldı', tone: 'info', duration: 3000 }),
      };

    case 'TICKET_CLOSE':
      return {
        ...state,
        world: bumpSeq({
          ...state.world,
          tickets: state.world.tickets.map((t) =>
            t.id === action.id ? { ...t, status: 'closed', closedAtMin: state.nowMin, updatedAtMin: state.nowMin } : t
          ),
        }),
        toasts: pushToast(state, { title: 'Talep kapatıldı', tone: 'neutral', duration: 3500 }),
      };

    /* ---------------- mobil: gezinme ---------------- */
    case 'MOBILE_NAV': {
      const m = state.mobile;
      if (action.op === 'pop') {
        return { ...state, mobile: { ...m, stack: m.stack.length > 1 ? m.stack.slice(0, -1) : m.stack, sheet: null } };
      }
      if (action.op === 'reset') {
        return { ...state, mobile: { ...m, stack: action.route ? [action.route] : [{ name: 'parkings' }], sheet: null } };
      }
      if (!action.route) return state;
      if (action.op === 'replace') {
        return { ...state, mobile: { ...m, stack: [...m.stack.slice(0, -1), action.route], sheet: null } };
      }
      return { ...state, mobile: { ...m, stack: [...m.stack, action.route], sheet: null } };
    }

    case 'MOBILE_SET_TAB': {
      const root: Record<MobileTab, MobileRouteName> = {
        parkings: 'parkings', subscriptions: 'subscriptions', debts: 'debts', profile: 'profile',
      };
      return { ...state, mobile: { ...state.mobile, tab: action.tab, stack: [{ name: root[action.tab] }], sheet: null } };
    }

    case 'MOBILE_SHEET':
      return { ...state, mobile: { ...state.mobile, sheet: action.sheet } };

    case 'MOBILE_SET_FORM':
      return { ...state, mobile: { ...state.mobile, forms: { ...state.mobile.forms, [action.key]: action.value } } };

    case 'MOBILE_CLEAR_FORMS': {
      if (!action.keys) return { ...state, mobile: { ...state.mobile, forms: {} } };
      const forms = { ...state.mobile.forms };
      action.keys.forEach((k) => delete forms[k]);
      return { ...state, mobile: { ...state.mobile, forms } };
    }

    case 'MOBILE_NOTICE':
      return {
        ...state,
        mobile: { ...state.mobile, notice: action.text ? { text: action.text, tone: action.tone ?? 'info' } : null },
      };

    case 'MOBILE_SET_SCALE':
      return { ...state, mobile: { ...state.mobile, scale: action.scale } };

    case 'MOBILE_LOGIN':
      return { ...state, mobile: { ...state.mobile, authed: true, tab: 'parkings', stack: [{ name: 'parkings' }] } };

    case 'MOBILE_LOGOUT':
      /* Site telefon ikizinde login yok — çıkış yine otopark köküne döner. */
      return {
        ...state,
        mobile: {
          ...INITIAL_MOBILE,
          bridge: state.mobile.bridge,
          scale: state.mobile.scale,
          notice: { text: 'Demo oturumu açık kalır.', tone: 'info' },
        },
      };

    case 'MOBILE_RESET':
      return { ...state, mobile: { ...INITIAL_MOBILE, scale: state.mobile.scale } };

    /* ---------------- mobil: köprü aksiyonları ---------------- */
    case 'MOBILE_PAY_DEBT': {
      const targets = state.world.sessions.filter((s) => action.sessionIds.includes(s.id));
      if (targets.length === 0) return state;
      let working: PanelState = state;
      let total = 0;
      targets.forEach((t) => {
        const fresh = findSession(working.world, t.id);
        if (!fresh) return;
        const res = collect(working, fresh, MOBILE_PAYMENT_METHOD_ID, 'Mobil');
        total += fresh.amount;
        working = { ...working, world: res.world };
      });
      const plate = targets[0].plateTxt;
      const card = state.world.cards.find((c) => c.id === action.cardId);
      return {
        ...working,
        notifications: pushNotice(working, {
          title: 'Mobil ödeme alındı',
          body: `${plate} · ${formatTL(total)}`,
          tone: 'success',
          targetModule: 'payments',
          targetTab: 'payments',
        }),
        toasts: pushToast(working, {
          title: 'Mobil ödeme başarılı',
          body: `${plate} · ${formatTL(total)}${card ? ` · •••• ${card.last3}` : ''}`,
          tone: 'success', duration: 5000,
        }),
        mobile: addBridge(state.mobile, {
          id: seqId(working.world, 'BRG'),
          atMin: state.nowMin,
          label: 'Borç ödendi',
          detail: `Tahsilat · Ödemeler'de kanal='Mobil' kaydı oluştu`,
          targetModule: 'payments',
          targetId: targets[0].id,
        }),
      };
    }

    case 'MOBILE_BUY_MEMBERSHIP': {
      const pkg = state.world.packages.find((p) => p.id === action.packageId);
      const park = findPark(state.world, action.parkId);
      if (!pkg || !park) return state;
      if (park.membershipUsed >= park.capacityMembership && park.capacityMembership > 0) {
        return {
          ...state,
          mobile: { ...state.mobile, notice: { text: 'Abonelik kotası dolu. Web’den başvurabilirsiniz.', tone: 'warning' } },
        };
      }
      let world = bumpSeq(state.world);
      const membership: Membership = {
        id: seqId(world, 'MEM'),
        parkId: action.parkId,
        subUserName: world.mobileUser.name,
        subUserPhone: action.phone,
        subUserEmail: world.mobileUser.email,
        companyName: action.companyName ?? null,
        companyVat: action.companyVat ?? null,
        plateTxt: upperTR(action.plate).trim(),
        packageId: pkg.id,
        amount: pkg.cost,
        statusId: 'active',
        paymentMethodId: MOBILE_PAYMENT_METHOD_ID,
        paymentStatusId: 2,
        subscribedAtMin: state.nowMin,
        availableUntilMin: state.nowMin + pkg.durationDays * 1440,
        autoRenew: false,
        terminatedAtMin: null,
        extensions: [],
        activities: [{ atMin: state.nowMin, label: 'Mobil uygulamadan satın alındı', by: 'Mobil' }],
        fromMobile: true,
      };
      world = bumpSeq(world);
      const payment = makePayment(world, {
        membershipId: membership.id, parkId: action.parkId, plateTxt: membership.plateTxt,
        serviceId: MOBILE_PAYMENT_METHOD_ID, amount: pkg.cost, channel: 'Mobil', categoryId: 6, atMin: state.nowMin,
      });
      world = {
        ...world,
        memberships: [membership, ...world.memberships],
        payments: [payment, ...world.payments],
        parks: world.parks.map((p) => (p.id === action.parkId ? { ...p, membershipUsed: p.membershipUsed + 1 } : p)),
        ledger: addLedger(world, action.parkId, { membership: pkg.cost }),
      };
      world = bumpSeq(world);
      world = {
        ...world,
        events: [
          makeEvent(world, 'membership', action.parkId, `${membership.plateTxt} · mobilden abonelik alındı`, {
            atMin: state.nowMin, plate: membership.plateTxt, amount: pkg.cost,
          }),
          ...world.events,
        ].slice(0, 120),
      };
      return {
        ...state,
        world: bumpSeq(world),
        notifications: pushNotice(state, {
          title: 'Mobilden abonelik satıldı',
          body: `${pkg.name} · ${membership.plateTxt} · ${formatTL(pkg.cost)}`,
          tone: 'success', targetModule: 'memberships',
        }),
        toasts: pushToast(state, { title: 'Abonelik aktif', body: `${pkg.name} · ${pkg.durationDays} gün`, tone: 'success', duration: 5000 }),
        mobile: addBridge(state.mobile, {
          id: seqId(world, 'BRG'), atMin: state.nowMin,
          label: 'Abonelik satın alındı',
          detail: 'Abonelikler listesine eklendi, kota 1 azaldı',
          targetModule: 'memberships', targetId: membership.id,
        }),
      };
    }

    case 'MOBILE_ADD_VEHICLE': {
      const plate = upperTR(action.plate).trim();
      if (plate.replace(/\s/g, '').length < 6) {
        return { ...state, mobile: { ...state.mobile, notice: { text: 'Plaka en az 6 karakter olmalıdır.', tone: 'danger' } } };
      }
      if (state.world.vehicles.some((v) => v.plateTxt.replace(/\s/g, '') === plate.replace(/\s/g, ''))) {
        return { ...state, mobile: { ...state.mobile, notice: { text: 'Bu plaka zaten araçlarınız arasında kayıtlı.', tone: 'warning' } } };
      }
      let world = bumpSeq(state.world);
      world = {
        ...world,
        vehicles: [...world.vehicles, { id: seqId(world, 'VHC'), plateTxt: plate, isDefault: world.vehicles.length === 0 }],
      };
      return {
        ...state, world: bumpSeq(world),
        mobile: addBridge(
          { ...state.mobile, notice: { text: 'Araç eklendi.', tone: 'success' }, stack: state.mobile.stack.slice(0, -1) },
          {
            id: seqId(world, 'BRG'), atMin: state.nowMin, label: 'Araç eklendi',
            detail: 'Abonelik adımındaki plaka listesinde seçilebilir',
            targetModule: 'mobile', targetId: null,
          }
        ),
      };
    }

    case 'MOBILE_REMOVE_VEHICLE':
      return {
        ...state,
        world: bumpSeq({ ...state.world, vehicles: state.world.vehicles.filter((v) => v.id !== action.id) }),
        mobile: { ...state.mobile, notice: { text: 'Araç kaldırıldı.', tone: 'neutral' } },
      };

    case 'MOBILE_ADD_CARD': {
      // GÜVENLİK: yalnızca marka + son 3 hane + sahip adı saklanır.
      let world = bumpSeq(state.world);
      world = {
        ...world,
        cards: [
          ...world.cards.map((c) => ({ ...c, isDefault: false })),
          {
            id: seqId(world, 'CRD'),
            brand: action.brand,
            last3: action.last3,
            holderName: upperTR(action.holderName),
            expireMonth: action.expireMonth,
            expireYear: action.expireYear,
            isDefault: true,
            isExpired: false,
          },
        ],
      };
      return {
        ...state, world: bumpSeq(world),
        mobile: { ...state.mobile, notice: { text: 'Kart eklendi ve varsayılan yapıldı.', tone: 'success' }, stack: state.mobile.stack.slice(0, -1) },
      };
    }

    case 'MOBILE_SET_DEFAULT_CARD':
      return {
        ...state,
        world: bumpSeq({
          ...state.world,
          cards: state.world.cards.map((c) => ({ ...c, isDefault: c.id === action.id })),
        }),
        mobile: { ...state.mobile, notice: { text: 'Varsayılan kart güncellendi.', tone: 'success' } },
      };

    case 'MOBILE_DELETE_CARD':
      return {
        ...state,
        world: bumpSeq({ ...state.world, cards: state.world.cards.filter((c) => c.id !== action.id) }),
        mobile: { ...state.mobile, notice: { text: 'Kart silindi.', tone: 'neutral' } },
      };

    case 'MOBILE_TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        world: {
          ...state.world,
          mobileUser: { ...state.world.mobileUser, notificationsEnabled: !state.world.mobileUser.notificationsEnabled },
        },
      };

    default:
      return state;
  }
}

/* ==========================================================================
   6 · CONTEXT
   ========================================================================== */

const PanelStateContext = createContext<PanelState | null>(null);
const PanelDispatchContext = createContext<Dispatch<PanelAction> | null>(null);

/* v2: sabitlemeler artık modül değil MENÜ satırı kimliği tutuyor. */
const PINS_KEY = (role: PanelRole, parkId: number) => `vsf_panel_pins2_${role}_${parkId}`;
const SIDEBAR_KEY = 'vsf_panel_sidebar';
const REFRESH_KEY = 'vsf_panel_refresh';

/** Hash: /panel#sessions?park=2&tab=inside */
function parseHash(hash: string): { module?: ModuleId; parkId?: number; tab?: string } {
  const raw = hash.replace(/^#/, '');
  if (!raw) return {};
  const [name, query] = raw.split('?');
  const out: { module?: ModuleId; parkId?: number; tab?: string } = {};
  if (MODULES.some((m) => m.id === name)) out.module = name as ModuleId;
  if (query) {
    const params = new URLSearchParams(query);
    const park = params.get('park');
    if (park !== null && !Number.isNaN(Number(park))) out.parkId = Number(park);
    const tab = params.get('tab');
    if (tab) out.tab = tab;
  }
  return out;
}

export function PanelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(panelReducer, undefined, createInitialState);
  const syncedRef = useRef(false);
  /** Adres çubuğuna en son YAZDIĞIMIZ hash — push/replace kararı buna bakar. */
  const hashRef = useRef<string | null>(null);
  /**
   * Açılış sürerken geçmişe YENİ kayıt yazılmaz. Derin bağlantıyla gelen
   * ziyaretçi (ör. /panel#payments?park=2) ilk render'da varsayılan modülle
   * başlayıp hemen hedefe geçtiği için, bu koruma olmadan geçmişe sahte bir
   * "Ana Ekran" adımı sıkışır ve geri düğmesi sayfadan çıkmak yerine oraya
   * döner. Açılış dispatch'leri işlendikten sonra (bir makrogörev) serbest.
   */
  const bootingRef = useRef(true);

  /* --- Saat senkronu + hash okuma (yalnızca istemcide, bir kez) --- */
  useEffect(() => {
    if (syncedRef.current) return;
    syncedRef.current = true;
    dispatch({ type: 'SYNC_CLOCK', epochMs: Date.now() });

    const h = parseHash(window.location.hash);
    if (h.parkId !== undefined) dispatch({ type: 'SET_PARK', parkId: h.parkId });
    if (h.module) dispatch({ type: 'SET_MODULE', module: h.module, tab: h.tab });

    try {
      const sidebar = window.localStorage.getItem(SIDEBAR_KEY);
      const refresh = window.localStorage.getItem(REFRESH_KEY);
      dispatch({
        type: 'RESTORE_PREFS',
        sidebarCollapsed: sidebar === null ? undefined : sidebar === '1',
        refreshMs: refresh === null ? undefined : refresh === 'off' ? null : Number(refresh),
      });
    } catch {
      /* localStorage engelliyse sessizce geç */
    }
  }, []);

  /* --- Açılış korumasını serbest bırak ---
     AYRI bir etki olmak zorunda: yukarıdaki etki `syncedRef` ile korunduğu
     için StrictMode'un ikinci çağrısında erken döner ve temizlenen
     zamanlayıcıyı bir daha kurmazdı; koruma sonsuza dek açık kalır, geri/ileri
     çalışmazdı. Bu etki korumasızdır, her kurulumda yeniden zamanlanır. */
  useEffect(() => {
    const boot = setTimeout(() => { bootingRef.current = false; }, 0);
    return () => clearTimeout(boot);
  }, []);

  /* --- Sabitlenenleri rol + tesis bazında yükle --- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PINS_KEY(state.role, state.parkId));
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      // Bilinmeyen kimlikler (eski sürümden kalan) sessizce atılır.
      const pins = Array.isArray(parsed) ? parsed.filter((id) => MENU.some((e) => e.id === id)) : [];
      dispatch({ type: 'RESTORE_PREFS', pins });
    } catch {
      /* yoksay */
    }
  }, [state.role, state.parkId]);

  /* --- Tercihleri yaz --- */
  useEffect(() => {
    try {
      window.localStorage.setItem(PINS_KEY(state.role, state.parkId), JSON.stringify(state.pins));
    } catch { /* yoksay */ }
  }, [state.pins, state.role, state.parkId]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_KEY, state.sidebarCollapsed ? '1' : '0');
      window.localStorage.setItem(REFRESH_KEY, state.refreshMs === null ? 'off' : String(state.refreshMs));
    } catch { /* yoksay */ }
  }, [state.sidebarCollapsed, state.refreshMs]);

  /* --- Hash yazımı (derin bağlantı + tarayıcı geçmişi) ---
     MODÜL değişimi tarayıcı geçmişine YENİ bir kayıt yazar (pushState), böylece
     geri/ileri düğmeleri modüller arasında gezinir. Aynı modül içindeki tesis,
     sekme gibi değişiklikler geçmişi şişirmemek için mevcut kaydı günceller
     (replaceState). Paylaşılan bağlantı her iki durumda da adres çubuğunda
     güncel kalır. */
  useEffect(() => {
    if (!syncedRef.current) return;
    const tab = state.ui[state.module]?.tab;
    const next = `#${state.module}?park=${state.parkId}${tab ? `&tab=${tab}` : ''}`;
    if (window.location.hash === next) {
      hashRef.current = next;
      return;
    }
    const prevModule = hashRef.current ? hashRef.current.replace(/^#/, '').split('?')[0] : null;
    hashRef.current = next;
    if (!bootingRef.current && prevModule !== null && prevModule !== state.module) {
      window.history.pushState(null, '', next);
    } else {
      window.history.replaceState(null, '', next);
    }
  }, [state.module, state.parkId, state.ui]);

  /* --- Geri / İleri --- */
  useEffect(() => {
    const onPop = () => {
      const h = parseHash(window.location.hash);
      hashRef.current = window.location.hash || null;
      if (h.parkId !== undefined) dispatch({ type: 'SET_PARK', parkId: h.parkId });
      if (h.module) dispatch({ type: 'SET_MODULE', module: h.module, tab: h.tab });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  /* --- SİMÜLASYON DÖNGÜSÜ ---
     Tek interval; aralık üst bardaki otomatik yenileme seçimidir.
     document.hidden iken tick DURUR (bant genişliği/CPU tasarrufu);
     unmount'ta temizlenir. */
  useEffect(() => {
    if (state.refreshMs === null) return;
    if (typeof document === 'undefined') return;

    let cancelled = false;
    const id = setInterval(() => {
      if (cancelled) return;
      if (document.hidden) return;
      const nowMin = (Date.now() - state.epochMs) / 60_000;
      dispatch({ type: 'SIM_TICK', nowMin });
    }, state.refreshMs);

    return () => { cancelled = true; clearInterval(id); };
  }, [state.refreshMs, state.epochMs]);

  return (
    <PanelStateContext.Provider value={state}>
      <PanelDispatchContext.Provider value={dispatch}>{children}</PanelDispatchContext.Provider>
    </PanelStateContext.Provider>
  );
}

/* ==========================================================================
   7 · HOOK'LAR
   ========================================================================== */

export function usePanelState(): PanelState {
  const ctx = useContext(PanelStateContext);
  if (!ctx) throw new Error('usePanelState yalnızca <PanelProvider> içinde kullanılabilir.');
  return ctx;
}

export function usePanelDispatch(): Dispatch<PanelAction> {
  const ctx = useContext(PanelDispatchContext);
  if (!ctx) throw new Error('usePanelDispatch yalnızca <PanelProvider> içinde kullanılabilir.');
  return ctx;
}

export const useWorld = (): DemoWorld => usePanelState().world;

/** null = "Tüm Otoparklar" (parkId 0) seçili. */
export function useCurrentPark(): DemoPark | null {
  const { world, parkId } = usePanelState();
  return useMemo(() => (parkId === ALL_PARKS_ID ? null : findPark(world, parkId)), [world, parkId]);
}

export const useIsAllParks = (): boolean => usePanelState().parkId === ALL_PARKS_ID;

export function useModuleUi(module: ModuleId): ModuleUiState {
  const { ui } = usePanelState();
  return ui[module] ?? emptyUi(module);
}

/** Biçimleyicilere verilecek epoch + now ikilisi. */
export function useClock(): { epochMs: number; nowMin: number; synced: boolean } {
  const { epochMs, nowMin, clockSynced } = usePanelState();
  return { epochMs, nowMin, synced: clockSynced };
}

/**
 * `useState` ile AYNI imzayı taşıyan, ama değeri modül ekranının dışında —
 * reducer'da — tutan kancadır.
 *
 * NEDEN: `PanelShell` yalnızca seçili modülü render eder; başka bir modüle
 * geçince ekran unmount olur ve `useState`'teki her şey silinir. Kullanıcının
 * ÜRETTİĞİ kayıt (eklenen tablet, düzenlenen kamera, kaydedilen ayar) bu
 * yüzden geri dönüldüğünde yok oluyordu. Bu kanca o veriyi panelin ömrü
 * boyunca yaşatır.
 *
 *   const [tablets, setTablets] = usePersistentState<TabletRow[]>('devices.tablets', () => SEED);
 *
 * KURAL: yalnızca kalıcı olması GEREKEN veri. Modal açık/kapalı, taslak form,
 * seçili satır gibi geçici durum normal `useState` ile kalmalıdır — ekran
 * kapanınca sıfırlanması doğru davranıştır.
 *
 * `key` bileşenin ömrü boyunca sabit olmalıdır ve modül adıyla ad alanına
 * alınır (`'devices.tablets'`), böylece iki ekran çakışmaz.
 */
export function usePersistentState<T>(
  key: string,
  initial: T | (() => T)
): [T, (next: T | ((prev: T) => T)) => void] {
  const { moduleData } = usePanelState();
  const dispatch = usePanelDispatch();

  /* Tohum bir KEZ hesaplanır (useState'in tembel başlangıcıyla aynı). */
  const seedRef = useRef<{ v: T } | null>(null);
  if (seedRef.current === null) {
    seedRef.current = { v: typeof initial === 'function' ? (initial as () => T)() : initial };
  }
  const seed = seedRef.current.v;

  const value = Object.prototype.hasOwnProperty.call(moduleData, key)
    ? (moduleData[key] as T)
    : seed;

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      if (typeof next === 'function') {
        dispatch({
          type: 'SET_MODULE_DATA',
          key,
          updater: (prev) => (next as (p: T) => T)(prev as T),
          fallback: seed,
        });
      } else {
        dispatch({ type: 'SET_MODULE_DATA', key, value: next });
      }
    },
    [dispatch, key, seed]
  );

  return [value, set];
}

/** Ledger deltası (test/teşhis amaçlı). */
export function useLedger(parkId: number) {
  const { world } = usePanelState();
  return world.ledger[parkId] ?? EMPTY_LEDGER;
}

/* ==========================================================================
   8 · YARDIMCI AKSİYONLAR (yan etkili — hook içinde yaşar)
   ========================================================================== */

/** Gerçek panelin zamanlama hissi. */
export const TIMING = { barrier: 600, threeDS: 900, reportQueue: 3000, deviceRestart: 20_000 };

export interface PanelHelpers {
  toast: (title: string, body?: string, tone?: Tone, duration?: number) => void;
  notify: (title: string, body: string, tone?: Tone, targetModule?: ModuleId) => void;
  goto: (module: ModuleId, tab?: string, filters?: Record<string, string>) => void;
  /** Onaylı bariyer açma: ~600 ms sonra sonuç üretir, BarrierLog'a kayıt düşer. */
  openBarrier: (barrierId: string, reason: string) => void;
  /** Cihaz servis yeniden başlatma: 20 sn sonra Aktif'e döner. */
  restartDevice: (deviceId: string) => void;
  /** Rapor kuyruğu deseni: ~3 sn sonra bildirim ziline düşer. */
  queueReport: (label: string, targetModule?: ModuleId) => void;
  /** 3DS simülasyonu: ~900 ms sonra callback. */
  simulate3DS: (onDone: (ok: boolean) => void) => void;
}

export function usePanelHelpers(): PanelHelpers {
  const dispatch = usePanelDispatch();
  const state = usePanelState();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current = []; }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const toast = useCallback(
    (title: string, body?: string, tone: Tone = 'info', duration = 4000) => {
      dispatch({ type: 'PUSH_TOAST', toast: { title, body, tone, duration } });
    },
    [dispatch]
  );

  const notify = useCallback(
    (title: string, body: string, tone: Tone = 'info', targetModule?: ModuleId) => {
      dispatch({ type: 'PUSH_NOTICE', notice: { title, body, tone, targetModule } });
    },
    [dispatch]
  );

  const goto = useCallback(
    (module: ModuleId, tab?: string, filters?: Record<string, string>) => {
      dispatch({ type: 'SET_MODULE', module, tab, filters });
    },
    [dispatch]
  );

  const openBarrier = useCallback(
    (barrierId: string, reason: string) => {
      dispatch({ type: 'BARRIER_OPEN_START', barrierId });
      const seedSource = state.tick + barrierId.length;
      later(() => {
        // Yedekli komut yolu: önce PMSP, başarısızsa Tailscale (gate)
        const roll = (Math.sin(seedSource * 12.9898) * 43758.5453) % 1;
        const v = Math.abs(roll);
        const outcome = v > 0.82 ? (v > 0.93 ? 'failed' : 'unconfirmed') : 'opened';
        const transport = v > 0.7 ? 'gate' : 'pmsp';
        dispatch({ type: 'BARRIER_OPEN_RESULT', barrierId, outcome, transport, reason });
      }, TIMING.barrier);
    },
    [dispatch, later, state.tick]
  );

  const restartDevice = useCallback(
    (deviceId: string) => {
      dispatch({ type: 'DEVICE_RESTART', deviceId });
      later(() => dispatch({ type: 'DEVICE_RESTART_DONE', deviceId }), TIMING.deviceRestart);
    },
    [dispatch, later]
  );

  const queueReport = useCallback(
    (label: string, targetModule?: ModuleId) => {
      dispatch({
        type: 'PUSH_TOAST',
        toast: { title: 'Kuyruğa alındı', body: `${label} hazır olunca bildirim alacaksınız.`, tone: 'info', duration: 4000 },
      });
      later(() => {
        dispatch({
          type: 'PUSH_NOTICE',
          notice: { title: `${label} hazır`, body: 'Görüntülemek için tıklayın.', tone: 'success', targetModule },
        });
      }, TIMING.reportQueue);
    },
    [dispatch, later]
  );

  const simulate3DS = useCallback(
    (onDone: (ok: boolean) => void) => {
      later(() => onDone(true), TIMING.threeDS);
    },
    [later]
  );

  return useMemo(
    () => ({ toast, notify, goto, openBarrier, restartDevice, queueReport, simulate3DS }),
    [toast, notify, goto, openBarrier, restartDevice, queueReport, simulate3DS]
  );
}
