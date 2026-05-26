import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Minecraft Server Dashboard',
  description: 'Server status and player logs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="mc-container">
          <header className="mc-header">
            <h1 className="mc-logo">Hélio's Server</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
