import { useState } from 'react'
import Modal from '../../components/Modal'
import Select from '../../components/Select'
import { useCreateLot } from './useLots'
import { useSources } from '../sources/useSources'
import { useResourceTypes } from '../resource-types/useResourceTypes'

export default function LotFormModal({ onClose }) {
  const createLot = useCreateLot()
  const { data: sourcesData } = useSources()
  const { data: resourceTypesData } = useResourceTypes()

  const [sourceId, setSourceId] = useState('')
  const [resourceTypeId, setResourceTypeId] = useState('')
  const [weightVolume, setWeightVolume] = useState('')
  const [extractionDate, setExtractionDate] = useState('')
  const [destination, setDestination] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [error, setError] = useState('')

  const sourceOptions = (sourcesData?.data ?? []).map((s) => ({
    value: s.id,
    label: s.name,
  }))

  const resourceTypeOptions = (resourceTypesData?.data ?? []).map((t) => ({
    value: t.id,
    label: `${t.name} (${t.unit_of_measure})`,
  }))

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await createLot.mutateAsync({
        source_id: parseInt(sourceId, 10),
        resource_type_id: parseInt(resourceTypeId, 10),
        weight_volume: parseFloat(weightVolume),
        extraction_date: extractionDate,
        destination: destination || undefined,
        transport_mode: transportMode || undefined,
      })
      onClose()
    } catch (err) {
      setError("La création a échoué. Vérifiez les champs et réessayez.")
    }
  }

  return (
    <Modal title="Nouveau lot" onClose={onClose}>
      {error && (
        <div className="mb-4 px-3 py-2 rounded text-sm font-body bg-status-anomaly/10 text-status-anomaly border border-status-anomaly/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Source d'origine"
          value={sourceId}
          onChange={(e) => setSourceId(e.target.value)}
          options={sourceOptions}
          required
        />

        <Select
          label="Type de ressource"
          value={resourceTypeId}
          onChange={(e) => setResourceTypeId(e.target.value)}
          options={resourceTypeOptions}
          required
        />

        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Poids / Volume
          </label>
          <input
            type="number"
            step="any"
            min="0.001"
            value={weightVolume}
            onChange={(e) => setWeightVolume(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border border-border font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Date d'extraction
          </label>
          <input
            type="date"
            value={extractionDate}
            onChange={(e) => setExtractionDate(e.target.value)}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 rounded border border-border font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Destination (optionnel)
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3 py-2 rounded border border-border font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Moyen de transport (optionnel)
          </label>
          <input
            type="text"
            value={transportMode}
            onChange={(e) => setTransportMode(e.target.value)}
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
            disabled={createLot.isPending}
            className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {createLot.isPending ? 'Création...' : 'Créer le lot'}
          </button>
        </div>
      </form>
    </Modal>
  )
}