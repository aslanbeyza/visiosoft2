import { useLocation } from 'react-router-dom'
import LeadForm, { LeadAside, LeadLayout } from '../../components/LeadForm/index.ts'
import type { LeadKind } from '../../components/LeadForm/buildLeadBody.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import QuoteFastPath from './QuoteFastPath.tsx'
import { quoteCopy as copy } from './quoteCopy.ts'

const topicKinds = copy.form.topics.options.map((option) => option.kind)

/** The discovery URL redirects here (Router.tsx) with that topic preselected. */
function topicFromState(state: unknown): LeadKind {
  if (typeof state === 'object' && state !== null && 'topic' in state) {
    const topic = topicKinds.find((kind) => kind === state.topic)
    if (topic) return topic
  }
  return 'quote'
}

/** Single lead form: quote, online discovery and other questions share one form. */
export default function QuotePage() {
  const path = usePath()
  const topic = topicFromState(useLocation().state)

  return (
    <>
      <Seo title={copy.seo.title} description={copy.seo.description} canonicalPath={path('quote.index')} />
      <LeadLayout
        id={copy.form.id}
        eyebrow={copy.form.eyebrow}
        title={copy.form.title}
        lead={copy.form.lead}
        headingAs="h1"
        aside={<LeadAside steps={[...copy.steps]} />}
      >
        <QuoteFastPath />
        <LeadForm
          key={topic}
          kind="quote"
          label={copy.form.title}
          submitLabel={copy.form.submit}
          messageExample={copy.form.messageExample}
          topics={{ legend: copy.form.topics.legend, options: [...copy.form.topics.options], initial: topic }}
        />
      </LeadLayout>
    </>
  )
}
