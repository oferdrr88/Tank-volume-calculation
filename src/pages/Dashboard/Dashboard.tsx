import { TANKS } from '../../data/tanks'
import { TankCard } from '../../components/TankCard'

interface DashboardProps {
  levels: Record<number, number>
  withdrawalMode?: boolean
  withdrawalResults?: Record<number, number>
}

export function Dashboard({ levels, withdrawalMode, withdrawalResults }: DashboardProps) {
  return (
    <main className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-primary">סקירת מיכלים</h2>
        {withdrawalMode && (
          <p className="text-purple-500 font-semibold text-sm mt-1">מחשבון משיכה ממקורות</p>
        )}
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 justify-items-center" style={{ zoom: 0.85 }}>
        {TANKS.map(tank => (
          <TankCard
            key={tank.id}
            tank={tank}
            levelPercent={levels[tank.id] ?? 0}
            withdrawalMode={withdrawalMode}
            withdrawalResult={withdrawalResults?.[tank.id]}
          />
        ))}
      </div>
    </main>
  )
}
