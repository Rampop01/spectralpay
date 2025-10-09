"use client"

import React from "react"
import { StarknetConfig, publicProvider, argent, braavos, voyager } from "@starknet-react/core"
import { sepolia, mainnet } from "@starknet-react/chains"

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const chains = [sepolia, mainnet]
  const provider = publicProvider()
  const connectors = [
    argent(),
    braavos(),
  ]

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect={false} // Disable auto-connection to prevent fake connections
    >
      {children}
    </StarknetConfig>
  )
}