import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hotel Booking Management System',
  description: 'A comprehensive hotel booking system for hotels and clients',
  keywords: ['hotel booking', 'reservation system', 'hotel management', 'travel', 'accommodation'],
  authors: [{ name: 'Kevin Brinsly' }],
  openGraph: {
    title: 'Hotel Booking Management System',
    description: 'Book hotels easily with our comprehensive booking platform',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Booking Management System',
    description: 'Book hotels easily with our comprehensive booking platform',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
