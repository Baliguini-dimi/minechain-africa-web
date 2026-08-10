import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function fetchGpsHistory(lotId) {
  const { data } = await apiClient.get(`/lots/${lotId}/gps-positions`)
  return data
}

async function assignGpsDevice({ lotId, deviceIdentifier }) {
  const { data } = await apiClient.post(`/lots/${lotId}/gps-device`, {
    device_identifier: deviceIdentifier,
  })
  return data
}

async function recordGpsPosition({ lotId, lat, lng, speed }) {
  const { data } = await apiClient.post(`/lots/${lotId}/gps-positions`, { lat, lng, speed })
  return data
}

export function useGpsHistory(lotId) {
  return useQuery({
    queryKey: ['lots', String(lotId), 'gps-positions'],
    queryFn: () => fetchGpsHistory(lotId),
    enabled: !!lotId,
  })
}

export function useAssignGpsDevice(lotId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (deviceIdentifier) => assignGpsDevice({ lotId, deviceIdentifier }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots', String(lotId), 'gps-positions'] })
    },
  })
}

export function useRecordGpsPosition(lotId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ lat, lng, speed }) => recordGpsPosition({ lotId, lat, lng, speed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots', String(lotId), 'gps-positions'] })
    },
  })
}