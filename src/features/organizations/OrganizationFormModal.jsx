import { useState } from 'react'
import Modal from '../../components/Modal'
import { useCreateOrganization } from './useOrganizations'

export default function OrganizationFormModal({ onClose }) {
  const createOrganization = useCreateOrganization()

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await createOrganization.mutateAsync({ name, country, address })
      onClose()
    } catch (err) {
      setError("La création a échoué. Vérifiez les champs et réessayez.")
    }
  }

  return (
    <Modal title="Nouvelle organisation" onClose={onClose}>
      {error && (
        <div className="mb-4 px-3 py-2 rounded text-sm font-body bg-status-anomaly/10 text-status-anomaly border border-status-anomaly/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Nom de l'organisation
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
            Pays (code ISO, ex. CI)
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value.toUpperCase())}
            maxLength={2}
            required
            className="w-full px-3 py-2 rounded border border-border font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Adresse
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
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
            disabled={createOrganization.isPending}
            className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {createOrganization.isPending ? 'Création...' : 'Créer l\'organisation'}
          </button>
        </div>
      </form>
    </Modal>
  )
}