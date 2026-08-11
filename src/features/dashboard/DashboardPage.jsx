import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.jsx'
import { useOrganizations } from '../organizations/useOrganizations'
import { useLots } from '../lots/useLots'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import StatusDonutChart from '../../components/StatusDonutChart'

function PlatformDashboard() {
  const { data, isLoading } = useOrganizations({
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })
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
  const { data, isLoading } = useLots({
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })
  const lots = data?.data ?? []

  if (isLoading) {
    return <p className="font-body text-text-secondary">Chargement...</p>
  }

  const statusCounts = {
    created: lots.filter((l) => l.status === 'created').length,
    in_transit: lots.filter((l) => l.status === 'in_transit').length,
    delivered: lots.filter((l) => l.status === 'delivered').length,
    closed: lots.filter((l) => l.status === 'closed').length,
    anomaly: lots.filter((l) => l.status === 'anomaly').length,
  }

  const recentLots = [...lots]
    .sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date))
    .slice(0, 5)

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">
        Tableau de bord
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <StatCard label="Total des lots" value={lots.length} />
        </div>
        <div className="md:col-span-1">
          <StatCard label="Anomalies actives" value={statusCounts.anomaly} accentColor="status-anomaly" />
        </div>
        <div className="md:col-span-1">
          <StatCard label="En transit" value={statusCounts.in_transit} accentColor="status-transit" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-surface border border-border rounded-lg p-4">
          <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
            Répartition par statut
          </h3>
          <StatusDonutChart data={statusCounts} />
        </div>

        <div className="md:col-span-2 bg-surface border border-border rounded-lg overflow-hidden">
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