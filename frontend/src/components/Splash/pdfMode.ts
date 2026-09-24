
export function isPdfSearch(search: string): boolean {
  return new URLSearchParams(search).get('pdf') === '1'
}

export function isPdfRender(): boolean {
  return typeof window !== 'undefined' && isPdfSearch(window.location.search)
}
