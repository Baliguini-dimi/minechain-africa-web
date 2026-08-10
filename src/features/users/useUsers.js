import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../services/apiClient'

async function fetchUsers() {
  const { data } = await apiClient.get('/users')
  return data
}

async function inviteUser(payload) {
  const { data } = await apiClient.post('/users', payload)
  return data
}

async function suspendUser(id) {
  const { data } = await apiClient.post(`/users/${id}/suspend`)
  return data
}

async function reactivateUser(id) {
  const { data } = await apiClient.post(`/users/${id}/reactivate`)
  return data
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}

export function useInviteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

function useUserAction(mutationFn) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useSuspendUser() {
  return useUserAction(suspendUser)
}

export function useReactivateUser() {
  return useUserAction(reactivateUser)
}