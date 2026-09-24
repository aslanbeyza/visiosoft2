import { useId, useState } from 'react'
import Button from '../../components/Button/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { roiAssumptions, roiCopy } from './roiCopy.ts'
import type { RoiFieldId } from './roiCopy.ts'
import styles from './RoiCalculator.module.css'

const money = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
const plain = new Intl.NumberFormat('tr-TR')
const months = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

type RoiValues = Record<RoiFieldId, number>

const initialValues = Object.fromEntries(roiCopy.fields.map((field) => [field.id, field.initial])) as RoiValues

function display(id: RoiFieldId, value: number) {
  return `${plain.format(value)} ${roiCopy.units[id]}`
}

export default function RoiCalculator() {
  const baseId = useId()
  const path = usePath()
  const [values, setValues] = useState<RoiValues>(initialValues)

  const yearlyStaff = values.staff * roiAssumptions.monthlyStaffCost * 12
  const yearlyPaper = values.vehicles * roiAssumptions.ticketCost * 12
  const yearlyLeak = values.vehicles * values.fee * roiAssumptions.leakRate * 12
  const yearlyTotal = yearlyStaff + yearlyPaper + yearlyLeak
  const monthlySaving = yearlyTotal / 12
  const roiMonths = monthlySaving > 0 ? roiAssumptions.systemInvestment / monthlySaving : 0

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        {roiCopy.fields.map((field) => {
          const inputId = `${baseId}-${field.id}`
          return (
            <div key={field.id} className={styles.field}>
              <div className={styles.fieldHead}>
                <label className={styles.fieldLabel} htmlFor={inputId}>
                  {field.label}
                </label>
                <output className={styles.fieldValue} htmlFor={inputId}>
                  {display(field.id, values[field.id])}
                </output>
              </div>
              <input
                id={inputId}
                className={styles.range}
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={values[field.id]}
                aria-valuetext={display(field.id, values[field.id])}
                onChange={(event) => setValues((prev) => ({ ...prev, [field.id]: Number(event.target.value) }))}
              />
            </div>
          )
        })}

      </div>

      <div className={styles.result}>
        <div className={styles.total} aria-live="polite" aria-atomic="true">
          <p className={styles.totalLabel}>{roiCopy.totalLabel}</p>
          <p className={styles.totalValue}>{money.format(yearlyTotal)}</p>
          <p className={styles.roi}>{roiCopy.roi(months.format(roiMonths))}</p>
        </div>

        <Button to={path('discovery.show')} size="lg" className={styles.cta}>
          {roiCopy.cta}
        </Button>

        <p className={styles.assumptions}>{roiCopy.assumptions(roiAssumptions)}</p>
      </div>
    </div>
  )
}
