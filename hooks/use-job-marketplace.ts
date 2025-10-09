
"use client"

export function useApproveWork() {
  const contract = useJobMarketplace()
  const [approving, setApproving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const approveWork = async (jobId: string, workerPseudonym?: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }
    setApproving(true)
    setError(null)
    try {
      const txHash = await contract.approveWork(jobId)
      
      // Update worker reputation after successful work approval
      if (workerPseudonym && txHash) {
        try {
          await contract.updateWorkerReputation(workerPseudonym, 50, jobId) // +50 reputation for completed job
        } catch (reputationError) {
          console.warn("[v0] Failed to update reputation:", reputationError)
        }
      }
      
      return txHash
    } catch (err) {
      setError("Failed to approve work")
      return null
    } finally {
      setApproving(false)
    }
  }

  return { approveWork, approving, error }
}

import { useState, useEffect } from "react"
import { useJobMarketplaceContract } from "./use-contracts"
import { type JobDetails } from "@/lib/starknet/contracts"

export function useJobMarketplace() {
  const { contract, isConnected } = useJobMarketplaceContract()
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
      // Extract skill proof hash from ZK proof for contract compatibility
      const skillProofHash = zkProof?.public_inputs?.[0] || zkProof?.skillProofHash || "0x1234567890abcdef"
      const txHash = await contract.applyForJob(jobId, workerPseudonym, skillProofHash, proposalHash)
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

export function useAssignJob() {
  const contract = useJobMarketplace()
  const [assigning, setAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assignJob = async (jobId: string, selectedWorker: string, workerPayoutAddress: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setAssigning(true)
    setError(null)
    try {
      // First assign the job
      const txHash = await contract.assignJob(jobId, selectedWorker, workerPayoutAddress)
      
      // Create escrow for the job (when contract supports it)
      if (txHash) {
        try {
          const jobDetails = await contract.getJobDetails(jobId)
          if (jobDetails) {
            await contract.createJobEscrow(
              jobId,
              selectedWorker,
              jobDetails.payment_amount,
              jobDetails.payment_token,
              workerPayoutAddress
            )
          }
        } catch (escrowError) {
          console.warn("[v0] Failed to create escrow (may not be implemented yet):", escrowError)
        }
      }
      
      return txHash
    } catch (err) {
      console.error("[v0] Error assigning job:", err)
      setError("Failed to assign job")
      return null
    } finally {
      setAssigning(false)
    }
  }

  return { assignJob, assigning, error }
}

export function useDisputeWork() {
  const contract = useJobMarketplace()
  const [disputing, setDisputing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const disputeWork = async (jobId: string, reason: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setDisputing(true)
    setError(null)
    try {
      const txHash = await contract.disputeWork(jobId, reason)
      return txHash
    } catch (err) {
      console.error("[v0] Error disputing work:", err)
      setError("Failed to dispute work")
      return null
    } finally {
      setDisputing(false)
    }
  }

  return { disputeWork, disputing, error }
}

export function useRequestExtension() {
  const contract = useJobMarketplace()
  const [requesting, setRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestExtension = async (jobId: string, requestedDays: number, reason: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setRequesting(true)
    setError(null)
    try {
      const txHash = await contract.requestDeadlineExtension(jobId, requestedDays, reason)
      return txHash
    } catch (err) {
      console.error("[v0] Error requesting extension:", err)
      setError("Failed to request extension")
      return null
    } finally {
      setRequesting(false)
    }
  }

  return { requestExtension, requesting, error }
}

export function useRespondToExtension() {
  const contract = useJobMarketplace()
  const [responding, setResponding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const respondToExtension = async (jobId: string, approve: boolean, response: string) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setResponding(true)
    setError(null)
    try {
      const txHash = await contract.respondToExtensionRequest(jobId, approve, response)
      return txHash
    } catch (err) {
      console.error("[v0] Error responding to extension:", err)
      setError("Failed to respond to extension")
      return null
    } finally {
      setResponding(false)
    }
  }

  return { respondToExtension, responding, error }
}

export function useGetApplications() {
  const contract = useJobMarketplace()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getApplications = async (jobId: string) => {
    if (!contract) return []

    setLoading(true)
    setError(null)
    try {
      const result = await contract.getWorkerApplications(jobId)
      setApplications(result)
      return result
    } catch (err) {
      console.error("[v0] Error fetching applications:", err)
      setError("Failed to fetch applications")
      return []
    } finally {
      setLoading(false)
    }
  }

  return { getApplications, applications, loading, error }
}

export function useGetExtensionRequests() {
  const contract = useJobMarketplace()
  const [extensionRequests, setExtensionRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getExtensionRequests = async (jobId: string) => {
    if (!contract) return []

    setLoading(true)
    setError(null)
    try {
      const result = await contract.getExtensionRequests(jobId)
      setExtensionRequests(result)
      return result
    } catch (err) {
      console.error("[v0] Error fetching extension requests:", err)
      setError("Failed to fetch extension requests")
      return []
    } finally {
      setLoading(false)
    }
  }

  return { getExtensionRequests, extensionRequests, loading, error }
}
