import { useLayoutEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import { Field, TextInput } from '../../components/Form/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import { EmptyState } from '../../components/States/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { glossaryCopy as copy, topicLabels, topicOrder } from './glossaryCopy.ts'
import type { TopicKey } from './glossaryCopy.ts'
import { fold, glossaryTerms, groupByLetter, letterId, topicCounts } from './terms.ts'
import type { GlossaryTerm } from './terms.ts'
import styles from './GlossaryDirectory.module.css'

type Filter = TopicKey | 'all'

function termHaystack(term: GlossaryTerm) {
  return [term.term, term.definition, topicLabels[term.topic], ...(term.also ?? [])].map(fold).join(' ')
}

/** Arama, konu süzgeci ve harf atlamalı terim dizini. */
export default function GlossaryDirectory() {
  const path = usePath()
  const { hash } = useLocation()
  const activeId = decodeURIComponent(hash.replace(/^#/, ''))
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useLayoutEffect(() => {
    if (!activeId) return
    document.getElementById(activeId)?.scrollIntoView()
  }, [activeId])

  const visible = useMemo(() => {
    const needle = fold(query.trim())
    return glossaryTerms.filter((term) => {
      if (filter !== 'all' && term.topic !== filter) return false
      if (needle && !termHaystack(term).includes(needle)) return false
      return true
    })
  }, [filter, query])

  const groups = useMemo(() => groupByLetter(visible), [visible])
  const querying = fold(query.trim()).length > 0
  const searching = querying || filter !== 'all'
  const showLetters = !querying && groups.length > 1

  const reset = () => {
    setQuery('')
    setFilter('all')
  }

  return (
    <div className={styles.root}>
      <Reveal className={styles.tools} y={16} amount={0.4}>
        <Field className={styles.search} label={copy.searchLabel} name="glossary-q">
          <TextInput
            type="search"
            name="glossary-q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
          />
        </Field>

        <div role="group" aria-label={copy.filterLabel} className={styles.filters}>
          <button type="button" className={styles.chip} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            <span>{copy.all}</span>
            <span className={styles.count}>{glossaryTerms.length}</span>
          </button>
          {topicOrder.map((key) => (
            <button
              key={key}
              type="button"
              className={styles.chip}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              <span>{topicLabels[key]}</span>
              <span className={styles.count}>{topicCounts[key]}</span>
            </button>
          ))}
        </div>

        {showLetters ? (
          <nav className={styles.letters} aria-label={copy.lettersLabel}>
            {groups.map((group) => (
              <a key={group.letter} className={styles.letter} href={`#${letterId(group.letter)}`}>
                {group.letter}
              </a>
            ))}
          </nav>
        ) : null}

        <p className={styles.status} aria-live="polite">
          {copy.result(visible.length)}
          {searching ? ` · ${filter === 'all' ? copy.all : topicLabels[filter]}` : null}
        </p>
      </Reveal>

      {visible.length === 0 ? (
        <EmptyState
          title={copy.emptyTitle}
          description={copy.emptyBody}
          action={
            <Button type="button" variant="secondary" onClick={reset}>
              {copy.clear}
            </Button>
          }
        />
      ) : (
        <div className={styles.groups}>
          {groups.map((group) => (
            <section
              key={group.letter}
              className={styles.group}
              aria-labelledby={showLetters ? letterId(group.letter) : undefined}
              aria-label={showLetters ? undefined : group.letter}
            >
              {showLetters ? (
                <h2 id={letterId(group.letter)} className={styles.heading}>
                  {group.letter}
                </h2>
              ) : null}
              <ul className={styles.grid}>
                {group.items.map((term) => (
                  <li key={term.id}>
                    <article id={term.id} className={styles.card} data-active={term.id === activeId || undefined}>
                      <p className={styles.topic}>{topicLabels[term.topic]}</p>
                      <h3 className={styles.term}>
                        <a className={styles.anchor} href={`#${term.id}`}>
                          {term.term}
                        </a>
                      </h3>
                      {term.also && term.also.length > 0 ? (
                        <p className={styles.also}>
                          {copy.also}: {term.also.join(' · ')}
                        </p>
                      ) : null}
                      <p className={styles.definition}>{term.definition}</p>
                      {term.route ? (
                        <Link className={styles.related} to={path(term.route)}>
                          {copy.related}
                          <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      ) : null}
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
