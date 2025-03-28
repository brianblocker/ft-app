import { render } from '@testing-library/react'
import { TokenCard } from './TokenCard'
import { type Token } from '@/types'
import { useFavoritesStore } from '@/stores/favorites'
import { useFavoritesToggle } from '@/hooks/favorites'
import { createClient as createClientMock } from '@/utils/supabase/client'
import { createClient as createClientServerMock } from '@/utils/supabase/server'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/stores/favorites')
vi.mock('@/hooks/favorites')
vi.mock('@/utils/supabase/client', () => ({
  createClient: vi.fn(),
}))
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}))

const TEST_TOKEN_1: Token = {
  id: '1',
  name: 'Test Token',
  symbol: 'TEST',
  image: 'https://example.com/image.png',
  current_price: 100,
  price_change_percentage_24h: 10,
  market_cap: 1000000,
  total_volume: 1000000,
}

const TEST_TOKEN_2: Token = {
  id: '2',
  name: 'Test Token 2',
  symbol: 'TEST2',
  image: 'https://example.com/image2.png',
  current_price: 200,
  price_change_percentage_24h: 20,
  market_cap: 2000000,
  total_volume: 2000000,
}

// For the sake of time, I'm going to make a few tests.
// Ideally, I would make a test for each scenario.
describe('TokenCard', () => {
  const mockAddFavorite = vi.fn()
  const mockRemoveFavorite = vi.fn()
  const mockAddFavoriteServer = vi.fn()
  const mockRemoveFavoriteServer = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render and behave properly', () => {
    vi.mocked(useFavoritesStore).mockReturnValue(false)

    vi.mocked(useFavoritesToggle).mockReturnValue({
      addFavorite: mockAddFavoriteServer,
      removeFavorite: mockRemoveFavoriteServer,
      isPending: false,
    })

    const { getByText, getByTestId } = render(<TokenCard token={TEST_TOKEN_1} />)

    expect(getByText(TEST_TOKEN_1.name)).toBeDefined()
    expect(getByText(TEST_TOKEN_1.symbol)).toBeDefined()

    getByTestId('favorite-button').click()

    expect(mockAddFavoriteServer).toHaveBeenCalled()
  })

  it('should not let buttons be clicked when isPending is true', () => {
    vi.mocked(useFavoritesStore).mockReturnValue(false)

    vi.mocked(useFavoritesToggle).mockReturnValue({
      addFavorite: mockAddFavoriteServer,
      removeFavorite: mockRemoveFavoriteServer,
      isPending: true,
    })

    const { getByTestId } = render(<TokenCard token={TEST_TOKEN_1} />)

    getByTestId('favorite-button').click()

    expect(mockAddFavoriteServer).not.toHaveBeenCalled()
    expect(mockRemoveFavoriteServer).not.toHaveBeenCalled()
  })

  it('should call the correct functions when the button is clicked', () => {
    vi.mocked(useFavoritesStore).mockReturnValue(true)

    vi.mocked(useFavoritesToggle).mockReturnValue({
      addFavorite: mockAddFavoriteServer,
      removeFavorite: mockRemoveFavoriteServer,
      isPending: false,
    })

    const { getByTestId } = render(<TokenCard token={TEST_TOKEN_1} />)

    getByTestId('favorite-button').click()

    expect(mockRemoveFavoriteServer).toHaveBeenCalled()
  })
})