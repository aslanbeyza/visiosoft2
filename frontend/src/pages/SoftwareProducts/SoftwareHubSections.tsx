import CardGrid, { LinkCard } from '../../components/CardGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { solutionHubCopy } from './softwareHubCopy.ts'
import styles from './SoftwareHubSections.module.css'

export function SolutionsHubSection() {
  const path = usePath()

  return (
    <Section id="cozumler" tone="surface" spacing="lg" labelledBy="hub-cozumler-title">
      <SectionHeading
        id="hub-cozumler-title"
        eyebrow={solutionHubCopy.eyebrow}
        title={solutionHubCopy.title}
        lead={solutionHubCopy.lead}
        className={styles.sectionHeading}
      />
      <CardGrid columns={3} label={solutionHubCopy.listLabel}>
        {solutionHubCopy.items.map((item, index) => (
          <LinkCard
            key={item.route}
            to={path(item.route)}
            index={index + 1}
            title={item.title}
            description={item.description}
            action={solutionHubCopy.action}
          />
        ))}
      </CardGrid>
    </Section>
  )
}
