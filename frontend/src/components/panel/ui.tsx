
import { type ReactNode } from 'react';
import './panel-theme.css';
import { upperTR } from '@/lib/text';
import type { IconKey, Tone } from '@/lib/panelDemo';

export const APP_ROOT = 'app-phone';

export const TONE_TEXT: Record<Tone, string> = {
  neutral: 'text-ash',
  info: 'text-electric',
  success: 'text-neon',
  warning: 'text-amber',
  danger: 'text-alert',
  accent: 'text-plasma',
};

export const TONE_BADGE: Record<Tone, string> = {
  neutral: 'zone-badge zone-badge--neutral',
  info: 'zone-badge zone-badge--info',
  success: 'zone-badge zone-badge--success',
  warning: 'zone-badge zone-badge--warning',
  danger: 'zone-badge zone-badge--danger',
  accent: 'zone-badge zone-badge--accent',
};

export const TONE_DOT: Record<Tone, string> = {
  neutral: 'bg-slatey',
  info: 'bg-electric',
  success: 'bg-neon',
  warning: 'bg-amber',
  danger: 'bg-alert',
  accent: 'bg-plasma',
};

export const TONE_BAR: Record<Tone, string> = {
  neutral: 'bg-fog',
  info: 'bg-electric',
  success: 'bg-neon',
  warning: 'bg-amber',
  danger: 'bg-alert',
  accent: 'bg-plasma',
};

export const cx = (...parts: (string | false | null | undefined)[]): string =>
  parts.filter(Boolean).join(' ');

const ICON_PATHS: Record<IconKey, string> = {
  check: 'M4 12.5l5 5L20 6.5',
  clock: 'M12 7v5l3.2 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  x: 'M6 6l12 12M18 6 6 18',
  star: 'm12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8z',
  shield: 'M12 3.2 4.8 6v6c0 4.4 3 7.6 7.2 8.8 4.2-1.2 7.2-4.4 7.2-8.8V6z',
  ban: 'M5.6 5.6l12.8 12.8M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  alert: 'M12 9v4.5M12 17h.01M10.3 3.9 2.6 17.4a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  gift: 'M20 12v8H4v-8M2 8h20v4H2zM12 8v12M12 8S9.5 3.5 7 5s1 3 5 3zM12 8s2.5-4.5 5-3-1 3-5 3z',
  edit: 'M4 20h4L20 8l-4-4L4 16zM14.5 5.5 18.5 9.5',
  money: 'M3 6h18v12H3zM12 14.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4ZM6.5 9v.01M17.5 15v.01',
  car: 'M5 17h14M4 13l1.6-4.6A2 2 0 0 1 7.5 7h9a2 2 0 0 1 1.9 1.4L20 13v4.5h-3V17H7v.5H4zM7.5 15h.01M16.5 15h.01',
  camera: 'M4 8h3l1.4-2h7.2L17 8h3v11H4zM12 16.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z',
  barrier: 'M4 8h2v12H4zM6 9.5 21 6M6 13.5 21 10M4 20h16',
  device: 'M4 5h16v10H4zM8 19h8M10 15v4M14 15v4',
  user: 'M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0',
  ticket: 'M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4zM12 7v2M12 11v2M12 15v2',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  home: 'M4 11 12 4l8 7v9H4zM10 20v-6h4v6',
  mobile: 'M7 3h10v18H7zM11 18.5h2',
  wallet: 'M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7a2 2 0 0 1 2-2h11M17 13h.01',
  refresh: 'M20 11a8 8 0 1 0-2.3 6M20 5v6h-6',
  download: 'M12 3v12M7 11l5 5 5-5M4 20h16',
  upload: 'M12 20V8M7 12l5-5 5 5M4 4h16',
  filter: 'M3 5h18l-7 8v6l-4 2v-8z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM16 16l5 5',
  plus: 'M12 5v14M5 12h14',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5',
  eye: 'M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Zm10 2.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z',
  play: 'M7 4.5 19 12 7 19.5z',
  pause: 'M8 5h3v14H8zM13 5h3v14h-3z',
  pin: 'M12 3v7M8 10h8l1.5 4h-11zM12 14v7',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  print: 'M7 8V3h10v5M7 18H4V8h16v10h-3M7 14h10v7H7z',
  bell: 'M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9ZM10 18.5a2 2 0 0 0 4 0',
  cog: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM12 2.5l1.3 2.6 2.9-.5.6 2.9 2.6 1.4-1.5 2.5 1.5 2.5-2.6 1.4-.6 2.9-2.9-.5L12 21.5l-1.3-2.6-2.9.5-.6-2.9-2.6-1.4L6.1 12 4.6 9.5l2.6-1.4.6-2.9 2.9.5z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  flag: 'M5 21V4M5 5h12l-2 3.5L17 12H5',
  wrench: 'M14.5 4.5a4.5 4.5 0 0 0 5.6 5.9L21 11l-8.5 8.5a2.5 2.5 0 1 1-3.5-3.5L17.5 7.5z',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
  map: 'M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20zM9 4v13.5M15 6.5V20',
  bolt: 'M13 3 5 14h6l-1 7 8-11h-6z',
  info: 'M12 11v6M12 7.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  'chevron-down': 'm6 9 6 6 6-6',
  'chevron-right': 'm9 6 6 6-6 6',
  'chevron-left': 'm15 6-6 6 6 6',
  'arrow-up': 'M12 20V5M6 11l6-6 6 6',
  'arrow-down': 'M12 4v15M6 13l6 6 6-6',
  'arrow-right': 'M4 12h15M13 6l6 6-6 6',
  'arrow-left': 'M20 12H5M11 6l-6 6 6 6',
  sort: 'M8 8 5 5 2 8M5 5v14M16 16l3 3 3-3M19 19V5',
  menu: 'M4 7h16M4 12h16M4 17h16',
  signal: 'M4 20v-4M9 20v-8M14 20v-12M19 20V4',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5z',
};

