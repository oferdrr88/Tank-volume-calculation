interface ResultCardProps {
  label: string
  value: string
  variant?: 'blue' | 'white'
  sublabel?: string
}

export function ResultCard({ label, value, variant = 'white', sublabel }: ResultCardProps) {
  const isBlue = variant === 'blue'

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-1 rounded-2xl px-6 py-5 min-w-[160px] shadow-sm
        ${isBlue
          ? 'bg-primary text-white'
          : 'bg-white border border-gray-200 text-gray-800'
        }
      `}
    >
      <span className={`text-xs font-semibold uppercase tracking-wide ${isBlue ? 'text-blue-100' : 'text-gray-400'}`}>
        {label}
      </span>
      <span className={`text-2xl font-extrabold ${isBlue ? 'text-white' : 'text-primary'}`}>
        {value}
      </span>
      {sublabel && (
        <span className={`text-xs ${isBlue ? 'text-blue-200' : 'text-gray-400'}`}>
          {sublabel}
        </span>
      )}
    </div>
  )
}
