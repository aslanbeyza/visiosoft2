'use client';

import { PanelProvider } from './PanelProvider';
import { MobilePhone } from './MobileApp';

export default function MobilePhoneStandalone({ scale = 1 }: { scale?: number }) {
  return (
    <PanelProvider>
      <MobilePhone scale={scale} />
    </PanelProvider>
  );
}
