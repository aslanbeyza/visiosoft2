
export function scrollToSection(sectionId: string, headingId: string, reduce: boolean) {
  const section = document.getElementById(sectionId)
  if (!section) return false

  const heading = document.getElementById(headingId) ?? section
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
  const focus = () => heading.focus({ preventScroll: true })

  if (reduce) {
    section.scrollIntoView({ behavior: 'auto', block: 'start' })
    focus()
    return true
  }

  let done = false
  let timer = 0
  const finish = () => {
    if (done) return
    done = true
    window.removeEventListener('scrollend', finish)
    window.clearTimeout(timer)
    focus()
  }

  window.addEventListener('scrollend', finish)

  timer = window.setTimeout(finish, 1400)
  section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}
