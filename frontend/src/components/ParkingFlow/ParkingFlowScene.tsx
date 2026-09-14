import { motion } from 'framer-motion'
import type { MotionStyle, MotionValue } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { leaders } from './leaders.ts'
import type { ParkingFlowDevice } from './parkingFlowCopy.ts'
import { COMPACT_VIEW, SCENE_HEIGHT, SCENE_WIDTH } from './scene.ts'
import styles from './ParkingFlow.module.css'

/*
 * Şerit sahnesi (viewBox 1200×520). Yandan, hafif yükseltilmiş bakış: uzak kaldırım y=340, yakın kaldırım y=452.
 * Uzak kaldırımda soldan sağa LED panel, kamera direği (kamera + kontrol kutusu), kiosk ve bariyer durur;
 * araç şeritte soldan sağa ilerler. Tüm hareket motion value'larla yalnızca transform/opacity/pathLength üzerinden.
 */
export type SceneValues = {
  car: MotionValue<number>
  cone: MotionValue<number>
  bracket: MotionValue<number>
  plate: MotionValue<number>
  pulse: MotionValue<number>
  arm: MotionValue<number>
  screenColor: MotionValue<string>
  ledColor: MotionValue<string>
  gateColor: MotionValue<string>
}

type ParkingFlowSceneProps = {
  values: SceneValues
  highlight?: ParkingFlowDevice
  /** Sahne görünüme girdi (vurgu çizgisi çizilir). */
  revealed: boolean
  reduce: boolean
  /** Vurgu ilk görünüşten sonra değişti: çizgi beklemeden, kısa sürede yeniden çizilir. */
  replay?: boolean
  /** Dar sahne: görünüm kırpılır; etiket şeridin altında olduğundan dirsekli çizgi yerine cihaz üzerinde işaret çizilir. */
  compact?: boolean
}

