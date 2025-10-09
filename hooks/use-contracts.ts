"use client"

import { useAccount, useNetwork } from "@starknet-react/core"
import { useMemo } from "react"
import { JobMarketplaceContract, PseudonymRegistryContract, EscrowContract, ZKVerifierContract } from "@/lib/starknet/contracts"

// Hook to get contract instances
export function useContracts() {
  const { account } = useAccount()
  const { chain } = useNetwork()

  const contracts = useMemo(() => {
    if (!account) {
      return {
        jobMarketplace: null,
        pseudonymRegistry: null,
        escrow: null,
        zkVerifier: null,
      }
    }

    return {
      jobMarketplace: new JobMarketplaceContract(account),
      pseudonymRegistry: new PseudonymRegistryContract(account),
      escrow: new EscrowContract(account),
      zkVerifier: new ZKVerifierContract(account),
    }
  }, [account])

  return {
    ...contracts,
    isConnected: !!account,
    account,
    chainId: chain?.id,
  }
}

// Hook specifically for job marketplace
export function useJobMarketplaceContract() {
  const { jobMarketplace, isConnected, account } = useContracts()
  return { contract: jobMarketplace, isConnected, account }
}

// Hook for pseudonym registry
export function usePseudonymRegistryContract() {
  const { pseudonymRegistry, isConnected, account } = useContracts()
  return { contract: pseudonymRegistry, isConnected, account }
}

// Hook for escrow
export function useEscrowContract() {
  const { escrow, isConnected, account } = useContracts()
  return { contract: escrow, isConnected, account }
}

// Hook for ZK verifier
export function useZKVerifierContract() {
  const { zkVerifier, isConnected, account } = useContracts()
  return { contract: zkVerifier, isConnected, account }
}