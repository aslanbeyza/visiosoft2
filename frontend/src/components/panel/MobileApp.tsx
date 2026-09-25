'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { upperTR } from '@/lib/text';
import { corporate } from '@/lib/content';
import {
  ALL_PARKS_ID,
  TICKET_CATEGORY,
  formatDate,
  formatDateTime,
  formatDuration,
  formatInt,
  formatRelative,
  formatTL,
  formatTime,
  membershipStatus,
  money2,
  paymentStatus,
  r2,
  selectDebts,
  sessionDuration,
  ticketStatus,
  vehicleClass,
  type BridgeRecord,
  type DemoPark,
  type DemoWorld,
  type IconKey,
  type Membership,
  type ModuleId,
  type SavedCard,
  type SupportTicket,
  type TicketCategoryId,
  type Tone,
} from '@/lib/panelDemo';
import {
  Badge,
  Button,
  Card,
  DemoBadge,
  Icon,
  IdleGuard,
  Notice,
  SectionTitle,
  StatusDot,
  cx,
  TONE_BAR,
  TONE_TEXT,
} from './ui';
import {
  usePanelDispatch,
  usePanelHelpers,
  usePanelState,
  type MobileRoute,
  type MobileRouteName,
  type MobileTab,
} from './PanelProvider';

const TR_FOLD: Record<string, string> = {
  Ç: 'C', Ğ: 'G', İ: 'I', I: 'I', Ö: 'O', Ş: 'S', Ü: 'U',
};

function normalizePlate(raw: string): string {
  const up = upperTR(raw);
  let out = '';
  for (const ch of up) {
    const folded = TR_FOLD[ch] ?? ch;
    if (/[A-Z0-9]/.test(folded)) out += folded;
  }
  return out.slice(0, 9);
}

function prettyPlate(raw: string): string {
  const p = raw.replace(/\s/g, '');
  const m = /^(\d{1,2})([A-Z]{1,3})(\d{2,5})$/.exec(p);
  if (!m) return raw;
  return `${m[1]} ${m[2]} ${m[3]}`;
}

const plateKey = (s: string) => normalizePlate(s);

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => upperTR(p.charAt(0))).join('') || 'VS';
}

function brandOf(digits: string): string {
  if (digits.startsWith('4')) return 'Visa';
  if (digits.startsWith('5')) return 'Mastercard';
  if (digits.startsWith('9')) return 'Troy';
  if (digits.startsWith('3')) return 'Amex';
  return 'Kart';
}

function vatLookup(vat: string): { title: string; office: string; city: string } {
  const n = vat.split('').reduce((a, c) => a + (Number(c) || 0), 0);
  const titles = ['Demo Lojistik A.Ş.', 'Örnek Filo Kiralama Ltd. Şti.', 'Numune Teknoloji A.Ş.', 'Taslak Dağıtım Ltd. Şti.'];
  const offices = ['İkitelli', 'Şişli', 'Kadıköy', 'Beşiktaş'];
  return {
    title: titles[n % titles.length],
    office: `${offices[n % offices.length]} Vergi Dairesi`,
    city: 'İstanbul',
  };
}

const EXTRA_PATHS: Record<string, string> = {
  building: 'M4 21V6.5L11 3l7 3.5V21M9.5 21v-4.5h5V21M8 9.5h.01M12 9.5h.01M16 9.5h.01M8 13h.01M12 13h.01M16 13h.01',
  cardIcon: 'M3 7h18v11H3zM3 11h18M6.5 15h3.5',
  navigate: 'M21 3 3.5 10.2l7.6 2.7L13.8 20.5z',
  chat: 'M4.5 5h15v10.5h-10L4.5 19z',
  chipIcon: 'M8.5 8.5h7v7h-7zM4.5 10.5h4M4.5 13.5h4M15.5 10.5h4M15.5 13.5h4M10.5 4.5v4M13.5 4.5v4M10.5 15.5v4M13.5 15.5v4',
  battery: 'M2.5 8.5h16v7h-16zM20.5 11v2',
  wifi: 'M5 10.8a10 10 0 0 1 14 0M8 14.2a6 6 0 0 1 8 0M12 17.8h.01',
  bars: 'M4.5 18v-2.5M9.5 18v-5.5M14.5 18v-8.5M19.5 18V6',
  attach: 'M20.5 11.5 12 20a5 5 0 0 1-7-7l8.2-8.2a3.3 3.3 0 1 1 4.7 4.7l-8.2 8.2a1.6 1.6 0 1 1-2.3-2.3l7.6-7.6',
  image: 'M3.5 5h17v14h-17zM3.5 15.5l4.5-4.5 3.5 3.5 3-3 6 6M8.5 9h.01',
  expand: 'M9.5 4.5h-5v5M14.5 4.5h5v5M14.5 19.5h5v-5M9.5 19.5h-5v-5',
  login: 'M14.5 8.5V6.5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2M10 12h10m0 0-3-3m3 3-3 3',
  logout: 'M14.5 8.5V6.5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2M20 12H10m0 0 3-3m-3 3 3 3',
  timer: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 2M9.5 3h5',
  ban: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.6 5.6l12.8 12.8',
};

type MIconKey = IconKey | keyof typeof EXTRA_PATHS;

function MIcon({ name, size = 18, className }: { name: MIconKey; size?: number; className?: string }) {
  const extra = EXTRA_PATHS[name as string];
  if (!extra) return <Icon name={name as IconKey} size={size} className={className} />;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cx('shrink-0', className)}
    >
      <path d={extra} />
    </svg>
  );
}

function MCard({
  children, className, onClick, ariaLabel,
}: { children: ReactNode; className?: string; onClick?: () => void; ariaLabel?: string }) {
  const cls = cx(
    'rounded-[22px] border border-line bg-carbon p-3.5 shadow-sm',
    onClick && 'w-full text-left transition-colors hover:border-electric/50 focus-visible:border-electric',
    className
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={ariaLabel} className={cls}>
        {children}
      </button>
    );
  }
  return <div className={cls}>{children}</div>;
}

type MVariant = 'primary' | 'soft' | 'outline' | 'ghost' | 'danger';

function MButton({
  children, onClick, variant = 'primary', disabled, icon, full = true, small, type = 'button', ariaLabel,
}: {
  children: ReactNode; onClick?: () => void; variant?: MVariant; disabled?: boolean;
  icon?: MIconKey; full?: boolean; small?: boolean; type?: 'button' | 'submit'; ariaLabel?: string;
}) {
  const look: Record<MVariant, string> = {
    primary: 'bg-electric text-carbon border-electric hover:bg-electric-deep',
    soft: 'bg-tint-blue text-electric-deep border-tint-blue hover:border-electric/40',
    outline: 'bg-carbon text-electric-deep border-steel hover:border-electric/60',
    ghost: 'bg-transparent text-electric-deep border-transparent hover:bg-tint-blue',
    danger: 'bg-tint-alert text-alert border-tint-alert hover:border-alert/50',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-[18px] border font-bold transition-colors',
        small ? 'min-h-[40px] px-3 text-[13px]' : 'min-h-[52px] px-4 text-[15px]',
        full && 'w-full',
        look[variant],
        disabled && 'cursor-not-allowed opacity-55'
      )}
    >
      {icon && <MIcon name={icon} size={small ? 15 : 17} />}
      {children}
    </button>
  );
}

function MLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-extrabold tracking-[0.12em] text-slatey uppercase">
      {typeof children === 'string' ? upperTR(children) : children}
    </p>
  );
}

function MInput({
  value, onChange, placeholder, invalid, help, type = 'text', maxLength, inputMode, ariaLabel, id, mono, className, onEnter,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; invalid?: boolean;
  help?: string; type?: 'text' | 'password' | 'email' | 'tel'; maxLength?: number;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'; ariaLabel?: string; id?: string;
  mono?: boolean; className?: string; onEnter?: () => void;
}) {
  return (
    <div>
      <input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) { e.preventDefault(); onEnter(); } }}
        className={cx(
          'w-full rounded-[16px] border bg-carbon px-3.5 py-3 text-[15px] font-semibold text-ink',
          'placeholder:font-normal placeholder:text-slatey/70 outline-none transition-colors',
          'focus:border-electric focus:ring-2 focus:ring-electric/20',
          invalid ? 'border-alert bg-tint-alert' : 'border-steel',
          mono && 'mono',
          className
        )}
      />
      {help && <p className={cx('mt-1.5 text-[12px]', invalid ? 'text-alert' : 'text-slatey')}>{help}</p>}
    </div>
  );
}

function MTextArea({
  value, onChange, placeholder, rows = 4, invalid, help, ariaLabel,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
  invalid?: boolean; help?: string; ariaLabel?: string;
}) {
  return (
    <div>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          'w-full resize-y rounded-[16px] border bg-carbon px-3.5 py-3 text-[14px] leading-relaxed text-ink',
          'placeholder:text-slatey/70 outline-none transition-colors focus:border-electric focus:ring-2 focus:ring-electric/20',
          invalid ? 'border-alert bg-tint-alert' : 'border-steel'
        )}
      />
      {help && <p className={cx('mt-1.5 text-[12px]', invalid ? 'text-alert' : 'text-slatey')}>{help}</p>}
    </div>
  );
}

function MSelectRow({
  icon, label, value, placeholder, onClick,
}: { icon: MIconKey; label: string; value?: string | null; placeholder: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[16px] border border-steel bg-carbon px-3.5 py-3 text-left transition-colors hover:border-electric/60"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-tint-blue text-electric-deep">
        <MIcon name={icon} size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold tracking-[0.08em] text-slatey uppercase">{upperTR(label)}</span>
        <span className={cx('block truncate text-[14px] font-semibold', value ? 'text-ink' : 'text-slatey/80')}>
          {value || placeholder}
        </span>
      </span>
      <MIcon name="chevron-right" size={16} className="text-slatey" />
    </button>
  );
}

