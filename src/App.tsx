import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { AppHeader } from './components/AppHeader'
import { Dashboard } from './pages/Dashboard'
import { TankPageRoute } from './pages/TankPage'
import { DevPage2 } from './pages/Dev/Page2'
import { DevPage3 } from './pages/Dev/Page3'
import { AboutPage } from './pages/About'
import { useTankLevels } from './hooks/useTankLevels'

export function App() {
  const { levels, setTankLevel, resetAllTanks } = useTankLevels()

  function handleResetTanks() {
    resetAllTanks()
    toast.success('מיכלים אופסו', { duration: 3000 })
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50 font-heebo">
        <AppHeader onResetTanks={handleResetTanks} />
        <Routes>
          <Route path="/" element={<Dashboard levels={levels} />} />
          <Route path="/tank/:id" element={<TankPageRoute levels={levels} setTankLevel={setTankLevel} />} />
          <Route path="/dev/2" element={<DevPage2 />} />
          <Route path="/dev/3" element={<DevPage3 />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
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
