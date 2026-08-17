import { useQuery } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function search(query) {
  const { data } = await apiClient.get('/search', { params: { q: query } })
  return data
}

export function useSearch(query) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => search(query),
    enabled: query.length >= 2,
    staleTime: 10000,
  })
}