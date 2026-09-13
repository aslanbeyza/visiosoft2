import tr from './tr.json'

export const messages: Record<string, string> = tr

export function translate(key: string) {
  return messages[key] || key
}
