function App() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="bg-surface border border-border rounded-lg p-8 shadow-sm">
        <h1 className="font-display text-3xl font-semibold text-text-primary mb-2">
          MineChain Africa
        </h1>
        <p className="font-body text-text-secondary mb-4">
          Design system connecté avec succès.
        </p>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded text-sm font-mono bg-status-verified/10 text-status-verified border border-status-verified/30">
            Livré
          </span>
          <span className="px-3 py-1 rounded text-sm font-mono bg-status-transit/10 text-status-transit border border-status-transit/30">
            En transit
          </span>
          <span className="px-3 py-1 rounded text-sm font-mono bg-status-anomaly/10 text-status-anomaly border border-status-anomaly/30">
            Anomalie
          </span>
        </div>
      </div>
    </div>
  )
}

export default App