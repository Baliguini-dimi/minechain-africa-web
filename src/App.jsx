import { Routes, Route } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage.jsx'
import ProtectedRoute from './features/auth/ProtectedRoute.jsx'
import AppLayout from './layouts/AppLayout.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <div className="font-body text-text-primary">
                Tableau de bord (à construire)
              </div>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App