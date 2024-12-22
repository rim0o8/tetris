'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './globals.css'
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const { i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = localStorage.getItem('i18nextLng') || 'en'
      await i18n.changeLanguage(savedLanguage)
      setIsLoading(false)
    }

    initializeLanguage()
  }, [i18n])

  if (isLoading) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-background font-sans antialiased">
          <div className="flex items-center justify-center h-screen">
            <div>Loading...</div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang={i18n.language} suppressHydrationWarning>
      <Providers>
        <body className="min-h-screen bg-background font-sans antialiased" style={{ overflow: 'hidden', position: 'fixed', width: '100%', height: '100%' }}>
          <main className="container mx-auto px-4" style={{ overflow: 'hidden' }}>
            {children}
          </main>
        </body>
      </Providers>
    </html>
  )
}

