'use client'

// import { useQuery } from "@tanstack/react-query"
// import axios from "axios"
import mockData from "./mock-data.json"
import { Table, Card, Flex, Avatar, Box, Text, IconButton } from "@radix-ui/themes"
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons"
import { Percentage, Monetary } from "@/components/ui/Numbers"
import { withDynamicProps } from "@/components/ui/Text"
import { useState, useMemo, useEffect, useRef, type RefObject } from "react"
import {
  type ColumnDef,
  type Row as RowType,
  type Table as TableType,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useVirtualizer,
  VirtualItem,
  Virtualizer
} from "@tanstack/react-virtual"
import { useFavoritesStore } from "@/stores/favorites"
interface Token {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

// an arbitrary threshold for the weight modifier
const THRESHOLD = 4

// @TODO: account for exact 0 values
const FormattedPercentage = withDynamicProps(Percentage, (props) => ({
  ...props,
  color: props.value >= 0 ? "teal" : "crimson",
  weight: Math.abs(props.value) > THRESHOLD ? "bold" : "regular",
}))

export const Retriever = () => {
  /*const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () =>
      axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          per_page: 100,
        },
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'CG-4Toj2wKfvZoZW66uiUpCFkBQ',
        },
      }),
    enabled: true,
  })*/

  //console.log(mockData)

  // For table virtualization
  const containerRef = useRef<HTMLDivElement>(null)

  const columns = useMemo<ColumnDef<Token>[]>(() => [
    {
      header: "Token",
      accessorKey: "name",
      size: 300,
      cell: ({ row }) => {
        const { original } = row

        return (
          <TokenCard token={original} />
        )
      }
    },
    {
      header: "Price (USD)",
      accessorKey:  "current_price",
      size: 100,
      cell: (info) => (
        <Monetary value={info.getValue<number>()} />
      )
    },
    {
      header: "24h %",
      accessorKey: "price_change_percentage_24h",
      size: 100,
      cell: (info) => (
        <FormattedPercentage value={info.getValue<number>()} />
      )
    },
    {
      header: "Market Cap",
      accessorKey: "market_cap",
      size: 100,
      cell: (info) => (
        <Monetary value={info.getValue<number>()} />
      )
    },
    {
      header: "Volume",
      accessorKey: "total_volume",
      size: 100,
      cell: (info) => (
        <Monetary value={info.getValue<number>()} />
      )
    }
  ], [])

  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 88,
    getScrollElement: () => containerRef.current,
    overscan: 10,
  })

  return (
    <div>
      {/* <div style={{ height: `${rowVirtualizer.getTotalSize()}px`}}> */}
        <Table.Root size="1" ref={containerRef} className="h-[calc(100vh-5rem)]">
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id} className="sticky top-0 z-10 bg-black">
                {headerGroup.headers.map((header, index) => (
                  <Table.ColumnHeaderCell
                    key={header.id}
                    align="center"
                    justify={index === 0 ? "start" : "end"}
                    // style={{ width: `${header.getSize()}px` }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            ))}
          </Table.Header>

          <Table.Body className="z-1">
            {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index] as RowType<Token>

              return (
                <Table.Row
                  key={row.id}
                  align="center"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - (index * virtualRow.size)}px)`
                  }}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <Table.Cell
                      key={cell.id}
                      align="center"
                      justify={cellIndex === 0 ? "start" : "end"}
                      style={{ width: `${cell.column.getSize()}px` }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      {/* </div> */}
    </div>
  )
}

const TokenCard = ({ token }: { token: Token }) => {
  // This convention prevents re-rendering every component when favorites change
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite)
  const isFavorite = useFavoritesStore(state => state.favorites.has(token.id))

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
        </Box>
        <Box className="ml-auto">
          <IconButton variant="ghost" color="gray" onClick={() => toggleFavorite(token.id)}>
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