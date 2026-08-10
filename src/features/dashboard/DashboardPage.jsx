import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.jsx'
import { useOrganizations } from '../organizations/useOrganizations'
import { useLots } from '../lots/useLots'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'

function PlatformDashboard() {
  const { data, isLoading } = useOrganizations()
  const organizations = data?.data ?? []

  if (isLoading) {
    return <p className="font-body text-text-secondary">Chargement...</p>
  }

  const active = organizations.filter((o) => o.status === 'active').length
  const pending = organizations.filter((o) => o.status === 'pending_validation').length
  const suspended = organizations.filter((o) => o.status === 'suspended').length

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">
        Vue plateforme
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Organisations" value={organizations.length} />
        <StatCard label="Actives" value={active} accentColor="status-verified" />
        <StatCard label="En attente" value={pending} accentColor="status-transit" />
        <StatCard label="Suspendues" value={suspended} accentColor="status-anomaly" />
      </div>

      {pending > 0 && (
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
            Organisations en attente de validation
          </h3>
          <div className="space-y-2">
            {organizations
              .filter((o) => o.status === 'pending_validation')
              .map((org) => (
                <div key={org.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-body text-sm text-text-primary">{org.name}</span>
                  <StatusBadge status={org.status} />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OrganizationDashboard() {
  const { data, isLoading } = useLots()
  const lots = data?.data ?? []

  if (isLoading) {
    return <p className="font-body text-text-secondary">Chargement...</p>
  }

  const inTransit = lots.filter((l) => l.status === 'in_transit').length
  const anomaly = lots.filter((l) => l.status === 'anomaly').length
  const delivered = lots.filter((l) => l.status === 'delivered').length
  const closed = lots.filter((l) => l.status === 'closed').length
  const recentLots = [...lots]
    .sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date))
    .slice(0, 5)

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">
        Tableau de bord
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total des lots" value={lots.length} />
        <StatCard label="En transit" value={inTransit} accentColor="status-transit" />
        <StatCard label="Anomalies" value={anomaly} accentColor="status-anomaly" />
        <StatCard label="Livrés" value={delivered} accentColor="status-verified" />
        <StatCard label="Clôturés" value={closed} />
      </div>

      {anomaly > 0 && (
        <div className="bg-surface border-l-4 border-status-anomaly border-t border-r border-b border-border rounded-lg p-4 mb-6">
          <p className="font-body text-sm text-status-anomaly font-medium">
            {anomaly} lot{anomaly > 1 ? 's' : ''} en anomalie nécessite{anomaly > 1 ? 'nt' : ''} une attention.
          </p>
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide">
            Lots récents
          </h3>
        </div>
        {recentLots.length === 0 ? (
          <p className="p-4 font-body text-sm text-text-secondary">
            Aucun lot pour le moment.
          </p>
        ) : (
          <table className="w-full text-left">
            <tbody>
              {recentLots.map((lot) => (
                <tr key={lot.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3">
                    <Link to={`/lots/${lot.id}`} className="font-mono text-sm text-accent hover:underline">
                      {lot.uuid.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-secondary">
                    {lot.resource_type?.name}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lot.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const roleName = user?.role?.name

  if (roleName === 'super_admin_technique' || roleName === 'super_admin_gouvernemental') {
    return <PlatformDashboard />
  }

  return <OrganizationDashboard />
}