import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function fetchResourceTypes() {
  const { data } = await apiClient.get('/resource-types')
  return data
}

async function createResourceType(payload) {
  const { data } = await apiClient.post('/resource-types', payload)
  return data
}

export function useResourceTypes() {
  return useQuery({
    queryKey: ['resource-types'],
    queryFn: fetchResourceTypes,
  })
}

export function useCreateResourceType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createResourceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-types'] })
    },
  })
}