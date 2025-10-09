"use client"

import React, { useEffect } from "react"
import {
  useAccount,
  useConnect,
  useDisconnect,
  type Connector,
} from "@starknet-react/core"
import { connect as starknetkitConnect, disconnect as starknetkitDisconnect } from "starknetkit"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Wallet } from "lucide-react"

export function WalletConnector() {
  const { disconnect } = useDisconnect()
  const { connect, connectors } = useConnect()
  const { address, isConnected } = useAccount()

  const connectWallet = async () => {
    try {
      // Use starknetkit connect directly with modal options
      const connection = await starknetkitConnect({
        webWalletUrl: "https://web.argent.xyz",
        argentMobileOptions: {
          dappName: "SpectralPay",
          url: window.location.hostname,
        },
        modalMode: "alwaysAsk", // Force modal to always show
        modalTheme: "system",
      })
      
      if (!connection) return
      
      // Find the matching connector
      const selectedConnector = connectors.find(
        (connector) => connector.id === connection.wallet?.id
      )
      
      if (selectedConnector) {
        await connect({ connector: selectedConnector })
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-4 bg-yellow-500/10 border-yellow-500/30">
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-yellow-500" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Wallet Not Connected</p>
            <p className="text-xs text-muted-foreground">Connect your Starknet wallet to interact with contracts</p>
          </div>
          <Button 
            onClick={connectWallet} 
            className="bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 bg-green-500/10 border-green-500/30">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <div className="flex-1">
          <p className="font-semibold text-sm">Wallet Connected</p>
          <p className="text-xs text-muted-foreground font-mono">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-500/20 text-green-500 border-green-500/30">
            <Wallet className="h-3 w-3 mr-1" />
            Active
          </Badge>
          <Button 
            onClick={() => disconnect()} 
            variant="outline" 
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Disconnect
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function WalletConnectButton() {
  const { disconnect } = useDisconnect()
  const { connect, connectors } = useConnect()
  const { address, isConnected } = useAccount()

  // Ensure we start from a clean state
  useEffect(() => {
    console.log("🔍 Checking wallet connection state...")
    console.log("Is connected:", isConnected)
    console.log("Address:", address)
    console.log("Available connectors:", connectors.length)
    
    // If somehow connected without user interaction, disconnect
    if (isConnected && !localStorage.getItem('wallet_manually_connected')) {
      console.log("⚠️ Found unexpected connection, disconnecting...")
      disconnect()
    }
  }, [isConnected, address, connectors.length, disconnect])

  const connectWallet = async () => {
    try {
      console.log("🔗 User initiated wallet connection...")
      
      // Force disconnect first to ensure clean state
      if (isConnected) {
        await starknetkitDisconnect({ clearLastWallet: true })
        disconnect()
      }
      
      // Use starknetkit connect directly with modal options
      const connection = await starknetkitConnect({
        webWalletUrl: "https://web.argent.xyz",
        argentMobileOptions: {
          dappName: "SpectralPay",
          url: window.location.hostname,
        },
        modalMode: "alwaysAsk", // Force modal to always show
        modalTheme: "system",
      })
      
      if (!connection) {
        console.log("❌ No wallet selected by user")
        return
      }
      
      console.log("✅ Wallet selected:", connection.wallet?.name || "Unknown")
      
      // Find the matching connector
      const selectedConnector = connectors.find(
        (connector) => connector.id === connection.wallet?.id
      )
      
      if (!selectedConnector) {
        console.error("❌ No matching connector found")
        return
      }
      
      // Mark as manually connected
      localStorage.setItem('wallet_manually_connected', 'true')
      
      await connect({ connector: selectedConnector })
      
      console.log("🎉 Wallet connection successful!")
    } catch (error) {
      console.error("❌ Failed to connect wallet:", error)
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes("User rejected") || error.message.includes("User aborted")) {
          console.log("ℹ️ User cancelled connection")
          return
        } else if (error.message.includes("No wallet found")) {
          alert("No Starknet wallet found! Please install ArgentX or Braavos wallet extension.")
          window.open("https://www.argent.xyz/argent-x/", "_blank")
          return
        }
      }
      
      alert(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDisconnect = async () => {
    console.log("🔌 User initiated disconnect...")
    localStorage.removeItem('wallet_manually_connected')
    
    // Disconnect from starknetkit first
    try {
      await starknetkitDisconnect({ clearLastWallet: true })
    } catch (error) {
      console.warn("Warning during starknetkit disconnect:", error)
    }
    
    // Then disconnect from starknet-react
    disconnect()
  }

  if (!isConnected) {
    return (
      <Button 
        onClick={connectWallet} 
        className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-200"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg text-sm font-mono text-foreground">
        <Wallet className="w-3 h-3 mr-2 inline text-primary" />
        <span className="hidden sm:inline">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
        </span>
        <span className="sm:hidden">
          {address ? `${address.slice(0, 4)}...${address.slice(-2)}` : ""}
        </span>
      </div>
      <Button
        onClick={handleDisconnect}
        variant="outline"
        size="sm"
        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors"
      >
        <span className="hidden sm:inline">Disconnect</span>
        <span className="sm:hidden">×</span>
      </Button>
    </div>
  )
}