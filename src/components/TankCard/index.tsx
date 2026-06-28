import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { TankCylinder } from '../TankCylinder'
import { formatLiters, formatPercent } from '../../utils/format'
import { calcTankVolume } from '../../utils/calc'
import type { Tank } from '../../types/tank.types'

interface TankCardProps {
  tank: Tank
  levelPercent: number
  withdrawalMode?: boolean
  withdrawalResult?: number
}

export function TankCard({ tank, levelPercent, withdrawalMode, withdrawalResult }: TankCardProps) {
  const navigate = useNavigate()
  const result = calcTankVolume(tank.volume, levelPercent)
  const showDual = withdrawalResult !== undefined
  const isNegative = showDual && withdrawalResult < 0
  const projectedPct = showDual && !isNegative ? (withdrawalResult / tank.volume) * 100 : 0

  const borderClass = withdrawalMode
    ? 'border-purple-400 ring-2 ring-purple-400/60'
    : 'border-gray-200'

  return (
    <button
      onClick={() => {
        if (withdrawalMode) {
          if (levelPercent === 0) {
            toast.warning(`מיכל מספר ${tank.id}`, { description: 'אין אפשרות משיכה', duration: 4000 })
            return
          }
          navigate(`/withdrawal/${tank.id}`)
        } else {
          navigate(`/tank/${tank.id}`)
        }
      }}
      className={`flex flex-col items-center gap-3 bg-white border ${borderClass} rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-yellow-400 hover:scale-125 hover:z-10 relative transition-all duration-200 cursor-pointer min-w-[155px]`}
      aria-label={`מיכל ${tank.id} – ${formatPercent(levelPercent)} מלא`}
    >
      <span className="text-base font-bold text-primary">מיכל</span>
      <span className="text-3xl font-extrabold text-primary">{tank.id}</span>

      {showDual ? (
        <div className="flex gap-2 items-end">
          <div className="flex flex-col items-center gap-1">
            <TankCylinder levelPercent={levelPercent} width={70} height={126} showLabel={false} />
            <span className="text-xs text-gray-400 font-semibold">עכשיו</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <TankCylinder levelPercent={isNegative ? 0 : projectedPct} width={70} height={126} showLabel={false} overrideColor="purple" />
            <span className="text-xs text-purple-500 font-semibold">אחרי</span>
          </div>
          <span className={`absolute top-2 left-2 text-white text-xs font-bold px-1.5 py-0.5 rounded-full ${isNegative ? 'bg-red-600' : 'bg-green-600'}`}>
            {isNegative ? `-${formatLiters(Math.abs(withdrawalResult))}` : formatLiters(withdrawalResult)}
          </span>
        </div>
      ) : (
        <TankCylinder levelPercent={levelPercent} width={112} height={168} showLabel={false} />
      )}

      <span className={`text-base font-bold ${
        levelPercent < 10 ? 'text-red-600' :
        levelPercent > 93 ? 'text-orange-500' :
        'text-green-600'
      }`}>
        {formatPercent(levelPercent)}
      </span>

      <div className="w-full border-t border-gray-100 pt-2 mt-1 flex flex-col gap-1.5">
        <InfoRow label="נפח מיכל" value={formatLiters(tank.volume)} color="text-gray-500" />
        <InfoRow
          label="כמות חלב"
          value={formatLiters(result.liquidAmount)}
          color={levelPercent < 10 ? 'text-red-600' : 'text-primary'}
        />
        <InfoRow
          label="חלב למילוי"
          value={formatLiters(Math.max(result.freeSpace, 0))}
          color="text-green-600"
        />
      </div>
    </button>
  )
}

function InfoRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center text-sm w-full">
      <span className={`font-bold ${color}`}>{value}</span>
      <span className="text-gray-400 font-medium">{label}</span>
    </div>
  )
}
