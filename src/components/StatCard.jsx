export default function StatCard({ label, value, accentColor = 'accent' }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <p className="font-body text-xs text-text-secondary uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`font-display text-3xl font-semibold text-${accentColor}`}>
        {value}
      </p>
    </div>
  )
}