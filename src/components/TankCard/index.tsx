import { useNavigate } from 'react-router-dom'
import { TankCylinder } from '../TankCylinder'
import { formatLiters, formatPercent } from '../../utils/format'
import { calcTankVolume } from '../../utils/calc'
import type { Tank } from '../../types/tank.types'

interface TankCardProps {
  tank: Tank
  levelPercent: number
}

export function TankCard({ tank, levelPercent }: TankCardProps) {
  const navigate = useNavigate()
  const result = calcTankVolume(tank.volume, levelPercent)

  return (
    <button
      onClick={() => navigate(`/tank/${tank.id}`)}
      className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-primary hover:scale-105 transition-all duration-200 cursor-pointer min-w-[155px]"
      aria-label={`מיכל ${tank.id} – ${formatPercent(levelPercent)} מלא`}
    >
      {/* כותרת */}
      <span className="text-base font-bold text-primary">מיכל</span>
      <span className="text-3xl font-extrabold text-primary">{tank.id}</span>

      {/* גליל */}
      <TankCylinder levelPercent={levelPercent} width={112} height={168} showLabel={false} />

      {/* אחוז מילוי */}
      <span className={`text-base font-bold ${
        levelPercent < 10 ? 'text-red-600' :
        levelPercent > 93 ? 'text-orange-500' :
        'text-green-600'
      }`}>
        {formatPercent(levelPercent)}
      </span>

      {/* מידע תחתון */}
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
