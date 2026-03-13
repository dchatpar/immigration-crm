import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Immigration CRM System',
  description: 'Enterprise Immigration Case Management & CRM Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const convexDeployment = process.env.NEXT_PUBLIC_CONVEX_DEPLOYMENT
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          {convexDeployment ? (
            <ConvexWrapper deployment={convexDeployment}>
              <Providers>{children}</Providers>
            </ConvexWrapper>
          ) : (
            <Providers>{children}</Providers>
          )}
        </ErrorBoundary>
      </body>
    </html>
  )
}

function ConvexWrapper({ 
  children, 
  deployment 
}: { 
  children: React.ReactNode
  deployment: string 
}) {
  try {
    const { ConvexProvider, ConvexReactClient } = require("convex/react")
    const convex = new ConvexReactClient(deployment)
    return <ConvexProvider client={convex}>{children}</ConvexProvider>
  } catch (e) {
    return <>{children}</>
  }
}
