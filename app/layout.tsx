import type { Metadata } from "next"
import { Geist, Geist_Mono, Lora, Playfair_Display } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
})

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, fontMono.variable, "font-serif", lora.variable, playfairDisplayHeading.variable)}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
