import { X } from 'lucide-react'
import { TANKS } from '../../data/tanks'
import { formatPercent } from '../../utils/format'

interface ResetModalProps {
  levels: Record<number, number>
  onResetAll: () => void
  onResetTank: (tankId: number) => void
  onClose: () => void
}

export function ResetModal({ levels, onResetAll, onResetTank, onClose }: ResetModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full mx-4 flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="סגור"
          >
            <X size={18} />
          </button>
          <h2 className="text-lg font-extrabold text-gray-800">איפוס מיכלים</h2>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-400 text-right">מאפס את כל המיכלים ל-0%</p>
          <button
            onClick={onResetAll}
            className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-base rounded-xl transition-all duration-150"
          >
            איפוס כללי
          </button>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold text-gray-400 text-right">בחר מיכל לאיפוס</p>
          <div className="grid grid-cols-4 gap-2">
            {TANKS.map(tank => {
              const level = levels[tank.id] ?? 0
              return (
                <button
                  key={tank.id}
                  onClick={() => onResetTank(tank.id)}
                  className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl border border-gray-200 hover:border-red-400 hover:bg-red-50 active:scale-95 transition-all duration-150"
                >
                  <span className="text-sm font-extrabold text-primary">{tank.id}</span>
                  <span className={`text-xs font-bold ${level === 0 ? 'text-gray-300' : level > 93 ? 'text-orange-500' : 'text-green-600'}`}>
                    {formatPercent(level)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
