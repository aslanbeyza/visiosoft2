import { motion, useReducedMotion } from 'framer-motion'
import styles from './AnimatedTitle.module.css'

const easeApple = [0.25, 1, 0.5, 1] as const

type AnimatedTitleProps = {
  lines: string[]
  as?: 'h2' | 'h3' | 'p'
  align?: 'left' | 'center'
  className?: string
}

export default function AnimatedTitle({ lines, as: Tag = 'h2', align = 'left', className = '' }: AnimatedTitleProps) {
  const reduce = useReducedMotion()
  let wordIndex = 0

  return (
    <Tag className={`${styles.title} ${align === 'center' ? styles.center : ''} ${className}`.trim()}>
      {lines.map((line) => (
        <span key={line} className={styles.line}>
          {line.split(' ').map((word) => {
            const delay = wordIndex * 0.035
            wordIndex += 1
            return (
              <motion.span
                key={`${line}-${word}-${wordIndex}`}
                className={styles.word}
                initial={reduce ? false : { opacity: 0, y: 42, rotateX: -42, rotateY: 48, z: -50 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, z: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, delay, ease: easeApple }}
              >
                {word}
              </motion.span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
