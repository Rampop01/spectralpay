"use client"

import { useState, useEffect } from "react"
import { useStarknetWallet } from "@/lib/starknet/wallet"
import { JobMarketplaceContract, type JobDetails } from "@/lib/starknet/contracts"

export function useJobMarketplace() {
  const { account, isConnected } = useStarknetWallet()
  const [contract, setContract] = useState<JobMarketplaceContract | null>(null)

  useEffect(() => {
    if (isConnected && account) {
      setContract(new JobMarketplaceContract(account))
    } else {
      setContract(null)
    }
  }, [account, isConnected])

  return contract
}

export function useJobDetails(jobId: string | null) {
  const contract = useJobMarketplace()
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!contract || !jobId) return

    const fetchJobDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const details = await contract.getJobDetails(jobId)
        setJobDetails(details)
      } catch (err) {
        console.error("[v0] Error fetching job details:", err)
        setError("Failed to fetch job details")
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [contract, jobId])

  return { jobDetails, loading, error }
}

export function usePostJob() {
  const contract = useJobMarketplace()
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const postJob = async (
    title: string,
    description: string,
    skillsHash: string,
    paymentAmount: string,
    deadlineDays: number,
    paymentToken: string,
  ) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setPosting(true)
    setError(null)
    try {
      const txHash = await contract.postJob(title, description, skillsHash, paymentAmount, deadlineDays, paymentToken)
      return txHash
    } catch (err) {
      console.error("[v0] Error posting job:", err)
      setError("Failed to post job")
      return null
    } finally {
      setPosting(false)
    }
  }

  return { postJob, posting, error }
}

export function useApplyForJob() {
  const contract = useJobMarketplace()
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const applyForJob = async (jobId: string, workerPseudonym: string, zkProof: any, proposalHash: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setApplying(true)
    setError(null)
    try {
      const txHash = await contract.applyForJob(jobId, workerPseudonym, zkProof, proposalHash)
      return txHash
    } catch (err) {
      console.error("[v0] Error applying for job:", err)
      setError("Failed to apply for job")
      return null
    } finally {
      setApplying(false)
    }
  }

  return { applyForJob, applying, error }
}
