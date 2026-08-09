import { useState } from 'react'
import Modal from '../../components/Modal'
import { useCreateResourceType } from './useResourceTypes'

export default function ResourceTypeFormModal({ onClose }) {
  const createResourceType = useCreateResourceType()

  const [name, setName] = useState('')
  const [unitOfMeasure, setUnitOfMeasure] = useState('')
  const [weighingMethod, setWeighingMethod] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await createResourceType.mutateAsync({
        name,
        unit_of_measure: unitOfMeasure,
        weighing_method: weighingMethod || undefined,
      })
      onClose()
    } catch (err) {
      setError("La création a échoué. Vérifiez les champs et réessayez.")
    }
  }

  return (
    <Modal title="Nouveau type de ressource" onClose={onClose}>
      {error && (
        <div className="mb-4 px-3 py-2 rounded text-sm font-body bg-status-anomaly/10 text-status-anomaly border border-status-anomaly/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Nom (ex. Or, Pétrole brut, Cobalt)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border border-border font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Unité de mesure (ex. kg, litre, tonne)
          </label>
          <input
            type="text"
            value={unitOfMeasure}
            onChange={(e) => setUnitOfMeasure(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border border-border font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Méthode de pesée (optionnel)
          </label>
          <input
            type="text"
            value={weighingMethod}
            onChange={(e) => setWeighingMethod(e.target.value)}
            className="w-full px-3 py-2 rounded border border-border font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded font-body text-sm text-text-secondary hover:text-text-primary"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={createResourceType.isPending}
            className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {createResourceType.isPending ? 'Création...' : 'Créer le type'}
          </button>
        </div>
      </form>
    </Modal>
  )
}