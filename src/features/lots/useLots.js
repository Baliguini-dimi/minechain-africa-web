import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function fetchLots() {
  const { data } = await apiClient.get('/lots')
  return data
}

async function fetchLot(id) {
  const { data } = await apiClient.get(`/lots/${id}`)
  return data
}

async function createLot(payload) {
  const { data } = await apiClient.post('/lots', payload)
  return data
}

export function useLots() {
  return useQuery({
    queryKey: ['lots'],
    queryFn: fetchLots,
  })
}

export function useLot(id) {
  return useQuery({
    queryKey: ['lots', id],
    queryFn: () => fetchLot(id),
    enabled: !!id,
  })
}

export function useCreateLot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] })
    },
  })
}