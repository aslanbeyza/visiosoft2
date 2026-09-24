import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { PanelTourState } from './usePanelTour.ts'
import { usePanelTour } from './usePanelTour.ts'
import type { GateKey, SessionFilter, PlanFilter } from './usePanelTour.ts'
import type { ParkId, ViewId } from './panelTourData.ts'
import { menu, money, parkName, parks, periods, sessions } from './panelTourData.ts'
import styles from './PanelTour.module.css'

const desktopWidth = 1120
const desktopHeight = 700

type Layout = 'phone' | 'desktop'

export default function PanelTour({ layout }: { layout: Layout }) {
  const tour = usePanelTour()
  const frame = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (layout !== 'desktop') return
    const element = frame.current
    if (!element) return
    const fit = () => {
      const next = Math.min(element.clientWidth / desktopWidth, element.clientHeight / desktopHeight)
      setScale(next > 0 ? next : 1)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(element)
    return () => observer.disconnect()
  }, [layout])

  const app = <PanelApp layout={layout} tour={tour} />

  if (layout === 'phone') return <div className={styles.host}>{app}</div>

  return (
    <div ref={frame} className={styles.host}>
      <div className={styles.canvas} style={{ transform: `scale(${scale})` }}>
        {app}
      </div>
    </div>
  )
}

