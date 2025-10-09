"use client"

import { useAccount } from "@starknet-react/core"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Wallet } from "lucide-react"

export function WalletStatus() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      <Card className="p-4 bg-yellow-500/10 border-yellow-500/30">
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-yellow-500" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Wallet Not Connected</p>
            <p className="text-xs text-muted-foreground">Connect your Starknet wallet to interact with contracts</p>
          </div>
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
          <p className="text-xs text-muted-foreground font-mono">{address}</p>
        </div>
        <Badge variant="secondary" className="bg-green-500/20 text-green-500 border-green-500/30">
          <Wallet className="h-3 w-3 mr-1" />
          Active
        </Badge>
      </div>
    </Card>
  )
}
