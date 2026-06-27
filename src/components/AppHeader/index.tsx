import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type LucideIcon, Droplets, Wrench, Menu, X, FlaskConical, BarChart3, Settings2 } from 'lucide-react'

interface NavItem {
  label: string
  to: string
  Icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { label: 'בפיתוח', to: '/dev/1', Icon: FlaskConical },
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
  const { label, to, Icon } = item

  function handleClick() {
    setClicked(true)
    setTimeout(() => {
      setClicked(false)
      onClick?.()
      navigate(to)
    }, 220)
  }

  if (dropdown) {
    return (
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full text-right
          text-white/85 hover:bg-white/10 hover:text-white
          transition-all duration-150
          ${clicked ? 'scale-95 bg-white/15' : ''}
        `}
      >
        <Icon size={18} className={`text-primary ${clicked ? 'animate-spin' : ''}`} />
        {label}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
        border border-white/20 text-white/80
        hover:bg-white/10 hover:text-white hover:border-white/40
        transition-all duration-150
        ${clicked ? 'scale-95 bg-white/20' : 'scale-100'}
      `}
    >
      <Wrench size={13} className={clicked ? 'animate-spin' : ''} />
      {label}
    </button>
  )
}

interface AppHeaderProps {
  title?: string
}

export function AppHeader({ title = 'מחשבון נפח מיכל' }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [time, setTime] = useState(() => new Date())
  const navigate = useNavigate()

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative z-40">
      <header className="bg-gray-900 text-white px-6 py-3 flex items-center justify-center shadow-md">
        <div className="absolute left-4 top-0 bottom-0 flex items-center gap-[10%]">
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

          <div className="flex flex-col leading-tight">
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
          {NAV_ITEMS.map((item, i) => (
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
          {NAV_ITEMS.map((item, i) => (
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
