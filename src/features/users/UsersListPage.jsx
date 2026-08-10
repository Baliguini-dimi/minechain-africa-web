import { useState } from 'react'
import { useUsers, useSuspendUser, useReactivateUser } from './useUsers'
import StatusBadge from '../../components/StatusBadge'
import UserFormModal from './UserFormModal'

const ROLE_LABELS = {
  super_admin_technique: 'Super Admin Technique',
  super_admin_gouvernemental: 'Super Admin Gouvernemental',
  admin_organisation: 'Administrateur',
  superviseur: 'Superviseur',
  agent_checkpoint: 'Agent Checkpoint',
}

export default function UsersListPage() {
  const { data, isLoading, isError } = useUsers()
  const suspendUser = useSuspendUser()
  const reactivateUser = useReactivateUser()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return <p className="font-body text-text-secondary">Chargement des utilisateurs...</p>
  }

  if (isError) {
    return (
      <p className="font-body text-status-anomaly">
        Impossible de charger les utilisateurs.
      </p>
    )
  }

  const users = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          Utilisateurs
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90"
        >
          Inviter un utilisateur
        </button>
      </div>

      {users.length === 0 ? (
        <p className="font-body text-text-secondary">
          Aucun utilisateur pour le moment. Invitez le premier membre de votre équipe →
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
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Rôle
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Statut
                </th>
                <th className="px-4 py-3 text-xs font-medium font-body text-text-secondary uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3 font-body text-sm text-text-primary">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-text-secondary">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-secondary">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3">
                    {user.status === 'suspended' ? (
                      <button
                        onClick={() => reactivateUser.mutate(user.id)}
                        className="text-xs font-body text-status-verified hover:underline"
                      >
                        Réactiver
                      </button>
                    ) : (
                      <button
                        onClick={() => suspendUser.mutate(user.id)}
                        className="text-xs font-body text-status-anomaly hover:underline"
                      >
                        Suspendre
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && <UserFormModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}