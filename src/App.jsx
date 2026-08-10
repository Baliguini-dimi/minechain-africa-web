import { Routes, Route } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage.jsx'
import ProtectedRoute from './features/auth/ProtectedRoute.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import OrganizationsListPage from './features/organizations/OrganizationsListPage.jsx'
import SourcesListPage from './features/sources/SourcesListPage.jsx'
import ResourceTypesListPage from './features/resource-types/ResourceTypesListPage.jsx'
import LotsListPage from './features/lots/LotsListPage.jsx'
import LotDetailPage from './features/lots/LotDetailPage.jsx'
import UsersListPage from './features/users/UsersListPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <OrganizationsListPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sources"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SourcesListPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resource-types"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ResourceTypesListPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lots"
        element={
          <ProtectedRoute>
            <AppLayout>
              <LotsListPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lots/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <LotDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UsersListPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App