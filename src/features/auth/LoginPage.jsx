import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, verifyTwoFactor } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [pendingUserId, setPendingUserId] = useState(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLoginSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await login(email, password)

      if (result.requiresTwoFactor) {
        setPendingUserId(result.userId)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleTwoFactorSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await verifyTwoFactor(pendingUserId, code)
      navigate('/')
    } catch (err) {
      setError('Code de vérification invalide.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-lg p-8">
        <h1 className="font-display text-2xl font-semibold text-text-primary mb-1">
          MineChain Africa
        </h1>
        <p className="font-body text-sm text-text-secondary mb-6">
          {pendingUserId ? 'Vérification en deux étapes' : 'Connexion à votre espace'}
        </p>

        {error && (
          <div className="mb-4 px-3 py-2 rounded text-sm font-body bg-status-anomaly/10 text-status-anomaly border border-status-anomaly/30">
            {error}
          </div>
        )}

        {!pendingUserId ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium font-body text-text-secondary mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded border border-border font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium font-body text-text-secondary mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded border border-border font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium font-body text-text-secondary mb-1">
                Code de vérification
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-3 py-2 rounded border border-border font-mono text-lg tracking-widest text-center text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Vérification...' : 'Vérifier'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}