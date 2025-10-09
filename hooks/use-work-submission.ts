"use client"

import { useState } from "react"
import { useJobMarketplace } from "./use-job-marketplace"

export function useWorkSubmission() {
  const contract = useJobMarketplace()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitWork = async (
    jobId: string,
    workProofHash: string,
    submissionUri: string
  ) => {
    if (!contract) {
      setError("Wallet not connected")
      return null
    }

    setSubmitting(true)
    setError(null)
    
    try {
      const txHash = await contract.submitWork(jobId, workProofHash, submissionUri)
      return txHash
    } catch (err) {
      console.error("[v0] Error submitting work:", err)
      setError("Failed to submit work")
      return null
    } finally {
      setSubmitting(false)
    }
  }

  return {
    submitWork,
    submitting,
    error
  }
}

export function useJobStatusTracking() {
  const contract = useJobMarketplace()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkJobStatus = async (jobId: string) => {
    if (!contract) return null

    setLoading(true)
    setError(null)
    
    try {
      const jobDetails = await contract.getJobDetails(jobId)
      return jobDetails
    } catch (err) {
      console.error("[v0] Error checking job status:", err)
      setError("Failed to check job status")
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    checkJobStatus,
    loading,
    error
  }
}