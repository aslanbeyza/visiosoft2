
import { quoteCopy } from './quoteCopy.ts'

export type ProjectType = 'paid' | 'subscription'
export type PaymentMethod = 'card' | 'hgs'
export type YesNo = 'yes' | 'no'
export type CatalogId = keyof typeof quoteCopy.catalog
export type PackageGroup = 'software' | 'hardware' | 'service'

export type QuoteChoices = {
  projectType: ProjectType | ''
  payments: PaymentMethod[]
  barrier: YesNo | ''
  installation: YesNo | ''
}

export type PackageItem = {
  id: CatalogId
  name: string
  reason: string
  group: PackageGroup

  rule?: string
}

export const emptyChoices: QuoteChoices = { projectType: '', payments: [], barrier: '', installation: '' }

const groups: Record<CatalogId, PackageGroup> = {
  plate_recognition: 'software',
  parking_software: 'software',
  payment_automation: 'software',
  subscription_module: 'software',
  hgs_integration: 'software',
  kiosk: 'hardware',
  barrier_system: 'hardware',
  turnkey_installation: 'service',
}

function item(id: CatalogId, rule?: string): PackageItem {
  const entry = quoteCopy.catalog[id]
  return { id, name: entry.name, reason: entry.reason, group: groups[id], rule }
}

export function buildPackage(choices: QuoteChoices): PackageItem[] {
  if (!choices.projectType) return []
  const paid = choices.projectType === 'paid'
  const list: PackageItem[] = [item('plate_recognition'), item('parking_software')]
  if (paid) list.push(item('payment_automation'))
  if (!paid) list.push(item('subscription_module'))
  if (paid && choices.payments.includes('hgs')) list.push(item('hgs_integration'))
  if (paid && choices.payments.includes('card')) list.push(item('kiosk', quoteCopy.panel.rules.kiosk))
  if (choices.barrier === 'yes') list.push(item('barrier_system', quoteCopy.panel.rules.barrier))
  if (choices.installation === 'yes') list.push(item('turnkey_installation', quoteCopy.panel.rules.installation))
  return list
}

export const scenarioComplete = (choices: QuoteChoices) => choices.projectType !== ''

export function setupErrors(choices: QuoteChoices): Record<string, string> {
  const errors: Record<string, string> = {}
  if (choices.projectType === 'paid' && choices.payments.length === 0) {
    errors.payment_methods = quoteCopy.setup.paymentRequired
  }
  if (!choices.barrier) errors.needs_barrier = quoteCopy.setup.barrierRequired
  if (!choices.installation) errors.needs_turnkey_installation = quoteCopy.setup.installationRequired
  return errors
}

export type SummaryRow = { key: string; label: string; value: string; pending: boolean }

const { rows, values } = quoteCopy.panel

function yesNo(value: YesNo | '') {
  return value === '' ? values.notSelected : value === 'yes' ? values.yes : values.no
}

export function summaryRows(choices: QuoteChoices): SummaryRow[] {
  const { projectType, payments } = choices
  const paymentLabels = payments.map((method) => quoteCopy.setup.payment.options[method].label)
  const payment =
    projectType === 'subscription'
      ? values.noPaymentNeeded
      : paymentLabels.length > 0
        ? paymentLabels.join(' + ')
        : values.notSelected
  return [
    {
      key: 'projectType',
      label: rows.projectType,
      value: projectType ? quoteCopy.scenario.options[projectType].label : values.notSelected,
      pending: !projectType,
    },
    { key: 'payment', label: rows.payment, value: payment, pending: payment === values.notSelected },
    { key: 'barrier', label: rows.barrier, value: yesNo(choices.barrier), pending: !choices.barrier },
    { key: 'installation', label: rows.installation, value: yesNo(choices.installation), pending: !choices.installation },
  ]
}
