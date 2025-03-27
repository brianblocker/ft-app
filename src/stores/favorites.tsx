'use client'

import { create } from 'zustand'

interface FavoritesStore {
  favorites: Set<string>
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  setFavorites: (favorites: Set<string>) => void
}

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  favorites: new Set(),
  addFavorite: (id) => set((prevState) => {
    const favorites = new Set(prevState.favorites)

    favorites.add(id)

    return { favorites }
  }),
  removeFavorite: (id) => set((prevState) => {
    const favorites = new Set(prevState.favorites)

    favorites.delete(id)

    return { favorites }
  }),
  setFavorites: (favorites: Set<string>) => set({ favorites }),
}))