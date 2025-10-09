"use client"

import { useState } from "react"
import { usePseudonymRegistryContract } from "./use-contracts"
import { PseudonymRegistryContract, ZKProofComponents, createMockZKProof } from "@/lib/starknet/contracts"

export function useSkillVerification() {
  const { contract, isConnected, account } = usePseudonymRegistryContract()
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifySkillForJob = async (
    workerPseudonym: string, 
    requiredSkillHash: string
  ): Promise<boolean> => {
    if (!isConnected || !account) {
      setError("Wallet not connected")
      return false
    }

    setVerifying(true)
    setError(null)
    
    try {
      const pseudonymContract = new PseudonymRegistryContract(account)
      
      // Create mock ZK proof for skill verification
      const zkProof: ZKProofComponents = createMockZKProof()
      
      // Verify the worker has the required skill
      const isVerified = await pseudonymContract.verifySkillRequirement(
        workerPseudonym,
        requiredSkillHash,
        zkProof
      )
      
      return isVerified
    } catch (err) {
      console.error("[v0] Error verifying skill:", err)
      setError("Failed to verify skill")
      return false
    } finally {
      setVerifying(false)
    }
  }

  const checkPseudonymRegistration = async (pseudonym: string): Promise<boolean> => {
    if (!isConnected || !account) return false
    
    try {
      const pseudonymContract = new PseudonymRegistryContract(account)
      return await pseudonymContract.isPseudonymRegistered(pseudonym)
    } catch (err) {
      console.error("[v0] Error checking pseudonym:", err)
      return false
    }
  }

  return {
    verifySkillForJob,
    checkPseudonymRegistration,
    verifying,
    error
  }
}

export function useWorkerProfile() {
  const { contract, isConnected, account } = usePseudonymRegistryContract()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWorkerProfile = async (pseudonym: string) => {
    if (!isConnected || !account) {
      setError("Wallet not connected")
      return null
    }

    setLoading(true)
    setError(null)
    
    try {
      const pseudonymContract = new PseudonymRegistryContract(account)
      const profile = await pseudonymContract.getWorkerProfile(pseudonym)
      return profile
    } catch (err) {
      console.error("[v0] Error fetching worker profile:", err)
      setError("Failed to fetch worker profile")
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getWorkerProfile,
    loading,
    error
  }
}