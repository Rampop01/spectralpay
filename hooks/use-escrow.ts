"use client"

import { useState, useEffect } from "react"
import { useStarknetWallet } from "@/lib/starknet/wallet"
import { EscrowContract } from "@/lib/starknet/contracts"

export function useEscrow() {
  const { account, isConnected } = useStarknetWallet()
  const [contract, setContract] = useState<EscrowContract | null>(null)

  useEffect(() => {
    if (isConnected && account) {
      setContract(new EscrowContract(account))
    } else {
      setContract(null)
    }
  }, [account, isConnected])

  return contract
}

export function useCreateEscrow() {
  const contract = useEscrow()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEscrow = async (
    jobId: string,
    workerPseudonym: string,
    amount: string,
    token: string
  ) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setCreating(true)
    setError(null)
    try {
      const txHash = await contract.createEscrow(jobId, workerPseudonym, amount, token)
      return txHash
    } catch (err) {
      console.error("[v0] Error creating escrow:", err)
      setError("Failed to create escrow")
      return null
    } finally {
      setCreating(false)
    }
  }

  return { createEscrow, creating, error }
}

export function useReleasePayment() {
  const contract = useEscrow()
  const [releasing, setReleasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const releasePayment = async (escrowId: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setReleasing(true)
    setError(null)
    try {
      const txHash = await contract.releasePayment(escrowId)
      return txHash
    } catch (err) {
      console.error("[v0] Error releasing payment:", err)
      setError("Failed to release payment")
      return null
    } finally {
      setReleasing(false)
    }
  }

  return { releasePayment, releasing, error }
}

export function useDisputePayment() {
  const contract = useEscrow()
  const [disputing, setDisputing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const disputePayment = async (escrowId: string, reason: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setDisputing(true)
    setError(null)
    try {
      const txHash = await contract.disputePayment(escrowId, reason)
      return txHash
    } catch (err) {
      console.error("[v0] Error disputing payment:", err)
      setError("Failed to dispute payment")
      return null
    } finally {
      setDisputing(false)
    }
  }

  return { disputePayment, disputing, error }
}
