import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function fetchCheckpoints() {
  const { data } = await apiClient.get('/checkpoints')
  return data
}

async function submitCheckpointControl(payload) {
  const { data } = await apiClient.post('/checkpoint-controls', payload)
  return data
}

export function useCheckpoints() {
  return useQuery({
    queryKey: ['checkpoints'],
    queryFn: fetchCheckpoints,
  })
}

export function useSubmitCheckpointControl() {
  return useMutation({
    mutationFn: submitCheckpointControl,
  })
}