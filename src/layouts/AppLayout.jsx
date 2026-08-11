import { NavLink } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.jsx'
import { NAV_ACCESS, canAccess } from '../features/auth/permissions'

const ALL_NAV_ITEMS = [
  { key: 'dashboard', to: '/dashboard', label: 'Tableau de bord' },
  { key: 'organizations', to: '/', label: 'Organisations', end: true },
  { key: 'sources', to: '/sources', label: 'Sources' },
  { key: 'resourceTypes', to: '/resource-types', label: 'Types de ressources' },
  { key: 'lots', to: '/lots', label: 'Lots' },
  { key: 'users', to: '/users', label: 'Utilisateurs' },
  { key: 'checkpointScan', to: '/checkpoint-scan', label: 'Scanner' },
]

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const roleName = user?.role?.name

  const visibleNavItems = ALL_NAV_ITEMS.filter((item) =>
    canAccess(NAV_ACCESS, item.key, roleName)
  )

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="font-display text-lg font-semibold text-text-primary">
            MineChain Africa
          </h1>
          <nav className="flex gap-4">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `font-body text-sm ${isActive ? 'text-accent font-medium' : 'text-text-secondary hover:text-text-primary'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <button
          onClick={logout}
          className="text-sm font-body text-text-secondary hover:text-accent"
        >
          Déconnexion
        </button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}