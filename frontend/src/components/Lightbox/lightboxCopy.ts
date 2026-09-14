export const lightboxCopy = {
  hint: 'Yakınlaştırmak için görsele tıklayın.',
  keyboardHint: 'Enter yakınlaştırır; yakınken ok tuşları görüntüyü kaydırır.',
  zoomIn: 'Yakınlaştır',
  zoomOut: 'Uzaklaştır',
  close: 'Kapat',
  previous: 'Önceki görsel',
  next: 'Sonraki görsel',
} as const

export type LightboxLabels = { [K in keyof typeof lightboxCopy]: string }
