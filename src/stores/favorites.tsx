import { create } from 'zustand'

interface FavoritesStore {
  favorites: Set<string>
  toggleFavorite: (id: string) => void
}

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  favorites: new Set(),
  toggleFavorite: (id) => set((prevState) => {
    const favorites = new Set(prevState.favorites)

    favorites.has(id) ? favorites.delete(id) : favorites.add(id)

    return { favorites }
  }),
}))