import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Boxes,
  Package,
  ScanLine,
  Users,
  ShieldAlert,
} from 'lucide-react'
import { NAV_ACCESS, canAccess } from '../features/auth/permissions'

const NAV_SECTIONS = [
  {
    label: 'Vue d\'ensemble',
    items: [
      { key: 'dashboard', to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Exploitation',
    items: [
      { key: 'sources', to: '/sources', label: 'Sources', icon: MapPin },
      { key: 'resourceTypes', to: '/resource-types', label: 'Types de ressources', icon: Boxes },
      { key: 'lots', to: '/lots', label: 'Lots', icon: Package },
    ],
  },
  {
    label: 'Traçabilité',
    items: [
      { key: 'checkpointScan', to: '/checkpoint-scan', label: 'Scanner', icon: ScanLine },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { key: 'users', to: '/users', label: 'Utilisateurs', icon: Users },
    ],
  },
  {
    label: 'Administration',
    items: [
      { key: 'organizations', to: '/', label: 'Organisations', icon: Building2, end: true },
    ],
  },
]

export default function Sidebar({ roleName }) {
  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => canAccess(NAV_ACCESS, item.key, roleName)),
  })).filter((section) => section.items.length > 0)

  return (
    <aside className="w-[var(--width-sidebar)] shrink-0 bg-sidebar-bg flex flex-col h-screen sticky top-0">
      <div className="h-[var(--height-topbar)] flex items-center gap-3 px-5 border-b border-sidebar-border">
        <div className="w-7 h-7 rounded bg-accent flex items-center justify-center shrink-0">
          <div className="flex flex-col gap-[2px]">
            <div className="w-3.5 h-[2.5px] bg-white rounded-sm" />
            <div className="w-3.5 h-[2.5px] bg-status-transit rounded-sm" />
            <div className="w-3.5 h-[2.5px] bg-white rounded-sm" />
          </div>
        </div>
        <span className="font-display text-base font-semibold text-sidebar-text tracking-tight">
          MineChain Africa
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {visibleSections.map((section) => (
          <div key={section.label} className="mb-5 px-3">
            <p className="font-body text-[11px] font-medium text-sidebar-text-muted uppercase tracking-wider px-2 mb-1.5">
              {section.label}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded font-body text-sm transition-colors ${
                      isActive
                        ? 'bg-sidebar-active-bg text-white font-medium'
                        : 'text-sidebar-text-muted hover:text-sidebar-text hover:bg-sidebar-surface'
                    }`
                  }
                >
                  <Icon size={16} strokeWidth={2} />
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-sidebar-border">
        <p className="font-mono text-[11px] text-sidebar-text-muted px-2">v0.1.0 · MVP</p>
      </div>
    </aside>
  )
}