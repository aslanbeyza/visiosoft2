/*
 * PDF kipi: arka uçtaki PDF üretimi (backend/scripts/generate-pdf.mjs) sayfayı `?pdf=1` ile açar ve kaydırmadan yazdırır.
 * Bu kipte açılış perdesi, rota perdesi, navbar (ve gizlenme davranışı, html[data-navbar]) ile WhatsApp düğmesi çizilmez;
 * böylece /saha-kullanim-kilavuzu çıktısı temiz kalır.
 */
export function isPdfSearch(search: string): boolean {
  return new URLSearchParams(search).get('pdf') === '1'
}

/** Modül yüklenirken (ilk boyamadan önce) karar vermek için. */
export function isPdfRender(): boolean {
  return typeof window !== 'undefined' && isPdfSearch(window.location.search)
}