function MChip({
  children, active, onClick, tone = 'neutral', disabled,
}: { children: ReactNode; active?: boolean; onClick?: () => void; tone?: Tone; disabled?: boolean }) {
  const base = 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors';
  if (!onClick) {
    const still: Record<Tone, string> = {
      neutral: 'border-line bg-anthracite text-ash',
      info: 'border-tint-blue bg-tint-blue text-electric-deep',
      success: 'border-tint-green bg-tint-green text-neon-deep',
      warning: 'border-tint-amber bg-tint-amber text-amber',
      danger: 'border-tint-alert bg-tint-alert text-alert',
      accent: 'border-line bg-anthracite text-plasma',
    };
    return <span className={cx(base, still[tone])}>{children}</span>;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cx(
        base,
        active ? 'border-electric bg-tint-blue text-electric-deep' : 'border-steel bg-carbon text-ash hover:border-electric/50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  );
}

function MProgress({ pct, tone = 'info' }: { pct: number; tone?: Tone }) {
  const v = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-[7px] w-full overflow-hidden rounded-full bg-graphite" role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100}>
      <span className={cx('block h-full rounded-full', TONE_BAR[tone])} style={{ width: `${r2(v)}%` }} />
    </div>
  );
}

function MEmpty({ icon = 'search', title, desc, action }: { icon?: MIconKey; title: string; desc?: string; action?: ReactNode }) {
  return (
    <MCard className="text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tint-blue text-electric-deep">
        <MIcon name={icon} size={22} />
      </span>
      <p className="mt-2.5 text-[17px] font-bold text-ink">{title}</p>
      {desc && <p className="mt-1 text-[13px] leading-relaxed text-slatey">{desc}</p>}
      {action && <div className="mt-3">{action}</div>}
    </MCard>
  );
}

function MStepper({
  steps, current, onStep, ariaLabel,
}: { steps: string[]; current: number; onStep?: (step: number) => void; ariaLabel: string }) {
  return (
    <div className="flex items-center justify-between px-1 pb-1" role="group" aria-label={ariaLabel}>
      {steps.map((label, i) => {
        const step = i + 1;
        const isActive = current === step;
        const isDone = current > step;
        const canJump = Boolean(onStep) && isDone;
        const circle = (
          <>
            <span
              className={cx(
                'flex h-7 w-7 items-center justify-center rounded-full border-2 text-[12px] font-black transition-colors',
                isDone
                  ? 'border-electric bg-electric text-carbon'
                  : isActive
                    ? 'border-electric bg-tint-blue text-electric-deep'
                    : 'border-steel bg-anthracite text-slatey'
              )}
            >
              {isDone ? <MIcon name="check" size={13} /> : step}
            </span>
            <span className={cx('mt-1.5 block text-center text-[10px] leading-tight font-bold', isActive ? 'text-ink' : 'text-slatey')}>
              {label}
            </span>
          </>
        );
        return (
          <div key={label} className="contents">
            {canJump ? (
              <button
                type="button"
                onClick={() => onStep?.(step)}
                aria-label={`${label} adımına dön`}
                className="z-10 flex w-[74px] shrink-0 flex-col items-center transition-opacity hover:opacity-70"
              >
                {circle}
              </button>
            ) : (
              <span
                aria-current={isActive ? 'step' : undefined}
                className="z-10 flex w-[74px] shrink-0 flex-col items-center"
              >
                {circle}
              </span>
            )}
            {step < steps.length && (
              <span aria-hidden className="-mx-3 mb-4 h-[2px] flex-1 rounded-full bg-graphite">
                <span className={cx('block h-full rounded-full transition-all', isDone ? 'w-full bg-electric' : 'w-0')} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PlateVisual({ value, placeholder = '34 PBZ 001' }: { value: string; placeholder?: string }) {
  const shown = value ? prettyPlate(value) : placeholder;
  return (
    <div className="mx-auto flex w-[250px] overflow-hidden rounded-[14px] border-[3px] border-ink bg-carbon">
      <div className="flex w-[38px] flex-col items-center justify-center bg-electric py-2 text-carbon">
        <span className="text-[9px] font-black tracking-[0.1em]">TR</span>
      </div>
      <div className="flex flex-1 items-center justify-center px-2 py-2.5">
        <span className={cx('mono text-[26px] leading-none font-extrabold tracking-[0.08em]', value ? 'text-ink' : 'text-slatey/45')}>
          {shown}
        </span>
      </div>
    </div>
  );
}

function StatusClock() {
  const [t, setT] = useState('--:--');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setT(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className="mono text-[13px] font-bold text-ink">{t}</span>;
}

function StatusBar({ notch = true }: { notch?: boolean }) {
  return (
    <div className={`relative flex h-[44px] shrink-0 justify-between px-6 ${notch ? 'items-end pb-1.5' : 'items-center'}`}>
      <StatusClock />
      {notch ? <span aria-hidden className="absolute top-0 left-1/2 h-[26px] w-[38%] -translate-x-1/2 rounded-b-[14px] bg-ink" /> : null}
      <span className="flex items-center gap-1.5 text-ink">
        <MIcon name="bars" size={14} />
        <MIcon name="wifi" size={14} />
        <MIcon name="battery" size={15} />
      </span>
    </div>
  );
}

function BrandedHeader({ right }: { right?: ReactNode }) {
  return (
    <div className="relative flex h-[52px] shrink-0 items-center justify-center border-b border-line px-3">
      <span className="flex items-center gap-2">
        {}
        <img
          src="/img/parkbiz-mark.jpg"
          alt=""
          aria-hidden
          width={34}
          height={28}
          className="h-7 w-[34px] object-contain"
        />
        <span className="text-[17px] font-black tracking-[-0.02em] text-ink">ParkBiz</span>
      </span>
      {right && <span className="absolute right-3">{right}</span>}
    </div>
  );
}

function StackHeader({
  title, onBack, rightLabel, onRight,
}: { title: string; onBack: () => void; rightLabel?: string; onRight?: () => void }) {
  return (
    <div className="flex h-[52px] shrink-0 items-center gap-2 border-b border-line px-2">
      <button
        type="button"
        onClick={onBack}
        aria-label="Geri"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-anthracite"
      >
        <MIcon name="chevron-left" size={20} />
      </button>
      <span className="min-w-0 flex-1 truncate text-center text-[16px] font-extrabold text-ink">{title}</span>
      {rightLabel && onRight ? (
        <button
          type="button"
          onClick={onRight}
          className="rounded-full px-2.5 py-1.5 text-[13px] font-bold text-electric-deep transition-colors hover:bg-tint-blue"
        >
          {rightLabel}
        </button>
      ) : (
        <span className="w-9" />
      )}
    </div>
  );
}

const TABS: { id: MobileTab; label: string; icon: MIconKey }[] = [
  { id: 'parkings', label: 'Otoparklar', icon: 'building' },
  { id: 'subscriptions', label: 'Abonelik', icon: 'cardIcon' },
  { id: 'debts', label: 'Borçlar', icon: 'wallet' },
  { id: 'profile', label: 'Profil', icon: 'user' },
];

function TabBar({
  tab,
  onSelect,
  hintTab,
}: {
  tab: MobileTab;
  onSelect: (t: MobileTab) => void;

  hintTab?: MobileTab | null;
}) {
  return (
    <nav aria-label="Uygulama sekmeleri" className="flex h-[62px] shrink-0 items-stretch border-t border-line bg-carbon">
      {TABS.map((t) => {
        const on = t.id === tab;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            aria-current={on ? 'page' : undefined}
            className={cx(
              'relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors',
              on ? 'text-electric' : 'text-slatey hover:text-ash'
            )}
          >
            <MIcon name={t.icon} size={on ? 22 : 20} />
            <span className="text-[11px] font-semibold">{t.label}</span>
            {hintTab === t.id && <TapHint className="-right-0.5 top-0" />}
          </button>
        );
      })}
    </nav>
  );
}

function NoticeBanner({ text, tone, onClose }: { text: string; tone: Tone; onClose: () => void }) {
  const ring: Record<Tone, string> = {
    neutral: 'border-steel text-ash',
    info: 'border-electric text-electric-deep',
    success: 'border-neon text-neon-deep',
    warning: 'border-amber text-amber',
    danger: 'border-alert text-alert',
    accent: 'border-steel text-plasma',
  };
  return (
    <button
      type="button"
      onClick={onClose}
      aria-live="polite"
      className={cx(
        'absolute inset-x-3 bottom-3 z-20 rounded-[16px] border bg-carbon px-3.5 py-2.5 text-left text-[13px] font-semibold shadow-lg',
        ring[tone]
      )}
    >
      {text}
    </button>
  );
}

function PhoneOverlay({
  title, onClose, children, footer, align = 'bottom',
}: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; align?: 'bottom' | 'center' }) {
  const ref = useRef<HTMLDivElement>(null);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); closeRef.current(); } };
    const node = ref.current;
    node?.addEventListener('keydown', onKey);
    return () => node?.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={cx('absolute inset-0 z-30 flex bg-ink/40', align === 'bottom' ? 'items-end' : 'items-center justify-center p-5')}>
      <button type="button" aria-label="Kapat" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          'relative flex max-h-[78%] w-full flex-col bg-carbon outline-none',
          align === 'bottom' ? 'rounded-t-[32px]' : 'rounded-[24px]'
        )}
      >
        {align === 'bottom' && <span aria-hidden className="mx-auto mt-2.5 h-[5px] w-10 rounded-full bg-graphite" />}
        <div className="flex items-center gap-2 px-4 py-3">
          <h3 className="min-w-0 flex-1 truncate text-[16px] font-extrabold text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-anthracite text-ash transition-colors hover:text-ink"
          >
            <MIcon name="x" size={15} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">{children}</div>
        {footer && <div className="border-t border-line px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
}

function QuotaBand({ park }: { park: DemoPark }) {
  if (park.capacityMembership <= 0) return null;
  const left = park.capacityMembership - park.membershipUsed;
  const tone: Tone = left <= 0 ? 'danger' : left <= 20 ? 'warning' : 'success';
  const text =
    left <= 0
      ? 'Abonelik Kotası Dolu'
      : left <= 20
        ? `Dolmaya Yakın! Son ${formatInt(left)} boş kota`
        : `${formatInt(left)} boş kota mevcut`;
  const bg: Record<Tone, string> = {
    neutral: 'bg-anthracite text-ash', info: 'bg-tint-blue text-electric-deep',
    success: 'bg-tint-green text-neon-deep', warning: 'bg-tint-amber text-amber',
    danger: 'bg-tint-alert text-alert', accent: 'bg-anthracite text-plasma',
  };
  return (
    <div className={cx('flex items-center gap-2 rounded-[14px] px-3 py-2 text-[13px] font-bold', bg[tone])}>
      <StatusDot tone={tone} />
      {text}
    </div>
  );
}

function PricingAccordion({ world, park }: { world: DemoWorld; park: DemoPark }) {
  const rows = useMemo(() => world.pricings.filter((p) => p.parkId === park.id), [world.pricings, park.id]);
  const groups = useMemo(() => {
    const map = new Map<number, typeof rows>();
    rows.forEach((r) => {
      const arr = map.get(r.vehicleClassId) ?? [];
      arr.push(r);
      map.set(r.vehicleClassId, arr);
    });
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [rows]);
  const [open, setOpen] = useState<number | null>(groups[0]?.[0] ?? null);

  if (park.usageTypeId === 4) {
    return (
      <div className="rounded-[16px] bg-tint-green px-3.5 py-3 text-[13px] font-semibold text-neon-deep">
        Site otoparkı — geçişler ücretsizdir, tarife uygulanmaz.
      </div>
    );
  }
  if (groups.length === 0) {
    return <p className="text-[13px] text-slatey">Henüz fiyatlandırma tanımlanmamış.</p>;
  }

  return (
    <div className="space-y-2">
      {groups.map(([classId, list]) => {
        const on = open === classId;
        return (
          <div key={classId} className="overflow-hidden rounded-[16px] border border-line">
            <button
              type="button"
              onClick={() => setOpen(on ? null : classId)}
              aria-expanded={on}
              className="flex w-full items-center gap-2 bg-anthracite px-3.5 py-2.5 text-left"
            >
              <MIcon name="car" size={16} className="text-electric-deep" />
              <span className="flex-1 text-[14px] font-bold text-ink">{vehicleClass(classId).label}</span>
              <span className="mono text-[11px] text-slatey">{list.length} kademe</span>
              <MIcon name={on ? 'chevron-down' : 'chevron-right'} size={15} className="text-slatey" />
            </button>
            {on && (
              <ul className="divide-y divide-line bg-carbon">
                {list.map((r) => (
                  <li key={r.id} className="flex items-center gap-2 px-3.5 py-2">
                    <span className="min-w-0 flex-1 truncate text-[13px] text-ash">{r.name}</span>
                    <span className="mono shrink-0 text-[14px] font-extrabold text-ink">
                      {formatTL(money2(r.amount * (1 + r.taxPercent / 100)))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
      <p className="text-[11px] text-slatey">Tutarlar KDV dâhildir. Tarife dönemi giriş saatine göre uygulanır.</p>
    </div>
  );
}

function CardVisual({
  card, onDefault, onDelete,
}: { card: SavedCard; onDefault?: () => void; onDelete?: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-ink p-4 text-carbon">
      <span aria-hidden className="absolute -top-10 -right-8 h-32 w-32 rounded-full bg-carbon/10" />
      <span aria-hidden className="absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-carbon/10" />
      <div className="relative flex items-start">
        <MIcon name="chipIcon" size={26} className="text-carbon/80" />
        <span className="ml-auto flex items-center gap-2">
          {card.isDefault ? (
            <span className="rounded-full bg-carbon/20 px-2 py-0.5 text-[10px] font-black tracking-[0.1em]">VARSAYILAN</span>
          ) : (
            <span className="text-[12px] font-bold opacity-80">{card.brand}</span>
          )}
          {onDelete && (
            <button type="button" onClick={onDelete} aria-label={`${card.brand} kartını sil`} className="opacity-80 hover:opacity-100">
              <MIcon name="trash" size={16} />
            </button>
          )}
        </span>
      </div>
      <p className="mono relative mt-5 text-[18px] font-bold tracking-[0.14em]">•••• •••• •••• {card.last3}</p>
      <div className="relative mt-4 flex items-end gap-4">
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-bold tracking-[0.14em] opacity-70">KART SAHİBİ</span>
          <span className="block truncate text-[12px] font-bold">{card.holderName}</span>
        </span>
        <span>
          <span className="block text-[9px] font-bold tracking-[0.14em] opacity-70">SKT</span>
          <span className="mono block text-[12px] font-bold">
            {String(card.expireMonth).padStart(2, '0')}/{String(card.expireYear).padStart(2, '0')}
          </span>
        </span>
        {onDefault && !card.isDefault && !card.isExpired && (
          <button
            type="button"
            onClick={onDefault}
            className="rounded-full bg-carbon/20 px-2.5 py-1 text-[11px] font-bold hover:bg-carbon/30"
          >
            Varsayılan Yap
          </button>
        )}
      </div>
      {card.isExpired && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink/70">
          <span className="rounded-full bg-tint-alert px-3 py-1 text-[12px] font-black text-alert">Süresi Doldu</span>
        </div>
      )}
    </div>
  );
}

function useNav() {
  const dispatch = usePanelDispatch();
  return useMemo(
    () => ({
      push: (route: MobileRoute) => dispatch({ type: 'MOBILE_NAV', op: 'push', route }),
      pop: () => dispatch({ type: 'MOBILE_NAV', op: 'pop' }),
      replace: (route: MobileRoute) => dispatch({ type: 'MOBILE_NAV', op: 'replace', route }),
      reset: (route?: MobileRoute) => dispatch({ type: 'MOBILE_NAV', op: 'reset', route }),
      tab: (t: MobileTab) => dispatch({ type: 'MOBILE_SET_TAB', tab: t }),
      sheet: (kind: string | null, params?: Record<string, string>) =>
        dispatch({ type: 'MOBILE_SHEET', sheet: kind ? { kind, params } : null }),
      form: (key: string, value: string) => dispatch({ type: 'MOBILE_SET_FORM', key, value }),
      clearForms: (keys?: string[]) => dispatch({ type: 'MOBILE_CLEAR_FORMS', keys }),
      notice: (text: string, tone: Tone = 'info') => dispatch({ type: 'MOBILE_NOTICE', text, tone }),
    }),
    [dispatch]
  );
}

type Nav = ReturnType<typeof useNav>;

interface Ctx {
  world: DemoWorld;
  epochMs: number;
  nowMin: number;
  forms: Record<string, string>;
  nav: Nav;

  panelParkId: number;
}

const screenPad = 'space-y-3 px-3.5 py-3.5';

function TapHint({ className }: { className?: string }) {
  return (
    <span className={cx('phone-tap-hint pointer-events-none absolute z-20', className)} aria-hidden>
      <span className="phone-tap-ring" />
      <span className="phone-tap-label">Dokunun</span>
      <svg className="phone-tap-hand" viewBox="0 0 32 32" width="40" height="40" fill="currentColor">
        <path d="M14.2 3.2c-.9 0-1.6.7-1.6 1.6v10.2l-2.1-1.5a1.8 1.8 0 0 0-2.5.4l-.3.4a1.8 1.8 0 0 0 .4 2.5l5.6 4.1c.5.4 1.1.6 1.7.6h5.2a3.2 3.2 0 0 0 3.2-3.1V12a1.8 1.8 0 0 0-1.8-1.8h-.2V8.2c0-.9-.7-1.6-1.6-1.6-.3 0-.6.1-.9.2V4.8c0-.9-.7-1.6-1.6-1.6-.3 0-.6.1-.9.2V4.8c0-.9-.7-1.6-1.6-1.6z" />
      </svg>
    </span>
  );
}

type HintPhase = 'park' | 'tabs' | 'done';

function hintPhase(forms: Record<string, string>): HintPhase {
  const v = forms['hint'];
  if (v === 'tabs' || v === 'done') return v;
  return 'park';
}

function LoginScreen({ c }: { c: Ctx }) {
  const dispatch = usePanelDispatch();
  const [email, setEmail] = useState(c.world.mobileUser.email);
  const [pass, setPass] = useState('demo1234');
  const [busy, setBusy] = useState(false);

  const submit = () => {
    if (!email.trim() || !pass.trim()) {
      c.nav.notice('E-posta ve şifre alanları zorunludur.', 'danger');
      return;
    }
    setBusy(true);
    window.setTimeout(() => dispatch({ type: 'MOBILE_LOGIN' }), 320);
  };

  return (

    <div className="flex min-h-full flex-col justify-center bg-carbon px-5 py-6">
      {}
      <div className="mx-auto flex h-[176px] w-[176px] items-center justify-center">
        <img
          src="/img/parkbiz-logo.png"
          alt="ParkBiz"
          width={176}
          height={176}
          className="h-full w-full object-contain"
        />
      </div>
      <p className="mt-2 text-center text-[13px] text-slatey">Otoparklar, borç ödeme ve abonelik tek uygulamada.</p>

      <div className="mt-6 space-y-3">
        <div>
          <MLabel>E-posta</MLabel>
          <MInput value={email} onChange={setEmail} type="email" ariaLabel="E-posta" placeholder="ornek@demo.test" />
        </div>
        <div>
          <MLabel>Şifre</MLabel>
          <MInput value={pass} onChange={setPass} type="password" ariaLabel="Şifre" placeholder="••••••••" onEnter={submit} />
        </div>
        <MButton onClick={submit} disabled={busy || !email.trim() || !pass.trim()} icon={busy ? 'refresh' : 'lock'}>
          {busy ? 'Giriş yapılıyor…' : 'Giriş Yap'}
        </MButton>
      </div>

      <div className="mt-5 rounded-[16px] bg-anthracite px-3.5 py-3">
        <p className="text-[12px] leading-relaxed text-ash">
          <b className="text-ink">Demo hesap hazır.</b> Alanlar örnek değerlerle doludur; gerçek kimlik bilgisi
          girmeyin. Gerçek uygulamada ayrıca Android&apos;de Google, iOS&apos;ta Apple ile giriş vardır —
          bu demo ikizinde sağlayıcıya bağlanılmadığı için gösterilmez. Kayıt ekranı gerçek uygulamada da yoktur.
        </p>
      </div>
    </div>
  );
}

function ParkMap({
  parks, selected, onSelect,
}: { parks: DemoPark[]; selected: number | null; onSelect: (id: number) => void }) {
  const pos = useMemo(() => {
    const lats = parks.map((p) => p.latitude);
    const lngs = parks.map((p) => p.longitude);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const spanLat = maxLat - minLat || 1;
    const spanLng = maxLng - minLng || 1;
    return parks.map((p) => ({
      id: p.id,
      left: r2(14 + ((p.longitude - minLng) / spanLng) * 68),
      top: r2(18 + (1 - (p.latitude - minLat) / spanLat) * 56),
    }));
  }, [parks]);

  return (
    <div className="relative h-[360px] overflow-hidden rounded-[22px] border border-line bg-anthracite">
      {}
      <svg viewBox="0 0 360 360" className="absolute inset-0 h-full w-full text-steel" aria-hidden preserveAspectRatio="none">
        <g stroke="currentColor" strokeWidth="10" opacity="0.55">
          <path d="M0 70h360M0 180h360M0 292h360M62 0v360M170 0v360M276 0v360" />
        </g>
        <g stroke="currentColor" strokeWidth="2" opacity="0.5">
          <path d="M0 124h360M0 236h360M116 0v360M224 0v360M320 0v360" />
        </g>
        <g fill="currentColor" opacity="0.18">
          <rect x="14" y="14" width="38" height="44" rx="4" />
          <rect x="188" y="88" width="76" height="30" rx="4" />
          <rect x="76" y="196" width="32" height="30" rx="4" />
          <rect x="286" y="248" width="60" height="34" rx="4" />
        </g>
      </svg>

      {pos.map((m) => {
        const park = parks.find((p) => p.id === m.id)!;
        const on = selected === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            aria-label={`${park.name} işaretçisi`}
            style={{ left: `${m.left}%`, top: `${m.top}%` }}
            className="absolute -translate-x-1/2 -translate-y-full"
          >
            <span
              className={cx(
                'flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-carbon shadow-md',
                on ? 'bg-electric-deep text-carbon' : 'bg-electric text-carbon'
              )}
            >
              <MIcon name="car" size={15} />
            </span>
            <span
              aria-hidden
              className={cx(
                'mx-auto block h-0 w-0 border-x-[6px] border-t-[7px] border-x-transparent',
                on ? 'border-t-electric-deep' : 'border-t-electric'
              )}
            />
          </button>
        );
      })}

      {}
      <span aria-hidden className="absolute bottom-[12%] left-[46%] flex h-4 w-4 items-center justify-center">
        <span className="h-3 w-3 rounded-full border-[2px] border-carbon bg-neon shadow" />
      </span>
    </div>
  );
}

function ParkingsScreen({ c }: { c: Ctx }) {
  const [q, setQ] = useState('');
  const [marker, setMarker] = useState<number | null>(null);
  const mode = c.forms['parkings.mode'] === 'map' ? 'map' : 'list';
  const hint = hintPhase(c.forms);

  const parks = useMemo(() => {
    const term = upperTR(q).trim();
    const rows = term
      ? c.world.parks.filter((p) => upperTR(`${p.name} ${p.address}`).includes(term))
      : c.world.parks;
    return [...rows].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [c.world.parks, q]);

  const nearestId = useMemo(
    () => c.world.parks.reduce((best, p) => (p.distanceKm < best.distanceKm ? p : best), c.world.parks[0]).id,
    [c.world.parks]
  );
  const markerPark = marker === null ? null : c.world.parks.find((p) => p.id === marker) ?? null;

  const openPark = (parkId: number) => {
    if (hint === 'park') c.nav.form('hint', 'tabs');
    c.nav.sheet('parking', { parkId: String(parkId) });
  };

  return (
    <div className={cx(screenPad, 'relative')}>
      <div className="relative">
        <MIcon name="search" size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slatey" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Otopark ara…"
          aria-label="Otopark ara"
          className="h-12 w-full rounded-[16px] border border-steel bg-carbon pr-10 pl-9 text-[14px] font-semibold text-ink outline-none focus:border-electric focus:ring-2 focus:ring-electric/20"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            aria-label="Aramayı temizle"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slatey hover:text-ink"
          >
            <MIcon name="x" size={16} />
          </button>
        )}
      </div>

      {mode === 'map' ? (
        <>
          {parks.length === 0 && (
            <div className="rounded-[16px] bg-tint-amber px-3.5 py-2.5 text-[12px] font-semibold text-amber">
              &laquo;{q}&raquo; aramasına uyan tesis yok — harita boş görünüyor.
            </div>
          )}
          <ParkMap parks={parks} selected={marker} onSelect={(id) => setMarker(id === marker ? null : id)} />
          {markerPark && (
            <MCard className="border-electric/50">
              <p className="text-[15px] font-black text-ink">{markerPark.name}</p>
              <p className="mt-0.5 text-[12px] text-slatey">{markerPark.address}</p>
              <div className="mt-2.5">
                <MButton small variant="soft" icon="eye" onClick={() => openPark(markerPark.id)}>
                  Otopark Detayı
                </MButton>
              </div>
            </MCard>
          )}
          <p className="text-[11px] text-slatey">
            Harita şematiktir: işaretçiler tesislerin gerçek koordinat farkına göre yerleştirilir, harita servisi çağrılmaz.
          </p>
        </>
      ) : parks.length === 0 ? (
        <MEmpty title="Otopark bulunamadı" desc={`"${q}" aramasına uyan tesis yok.`} action={<MButton small variant="outline" onClick={() => setQ('')}>Aramayı temizle</MButton>} />
      ) : (
        parks.map((p, i) => {
          const full = p.occupiedNow >= p.capacityTotal;
          const showTap = hint === 'park' && i === 0;
          return (
            <div key={p.id} className="relative">
              <MCard onClick={() => openPark(p.id)} ariaLabel={`${p.name} detayını aç`}>
                <div className="flex items-start gap-2">
                  <p className="min-w-0 flex-1 text-[17px] leading-tight font-black text-ink">{p.name}</p>
                  {p.id === nearestId && (
                    <span className="rounded-full bg-tint-blue px-2 py-0.5 text-[10px] font-black tracking-[0.08em] text-electric-deep">
                      EN YAKIN
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <MChip tone={full ? 'danger' : 'success'}>
                    <StatusDot tone={full ? 'danger' : 'success'} />
                    {full ? 'Kapalı' : 'Müsait'}
                  </MChip>
                  <MChip tone="neutral">
                    <MIcon name="navigate" size={12} />
                    {p.distanceKm.toFixed(1).replace('.', ',')} km
                  </MChip>
                  <MChip tone="info">{formatInt(p.capacityTotal - p.occupiedNow)} boş yer</MChip>
                </div>
                <div className="mt-2.5 flex items-start gap-2 border-t border-line pt-2.5">
                  <MIcon name="map" size={15} className="mt-0.5 text-slatey" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold tracking-[0.08em] text-slatey uppercase">ADRES</span>
                    <span className="block text-[12px] leading-relaxed text-ash">{p.address}</span>
                  </span>
                </div>
              </MCard>
              {showTap && <TapHint className="right-4 top-8" />}
            </div>
          );
        })
      )}

      {}
      <div className="sticky bottom-0 z-10 flex items-center pt-1">
        <span className="flex-1" />
        <span className="inline-flex rounded-full border border-line bg-carbon p-1 shadow-lg">
          {(['list', 'map'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => c.nav.form('parkings.mode', m)}
              aria-pressed={mode === m}
              className={cx(
                'rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors',
                mode === m ? 'bg-electric text-carbon' : 'text-ash hover:text-ink'
              )}
            >
              {m === 'list' ? 'Liste' : 'Harita'}
            </button>
          ))}
        </span>
        <span className="flex flex-1 justify-end">
          <button
            type="button"
            onClick={() => c.nav.push({ name: 'new-support' })}
            aria-label="Destek talebi oluştur"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-electric text-carbon shadow-lg hover:bg-electric-deep"
          >
            <MIcon name="chat" size={19} />
          </button>
        </span>
      </div>
    </div>
  );
}

function ParkingDetailScreen({ c, parkId }: { c: Ctx; parkId: number }) {
  const park = c.world.parks.find((p) => p.id === parkId);
  if (!park) return <div className={screenPad}><MEmpty title="Otopark bulunamadı" /></div>;
  return (
    <div className={screenPad}>
      <ParkingBody c={c} park={park} />
    </div>
  );
}

function ParkingBody({ c, park }: { c: Ctx; park: DemoPark }) {
  const dispatch = usePanelDispatch();
  const packages = c.world.packages.filter((p) => p.parkId === park.id && p.active);
  const sellsMembership = park.capacityMembership > 0;
  const purchasable = packages.filter((p) => p.isPurchasable);
  const quotaFull = park.membershipUsed >= park.capacityMembership && park.capacityMembership > 0;

  const copyAddress = () => {
    const write = async () => {
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) await navigator.clipboard.writeText(park.address);
      } catch {  }
      c.nav.notice('Adres panoya kopyalandı — harita uygulamanıza yapıştırabilirsiniz.', 'success');
    };
    void write();
  };

  return (
    <>
      <div>
        <p className="text-[20px] leading-tight font-black text-ink">{park.name}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-slatey">{park.address}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <MChip tone="success"><StatusDot tone="success" />Sistem Online</MChip>
        <MChip tone="neutral">{formatInt(park.capacityTotal)} kapasite</MChip>
        <MChip tone="info">{formatInt(park.capacityTotal - park.occupiedNow)} boş</MChip>
      </div>

      <MButton variant="soft" icon="navigate" onClick={copyAddress}>Yol Tarifi Al</MButton>

      <div>
        <MLabel>Fiyat Tarifesi</MLabel>
        <PricingAccordion world={c.world} park={park} />
      </div>

      <div>
        <MLabel>Abonelik Paketleri</MLabel>
        {!sellsMembership ? (
          <p className="text-[13px] text-slatey">Bu tesiste abonelik satışı yapılmıyor; geçişler anlık ödemeyle tamamlanır.</p>
        ) : (
          <div className="space-y-2">
            <QuotaBand park={park} />
            {packages.map((pkg) => (
              <div key={pkg.id} className="rounded-[16px] border border-line bg-carbon p-3">
                <div className="flex items-start gap-2">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-black text-ink">{pkg.name}</span>
                    <span className="block text-[12px] text-slatey">
                      {pkg.durationDays >= 90 ? `${Math.round(pkg.durationDays / 30)} Ay Abonelik` : `${pkg.durationDays} Günlük Abonelik`}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="mono block text-[18px] font-black text-electric-deep">{formatTL(pkg.cost)}</span>
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <MChip tone="neutral">{vehicleClass(pkg.vehicleClassId).label}</MChip>
                  <MChip tone="neutral">{pkg.audience}</MChip>
                  {pkg.requiresDocument && <MChip tone="warning">Belge gerekir</MChip>}
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-slatey">{pkg.description}</p>
              </div>
            ))}

            {purchasable.length === 0 ? (
              <p className="rounded-[14px] bg-tint-amber px-3 py-2.5 text-[12px] leading-relaxed font-semibold text-amber">
                Bu tesisin abonelikleri yönetim onayıyla verilir; uygulamadan satın alınamaz.
              </p>
            ) : quotaFull ? (
              <MButton
                variant="outline"
                icon="info"
                onClick={() => c.nav.notice('Kota dolu. Web sitesinden başvuru oluşturabilirsiniz.', 'warning')}
              >
                Web&apos;den Başvur
              </MButton>
            ) : (
              <MButton
                icon="plus"
                onClick={() => {
                  c.nav.clearForms(['mem.step', 'mem.vehicleId', 'mem.packageId', 'mem.cardId', 'mem.newId', 'mem.err']);
                  dispatch({ type: 'MOBILE_SHEET', sheet: null });
                  c.nav.push({ name: 'buy-membership', params: { parkId: String(park.id) } });
                }}
              >
                Abonelik Al
              </MButton>
            )}
          </div>
        )}
      </div>
    </>
  );
}

const DEBT_STEPS = ['Plaka', 'Borçlar', 'Ödeme'];

const openDebtCardSheet = (total: number, sessionId: string): Record<string, string> => ({
  target: 'pay.cardId',
  amount: String(total),
  title: 'Ödeme Kartı Seçin',
  amountLabel: `${formatInt(total)} TRY`,
  confirm: 'Kartı Seç ve Devam Et',
  session: sessionId,
});

function DebtsScreen({ c, initialPlate }: { c: Ctx; initialPlate: string }) {
  const [plate, setPlate] = useState(normalizePlate(initialPlate));

  const debts = useMemo(() => selectDebts(c.world, ALL_PARKS_ID), [c.world]);
  const debtPlates = useMemo(() => {
    const counts = new Map<string, number>();
    debts.forEach((d) => counts.set(d.plateTxt, (counts.get(d.plateTxt) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [debts]);

  const go = () => {
    if (!plate.trim()) {
      c.nav.notice('Lütfen bir plaka giriniz.', 'warning');
      return;
    }
    c.nav.push({ name: 'debt-result', params: { plate } });
  };

  return (
    <div className={cx(screenPad, 'pt-3')}>
      <MStepper steps={DEBT_STEPS} current={1} ariaLabel="Borç ödeme adımları" />
      <div className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-full border border-line bg-carbon text-electric shadow-sm">
        <MIcon name="cardIcon" size={38} />
      </div>
      <p className="text-center text-[26px] leading-none font-black tracking-[-0.02em] text-ink">Hızlı Borç Ödeme</p>
      <p className="text-center text-[13px] leading-relaxed text-slatey">
        Aracınızın plakasını girerek bekleyen otopark borçlarınızı anında görüntüleyin ve güvenle ödeyin.
      </p>

      <div className="flex h-[72px] overflow-hidden rounded-[18px] border border-steel bg-anthracite">
        <span aria-hidden className="w-[6px] shrink-0 bg-electric" />
        <input
          value={prettyPlate(plate)}
          onChange={(e) => setPlate(normalizePlate(e.target.value))}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } }}
          placeholder="34ABC123"
          aria-label="Plaka"
          inputMode="text"
          className="mono h-full w-full bg-transparent px-4 text-[24px] font-bold tracking-[0.06em] text-ink uppercase outline-none placeholder:text-slatey/50"
        />
      </div>

      <MButton onClick={go} icon="search" disabled={!plate.trim()}>Borç Sorgula</MButton>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slatey">
        <MIcon name="shield" size={13} />
        Ödemeleriniz SSL sertifikası ile korunmaktadır.
      </div>

      <div className="rounded-[18px] border border-line bg-carbon p-3">
        <MLabel>Araçlarım</MLabel>
        <div className="flex flex-wrap gap-1.5">
          {c.world.vehicles.map((v) => {
            const n = debts.filter((d) => plateKey(d.plateTxt) === plateKey(v.plateTxt)).length;
            return (
              <MChip key={v.id} active={plateKey(v.plateTxt) === plateKey(plate)} onClick={() => setPlate(normalizePlate(v.plateTxt))}>
                <span className="mono">{prettyPlate(v.plateTxt)}</span>
                {n > 0 && <span className="rounded-full bg-tint-alert px-1.5 text-[10px] font-black text-alert">{n}</span>}
              </MChip>
            );
          })}
        </div>
        {debtPlates.length > 0 && (
          <>
            <div className="mt-3" />
            <MLabel>Borcu olan örnek plakalar</MLabel>
            <div className="flex flex-wrap gap-1.5">
              {debtPlates.map(([p, n]) => (
                <MChip key={p} active={plateKey(p) === plateKey(plate)} onClick={() => setPlate(normalizePlate(p))}>
                  <span className="mono">{prettyPlate(p)}</span>
                  <span className="rounded-full bg-tint-alert px-1.5 text-[10px] font-black text-alert">{n}</span>
                </MChip>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DebtResultScreen({ c, plate }: { c: Ctx; plate: string }) {
  const rows = useMemo(
    () => selectDebts(c.world, ALL_PARKS_ID).filter((s) => plateKey(s.plateTxt) === plateKey(plate)),
    [c.world, plate]
  );
  const total = rows.reduce((a, s) => a + s.amount, 0);

  if (rows.length === 0) {
    return (
      <div className={cx(screenPad, 'pt-3')}>
        <MStepper steps={DEBT_STEPS} current={2} onStep={() => c.nav.pop()} ariaLabel="Borç ödeme adımları" />
        <MEmpty
          icon="check"
          title="Borç Bulunmuyor"
          desc={`${prettyPlate(plate)} plakasına ait aktif bir borç kaydı bulunamadı.`}
          action={<MButton small variant="outline" onClick={() => c.nav.pop()}>Yeni Sorgulama</MButton>}
        />
      </div>
    );
  }

  return (
    <div className={screenPad}>
      <MStepper steps={DEBT_STEPS} current={2} onStep={() => c.nav.pop()} ariaLabel="Borç ödeme adımları" />
      <div className="flex items-stretch gap-3 rounded-[20px] bg-ink px-4 py-3.5 text-carbon">
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-black tracking-[0.14em] opacity-70">ARAÇ PLAKASI</span>
          <span className="mono block truncate text-[20px] font-black">{prettyPlate(plate)}</span>
        </span>
        <span aria-hidden className="w-px bg-carbon/25" />
        <span className="shrink-0 text-right">
          <span className="block text-[9px] font-black tracking-[0.14em] opacity-70">TOPLAM BORCUNUZ</span>
          <span className="mono block text-[22px] font-black">{formatTL(total)}</span>
        </span>
      </div>

      {rows.length > 1 && (
        <MButton
          variant="soft"
          icon="wallet"
          onClick={() => c.nav.push({ name: 'debt-pay', params: { ids: rows.map((r) => r.id).join(','), plate } })}
        >
          Tümünü Öde · {formatTL(total)}
        </MButton>
      )}

      {rows.map((s) => (
        <MCard
          key={s.id}
          onClick={() => c.nav.push({ name: 'debt-pay', params: { ids: s.id, plate } })}
          ariaLabel={`${s.sessionUid} borcunu öde`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-tint-blue text-electric-deep">
              <MIcon name="car" size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-black tracking-[0.08em] text-electric-deep uppercase">
                {c.world.parks.find((p) => p.id === s.parkId)?.name ?? 'Otopark'}
              </span>
              <span className="block text-[15px] font-extrabold text-ink">{formatDateTime(c.epochMs, s.entryMin)}</span>
              <span className="mt-0.5 flex items-center gap-1 text-[12px] text-slatey">
                <MIcon name="clock" size={12} />
                {formatDuration(sessionDuration(s, c.nowMin))}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <span className="mono text-[17px] font-black text-alert">{formatTL(s.amount)}</span>
              <MIcon name="chevron-right" size={16} className="text-slatey" />
            </span>
          </div>
        </MCard>
      ))}
    </div>
  );
}

function DebtPayScreen({ c, ids, plate }: { c: Ctx; ids: string[]; plate: string }) {
  const dispatch = usePanelDispatch();
  const helpers = usePanelHelpers();
  const [phase, setPhase] = useState<'form' | 'busy' | 'ok' | 'fail'>('form');
  const [snap, setSnap] = useState<{ amount: number; at: number } | null>(null);

  const setForm = c.nav.form;
  useEffect(() => { setForm('pay.phase', phase); }, [phase, setForm]);
  useEffect(() => () => setForm('pay.phase', ''), [setForm]);

  const rows = useMemo(() => c.world.sessions.filter((s) => ids.includes(s.id)), [c.world.sessions, ids]);
  const total = rows.reduce((a, s) => a + s.amount, 0);
  const cardId = c.forms['pay.cardId'] ?? '';

  const card = resolveCard(c.world.cards, cardId);
  const first = rows[0];

  const pay = () => {
    if (!card) return;
    setPhase('busy');
    setSnap({ amount: total, at: c.nowMin });
    helpers.simulate3DS(() => {

      if (card.isExpired) {
        setPhase('fail');
        return;
      }
      dispatch({ type: 'MOBILE_PAY_DEBT', sessionIds: ids, cardId: card.id });
      setPhase('ok');
    });
  };

  if (phase === 'ok') {
    return (
      <div className={cx(screenPad, 'pt-8')}>
        <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-full bg-tint-green">
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-neon text-carbon">
            <MIcon name="check" size={44} />
          </span>
        </div>
        <p className="text-center text-[26px] leading-none font-black text-ink">İşlem Tamamlandı</p>
        <p className="text-center text-[13px] text-slatey">Borç ödemeniz başarıyla tamamlandı.</p>
        <MCard>
          <MLabel>İşlem Özeti</MLabel>
          <ReceiptRow k="Plaka" v={<span className="mono">{prettyPlate(plate)}</span>} />
          <ReceiptRow k="Ödeme Tarihi" v={formatDateTime(c.epochMs, snap?.at ?? c.nowMin)} />
          <ReceiptRow k="Kart" v={`${card?.brand ?? 'Kart'} •••• ${card?.last3 ?? ''}`} />
          <div className="mt-2 flex items-center gap-2 border-t border-line pt-2.5">
            <span className="flex-1 text-[12px] font-bold tracking-[0.08em] text-slatey uppercase">ÖDENEN TUTAR</span>
            <span className="mono text-[20px] font-black text-neon-deep">{formatTL(snap?.amount ?? total)}</span>
          </div>
        </MCard>
        <div className="rounded-[16px] bg-tint-blue px-3.5 py-3 text-[12px] leading-relaxed font-semibold text-electric-deep">
          Bu ödeme panele düştü: Tahsilat · Ödemeler listesinde kanal &laquo;Mobil&raquo; olarak görünür, Borç
          Listesi&apos;nden satır kalktı ve bildirim ziline &laquo;Mobil ödeme alındı&raquo; bildirimi eklendi.
        </div>
        <MButton onClick={() => { c.nav.tab('parkings'); }}>Ana Sayfaya Dön</MButton>
      </div>
    );
  }

  if (phase === 'fail') {
    return (
      <div className={cx(screenPad, 'pt-8')}>
        <div className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-full bg-alert text-carbon">
          <MIcon name="x" size={44} />
        </div>
        <p className="text-center text-[26px] leading-none font-black text-ink">İşlem Başarısız</p>
        <p className="text-center text-[13px] text-slatey">Ödeme şu an gerçekleştirilemedi.</p>
        <MCard>
          <MLabel>Ne yapabilirsiniz?</MLabel>
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-ash">
            <li>· Kartınızın son kullanma tarihi geçmiş olabilir — başka bir kart seçin.</li>
            <li>· Kartınız internet alışverişine kapalı olabilir.</li>
            <li>· Kart limitiniz veya bakiyeniz yeterli olmayabilir.</li>
          </ul>
          <p className="mt-2 text-[12px] text-slatey">Sorun sürerse destek birimimize ulaşın.</p>
        </MCard>
        <MButton onClick={() => setPhase('form')} icon="refresh">Tekrar Dene</MButton>
        <MButton variant="outline" onClick={() => c.nav.pop()}>Diğer Borçlara Dön</MButton>
      </div>
    );
  }

  if (!first) {
    return <div className={screenPad}><MEmpty icon="check" title="Bu borç kaydı kapandı" desc="Kayıt ödenmiş görünüyor." action={<MButton small variant="outline" onClick={() => c.nav.pop()}>Geri Dön</MButton>} /></div>;
  }

  return (
    <div className={screenPad}>
      <MStepper
        steps={DEBT_STEPS}
        current={3}

        onStep={(s) => { c.nav.pop(); if (s === 1) c.nav.pop(); }}
        ariaLabel="Borç ödeme adımları"
      />
      <div className="rounded-[28px] border border-line bg-carbon p-4">
        <div className="flex items-center gap-2">
          <span className="flex-1 text-[16px] font-black text-ink">Ödeme Detayları</span>
          <span className="mono text-[11px] text-slatey">{first.sessionUid}</span>
        </div>
        <div className="mt-3 space-y-0.5">
          <ReceiptRow k="Plaka" icon="car" v={<span className="mono font-bold">{prettyPlate(plate)}</span>} />
          <ReceiptRow k="Otopark" icon="map" v={c.world.parks.find((p) => p.id === first.parkId)?.name ?? '—'} />
          <ReceiptRow k="Giriş Tarihi" icon="arrow-right" v={formatDateTime(c.epochMs, first.entryMin)} />
          <ReceiptRow k="Çıkış Tarihi" icon="arrow-left" v={first.exitMin === null ? 'Devam ediyor' : formatDateTime(c.epochMs, first.exitMin)} />
          {rows.length > 1 && <ReceiptRow k="Kayıt Sayısı" icon="list" v={`${rows.length} oturum birleştirildi`} />}
        </div>
        <span aria-hidden className="my-3 block border-t border-dashed border-steel" />
        <div className="flex items-center gap-2 rounded-[16px] bg-anthracite px-3 py-2.5">
          <span className="flex-1 text-[11px] font-black tracking-[0.1em] text-slatey uppercase">ÖDENECEK TUTAR</span>
          <span className="mono text-[22px] font-black text-ink">{formatTL(total)}</span>
        </div>
      </div>

      <div>
        <MLabel>Ödeme Yöntemi</MLabel>
        {card ? (
          <button
            type="button"
            onClick={() => c.nav.sheet('card', openDebtCardSheet(total, first.id))}
            className="flex w-full items-center gap-3 rounded-[16px] border-2 border-electric bg-carbon px-3.5 py-3 text-left"
          >
            <MIcon name="cardIcon" size={20} className="text-electric-deep" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-bold text-ink">{card.holderName}</span>
              <span className="mono block text-[12px] text-slatey">•••• •••• •••• {card.last3}</span>
            </span>
            <span className="text-[12px] font-bold text-electric-deep">Değiştir</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => c.nav.sheet('card', openDebtCardSheet(total, first.id))}
            className="flex w-full items-center justify-center gap-2 rounded-[16px] border-2 border-dashed border-steel px-3.5 py-4 text-[14px] font-bold text-slatey transition-colors hover:border-electric hover:text-electric-deep"
          >
            <MIcon name="plus" size={16} />
            Kart Seçimi Yapınız
          </button>
        )}
        {card?.isExpired && (
          <p className="mt-1.5 text-[12px] font-semibold text-alert">
            Seçili kartın süresi dolmuş — bu kartla ödeme reddedilecektir.
          </p>
        )}
      </div>

      <MButton onClick={pay} disabled={!card || phase === 'busy'} icon={phase === 'busy' ? 'refresh' : 'lock'}>
        {phase === 'busy' ? 'Ödeme Yapılıyor...' : 'Güvenli Ödeme Yap'}
      </MButton>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slatey">
        <MIcon name="lock" size={13} />
        256-bit SSL şifreleme ile güvendesiniz
      </div>
    </div>
  );
}

function ReceiptRow({ k, v, icon }: { k: string; v: ReactNode; icon?: MIconKey }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      {icon && <MIcon name={icon} size={14} className="text-slatey" />}
      <span className="text-[12px] font-semibold text-slatey">{k}</span>
      <span className="ml-auto min-w-0 truncate text-right text-[13px] font-bold text-ink">{v}</span>
    </div>
  );
}

const SUB_STEPS = ['Otopark', 'Paket & Araç', 'Ödeme ve Onay'];

function memberTone(m: Membership): Tone {
  if (m.statusId === 'active') return 'success';
  if (m.statusId === 'pending') return 'warning';
  if (m.statusId === 'terminated' || m.statusId === 'doc_rejected') return 'danger';
  return 'neutral';
}

function cornerLabel(m: Membership, nowMin: number): string {

  if (m.statusId === 'pending') return 'ÖDEME BEKLİYOR - TAMAMLA';
  if (m.statusId === 'terminated') return 'İPTAL EDİLDİ';
  if (m.statusId === 'expired') return 'SÜRESİ BİTTİ';
  if (m.statusId === 'doc_pending') return 'BELGE ONAYI';
  if (m.statusId === 'doc_rejected') return 'BELGE REDDEDİLDİ';
  const left = Math.max(0, Math.ceil((m.availableUntilMin - nowMin) / 1440));
  return `${formatInt(left)} GÜN KALDI`;
}

function statusTagLabel(m: Membership): string {
  if (m.statusId === 'active') return 'Aktif';
  if (m.statusId === 'pending') return '⚠️ Ödeme Bekliyor';
  if (m.statusId === 'terminated') return '🚫 İptal Edildi';
  return 'Pasif';
}

function progressSuffix(m: Membership): string {
  if (m.statusId === 'pending') return ' • ÖDEME BEKLİYOR';
  if (m.statusId === 'terminated') return ' • İPTAL EDİLDİ';
  return '';
}

const STATUS_ORDER: Record<string, number> = {
  active: 0, pending: 1, doc_pending: 2, doc_rejected: 3, expired: 4, terminated: 5,
};

function useMyMemberships(c: Ctx): Membership[] {
  const myPlates = useMemo(() => new Set(c.world.vehicles.map((v) => plateKey(v.plateTxt))), [c.world.vehicles]);
  return useMemo(
    () =>
      c.world.memberships
        .filter((m) => m.fromMobile || myPlates.has(plateKey(m.plateTxt)))
        .sort((a, b) => (STATUS_ORDER[a.statusId] ?? 9) - (STATUS_ORDER[b.statusId] ?? 9) || b.subscribedAtMin - a.subscribedAtMin),
    [c.world.memberships, myPlates]
  );
}

function SubscriptionsScreen({ c }: { c: Ctx }) {
  const [q, setQ] = useState('');

  const sellers = useMemo(() => {
    const term = upperTR(q).trim();
    return c.world.parks
      .filter((p) => p.capacityMembership > 0)
      .filter((p) => (term ? upperTR(`${p.name} ${p.address}`).includes(term) : true))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [c.world.parks, q]);

  return (
    <div className={screenPad}>
      <MStepper steps={SUB_STEPS} current={1} ariaLabel="Abonelik adımları" />
      <MInput value={q} onChange={setQ} placeholder="Otopark ara…" ariaLabel="Abonelik için otopark ara" />
      {sellers.length === 0 ? (
        <MEmpty title="Sonuç yok" desc="Aramanıza uyan abonelik satan tesis bulunamadı." />
      ) : (
        sellers.map((p) => {
          const purchasable = c.world.packages.some((k) => k.parkId === p.id && k.active && k.isPurchasable);
          return (
            <MCard key={p.id}>
              <p className="text-[17px] leading-tight font-black text-ink">{p.name}</p>
              <p className="mt-0.5 text-[12px] text-slatey">{p.address}</p>
              <div className="mt-2"><QuotaBand park={p} /></div>
              <div className="mt-2.5">
                {purchasable ? (
                  <MButton
                    small
                    icon="plus"
                    onClick={() => {
                      c.nav.clearForms(['mem.step', 'mem.vehicleId', 'mem.packageId', 'mem.cardId', 'mem.newId', 'mem.err']);
                      c.nav.push({ name: 'buy-membership', params: { parkId: String(p.id) } });
                    }}
                  >
                    Abonelik Al
                  </MButton>
                ) : (
                  <p className="rounded-[14px] bg-tint-amber px-3 py-2 text-[12px] leading-relaxed font-semibold text-amber">
                    Bu tesisin abonelikleri yönetim onayıyla verilir; uygulamadan satın alınamaz.
                  </p>
                )}
              </div>
            </MCard>
          );
        })
      )}
    </div>
  );
}

function MySubscriptionsScreen({ c }: { c: Ctx }) {
  const mine = useMyMemberships(c);

  if (mine.length === 0) {
    return (
      <div className={screenPad}>
        <MEmpty
          icon="star"
          title="Henüz abonelik yok"
          desc="Yeni abonelik almak için abonelik sekmesine geçebilirsin."
          action={<MButton small onClick={() => c.nav.tab('subscriptions')}>Yeni Abonelik</MButton>}
        />
      </div>
    );
  }

  return (
    <div className={cx(screenPad, 'pt-5')}>
      {mine.map((m) => {
        const pkg = c.world.packages.find((p) => p.id === m.packageId);
        const total = Math.max(1, m.availableUntilMin - m.subscribedAtMin);
        const elapsed = Math.max(0, Math.min(total, c.nowMin - m.subscribedAtMin));
        const tone = memberTone(m);
        const pending = m.statusId === 'pending';
        const closed = m.statusId === 'terminated' || m.statusId === 'expired';
        return (
          <div key={m.id} className="relative pt-2">
            {}
            <span
              className={cx(
                'absolute top-0 left-5 z-10 inline-flex items-center gap-1 rounded-[8px] px-2 py-[5px] text-[10px] font-black text-carbon',
                pending ? 'border border-carbon bg-alert' : closed ? 'bg-slatey' : 'bg-electric'
              )}
            >
              <MIcon name={pending ? 'cardIcon' : m.statusId === 'terminated' ? 'ban' : m.statusId === 'expired' ? 'x' : 'timer'} size={11} />
              {cornerLabel(m, c.nowMin)}
            </span>
            <MCard onClick={() => c.nav.push({ name: 'subscription-detail', params: { id: m.id } })} ariaLabel={`${pkg?.name ?? 'Abonelik'} detayı`}>
              <div className="flex items-start gap-2 pt-1">
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] leading-tight font-black text-ink">{pkg?.name ?? 'Abonelik'}</span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="mono rounded-md bg-electric px-2 py-[3px] text-[11px] font-black tracking-[0.05em] text-carbon">
                      {prettyPlate(m.plateTxt)}
                    </span>
                    <span className="text-[12px] font-semibold text-slatey">
                      {c.world.parks.find((p) => p.id === m.parkId)?.name}
                    </span>
                  </span>
                </span>
                <MChip tone={tone}>{statusTagLabel(m)}</MChip>
              </div>
              <div className="mt-2.5">
                <MProgress pct={pending || closed ? 100 : (elapsed / total) * 100} tone={tone} />
                <div className={cx('mt-1 flex justify-between text-[11px] font-bold', pending ? 'text-alert' : 'text-slatey')}>
                  <span>{formatDate(c.epochMs, m.subscribedAtMin)}</span>
                  <span>{formatDate(c.epochMs, m.availableUntilMin)}{progressSuffix(m)}</span>
                </div>
              </div>
              {m.fromMobile && (
                <p className="mt-2 text-[11px] font-bold text-electric-deep">Bu abonelik bu demoda uygulamadan satın alındı.</p>
              )}
            </MCard>
          </div>
        );
      })}
    </div>
  );
}

function BuyMembershipScreen({ c, parkId }: { c: Ctx; parkId: number }) {
  const dispatch = usePanelDispatch();
  const helpers = usePanelHelpers();
  const park = c.world.parks.find((p) => p.id === parkId) ?? null;

  const rawStep = c.forms['mem.step'] ?? '';

  const step = rawStep === '3' ? 3 : rawStep === 'done' ? 4 : rawStep === 'fail' ? 5 : 2;
  const vehicleId = c.forms['mem.vehicleId'] ?? '';
  const packageId = c.forms['mem.packageId'] ?? '';
  const cardId = c.forms['mem.cardId'] ?? '';

  const [phone, setPhone] = useState('5000000000');
  const [corp, setCorp] = useState(false);
  const [vat, setVat] = useState('');
  const [vatRes, setVatRes] = useState<{ title: string; office: string; city: string } | null>(null);
  const [vatErr, setVatErr] = useState('');
  const [busy, setBusy] = useState(false);

  const vehicle = c.world.vehicles.find((v) => v.id === vehicleId) ?? null;
  const pkg = c.world.packages.find((p) => p.id === packageId) ?? null;

  const card = resolveCard(c.world.cards, cardId);
  const packages = useMemo(
    () => c.world.packages.filter((p) => p.parkId === parkId && p.active && p.isPurchasable),
    [c.world.packages, parkId]
  );
  const quotaFull = park ? park.capacityMembership > 0 && park.membershipUsed >= park.capacityMembership : false;

  const created = useMemo(
    () =>
      step === 4 && vehicle && pkg
        ? c.world.memberships.find((m) => m.fromMobile && plateKey(m.plateTxt) === plateKey(vehicle.plateTxt) && m.packageId === pkg.id) ?? null
        : null,
    [step, vehicle, pkg, c.world.memberships]
  );

  if (!park) return <div className={screenPad}><MEmpty title="Otopark bulunamadı" /></div>;

  if (step === 5) {
    return (
      <div className={cx(screenPad, 'pt-6')}>
        <div className="mx-auto flex h-[104px] w-[104px] items-center justify-center rounded-full bg-tint-alert">
          <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-alert text-carbon">
            <MIcon name="x" size={40} />
          </span>
        </div>
        <p className="text-center text-[26px] leading-none font-black text-ink">İşlem Başarısız</p>
        <p className="text-center text-[13px] text-slatey">Abonelik şu an başlatılamadı</p>

        <MCard>
          <div className="flex items-center gap-2">
            <MIcon name="alert" size={18} className="text-alert" />
            <span className="text-[14px] font-black text-ink">Hata Detayı</span>
          </div>
          <span aria-hidden className="my-2.5 block border-t border-line" />
          <p className="text-[13px] leading-relaxed text-ash">
            {c.forms['mem.err'] || 'Ödeme işlemi sırasında beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'}
          </p>
          <div className="mt-3.5">
            <p className="text-[13px] font-black text-ink">Olası Çözümler:</p>
            <ul className="mt-1.5 space-y-1.5">
              {[
                'Kart limitinizi ve internet alışverişi yetkisini kontrol edin.',
                'Banka bakiyenizin yeterli olduğundan emin olun.',
                'Başka bir ödeme yöntemi veya kart deneyin.',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-[13px] leading-relaxed text-ash">
                  <span aria-hidden className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-slatey" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </MCard>

        <MButton icon="refresh" onClick={() => { c.nav.form('mem.err', ''); c.nav.form('mem.step', '3'); }}>Tekrar Dene</MButton>
        <MButton variant="outline" icon="ticket" onClick={() => c.nav.push({ name: 'support' })}>Destek Hattı</MButton>
        <p className="text-center text-[11px] leading-relaxed text-slatey">
          Sorun devam ederse lütfen bankanızla veya teknik ekibimizle iletişime geçin.
        </p>
      </div>
    );
  }

  if (step === 4) {
    const total = created ? Math.max(1, created.availableUntilMin - created.subscribedAtMin) : 1;
    const elapsed = created ? Math.max(0, Math.min(total, c.nowMin - created.subscribedAtMin)) : 0;
    return (
      <div className={cx(screenPad, 'pt-6')}>
        <div className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full bg-tint-green">
          <span className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-neon text-carbon">
            <MIcon name="check" size={40} />
          </span>
        </div>
        <p className="text-center text-[26px] leading-none font-black text-ink">Abonelik Aktif!</p>
        <p className="text-center text-[13px] text-slatey">İşleminiz başarıyla tamamlandı.</p>

        <MCard>
          <div className="flex items-center gap-2">
            <span className="flex-1 text-[13px] font-black tracking-[0.08em] text-slatey uppercase">ABONELİK ÖZETİ</span>
            <MChip tone="success">AKTİF</MChip>
          </div>
          <div className="mt-2">
            <ReceiptRow k="Paket" v={pkg?.name ?? '—'} />
            <ReceiptRow k="Otopark" v={park.name} />
            <ReceiptRow k="Plaka" v={<span className="mono">{prettyPlate(vehicle?.plateTxt ?? '')}</span>} />
            <ReceiptRow k="Başlangıç" v={created ? formatDate(c.epochMs, created.subscribedAtMin) : '—'} />
            <ReceiptRow k="Bitiş" v={created ? formatDate(c.epochMs, created.availableUntilMin) : '—'} />
          </div>
          {created && (
            <div className="mt-2">
              <MProgress pct={(elapsed / total) * 100} tone="success" />
              <p className="mt-1 text-[11px] text-slatey">
                {formatInt(Math.max(0, Math.ceil((created.availableUntilMin - c.nowMin) / 1440)))} gün kaldı
              </p>
            </div>
          )}
        </MCard>

        {created && !created.autoRenew && (
          <MButton
            variant="soft"
            icon="refresh"
            onClick={() => dispatch({ type: 'MOBILE_TOGGLE_AUTORENEW', membershipId: created.id })}
          >
            Otomatik Yenilemeyi Aç
          </MButton>
        )}
        {created?.autoRenew && (
          <div className="rounded-[16px] bg-tint-green px-3.5 py-3 text-[12px] font-semibold text-neon-deep">
            Otomatik yenileme açık — süre bitiminde kayıtlı kartınızdan tahsil edilir.
          </div>
        )}

        <div className="rounded-[16px] bg-tint-blue px-3.5 py-3 text-[12px] leading-relaxed font-semibold text-electric-deep">
          Panele düştü: Abonelikler listesinde &laquo;Aktif&raquo; kayıt açıldı, tesisin abonelik kotası 1 azaldı ve
          Finansal Özet&apos;teki abonelik geliri arttı.
        </div>

        {}
        <MButton onClick={() => { c.nav.tab('parkings'); }}>Ana Sayfaya Dön</MButton>
        <MButton
          variant="outline"
          icon="list"
          onClick={() => c.nav.replace({ name: 'subscriptions', params: { view: 'mine' } })}
        >
          Detayları Gör
        </MButton>
        <p className="text-center text-[12px] text-slatey">
          Bir sorun mu var?{' '}
          <button
            type="button"
            onClick={() => c.nav.push({ name: 'new-support' })}
            className="font-bold text-electric-deep underline underline-offset-2"
          >
            Destek Talebi oluştur
          </button>
        </p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className={screenPad}>
        <MStepper
          steps={SUB_STEPS}
          current={2}
          onStep={() => c.nav.pop()}
          ariaLabel="Abonelik adımları"
        />
        <button
          type="button"
          onClick={() => c.nav.pop()}
          className="flex w-full items-center gap-2 rounded-[16px] border border-line bg-anthracite px-3.5 py-2.5 text-left"
        >
          <MIcon name="map" size={16} className="text-electric-deep" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold tracking-[0.1em] text-slatey uppercase">SEÇİLİ OTOPARK</span>
            <span className="block truncate text-[14px] font-bold text-ink">{park.name}</span>
          </span>
          <span className="text-[12px] font-bold text-electric-deep">Değiştir</span>
        </button>

        <QuotaBand park={park} />

        <div>
          <MLabel>Hangi araç için?</MLabel>
          <div className="flex flex-wrap gap-1.5">
            {c.world.vehicles.map((v) => (
              <MChip key={v.id} active={v.id === vehicleId} onClick={() => c.nav.form('mem.vehicleId', v.id)}>
                <span className="mono">{prettyPlate(v.plateTxt)}</span>
              </MChip>
            ))}
            <MChip onClick={() => c.nav.push({ name: 'add-vehicle' })}>
              <MIcon name="plus" size={13} /> Yeni Araç
            </MChip>
          </div>
        </div>

        <div>
          <MLabel>Uygun paketler</MLabel>
          {packages.length === 0 ? (
            <p className="rounded-[16px] border border-dashed border-steel px-3.5 py-4 text-center text-[13px] text-slatey">
              Bu kriterlere uygun aktif bir abonelik paketi bulunamadı.
            </p>
          ) : (
            <div className="space-y-2">
              {packages.map((p) => {
                const on = p.id === packageId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => c.nav.form('mem.packageId', p.id)}
                    aria-pressed={on}
                    className={cx(
                      'flex w-full items-center gap-3 rounded-[18px] border-2 bg-carbon p-3 text-left transition-colors',
                      on ? 'border-electric' : 'border-line hover:border-steel'
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-black text-ink">{p.name}</span>
                      <span className="block text-[12px] text-slatey">
                        {p.durationDays >= 90 ? `${Math.round(p.durationDays / 30)} Ay Abonelik` : `${p.durationDays} Günlük Abonelik`}
                      </span>
                      <span className="mt-1.5 flex flex-wrap gap-1">
                        <MChip tone="neutral">{vehicleClass(p.vehicleClassId).label}</MChip>
                        <MChip tone="neutral">{p.audience}</MChip>
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="mono block text-[19px] font-black text-electric-deep">{formatTL(p.cost)}</span>
                    </span>
                    <span className={cx('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', on ? 'border-electric' : 'border-steel')}>
                      {on && <span className="h-2.5 w-2.5 rounded-full bg-electric" />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <MButton variant="outline" onClick={() => c.nav.pop()}>Geri</MButton>
          {quotaFull ? (
            <MButton variant="outline" icon="info" onClick={() => c.nav.notice('Kota dolu. Web sitesinden başvuru oluşturabilirsiniz.', 'warning')}>
              Web&apos;den Başvur
            </MButton>
          ) : (
            <MButton
              onClick={() => {
                if (!vehicle) { c.nav.notice('Lütfen bir araç seçin.', 'warning'); return; }
                if (!pkg) { c.nav.notice('Lütfen bir paket seçin.', 'warning'); return; }
                c.nav.form('mem.step', '3');
              }}
            >
              Devam Et
            </MButton>
          )}
        </div>
      </div>
    );
  }

  const phoneOk = phone.replace(/\D/g, '').length === 10;

  const cardSheetParams: Record<string, string> = {
    target: 'mem.cardId',
    amount: String(pkg?.cost ?? 0),
    title: 'Güvenli Ödeme',
    amountLabel: `${pkg?.name ?? '-'} • ${formatInt(pkg?.cost ?? 0)} TL`,
    confirm: 'Ödemeyi Tamamla',
  };

  const complete = () => {
    if (!vehicle || !pkg || !card) return;
    if (!phoneOk) { c.nav.notice('Telefon numarası 10 haneli olmalıdır.', 'warning'); return; }
    if (corp && !vatRes) { c.nav.notice('Kurumsal fatura için vergi/TC numarasını sorgulayın.', 'warning'); return; }
    setBusy(true);
    helpers.simulate3DS(() => {
      setBusy(false);
      if (card.isExpired) {

        c.nav.form('mem.err', 'Kartınızın son kullanma tarihi geçmiş — ödeme reddedildi. Lütfen başka bir kart deneyin.');
        c.nav.form('mem.step', 'fail');
        return;
      }
      dispatch({
        type: 'MOBILE_BUY_MEMBERSHIP',
        parkId: park.id,
        packageId: pkg.id,
        plate: vehicle.plateTxt,
        cardId: card.id,
        phone: phone.replace(/\D/g, ''),
        companyName: corp && vatRes ? vatRes.title : null,
        companyVat: corp ? vat : null,
      });
      c.nav.form('mem.step', 'done');
    });
  };

  return (
    <div className={screenPad}>
      <MStepper
        steps={SUB_STEPS}
        current={3}
        onStep={(s) => { if (s === 1) c.nav.pop(); else c.nav.form('mem.step', '2'); }}
        ariaLabel="Abonelik adımları"
      />
      <MCard>
        <MLabel>Özet</MLabel>
        <ReceiptRow k="Otopark" icon="map" v={park.name} />
        <ReceiptRow k="Araç" icon="car" v={<span className="mono">{prettyPlate(vehicle?.plateTxt ?? '')}</span>} />
        <div className="flex items-center gap-2 py-1.5">
          <MIcon name="star" size={14} className="text-slatey" />
          <span className="text-[12px] font-semibold text-slatey">Paket</span>
          <span className="ml-auto flex items-center gap-2">
            <span className="text-[13px] font-bold text-ink">{pkg?.name}</span>
            <span className="mono rounded-full bg-tint-blue px-2 py-0.5 text-[13px] font-black text-electric-deep">
              {formatTL(pkg?.cost ?? 0)}
            </span>
          </span>
        </div>
      </MCard>

      <div>
        <MLabel>Ödeme Yöntemi</MLabel>
        {card ? (
          <button
            type="button"
            onClick={() => c.nav.sheet('card', cardSheetParams)}
            className="flex w-full items-center gap-3 rounded-[16px] border-2 border-electric bg-carbon px-3.5 py-3 text-left"
          >
            <MIcon name="cardIcon" size={20} className="text-electric-deep" />
            <span className="min-w-0 flex-1">
              <span className="mono block text-[13px] font-bold text-ink">•••• •••• •••• {card.last3}</span>
              <span className="block truncate text-[12px] text-slatey">{card.holderName}</span>
            </span>
            <span className="text-[12px] font-bold text-electric-deep">Değiştir</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => c.nav.sheet('card', cardSheetParams)}
            className="flex w-full items-center justify-center gap-2 rounded-[16px] border-2 border-dashed border-steel px-3.5 py-4 text-[14px] font-bold text-slatey hover:border-electric hover:text-electric-deep"
          >
            <MIcon name="plus" size={16} /> Kredi veya Banka Kartı Seç
          </button>
        )}
      </div>

      <div>
        <MLabel>Diğer Bilgiler</MLabel>
        <MInput
          value={phone}
          onChange={(v) => setPhone(v.replace(/\D/g, '').slice(0, 10))}
          placeholder="Telefon (5XX XXX XX XX)"
          inputMode="tel"
          ariaLabel="Telefon"
          invalid={phone.length > 0 && !phoneOk}
          help={phoneOk ? 'Bilgilendirme mesajları bu numaraya gönderilir.' : 'Telefon 10 haneli olmalıdır (başında 0 olmadan).'}
        />
        <button
          type="button"
          onClick={() => { setCorp(!corp); if (corp) { setVatRes(null); setVatErr(''); } }}
          aria-pressed={corp}
          className="mt-2.5 flex w-full items-center gap-2.5 rounded-[16px] border border-steel bg-carbon px-3.5 py-3 text-left"
        >
          <span className={cx('flex h-5 w-5 items-center justify-center rounded-[6px] border-2', corp ? 'border-electric bg-electric text-carbon' : 'border-steel')}>
            {corp && <MIcon name="check" size={12} />}
          </span>
          <span className="text-[14px] font-bold text-ink">Kurumsal Fatura İstiyorum</span>
        </button>

        {corp && (
          <div className="mt-2 space-y-2 rounded-[16px] border border-line bg-anthracite p-3">
            <MInput
              value={vat}
              onChange={(v) => { setVat(v.replace(/\D/g, '').slice(0, 11)); setVatRes(null); setVatErr(''); }}
              placeholder="VKN (10) veya TCKN (11) girin"
              inputMode="numeric"
              ariaLabel="Vergi veya TC kimlik numarası"
              mono
              invalid={Boolean(vatErr)}
              help={vatErr || 'Numara girip sorgulayın; unvan bilgisi doldurulur.'}
            />
            <MButton
              small
              variant="soft"
              icon="search"
              onClick={() => {
                if (vat.length !== 10 && vat.length !== 11) {
                  setVatErr('VKN 10, TCKN 11 haneli olmalıdır.');
                  setVatRes(null);
                  return;
                }
                setVatErr('');
                setVatRes(vatLookup(vat));
              }}
            >
              Sorgula
            </MButton>
            {vatRes && (
              <div className="rounded-[14px] bg-tint-green p-3 text-[12px] leading-relaxed font-semibold text-neon-deep">
                <p className="text-[14px] font-black">{vatRes.title}</p>
                <p className="mt-1">{vatRes.office}</p>
                <p>{vatRes.city}</p>
                <p className="mt-1.5 text-[11px] opacity-80">Örnek sorgulama sonucudur; gerçek bir servise bağlanılmaz.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <MButton variant="outline" onClick={() => c.nav.form('mem.step', '2')}>Geri</MButton>
        {}
        <MButton
          onClick={() => {
            if (!card) { c.nav.sheet('card', cardSheetParams); return; }
            complete();
          }}
          disabled={busy}
          icon={busy ? 'refresh' : 'lock'}
        >
          {busy ? 'İşleniyor...' : card ? 'Ödemeyi Tamamla' : 'Kart Seçiniz'}
        </MButton>
      </div>
    </div>
  );
}

function SubscriptionDetailScreen({ c, id }: { c: Ctx; id: string }) {
  const dispatch = usePanelDispatch();
  const m = c.world.memberships.find((x) => x.id === id) ?? null;
  if (!m) return <div className={screenPad}><MEmpty title="Abonelik bulunamadı" /></div>;

  const pkg = c.world.packages.find((p) => p.id === m.packageId) ?? null;
  const park = c.world.parks.find((p) => p.id === m.parkId) ?? null;
  const tone = memberTone(m);
  const total = Math.max(1, m.availableUntilMin - m.subscribedAtMin);
  const elapsed = Math.max(0, Math.min(total, c.nowMin - m.subscribedAtMin));
  const left = Math.max(0, Math.ceil((m.availableUntilMin - c.nowMin) / 1440));
  const bandBg: Record<Tone, string> = {
    neutral: 'bg-anthracite text-ash', info: 'bg-tint-blue text-electric-deep',
    success: 'bg-tint-green text-neon-deep', warning: 'bg-tint-amber text-amber',
    danger: 'bg-tint-alert text-alert', accent: 'bg-anthracite text-plasma',
  };

  return (
    <div className={screenPad}>
      <div className={cx('flex items-center gap-2.5 rounded-[18px] px-3.5 py-3', bandBg[tone])}>
        <MIcon name={m.statusId === 'active' ? 'check' : m.statusId === 'pending' ? 'clock' : 'info'} size={20} />
        <span className="text-[15px] font-black">{membershipStatus(m.statusId).label}</span>
      </div>

      <MCard>
        <p className="text-[21px] leading-tight font-extrabold text-ink">{pkg?.name ?? 'Abonelik'}</p>
        <div className="mt-2">
          <ReceiptRow k="Araç Plakası" icon="car" v={<span className="mono">{prettyPlate(m.plateTxt)}</span>} />
          <ReceiptRow k="Otopark" icon="map" v={park?.name ?? '—'} />
          <ReceiptRow k="Başlangıç" icon="calendar" v={formatDate(c.epochMs, m.subscribedAtMin)} />
          <ReceiptRow k="Bitiş" icon="calendar" v={formatDate(c.epochMs, m.availableUntilMin)} />
          <ReceiptRow k="Tutar" icon="money" v={formatTL(m.amount)} />
        </div>
        {m.statusId === 'pending' ? (
          <p className="mt-2 rounded-[14px] bg-tint-amber px-3 py-2.5 text-[12px] leading-relaxed font-semibold text-amber">
            Aboneliğiniz ödeme tamamlanınca aktifleşir.
          </p>
        ) : (
          <div className="mt-2.5">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-[11px] font-black tracking-[0.1em] text-slatey uppercase">KALAN SÜRE</span>
              <span className="mono text-[13px] font-black text-ink">{formatInt(left)} gün</span>
            </div>
            <MProgress pct={(elapsed / total) * 100} tone={tone} />
          </div>
        )}
      </MCard>

      <div className="space-y-2">
        {m.paymentStatusId !== 2 && (
          <MButton
            icon="wallet"
            onClick={() =>
              c.nav.sheet('card', {

                target: 'membership.pay',
                id: m.id,
                amount: String(m.amount),
                title: 'Abonelik Ödemesi',
                amountLabel: 'Abonelik Tutarı',
                confirm: 'Ödeme Yap',
                hideSaved: '1',
              })
            }
          >
            Ödemeyi Tamamla
          </MButton>
        )}

        {m.statusId === 'active' && (
          <MCard>
            <div className="flex items-center gap-3">
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink">Otomatik Yenileme</span>
                <span className="block text-[12px] text-slatey">
                  {m.autoRenew ? 'Süre bitiminde kayıtlı karttan tahsil edilir.' : 'Kapalı — süre bitiminde abonelik sona erer.'}
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={m.autoRenew}
                aria-label="Otomatik yenileme"
                onClick={() => dispatch({ type: 'MOBILE_TOGGLE_AUTORENEW', membershipId: m.id })}
                className={cx(
                  'flex h-[26px] w-[46px] shrink-0 items-center rounded-full border px-[3px] transition-colors',
                  m.autoRenew ? 'border-electric bg-electric' : 'border-steel bg-graphite'
                )}
              >
                <span className={cx('block h-[18px] w-[18px] rounded-full bg-carbon transition-transform', m.autoRenew && 'translate-x-[20px]')} />
              </button>
            </div>
          </MCard>
        )}

        <MButton variant="outline" icon="list" onClick={() => c.nav.push({ name: 'payment-history', params: { id: m.id } })}>
          Ödeme Geçmişi
        </MButton>

        {(m.statusId === 'expired' || m.statusId === 'terminated') && pkg && (
          <MButton
            variant="soft"
            icon="refresh"
            onClick={() =>
              dispatch({
                type: 'MEMBERSHIP_EXTEND',
                id: m.id,
                days: pkg.durationDays,
                kind: 'odeme',
                note: 'Mobil uygulamadan yenilendi.',
                collect: true,
              })
            }
          >
            Aboneliği Yenile · {formatTL(pkg.cost)}
          </MButton>
        )}

        {m.statusId === 'active' && (
          <MButton
            variant="danger"
            icon="ban"
            onClick={() =>
              c.nav.sheet('confirm', {
                act: 'membership-cancel',
                id: m.id,
                title: 'Aboneliği İptal Et',
                msg: 'Abonelik sonlandırılacak ve kalan süre kullanılamayacak. Bu işlem geri alınamaz.',
                ok: 'Aboneliği İptal Et',
              })
            }
          >
            Aboneliği İptal Et
          </MButton>
        )}
      </div>

      {m.extensions.length > 0 && (
        <MCard>
          <MLabel>Uzatma Geçmişi</MLabel>
          <ul className="space-y-1.5">
            {m.extensions.map((e, i) => (
              <li key={i} className="flex items-center gap-2 text-[12px]">
                <StatusDot tone="info" />
                <span className="text-slatey">{formatDate(c.epochMs, e.previousUntilMin)}</span>
                <MIcon name="arrow-right" size={12} className="text-slatey" />
                <span className="font-bold text-ink">{formatDate(c.epochMs, e.newUntilMin)}</span>
              </li>
            ))}
          </ul>
        </MCard>
      )}
    </div>
  );
}

function PaymentHistoryScreen({ c, id }: { c: Ctx; id: string }) {
  const [filter, setFilter] = useState<'all' | '2' | '3' | '4'>('all');
  const rows = useMemo(
    () => c.world.payments.filter((p) => p.membershipId === id).sort((a, b) => b.createdAtMin - a.createdAtMin),
    [c.world.payments, id]
  );
  const count = (s: string) => rows.filter((r) => String(r.statusId) === s).length;
  const shown = filter === 'all' ? rows : rows.filter((r) => String(r.statusId) === filter);

  const pills: { id: 'all' | '2' | '3' | '4'; label: string; n: number; tone: Tone }[] = [
    { id: 'all', label: 'Tümü', n: rows.length, tone: 'neutral' },
    { id: '2', label: 'Ödendi', n: count('2'), tone: 'success' },
    { id: '3', label: 'Beklemede', n: count('3'), tone: 'warning' },
    { id: '4', label: 'Başarısız', n: count('4'), tone: 'danger' },
  ];

  return (
    <div className={screenPad}>
      <div className="flex flex-wrap gap-1.5">
        {pills.map((p) => (
          <MChip key={p.id} active={filter === p.id} onClick={() => setFilter(p.id)}>
            {p.label}
            <span className={cx('mono rounded-full bg-anthracite px-1.5 text-[10px] font-black', TONE_TEXT[p.tone])}>{p.n}</span>
          </MChip>
        ))}
      </div>

      {shown.length === 0 ? (
        <MEmpty icon="money" title="Kayıt yok" desc="Bu filtreye uyan ödeme bulunmuyor." />
      ) : (
        shown.map((p) => {
          const st = paymentStatus(p.statusId);
          return (
            <MCard key={p.id}>
              <div className="flex items-center gap-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold text-ink">{formatDateTime(c.epochMs, p.createdAtMin)}</span>
                  <span className="block text-[12px] text-slatey">{p.serviceMessage}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="mono block text-[16px] font-black text-ink">{formatTL(p.amount)}</span>
                  <MChip tone={st.tone}>{st.label}</MChip>
                </span>
              </div>
            </MCard>
          );
        })
      )}
    </div>
  );
}

function VehiclesScreen({ c }: { c: Ctx }) {
  if (c.world.vehicles.length === 0) {
    return (
      <div className={screenPad}>
        <MEmpty icon="car" title="Henüz araç yok" desc="İlk aracınızı ekleyerek başlayın." action={<MButton small onClick={() => c.nav.push({ name: 'add-vehicle' })}>Araç Ekle</MButton>} />
      </div>
    );
  }
  return (
    <div className={screenPad}>
      {c.world.vehicles.map((v) => (
        <MCard key={v.id}>
          <div className="flex items-center gap-3">
            <span className="mono min-w-0 flex-1 truncate text-[22px] font-black tracking-[0.05em] text-ink">
              {prettyPlate(v.plateTxt)}
            </span>
            {v.isDefault && <MChip tone="info">Varsayılan</MChip>}
            <button
              type="button"
              aria-label={`${prettyPlate(v.plateTxt)} aracını sil`}
              onClick={() =>
                c.nav.sheet('confirm', {
                  act: 'vehicle-remove', id: v.id,
                  title: 'Aracı Sil',
                  msg: `${prettyPlate(v.plateTxt)} plakalı aracı kayıtlarınızdan kaldırmak istediğinize emin misiniz?`,
                  ok: 'Aracı Sil',
                })
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tint-alert text-alert hover:opacity-80"
            >
              <MIcon name="trash" size={16} />
            </button>
          </div>
        </MCard>
      ))}
      <p className="text-[11px] leading-relaxed text-slatey">
        Buraya eklediğiniz plakalar abonelik satın alma adımında ve destek talebi formunda seçilebilir olur.
      </p>
    </div>
  );
}

function AddVehicleScreen({ c }: { c: Ctx }) {
  const dispatch = usePanelDispatch();
  const [plate, setPlate] = useState('');
  const dup = c.world.vehicles.some((v) => plateKey(v.plateTxt) === plateKey(plate));
  const short = plate.length > 0 && plate.length < 6;
  const valid = plate.length >= 6 && !dup;
  const err = dup ? 'Bu plaka zaten araçlarınız arasında kayıtlı.' : short ? 'Plaka en az 6 karakter olmalıdır.' : '';

  return (
    <div className={cx(screenPad, 'pt-5')}>
      <PlateVisual value={plate} />
      <div className="pt-2">
        <MLabel>Plaka Numarası</MLabel>
        <MInput
          value={plate}
          onChange={(v) => setPlate(normalizePlate(v))}
          placeholder="34PBZ001"
          ariaLabel="Plaka numarası"
          mono
          maxLength={9}
          invalid={Boolean(err)}
          help={err || 'Türkçe karakterler otomatik olarak ASCII karşılığına çevrilir.'}
          onEnter={() => { if (valid) dispatch({ type: 'MOBILE_ADD_VEHICLE', plate: prettyPlate(plate) }); }}
        />
      </div>
      <MButton icon="check" disabled={!valid} onClick={() => dispatch({ type: 'MOBILE_ADD_VEHICLE', plate: prettyPlate(plate) })}>
        Aracı Kaydet
      </MButton>
    </div>
  );
}

const CARD_REGISTER_SHEET: Record<string, string> = {
  target: 'card.register',
  amount: '0',
  title: 'Yeni Kart Kaydet',
  amountLabel: 'Doğrulama için 1₺ çekilir ve iade edilir',
  confirm: 'Kartı Kaydet',
  hideSaved: '1',
};

function CardsScreen({ c }: { c: Ctx }) {
  const dispatch = usePanelDispatch();
  if (c.world.cards.length === 0) {
    return (
      <div className={screenPad}>
        <MEmpty
          icon="cardIcon"
          title="Henüz kayıtlı kart yok"
          desc="Kart ekleyerek ödemelerinizi hızlandırabilirsiniz."
          action={<MButton small onClick={() => c.nav.sheet('card', CARD_REGISTER_SHEET)}>Kart Ekle</MButton>}
        />
      </div>
    );
  }
  return (
    <div className={screenPad}>
      {c.world.cards.map((card) => (
        <CardVisual
          key={card.id}
          card={card}
          onDefault={() => dispatch({ type: 'MOBILE_SET_DEFAULT_CARD', id: card.id })}
          onDelete={() =>
            c.nav.sheet('confirm', {
              act: 'card-delete', id: card.id,
              title: 'Kartı Sil',
              msg: `"${card.brand} •••• ${card.last3}" kartını silmek istediğinize emin misiniz?`,
              ok: 'Kartı Sil',
            })
          }
        />
      ))}
      <div className="rounded-[16px] bg-anthracite px-3.5 py-3 text-[11px] leading-relaxed text-ash">
        <b className="text-ink">Güvenlik:</b> Kart numarası hiçbir yerde saklanmaz. Yalnızca marka, son 3 hane ve
        kart sahibi adı tutulur; tam numara ne ekranda ne kayıtlarda yer alır.
      </div>
    </div>
  );
}

const myTickets = (world: DemoWorld): SupportTicket[] =>
  world.tickets.filter((t) => t.source === 'mobil').sort((a, b) => b.updatedAtMin - a.updatedAtMin);

function SupportScreen({ c }: { c: Ctx }) {
  const rows = useMemo(() => myTickets(c.world), [c.world]);
  if (rows.length === 0) {
    return (
      <div className={screenPad}>
        <MEmpty
          icon="ticket"
          title="Henüz destek talebiniz yok"
          desc={'Bir sorun yaşarsanız "Yeni Talep" ile bize ulaşabilirsiniz.'}
          action={<MButton small onClick={() => c.nav.push({ name: 'new-support' })}>Yeni Talep</MButton>}
        />
      </div>
    );
  }
  return (
    <div className={screenPad}>
      <div>
        <p className="text-[17px] font-black text-ink">Mevcut Talepler</p>
        <p className="text-[12px] text-slatey">Durumu gör ve detay aç.</p>
      </div>
      {rows.map((t) => {
        const st = ticketStatus(t.status);
        return (
          <MCard key={t.id} onClick={() => c.nav.push({ name: 'support-detail', params: { id: t.id } })} ariaLabel={`${t.subject} talebini aç`}>
            <div className="flex items-start gap-3">
              <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]', TONE_TEXT[st.tone], 'bg-anthracite')}>
                <MIcon name="ticket" size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-extrabold text-ink">{t.subject}</span>
                <span className="block text-[11px] text-slatey">
                  {c.world.parks.find((p) => p.id === t.parkId)?.name ?? 'Otopark seçilmedi'} · {formatDate(c.epochMs, t.createdAtMin)}
                </span>
              </span>
              <MChip tone={st.tone}>{st.label}</MChip>
            </div>
            <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-ash">{t.content}</p>
            <p className="mt-1.5 text-[12px] font-bold text-electric-deep">
              Detayı gör › {t.replies.length > 0 && <span className="text-slatey">({t.replies.length} mesaj)</span>}
            </p>
          </MCard>
        );
      })}
    </div>
  );
}

function SupportDetailScreen({ c, id }: { c: Ctx; id: string }) {
  const dispatch = usePanelDispatch();
  const [open, setOpen] = useState(true);
  const [body, setBody] = useState('');
  const t = c.world.tickets.find((x) => x.id === id) ?? null;

  const attKey = `rep.att:${id}`;
  const replyAtts = parseAtt(c.forms[attKey] ?? '');
  if (!t) return <div className={screenPad}><MEmpty title="Talep bulunamadı" /></div>;

  const locked = t.status === 'closed' || t.status === 'resolved';
  const st = ticketStatus(t.status);

  return (
    <div className={screenPad}>
      <div className="flex items-center gap-2">
        <MChip tone={st.tone}>{st.label}</MChip>
        <span className="mono text-[11px] text-slatey">{t.id}</span>
      </div>

      <MCard>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center gap-2 text-left">
          <span className="flex-1 text-[14px] font-black text-ink">Talep Mesajı</span>
          <MIcon name={open ? 'chevron-down' : 'chevron-right'} size={16} className="text-slatey" />
        </button>
        {open && (
          <>
            <p className="mt-2 text-[13px] leading-relaxed text-ash">{t.content}</p>
            {t.attachments.length > 0 && (
              <>
                <div className="mt-2.5"><MLabel>Ekli Dosyalar</MLabel></div>
                <AttachStrip c={c} atts={t.attachments} />
              </>
            )}
          </>
        )}
      </MCard>

      <div className="flex items-center gap-2">
        <MLabel>Mesajlar</MLabel>
        <span className="mb-2 rounded-full bg-anthracite px-2 py-0.5 text-[11px] font-black text-ash">{t.replies.length}</span>
      </div>

      {t.replies.length === 0 ? (
        <MEmpty
          icon="chat"
          title="Henüz mesaj yok"
          desc="İlk mesajı göndererek destek ekibiyle görüşmeyi başlatabilirsiniz."
        />
      ) : (
        <div className="space-y-2">
          {t.replies.map((r) => {
            const mineSide = r.sender === 'partner';
            return (
              <div key={r.id} className={cx('flex', mineSide ? 'justify-end' : 'justify-start')}>
                <div
                  className={cx(
                    'max-w-[85%] rounded-[18px] px-3.5 py-2.5',
                    mineSide ? 'bg-electric text-carbon' : 'border border-line bg-anthracite text-ink'
                  )}
                >
                  {r.body && <p className="text-[13px] leading-relaxed">{r.body}</p>}
                  {r.attachments.length > 0 && (
                    <div className={cx(r.body && 'mt-2')}>
                      {r.attachments.map((a) => {
                        const img = isImageAtt(a.name);
                        return (
                          <button
                            key={a.name}
                            type="button"
                            onClick={() => c.nav.sheet('preview', { name: a.name })}
                            aria-label={img ? 'Görseli büyüt' : 'Dosyayı aç'}
                            className={cx(
                              'mt-1 flex w-full max-w-[220px] items-center gap-1.5 rounded-[12px] px-2.5 py-1.5 text-left text-[11px] font-semibold',
                              mineSide ? 'bg-carbon/20 text-carbon' : 'border border-line bg-carbon text-ash'
                            )}
                          >
                            <MIcon name={img ? 'image' : 'doc'} size={12} className="shrink-0" />
                            <span className="truncate">{a.name}</span>
                            <MIcon name="expand" size={11} className="ml-auto shrink-0 opacity-70" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <p className={cx('mt-1 text-[10px]', mineSide ? 'opacity-75' : 'text-slatey')}>
                    {formatTime(c.epochMs, r.createdAtMin)}
                    {r.isTemplate ? ' · şablon önerisi' : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {locked ? (
        <div className="rounded-[16px] bg-anthracite px-3.5 py-3 text-[12px] leading-relaxed font-semibold text-ash">
          Bu talep {st.label.toLocaleLowerCase('tr-TR')} durumunda olduğu için yanıt alanı kapalıdır. Yeni bir sorun
          için yeni talep oluşturabilirsiniz.
        </div>
      ) : (
        <div className="space-y-2">
          {replyAtts.length > 0 && (
            <AttachStrip
              c={c}
              atts={replyAtts}
              max={3}
              onRemove={(name) =>
                c.nav.form(attKey, replyAtts.filter((x) => x.name !== name).map((x) => `${x.name}::${x.sizeKb}`).join('|'))
              }
            />
          )}
          <div className="flex items-end gap-2">
            {}
            <button
              type="button"
              aria-label="Dosya ekle"
              disabled={replyAtts.length >= 3}
              onClick={() => c.nav.sheet('attach', { key: attKey, max: '3' })}
              className={cx(
                'flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[16px] border border-steel bg-carbon text-electric-deep transition-colors',
                replyAtts.length >= 3 ? 'cursor-not-allowed opacity-55' : 'hover:border-electric'
              )}
            >
              <MIcon name="attach" size={19} />
            </button>
            <div className="min-w-0 flex-1">
              <MTextArea
                value={body}
                onChange={setBody}
                rows={2}
                placeholder={replyAtts.length ? 'Açıklama ekleyin (opsiyonel)...' : 'Mesajınızı yazın...'}
                ariaLabel="Yanıt mesajı"
              />
            </div>
          </div>
          <MButton
            icon="arrow-right"
            disabled={body.trim().length < 2 && replyAtts.length === 0}
            onClick={() => {
              const text = body.trim();
              if (replyAtts.length > 0) {

                dispatch({ type: 'TICKET_REPLY', id: t.id, body: text, sender: 'partner', attachments: replyAtts });
                c.nav.form(attKey, '');
              } else {
                dispatch({ type: 'MOBILE_REPLY_TICKET', id: t.id, body: text });
              }
              setBody('');
            }}
          >
            Gönder
          </MButton>
        </div>
      )}
    </div>
  );
}

const parseAtt = (raw: string): { name: string; sizeKb: number }[] =>
  raw ? raw.split('|').filter(Boolean).map((s) => {
    const [name, kb] = s.split('::');
    return { name, sizeKb: Number(kb) || 0 };
  }) : [];

function NewSupportScreen({ c }: { c: Ctx }) {
  const dispatch = usePanelDispatch();
  const [msg, setMsg] = useState('');
  const [manualPlate, setManualPlate] = useState('');
  const [touched, setTouched] = useState(false);

  const cat = c.forms['sup.cat'] ?? '';
  const parkRaw = c.forms['sup.park'] ?? '';
  const vehId = c.forms['sup.vehicle'] ?? '';
  const atts = parseAtt(c.forms['sup.att'] ?? '');

  const catLabel = TICKET_CATEGORY.find((x) => x.id === cat)?.label ?? null;
  const parkLabel =
    parkRaw === 'none' ? 'Otopark seçmeyeceğim' : c.world.parks.find((p) => String(p.id) === parkRaw)?.name ?? null;
  const veh = c.world.vehicles.find((v) => v.id === vehId) ?? null;

  const manualMode = vehId === 'manual';
  const vehValue = manualMode
    ? (manualPlate ? prettyPlate(normalizePlate(manualPlate)) : null)
    : vehId === 'none' ? 'Araç Seçilmedi' : veh ? prettyPlate(veh.plateTxt) : null;

  const msgOk = msg.trim().length >= 10;
  const valid = Boolean(cat) && msgOk;

  const submit = () => {
    setTouched(true);
    if (!cat) { c.nav.notice('Lütfen bir konu seçin.', 'warning'); return; }
    if (!msgOk) { c.nav.notice('Açıklama en az 10 karakter olmalıdır.', 'warning'); return; }
    const targetPark =
      parkRaw && parkRaw !== 'none'
        ? Number(parkRaw)
        : c.panelParkId === ALL_PARKS_ID ? c.world.parks[0].id : c.panelParkId;
    const plate = manualMode ? (manualPlate ? normalizePlate(manualPlate) : null) : veh?.plateTxt ?? null;
    dispatch({
      type: 'MOBILE_CREATE_TICKET',
      parkId: targetPark,
      subject: catLabel ? `${catLabel} — mobil talep` : 'Mobil talep',
      content: msg.trim(),
      category: cat as TicketCategoryId,
      plate,
      attachments: atts,
    });
    c.nav.clearForms(['sup.cat', 'sup.park', 'sup.vehicle', 'sup.att']);
  };

  return (
    <div className={screenPad}>
      {}
      <MSelectRow icon="ticket" label="Konu / Sorun" value={catLabel} placeholder="Sorun türünü seçin" onClick={() => c.nav.sheet('select', { kind: 'category' })} />
      <MSelectRow icon="map" label="Otopark" value={parkLabel} placeholder="Hangi otoparkta sorun yaşadınız?" onClick={() => c.nav.sheet('select', { kind: 'park' })} />
      <MSelectRow icon="car" label="Araç" value={vehValue} placeholder="Araç seçin veya yeni girin" onClick={() => c.nav.sheet('select', { kind: 'vehicle' })} />

      {manualMode && (
        <div>
          <MLabel>Plaka Girin</MLabel>
          <MInput value={manualPlate} onChange={(v) => setManualPlate(normalizePlate(v))} placeholder="34 ABC 123" mono ariaLabel="Plaka Girin" />
        </div>
      )}

      <div>
        <MLabel>Fotoğraf / Belge Ekle (Opsiyonel)</MLabel>
        <AttachStrip
          c={c}
          atts={atts}
          max={5}
          onRemove={(name) => c.nav.form('sup.att', atts.filter((x) => x.name !== name).map((x) => `${x.name}::${x.sizeKb}`).join('|'))}
          onAdd={() => c.nav.sheet('attach', { key: 'sup.att', max: '5' })}
        />
        <p className="mt-1.5 text-[11px] text-slatey">En fazla 5 dosya · dosya başına 20 MB.</p>
      </div>

      <div>
        <MLabel>Mesajınız (Minimum 10 Karakter)</MLabel>
        <MTextArea
          value={msg}
          onChange={setMsg}
          rows={5}
          placeholder="Yaşadığınız sorunu buraya yazın..."
          ariaLabel="Talep mesajı"
          invalid={touched && !msgOk}
          help={touched && !msgOk ? 'Açıklama en az 10 karakter olmalıdır.' : `${msg.trim().length} karakter`}
        />
      </div>

      {}
      {!valid && (
        <p className="-mt-1 text-[11px] text-slatey">
          Gönderebilmek için{' '}
          {[!cat && 'bir konu seçin', !msgOk && 'en az 10 karakterlik açıklama yazın']
            .filter(Boolean)
            .join(' ve ')}
          .
        </p>
      )}

      <MButton icon="check" onClick={submit} disabled={!valid}>Destek Kaydı Oluştur</MButton>
      <p className="text-[11px] leading-relaxed text-slatey">
        Oluşturduğunuz talep panelin Destek modülüne kaynak &laquo;mobil&raquo; etiketiyle düşer; panelden yazılan
        yanıt bu ekrandaki sohbette görünür.
      </p>
    </div>
  );
}

function ProfileScreen({ c }: { c: Ctx }) {
  const dispatch = usePanelDispatch();
  const u = c.world.mobileUser;
  const rows: { icon: MIconKey; label: string; route: MobileRouteName; params?: Record<string, string> }[] = [
    { icon: 'car', label: 'Araçlarım', route: 'vehicles' },
    { icon: 'cardIcon', label: 'Kayıtlı Kartlarım', route: 'cards' },
    { icon: 'star', label: 'Mevcut Abonelikler', route: 'subscriptions', params: { view: 'mine' } },
    { icon: 'ticket', label: 'Destek Talepleri', route: 'support' },
    { icon: 'info', label: 'İletişim & Yasal Bilgiler', route: 'contact' },
  ];

  return (
    <div className={screenPad}>
      <div className="flex flex-col items-center pt-2 pb-1">
        <span className="relative flex h-[106px] w-[106px] items-center justify-center rounded-full border-[3px] border-line">
          <span className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-ink text-[32px] font-black text-carbon">
            {initialsOf(u.name)}
          </span>
          <span className="absolute right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-carbon bg-electric text-carbon">
            <MIcon name="shield" size={13} />
          </span>
        </span>
        <p className="mt-3 text-[24px] leading-none font-black text-ink">{u.name}</p>
        <p className="mt-2 rounded-full bg-anthracite px-3 py-1 text-[12px] font-semibold text-ash">
          {u.phone} • {u.email}
        </p>
      </div>

      <div>
        <MLabel>İşlemler</MLabel>
        <div className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-carbon">
          {rows.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => c.nav.push({ name: r.route, params: r.params })}
              className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-anthracite"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-tint-blue text-electric-deep">
                <MIcon name={r.icon} size={17} />
              </span>
              <span className="flex-1 text-[14px] font-bold text-ink">{r.label}</span>
              <MIcon name="chevron-right" size={16} className="text-slatey" />
            </button>
          ))}

          <div className="flex items-center gap-3 px-3.5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-tint-blue text-electric-deep">
              <MIcon name="bell" size={17} />
            </span>
            <span className="flex-1 text-[14px] font-bold text-ink">Bildirimler</span>
            <button
              type="button"
              role="switch"
              aria-checked={u.notificationsEnabled}
              aria-label="Bildirimler"
              onClick={() => {
                if (u.notificationsEnabled) {
                  c.nav.sheet('confirm', {
                    act: 'notifications-off',
                    title: 'Bildirimleri Kapat?',
                    msg: 'Borç, abonelik ve destek bildirimlerini almayı durduracaksınız.',
                    ok: 'Bildirimleri Kapat',
                  });
                } else {
                  dispatch({ type: 'MOBILE_TOGGLE_NOTIFICATIONS' });
                }
              }}
              className={cx(
                'flex h-[26px] w-[46px] shrink-0 items-center rounded-full border px-[3px] transition-colors',
                u.notificationsEnabled ? 'border-electric bg-electric' : 'border-steel bg-graphite'
              )}
            >
              <span className={cx('block h-[18px] w-[18px] rounded-full bg-carbon transition-transform', u.notificationsEnabled && 'translate-x-[20px]')} />
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-carbon">
        <button
          type="button"
          onClick={() => c.nav.sheet('confirm', { act: 'logout', title: 'Çıkış Yap', msg: 'Demo oturumu sıfırlanır; otopark listesine dönersiniz.', ok: 'Çıkış Yap' })}
          className="flex w-full items-center gap-3 px-3.5 py-3 text-left text-alert transition-colors hover:bg-tint-alert"
        >
          <MIcon name="arrow-left" size={17} />
          <span className="flex-1 text-[14px] font-bold">Çıkış Yap</span>
        </button>
        <button
          type="button"
          onClick={() =>
            c.nav.sheet('confirm', {
              act: 'reset',
              title: 'Hesabımı Sil',
              msg: 'Gerçek uygulamada hesap ve tüm veriler kalıcı olarak silinir ve bu işlem geri alınamaz. Demo ikizinde silme çalıştırılmaz; onaylarsanız yalnızca telefon simülasyonu başlangıç durumuna döner.',
              ok: 'Demoyu Sıfırla',
            })
          }
          className="flex w-full items-center gap-3 px-3.5 py-3 text-left text-alert transition-colors hover:bg-tint-alert"
        >
          <MIcon name="trash" size={17} />
          <span className="flex-1 text-[14px] font-bold">Hesabımı Sil</span>
        </button>
      </div>

      <p className="text-center text-[11px] text-slatey">ParkBiz demo ikizi · sürüm 1.1.5 (örnek)</p>
    </div>
  );
}

const LEGAL_DOCS = [
  'KVKK Aydınlatma Metni',
  'Gizlilik Politikası',
  'Açık Rıza Metni',
  'Ödeme / İptal / İade Koşulları',
];

function ContactScreen({ c }: { c: Ctx }) {
  const office = corporate.locations[1] ?? corporate.locations[0];
  return (
    <div className={screenPad}>
      <div>
        <MLabel>İletişim Kanalları</MLabel>
        <div className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-carbon">
          <div className="flex items-center gap-3 px-3.5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-tint-blue text-electric-deep">
              <MIcon name="signal" size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold tracking-[0.08em] text-slatey uppercase">TELEFON</span>
              <span className="block truncate text-[14px] font-bold text-ink">{corporate.supportPhone}</span>
            </span>
            <a href={`tel:${corporate.supportPhoneHref}`} className="rounded-full bg-tint-blue px-3 py-1.5 text-[12px] font-black text-electric-deep">
              Ara
            </a>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-tint-blue text-electric-deep">
              <MIcon name="doc" size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold tracking-[0.08em] text-slatey uppercase">E-POSTA</span>
              <span className="block truncate text-[14px] font-bold text-ink">{corporate.email}</span>
            </span>
            <a href={`mailto:${corporate.email}`} className="rounded-full bg-tint-blue px-3 py-1.5 text-[12px] font-black text-electric-deep">
              Gönder
            </a>
          </div>
        </div>
      </div>

      <div>
        <MLabel>Merkez Ofisimiz</MLabel>
        <MCard>
          <div className="flex items-start gap-2.5">
            <MIcon name="map" size={17} className="mt-0.5 text-electric-deep" />
            <p className="text-[13px] leading-relaxed text-ash">{office.v}</p>
          </div>
        </MCard>
      </div>

      <div>
        <MLabel>Yasal Bilgiler</MLabel>
        <div className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-carbon">
          {LEGAL_DOCS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => c.nav.sheet('legal', { title: d })}
              className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-anthracite"
            >
              <MIcon name="doc" size={16} className="text-slatey" />
              <span className="flex-1 text-[14px] font-semibold text-ink">{d}</span>
              <MIcon name="chevron-right" size={15} className="text-slatey" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function resolveCard(cards: SavedCard[], id: string): SavedCard | null {
  if (!id) return null;
  if (id === '__default__') return cards.find((x) => x.isDefault) ?? null;
  return cards.find((x) => x.id === id) ?? null;
}

function MField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-extrabold tracking-[0.1em] text-slatey uppercase">{label}</p>
      {children}
    </div>
  );
}

function CardPaymentSheet({
  c, target, membershipId, currentRoute, title, amountLabel, confirmLabel, sessionId, hideSaved = false,
}: {
  c: Ctx; target: string; membershipId?: string; currentRoute: MobileRoute;
  title: string; amountLabel: string; confirmLabel: string; sessionId?: string; hideSaved?: boolean;
}) {
  const dispatch = usePanelDispatch();
  const hasSaved = !hideSaved && c.world.cards.length > 0;
  const [tab, setTab] = useState<'saved' | 'new'>(hasSaved ? 'saved' : 'new');
  const [picked, setPicked] = useState<string>(() => c.world.cards.find((x) => x.isDefault)?.id ?? '');
  const [holder, setHolder] = useState('DEMO KULLANICI');
  const [digits, setDigits] = useState('4242424242424242');
  const [exp, setExp] = useState('11/29');
  const [cvv, setCvv] = useState('123');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expM = Number(exp.slice(0, 2));
  const expY = Number(exp.slice(3, 5));
  const holderBad = holder.trim().length < 3;
  const numberBad = digits.length !== 16;
  const expBad = !(exp.length === 5 && expM >= 1 && expM <= 12 && expY >= 26);
  const cvvBad = cvv.length < 3;
  const okNew = !holderBad && !numberBad && !expBad && !cvvBad;

  const session = sessionId ? c.world.sessions.find((s) => s.id === sessionId) ?? null : null;

  const choose = (id: string) => {
    if (target === 'membership.pay' && membershipId) {
      dispatch({ type: 'MEMBERSHIP_PAY', id: membershipId, cardId: id });
      c.nav.sheet(null);
      return;
    }
    c.nav.form(target, id);
    c.nav.sheet(null);
  };

  const saveNew = () => {
    dispatch({
      type: 'MOBILE_ADD_CARD',
      brand: brandOf(digits), last3: digits.slice(-3),
      holderName: holder.trim(), expireMonth: expM, expireYear: expY,
    });

    dispatch({ type: 'MOBILE_NAV', op: 'push', route: currentRoute });
    if (target === 'membership.pay' && membershipId) {
      dispatch({ type: 'MEMBERSHIP_PAY', id: membershipId, cardId: '__default__' });
    } else if (target !== 'card.register') {

      c.nav.form(target, '__default__');
    }
    c.nav.sheet(null);
  };

  const submit = () => {
    if (tab === 'saved' && hasSaved) {
      if (!picked) { setError('Lütfen bir kart seçin.'); return; }
      setError(null);
      choose(picked);
      return;
    }
    setTouched(true);
    if (!okNew) {
      setError('Girdiğiniz bilgilerde bir hata tespit edildi. Lütfen bilgilerinizi kontrol ederek tekrar deneyiniz.');
      return;
    }
    setError(null);
    saveNew();
  };

  const confirmDisabled = tab === 'saved' && (!hasSaved || !picked);

  return (
    <PhoneOverlay
      title={title}
      onClose={() => c.nav.sheet(null)}
      footer={
        <>
          {error && (
            <div className="mb-2 flex items-start gap-2 rounded-[14px] bg-tint-alert px-3 py-2 text-[12px] leading-relaxed font-semibold text-alert">
              <MIcon name="alert" size={15} className="mt-[1px]" />
              <span>{error}</span>
            </div>
          )}
          <MButton icon="lock" onClick={submit} disabled={confirmDisabled}>{confirmLabel}</MButton>
        </>
      }
    >
      <p className="mono mb-3 text-[15px] font-black text-electric-deep">{amountLabel}</p>

      {session && (
        <div className="mb-3 flex items-stretch rounded-[16px] border border-line bg-anthracite px-2 py-2">
          {[
            { icon: 'login' as MIconKey, label: 'Giriş', value: formatTime(c.epochMs, session.entryMin) },
            { icon: 'logout' as MIconKey, label: 'Çıkış', value: session.exitMin === null ? '—' : formatTime(c.epochMs, session.exitMin) },
            { icon: 'timer' as MIconKey, label: 'Süre', value: formatDuration(sessionDuration(session, c.nowMin)) },
          ].map((item, i) => (
            <div key={item.label} className="contents">
              {i > 0 && <span aria-hidden className="my-1 w-px bg-line" />}
              <div className="flex flex-1 items-center justify-center gap-1.5 px-1">
                <MIcon name={item.icon} size={13} className={i === 0 ? 'text-electric-deep' : 'text-slatey'} />
                <span className="text-[11px] font-semibold text-slatey">{item.label}</span>
                <span className="text-[12px] font-bold text-ink">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={cx('mb-3 flex gap-1.5', hideSaved && 'hidden')} role="group" aria-label="Kart kaynağı">
        {(['saved', 'new'] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tab === t}
            onClick={() => { setTab(t); setError(null); }}
            className={cx(
              'flex flex-1 items-center justify-center gap-1.5 rounded-[14px] border px-3 py-2 text-[13px] font-bold transition-colors',
              tab === t ? 'border-electric bg-tint-blue text-electric-deep' : 'border-steel bg-carbon text-slatey'
            )}
          >
            <MIcon name={t === 'saved' ? 'cardIcon' : 'plus'} size={15} />
            {t === 'saved' ? 'Kayıtlı Kart' : 'Yeni Kart'}
          </button>
        ))}
      </div>

      {tab === 'saved' ? (
        !hasSaved ? (
          <div className="rounded-[16px] border border-dashed border-steel px-3.5 py-6 text-center">
            <MIcon name="cardIcon" size={40} className="mx-auto text-slatey" />
            <p className="mt-2 text-[14px] font-bold text-ink">Kayıtlı Kart Yok</p>
            <p className="mt-1 text-[12px] leading-relaxed text-slatey">
              Henüz kayıtlı bir kartınız bulunmuyor. Kart eklemek için Profilim &gt; Kayıtlı Kartlarım bölümünü
              kullanın.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {c.world.cards.map((card) => {
              const on = picked === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => { setPicked(card.id); setError(null); }}
                  className={cx(
                    'flex w-full items-center gap-3 rounded-[16px] border px-3.5 py-3 text-left transition-colors',
                    on ? 'border-electric bg-tint-blue' : 'border-steel bg-carbon hover:border-electric/60'
                  )}
                >
                  <MIcon name="cardIcon" size={20} className={on ? 'text-electric-deep' : 'text-slatey'} />
                  <span className="min-w-0 flex-1">
                    <span className="mono block text-[13px] font-bold text-ink">{card.brand} ••• {card.last3}</span>
                    <span className="block truncate text-[12px] text-slatey">{card.holderName}</span>
                  </span>
                  {card.isExpired && <MChip tone="danger">Süresi Doldu</MChip>}
                  {on ? (
                    <MIcon name="check" size={18} className="shrink-0 text-electric-deep" />
                  ) : card.isDefault ? (
                    <MChip tone="success">Varsayılan</MChip>
                  ) : null}
                </button>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-2.5">
          <MField label="AD SOYAD">
            <MInput
              value={holder}
              onChange={(v) => setHolder(upperTR(v))}
              placeholder="Kart üzerindeki isim"
              ariaLabel="Kart sahibi"
              invalid={touched && holderBad}
            />
          </MField>
          <MField label="KART NUMARASI">
            <MInput
              value={digits}
              onChange={(v) => setDigits(v.replace(/\D/g, '').slice(0, 16))}
              type="password"
              placeholder="0000 0000 0000 0000"
              ariaLabel="Kart numarası"
              inputMode="numeric"
              mono
              invalid={touched && numberBad}
              help={`Marka: ${brandOf(digits)} · alan maskelidir`}
            />
          </MField>
          <div className="flex gap-2.5">
            <div className="flex-1">
              <MField label="SKT">
                <MInput
                  value={exp}
                  onChange={(v) => { const d = v.replace(/\D/g, '').slice(0, 4); setExp(d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`); }}
                  placeholder="AA/YY" ariaLabel="Son kullanma tarihi" inputMode="numeric" mono
                  invalid={touched && expBad}
                />
              </MField>
            </div>
            <div className="flex-1">
              <MField label="CVV">
                <MInput
                  value={cvv}
                  onChange={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                  type="password" placeholder="000" ariaLabel="Güvenlik kodu" inputMode="numeric" mono
                  invalid={touched && cvvBad}
                />
              </MField>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-amber">
            Bu bir demodur, gerçek kart bilgisi girmeyin. Tam numara hiçbir yere yazılmaz; yalnızca marka, son 3
            hane ve ad saklanır.
          </p>
        </div>
      )}
    </PhoneOverlay>
  );
}

function SelectionSheet({ c, kind }: { c: Ctx; kind: string }) {
  const [q, setQ] = useState('');

  const items: { id: string; title: string; sub?: string }[] =
    kind === 'category'
      ? TICKET_CATEGORY.map((x) => ({ id: x.id, title: x.label }))
      : kind === 'park'
        ? [{ id: 'none', title: 'Otopark seçmeyeceğim', sub: 'Talep panelde seçili tesise atanır' },
           ...c.world.parks.map((p) => ({ id: String(p.id), title: p.name, sub: p.address }))]
        : [{ id: 'none', title: 'Araç seçmeyeceğim', sub: 'Talep plakasız oluşturulur' },
           ...c.world.vehicles.map((v) => ({ id: v.id, title: prettyPlate(v.plateTxt) })),
           { id: 'manual', title: 'Yeni Plaka Gir', sub: 'Listede olmayan bir araç için' }];

  const formKey = kind === 'category' ? 'sup.cat' : kind === 'park' ? 'sup.park' : 'sup.vehicle';
  const current = c.forms[formKey] ?? '';
  const term = upperTR(q).trim();
  const shown = term ? items.filter((i) => upperTR(`${i.title} ${i.sub ?? ''}`).includes(term)) : items;
  const title = kind === 'category' ? 'Konu / Sorun' : kind === 'park' ? 'Otopark' : 'Araç';

  return (
    <PhoneOverlay title={title} onClose={() => c.nav.sheet(null)}>
      {items.length > 3 && (
        <div className="mb-2.5">
          <MInput
            value={q}
            onChange={setQ}
            placeholder={kind === 'park' ? 'Otopark ara...' : 'Ara...'}
            ariaLabel={`${title} ara`}
          />
        </div>
      )}
      <div className="space-y-1.5">
        {shown.length === 0 && <p className="py-4 text-center text-[13px] text-slatey">Sonuç bulunamadı.</p>}
        {shown.map((i) => {
          const on = i.id === current;
          return (
            <button
              key={`${i.id}-${i.title}`}
              type="button"
              onClick={() => { c.nav.form(formKey, i.id); c.nav.sheet(null); }}
              className={cx(
                'flex w-full items-center gap-3 rounded-[16px] border px-3.5 py-3 text-left transition-colors',
                on ? 'border-electric bg-tint-blue' : 'border-line bg-carbon hover:border-steel'
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-bold text-ink">{i.title}</span>
                {i.sub && <span className="block truncate text-[12px] text-slatey">{i.sub}</span>}
              </span>
              {on && <MIcon name="check" size={16} className="text-electric" />}
            </button>
          );
        })}
      </div>
    </PhoneOverlay>
  );
}

const ATTACH_SOURCES: { id: string; label: string; sub: string; icon: MIconKey; file: string; kb: number }[] = [
  { id: 'cam', label: 'Kameradan Çek', sub: 'Yeni bir fotoğraf çekin', icon: 'camera', file: 'kamera-goruntusu', kb: 1840 },
  { id: 'gal', label: 'Galeriden Seç', sub: 'Cihazınızdaki fotoğraflar', icon: 'image', file: 'galeri-foto', kb: 2360 },
  { id: 'doc', label: 'Belge Seç', sub: 'PDF, Word, Excel veya ZIP', icon: 'doc', file: 'belge', kb: 640 },
];

const ATTACH_MAX_KB = 20 * 1024;

const isImageAtt = (name: string) => /\.(jpg|jpeg|png|heic|webp)$/i.test(name);

function AttachSheet({ c, formKey, max }: { c: Ctx; formKey: string; max: number }) {
  const atts = parseAtt(c.forms[formKey] ?? '');
  const full = atts.length >= max;
  return (
    <PhoneOverlay title="Dosya Ekle" onClose={() => c.nav.sheet(null)}>
      <div className="space-y-1.5">
        {ATTACH_SOURCES.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={full}
            onClick={() => {
              const n = atts.filter((a) => a.name.startsWith(s.file)).length + 1;
              const name = `${s.file}-${n}.${s.id === 'doc' ? 'pdf' : 'jpg'}`;
              const sizeKb = s.kb + n * 40;
              if (sizeKb > ATTACH_MAX_KB) {
                c.nav.notice('Eklediğiniz dosya çok büyük. Daha küçük bir dosya deneyin.', 'danger');
                c.nav.sheet(null);
                return;
              }
              c.nav.form(formKey, [...atts, { name, sizeKb }].map((x) => `${x.name}::${x.sizeKb}`).join('|'));
              c.nav.sheet(null);
            }}
            className={cx(
              'flex w-full items-center gap-3 rounded-[16px] border border-line bg-carbon px-3.5 py-3 text-left transition-colors',
              full ? 'cursor-not-allowed opacity-55' : 'hover:border-electric'
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-tint-blue text-electric-deep">
              <MIcon name={s.icon} size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold text-ink">{s.label}</span>
              <span className="block truncate text-[12px] text-slatey">{s.sub}</span>
            </span>
            <MIcon name="chevron-right" size={15} className="text-slatey" />
          </button>
        ))}
      </div>
      {full && (
        <p className="mt-2.5 text-[12px] font-semibold text-amber">
          En fazla {max} dosya ekleyebilirsiniz. Yeni bir dosya için önce mevcut eklerden birini kaldırın.
        </p>
      )}
      <p className="mt-2.5 text-[11px] leading-relaxed text-slatey">
        Demo ikizinde gerçek dosya yüklenmez; seçtiğiniz kaynağa uygun örnek bir dosya adı ve boyutu eklenir.
      </p>
    </PhoneOverlay>
  );
}

function PreviewSheet({ c, name }: { c: Ctx; name: string }) {
  const image = isImageAtt(name);
  return (
    <PhoneOverlay title={name} onClose={() => c.nav.sheet(null)} align="center">
      {image ? (
        <>
          <div
            className="flex aspect-square w-full items-center justify-center rounded-[18px] border border-line"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--color-anthracite) 0%, var(--color-graphite) 55%, var(--color-anthracite) 100%)',
            }}
          >
            <span className="flex flex-col items-center gap-2 text-slatey">
              <MIcon name="image" size={44} />
              <span className="text-[12px] font-bold">Örnek görsel</span>
            </span>
          </div>
          <p className="mt-2.5 text-center text-[12px] leading-relaxed text-slatey">
            Demo ikizinde gerçek bir dosya yüklenmediği için görsel temsilî çizilir.
          </p>
        </>
      ) : (
        <div className="flex items-center gap-3 rounded-[18px] border border-line bg-anthracite px-3.5 py-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-tint-blue text-electric-deep">
            <MIcon name="doc" size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-bold text-ink">{name}</span>
            <span className="block text-[12px] text-slatey">Belge, cihazın varsayılan uygulamasında açılır.</span>
          </span>
        </div>
      )}
      <div className="mt-3">
        <MButton variant="outline" onClick={() => c.nav.sheet(null)}>Kapat</MButton>
      </div>
    </PhoneOverlay>
  );
}

function AttachStrip({
  c, atts, onRemove, onAdd, max,
}: { c: Ctx; atts: { name: string; sizeKb: number }[]; onRemove?: (name: string) => void; onAdd?: () => void; max?: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {atts.map((a) => {
        const img = isImageAtt(a.name);
        return (
          <span key={a.name} className="relative inline-flex">
            <button
              type="button"
              onClick={() => c.nav.sheet('preview', { name: a.name })}
              aria-label={img ? 'Görseli büyüt' : 'Dosyayı aç'}
              className="inline-flex max-w-[168px] items-center gap-1.5 rounded-[12px] border border-line bg-anthracite py-1.5 pr-6 pl-2.5 text-[11px] font-semibold text-ash transition-colors hover:border-electric"
            >
              <MIcon name={img ? 'image' : 'doc'} size={12} className="shrink-0 text-electric-deep" />
              <span className="truncate">{a.name}</span>
              <span className="shrink-0 text-slatey">· {formatInt(a.sizeKb)} KB</span>
              <MIcon name="expand" size={11} className="shrink-0 text-slatey" />
            </button>
            {onRemove && (
              <button
                type="button"
                aria-label={`${a.name} ekini kaldır`}
                onClick={() => onRemove(a.name)}
                className="absolute top-[3px] right-[3px] flex h-4 w-4 items-center justify-center rounded-full bg-alert text-carbon"
              >
                <MIcon name="x" size={10} />
              </button>
            )}
          </span>
        );
      })}
      {onAdd && (max === undefined || atts.length < max) && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-[12px] border border-dashed border-steel px-2.5 py-1.5 text-[11px] font-bold text-slatey transition-colors hover:border-electric hover:text-electric-deep"
        >
          <MIcon name="plus" size={12} /> Ek Ekle
        </button>
      )}
    </div>
  );
}

function ConfirmSheet({ c, params }: { c: Ctx; params: Record<string, string> }) {
  const dispatch = usePanelDispatch();
  const run = () => {
    const id = params.id ?? '';
    switch (params.act) {
      case 'membership-cancel':
        dispatch({ type: 'MEMBERSHIP_CANCEL', id, reason: 'Mobil uygulamadan iptal edildi.' });
        c.nav.sheet(null);
        c.nav.pop();
        return;
      case 'vehicle-remove': dispatch({ type: 'MOBILE_REMOVE_VEHICLE', id }); break;
      case 'card-delete': dispatch({ type: 'MOBILE_DELETE_CARD', id }); break;
      case 'notifications-off': dispatch({ type: 'MOBILE_TOGGLE_NOTIFICATIONS' }); break;
      case 'logout': dispatch({ type: 'MOBILE_LOGOUT' }); return;
      case 'reset': dispatch({ type: 'MOBILE_RESET' }); return;
      default: break;
    }
    c.nav.sheet(null);
  };

  return (
    <PhoneOverlay title={params.title ?? 'Onay'} onClose={() => c.nav.sheet(null)} align="center">
      <p className="text-[13px] leading-relaxed text-ash">{params.msg}</p>
      <div className="mt-4 flex gap-2">
        <MButton variant="outline" onClick={() => c.nav.sheet(null)}>Vazgeç</MButton>
        <MButton variant="danger" onClick={run}>{params.ok ?? 'Onayla'}</MButton>
      </div>
    </PhoneOverlay>
  );
}

function LegalSheet({ c, title }: { c: Ctx; title: string }) {
  return (
    <PhoneOverlay title={title} onClose={() => c.nav.sheet(null)}>
      <p className="text-[13px] leading-relaxed text-ash">
        Bu başlık, uygulamanın kişisel veri, gizlilik ve ödeme koşullarına ilişkin metnini açar. Gerçek uygulamada
        belge, uygulama içi tarayıcıda yalnızca markanın kendi https adresinden yüklenir; başka adresler engellenir.
      </p>
      <p className="mt-2.5 text-[13px] leading-relaxed text-ash">
        Bu demo ikizinde yürürlükteki metin yüklenmez. Güncel metin için:{' '}
        <span className="font-bold text-ink">{corporate.email}</span>
      </p>
    </PhoneOverlay>
  );
}

const TITLES: Record<MobileRouteName, string> = {
  login: 'Giriş',
  parkings: 'Otoparklar',
  'parking-detail': 'Otopark Detayı',
  debts: 'Borç Sorgula',
  'debt-result': 'Borç Bilgisi',
  'debt-pay': 'Borç Ödeme',
  subscriptions: 'Abonelik Al',
  'subscription-detail': 'Abonelik Detayı',
  'buy-membership': 'Abonelik Al',
  vehicles: 'Araçlarım',
  'add-vehicle': 'Yeni Araç Ekle',
  cards: 'Kayıtlı Kartlarım',
  'add-card': 'Kart Ekle',
  support: 'Destek Talepleri',
  'support-detail': 'Talep Detayı',
  'new-support': 'Destek Talebi Oluştur',
  'payment-history': 'Ödeme Geçmişi',
  profile: 'Profil',
  contact: 'İletişim & Yasal',
};

const TAB_ROOT: Record<MobileTab, MobileRouteName> = {
  parkings: 'parkings', subscriptions: 'subscriptions', debts: 'debts', profile: 'profile',
};

function ScreenBody({ c, route }: { c: Ctx; route: MobileRoute }) {
  const p = route.params ?? {};
  switch (route.name) {
    case 'parkings': return <ParkingsScreen c={c} />;
    case 'parking-detail': return <ParkingDetailScreen c={c} parkId={Number(p.parkId ?? 1)} />;
    case 'debts': return <DebtsScreen c={c} initialPlate={p.plate ?? ''} />;
    case 'debt-result': return <DebtResultScreen c={c} plate={p.plate ?? ''} />;
    case 'debt-pay': return <DebtPayScreen c={c} ids={(p.ids ?? '').split(',').filter(Boolean)} plate={p.plate ?? ''} />;
    case 'subscriptions':
      return p.view === 'mine' ? <MySubscriptionsScreen c={c} /> : <SubscriptionsScreen c={c} />;
    case 'buy-membership': return <BuyMembershipScreen c={c} parkId={Number(p.parkId ?? 1)} />;
    case 'subscription-detail': return <SubscriptionDetailScreen c={c} id={p.id ?? ''} />;
    case 'payment-history': return <PaymentHistoryScreen c={c} id={p.id ?? ''} />;
    case 'vehicles': return <VehiclesScreen c={c} />;
    case 'add-vehicle': return <AddVehicleScreen c={c} />;
    case 'cards': return <CardsScreen c={c} />;

    case 'add-card': return <CardsScreen c={c} />;
    case 'support': return <SupportScreen c={c} />;
    case 'support-detail': return <SupportDetailScreen c={c} id={p.id ?? ''} />;
    case 'new-support': return <NewSupportScreen c={c} />;
    case 'profile': return <ProfileScreen c={c} />;
    case 'contact': return <ContactScreen c={c} />;
    case 'login':
    default: return <LoginScreen c={c} />;
  }
}

/** `bare` draws only the screen (no bezel, side buttons or notch) so a device mockup can supply the frame. */
function Phone({ c, bare = false }: { c: Ctx; bare?: boolean }) {
  const state = usePanelState();
  const dispatch = usePanelDispatch();
  const m = state.mobile;
  const route: MobileRoute = m.stack[m.stack.length - 1] ?? { name: TAB_ROOT[m.tab] };
  const depth = Math.max(1, m.stack.length);
  const isRoot = depth === 1;
  const sheet = m.sheet;

  const rightAction: { label: string; run: () => void } | null =
    route.name === 'vehicles' ? { label: 'Ekle', run: () => c.nav.push({ name: 'add-vehicle' }) }
      : route.name === 'cards' ? { label: 'Kart Ekle', run: () => c.nav.sheet('card', CARD_REGISTER_SHEET) }
        : route.name === 'support' ? { label: 'Yeni Talep', run: () => c.nav.push({ name: 'new-support' }) }

          : route.name === 'subscriptions' && route.params?.view === 'mine'
            ? { label: 'Yeni Abonelik', run: () => c.nav.tab('subscriptions') }
            : null;

  const cardTarget = sheet?.kind === 'card' ? (sheet.params?.target ?? 'pay.cardId') : '';

  return (

    <div
      className={bare ? 'app-phone relative h-full w-full' : 'app-phone relative shrink-0 rounded-[2.6rem] border border-steel/60 bg-ink p-[13px] shadow-2xl'}
      style={bare ? undefined : { width: 416, height: 870 }}
    >
      {bare ? null : (
        <>
          <span aria-hidden className="absolute top-[150px] -left-[3px] h-[52px] w-[3px] rounded-l bg-ink" />
          <span aria-hidden className="absolute top-[215px] -left-[3px] h-[52px] w-[3px] rounded-l bg-ink" />
          <span aria-hidden className="absolute top-[180px] -right-[3px] h-[74px] w-[3px] rounded-r bg-ink" />
        </>
      )}

      <div className={`relative flex h-full w-full flex-col overflow-hidden bg-carbon ${bare ? '' : 'rounded-[2.05rem]'}`}>
        <StatusBar notch={!bare} />

        {m.authed && !isRoot ? (
          <StackHeader
            title={
              route.name === 'subscriptions' && route.params?.view === 'mine'
                ? 'Aboneliklerim'

                : (route.name === 'buy-membership' && m.forms['mem.step'] === 'done') ||
                  (route.name === 'debt-pay' && m.forms['pay.phase'] === 'ok')
                  ? 'Ödeme Başarılı'
                  : (route.name === 'buy-membership' && m.forms['mem.step'] === 'fail') ||
                    (route.name === 'debt-pay' && m.forms['pay.phase'] === 'fail')
                    ? 'Ödeme Başarısız'
                    : TITLES[route.name]
            }
            onBack={() => c.nav.pop()}
            rightLabel={rightAction?.label}
            onRight={rightAction?.run}
          />
        ) : (
          <BrandedHeader />
        )}

        <div className="min-h-0 flex-1 overflow-y-auto bg-void">
          {m.authed ? (
            <ScreenBody
              key={`${depth}:${route.name}:${JSON.stringify(route.params ?? {})}`}
              c={c}
              route={route}
            />
          ) : (
            <LoginScreen c={c} />
          )}
        </div>

        {}
        {m.authed && (isRoot || route.name === 'parking-detail') && (
          <TabBar
            tab={m.tab}
            hintTab={!sheet && hintPhase(m.forms) === 'tabs' ? 'subscriptions' : null}
            onSelect={(t) => {
              if (hintPhase(m.forms) === 'tabs') c.nav.form('hint', 'done');
              c.nav.tab(t);
            }}
          />
        )}

        {/* Home indicator */}
        <div className="flex h-[18px] shrink-0 items-center justify-center bg-carbon">
          <span aria-hidden className="h-[4px] w-[120px] rounded-full bg-graphite" />
        </div>

        {m.notice && (
          <NoticeBanner text={m.notice.text} tone={m.notice.tone} onClose={() => dispatch({ type: 'MOBILE_NOTICE', text: null })} />
        )}

        {sheet?.kind === 'parking' && (
          <PhoneOverlay title="Otopark Detayı" onClose={() => c.nav.sheet(null)}>
            <div className="space-y-3">
              {(() => {
                const park = c.world.parks.find((p) => p.id === Number(sheet.params?.parkId ?? 1));
                return park ? <ParkingBody c={c} park={park} /> : <MEmpty title="Otopark bulunamadı" />;
              })()}
            </div>
          </PhoneOverlay>
        )}
        {sheet?.kind === 'card' && (
          <CardPaymentSheet
            c={c}
            target={cardTarget}
            membershipId={sheet.params?.id}
            currentRoute={route}
            title={sheet.params?.title ?? 'Ödeme Kartı Seçin'}
            amountLabel={sheet.params?.amountLabel ?? formatTL(Number(sheet.params?.amount ?? 0))}
            confirmLabel={sheet.params?.confirm ?? 'Kartı Seç ve Devam Et'}
            sessionId={sheet.params?.session}
            hideSaved={sheet.params?.hideSaved === '1'}
          />
        )}
        {sheet?.kind === 'select' && <SelectionSheet c={c} kind={sheet.params?.kind ?? 'category'} />}
        {sheet?.kind === 'attach' && (
          <AttachSheet c={c} formKey={sheet.params?.key ?? 'sup.att'} max={Number(sheet.params?.max ?? 5)} />
        )}
        {sheet?.kind === 'preview' && <PreviewSheet c={c} name={sheet.params?.name ?? ''} />}
        {sheet?.kind === 'confirm' && <ConfirmSheet c={c} params={sheet.params ?? {}} />}
        {sheet?.kind === 'legal' && <LegalSheet c={c} title={sheet.params?.title ?? 'Yasal Metin'} />}
      </div>
    </div>
  );
}

const MODULE_TAB: Partial<Record<ModuleId, string>> = {
  payments: 'payments', memberships: 'list', support: 'all', sessions: 'all',
};

function bridgeTerm(world: DemoWorld, rec: BridgeRecord): string | null {
  if (!rec.targetId) return null;
  const s = world.sessions.find((x) => x.id === rec.targetId);
  if (s) return s.plateTxt;
  const m = world.memberships.find((x) => x.id === rec.targetId);
  if (m) return m.plateTxt;
  const t = world.tickets.find((x) => x.id === rec.targetId);
  if (t) return t.subject;
  return rec.targetId;
}

interface Shortcut {
  id: string;
  label: string;
  desc: string;
  icon: MIconKey;
  run: () => void;
}

type PhoneScale = 0.75 | 1 | 1.25;

const PHONE_SCALES: { value: PhoneScale; label: string; hint: string }[] = [
  { value: 0.75, label: 'Dar ekran', hint: 'Telefonda yatay kaydırmadan sığar' },
  { value: 1, label: 'Gerçek cihaz ölçüsü', hint: '416 × 870 piksel' },
  { value: 1.25, label: 'Büyütülmüş', hint: 'Sunum için' },
];

function IntroPanel({ shortcuts }: { shortcuts: Shortcut[] }) {
  return (
    <div className="space-y-3">
      <Card title="Bu ne?" subtitle="Gerçek ParkBiz mobil uygulamasının etkileşimli ikizi">
        <p className="text-[0.74rem] leading-relaxed text-ash">
          Sağdaki telefon, sahadaki sürücünün kullandığı uygulamanın aynısıdır: otopark bulma, plakadan borç
          sorgulama ve ödeme, abonelik satın alma, araç ve kart yönetimi, destek talebi. Telefon üzerinde
          yaptığınız <b className="text-ink">her işlem panelin aynı veri kümesine yazar</b> — ödeme Tahsilat&apos;a,
          abonelik Abonelikler&apos;e, talep Destek&apos;e düşer.
        </p>
        <div className="mt-3">
          <Notice tone="warning" icon="info" title="Gerçek panelde bu sekme yoktur">
            Bu sekme, panel ↔ mobil bağını göstermek için eklenmiş bir demo ekidir. Tüm kayıtlar uydurma örnek
            veridir; gerçek kart bilgisi girmeyin.
          </Notice>
        </div>
      </Card>

      <Card title="Hangi akışı deneyebilirsiniz?" subtitle="Tıklayın — telefon o adıma gider">
        <div className="space-y-1.5">
          {shortcuts.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={s.run}
              className="flex w-full items-start gap-2.5 rounded-lg border border-steel/45 bg-carbon/60 px-3 py-2.5 text-left transition-colors hover:border-electric/55"
            >
              <span className="mt-0.5 text-electric">
                <MIcon name={s.icon} size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.76rem] font-semibold text-ink">{s.label}</span>
                <span className="block text-[0.66rem] leading-relaxed text-slatey">{s.desc}</span>
              </span>
              <Icon name="chevron-right" size={14} className="mt-1 text-slatey" />
            </button>
          ))}
        </div>
      </Card>

      <Card title="Bilerek bırakılan gerçekçi ayrıntılar">
        <ul className="space-y-1.5 text-[0.7rem] leading-relaxed text-ash">
          <li>· <b className="text-ink">Süresi dolmuş kart</b> (Troy ••••789) ile ödeme bilinçli olarak reddedilir; başarısız ekranı ve &laquo;Ne yapabilirsiniz?&raquo; ipuçları görünür.</li>
          <li>· <b className="text-ink">Abonelik kotası</b> hem panelde hem telefonda aynı sayıdan beslenir; satın alma kotayı düşürür.</li>
          <li>· <b className="text-ink">Kapalı/çözülmüş talepte</b> yanıt alanı kilitlidir — gerekçesi ekranda yazar.</li>
          <li>· <b className="text-ink">Fiyat tarifesi</b> paneldeki aynı tarife satırlarından okunur, ayrı bir liste yoktur.</li>
        </ul>
      </Card>
    </div>
  );
}

function BridgePanel({
  bridge, world, epochMs, nowMin, onOpen, onResetPhone, scale, onScale,
}: {
  bridge: BridgeRecord[]; world: DemoWorld; epochMs: number; nowMin: number;
  onOpen: (rec: BridgeRecord) => void; onResetPhone: () => void;
  scale: PhoneScale; onScale: (s: PhoneScale) => void;
}) {
  return (
    <div className="space-y-3">
      <Card
        title="Canlı köprü"
        subtitle="Mobilde yapılan işlem panelde nereye düştü?"
        actions={<Badge tone="info" icon="bolt">{bridge.length}</Badge>}
      >
        {bridge.length === 0 ? (
          <p className="text-[0.72rem] leading-relaxed text-slatey">
            Henüz işlem yok. Soldaki kısayollardan bir akış başlatın; borç ödeme, abonelik satın alma, araç/kart
            ekleme ve destek talebi buraya satır olarak düşer.
          </p>
        ) : (
          <ol className="space-y-1.5">
            {bridge.map((rec) => (
              <li key={rec.id}>
                <button
                  type="button"
                  onClick={() => onOpen(rec)}
                  className="flex w-full items-start gap-2.5 rounded-lg border border-steel/45 bg-carbon/60 px-3 py-2.5 text-left transition-colors hover:border-electric/55"
                >
                  <StatusDot tone="success" className="mt-1.5" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.74rem] font-semibold text-ink">{rec.label}</span>
                    <span className="block text-[0.66rem] leading-relaxed text-slatey">{rec.detail}</span>
                    <span className="mono mt-0.5 block text-[0.6rem] text-slatey">
                      {formatRelative(nowMin, rec.atMin)} · {formatTime(epochMs, rec.atMin)}
                      {bridgeTerm(world, rec) ? ` · ${bridgeTerm(world, rec)}` : ''}
                    </span>
                  </span>
                  <Icon name="arrow-right" size={14} className="mt-1 text-electric" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <Card title="Telefon kontrolleri">
        <SectionTitle hint="layout bozulmaz">Ölçek</SectionTitle>
        <div role="group" aria-label="Telefon ölçeği" className="flex flex-wrap gap-1.5">
          {PHONE_SCALES.map((s) => (
            <Button
              key={s.value}
              size="sm"
              variant={scale === s.value ? 'primary' : 'ghost'}
              active={scale === s.value}
              title={s.hint}
              onClick={() => onScale(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
        <div className="mt-3">
          <Button size="sm" variant="danger" icon="refresh" onClick={onResetPhone}>
            Telefonu sıfırla
          </Button>
        </div>
        <p className="mt-2 text-[0.64rem] leading-relaxed text-slatey">
          Sıfırlama yalnızca telefon oturumunu başlangıç durumuna döndürür; panele düşen ödeme, abonelik ve
          talep kayıtları silinmez — gerçek hayatta da silinmez.
        </p>
      </Card>
    </div>
  );
}

function useMobileRuntime() {
  const state = usePanelState();
  const dispatch = usePanelDispatch();
  const nav = useNav();
  const m = state.mobile;

  const noticeText = m.notice?.text ?? null;
  useEffect(() => {
    if (!noticeText) return;
    const id = setTimeout(() => dispatch({ type: 'MOBILE_NOTICE', text: null }), 5000);
    return () => clearTimeout(id);
  }, [noticeText, dispatch]);

  const c: Ctx = useMemo(
    () => ({
      world: state.world,
      epochMs: state.epochMs,
      nowMin: state.nowMin,
      forms: m.forms,
      nav,
      panelParkId: state.parkId,
    }),
    [state.world, state.epochMs, state.nowMin, m.forms, nav, state.parkId]
  );

  return { state, dispatch, nav, m, c };
}

/** The app screen only (390×844), for placing inside a device mockup. */
export function MobileScreen() {
  const { c } = useMobileRuntime();
  return <Phone c={c} bare />;
}

export function MobilePhone({ scale = 1 }: { scale?: number }) {
  const { c } = useMobileRuntime();
  return (
    <div style={{ width: r2(416 * scale), height: r2(870 * scale) }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <Phone c={c} />
      </div>
    </div>
  );
}

export default function MobileApp() {
  const helpers = usePanelHelpers();
  const { state, dispatch, nav, m, c } = useMobileRuntime();

  const scaleTouched = useRef(false);
  useEffect(() => {
    if (scaleTouched.current) return;
    scaleTouched.current = true;
    if (typeof window === 'undefined') return;

    if (window.innerWidth < 460) dispatch({ type: 'MOBILE_SET_SCALE', scale: 0.75 });
  }, [dispatch]);

  const debtPlate = useMemo(() => {
    const debts = selectDebts(state.world, ALL_PARKS_ID);
    const own = state.world.vehicles.find((v) => debts.some((d) => plateKey(d.plateTxt) === plateKey(v.plateTxt)));
    return own?.plateTxt ?? debts[0]?.plateTxt ?? state.world.vehicles[0]?.plateTxt ?? '';
  }, [state.world]);

  const ensureAuth = useCallback(() => {
    if (!m.authed) dispatch({ type: 'MOBILE_LOGIN' });
  }, [m.authed, dispatch]);

  const shortcuts: Shortcut[] = useMemo(
    () => [
      {
        id: 'debt', icon: 'wallet',
        label: 'Borç öde akışını başlat',
        desc: 'Plaka sorgula → borç kartı → kart seç → 3DS → Tahsilat modülüne düşsün',
        run: () => {
          ensureAuth();
          nav.tab('debts');
          nav.reset({ name: 'debts', params: { plate: normalizePlate(debtPlate) } });
        },
      },
      {
        id: 'mem', icon: 'star',
        label: 'Abonelik satın al',
        desc: 'Araç + paket seç → kurumsal fatura → ödeme → Abonelikler listesine düşsün',
        run: () => {
          ensureAuth();
          nav.tab('subscriptions');
          nav.clearForms(['mem.step', 'mem.vehicleId', 'mem.packageId', 'mem.cardId', 'mem.err']);
          nav.push({ name: 'buy-membership', params: { parkId: '1' } });
        },
      },
      {
        id: 'veh', icon: 'car',
        label: 'Araç ekle',
        desc: 'Canlı TR plaka görseli, en az 6 karakter ve çift plaka doğrulaması',
        run: () => { ensureAuth(); nav.tab('profile'); nav.push({ name: 'vehicles' }); nav.push({ name: 'add-vehicle' }); },
      },
      {
        id: 'card', icon: 'cardIcon',
        label: 'Kart ekle',
        desc: 'Kayıtlı Kartlarım > Kart Ekle sayfa içi sheet\'i açar; numara maskeli — yalnızca son 3 hane saklanır',
        run: () => { ensureAuth(); nav.tab('profile'); nav.push({ name: 'cards' }); nav.sheet('card', CARD_REGISTER_SHEET); },
      },
      {
        id: 'sup', icon: 'ticket',
        label: 'Destek talebi aç',
        desc: 'Konu/otopark/araç seç, ek ekle → Destek modülüne kaynak “mobil” olarak düşsün',
        run: () => { ensureAuth(); nav.tab('profile'); nav.push({ name: 'support' }); nav.push({ name: 'new-support' }); },
      },
      {
        id: 'mine', icon: 'list',
        label: 'Aboneliklerimi gör',
        desc: 'Kalan gün çubuğu, otomatik yenileme anahtarı, iptal ve ödeme geçmişi',

        run: () => { ensureAuth(); nav.tab('profile'); nav.push({ name: 'subscriptions', params: { view: 'mine' } }); },
      },
    ],
    [ensureAuth, nav, debtPlate]
  );

  const openBridge = useCallback(
    (rec: BridgeRecord) => {
      if (rec.targetModule === 'mobile') {
        ensureAuth();
        nav.tab('profile');
        nav.push({ name: 'vehicles' });
        return;
      }
      const tab = MODULE_TAB[rec.targetModule];
      dispatch({ type: 'SET_MODULE', module: rec.targetModule, tab });
      const term = bridgeTerm(state.world, rec);
      if (term) dispatch({ type: 'SET_SEARCH', module: rec.targetModule, search: term });

      if (rec.targetModule === 'memberships' && rec.targetId) {
        dispatch({ type: 'SET_FILTER', module: 'memberships', key: 'focus', value: rec.targetId });
      }
      helpers.toast('Panelde açıldı', `${rec.label} — ilgili kayıt arandı.`, 'info', 3500);
    },
    [dispatch, helpers, nav, ensureAuth, state.world]
  );

  return (
    <IdleGuard as="section" className="space-y-4">
      {}
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="info" icon="mobile">ParkBiz mobil uygulaması · etkileşimli ikiz</Badge>
        <span className="ml-auto"><DemoBadge /></span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(260px,1fr)_auto_minmax(260px,1fr)]">
        <IntroPanel shortcuts={shortcuts} />

        <div className="flex justify-center overflow-x-auto">
          <div style={{ width: r2(416 * m.scale), height: r2(870 * m.scale) }}>
            <div style={{ transform: `scale(${m.scale})`, transformOrigin: 'top left' }}>
              <Phone c={c} />
            </div>
          </div>
        </div>

        <BridgePanel
          bridge={m.bridge}
          world={state.world}
          epochMs={state.epochMs}
          nowMin={state.nowMin}
          onOpen={openBridge}
          onResetPhone={() => dispatch({ type: 'MOBILE_RESET' })}
          scale={m.scale}
          onScale={(s) => dispatch({ type: 'MOBILE_SET_SCALE', scale: s })}
        />
      </div>
    </IdleGuard>
  );
}
