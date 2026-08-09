export default function Select({ label, value, onChange, options, required }) {
  return (
    <div>
      <label className="block text-xs font-medium font-body text-text-secondary mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 rounded border border-border font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent bg-surface"
      >
        <option value="">Sélectionner...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}