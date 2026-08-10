import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLot, useDepartLot, useDeliverLot, useCloseLotPassport } from './useLots'
import { useResolveAnomaly } from '../anomalies/useAnomalies'
import StatusBadge from '../../components/StatusBadge'
import ConfirmButton from '../../components/ConfirmButton'
import PassportTimeline from './PassportTimeline'
import AnomalyFormModal from '../anomalies/AnomalyFormModal'
import { QRCodeSVG } from 'qrcode.react'
import GpsMap from './GpsMap'
import { useGpsHistory, useAssignGpsDevice, useRecordGpsPosition } from './useGpsTracking'

const NEXT_ACTION = {
  created: { key: 'depart', label: 'Marquer comme expédié', confirm: 'Confirmer le départ du lot ?' },
  in_transit: { key: 'deliver', label: 'Confirmer la livraison', confirm: 'Confirmer la livraison du lot ?' },
  delivered: { key: 'close', label: 'Clôturer le passeport', confirm: 'Clôturer définitivement le passeport ?' },
}

const ANOMALY_TYPE_LABELS = {
  ecart_poids: 'Écart de poids',
  sceau_brise: 'Sceau brisé',
  itineraire_inhabituel: 'Itinéraire inhabituel',
  document_manquant: 'Document manquant',
  autre: 'Autre',
}

export default function LotDetailPage() {
  const { id } = useParams()
  const { data, isLoading, isError } = useLot(id)
  const departLot = useDepartLot()
  const deliverLot = useDeliverLot()
  const closeLotPassport = useCloseLotPassport()
  const resolveAnomaly = useResolveAnomaly(id)
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false)

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
  const nextAction = NEXT_ACTION[lot.status]
  const anomalies = lot.anomalies ?? []
  const { data: gpsData } = useGpsHistory(lot?.id)
  const assignDevice = useAssignGpsDevice(lot?.id)
  const recordPosition = useRecordGpsPosition(lot?.id)
  const [deviceIdentifier, setDeviceIdentifier] = useState('')
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')

  function handleAction() {
    if (nextAction?.key === 'depart') departLot.mutate(lot.id)
    if (nextAction?.key === 'deliver') deliverLot.mutate(lot.id)
    if (nextAction?.key === 'close') closeLotPassport.mutate(lot.id)
  }

  const isActionPending = departLot.isPending || deliverLot.isPending || closeLotPassport.isPending
  const actionError = departLot.isError || deliverLot.isError || closeLotPassport.isError

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
        <div className="flex items-center gap-3">
          <StatusBadge status={lot.status} />
          <button
            onClick={() => setIsAnomalyModalOpen(true)}
            className="px-4 py-2 rounded border border-status-anomaly text-status-anomaly font-body text-sm font-medium hover:bg-status-anomaly/10"
          >
            Signaler une anomalie
          </button>
          {nextAction && (
            <ConfirmButton
              onConfirm={handleAction}
              label={nextAction.label}
              confirmLabel={nextAction.confirm}
              disabled={isActionPending}
              variant={nextAction.key === 'close' ? 'primary' : 'verified'}
            />
          )}
        </div>
      </div>

      {actionError && (
        <div className="mb-4 px-3 py-2 rounded text-sm font-body bg-status-anomaly/10 text-status-anomaly border border-status-anomaly/30">
          L'action a échoué. Vérifiez que vous avez les droits nécessaires.
        </div>
      )}

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
              <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
                QR Code
              </h3>
              <div className="flex justify-center bg-white p-3 rounded mb-3">
                <QRCodeSVG value={lot.qr_code.code_value} size={160} />
              </div>
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

          {anomalies.length > 0 && (
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
                Anomalies
              </h3>
              <div className="space-y-3">
                {anomalies.map((anomaly) => (
                  <div key={anomaly.id} className="border-l-4 border-status-anomaly pl-3">
                    <p className="font-body text-sm text-text-primary">
                      {ANOMALY_TYPE_LABELS[anomaly.type] ?? anomaly.type}
                    </p>
                    <p className="font-mono text-xs text-text-secondary mb-1">
                      Sévérité : {anomaly.severity}
                    </p>
                    {anomaly.description && (
                      <p className="font-body text-xs text-text-secondary mb-2">
                        {anomaly.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <StatusBadge status={anomaly.status} />
                      {anomaly.status === 'open' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => resolveAnomaly.mutate({ anomalyId: anomaly.id, resolution: 'resolved' })}
                            className="text-xs font-body text-status-verified hover:underline"
                          >
                            Résoudre
                          </button>
                          <button
                            onClick={() => resolveAnomaly.mutate({ anomalyId: anomaly.id, resolution: 'dismissed' })}
                            className="text-xs font-body text-text-secondary hover:underline"
                          >
                            Classer sans suite
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-4">
            Frise du passeport
          </h3>
          <PassportTimeline events={lot.passport?.events} />

          <div className="mt-6">
            <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-4">
              Suivi GPS
            </h3>
            <GpsMap positions={gpsData?.data} />

            <div className="mt-4 bg-surface border border-border rounded-lg p-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Identifiant de balise (ex. BALISE-001)"
                  value={deviceIdentifier}
                  onChange={(e) => setDeviceIdentifier(e.target.value)}
                  className="flex-1 px-3 py-2 rounded border border-border font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  onClick={() => assignDevice.mutate(deviceIdentifier)}
                  disabled={assignDevice.isPending || !deviceIdentifier}
                  className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  Associer
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="flex-1 px-3 py-2 rounded border border-border font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="flex-1 px-3 py-2 rounded border border-border font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  onClick={() => {
                    recordPosition.mutate({ lat: parseFloat(manualLat), lng: parseFloat(manualLng) })
                    setManualLat('')
                    setManualLng('')
                  }}
                  disabled={recordPosition.isPending || !manualLat || !manualLng}
                  className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  Enregistrer
                </button>
              </div>
              <p className="font-body text-xs text-text-secondary">
                En production, ces positions seront envoyées automatiquement par la balise IoT. Cette saisie manuelle sert uniquement au test.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isAnomalyModalOpen && (
        <AnomalyFormModal lotId={lot.id} onClose={() => setIsAnomalyModalOpen(false)} />
      )}
    </div>
  )
}