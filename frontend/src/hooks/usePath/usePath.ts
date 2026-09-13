import { pathFor } from '../../lib/index.ts'

export function usePath() {
  return (routeName: string, extra = '') => pathFor(routeName, extra)
}
