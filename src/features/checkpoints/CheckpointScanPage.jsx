import { useState } from 'react'
import Select from '../../components/Select'
import QrScanner from './QrScanner'
import { useCheckpoints, useSubmitCheckpointControl } from './useCheckpoints'

export default function CheckpointScanPage() {
  const { data: checkpointsData } = useCheckpoints()
  const submitControl = useSubmitCheckpointControl()

  const [checkpointId, setCheckpointId] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scannedToken, setScannedToken] = useState('')
  const [status, setStatus] = useState('ok')
  const [observations, setObservations] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const checkpointOptions = (checkpointsData?.data ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }))

  function handleScan(decodedText) {
    setScannedToken(decodedText)
    setIsScanning(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    try {
      const response = await submitControl.mutateAsync({
        qr_token: scannedToken,
        checkpoint_id: parseInt(checkpointId, 10),
        status,
        observations: observations || undefined,
      })
      setResult(response)
      setScannedToken('')
      setObservations('')
      setStatus('ok')
    } catch (err) {
      setError("Le contrôle a échoué. Vérifiez le QR code et le checkpoint sélectionné.")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">
        Scanner un lot
      </h2>

      <Select
        label="Checkpoint"
        value={checkpointId}
        onChange={(e) => setCheckpointId(e.target.value)}
        options={checkpointOptions}
        required
      />

      {checkpointId && (
        <div className="mt-4 space-y-4">
          {!scannedToken ? (
            <div>
              {!isScanning ? (
                <button
                  onClick={() => setIsScanning(true)}
                  className="w-full py-3 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90"
                >
                  Démarrer le scan
                </button>
              ) : (
                <QrScanner isActive={isScanning} onScan={handleScan} />
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="px-3 py-2 rounded bg-status-verified/10 border border-status-verified/30">
                <p className="font-body text-sm text-status-verified">
                  QR code scanné avec succès.
                </p>
              </div>

              {error && (
                <div className="px-3 py-2 rounded text-sm font-body bg-status-anomaly/10 text-status-anomaly border border-status-anomaly/30">
                  {error}
                </div>
              )}

              <Select
                label="État du lot"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: 'ok', label: 'Conforme' },
                  { value: 'anomaly_reported', label: 'Anomalie constatée' },
                ]}
                required
              />

              <div>
                <label className="block text-xs font-medium font-body text-text-secondary mb-1">
                  Observations (optionnel)
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded border border-border font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setScannedToken('')}
                  className="flex-1 py-2 rounded font-body text-sm text-text-secondary border border-border hover:text-text-primary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitControl.isPending}
                  className="flex-1 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {submitControl.isPending ? 'Envoi...' : 'Valider le contrôle'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {result && (
        <div className="mt-6 px-4 py-3 rounded bg-status-verified/10 border border-status-verified/30">
          <p className="font-body text-sm text-status-verified font-medium">
            Contrôle enregistré avec succès.
          </p>
        </div>
      )}
    </div>
  )
}