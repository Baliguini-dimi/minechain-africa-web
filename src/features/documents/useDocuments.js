import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function fetchDocuments(lotId) {
  const { data } = await apiClient.get(`/lots/${lotId}/documents`)
  return data
}

async function uploadDocument({ lotId, file, documentType }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('document_type', documentType)

  const { data } = await apiClient.post(`/lots/${lotId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export function useDocuments(lotId) {
  return useQuery({
    queryKey: ['lots', String(lotId), 'documents'],
    queryFn: () => fetchDocuments(lotId),
    enabled: !!lotId,
  })
}

export function useUploadDocument(lotId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, documentType }) => uploadDocument({ lotId, file, documentType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots', String(lotId), 'documents'] })
    },
  })
}