const EVENT_LABELS = {
  creation: 'Création du lot',
  departure: 'Départ en expédition',
  checkpoint_control: 'Contrôle au checkpoint',
  anomaly: 'Anomalie signalée',
  delivery: 'Livraison confirmée',
  closure: 'Passeport clôturé',
}

const EVENT_COLORS = {
  creation: 'status-transit',
  departure: 'status-transit',
  checkpoint_control: 'accent',
  anomaly: 'status-anomaly',
  delivery: 'status-verified',
  closure: 'text-secondary',
}

function shortHash(hash) {
  if (!hash) return null
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`
}

export default function PassportTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <p className="font-body text-sm text-text-secondary">
        Aucun événement enregistré pour ce passeport.
      </p>
    )
  }

  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const color = EVENT_COLORS[event.event_type] ?? 'text-secondary'
        const isLast = index === events.length - 1

        return (
          <div key={event.hash} className="relative pl-8">
            {!isLast && (
              <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />
            )}

            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full bg-${color}/10 border-2 border-${color} flex items-center justify-center`}>
              <span className={`text-xs font-mono font-medium text-${color}`}>
                {index + 1}
              </span>
            </div>

            <div className={`mb-4 bg-surface border-l-4 border-${color} border-t border-r border-b border-border rounded p-3`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-body text-sm font-medium text-text-primary">
                  {EVENT_LABELS[event.event_type] ?? event.event_type}
                </span>
                <span className="font-mono text-xs text-text-secondary">
                  {new Date(event.occurred_at).toLocaleString('fr-FR')}
                </span>
              </div>
              <div className="font-mono text-xs text-text-secondary">
                hash: {shortHash(event.hash)}
                {event.prev_hash && (
                  <span className="ml-2 text-text-secondary/60">
                    ← {shortHash(event.prev_hash)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}