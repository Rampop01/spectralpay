"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface StarknetWalletContextType {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  account: any | null
}

const StarknetWalletContext = createContext<StarknetWalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  account: null,
})

export function StarknetWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [account, setAccount] = useState<any | null>(null)

  const connect = async () => {
    setIsConnecting(true)
    try {
      // Check if get-starknet is available
      if (typeof window !== "undefined" && (window as any).starknet) {
        const starknet = (window as any).starknet

        // Enable wallet connection
        await starknet.enable()

        if (starknet.isConnected) {
          setAddress(starknet.selectedAddress)
          setAccount(starknet.account)

          // Store connection in localStorage
          localStorage.setItem("starknet_connected", "true")

          console.log("[v0] Starknet wallet connected:", starknet.selectedAddress)
        }
      } else {
        // Wallet not installed
        alert("Please install a Starknet wallet (ArgentX or Braavos) to continue")
        window.open("https://www.argent.xyz/argent-x/", "_blank")
      }
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
      alert("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setAccount(null)
    localStorage.removeItem("starknet_connected")
    console.log("[v0] Starknet wallet disconnected")
  }

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem("starknet_connected")
    if (wasConnected === "true" && typeof window !== "undefined" && (window as any).starknet) {
      const starknet = (window as any).starknet
      if (starknet.isConnected) {
        setAddress(starknet.selectedAddress)
        setAccount(starknet.account)
      }
    }
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).starknet) {
      const starknet = (window as any).starknet

      starknet.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
          console.log("[v0] Account changed:", accounts[0])
        } else {
          disconnect()
        }
      })

      starknet.on("networkChanged", (network: string) => {
        console.log("[v0] Network changed:", network)
      })
    }
  }, [])

  return (
    <StarknetWalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
        account,
      }}
    >
      {children}
    </StarknetWalletContext.Provider>
  )
}

export function useStarknetWallet() {
  const context = useContext(StarknetWalletContext)
  if (!context) {
    throw new Error("useStarknetWallet must be used within StarknetWalletProvider")
  }
  return context
}
