/**
 * Page details for each office (short place name, district, note, directions link).
 * Addresses and labels come from the single source `company.locations`.
 */
import { company } from '../../data/company.ts'

export type LocationCluster = 'perpa' | 'basaksehir'

type LocationDetail = {
  place: string
  district: string
  cluster: LocationCluster
  note?: string
  mapUrl: string
}

const details: Record<string, LocationDetail> = {
  showroom: {
    place: 'Perpa Ticaret Merkezi A Blok · Kat 8',
    district: 'Şişli',
    cluster: 'perpa',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Perpa%20Ticaret%20Merkezi%20A%20Blok%20Kat%208%20No%201036%20%C5%9Ei%C5%9Fli%20%C4%B0stanbul',
  },
  depo: {
    place: 'Perpa Ticaret Merkezi A Blok · Kat 4',
    district: 'Şişli',
    cluster: 'perpa',
    note: 'Araç ile 4. kata giriş yaparak ürün teslim alabilirsiniz.',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Perpa%20Ticaret%20Merkezi%20A%20Blok%20Kat%204%20No%20277%2034384%20%C5%9Ei%C5%9Fli%20%C4%B0stanbul',
  },
  'living-lab': {
    place: 'Başakşehir İnovasyon Merkezi',
    district: 'Başakşehir',
    cluster: 'basaksehir',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Ba%C5%9Fak%C5%9Fehir%20%C4%B0novasyon%20Merkezi%20Abd%C3%BClhamithan%20Cd%20No%205',
  },
  teknopark: {
    place: 'YTÜ İkitelli Teknopark',
    district: 'Başakşehir',
    cluster: 'basaksehir',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Y%C4%B1ld%C4%B1z%20Teknik%20%C3%9Cniversitesi%20%C4%B0kitelli%20Teknopark%201B24',
  },
}

const fallback = (address: string): LocationDetail => ({
  place: address,
  district: 'İstanbul',
  cluster: 'basaksehir',
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
})

export type OfficeLocation = LocationDetail & {
  key: string
  label: string
  address: string
  index: number
}

export const officeLocations: OfficeLocation[] = company.locations.map((location, index) => ({
  ...(details[location.key] ?? fallback(location.address)),
  ...location,
  index,
}))

export const padIndex = (value: number) => String(value).padStart(2, '0')
