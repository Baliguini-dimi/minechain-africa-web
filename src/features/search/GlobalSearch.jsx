import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useSearch } from './useSearch'
import StatusBadge from '../../components/StatusBadge'

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  const { data, isFetching } = useSearch(query)
  const results = data?.data ?? []

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(lotId) {
    navigate(`/lots/${lotId}`)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Rechercher un lot ou un passeport..."
          className="w-full pl-9 pr-8 py-1.5 rounded border border-border bg-bg font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:bg-surface"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-1 w-full bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-20">
          {isFetching ? (
            <p className="px-4 py-3 font-body text-sm text-text-secondary">Recherche...</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 font-body text-sm text-text-secondary">
              Aucun résultat pour "{query}".
            </p>
          ) : (
            <div className="divide-y divide-border max-h-80 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result.id)}
                  className="w-full text-left px-4 py-2.5 hover:bg-bg/50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-mono text-sm text-accent">{result.uuid.slice(0, 8)}</p>
                    <p className="font-body text-xs text-text-secondary">
                      {result.resource_name} · {result.passport_identifier}
                    </p>
                  </div>
                  <StatusBadge status={result.status} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
