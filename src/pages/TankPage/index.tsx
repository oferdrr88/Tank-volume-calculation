import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getTankById } from '../../data/tanks'
import { TankPage } from './TankPage'

interface TankPageRouteProps {
  levels: Record<number, number>
  setTankLevel: (tankId: number, levelPercent: number) => void
}

export function TankPageRoute({ levels, setTankLevel }: TankPageRouteProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const tankId = Number(id)
  const tank = getTankById(tankId)

  useEffect(() => {
    if (!tank) navigate('/', { replace: true })
  }, [tank, navigate])

  if (!tank) return null

  return (
    <TankPage
      tank={tank}
      initialLevel={levels[tank.id] ?? 0}
      onLevelChange={(level) => setTankLevel(tank.id, level)}
    />
  )
}
