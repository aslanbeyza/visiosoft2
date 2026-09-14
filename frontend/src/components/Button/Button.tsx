import { Link } from 'react-router-dom'
import type { MouseEventHandler, ReactNode } from 'react'
import { buttonCopy } from './buttonCopy.ts'
import styles from './Button.module.css'

type ButtonProps = {
  to?: string
  href?: string
  children: ReactNode
  /**
   * primary: lacivert dolgu · secondary: beyaz, çerçeveli · light: koyu zeminde beyaz dolgu ·
   * outlineLight: koyu zeminde çerçeveli. `ghost` eski adıdır, secondary ile aynıdır.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'light' | 'outlineLight'
  size?: 'md' | 'lg'
  /** Metnin sağında ok ikonu gösterir. */
  arrow?: boolean
  /** href bağlantısını yeni sekmede açar; ekran okuyucu için görünmez "(yeni sekmede açılır)" eklenir. */
  external?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export default function Button({
  to,
  href,
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  external = false,
  type = 'button',
  disabled,
  className = '',
  onClick,
}: ButtonProps) {
  const classes = [styles.button, styles[variant === 'ghost' ? 'secondary' : variant], size === 'lg' ? styles.lg : '', className]
    .filter(Boolean)
    .join(' ')
  const content = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {content}
        {external ? <span className="sr-only"> {buttonCopy.newTab}</span> : null}
      </a>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  )
}
