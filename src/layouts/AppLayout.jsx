import { NavLink } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.jsx'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Tableau de bord' },
  { to: '/', label: 'Organisations', end: true },
  { to: '/sources', label: 'Sources' },
  { to: '/resource-types', label: 'Types de ressources' },
  { to: '/lots', label: 'Lots' },
  { to: '/users', label: 'Utilisateurs' },
  { to: '/checkpoint-scan', label: 'Scanner' },
]

export default function AppLayout({ children }) {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="font-display text-lg font-semibold text-text-primary">
            MineChain Africa
          </h1>
          <nav className="flex gap-4">
            {NAV_ITEMS.map((item) => (
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