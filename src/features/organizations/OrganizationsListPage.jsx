import { useState } from 'react'
import { useOrganizations } from './useOrganizations'
import StatusBadge from '../../components/StatusBadge'
import OrganizationFormModal from './OrganizationFormModal'
import { useAuth } from '../auth/useAuth.jsx'
import { ACTION_ACCESS, canAccess } from '../auth/permissions'

export default function OrganizationsListPage() {
  const { data, isLoading, isError } = useOrganizations()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return <p className="font-body text-text-secondary">Chargement des organisations...</p>
  }

  if (isError) {
    return (
      <p className="font-body text-status-anomaly">
        Impossible de charger les organisations.
      </p>
    )
  }

  const organizations = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          Organisations
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90"
        >
          Nouvelle organisation
        </button>
      </div>

      {organizations.length === 0 ? (
        <p className="font-body text-text-secondary">
          Aucune organisation pour le moment. Créez la première organisation →
        </p>
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-border">
              <tr>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Nom
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Pays
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Statut
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Créée le
                </th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3 font-body text-sm text-text-primary">
                    {org.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-text-secondary">
                    {org.country}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={org.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-text-secondary">
                    {new Date(org.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <OrganizationFormModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}