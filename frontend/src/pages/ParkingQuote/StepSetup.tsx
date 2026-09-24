import Badge from '../../components/Badge/index.ts'
import { ChoiceCardGroup } from '../../components/Form/index.ts'
import { BarrierIcon, CardIcon, KioskIcon, SettingsIcon } from '../../components/FeatureGrid/icons.tsx'
import { quoteCopy } from './quoteCopy.ts'
import { setupErrors } from './quoteRules.ts'
import type { PaymentMethod, QuoteChoices, YesNo } from './quoteRules.ts'
import { StepAlert, StepHeader, WizardNav } from './StepParts.tsx'
import styles from './QuoteSteps.module.css'

type StepSetupProps = {
  choices: QuoteChoices
  onPayments: (value: PaymentMethod[]) => void
  onBarrier: (value: YesNo) => void
  onInstallation: (value: YesNo) => void
  onBack: () => void
  onNext: () => void
  showErrors: boolean
  autoFocus: boolean
  total: number
}

const { setup } = quoteCopy

export default function StepSetup(props: StepSetupProps) {
  const { choices, showErrors, autoFocus, total } = props
  const errors = showErrors ? setupErrors(choices) : {}
  const hasErrors = Object.keys(errors).length > 0
  const subscription = choices.projectType === 'subscription'

  return (
    <div className={styles.step}>
      <StepHeader index={1} total={total} title={setup.title} autoFocus={autoFocus} />
      {hasErrors ? <StepAlert message={setup.required} /> : null}

      <div className={styles.block}>
        <p className={styles.blockLabel}>{setup.payment.section}</p>
        {subscription ? (
          <div className={styles.scenarioNote}>
            <Badge tone="neutral" dot>
              {setup.payment.subscriptionBadge}
            </Badge>
            <p>{setup.payment.subscriptionNote}</p>
          </div>
        ) : (
          <ChoiceCardGroup
            type="checkbox"
            name="payment_methods"
            legend={setup.payment.heading}
            required
            columns={2}
            value={choices.payments}
            onChange={(next) => props.onPayments(next as PaymentMethod[])}
            error={errors.payment_methods}
            options={[
              { value: 'card', ...setup.payment.options.card, icon: <KioskIcon /> },
              { value: 'hgs', ...setup.payment.options.hgs, icon: <CardIcon /> },
            ]}
          />
        )}
      </div>

      <div className={styles.block}>
        <p className={styles.blockLabel}>{setup.access.section}</p>
        <ChoiceCardGroup
          type="radio"
          name="needs_barrier"
          legend={setup.access.heading}
          required
          columns={2}
          value={choices.barrier}
          onChange={(next) => props.onBarrier(next as YesNo)}
          error={errors.needs_barrier}
          options={[
            { value: 'yes', ...setup.access.yes, icon: <BarrierIcon /> },
            { value: 'no', ...setup.access.no },
          ]}
        />
      </div>

      <div className={styles.block}>
        <p className={styles.blockLabel}>{setup.installation.section}</p>
        <ChoiceCardGroup
          type="radio"
          name="needs_turnkey_installation"
          legend={setup.installation.heading}
          required
          columns={2}
          value={choices.installation}
          onChange={(next) => props.onInstallation(next as YesNo)}
          error={errors.needs_turnkey_installation}
          options={[
            { value: 'yes', ...setup.installation.yes, icon: <SettingsIcon /> },
            { value: 'no', ...setup.installation.no },
          ]}
        />
      </div>

      <WizardNav onBack={props.onBack} onNext={props.onNext} />
    </div>
  )
}
