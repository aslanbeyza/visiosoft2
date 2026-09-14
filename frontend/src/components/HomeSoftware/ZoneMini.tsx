import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { demoTables, pageLabels, zoneMiniCopy as text } from './zoneMiniCopy.ts'
import type { ListKind, ZonePage, ZonePlate } from './zoneMiniCopy.ts'
import type { ZoneLayout, ZoneMiniState } from './useZoneMini.ts'
import styles from './ZoneMini.module.css'

type ZoneMiniProps = {
  layout: ZoneLayout
  zone: ZoneMiniState
}

export default function ZoneMini({ layout, zone }: ZoneMiniProps) {
  const formId = useId()
  const [menuOpen, setMenuOpen] = useState(false)
  const isPhone = layout === 'phone'

  const goTo = (next: ZonePage) => {
    zone.goTo(next)
    setMenuOpen(false)
  }

  return (
    <div className={styles.app} data-layout={layout}>
      {isPhone ? (
        <header className={styles.top}>
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? text.closeMenu : text.openMenu}
          </button>
          <p>{pageLabels[zone.page]}</p>
        </header>
      ) : null}

      {isPhone && menuOpen ? (
        <button type="button" className={styles.scrim} aria-label={text.closeMenu} onClick={() => setMenuOpen(false)} />
      ) : null}

      <aside className={styles.side} data-open={!isPhone || menuOpen} hidden={isPhone && !menuOpen}>
        <p className={styles.brand}>
          {text.brand}
          <span>{text.site}</span>
        </p>
        <ZoneNav
          page={zone.page}
          openGroups={zone.openGroups}
          counts={zone.counts}
          onOpen={goTo}
          onToggleGroup={zone.toggleGroup}
        />
      </aside>

      <div className={styles.main}>
        {zone.page === 'panel' ? (
          <PanelHome onOpen={goTo} />
        ) : zone.page === 'allow' || zone.page === 'deny' ? (
          <ListPage
            formId={formId}
            kind={zone.kind}
            list={zone.list}
            message={zone.message}
            note={zone.note}
            plate={zone.plate}
            onAdd={zone.handleAdd}
            onNote={zone.setNote}
            onPlate={zone.setPlate}
            onRemove={zone.handleRemove}
          />
        ) : (
          <TablePage page={zone.page} />
        )}
      </div>
    </div>
  )
}

function ZoneNav({
  page,
  openGroups,
  counts,
  onOpen,
  onToggleGroup,
}: {
  page: ZonePage
  openGroups: string[]
  counts: Partial<Record<ZonePage, number>>
  onOpen: (page: ZonePage) => void
  onToggleGroup: (id: string) => void
}) {
  return (
    <nav className={styles.nav} aria-label={text.navLabel}>
      <button type="button" className={styles.navBtn} data-active={page === 'panel'} onClick={() => onOpen('panel')}>
        {text.panelNav}
      </button>

      {text.groups.map((group) => {
        const open = openGroups.includes(group.id)
        return (
          <div key={group.id} className={styles.group}>
            <button type="button" className={styles.groupBtn} aria-expanded={open} onClick={() => onToggleGroup(group.id)}>
              {group.label}
            </button>
            {open
              ? group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.navBtn}
                    data-active={page === item.id}
                    onClick={() => onOpen(item.id)}
                  >
                    {item.label}
                    {counts[item.id] != null ? <em>{counts[item.id]}</em> : null}
                  </button>
                ))
              : null}
          </div>
        )
      })}
    </nav>
  )
}

function PanelHome({ onOpen }: { onOpen: (page: ZonePage) => void }) {
  return (
    <>
      <header className={styles.head}>
        <h3>{text.panelNav}</h3>
      </header>
      <div className={styles.cards}>
        {text.cards.map((card) => (
          <section key={card.title} className={styles.card}>
            <h4>{card.title}</h4>
            <p>{card.hint}</p>
            <ul>
              {card.links.map((id) => (
                <li key={id}>
                  <button type="button" onClick={() => onOpen(id)}>
                    {pageLabels[id]}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className={styles.health}>
        <span>
          {text.health}
          <small>{text.healthHint}</small>
        </span>
        <button type="button" onClick={() => onOpen('pmp')}>
          {text.logsCta}
        </button>
      </p>
    </>
  )
}

function ListPage({
  formId,
  kind,
  list,
  message,
  note,
  plate,
  onAdd,
  onNote,
  onPlate,
  onRemove,
}: {
  formId: string
  kind: ListKind
  list: ZonePlate[]
  message: string
  note: string
  plate: string
  onAdd: (event: FormEvent<HTMLFormElement>) => void
  onNote: (value: string) => void
  onPlate: (value: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <>
      <header className={styles.head}>
        <h3>{kind === 'allow' ? text.allowTitle : text.denyTitle}</h3>
        <p>{kind === 'allow' ? text.allowHint : text.denyHint}</p>
      </header>

      <form className={styles.form} onSubmit={onAdd}>
        <label htmlFor={`${formId}-plate`}>
          {text.plateLabel}
          <input
            id={`${formId}-plate`}
            value={plate}
            onChange={(event) => onPlate(event.target.value)}
            placeholder={text.platePlaceholder}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label htmlFor={`${formId}-note`}>
          {text.noteLabel}
          <input id={`${formId}-note`} value={note} onChange={(event) => onNote(event.target.value)} />
        </label>
        <button type="submit" className={styles.add} data-kind={kind}>
          {kind === 'allow' ? text.addAllow : text.addDeny}
        </button>
      </form>

      <p className={styles.message} role="status" aria-live="polite">
        {message}
      </p>

      {list.length === 0 ? (
        <p className={styles.empty}>{text.empty}</p>
      ) : (
        <ul className={styles.list}>
          {list.map((row) => (
            <li key={row.id}>
              <span className={styles.plate}>{row.plate}</span>
              {row.note ? <span className={styles.note}>{row.note}</span> : null}
              <button type="button" className={styles.remove} onClick={() => onRemove(row.id)}>
                {text.remove}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function TablePage({ page }: { page: Exclude<ZonePage, 'panel' | 'allow' | 'deny'> }) {
  const table = demoTables[page]
  return (
    <>
      <header className={styles.head}>
        <h3>{table.title}</h3>
        <p>{table.hint}</p>
      </header>
      <table className={styles.table}>
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.cells.join('-')}>
              {row.cells.map((cell, index) => (
                <td key={`${cell}-${index}`} className={index === 0 ? styles.plate : undefined}>
                  {row.tone && index === row.cells.length - 1 ? (
                    <span className={styles.pill} data-tone={row.tone}>
                      {cell}
                    </span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
