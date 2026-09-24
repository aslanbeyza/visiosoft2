import { createContext, useContext } from 'react'

export type CardGridContextValue = {
  columns: number

  position: number

  animateLayout: boolean
}

export const CardGridContext = createContext<CardGridContextValue>({ columns: 1, position: 0, animateLayout: false })

export function useCardGrid() {
  return useContext(CardGridContext)
}
