import { ReactNode } from 'react'
import { Container } from '@radix-ui/themes'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Container size="4">
      {children}
    </Container>
  )
}