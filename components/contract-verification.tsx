"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAccount } from "@starknet-react/core"
import { CONTRACTS } from "@/lib/starknet/config"
import { Contract } from "starknet"
import jobMarketplaceAbi from "@/lib/contracts/abis/job-marketplace-abi.json"
import pseudonymRegistryAbi from "@/lib/contracts/abis/pseudonym-registry-abi.json"
import zkVerifierAbi from "@/lib/contracts/abis/zk-verifier-abi.json"
import escrowAbi from "@/lib/contracts/abis/escrow-abi.json"
import { AlertCircle, CheckCircle, Loader } from "lucide-react"

interface ContractStatus {
  name: string
  address: string
  status: "checking" | "deployed" | "not-found" | "error"
  error?: string
}

export function ContractVerification() {
  const { account, isConnected } = useAccount()
  const [contractStatuses, setContractStatuses] = useState<ContractStatus[]>([])
  const [checking, setChecking] = useState(false)

  const contracts = [
    { name: "JobMarketplace", address: CONTRACTS.JOB_MARKETPLACE, abi: jobMarketplaceAbi },
    { name: "PseudonymRegistry", address: CONTRACTS.PSEUDONYM_REGISTRY, abi: pseudonymRegistryAbi },
    { name: "Escrow", address: CONTRACTS.ESCROW, abi: escrowAbi },
    { name: "ZKVerifier", address: CONTRACTS.ZK_VERIFIER, abi: zkVerifierAbi },
  ]

  const checkContract = async (contractInfo: typeof contracts[0]): Promise<ContractStatus> => {
    try {
      if (!account) {
        return {
          name: contractInfo.name,
          address: contractInfo.address,
          status: "error",
          error: "No account connected"
        }
      }

      const contract = new Contract({
        abi: contractInfo.abi,
        address: contractInfo.address
      })
      contract.connect(account)
      
      // Try to call a simple view function to verify the contract exists
      let testCall: Promise<any>
      
      switch (contractInfo.name) {
        case "JobMarketplace":
          // Try to get job details for a non-existent job (should not revert)
          testCall = contract.get_job_details({ low: "999999", high: "0" })
          break
        case "PseudonymRegistry":
          // Try to check if a pseudonym is registered
          testCall = contract.is_pseudonym_registered("test_pseudonym")
          break
        case "Escrow":
          // Try to get escrow details for a non-existent escrow
          testCall = contract.get_escrow_details({ low: "999999", high: "0" })
          break
        case "ZKVerifier":
          // Try to check a verification key
          testCall = contract.is_valid_verification_key("0x1", "0x1")
          break
        default:
          throw new Error("Unknown contract type")
      }

      await testCall
      
      return {
        name: contractInfo.name,
        address: contractInfo.address,
        status: "deployed"
      }
    } catch (error) {
      console.error(`[v0] Error checking ${contractInfo.name}:`, error)
      
      let errorMessage = "Unknown error"
      if (error instanceof Error) {
        if (error.message.includes("Contract not found")) {
          errorMessage = "Contract not found at this address"
        } else if (error.message.includes("Invalid contract class")) {
          errorMessage = "Contract ABI mismatch"
        } else {
          errorMessage = error.message
        }
      }

      return {
        name: contractInfo.name,
        address: contractInfo.address,
        status: "not-found",
        error: errorMessage
      }
    }
  }

  const checkAllContracts = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    setChecking(true)
    setContractStatuses(contracts.map(c => ({ 
      name: c.name, 
      address: c.address, 
      status: "checking" as const 
    })))

    try {
      const results = await Promise.all(
        contracts.map(contract => checkContract(contract))
      )
      setContractStatuses(results)
    } catch (error) {
      console.error("[v0] Error checking contracts:", error)
    } finally {
      setChecking(false)
    }
  }

  const getStatusIcon = (status: ContractStatus["status"]) => {
    switch (status) {
      case "checking":
        return <Loader className="w-4 h-4 animate-spin text-blue-500" />
      case "deployed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "not-found":
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: ContractStatus["status"]) => {
    switch (status) {
      case "checking":
        return <Badge variant="outline">Checking...</Badge>
      case "deployed":
        return <Badge className="bg-green-100 text-green-800">Deployed</Badge>
      case "not-found":
        return <Badge variant="destructive">Not Found</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Contract Verification</h3>
            <p className="text-sm text-muted-foreground">
              Check if all contracts are deployed and accessible
            </p>
          </div>
          <Button 
            onClick={checkAllContracts}
            disabled={!isConnected || checking}
          >
            {checking ? "Checking..." : "Check Contracts"}
          </Button>
        </div>

        {contractStatuses.length > 0 && (
          <div className="space-y-3">
            {contractStatuses.map((contract) => (
              <div key={contract.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(contract.status)}
                  <div>
                    <h4 className="font-medium">{contract.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {contract.address}
                    </p>
                    {contract.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {contract.error}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusBadge(contract.status)}
              </div>
            ))}
          </div>
        )}

        {contractStatuses.some(c => c.status === "not-found" || c.status === "error") && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Troubleshooting Tips:</p>
                <ul className="mt-2 space-y-1 text-yellow-700">
                  <li>• Make sure you're connected to Starknet Sepolia testnet</li>
                  <li>• Check if your wallet is on the correct network</li>
                  <li>• Verify the contract addresses in the config</li>
                  <li>• Try refreshing and reconnecting your wallet</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}