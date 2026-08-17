import { useQuery } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function fetchActivity() {
  const { data } = await apiClient.get('/activity')
  return data
}

export function useActivity(options = {}) {
  return useQuery({
    queryKey: ['activity'],
    queryFn: fetchActivity,
    ...options,
  })
}