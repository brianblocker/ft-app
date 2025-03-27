'use client'

import mockData from "./mock-data.json"
import { Table } from "@radix-ui/themes"
import { Monetary, FormattedPercentage } from "@/components/ui/Numbers"
import { useMemo } from "react"
import { useFavoritesSync } from "@/hooks/favorites"
import { TokenCard } from "./TokenCard"
import { type Token } from "@/types"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

/**
 * Architectural note - This table should be virtualized so that we only render
 * the visible rows in the viewport. This will improve performance and reduce
 * memory usage, as well as allow for smaller background updates. Tanstack Table
 * has a virtualizer plugin, but integrating it with Radix wasn't as simple as I
 * originally hoped. In an effort to focus on speed, I've opted to not implement
 * virtualization for now, acknowledging that it's a necessary optimization.
 */
export const Retriever = () => {
  // hacking this for now
  useFavoritesSync()

  // @todo: with a little more time I'd like to actually add filtering
  // and searching to this table, because nobody ever likes getting
  // to page 5 of a table.
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

  const columns = useMemo<ColumnDef<Token>[]>(() => [
    {
      header: "Token",
      accessorKey: "name",
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
      cell: info => (
        <Monetary value={info.getValue<number>()} />
      )
    },
    {
      header: "24h %",
      accessorKey: "price_change_percentage_24h",
      cell: info => (
        <FormattedPercentage value={info.getValue<number>()} />
      )
    },
    {
      header: "Market Cap",
      accessorKey: "market_cap",
      cell: info => (
        <Monetary value={info.getValue<number>()} />
      )
    },
    {
      header: "Volume",
      accessorKey: "total_volume",
      cell: info => (
        <Monetary value={info.getValue<number>()} />
      )
    },
  ], [])

  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table.Root size="1" className="h-[calc(50vh)]">
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row
            key={headerGroup.id}
            className="sticky top-0 z-10 bg-background"
          >
            {headerGroup.headers.map((header, index) => (
              <Table.ColumnHeaderCell
                key={header.id}
                align="center"
                justify={index === 0 ? "start" : "end"}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        ))}
      </Table.Header>

      {/* FWIW, I'm not a fan of the z-index hack here. It's a hack. */}
      <Table.Body className="z-9">
        {table.getRowModel().rows.map(row => (
          <Table.Row
            key={row.id}
            align="center"
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
        ))}
      </Table.Body>
    </Table.Root>
  )
}
