import { useState } from 'react'
import { useResourceTypes } from './useResourceTypes'
import ResourceTypeFormModal from './ResourceTypeFormModal'

export default function ResourceTypesListPage() {
  const { data, isLoading, isError } = useResourceTypes()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return <p className="font-body text-text-secondary">Chargement des types de ressources...</p>
  }

  if (isError) {
    return (
      <p className="font-body text-status-anomaly">
        Impossible de charger les types de ressources.
      </p>
    )
  }

  const resourceTypes = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          Types de ressources
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90"
        >
          Nouveau type
        </button>
      </div>

      {resourceTypes.length === 0 ? (
        <p className="font-body text-text-secondary">
          Aucun type de ressource pour le moment. Créez le premier type →
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
                  Unité de mesure
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Méthode de pesée
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Portée
                </th>
              </tr>
            </thead>
            <tbody>
              {resourceTypes.map((type) => (
                <tr key={type.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3 font-body text-sm text-text-primary">
                    {type.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-text-secondary">
                    {type.unit_of_measure}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-secondary">
                    {type.weighing_method ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-text-secondary">
                      {type.is_global ? 'Catalogue global' : 'Spécifique à l\'organisation'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && <ResourceTypeFormModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}