export default function ParkingFlowScene({ values, highlight, revealed, reduce, replay = false, compact = false }: ParkingFlowSceneProps) {
  const leader = highlight ? leaders[highlight] : null
  const armStyle = { '--arm': values.arm } as MotionStyle
  const view = compact ? COMPACT_VIEW : { x: 0, y: 0, width: SCENE_WIDTH, height: SCENE_HEIGHT }

  return (
    <svg
      viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
      className={styles.svg}
      data-highlight={highlight}
      aria-hidden="true"
      focusable="false"
    >
      {/* Zemin ve şerit */}
      <g data-ground="true">
        <polygon points="30,340 1170,340 1200,452 0,452" className={styles.lane} />
        <rect x="0" y="452" width="1200" height="12" className={styles.kerb} />
        <line x1="30" y1="340" x2="1170" y2="340" className={styles.kerbLine} />
        <line x1="0" y1="452" x2="1200" y2="452" className={styles.kerbLine} />
        <line x1="18" y1="396" x2="1182" y2="396" className={styles.dash} />
      </g>

      {/* LED bilgi paneli */}
      <g data-device="ledPanel" data-dim="true">
        <rect x="142" y="250" width="4" height="90" className={styles.fillLine} />
        <rect x="192" y="250" width="4" height="90" className={styles.fillLine} />
        <rect x="128" y="336" width="82" height="6" rx="1" className={styles.fillLine} />
        <rect x="118" y="182" width="102" height="72" rx="5" className={styles.body} />
        <rect x="126" y="190" width="86" height="56" rx="3" className={styles.ledScreen} />
        <text x="141" y="232" className={styles.ledText}>
          P
        </text>
        <path d="M170 218h28m-9-9 9 9-9 9" className={styles.ledArrow} />
      </g>

      {/* Kamera direği */}
      <g data-device="pole" data-dim="true">
        <rect x="311" y="334" width="34" height="8" rx="1" className={styles.fillLine} />
        <rect x="323" y="124" width="10" height="216" rx="2" className={styles.body} />
        <rect x="320" y="120" width="16" height="6" rx="1" className={styles.fillLine} />
        <line x1="328" y1="146" x2="328" y2="222" className={styles.cable} />
      </g>

      {/* Kameradan kontrol kutusuna inen veri darbesi */}
      <motion.line x1="328" y1="146" x2="328" y2="222" className={styles.pulse} style={{ pathLength: values.pulse }} data-dim="true" />

      {/* Kamera */}
      <g data-device="camera" data-dim="true">
        <line x1="333" y1="131" x2="341" y2="131" className={styles.bracketLine} />
        <g transform="translate(334 118) rotate(14)">
          <rect x="0" y="0" width="66" height="28" rx="6" className={styles.body} />
          <line x1="8" y1="6" x2="44" y2="6" className={styles.detail} />
          <circle cx="56" cy="14" r="7" className={styles.lensRing} />
          <circle cx="56" cy="14" r="3" className={styles.fillLine} />
        </g>
      </g>

      {/* Kontrol kutusu */}
      <g data-device="controlBox" data-dim="true">
        <rect x="304" y="222" width="48" height="60" rx="4" className={styles.body} />
        <rect x="312" y="230" width="18" height="4" rx="1" className={styles.detailFill} />
        <line x1="312" y1="254" x2="336" y2="254" className={styles.detail} />
        <line x1="312" y1="262" x2="336" y2="262" className={styles.detail} />
        <line x1="312" y1="270" x2="336" y2="270" className={styles.detail} />
        <motion.circle cx="343" cy="232" r="3.5" style={{ fill: values.ledColor }} />
      </g>

      {/* Algılama konisi */}
      <motion.polygon points="385,146 396,444 618,444" className={styles.cone} style={{ opacity: values.cone }} data-dim="true" />

      {/* Kiosk */}
      <g data-device="kiosk" data-dim="true">
        <rect x="684" y="336" width="62" height="6" rx="1" className={styles.fillLine} />
        <rect x="690" y="142" width="50" height="198" rx="4" className={styles.kioskBody} />
        <rect x="687" y="137" width="56" height="7" rx="2" className={styles.fillLine} />
        <rect x="697" y="150" width="36" height="150" rx="3" className={styles.kioskFront} />
        <motion.rect x="702" y="158" width="26" height="44" rx="2" style={{ fill: values.screenColor }} />
        <path d="M709 240a8.5 8.5 0 0 1 12 0M706 236a12.5 12.5 0 0 1 18 0M712 244a4 4 0 0 1 6 0" className={styles.onFront} />
        <rect x="703" y="262" width="24" height="3" rx="1" className={styles.onFrontFill} />
        <line x1="698" y1="312" x2="732" y2="312" className={styles.vent} />
        <line x1="698" y1="320" x2="732" y2="320" className={styles.vent} />
        <line x1="698" y1="328" x2="732" y2="328" className={styles.vent} />
      </g>

      {/* Bariyer */}
      <g data-device="barrier" data-dim="true">
        <rect x="920" y="336" width="52" height="6" rx="1" className={styles.fillLine} />
        <rect x="928" y="262" width="36" height="78" rx="4" className={styles.body} />
        <motion.circle cx="946" cy="276" r="4" style={{ fill: values.gateColor }} />
        <motion.g className={styles.arm} style={armStyle}>
          <rect x="964" y="283" width="186" height="10" rx="5" className={styles.body} />
          <rect x="996" y="285.5" width="18" height="5" rx="2.5" className={styles.stripe} />
          <rect x="1032" y="285.5" width="18" height="5" rx="2.5" className={styles.stripe} />
          <rect x="1068" y="285.5" width="18" height="5" rx="2.5" className={styles.stripe} />
          <rect x="1104" y="285.5" width="18" height="5" rx="2.5" className={styles.stripe} />
        </motion.g>
        <circle cx="964" cy="288" r="6" className={styles.body} />
      </g>

      {/* Araç (yandan, burun sağa: gidiş yönü). Far önde, stop arkada. */}
      <motion.g style={{ x: values.car, y: 373 }} data-dim="true">
        <ellipse cx="76" cy="58" rx="72" ry="4.5" className={styles.shadow} />
        <path
          d="M8 46V30q0-8 8-10l24-3 18-13q4-3 10-3h32q6 0 10 4l16 13 16 3q6 1 6 9v16q0 4-4 4H12q-4 0-4-4Z"
          className={styles.car}
        />
        <path d="M46 18 60 7h18v11Z" className={styles.glass} />
        <path d="M84 7h16l14 11H84Z" className={styles.glass} />
        <line x1="80" y1="21" x2="80" y2="44" className={styles.detail} />
        <rect x="10" y="28" width="5" height="6" rx="1" className={styles.tail} />
        <rect x="141" y="28" width="7" height="6" rx="1" className={styles.lamp} />
        <line x1="148" y1="31" x2="161" y2="31" className={styles.beam} />
        <circle cx="38" cy="48" r="11" className={styles.wheel} />
        <circle cx="38" cy="48" r="4.5" className={styles.hub} />
        <circle cx="118" cy="48" r="11" className={styles.wheel} />
        <circle cx="118" cy="48" r="4.5" className={styles.hub} />
      </motion.g>

      {/* Plaka etiketi ve okuma ayracı */}
      <motion.g style={{ opacity: values.plate }} data-dim="true">
        <line x1="475" y1="318" x2="475" y2="368" className={styles.plateLeader} />
        <rect x="420" y="284" width="110" height="34" rx="4" className={styles.plate} />
        <text x="475" y="307" className={styles.plateText}>
          34 ••• ••
        </text>
      </motion.g>
      <g data-dim="true">
        <motion.path d="M408 288V272h16" className={styles.corner} style={{ pathLength: values.bracket }} />
        <motion.path d="M526 272h16v16" className={styles.corner} style={{ pathLength: values.bracket }} />
        <motion.path d="M542 314v16h-16" className={styles.corner} style={{ pathLength: values.bracket }} />
        <motion.path d="M424 330h-16v-16" className={styles.corner} style={{ pathLength: values.bracket }} />
      </g>

      {/* Vurgu: seçili cihaza giden dirsekli çizgi */}
      {leader ? (
        // Vurgu değişince grup yeniden bağlanır: çizgi baştan çizilir (ilk seferde 0,3 sn bekleyip 0,9 sn; sonra hemen, 0,55 sn).
        <g key={`${highlight}-${compact}`} className={styles.leaderGroup}>
          {compact ? (
            // Dar sahne: etiket şeridin altında; cihazın çevresinde vurgu çerçevesi kalır, cihazın yüzü açık kalır.
            <motion.g
              initial={reduce ? false : { opacity: 0, scale: 0.85 }}
              animate={revealed ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.45, delay: replay ? 0.2 : 0.6, ease: revealEase }}
            >
              {/*
               * Sahne ~⅓ ölçekte çizilir: çizgiler ölçekten bağımsız px kalınlığındadır. Dolgu yoktur.
               * Katmanlar: zemin renkli hale (çerçeveden geçen çizgileri keser), dışta ince vurgu çizgisi, vurgu çerçevesi.
               */}
              <rect x={leader.frame[0]} y={leader.frame[1]} width={leader.frame[2]} height={leader.frame[3]} rx="12" className={styles.markerHalo} />
              <rect
                x={leader.frame[0] - 14}
                y={leader.frame[1] - 14}
                width={leader.frame[2] + 28}
                height={leader.frame[3] + 28}
                rx="22"
                className={styles.markerOuter}
              />
              <rect x={leader.frame[0]} y={leader.frame[1]} width={leader.frame[2]} height={leader.frame[3]} rx="12" className={styles.markerRing} />
            </motion.g>
          ) : (
            <>
              <motion.path
                d={leader.d}
                className={styles.leader}
                initial={reduce ? false : { pathLength: 0 }}
                animate={revealed ? { pathLength: 1 } : undefined}
                transition={{ duration: replay ? 0.55 : 0.9, delay: replay ? 0 : 0.3, ease: revealEase }}
              />
              <motion.circle
                cx={leader.x}
                cy={leader.y}
                r="4"
                className={styles.leaderDot}
                initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                animate={revealed ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 0.4, delay: replay ? 0.45 : 1.05, ease: revealEase }}
              />
            </>
          )}
        </g>
      ) : null}
    </svg>
  )
}
