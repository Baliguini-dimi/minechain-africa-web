import { LogOut, ShieldAlert } from 'lucide-react'
import { useAuth } from '../features/auth/useAuth.jsx'
import { ROLE_LABELS } from '../features/auth/roleLabels'

export default function Topbar({ title }) {
  const { user, logout } = useAuth()
  const roleName = user?.role?.name

  return (
    <header className="h-[var(--height-topbar)] bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        {title && (
          <h2 className="font-body text-sm text-text-secondary">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right hidden sm:block">
            <p className="font-body text-sm text-text-primary leading-tight">{user.name}</p>
            <p className="font-mono text-xs text-text-secondary leading-tight">
              {ROLE_LABELS[roleName] ?? roleName}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="p-2 rounded border border-border text-text-secondary hover:text-status-anomaly hover:border-status-anomaly/50 transition-colors"
          title="Déconnexion"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}