import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppHeader } from './components/AppHeader'
import { Dashboard } from './pages/Dashboard'
import { TankPageRoute } from './pages/TankPage'
import { DevPage1 } from './pages/Dev/Page1'
import { DevPage2 } from './pages/Dev/Page2'
import { DevPage3 } from './pages/Dev/Page3'
import { AboutPage } from './pages/About'
import { useTankLevels } from './hooks/useTankLevels'

export function App() {
  const { levels, setTankLevel } = useTankLevels()

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50 font-heebo">
        <AppHeader />
        <Routes>
          <Route path="/" element={<Dashboard levels={levels} />} />
          <Route path="/tank/:id" element={<TankPageRoute levels={levels} setTankLevel={setTankLevel} />} />
          <Route path="/dev/1" element={<DevPage1 />} />
          <Route path="/dev/2" element={<DevPage2 />} />
          <Route path="/dev/3" element={<DevPage3 />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
      <Toaster position="top-center" richColors dir="rtl" />
    </BrowserRouter>
  )
}
