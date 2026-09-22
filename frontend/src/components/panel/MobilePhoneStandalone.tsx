'use client';

/**
 * TELEFON İKİZİ — PANELDEN BAĞIMSIZ KULLANIM
 *
 * Telefon ekranları demo dünyasını (otoparklar, borçlar, abonelikler, kartlar)
 * `PanelProvider` üzerinden okur. Panelin içinde bu sağlayıcı zaten kuruludur;
 * ana sayfadaki mobil bölümünde ise telefon TEK BAŞINA durduğu için kendi
 * sağlayıcısını yanında getirmesi gerekir. Bu dosya yalnızca o bağlamı kurar.
 *
 * Ayrı bir dosya olmasının nedeni kod bölünmesidir: ana sayfa bu bileşeni
 * `dynamic()` ile yükler, böylece 4.000 satırlık uygulama ikizi ve demo verisi
 * sayfanın ilk açılışına değil, ziyaretçi bölüme yaklaştığı ana yüklenir.
 */

import { PanelProvider } from './PanelProvider';
import { MobilePhone } from './MobileApp';

export default function MobilePhoneStandalone({ scale = 1 }: { scale?: number }) {
  return (
    <PanelProvider>
      <MobilePhone scale={scale} />
    </PanelProvider>
  );
}
