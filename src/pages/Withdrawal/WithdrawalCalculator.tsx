import { useState, useEffect, useRef, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatLiters, formatPercent } from '../../utils/format'
import { TankCylinder } from '../../components/TankCylinder'
import type { Tank } from '../../types/tank.types'

const POPUP_SECONDS = 5

interface WithdrawalResult {
  currentMilk: number
  remaining: number
  totalWithdraw: number
  projectedPct: number
  isNegative: boolean
}

interface WithdrawalCalculatorProps {
  tank: Tank
  initialLevel: number
  setWithdrawalResult: (tankId: number, remaining: number) => void
}

export function WithdrawalCalculator({ tank, initialLevel, setWithdrawalResult }: WithdrawalCalculatorProps) {
  const navigate = useNavigate()
  const [lactoseInput, setLactoseInput] = useState('')
  const [fillInput, setFillInput] = useState('')
  const [result, setResult] = useState<WithdrawalResult | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [countdown, setCountdown] = useState(POPUP_SECONDS)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lactoseRef = useRef<HTMLInputElement>(null)

  const currentMilk = tank.volume * (initialLevel / 100)

  useEffect(() => {
    const t = setTimeout(() => lactoseRef.current?.focus(), 100)
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
          if (result) setWithdrawalResult(tank.id, result.remaining)
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [showPopup, navigate, result, setWithdrawalResult, tank.id])

  function handleCalc() {
    const lactose = parseFloat(lactoseInput.replace(',', '.')) || 0
    const fill = parseFloat(fillInput.replace(',', '.')) || 0
    const totalWithdraw = lactose + fill
    const remaining = currentMilk - totalWithdraw
    const isNegative = remaining < 0
    const projectedPct = Math.max(0, (remaining / tank.volume) * 100)
    setResult({ currentMilk, remaining, totalWithdraw, projectedPct, isNegative })
    setShowPopup(true)
  }

  function handleClosePopup() {
    clearInterval(intervalRef.current!)
    setShowPopup(false)
    if (result) setWithdrawalResult(tank.id, result.remaining)
    navigate('/')
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 p-6 w-full">
        <div className="flex gap-4 items-end">
          <div className="flex flex-col items-center gap-1">
            <TankCylinder levelPercent={initialLevel} width={120} height={190} showLabel />
            <span className="text-xs text-gray-400 font-semibold">עכשיו</span>
          </div>
          {result && (
            <div className="flex flex-col items-center gap-1">
              <TankCylinder levelPercent={result.projectedPct} width={90} height={145} showLabel={false} overrideColor="purple" />
              <span className="text-xs text-purple-500 font-semibold">אחרי</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-base font-bold text-gray-600 text-right">כמות למשיכה בליטרים</label>
            <div className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-primary text-base font-extrabold text-left" dir="ltr">
              {formatLiters(currentMilk)}
            </div>
          </div>
          <InputField label="משיכת לקטוז (ל׳)" value={lactoseInput} onChange={setLactoseInput} inputRef={lactoseRef} />
          <InputField label="משיכה למילוי (ל׳)" value={fillInput} onChange={setFillInput} />
          <button
            onClick={handleCalc}
            className="w-full py-3 bg-purple-600 text-white text-base font-extrabold rounded-xl hover:bg-purple-700 active:scale-95 transition-all duration-150"
          >
            חשב
          </button>
        </div>
      </div>

      {showPopup && result && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm" onClick={handleClosePopup}>
          <div
            className={`bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center gap-6 ${result.isNegative ? 'ring-4 ring-red-500' : 'ring-4 ring-purple-400'}`}
            onClick={e => e.stopPropagation()}
          >
            {result.isNegative && (
              <div className="w-full bg-red-600 text-white rounded-2xl px-5 py-4 flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <p className="text-base font-extrabold leading-tight">המשיכה עולה על כמות החלב!</p>
                  <p className="text-sm font-medium text-red-100 mt-0.5">מחסור: {formatLiters(Math.abs(result.remaining))}</p>
                </div>
              </div>
            )}
            <div className="text-center border-b border-gray-100 pb-4 w-full">
              <p className="text-base text-purple-500 font-semibold tracking-wide">תוצאת משיכה</p>
              <h3 className="text-4xl font-extrabold mt-1 text-primary">מיכל {tank.id}</h3>
            </div>
            <div className="w-full flex flex-col gap-2">
              <PopupRow label="כמות חלב קיימת" value={formatLiters(result.currentMilk)} valueClass="text-primary" bg="bg-blue-50" />
              <PopupRow label="סה״כ משיכה" value={formatLiters(result.totalWithdraw)} valueClass="text-orange-500" bg="bg-orange-50" />
              <PopupRow
                label="נשאר לאחר משיכה"
                value={result.isNegative ? `-${formatLiters(Math.abs(result.remaining))}` : formatLiters(result.remaining)}
                valueClass={result.isNegative ? 'text-red-600' : 'text-purple-600'}
                bg={result.isNegative ? 'bg-red-50' : 'bg-purple-50'}
              />
              <PopupRow label="אחוז נשאר" value={formatPercent(result.projectedPct)} valueClass="text-gray-700" bg="bg-gray-50" />
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(countdown / POPUP_SECONDS) * 100}%` }} />
              </div>
              <p className="text-sm font-semibold text-gray-400">
                חוזר לדשבורד בעוד <span className="text-purple-600 font-extrabold">{countdown}</span> שניות
              </p>
            </div>
            <button onClick={handleClosePopup} className="w-full py-3 bg-purple-600 text-white text-base font-extrabold rounded-xl hover:bg-purple-700 active:scale-95 transition-all tracking-wide">
              חזרה לדשבורד עכשיו
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function InputField({ label, value, onChange, inputRef }: {
  label: string
  value: string
  onChange: (v: string) => void
  inputRef?: RefObject<HTMLInputElement>
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-base font-bold text-gray-600 text-right">{label}</label>
      <input
        ref={inputRef}
        type="number"
        min={0}
        step={0.1}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-left text-gray-800 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        dir="ltr"
      />
    </div>
  )
}

function PopupRow({ label, value, valueClass, bg }: { label: string; value: string; valueClass: string; bg: string }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 rounded-xl ${bg}`}>
      <span className={`text-xl font-extrabold ${valueClass}`}>{value}</span>
      <span className="text-base font-semibold text-gray-500">{label}</span>
    </div>
  )
}
