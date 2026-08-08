import { useQuery } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function fetchOrganizations() {
  const { data } = await apiClient.get('/organizations')
  return data
}

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  })
}