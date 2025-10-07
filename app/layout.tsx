import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { StarknetWalletProvider } from "@/lib/starknet/wallet"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SpectralPay - Privacy-First Salary Payments on Starknet",
  description: "Work anonymously, get paid fairly. The first privacy-preserving payment platform on Starknet.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <StarknetWalletProvider>{children}</StarknetWalletProvider>
      </body>
    </html>
  )
}
