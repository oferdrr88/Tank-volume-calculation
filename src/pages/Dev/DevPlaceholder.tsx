import { useNavigate } from 'react-router-dom'
import { ArrowRight, Wrench } from 'lucide-react'

interface DevPlaceholderProps {
  pageNumber: 1 | 2 | 3
}

export function DevPlaceholder({ pageNumber }: DevPlaceholderProps) {
  const navigate = useNavigate()

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-4">
      <div className="relative">
        <div className="text-8xl font-extrabold text-gray-100 select-none">404</div>
        <Wrench
          size={48}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-spin"
          style={{ animationDuration: '3s' }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-700">פיתוח {pageNumber}</h2>
        <p className="text-gray-400 text-sm">עמוד זה נמצא בפיתוח פעיל – בקרוב</p>
      </div>

      <div className="flex gap-2 mt-2">
        {([1, 2, 3] as const).map(n => (
          <span
            key={n}
            className={`w-2 h-2 rounded-full transition-colors ${
              n === pageNumber ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-blue-600 active:scale-95 transition-all duration-150"
      >
        <ArrowRight size={18} />
        חזרה לדשבורד
      </button>
    </main>
  )
}
