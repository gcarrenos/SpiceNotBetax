import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SpiceNot - Live Streams',
  description: 'Watch and stream live content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
