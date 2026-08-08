export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-text-primary/40 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary font-body text-sm"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}