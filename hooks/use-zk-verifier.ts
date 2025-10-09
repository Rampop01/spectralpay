"use client"

import { useState, useEffect } from "react"
import { useZKVerifierContract } from "./use-contracts"
import { ZKVerifierContract, type ZKProofComponents, type SkillLevel } from "@/lib/starknet/contracts"

export function useZKVerifier() {
  const { contract, isConnected } = useZKVerifierContract()
  return contract
}

export function useVerifySkillProof() {
  const contract = useZKVerifier()
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifySkillProof = async (
    skillTypeHash: string,
    requiredLevel: SkillLevel,
    zkProof: ZKProofComponents,
    verificationKey: string
  ) => {
    if (!contract) {
      setError("Wallet not connected")
      return false
    }

    setVerifying(true)
    setError(null)
    try {
      const result = await contract.verifySkillProof(skillTypeHash, requiredLevel, zkProof, verificationKey)
      return result
    } catch (err) {
      console.error("[v0] Error verifying skill proof:", err)
      setError("Failed to verify skill proof")
      return false
    } finally {
      setVerifying(false)
    }
  }

  return { verifySkillProof, verifying, error }
}

export function useVerifyIdentityProof() {
  const contract = useZKVerifier()
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyIdentityProof = async (
    pseudonym: string,
    identityCommitment: string,
    zkProof: ZKProofComponents
  ) => {
    if (!contract) {
      setError("Wallet not connected")
      return false
    }

    setVerifying(true)
    setError(null)
    try {
      const result = await contract.verifyIdentityProof(pseudonym, identityCommitment, zkProof)
      return result
    } catch (err) {
      console.error("[v0] Error verifying identity proof:", err)
      setError("Failed to verify identity proof")
      return false
    } finally {
      setVerifying(false)
    }
  }

  return { verifyIdentityProof, verifying, error }
}

export function useAddVerificationKey() {
  const contract = useZKVerifier()
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addVerificationKey = async (skillTypeHash: string, verificationKey: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setAdding(true)
    setError(null)
    try {
      const txHash = await contract.addVerificationKey(skillTypeHash, verificationKey)
      return txHash
    } catch (err) {
      console.error("[v0] Error adding verification key:", err)
      setError("Failed to add verification key")
      return null
    } finally {
      setAdding(false)
    }
  }

  return { addVerificationKey, adding, error }
}

export function useCheckVerificationKey() {
  const contract = useZKVerifier()
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkVerificationKey = async (skillTypeHash: string, verificationKey: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return false
    }

    setChecking(true)
    setError(null)
    try {
      const result = await contract.isValidVerificationKey(skillTypeHash, verificationKey)
      return result
    } catch (err) {
      console.error("[v0] Error checking verification key:", err)
      setError("Failed to check verification key")
      return false
    } finally {
      setChecking(false)
    }
  }

  return { checkVerificationKey, checking, error }
}
