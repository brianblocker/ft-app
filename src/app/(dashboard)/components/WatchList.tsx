'use client'

import { useFavoritesStore } from '@/stores/favorites'
import { Grid, Card, Box, Flex, Avatar, Text, Skeleton, IconButton } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Sparklines, SparklinesBars, SparklinesReferenceLine } from 'react-sparklines'
import { Monetary, FormattedPercentage } from '@/components/ui/Numbers'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useFavoritesToggle } from '@/hooks/favorites'
import { type Token } from '@/types'

type TokenWithSparkline = Token & {
  sparkline_in_7d: {
    price: number[]
  }
}

export const WatchList = () => {
  const favorites = useFavoritesStore(state => state.favorites)
  const favoritesArray = Array.from(favorites)

  // @todo: The watchlist should display in order of when it was added
  // to the watchlist, not the order of the API response.
  const { data } = useQuery({
    queryKey: ['watchlist', ...favoritesArray],
    queryFn: () =>
      axios.get<TokenWithSparkline[]>('/coingecko/coins/markets', {
        params: {
          vs_currency: 'usd',
          per_page: favorites.size,
          ids: favoritesArray.join(','),
          sparkline: true,
          price_change_percentage: '24h',
        },
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'CG-4Toj2wKfvZoZW66uiUpCFkBQ',
        },
      }),
    staleTime: (1000 * 60), // refresh every 60 seconds
    placeholderData: (prev) => prev,
    enabled: favorites.size > 0
  })

  // For generating a skeleton when loading
  const totalAccountedFor = data?.data?.length || 0

  return (
    <Grid columns="3" gap="3" rows="repeat(2)" width="auto" height="auto" align="center">
      {data?.data?.map((token) => (
        <WatchedToken key={token.id} token={token} />
      ))}
      {Array.from({ length: favorites.size - totalAccountedFor }).map((_, index) => (
        <Skeleton className="w-full h-full min-h-[88px] min-w-[100px]" key={index} />
      ))}
    </Grid>
  )
}

// This doesn't have to be pulled out, but it would be much easier
// to animate if it's pulled out into its own component
const WatchedToken = ({ token }: { token: TokenWithSparkline }) => {
  const { removeFavorite } = useFavoritesToggle()
  // @todo: Implement animation here, use `react-spring` probably
  // const priceRef = useRef<number>(token.current_price)
  // const percentChangeRef = useRef<number>(token.price_change_percentage_24h)

  return (
    <Card size="3" className="overflow-hidden relative">
      <Box className="absolute top-0 left-0 w-full h-full opacity-15">
        <Avatar src={token.image} size="5" radius="full" fallback={token.symbol} />
      </Box>
      <Box width="150px" height="30px" className="absolute bottom-0 right-0 opacity-25">
        <Sparklines data={token.sparkline_in_7d.price} width={150} height={30}>
          <SparklinesBars style={{ fill: 'white', width: '1' }} />
          <SparklinesReferenceLine type="mean" />
        </Sparklines>
      </Box>
      <Flex gap="3" align="center" justify="between" pb="3">
        <Box>
          <Text as="div" size="2" weight="bold">
            {token.name}
          </Text>
          <Text as="div" size="2" color="gray">
            {token.symbol}
          </Text>
        </Box>
        <Box>
          <Text as="div" size="1" weight="bold">
            Price
          </Text>
          <Monetary value={token.current_price} size="1" />
        </Box>
        <Box>
          <Text as="div" size="1" weight="bold">
            24h % Change
          </Text>
          <FormattedPercentage value={token.price_change_percentage_24h} size="1" />
        </Box>
      </Flex>
      <Flex gap="3" align="center" justify="start">
        <Box>
          <Text as="div" size="1" weight="bold">
            Market Cap
          </Text>
          <Monetary value={token.market_cap} size="1" />
        </Box>
        <Box>
          <Text as="div" size="1" weight="bold">
            Total Volume
          </Text>
          <Monetary value={token.total_volume} size="1" />
        </Box>
      </Flex>
      <Box className="absolute top-2 right-2">
        <IconButton
          variant="ghost"
          size="1"
          color="gray"
          onClick={() => removeFavorite(token.id)}
        >
          <Cross2Icon />
        </IconButton>
      </Box>
    </Card>
  )
}