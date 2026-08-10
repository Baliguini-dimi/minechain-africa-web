import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function reportAnomaly({ lotId, payload }) {
  const { data } = await apiClient.post(`/lots/${lotId}/anomalies`, payload)
  return data
}

async function resolveAnomaly({ anomalyId, resolution }) {
  const { data } = await apiClient.post(`/anomalies/${anomalyId}/resolve`, { resolution })
  return data
}

export function useReportAnomaly(lotId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => reportAnomaly({ lotId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots', String(lotId)] })
      queryClient.invalidateQueries({ queryKey: ['lots'] })
    },
  })
}

export function useResolveAnomaly(lotId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resolveAnomaly,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots', String(lotId)] })
    },
  })
}