export type DeviceKind = 'laptop' | 'phone'

export type DeviceFrame = {
  src: string
  width: number
  height: number

  screen: { top: string; right: string; bottom: string; left: string }
}

export const deviceFrames: Record<DeviceKind, DeviceFrame> = {
  laptop: {
    src: '/img/software/zone-laptop-frame.png',
    width: 940,
    height: 632,
    screen: { top: '5.7%', right: '12.77%', bottom: '26.27%', left: '12.66%' },
  },
  phone: {
    src: '/img/software/zone-phone-frame.png',
    width: 490,
    height: 960,
    screen: { top: '6.04%', right: '6.73%', bottom: '3.96%', left: '6.73%' },
  },
}
