import { useAuth } from '../features/auth/useAuth.jsx'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function AppLayout({ children, title }) {
  const { user } = useAuth()
  const roleName = user?.role?.name

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar roleName={roleName} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} />
        <main className="flex-1 p-6">{children}</main>
        <footer className="border-t border-border px-6 py-3">
          <p className="font-mono text-xs text-text-secondary">
            MineChain Africa — Traçabilité des ressources naturelles
          </p>
        </footer>
      </div>
    </div>
  )
}