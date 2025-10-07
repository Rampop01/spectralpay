import { Contract } from "starknet"
import jobMarketplaceAbi from "@/lib/contracts/abis/job-marketplace-abi.json"
import pseudonymRegistryAbi from "@/lib/contracts/abis/pseudonym-registry-abi.json"
import { CONTRACTS } from "./config"

export interface JobDetails {
  id: string
  employer: string
  title: string
  description: string
  required_skills_hash: string
  payment_amount: string
  payment_token: string
  work_deadline_days: number
  work_deadline: number
  status: number
  assigned_worker: string
  created_at: number
  assigned_at: number
  escrow_id: string
}

export interface WorkerProfile {
  pseudonym: string
  owner_commitment: string
  skills_commitment: string
  reputation_score: number
  completed_jobs: number
  total_earnings: string
  registration_timestamp: number
  reputation_bond: string
  is_active: boolean
}

export class JobMarketplaceContract {
  private contract: Contract | null = null

  constructor(account?: any) {
    if (account && CONTRACTS.JOB_MARKETPLACE) {
      this.contract = new Contract(jobMarketplaceAbi, CONTRACTS.JOB_MARKETPLACE, account)
    }
  }

  async getJobDetails(jobId: string): Promise<JobDetails | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.get_job_details(jobId)
      return result as JobDetails
    } catch (error) {
      console.error("[v0] Error fetching job details:", error)
      return null
    }
  }

  async postJob(
    title: string,
    description: string,
    skillsHash: string,
    paymentAmount: string,
    deadlineDays: number,
    paymentToken: string,
  ): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.post_job(
        title,
        description,
        skillsHash,
        paymentAmount,
        deadlineDays,
        paymentToken,
      )
      console.log("[v0] Job posted successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error posting job:", error)
      return null
    }
  }

  async applyForJob(
    jobId: string,
    workerPseudonym: string,
    zkProof: any,
    proposalHash: string,
  ): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.apply_for_job(jobId, workerPseudonym, zkProof, proposalHash)
      console.log("[v0] Application submitted successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error applying for job:", error)
      return null
    }
  }

  async submitWork(jobId: string, workProofHash: string, submissionUri: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.submit_work(jobId, workProofHash, submissionUri)
      console.log("[v0] Work submitted successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error submitting work:", error)
      return null
    }
  }

  async approveWork(jobId: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.approve_work(jobId)
      console.log("[v0] Work approved successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error approving work:", error)
      return null
    }
  }
}

export class PseudonymRegistryContract {
  private contract: Contract | null = null

  constructor(account?: any) {
    if (account && CONTRACTS.PSEUDONYM_REGISTRY) {
      this.contract = new Contract(pseudonymRegistryAbi, CONTRACTS.PSEUDONYM_REGISTRY, account)
    }
  }

  async getWorkerProfile(pseudonym: string): Promise<WorkerProfile | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.get_worker_profile(pseudonym)
      return result as WorkerProfile
    } catch (error) {
      console.error("[v0] Error fetching worker profile:", error)
      return null
    }
  }

  async registerPseudonym(
    pseudonym: string,
    identityCommitment: string,
    skillsCommitment: string,
    reputationBond: string,
  ): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.register_pseudonym(
        pseudonym,
        identityCommitment,
        skillsCommitment,
        reputationBond,
      )
      console.log("[v0] Pseudonym registered successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error registering pseudonym:", error)
      return null
    }
  }

  async isPseudonymRegistered(pseudonym: string): Promise<boolean> {
    if (!this.contract) return false
    try {
      const result = await this.contract.is_pseudonym_registered(pseudonym)
      return result
    } catch (error) {
      console.error("[v0] Error checking pseudonym:", error)
      return false
    }
  }
}

// Helper function to create mock ZK proof (for testing)
export function createMockZKProof() {
  return {
    proof_a: ["0x1", "0x2"],
    proof_b: [
      ["0x3", "0x4"],
      ["0x5", "0x6"],
    ],
    proof_c: ["0x7", "0x8"],
    public_inputs: ["0x9", "0xa", "0xb", "0xc"],
  }
}