function PanelApp({ layout, tour }: { layout: Layout; tour: PanelTourState }) {
  const menuVisible = layout === 'desktop' || tour.menuOpen

  return (
    <div className={layout === 'phone' ? styles.phone : styles.desktop}>
      <header className={styles.top}>
        <div className={styles.brand}>
          {layout === 'phone' ? (
            <button type="button" className={styles.iconButton} aria-label="Menüyü aç" onClick={() => tour.setMenuOpen(!tour.menuOpen)}>
              ☰
            </button>
          ) : null}
          <img className={styles.logo} src="/assets/brand/partner-logo-light.png" alt="Partner" />
        </div>
        <span className={styles.role}>Demo</span>
      </header>
      <div className={styles.body}>
        {menuVisible ? (
          <aside className={styles.aside} aria-label="Panel sayfaları">
            {menu.map((group) => (
              <div key={group.group || 'root'}>
                {group.group ? <p className={styles.group}>{group.group}</p> : null}
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className={item.view === tour.view ? styles.navActive : styles.nav}
                    disabled={!item.view}
                    title={item.view ? item.label : 'Bu sayfa gösterime dahil değil'}
                    onClick={() => item.view && tour.openView(item.view)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
            <small className={styles.muted}>Soluk sayfalar gösterime dahil değil.</small>
          </aside>
        ) : null}
        <main className={styles.main}>
          <div className={styles.parkbar}>
            <select
              aria-label="Otopark seç"
              value={tour.park}
              onChange={(event) => tour.setPark(event.target.value as ParkId)}
            >
              <option value="all">Tüm Otoparklar</option>
              {parks.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <span>Örnek çalışma alanı</span>
          </div>
          <PanelView tour={tour} />
        </main>
      </div>
    </div>
  )
}

function PanelView({ tour }: { tour: PanelTourState }) {
  const views: Record<ViewId, ReactNode> = {
    overview: <Overview tour={tour} />,
    sessions: <Sessions tour={tour} />,
    tariffs: <Tariffs tour={tour} />,
    plates: <Plates tour={tour} />,
    finance: <Finance tour={tour} />,
    comparison: <Comparison tour={tour} />,
    subscriptions: <Subscriptions tour={tour} />,
    logs: <Logs tour={tour} />,
    cameras: <Cameras tour={tour} />,
  }
  return views[tour.view]
}

function Overview({ tour }: { tour: PanelTourState }) {
  const count = tour.park === 'all' ? 3 : 1
  const recent = sessions.filter((row) => tour.park === 'all' || row.park === parkName(tour.park)).slice(0, 5)
  return (
    <>
      <h2 className={styles.title}>Ana Ekran</h2>
      <div className={styles.gridTwo}>
        <article className={styles.card}>
          <small>İçerideki araçlar</small>
          <strong>
            {48 * count} <small>/ {80 * count}</small>
          </strong>
          <progress max={80} value={48} />
          <small>Doluluk · %60</small>
        </article>
        <article className={styles.card}>
          <small>Bugünkü tahsilat</small>
          <strong>{money(7350 * count)}</strong>
          <small>HGS · POS · QR · Abonelik</small>
        </article>
      </div>
      <div className={styles.toolbar}>
        <button type="button" className={styles.action} onClick={() => tour.openView('cameras')}>
          Kamera & Bariyer ↗
        </button>
        <button type="button" className={styles.pill} onClick={() => tour.openView('sessions')}>
          Oturumları incele
        </button>
        <button type="button" className={styles.pill} onClick={() => tour.openView('finance')}>
          Finansal Özet
        </button>
      </div>
      <article className={styles.card}>
        <h3>Son hareketler</h3>
        <div className={styles.events}>
          {recent.map((row, index) => (
            <p key={row.plate}>
              {row.plate} · {index % 2 ? 'Giriş tamamlandı' : 'Tahsilat tamamlandı'}
              <span>
                {row.park} · {row.entry} · {row.method}
              </span>
            </p>
          ))}
        </div>
      </article>
    </>
  )
}

function Sessions({ tour }: { tour: PanelTourState }) {
  const filters: { id: SessionFilter; label: string }[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'inside', label: 'İçeride' },
    { id: 'paid', label: 'Ödendi' },
  ]
  return (
    <>
      <div className={styles.toolbar}>
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tour.filter === item.id ? styles.pillActive : styles.pill}
            aria-pressed={tour.filter === item.id}
            onClick={() => tour.setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="search"
          placeholder="Plaka ara · örn. 34 VS 001"
          aria-label="Plaka ara"
          value={tour.query}
          onChange={(event) => tour.setQuery(event.target.value)}
        />
      </div>
      <article className={styles.card}>
        <div className={styles.count}>{tour.rows.length} örnek oturum</div>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>OTOPARK</th>
                <th>PLAKA</th>
                <th>GİRİŞ</th>
                <th>ÇIKIŞ</th>
                <th>ÜCRET</th>
                <th>ÖDEME</th>
              </tr>
            </thead>
            <tbody>
              {tour.rows.length === 0 ? (
                <tr>
                  <td colSpan={6}>Eşleşen oturum bulunamadı.</td>
                </tr>
              ) : (
                tour.rows.map((row) => (
                  <tr key={row.plate}>
                    <td>{row.park}</td>
                    <td>
                      <span className={styles.badge}>{row.plate}</span>
                    </td>
                    <td>{row.entry}</td>
                    <td>{row.exit}</td>
                    <td className={row.fee ? styles.paid : styles.live}>{row.fee ? money(row.fee) : 'Aktif'}</td>
                    <td>{row.method}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </>
  )
}

function Tariffs({ tour }: { tour: PanelTourState }) {
  const cost = tour.park === 'airport' ? 1.5 : 1
  const bands: [string, number][] = [
    ['0–15 dk', 0],
    ['15–60 dk', 75],
    ['1–2 sa', 150],
    ['2–4 sa', 225],
    ['4–8 sa', 300],
    ['8–24 sa', 450],
  ]
  return (
    <>
      <h2 className={styles.title}>Fiyat Tarifesi</h2>
      <article className={styles.card}>
        <h3>{tour.park === 'all' ? 'Standart tarife' : parkName(tour.park)}</h3>
        <p className={styles.caption}>Otomobil · İlk 15 dakika ücretsiz · Örnek tarife</p>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>SÜRE</th>
                <th>ÜCRET</th>
              </tr>
            </thead>
            <tbody>
              {bands.map(([label, price]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{money(price * cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
      <p className={styles.notice}>Otopark seçimini değiştirerek farklı tarife örneklerini inceleyin.</p>
    </>
  )
}

function Plates({ tour }: { tour: PanelTourState }) {
  const data = sessions.filter((row) => tour.park === 'all' || row.park === parkName(tour.park)).slice(0, 12)
  return (
    <>
      <h2 className={styles.title}>Plaka Fotoğrafları</h2>
      <p className={styles.notice}>
        Örnek plaka kayıtları. Bir kayda tıklayarak tanıma detayını açın; müşteri fotoğrafları bu turda kullanılmaz.
      </p>
      <div className={styles.plateGrid}>
        {data.map((row, index) => (
          <button
            key={row.plate}
            type="button"
            className={tour.selectedPlate === row.plate ? styles.plateSelected : styles.plate}
            onClick={() => tour.setSelectedPlate(row.plate)}
          >
            <strong>{row.plate}</strong>
            <small>
              {row.park}
              <br />
              {row.entry} · CAM 0{(index % 2) + 1}
            </small>
          </button>
        ))}
      </div>
      {tour.selectedPlate && data.some((row) => row.plate === tour.selectedPlate) ? (
        <article className={styles.card}>
          <strong>{tour.selectedPlate}</strong>
          <p>Tanıma güveni: %99,2 · Ülke: Türkiye · Araç tipi: Otomobil</p>
          <p>Plaka doğrulandı. Oturumla eşleştirildi.</p>
        </article>
      ) : null}
    </>
  )
}

function Finance({ tour }: { tour: PanelTourState }) {
  const factor = [1 / 7, 1, 4.3, 26][tour.period] * (tour.park === 'all' ? 1 : tour.park === 'centre' ? 0.6 : 0.4)
  const values = [217400, 4447628, 4665028].map((amount) => Math.round(amount * factor))
  const titles = ['Abonelik Geliri', 'Otopark Oturumu (Abone Olmayan)', 'Toplam Tüm Gelirler']
  const methods = [
    [
      ['Sanal POS', 64, 3512],
      ['Havale / EFT', 26.5, 1088],
      ['Fiziksel POS', 9.5, 410],
    ],
    [
      ['HGS', 57.2, 14457],
      ['Fiziksel POS', 24.1, 5650],
      ['Demirbank QR', 13.4, 7768],
      ['Mobil Ödeme', 5.3, 1914],
    ],
    [
      ['HGS', 54.6, 14457],
      ['Fiziksel POS', 23, 6060],
      ['Demirbank QR', 12.8, 7768],
      ['Sanal POS', 4.7, 3512],
      ['Mobil Ödeme', 4.9, 1914],
    ],
  ][tour.metric]
  const periodLabels = [...periods, 'Tüm Zamanlar']

  return (
    <>
      <article className={styles.card}>
        <div className={styles.finHead}>
          <span>{periodLabels[tour.period]}</span>
          <span>İleri Uzman Modu</span>
        </div>
        <div className={styles.toolbar}>
          {periodLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              className={tour.period === index ? styles.pillActive : styles.pill}
              onClick={() => tour.setPeriod(index)}
            >
              {label}
            </button>
          ))}
        </div>
      </article>
      <div className={styles.metrics}>
        {titles.map((title, index) => (
          <button
            key={title}
            type="button"
            className={tour.metric === index ? styles.metricActive : styles.metric}
            onClick={() => tour.setMetric(index)}
          >
            <small>{title}</small>
            <strong>{money(values[index])}</strong>
            <em>→ DAĞILIMI GÖR</em>
          </button>
        ))}
      </div>
      <article className={styles.card}>
        <h3>Ödeme Yöntemine Göre Analiz</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>ÖDEME YÖNTEMİ</th>
                <th>KULLANIM ORANI</th>
                <th>Başarılı Tahsilat</th>
              </tr>
            </thead>
            <tbody>
              {methods.map(([name, share, count]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>%{share.toFixed(1).replace('.', ',')}</td>
                  <td>
                    {money(Math.round((values[tour.metric] * share) / 100))} ({Math.round(count * factor).toLocaleString('tr-TR')})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  )
}

function Comparison({ tour }: { tour: PanelTourState }) {
  const factor = (tour.park === 'all' ? 3 : 1) * [1, 6, 24][Math.min(tour.period, 2)]
  const bars = [40, 62, 51, 78, 67, 90, 80]
  return (
    <>
      <h2 className={styles.title}>Dönem Karşılaştırması</h2>
      <div className={styles.toolbar}>
        {periods.map((label, index) => (
          <button
            key={label}
            type="button"
            className={tour.period === index ? styles.pillActive : styles.pill}
            onClick={() => tour.setPeriod(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.gridTwo}>
        <article className={styles.card}>
          <small>Bu dönem</small>
          <strong>{money(7900 * factor)}</strong>
          <small className={styles.paid}>↑ %12,8</small>
        </article>
        <article className={styles.card}>
          <small>Önceki dönem</small>
          <strong>{money(7000 * factor)}</strong>
          <small>Eşit süreli karşılaştırma</small>
        </article>
      </div>
      <article className={styles.card}>
        <h3>Tahsilat karşılaştırması</h3>
        <p className={styles.caption}>Mavi: bu dönem · Turuncu: önceki dönem</p>
        <div className={styles.chart} role="img" aria-label="Bu dönemde tahsilat yüzde 12,8 arttı">
          {bars.map((height, index) => (
            <div key={index} className={styles.barPair}>
              <i style={{ height: `${height}%` }} />
              <i style={{ height: `${height * 0.887}%` }} />
            </div>
          ))}
        </div>
      </article>
    </>
  )
}

function Subscriptions({ tour }: { tour: PanelTourState }) {
  const plans: { id: PlanFilter; label: string }[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'monthly', label: 'Aylık' },
    { id: 'staff', label: 'Personel' },
  ]
  const rows = sessions
    .filter((row, index) => {
      const matchesPark = tour.park === 'all' || row.park === parkName(tour.park)
      const matchesPlan = tour.plan === 'all' || (tour.plan === 'monthly' ? index % 2 === 0 : index % 2 === 1)
      return matchesPark && matchesPlan
    })
    .slice(0, 10)
  return (
    <>
      <h2 className={styles.title}>Abonelikler</h2>
      <div className={styles.toolbar}>
        {plans.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tour.plan === item.id ? styles.pillActive : styles.pill}
            onClick={() => tour.setPlan(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <article className={styles.card}>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>PLAKA</th>
                <th>OTOPARK</th>
                <th>PAKET</th>
                <th>DURUM</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.plate}>
                  <td>
                    <span className={styles.badge}>{row.plate}</span>
                  </td>
                  <td>{row.park}</td>
                  <td>{tour.plan === 'staff' ? 'Personel' : tour.plan === 'monthly' ? 'Aylık' : index % 2 ? 'Personel' : 'Aylık'}</td>
                  <td className={styles.paid}>Aktif</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  )
}

function Logs({ tour }: { tour: PanelTourState }) {
  const name = parkName(tour.park)
  const events = tour.barrierEvents.filter((event) => tour.park === 'all' || event.park === name)
  return (
    <>
      <h2 className={styles.title}>Bariyer Kayıtları</h2>
      <article className={styles.card}>
        <div className={styles.events}>
          {events.map((event) => (
            <p key={`${event.park}-${event.time}-${event.key}`}>
              {event.park} · {event.key === 'entry' ? 'Giriş bariyeri' : 'Çıkış bariyeri'}
              <span>{event.time} · Açma komutu tamamlandı · Demo operatör</span>
            </p>
          ))}
        </div>
      </article>
      <p className={styles.notice}>Kamera & Bariyer ekranında verdiğiniz demo komutları burada görünür.</p>
      <button type="button" className={styles.action} onClick={() => tour.openView('cameras')}>
        Kamera & Bariyer ↗
      </button>
    </>
  )
}

function Cameras({ tour }: { tour: PanelTourState }) {
  const name = parkName(tour.park === 'all' ? 'centre' : tour.park)
  const gates: { key: GateKey; title: string; plate: string }[] = [
    { key: 'entry', title: 'Giriş', plate: '06 AN 482' },
    { key: 'exit', title: 'Çıkış', plate: '34 VS 1923' },
  ]
  return (
    <>
      <h2 className={styles.title}>Kamera & Bariyer</h2>
      <p className={styles.caption}>
        {name} · 1 giriş, 1 çıkış
      </p>
      <div className={styles.cameraGrid}>
        {gates.map((gate, index) => {
          const open = tour.openGates.has(name + gate.key)
          return (
            <article key={gate.key} className={styles.card}>
              <div className={open ? styles.feedOpen : styles.feed}>
                <img src={`/assets/panel/cam-${gate.key}.jpg`} alt={`${gate.title} kamerası görüntüsü`} />
                <span>
                  CAM 0{index + 1} · {gate.title.toLocaleUpperCase('tr-TR')}
                </span>
                <span>{open ? 'Bariyer açık' : 'Bariyer kapalı'}</span>
              </div>
              <h3>
                {name} / {gate.title}
              </h3>
              <p>
                Plaka tanıma · {gate.plate}
                <br />
                Bariyer durumu: {open ? 'Açık' : 'Kapalı'}
              </p>
              <button type="button" className={styles.action} disabled={open} onClick={() => tour.openGate(gate.key)}>
                {open ? 'Bariyer açık' : 'Bariyeri aç'}
              </button>
            </article>
          )
        })}
      </div>
      <p className={styles.notice}>
        Kareler sahadaki kameralardan alınmış örneklerdir; plakalar gizlenmiştir. Bu turdaki komutlar örnektir ve fiziksel cihazları kontrol etmez.
      </p>
      <button type="button" className={styles.pill} onClick={() => tour.openView('logs')}>
        Bariyer kayıtlarını gör →
      </button>
    </>
  )
}
