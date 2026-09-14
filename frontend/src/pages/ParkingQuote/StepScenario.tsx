import { ChoiceCardGroup } from '../../components/Form/index.ts'
import { InvoiceIcon, UsersIcon } from '../../components/FeatureGrid/icons.tsx'
import { quoteCopy } from './quoteCopy.ts'
import type { ProjectType } from './quoteRules.ts'
import { StepAlert, StepHeader, WizardNav } from './StepParts.tsx'
import styles from './QuoteSteps.module.css'

type StepScenarioProps = {
  value: ProjectType | ''
  onChange: (value: ProjectType) => void
  onNext: () => void
  showErrors: boolean
  autoFocus: boolean
  total: number
}

const { scenario } = quoteCopy

/** 1. adım: ücretli otopark mı, sadece abonelik mi. */
export default function StepScenario({ value, onChange, onNext, showErrors, autoFocus, total }: StepScenarioProps) {
  const missing = showErrors && value === ''

  return (
    <div className={styles.step}>
      <StepHeader index={0} total={total} title={scenario.title} autoFocus={autoFocus} />
      {missing ? <StepAlert message={scenario.required} visuallyHidden /> : null}
      <ChoiceCardGroup
        type="radio"
        name="project_type"
        legend={scenario.legend}
        required
        columns={2}
        value={value}
        onChange={(next) => onChange(next as ProjectType)}
        error={missing ? scenario.required : undefined}
        className={styles.choices}
        options={[
          {
            value: 'paid',
            label: scenario.options.paid.label,
            description: scenario.options.paid.description,
            icon: <InvoiceIcon />,
          },
          {
            value: 'subscription',
            label: scenario.options.subscription.label,
            description: scenario.options.subscription.description,
            icon: <UsersIcon />,
          },
        ]}
      />
      <WizardNav onNext={onNext} />
    </div>
  )
}
