export interface Tank {
  id: number
  volume: number
}

export interface TankLevel {
  tankId: number
  levelPercent: number
}

export interface CalculationResult {
  liquidAmount: number
  freeSpace: number
  maxCapacity: number
  isOverLimit: boolean
}
