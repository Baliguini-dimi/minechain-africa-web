import { Routes, Route } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<div className="p-8 font-body">Tableau de bord (à construire)</div>} />
    </Routes>
  )
}

export default App