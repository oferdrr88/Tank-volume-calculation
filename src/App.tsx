import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { AppHeader } from './components/AppHeader'
import { Dashboard } from './pages/Dashboard'
import { TankPageRoute } from './pages/TankPage'
import { DevPage3 } from './pages/Dev/Page3'
import { AboutPage } from './pages/About'
import { WithdrawalPageRoute } from './pages/Withdrawal'
import { ResetModal } from './components/ResetModal'
import { useTankLevels } from './hooks/useTankLevels'

interface AppContentProps {
  levels: Record<number, number>
  setTankLevel: (id: number, level: number) => void
  resetAllTanks: () => void
}

function AppContent({ levels, setTankLevel, resetAllTanks }: AppContentProps) {
  const [withdrawalMode, setWithdrawalMode] = useState(false)
  const [withdrawalResults, setWithdrawalResults] = useState<Record<number, number>>({})
  const [wasOnWithdrawal, setWasOnWithdrawal] = useState(false)
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.startsWith('/withdrawal')) {
      setWasOnWithdrawal(true)
    } else if (wasOnWithdrawal) {
      setWithdrawalMode(false)
      setWasOnWithdrawal(false)
    }
  }, [pathname, wasOnWithdrawal])

  function handleResetAll() {
    resetAllTanks()
    setWithdrawalResults({})
    setResetModalOpen(false)
    toast.success('מיכלים אופסו', { duration: 3000 })
  }

  function handleResetTank(tankId: number) {
    setTankLevel(tankId, 0)
    setWithdrawalResults(prev => { const n = { ...prev }; delete n[tankId]; return n })
    setResetModalOpen(false)
    toast.success(`מיכל ${tankId} אופס`, { duration: 3000 })
  }

  function handleToggleWithdrawal() {
    setWithdrawalMode(prev => !prev)
  }

  function handleExitWithdrawal() {
    setWithdrawalMode(false)
  }

  function handleSetWithdrawalResult(tankId: number, remaining: number) {
    setWithdrawalResults(prev => ({ ...prev, [tankId]: remaining }))
  }

  return (
    <div className="min-h-screen bg-gray-50 font-heebo">
      <AppHeader
        onResetTanks={() => setResetModalOpen(true)}
        withdrawalMode={withdrawalMode}
        onToggleWithdrawal={handleToggleWithdrawal}
        onExitWithdrawal={handleExitWithdrawal}
      />
      {resetModalOpen && (
        <ResetModal
          levels={levels}
          onResetAll={handleResetAll}
          onResetTank={handleResetTank}
          onClose={() => setResetModalOpen(false)}
        />
      )}
      <Routes>
        <Route path="/" element={
          <Dashboard
            levels={levels}
            withdrawalMode={withdrawalMode}
            withdrawalResults={withdrawalResults}
          />
        } />
        <Route path="/tank/:id" element={<TankPageRoute levels={levels} setTankLevel={setTankLevel} />} />
        <Route path="/dev/3" element={<DevPage3 />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/withdrawal/:id" element={
          <WithdrawalPageRoute
            levels={levels}
            setWithdrawalResult={handleSetWithdrawalResult}
          />
        } />
      </Routes>
    </div>
  )
}

export function App() {
  const { levels, setTankLevel, resetAllTanks } = useTankLevels()

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent levels={levels} setTankLevel={setTankLevel} resetAllTanks={resetAllTanks} />
      <Toaster
        position="top-center"
        richColors
        dir="rtl"
        toastOptions={{
          classNames: {
            toast: 'text-center',
            title: 'text-lg font-bold w-full text-center',
          },
        }}
      />
    </BrowserRouter>
  )
}
