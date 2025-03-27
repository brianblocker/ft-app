import { useFavoritesStore } from "@/stores/favorites"
import { createClient } from "@/utils/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
const supabase = createClient()

/**
 * This hook is used to sync the favorites from the database to the local state.
 * It uses React Query to fetch the favorites from the database and update the
 * local state.
 */
export const useFavoritesSync = () => {
  const setFavorites = useFavoritesStore(state => state.setFavorites)
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => await supabase.from('favorites').select('coingecko_id'),
    select: (data) => data.data?.map(({ coingecko_id }) => coingecko_id as string),
  })


  useEffect(() => {
    if (!isLoading) {
      setFavorites(new Set(favorites || []))
    }
  }, [favorites, isLoading])
}

/**
 * This hook is used to toggle the favorite status of a token.
 * It uses optimistic updates to update the local state immediately.
 * If the server call fails, the local state is rolled back. Local state
 * allows for a more immediate response to the user. This could be cleaned
 * up by using a more complete state management solution, but for now this
 * is sufficient.
 */
export const useFavoritesToggle = () => {
  const queryClient = useQueryClient()
  // explicitly pull out the add and remove functions from the store
  // to avoid creating a new reference every time the store changes
  // (zustand magic)
  const addFavorite = useFavoritesStore(state => state.addFavorite)
  const removeFavorite = useFavoritesStore(state => state.removeFavorite)

  // we could do an actual toggle here instead of multiple mutation definitions,
  // but I wanted to be explicit
  const { mutate: addFavoriteToServer, isPending: isAddPending } = useMutation({
    mutationFn: async (coingecko_id: string) =>
      await supabase.from('favorites').insert({ coingecko_id }),
    onMutate: async (coingecko_id: string) => {
      addFavorite(coingecko_id)
    },
    onError: (error, coingecko_id) => {
      // @todo: we _should_ add logging here, at least show a toast,
      // but for now we'll just roll back the local state.
      removeFavorite(coingecko_id)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const { mutate: removeFavoriteFromServer, isPending: isRemovePending } = useMutation({
    mutationFn: async (coingecko_id: string) =>
      await supabase.from('favorites').delete().eq('coingecko_id', coingecko_id),
    onMutate: async (coingecko_id: string) => {
      removeFavorite(coingecko_id)
    },
    onError: (error, coingecko_id) => {
      // @todo: we _should_ add logging here, at least show a toast,
      // but for now we'll just roll back the local state.
      addFavorite(coingecko_id)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  return {
    addFavorite: addFavoriteToServer,
    removeFavorite: removeFavoriteFromServer,
    isPending: isAddPending || isRemovePending,
  }
}