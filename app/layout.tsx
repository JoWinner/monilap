import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "./context/AppContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GroupSave",
  description: "Save together, achieve together",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <AppProvider>
          <div className="mx-auto max-w-md min-h-screen relative">{children}</div>
        </AppProvider>
      </body>
    </html>
  )
}