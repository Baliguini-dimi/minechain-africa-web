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

async function departLot(id) {
  const { data } = await apiClient.post(`/lots/${id}/depart`)
  return data
}

async function deliverLot(id) {
  const { data } = await apiClient.post(`/lots/${id}/deliver`)
  return data
}

async function closeLotPassport(id) {
  const { data } = await apiClient.post(`/lots/${id}/close-passport`)
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

function useLotAction(mutationFn) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['lots', String(id)] })
      queryClient.invalidateQueries({ queryKey: ['lots'] })
    },
  })
}

export function useDepartLot() {
  return useLotAction(departLot)
}

export function useDeliverLot() {
  return useLotAction(deliverLot)
}

export function useCloseLotPassport() {
  return useLotAction(closeLotPassport)
}