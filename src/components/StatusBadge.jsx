const STATUS_STYLES = {
  active: { color: 'status-verified', label: 'Active' },
  inactive: { color: 'text-secondary', label: 'Inactive' },
  pending_validation: { color: 'status-transit', label: 'En attente de validation' },
  suspended: { color: 'status-anomaly', label: 'Suspendue' },
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? { color: 'text-secondary', label: status }

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono bg-${style.color}/10 text-${style.color} border border-${style.color}/30`}
    >
      {style.label}
    </span>
  )
}