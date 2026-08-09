import { useState } from 'react'
import Modal from '../../components/Modal'
import Select from '../../components/Select'
import { useCreateSource } from './useSources'
import { SOURCE_TYPES } from './sourceTypes'

export default function SourceFormModal({ onClose }) {
  const createSource = useCreateSource()

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [gpsLat, setGpsLat] = useState('')
  const [gpsLng, setGpsLng] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await createSource.mutateAsync({
        name,
        type,
        gps_lat: parseFloat(gpsLat),
        gps_lng: parseFloat(gpsLng),
      })
      onClose()
    } catch (err) {
      setError("La création a échoué. Vérifiez les champs et réessayez.")
    }
  }

  return (
    <Modal title="Nouvelle source" onClose={onClose}>
      {error && (
        <div className="mb-4 px-3 py-2 rounded text-sm font-body bg-status-anomaly/10 text-status-anomaly border border-status-anomaly/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Nom du site
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border border-border font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <Select
          label="Type de site"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={SOURCE_TYPES}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium font-body text-text-secondary mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={gpsLat}
              onChange={(e) => setGpsLat(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-border font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium font-body text-text-secondary mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={gpsLng}
              onChange={(e) => setGpsLng(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-border font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
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
            disabled={createSource.isPending}
            className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {createSource.isPending ? 'Création...' : 'Créer la source'}
          </button>
        </div>
      </form>
    </Modal>
  )
}