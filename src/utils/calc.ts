import { MAX_FILL_PCT } from '../data/tanks'
import type { CalculationResult } from '../types/tank.types'

export function calcTankVolume(volume: number, levelPercent: number): CalculationResult {
  const maxCapacity = volume * (MAX_FILL_PCT / 100)
  const liquidAmount = volume * (levelPercent / 100)
  const freeSpace = maxCapacity - liquidAmount
  const isOverLimit = levelPercent > MAX_FILL_PCT

  return { liquidAmount, freeSpace, maxCapacity, isOverLimit }
}
