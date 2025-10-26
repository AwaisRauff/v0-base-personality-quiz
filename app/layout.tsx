import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Base Personality Quiz",
  description: "Discover your onchain personality on Base blockchain",
  generator: "v0.app",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%230052FF" width="100" height="100"/><text x="50" y="65" fontSize="60" fontWeight="bold" fill="white" textAnchor="middle">B</text></svg>',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased bg-gradient-to-br from-purple-900 to-black text-white min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
