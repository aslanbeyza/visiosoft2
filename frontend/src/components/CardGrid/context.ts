import { createContext, useContext } from 'react'

export type CardGridContextValue = {
  columns: number
  /** Kartın ızgaradaki sırası; aynı satırdaki kartların gecikmesi buradan türetilir. */
  position: number
  /** true ise kartlar konum değişimlerini (filtre vb.) layout animasyonuyla izler. */
  animateLayout: boolean
}

export const CardGridContext = createContext<CardGridContextValue>({ columns: 1, position: 0, animateLayout: false })

export function useCardGrid() {
  return useContext(CardGridContext)
}
