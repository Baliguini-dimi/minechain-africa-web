import { useState } from 'react'
import { useSources } from './useSources'
import StatusBadge from '../../components/StatusBadge'
import SourceFormModal from './SourceFormModal'
import { SOURCE_TYPES } from './sourceTypes'

function typeLabel(value) {
  return SOURCE_TYPES.find((t) => t.value === value)?.label ?? value
}

export default function SourcesListPage() {
  const { data, isLoading, isError } = useSources()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return <p className="font-body text-text-secondary">Chargement des sources...</p>
  }

  if (isError) {
    return (
      <p className="font-body text-status-anomaly">
        Impossible de charger les sources.
      </p>
    )
  }

  const sources = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          Sources
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90"
        >
          Nouvelle source
        </button>
      </div>

      {sources.length === 0 ? (
        <p className="font-body text-text-secondary">
          Aucune source pour le moment. Créez le premier site d'exploitation →
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
                  Type
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Coordonnées
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3 font-body text-sm text-text-primary">
                    {source.name}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-secondary">
                    {typeLabel(source.type)}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-text-secondary">
                    {source.gps_lat}, {source.gps_lng}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={source.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && <SourceFormModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}