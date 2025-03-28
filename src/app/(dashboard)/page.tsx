import { Section, Heading } from '@radix-ui/themes'
import { Retriever } from './components/Retriever'
import { WatchList } from './components/WatchList'

export default function Dashboard() {
  // @todo: Should hydrate the watchlist on the server side, haven't done
  // that before with NextJS so I'd need to read up on that.
  return (
    <>
      <Section pb="1">
        <Heading as="h2" size="4" weight="bold" my="3">
          Watchlist
        </Heading>
        <WatchList />
      </Section>
      <Section>
        <Heading as="h2" size="4" weight="bold" my="3">
          All Tokens
        </Heading>
        <Retriever />
      </Section>
    </>
  )
}