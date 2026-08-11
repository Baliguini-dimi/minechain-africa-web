import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function fetchOrganizations() {
  const { data } = await apiClient.get('/organizations')
  return data
}

async function createOrganization(payload) {
  const { data } = await apiClient.post('/organizations', payload)
  return data
}

export function useOrganizations(options = {}) {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    ...options,
  })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}