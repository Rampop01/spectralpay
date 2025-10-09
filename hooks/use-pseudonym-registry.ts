"use client"

import { useState, useEffect } from "react"
import { usePseudonymRegistryContract } from "./use-contracts"
import { PseudonymRegistryContract, type WorkerProfile } from "@/lib/starknet/contracts"

export function usePseudonymRegistry() {
  const { contract, isConnected } = usePseudonymRegistryContract()
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

export function useAddSkillProof() {
  const contract = usePseudonymRegistry()
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addSkillProof = async (
    pseudonym: string,
    skillTypeHash: string,
    skillLevel: number,
    zkProof: any,
    verificationKey: string
  ) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setAdding(true)
    setError(null)
    try {
      const txHash = await contract.addSkillProof(pseudonym, skillTypeHash, skillLevel, zkProof, verificationKey)
      return txHash
    } catch (err) {
      console.error("[v0] Error adding skill proof:", err)
      setError("Failed to add skill proof")
      return null
    } finally {
      setAdding(false)
    }
  }

  return { addSkillProof, adding, error }
}

export function useVerifySkillRequirement() {
  const contract = usePseudonymRegistry()
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifySkillRequirement = async (
    pseudonym: string,
    requiredSkillHash: string,
    zkProof: any
  ) => {
    if (!contract) {
      setError("Wallet not connected")
      return false
    }

    setVerifying(true)
    setError(null)
    try {
      const result = await contract.verifySkillRequirement(pseudonym, requiredSkillHash, zkProof)
      return result
    } catch (err) {
      console.error("[v0] Error verifying skill requirement:", err)
      setError("Failed to verify skill requirement")
      return false
    } finally {
      setVerifying(false)
    }
  }

  return { verifySkillRequirement, verifying, error }
}

export function useUpdateReputation() {
  const contract = usePseudonymRegistry()
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateReputation = async (pseudonym: string, scoreDelta: number, jobId: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setUpdating(true)
    setError(null)
    try {
      const txHash = await contract.updateReputation(pseudonym, scoreDelta, jobId)
      return txHash
    } catch (err) {
      console.error("[v0] Error updating reputation:", err)
      setError("Failed to update reputation")
      return null
    } finally {
      setUpdating(false)
    }
  }

  return { updateReputation, updating, error }
}

export function useProvePseudonymOwnership() {
  const contract = usePseudonymRegistry()
  const [proving, setProving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const provePseudonymOwnership = async (pseudonym: string, ownershipProof: any) => {
    if (!contract) {
      setError("Wallet not connected")
      return false
    }

    setProving(true)
    setError(null)
    try {
      const result = await contract.provePseudonymOwnership(pseudonym, ownershipProof)
      return result
    } catch (err) {
      console.error("[v0] Error proving pseudonym ownership:", err)
      setError("Failed to prove pseudonym ownership")
      return false
    } finally {
      setProving(false)
    }
  }

  return { provePseudonymOwnership, proving, error }
}

export function useGetSkillProofs() {
  const contract = usePseudonymRegistry()
  const [skillProofs, setSkillProofs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSkillProofs = async (pseudonym: string) => {
    if (!contract) return []

    setLoading(true)
    setError(null)
    try {
      const result = await contract.getSkillProofs(pseudonym)
      setSkillProofs(result)
      return result
    } catch (err) {
      console.error("[v0] Error fetching skill proofs:", err)
      setError("Failed to fetch skill proofs")
      return []
    } finally {
      setLoading(false)
    }
  }

  return { getSkillProofs, skillProofs, loading, error }
}
