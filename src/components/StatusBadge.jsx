const STATUS_STYLES = {
  active: { classes: 'bg-status-verified/10 text-status-verified border-status-verified/30', label: 'Active' },
  inactive: { classes: 'bg-text-secondary/10 text-text-secondary border-text-secondary/30', label: 'Inactive' },
  pending_validation: { classes: 'bg-status-transit/10 text-status-transit border-status-transit/30', label: 'En attente de validation' },
  suspended: { classes: 'bg-status-anomaly/10 text-status-anomaly border-status-anomaly/30', label: 'Suspendue' },
  created: { classes: 'bg-status-transit/10 text-status-transit border-status-transit/30', label: 'Créé' },
  in_transit: { classes: 'bg-status-transit/10 text-status-transit border-status-transit/30', label: 'En transit' },
  delivered: { classes: 'bg-status-verified/10 text-status-verified border-status-verified/30', label: 'Livré' },
  closed: { classes: 'bg-text-secondary/10 text-text-secondary border-text-secondary/30', label: 'Clôturé' },
  anomaly: { classes: 'bg-status-anomaly/10 text-status-anomaly border-status-anomaly/30', label: 'Anomalie' },
  invited: { classes: 'bg-status-transit/10 text-status-transit border-status-transit/30', label: 'Invité' },
  open: { classes: 'bg-status-anomaly/10 text-status-anomaly border-status-anomaly/30', label: 'Ouverte' },
  investigating: { classes: 'bg-status-transit/10 text-status-transit border-status-transit/30', label: "En cours d'investigation" },
  resolved: { classes: 'bg-status-verified/10 text-status-verified border-status-verified/30', label: 'Résolue' },
  dismissed: { classes: 'bg-text-secondary/10 text-text-secondary border-text-secondary/30', label: 'Classée sans suite' },
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? {
    classes: 'bg-text-secondary/10 text-text-secondary border-text-secondary/30',
    label: status,
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono border ${style.classes}`}
    >
      {style.label}
    </span>
  )
}