import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'

const EVENT_LABELS = {
  creation: 'a créé le lot',
  departure: 'a expédié le lot',
  checkpoint_control: 'a contrôlé le lot',
  anomaly: 'a signalé une anomalie sur',
  delivery: 'a confirmé la livraison du lot',
  closure: 'a clôturé le passeport du lot',
}

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "à l'instant"
  if (diffMin < 60) return `il y a ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH} h`
  return `il y a ${Math.floor(diffH / 24)} j`
}

export default function ActivityTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
        <Clock size={24} className="text-text-secondary mb-2" />
        <p className="font-body text-sm text-text-secondary">
          Aucune activité récente.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden h-full">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Clock size={14} className="text-text-secondary" />
        <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide">
          Activité récente
        </h3>
      </div>
      <div className="divide-y divide-border">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/lots/${event.lot_id}`}
            className="block px-4 py-3 hover:bg-bg/50 transition-colors"
          >
            <p className="font-body text-sm text-text-primary">
              <span className="font-medium">{event.actor_name}</span>{' '}
              {EVENT_LABELS[event.event_type] ?? event.event_type}{' '}
              <span className="font-mono text-text-secondary">
                {event.lot_uuid?.slice(0, 8)}
              </span>
            </p>
            <p className="font-mono text-xs text-text-secondary mt-0.5">
              {timeAgo(event.occurred_at)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}