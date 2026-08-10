import { useState } from 'react'
import Modal from '../../components/Modal'
import Select from '../../components/Select'
import { useReportAnomaly } from './useAnomalies'

const ANOMALY_TYPES = [
  { value: 'ecart_poids', label: 'Écart de poids' },
  { value: 'sceau_brise', label: 'Sceau brisé' },
  { value: 'itineraire_inhabituel', label: 'Itinéraire inhabituel' },
  { value: 'document_manquant', label: 'Document manquant' },
  { value: 'autre', label: 'Autre' },
]

const SEVERITY_LEVELS = [
  { value: 'faible', label: 'Faible' },
  { value: 'moyenne', label: 'Moyenne' },
  { value: 'critique', label: 'Critique' },
]

export default function AnomalyFormModal({ lotId, onClose }) {
  const reportAnomaly = useReportAnomaly(lotId)

  const [type, setType] = useState('')
  const [severity, setSeverity] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await reportAnomaly.mutateAsync({ type, severity, description: description || undefined })
      onClose()
    } catch (err) {
      setError("Le signalement a échoué. Vérifiez que vous avez les droits nécessaires.")
    }
  }

  return (
    <Modal title="Signaler une anomalie" onClose={onClose}>
      {error && (
        <div className="mb-4 px-3 py-2 rounded text-sm font-body bg-status-anomaly/10 text-status-anomaly border border-status-anomaly/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Type d'anomalie"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={ANOMALY_TYPES}
          required
        />

        <Select
          label="Sévérité"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          options={SEVERITY_LEVELS}
          required
        />

        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Description (optionnel)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
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
            disabled={reportAnomaly.isPending}
            className="px-4 py-2 rounded bg-status-anomaly text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {reportAnomaly.isPending ? 'Envoi...' : 'Signaler'}
          </button>
        </div>
      </form>
    </Modal>
  )
}