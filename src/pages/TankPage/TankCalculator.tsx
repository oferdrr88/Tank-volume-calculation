import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { calcTankVolume } from '../../utils/calc'
import { formatLiters, formatPercent } from '../../utils/format'
import { MAX_FILL_PCT } from '../../data/tanks'
import { ResultCard } from '../../components/ResultCard'
import { TankCylinder } from '../../components/TankCylinder'
import type { Tank, CalculationResult } from '../../types/tank.types'

const POPUP_SECONDS = 5

function PopupRow({ label, value, valueClass, bg }: {
  label: string
  value: string
  valueClass: string
  bg: string
}) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 rounded-xl ${bg}`}>
      <span className={`text-xl font-extrabold ${valueClass}`}>{value}</span>
      <span className="text-base font-semibold text-gray-500">{label}</span>
    </div>
  )
}

interface TankCalculatorProps {
  tank: Tank
  initialLevel: number
  onLevelChange: (level: number) => void
}

export function TankCalculator({ tank, initialLevel, onLevelChange }: TankCalculatorProps) {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState(initialLevel > 0 ? String(initialLevel) : '')
  const [displayLevel, setDisplayLevel] = useState(initialLevel)
  const [result, setResult] = useState<CalculationResult | null>(
    initialLevel > 0 ? calcTankVolume(tank.volume, initialLevel) : null
  )
  const [showPopup, setShowPopup] = useState(false)
  const [countdown, setCountdown] = useState(POPUP_SECONDS)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!showPopup) return
    setCountdown(POPUP_SECONDS)

    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setShowPopup(false)
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current!)
  }, [showPopup, navigate])

  function handleCalc() {
    const parsed = parseFloat(inputValue.replace(',', '.'))

    if (isNaN(parsed)) {
      toast.error('יש להזין ערך אחוז תקין')
      return
    }
    if (parsed < 0 || parsed > 100) {
      toast.error('הערך חייב להיות בין 0 ל-100')
      return
    }

    const calc = calcTankVolume(tank.volume, parsed)
    setResult(calc)
    setDisplayLevel(parsed)
    onLevelChange(parsed)
    setInputValue('')

    if (calc.isOverLimit) {
      toast.error('⚠️ בדוק שאין גלישת חלב מהמיכל! – מעל גבול 97%', { duration: 6000 })
    }

    setShowPopup(true)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleCalc()
  }

  function handleClosePopup() {
    clearInterval(intervalRef.current!)
    setShowPopup(false)
    navigate('/')
  }

  const maxCapacityLiters = formatLiters(tank.volume * (MAX_FILL_PCT / 100))

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 p-6 w-full">

        {/* גליל */}
        <div className="flex flex-col items-center gap-3">
          <TankCylinder levelPercent={displayLevel} width={140} height={220} showLabel />
          <span className="text-base text-gray-400 font-semibold">
            קיבולת מקס׳ ({MAX_FILL_PCT}%): {maxCapacityLiters}
          </span>
        </div>

        {/* פאנל */}
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <div className="flex flex-col gap-3">
            <ResultCard
              label="כמות חלב"
              value={result ? formatLiters(result.liquidAmount) : '—'}
              variant="blue"
              sublabel={result ? formatPercent(displayLevel) : undefined}
            />
            <ResultCard
              label="חלב למילוי"
              value={result ? formatLiters(Math.max(result.freeSpace, 0)) : '—'}
              variant="white"
              sublabel={result?.isOverLimit ? '⚠ מעל הגבול התפעולי' : undefined}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base font-bold text-gray-600 text-right">
              גובה חלב (%)
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCalc}
                className="flex-shrink-0 px-6 py-3 bg-primary text-white text-base font-extrabold rounded-xl hover:bg-blue-600 active:scale-95 transition-all duration-150"
              >
                חשב
              </button>
              <input
                ref={inputRef}
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="0 – 100"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-left text-gray-800 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary transition"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popup תוצאות */}
      {showPopup && result && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={handleClosePopup}
        >
          <div
            className={`bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center gap-6 ${result.isOverLimit ? 'ring-4 ring-red-500' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            {/* אזהרת גלישה – מעל 97% */}
            {result.isOverLimit && (
              <div className="w-full bg-red-600 text-white rounded-2xl px-5 py-4 flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <p className="text-base font-extrabold leading-tight">בדוק שאין גלישת חלב מהמיכל!</p>
                  <p className="text-sm font-medium text-red-100 mt-0.5">המיכל מעל גבול {MAX_FILL_PCT}% – סכנת גלישה</p>
                </div>
              </div>
            )}

            {/* כותרת */}
            <div className="text-center border-b border-gray-100 pb-4 w-full">
              <p className="text-base text-gray-400 font-semibold tracking-wide uppercase">תוצאות חישוב</p>
              <h3 className={`text-4xl font-extrabold mt-1 ${result.isOverLimit ? 'text-red-600' : 'text-primary'}`}>מיכל {tank.id}</h3>
            </div>

            {/* תוצאות */}
            <div className="w-full flex flex-col gap-2">
              <PopupRow
                label="כמות חלב"
                value={formatLiters(result.liquidAmount)}
                valueClass="text-primary"
                bg="bg-blue-50"
              />
              <PopupRow
                label="חלב למילוי"
                value={formatLiters(Math.max(result.freeSpace, 0))}
                valueClass="text-green-600"
                bg="bg-green-50"
              />
              <PopupRow
                label="קיבולת מקס׳"
                value={formatLiters(result.maxCapacity)}
                valueClass="text-gray-700"
                bg="bg-gray-50"
              />
              <PopupRow
                label="נפח מיכל"
                value={formatLiters(tank.volume)}
                valueClass="text-gray-500"
                bg=""
              />
            </div>

            {/* countdown */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(countdown / POPUP_SECONDS) * 100}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-gray-400">
                חוזר לדשבורד בעוד <span className="text-primary font-extrabold">{countdown}</span> שניות
              </p>
            </div>

            <button
              onClick={handleClosePopup}
              className="w-full py-3 bg-primary text-white text-base font-extrabold rounded-xl hover:bg-blue-600 active:scale-95 transition-all tracking-wide"
            >
              חזרה לדשבורד עכשיו
            </button>
          </div>
        </div>
      )}
    </>
  )
}
