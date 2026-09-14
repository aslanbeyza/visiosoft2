/** Form kitinin varsayılan Türkçe metinleri; sayfaya özel metinler prop ile geçilir. */
export const formCopy = {
  /** Hata özetinin başlığı. */
  errorSummaryTitle: 'Lütfen işaretli alanları kontrol edin.',
  requiredError: 'Bu alan zorunludur.',
  /** Field etiketi bilinen boş zorunlu alan; özet listesinde hangi alanın eksik olduğu okunur. */
  requiredFieldError: (label: string) => `${label} alanı zorunludur.`,
  emailError: 'Geçerli bir e-posta adresi girin.',
  urlError: 'Geçerli bir web adresi girin.',
  invalidError: 'Bu alan geçerli bir değer içermiyor.',
  minLengthError: (min: number) => `En az ${min.toLocaleString('tr-TR')} karakter girin.`,
  maxLengthError: (max: number) => `En fazla ${max.toLocaleString('tr-TR')} karakter girin.`,
  rangeError: 'Değer izin verilen aralığın dışında.',
  /** Ekran okuyucu için zorunlu alan işareti. */
  requiredMark: 'zorunlu',
  /** Bal küpü alanının etiketi (görünmez, yalnızca botlar doldurur). */
  honeypotLabel: 'Web sitesi',
  stepper: {
    label: 'Adımlar',
    done: 'tamamlandı',
    current: 'geçerli adım',
    position: (index: number, total: number) => `Adım ${index} / ${total}`,
  },
} as const
