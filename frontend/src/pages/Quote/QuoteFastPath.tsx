import Button from '../../components/Button/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { quoteCopy } from './quoteCopy.ts'
import styles from './QuoteFastPath.module.css'

const copy = quoteCopy.fastPath

/** Shortcut to the 3-step quote engine for visitors who want an instant component list instead of a callback. */
export default function QuoteFastPath() {
  const path = usePath()

  return (
    <div className={styles.card}>
      <div>
        <p className={styles.title}>{copy.title}</p>
        <p className={styles.text}>{copy.text}</p>
      </div>
      <Button to={path(copy.route)} variant="secondary" arrow className={styles.action}>
        {copy.link}
      </Button>
    </div>
  )
}
