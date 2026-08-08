import { useAuth } from '../features/auth/useAuth.jsx'

export default function AppLayout({ children }) {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
        <h1 className="font-display text-lg font-semibold text-text-primary">
          MineChain Africa
        </h1>
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
