import { useState } from 'react'
import Modal from '../../components/Modal'
import Select from '../../components/Select'
import { useInviteUser } from './useUsers'
import { ASSIGNABLE_ROLES } from './userRoles'

export default function UserFormModal({ onClose }) {
  const inviteUser = useInviteUser()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [roleId, setRoleId] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await inviteUser.mutateAsync({
        name,
        email,
        phone: phone || undefined,
        role_id: parseInt(roleId, 10),
      })
      onClose()
    } catch (err) {
      setError("L'invitation a échoué. Vérifiez les champs et réessayez.")
    }
  }

  return (
    <Modal title="Inviter un utilisateur" onClose={onClose}>
      {error && (
        <div className="mb-4 px-3 py-2 rounded text-sm font-body bg-status-anomaly/10 text-status-anomaly border border-status-anomaly/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Nom complet
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
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border border-border font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium font-body text-text-secondary mb-1">
            Téléphone (optionnel)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 rounded border border-border font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <Select
          label="Rôle"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          options={ASSIGNABLE_ROLES}
          required
        />

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
            disabled={inviteUser.isPending}
            className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {inviteUser.isPending ? 'Invitation...' : 'Inviter'}
          </button>
        </div>
      </form>
    </Modal>
  )
}