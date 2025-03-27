import { Card, Flex, Avatar, Box, Text, IconButton } from '@radix-ui/themes'
import { HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons'
import { useFavoritesToggle } from '@/hooks/favorites'
import { useFavoritesStore } from '@/stores/favorites'
import { type Token } from '@/types'

export const TokenCard = ({ token }: { token: Token }) => {
  const { addFavorite, removeFavorite, isPending } = useFavoritesToggle()
  const isFavorite = useFavoritesStore(state => state.favorites.has(token.id))

  const handleClick = () => {
    if (isFavorite) {
      removeFavorite(token.id)
    } else {
      addFavorite(token.id)
    }
  }

  return (
    <Card>
      <Flex gap="3" align="center">
        <Avatar
          src={token.image}
          fallback={token.symbol}
          size="3"
          radius="full"
        />
        <Box>
          <Text as="div" size="2" weight="bold">
            {token.name}
          </Text>
          <Text as="div" size="2" color="gray">
            {token.symbol}
          </Text>
        </Box>
        <Box className="ml-auto">
          <IconButton
            variant="ghost"
            color="gray"
            disabled={isPending}
            onClick={handleClick}
            className="transition-colors duration-200 hover:bg-gray-100"
          >
            {isFavorite ? (
              <HeartFilledIcon className="w-5 h-5" color="white" />
            ) : (
              <HeartIcon className="w-5 h-5" color="gray" />
            )}
          </IconButton>
        </Box>
      </Flex>
    </Card>
  )
}