import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLots } from './useLots'
import StatusBadge from '../../components/StatusBadge'
import LotFormModal from './LotFormModal'

export default function LotsListPage() {
  const { data, isLoading, isError } = useLots()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return <p className="font-body text-text-secondary">Chargement des lots...</p>
  }

  if (isError) {
    return (
      <p className="font-body text-status-anomaly">
        Impossible de charger les lots.
      </p>
    )
  }

  const lots = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          Lots
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90"
        >
          Nouveau lot
        </button>
      </div>

      {lots.length === 0 ? (
        <p className="font-body text-text-secondary">
          Aucun lot pour le moment. Créez votre premier lot →
        </p>
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-border">
              <tr>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Identifiant
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Ressource
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Source
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Poids/Volume
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => (
                <tr key={lot.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/lots/${lot.id}`}
                      className="font-mono text-sm text-accent hover:underline"
                    >
                      {lot.uuid.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-primary">
                    {lot.resource_type?.name}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-secondary">
                    {lot.source?.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-text-secondary">
                    {lot.weight_volume} {lot.resource_type?.unit_of_measure}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lot.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && <LotFormModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}