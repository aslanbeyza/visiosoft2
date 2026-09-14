import { Checkbox, Field, Select } from '../Form/index.ts'
import { leadFormCopy } from './leadFormCopy.ts'
import styles from './LeadForm.module.css'

const copy = leadFormCopy.parking

/** Otopark teklif motoru için ek alanlar; alan adları backend sözleşmesiyle aynıdır. */
export default function ParkingFields() {
  return (
    <div className={styles.extra}>
      <Field label={copy.projectType} name="project_type">
        <Select
          name="project_type"
          defaultValue="paid"
          options={[
            { value: 'paid', label: copy.paid },
            { value: 'subscription', label: copy.subscription },
          ]}
        />
      </Field>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>{copy.needs}</legend>
        <div className={styles.checks}>
          <Checkbox name="needs_barrier" label={copy.barrier} />
          <Checkbox name="needs_turnkey_installation" label={copy.turnkey} />
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>{copy.payments}</legend>
        <div className={styles.checks}>
          <Checkbox name="payment_methods" value="card" label={copy.card} defaultChecked />
          <Checkbox name="payment_methods" value="hgs" label={copy.hgs} />
        </div>
      </fieldset>
    </div>
  )
}
