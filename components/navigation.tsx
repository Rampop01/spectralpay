"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X, ExternalLink } from "lucide-react"
import { useAccount } from "@starknet-react/core"
import { WalletConnectButton } from "./wallet-connector"
import { formatAddress, getExplorerUrl } from "@/lib/starknet/config"

export function Navigation() {
  const { address, isConnected } = useAccount()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-foreground italic">
              Spectral<span className="text-primary">Pay</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Browse Jobs
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/for-employers"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              For Employers
            </Link>
            <Link href="/for-workers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              For Workers
            </Link>
            <Link href="/zk-verification" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ZK Verification
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center gap-4">
            {isConnected && (
              <Link href="/dashboard">
                <Button variant="outline" className="border-primary/50 hover:border-primary bg-transparent">
                  Dashboard
                </Button>
              </Link>
            )}
            <WalletConnectButton />
            {isConnected && (
              <Button
                onClick={() => window.open(getExplorerUrl(address!), "_blank")}
                variant="outline"
                size="sm"
                className="border-primary/50 hover:border-primary"
                title="View on Explorer"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50">
            <Link href="/jobs" className="block text-sm text-muted-foreground hover:text-foreground">
              Browse Jobs
            </Link>
            <Link href="/how-it-works" className="block text-sm text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="/for-employers" className="block text-sm text-muted-foreground hover:text-foreground">
              For Employers
            </Link>
            <Link href="/for-workers" className="block text-sm text-muted-foreground hover:text-foreground">
              For Workers
            </Link>
            <Link href="/zk-verification" className="block text-sm text-muted-foreground hover:text-foreground">
              ZK Verification
            </Link>
            <div className="pt-2">
              <WalletConnectButton />
            </div>
            {isConnected && (
              <div className="pt-2">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full mb-2">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={() => window.open(getExplorerUrl(address!), "_blank")}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
