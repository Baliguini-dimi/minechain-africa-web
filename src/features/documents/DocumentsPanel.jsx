import { useState, useRef } from 'react'
import { FileText, Upload, ExternalLink } from 'lucide-react'
import { useDocuments, useUploadDocument } from './useDocuments'
import { useAuth } from '../auth/useAuth.jsx'
import { ACTION_ACCESS, canAccess } from '../auth/permissions'
import Select from '../../components/Select'

const DOCUMENT_TYPES = [
  { value: 'certificat', label: 'Certificat' },
  { value: 'facture', label: 'Facture' },
  { value: 'photo', label: 'Photo' },
  { value: 'expedition', label: 'Document d\'expédition' },
  { value: 'controle', label: 'Document de contrôle' },
  { value: 'autre', label: 'Autre' },
]

export default function DocumentsPanel({ lotId }) {
  const { user } = useAuth()
  const { data, isLoading } = useDocuments(lotId)
  const uploadDocument = useUploadDocument(lotId)
  const fileInputRef = useRef(null)

  const [documentType, setDocumentType] = useState('')
  const [error, setError] = useState('')

  const canUpload = canAccess(ACTION_ACCESS, 'uploadDocument', user?.role?.name)
  const documents = data?.data ?? []

  function handleFileChange(event) {
    const file = event.target.files[0]
    if (!file) return

    if (!documentType) {
      setError('Sélectionnez un type de document avant de choisir un fichier.')
      event.target.value = ''
      return
    }

    setError('')
    uploadDocument.mutate(
      { file, documentType },
      {
        onError: () => setError("L'envoi a échoué. Vérifiez le format et la taille du fichier (10 Mo max)."),
        onSuccess: () => {
          setDocumentType('')
          if (fileInputRef.current) fileInputRef.current.value = ''
        },
      }
    )
  }

  if (isLoading) {
    return <p className="font-body text-sm text-text-secondary">Chargement des documents...</p>
  }

  return (
    <div>
      {canUpload && (
        <div className="bg-surface border border-border rounded-lg p-4 mb-4">
          <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
            Ajouter un document
          </h3>
          {error && (
            <p className="text-sm font-body text-status-anomaly mb-2">{error}</p>
          )}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Select
                label="Type de document"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                options={DOCUMENT_TYPES}
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadDocument.isPending}
              className="px-4 py-2 rounded bg-accent text-white font-body text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              <Upload size={15} />
              {uploadDocument.isPending ? 'Envoi...' : 'Choisir un fichier'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="font-body text-sm text-text-secondary">
          Aucun document associé à ce lot pour le moment.
        </p>
      ) : (
        <div className="bg-surface border border-border rounded-lg divide-y divide-border">
          {documents.map((doc) => (
            
              key={doc.id}
              href={doc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 hover:bg-bg/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-text-secondary" />
                <div>
                  <p className="font-body text-sm text-text-primary capitalize">{doc.document_type}</p>
                  <p className="font-mono text-xs text-text-secondary">
                    Ajouté par {doc.uploaded_by} · {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <ExternalLink size={14} className="text-text-secondary" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}