import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTankById } from '../../data/tanks'
import { WithdrawalPage } from './WithdrawalPage'

interface WithdrawalPageRouteProps {
  levels: Record<number, number>
  setWithdrawalResult: (tankId: number, remaining: number) => void
}

export function WithdrawalPageRoute({ levels, setWithdrawalResult }: WithdrawalPageRouteProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const tankId = Number(id)
  const tank = getTankById(tankId)

  useEffect(() => {
    if (!tank) navigate('/', { replace: true })
  }, [tank, navigate])

  if (!tank) return null

  return (
    <WithdrawalPage
      tank={tank}
      initialLevel={levels[tank.id] ?? 0}
      setWithdrawalResult={setWithdrawalResult}
    />
  )
}
