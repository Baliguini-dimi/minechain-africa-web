import { useParams, Link } from 'react-router-dom'
import { useLot } from './useLots'
import StatusBadge from '../../components/StatusBadge'
import PassportTimeline from './PassportTimeline'

export default function LotDetailPage() {
  const { id } = useParams()
  const { data, isLoading, isError } = useLot(id)

  if (isLoading) {
    return <p className="font-body text-text-secondary">Chargement du lot...</p>
  }

  if (isError || !data?.data) {
    return (
      <p className="font-body text-status-anomaly">
        Impossible de charger ce lot.
      </p>
    )
  }

  const lot = data.data

  return (
    <div>
      <Link to="/lots" className="font-body text-sm text-accent hover:underline mb-4 inline-block">
        ← Retour aux lots
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-1">
            Lot {lot.uuid.slice(0, 8)}
          </h2>
          <p className="font-mono text-xs text-text-secondary">{lot.uuid}</p>
        </div>
        <StatusBadge status={lot.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
              Informations
            </h3>
            <dl className="space-y-2">
              <div>
                <dt className="font-body text-xs text-text-secondary">Ressource</dt>
                <dd className="font-body text-sm text-text-primary">{lot.resource_type?.name}</dd>
              </div>
              <div>
                <dt className="font-body text-xs text-text-secondary">Source</dt>
                <dd className="font-body text-sm text-text-primary">{lot.source?.name}</dd>
              </div>
              <div>
                <dt className="font-body text-xs text-text-secondary">Poids / Volume</dt>
                <dd className="font-mono text-sm text-text-primary">
                  {lot.weight_volume} {lot.resource_type?.unit_of_measure}
                </dd>
              </div>
              <div>
                <dt className="font-body text-xs text-text-secondary">Date d'extraction</dt>
                <dd className="font-mono text-sm text-text-primary">{lot.extraction_date}</dd>
              </div>
              {lot.destination && (
                <div>
                  <dt className="font-body text-xs text-text-secondary">Destination</dt>
                  <dd className="font-body text-sm text-text-primary">{lot.destination}</dd>
                </div>
              )}
            </dl>
          </div>

          {lot.qr_code && (
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                QR Code
              </h3>
              <p className="font-mono text-xs text-text-secondary break-all">
                {lot.qr_code.code_value}
              </p>
            </div>
          )}

          {lot.passport && (
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                Passeport
              </h3>
              <p className="font-mono text-xs text-text-secondary">
                {lot.passport.unique_identifier}
              </p>
              <div className="mt-2">
                <StatusBadge status={lot.passport.status} />
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-4">
            Frise du passeport
          </h3>
          <PassportTimeline events={lot.passport?.events} />
        </div>
      </div>
    </div>
  )
}