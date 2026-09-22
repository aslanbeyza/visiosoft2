/**
 * TÜRKÇE METİN YARDIMCILARI
 *
 * JavaScript'in `toUpperCase()`'i yerel ayardan bağımsızdır: "i" harfini
 * "I" yapar. Türkçede doğrusu "İ"dir. Site baştan sona büyük harfli
 * kurumsal etiketler kullandığı için bu fark her yerde göze batıyordu:
 *
 *   'Belediye ve kamu'.toUpperCase()              → BELEDIYE VE KAMU  ✗
 *   'Belediye ve kamu'.toLocaleUpperCase('tr-TR') → BELEDİYE VE KAMU  ✓
 *   'İnsansız'.toUpperCase()                      → İNSANSIZ (sorunsuz)
 *   'Kimlik'.toUpperCase()                        → KIMLIK            ✗
 *
 * Aynı sorun küçük harfte de var: "I" → "i" olmalı değil "ı" olmalı.
 *
 * CSS'teki `text-transform: uppercase` bu işi doğru yapar (kök öğede
 * lang="tr" tanımlı), sorun yalnızca JS tarafındadır — bu yüzden
 * çeviriyi JS'te yapan her yer bu yardımcıyı kullanır.
 */
export const upperTR = (s: string) => s.toLocaleUpperCase('tr-TR');

export const lowerTR = (s: string) => s.toLocaleLowerCase('tr-TR');
