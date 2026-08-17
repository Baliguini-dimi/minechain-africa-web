import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

const SEVERITY_STYLES = {
  faible: 'bg-status-transit/10 text-status-transit border-status-transit/30',
  moyenne: 'bg-status-anomaly/10 text-status-anomaly border-status-anomaly/30',
  critique: 'bg-status-anomaly/20 text-status-anomaly border-status-anomaly/50',
}

const TYPE_LABELS = {
  ecart_poids: 'Écart de poids',
  sceau_brise: 'Sceau brisé',
  itineraire_inhabituel: 'Itinéraire inhabituel',
  document_manquant: 'Document manquant',
  autre: 'Autre',
}

export default function AlertCenter({ anomalies }) {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
        <ShieldAlert size={24} className="text-status-verified mb-2" />
        <p className="font-body text-sm text-text-secondary">
          Aucune alerte ouverte pour le moment.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden h-full">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <ShieldAlert size={14} className="text-status-anomaly" />
        <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide">
          Centre d'alertes
        </h3>
      </div>
      <div className="divide-y divide-border">
        {anomalies.map((anomaly) => (
          <Link
            key={anomaly.id}
            to={`/lots/${anomaly.lot_id}`}
            className="block px-4 py-3 hover:bg-bg/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-body text-sm text-text-primary">
                {TYPE_LABELS[anomaly.type] ?? anomaly.type}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono border ${
                  SEVERITY_STYLES[anomaly.severity] ?? SEVERITY_STYLES.moyenne
                }`}
              >
                {anomaly.severity}
              </span>
            </div>
            <p className="font-mono text-xs text-text-secondary">
              Lot {anomaly.lot_uuid?.slice(0, 8)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}