export function Icon({
  name,
  size = 16,
  className,
  title,
}: {
  name: IconKey;
  size?: number;
  className?: string;
  title?: string;
}) {
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
      className={cx('shrink-0', className)}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      vectorEffect="non-scaling-stroke"
    >
      {title ? <title>{title}</title> : null}
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

export function StatusDot({ tone = 'neutral', pulse = false, className }: { tone?: Tone; pulse?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx('inline-block h-[7px] w-[7px] rounded-full', TONE_DOT[tone], pulse && 'pulse-dot', className)}
    />
  );
}

export function Card({ children, className }: { title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; children?: ReactNode; className?: string; bodyClassName?: string; padded?: boolean; id?: string }) {
  return <div className={className}>{children}</div>;
}
export function Badge({ children, className }: { tone?: Tone; icon?: IconKey; children: ReactNode; size?: 'sm' | 'md'; className?: string }) {
  return <span className={className}>{children}</span>;
}
export function Button({ children, onClick, className, disabled, type = 'button', ariaLabel, title }: {
  children?: ReactNode; onClick?: () => void; variant?: string; size?: string; icon?: IconKey; iconRight?: IconKey;
  disabled?: boolean; title?: string; active?: boolean; type?: 'button' | 'submit'; className?: string; ariaLabel?: string; full?: boolean;
}) {
  return <button type={type} onClick={onClick} disabled={disabled} className={className} aria-label={ariaLabel} title={title}>{children}</button>;
}
export function SectionTitle({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return <div><h4>{typeof children === 'string' ? upperTR(children) : children}</h4>{hint}</div>;
}
export function Notice({ children, title }: { tone?: Tone; icon?: IconKey; title?: ReactNode; children?: ReactNode }) {
  return <div>{title}{children}</div>;
}
export function DemoBadge({ className }: { className?: string; compact?: boolean }) {
  return <span className={className}>DEMO</span>;
}
export function IdleGuard({ children, className, as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' }) {
  return <Tag className={className}>{children}</Tag>;
}
