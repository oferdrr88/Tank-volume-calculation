import { useState, useCallback } from 'react'
import { TANKS } from '../data/tanks'

const STORAGE_KEY = 'tank-levels'

function loadLevels(): Record<number, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<number, number>
  } catch {
    return {}
  }
}

function saveLevels(levels: Record<number, number>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(levels))
}

const initialLevels: Record<number, number> = (() => {
  const saved = loadLevels()
  const defaults: Record<number, number> = {}
  TANKS.forEach(tank => {
    defaults[tank.id] = saved[tank.id] ?? 0
  })
  return defaults
})()

export function useTankLevels() {
  const [levels, setLevels] = useState<Record<number, number>>(initialLevels)

  const setTankLevel = useCallback((tankId: number, levelPercent: number) => {
    setLevels(prev => {
      const next = { ...prev, [tankId]: levelPercent }
      saveLevels(next)
      return next
    })
  }, [])

  const resetAllTanks = useCallback(() => {
    const zeros: Record<number, number> = {}
    TANKS.forEach(tank => { zeros[tank.id] = 0 })
    setLevels(zeros)
    saveLevels(zeros)
  }, [])

  return { levels, setTankLevel, resetAllTanks }
}
