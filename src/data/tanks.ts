import type { Tank } from '../types/tank.types'

export const MAX_FILL_PCT = 97

export const TANKS: Tank[] = [
  { id: 4,  volume: 20000  },
  { id: 5,  volume: 20000  },
  { id: 6,  volume: 30000  },
  { id: 7,  volume: 40000  },
  { id: 8,  volume: 40000  },
  { id: 9,  volume: 70000  },
  { id: 10, volume: 70000  },
  { id: 11, volume: 100000 },
  { id: 12, volume: 100000 },
  { id: 13, volume: 100000 },
  { id: 14, volume: 150000 },
]

export function getTankById(id: number): Tank | undefined {
  return TANKS.find(tank => tank.id === id)
}
