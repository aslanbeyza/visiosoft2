import { Link } from 'react-router-dom'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './Logo.module.css'

type LogoProps = {
  invert?: boolean
}

export default function Logo({ invert = false }: LogoProps) {
  const path = usePath()

  return (
    <Link to={path('home')} className={`${styles.logo} ${invert ? styles.invert : ''}`} aria-label="Visiosoft">
      <img src="/img/visiosoft_logo.svg" alt="Visiosoft" className={styles.mark} width="103" height="24" />
    </Link>
  )
}
