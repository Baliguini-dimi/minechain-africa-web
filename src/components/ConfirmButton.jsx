import { useState } from 'react'

export default function ConfirmButton({ onConfirm, label, confirmLabel, variant = 'primary', disabled }) {
  const [isConfirming, setIsConfirming] = useState(false)

  const baseClasses = 'px-4 py-2 rounded font-body text-sm font-medium disabled:opacity-50'
  const variantClasses = {
    primary: 'bg-accent text-white hover:opacity-90',
    verified: 'bg-status-verified text-white hover:opacity-90',
    anomaly: 'bg-status-anomaly text-white hover:opacity-90',
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-body text-sm text-text-secondary">
          {confirmLabel ?? 'Confirmer ?'}
        </span>
        <button
          onClick={() => {
            onConfirm()
            setIsConfirming(false)
          }}
          className={`${baseClasses} ${variantClasses[variant]}`}
        >
          Oui
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          className="px-3 py-2 rounded font-body text-sm text-text-secondary hover:text-text-primary"
        >
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {label}
    </button>
  )
}