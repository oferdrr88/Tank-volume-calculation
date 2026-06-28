import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { type LucideIcon, Droplets, Wrench, Menu, X, RotateCcw, BarChart3, Settings2 } from 'lucide-react'

interface NavItem {
  label: string
  to?: string
  onAction?: () => void
  Icon: LucideIcon
  dashboardOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'איפוס מיכלים', Icon: RotateCcw, dashboardOnly: true },
  { label: 'בפיתוח', to: '/dev/2', Icon: BarChart3 },
  { label: 'בפיתוח', to: '/dev/3', Icon: Settings2 },
]

interface NavButtonProps {
  item: NavItem
  onClick?: () => void
  dropdown?: boolean
}

function NavButton({ item, onClick, dropdown = false }: NavButtonProps) {
  const navigate = useNavigate()
  const [clicked, setClicked] = useState(false)
  const { label, to, onAction, Icon } = item

  function handleClick() {
    setClicked(true)
    setTimeout(() => {
      setClicked(false)
      onClick?.()
      if (onAction) onAction()
      else if (to) navigate(to)
    }, 220)
  }

  if (dropdown) {
    return (
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full text-right
          transition-all duration-150
          ${clicked
            ? 'scale-95 bg-white/15 text-white/85'
            : 'text-white/85 hover:bg-green-500/15 hover:text-green-400'}
        `}
      >
        <Icon size={18} className={clicked ? 'text-primary animate-spin' : 'text-primary group-hover:text-green-400'} />
        {label}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
        border transition-all duration-150
        ${clicked
          ? 'scale-95 bg-white/20 border-white/20 text-white/80'
          : 'border-white/20 text-white/80 hover:bg-green-500/15 hover:text-green-400 hover:border-green-500/40'}
      `}
    >
      <Wrench size={13} className={clicked ? 'animate-spin' : ''} />
      {label}
    </button>
  )
}

interface AppHeaderProps {
  title?: string
  onResetTanks?: () => void
}

export function AppHeader({ title = 'מחשבון נפח מיכל', onResetTanks }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [time, setTime] = useState(() => new Date())
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isTankPage = pathname.startsWith('/tank/')
  const visibleItems = NAV_ITEMS
    .filter(item => !item.dashboardOnly || !isTankPage)
    .map(item => item.label === 'איפוס מיכלים' ? { ...item, onAction: onResetTanks } : item)

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative z-40">
      <header className="bg-gray-900 text-white px-6 py-3 flex items-center justify-center shadow-md">
        <div className="absolute left-4 top-0 bottom-0 flex items-center">
          <button
            onClick={() => navigate('/about')}
            className="h-[calc(100%-8px)] flex items-center hover:opacity-80 active:scale-95 transition-all duration-150"
            aria-label="אודות"
          >
            <img
              src="/לוגו.png"
              alt="S Flow Studio"
              className="h-full w-auto object-contain rounded-lg"
            />
          </button>

          <div className="hidden md:flex flex-col leading-tight ms-12">
            <span className="text-white font-mono text-sm font-bold tabular-nums tracking-wide">
              {time.toLocaleTimeString('he-IL')}
            </span>
            <span className="text-gray-400 font-mono text-xs tabular-nums hidden sm:block">
              {time.toLocaleDateString('he-IL')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Droplets className="text-primary" size={22} />
          <h1 className="text-lg font-bold tracking-wide">{title}</h1>
        </div>

        {/* כפתורים – מסך גדול */}
        <div className="absolute right-4 hidden md:flex items-center gap-2">
          {visibleItems.map((item, i) => (
            <NavButton key={i} item={item} />
          ))}
        </div>

        {/* כפתור המבורגר – מסך קטן */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="absolute right-4 md:hidden p-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition-all"
          aria-label="תפריט"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* תפריט נפתח – מסך קטן */}
      {menuOpen && (
        <div className="absolute top-full right-0 left-0 bg-gray-900 border-t border-white/10 shadow-lg md:hidden flex flex-col gap-1 p-3">
          {visibleItems.map((item, i) => (
            <NavButton
              key={i}
              item={item}
              dropdown
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
