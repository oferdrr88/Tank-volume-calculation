import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { WithdrawalCalculator } from './WithdrawalCalculator'
import { formatLiters } from '../../utils/format'
import type { Tank } from '../../types/tank.types'

interface WithdrawalPageProps {
  tank: Tank
  initialLevel: number
  setWithdrawalResult: (tankId: number, remaining: number) => void
}

export function WithdrawalPage({ tank, initialLevel, setWithdrawalResult }: WithdrawalPageProps) {
  const navigate = useNavigate()

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gray-50" style={{ zoom: 1.15 }}>
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-base font-bold text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowRight size={20} />
          דשבורד
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-purple-500 tracking-widest uppercase">משיכה ממקורות</p>
          <h2 className="text-3xl font-extrabold text-primary leading-tight">מיכל {tank.id}</h2>
          <p className="text-base font-semibold text-gray-500 mt-0.5">נפח: {formatLiters(tank.volume)}</p>
        </div>
        <div className="w-24" />
      </div>
      <WithdrawalCalculator
        tank={tank}
        initialLevel={initialLevel}
        setWithdrawalResult={setWithdrawalResult}
      />
    </main>
  )
}
