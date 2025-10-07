"use client"

import { useState, useEffect } from "react"
import { useStarknetWallet } from "@/lib/starknet/wallet"
import { PseudonymRegistryContract, type WorkerProfile } from "@/lib/starknet/contracts"

export function usePseudonymRegistry() {
  const { account, isConnected } = useStarknetWallet()
  const [contract, setContract] = useState<PseudonymRegistryContract | null>(null)

  useEffect(() => {
    if (isConnected && account) {
      setContract(new PseudonymRegistryContract(account))
    } else {
      setContract(null)
    }
  }, [account, isConnected])

  return contract
}

export function useWorkerProfile(pseudonym: string | null) {
  const contract = usePseudonymRegistry()
  const [profile, setProfile] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!contract || !pseudonym) return

    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const profileData = await contract.getWorkerProfile(pseudonym)
        setProfile(profileData)
      } catch (err) {
        console.error("[v0] Error fetching worker profile:", err)
        setError("Failed to fetch worker profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [contract, pseudonym])

  return { profile, loading, error }
}

export function useRegisterPseudonym() {
  const contract = usePseudonymRegistry()
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registerPseudonym = async (
    pseudonym: string,
    identityCommitment: string,
    skillsCommitment: string,
    reputationBond: string,
  ) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setRegistering(true)
    setError(null)
    try {
      const txHash = await contract.registerPseudonym(pseudonym, identityCommitment, skillsCommitment, reputationBond)
      return txHash
    } catch (err) {
      console.error("[v0] Error registering pseudonym:", err)
      setError("Failed to register pseudonym")
      return null
    } finally {
      setRegistering(false)
    }
  }

  return { registerPseudonym, registering, error }
}
