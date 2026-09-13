import { useLocale } from '../../hooks/useLocale/index.ts'
import styles from './WhatsAppButton.module.css'

export default function WhatsAppButton() {
  const { t, config } = useLocale()
  const id = config?.whatsapp_wa_id || '905015045034'
  const text = encodeURIComponent(t('whatsapp_message'))

  return (
    <a
      className={styles.button}
      href={`https://wa.me/${id}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
        <path d="M12.04 2.5A9.45 9.45 0 0 0 2.6 11.9a9.3 9.3 0 0 0 1.27 4.7L2.5 21.5l5.05-1.32a9.5 9.5 0 0 0 4.49 1.14h.04A9.46 9.46 0 0 0 21.5 12 9.48 9.48 0 0 0 12.04 2.5Zm0 17.3h-.03a7.86 7.86 0 0 1-4-1.1l-.29-.17-3 .78.8-2.9-.18-.3a7.83 7.83 0 0 1-1.2-4.2 7.9 7.9 0 0 1 7.92-7.86 7.9 7.9 0 0 1 7.9 7.88 7.9 7.9 0 0 1-7.92 7.87Zm4.33-5.9c-.24-.12-1.4-.69-1.62-.77s-.37-.12-.53.12-.61.77-.75.93-.28.18-.52.06a6.45 6.45 0 0 1-1.9-1.17 7.13 7.13 0 0 1-1.32-1.64c-.14-.24 0-.37.1-.49s.24-.28.36-.42.16-.24.24-.4.04-.3-.02-.42-.53-1.27-.72-1.74-.38-.4-.53-.4h-.45a.86.86 0 0 0-.62.29 2.62 2.62 0 0 0-.82 1.94 4.56 4.56 0 0 0 .95 2.42 10.4 10.4 0 0 0 4 3.5 13.4 13.4 0 0 0 1.33.49 3.2 3.2 0 0 0 1.46.09 2.4 2.4 0 0 0 1.58-1.11 2 2 0 0 0 .14-1.11c-.06-.1-.22-.16-.46-.28Z" />
      </svg>
    </a>
  )
}
