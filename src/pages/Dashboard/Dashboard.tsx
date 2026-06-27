import { TANKS } from '../../data/tanks'
import { TankCard } from '../../components/TankCard'

interface DashboardProps {
  levels: Record<number, number>
}

export function Dashboard({ levels }: DashboardProps) {
  return (
    <main className="p-6">
      <h2 className="text-xl font-bold text-primary mb-6 text-center">סקירת מיכלים</h2>
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 justify-items-center" style={{ zoom: 0.85 }}>
        {TANKS.map(tank => (
          <TankCard
            key={tank.id}
            tank={tank}
            levelPercent={levels[tank.id] ?? 0}
          />
        ))}
      </div>
    </main>
  )
}
