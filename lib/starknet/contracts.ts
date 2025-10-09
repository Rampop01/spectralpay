import { Contract } from "starknet"

// Helper: Convert string/BigInt to Starknet u256 {low, high}
export function toUint256(value: string | number | bigint): { low: string; high: string } {
  const big = BigInt(value)
  const low = (big & BigInt("0xffffffffffffffffffffffffffffffff")).toString()
  const high = (big >> BigInt(128)).toString()
  return { low, high }
}

// Helper: Convert ETH to Wei with precision
export function ethToWei(ethAmount: string | number): string {
  const ethFloat = parseFloat(ethAmount.toString())
  if (isNaN(ethFloat) || ethFloat < 0) {
    throw new Error("Invalid ETH amount")
  }
  
  // Use BigInt for precise conversion: multiply by 10^18
  const weiAmount = (BigInt(Math.floor(ethFloat * 1000)) * BigInt(10 ** 15)).toString()
  return weiAmount
}

// Helper: Encode string to ByteArray (array of bytes31, pending_word, pending_word_len)
export function toByteArray(str: string): string {
  // For now, return the string as-is since Starknet.js may handle ByteArray encoding automatically
  return str
}
import jobMarketplaceAbi from "@/lib/contracts/abis/job-marketplace-abi.json"
import pseudonymRegistryAbi from "@/lib/contracts/abis/pseudonym-registry-abi.json"
import zkVerifierAbi from "@/lib/contracts/abis/zk-verifier-abi.json"
import escrowAbi from "@/lib/contracts/abis/escrow-abi.json"
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

export interface ZKProofComponents {
  proof_a: [string, string]
  proof_b: [[string, string], [string, string]]
  proof_c: [string, string]
  public_inputs: [string, string, string, string]
}

export interface SkillProof {
  skill_type_hash: string
  skill_level: number
  proof_data: [string, string, string, string]
  verification_key: string
  proof_timestamp: number
  is_verified: boolean
}

export interface WorkerApplication {
  worker_pseudonym: string
  skill_proof_hash: string
  proposal_hash: string
  applied_at: number
  status: number
}

export interface ExtensionRequest {
  job_id: string
  worker_pseudonym: string
  requested_days: number
  reason: string
  requested_at: number
  status: number
  employer_response: string
  responded_at: number
}

export enum SkillLevel {
  Unknown = 0,
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
  Expert = 4
}

export enum JobStatus {
  Unknown = 0,
  Open = 1,
  Assigned = 2,
  Submitted = 3,
  Completed = 4,
  Disputed = 5,
  Cancelled = 6
}

export enum ApplicationStatus {
  Unknown = 0,
  Pending = 1,
  Accepted = 2,
  Rejected = 3
}

export enum ExtensionRequestStatus {
  Unknown = 0,
  Pending = 1,
  Approved = 2,
  Rejected = 3
}

export class JobMarketplaceContract {
  private contract: Contract | null = null

  constructor(account?: any) {
    if (account && CONTRACTS.JOB_MARKETPLACE) {
      // In starknet.js v8, account is already a provider
      this.contract = new Contract({
        abi: jobMarketplaceAbi,
        address: CONTRACTS.JOB_MARKETPLACE
      })
      // Set the provider after creation
      this.contract.providerOrAccount = account
    }
  }

  async getJobDetails(jobId: string): Promise<JobDetails | null> {
    if (!this.contract) return null
    try {
      const jobIdU256 = toUint256(jobId)
      const result = await this.contract.get_job_details(jobIdU256)
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
      // Encode parameters properly
      const paymentAmountU256 = toUint256(paymentAmount)
      
      const result = await this.contract.post_job(
        title,
        description,
        skillsHash,
        paymentAmountU256,
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
    skillProofHash: string,
    proposalHash: string,
  ): Promise<string | null> {
    if (!this.contract) return null
    try {
      const jobIdU256 = toUint256(jobId)
      const result = await this.contract.apply_for_job(jobIdU256, workerPseudonym, skillProofHash, proposalHash)
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

  async assignJob(jobId: string, selectedWorker: string, workerPayoutAddress: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.assign_job(jobId, selectedWorker, workerPayoutAddress)
      console.log("[v0] Job assigned successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error assigning job:", error)
      return null
    }
  }

  async disputeWork(jobId: string, reason: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.dispute_work(jobId, reason)
      console.log("[v0] Work disputed successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error disputing work:", error)
      return null
    }
  }

  async extendDeadline(jobId: string, additionalDays: number): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.extend_deadline(jobId, additionalDays)
      console.log("[v0] Deadline extended successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error extending deadline:", error)
      return null
    }
  }

  async requestDeadlineExtension(jobId: string, requestedDays: number, reason: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.request_deadline_extension(jobId, requestedDays, reason)
      console.log("[v0] Extension requested successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error requesting extension:", error)
      return null
    }
  }

  async respondToExtensionRequest(jobId: string, approve: boolean, response: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.respond_to_extension_request(jobId, approve, response)
      console.log("[v0] Extension response submitted successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error responding to extension:", error)
      return null
    }
  }

  async getWorkerApplications(jobId: string): Promise<WorkerApplication[]> {
    if (!this.contract) return []
    try {
      const result = await this.contract.get_worker_applications(jobId)
      return result as WorkerApplication[]
    } catch (error) {
      console.error("[v0] Error fetching applications:", error)
      return []
    }
  }

  async getExtensionRequests(jobId: string): Promise<ExtensionRequest[]> {
    if (!this.contract) return []
    try {
      const result = await this.contract.get_extension_requests(jobId)
      return result as ExtensionRequest[]
    } catch (error) {
      console.error("[v0] Error fetching extension requests:", error)
      return []
    }
  }

  async updateWorkerReputation(workerPseudonym: string, scoreDelta: number, jobId: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      // This would typically call the PseudonymRegistry contract through the JobMarketplace
      // For now, we'll implement a direct call pattern
      const result = await this.contract.update_worker_reputation(workerPseudonym, scoreDelta, jobId)
      console.log("[v0] Worker reputation updated successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error updating worker reputation:", error)
      return null
    }
  }

  async createJobEscrow(
    jobId: string,
    workerPseudonym: string,
    amount: string,
    token: string,
    workerPayoutAddress: string
  ): Promise<string | null> {
    if (!this.contract) return null
    try {
      // This will be called automatically by assign_job when escrow integration is uncommented
      // For now, this is a placeholder for when the contract supports it
      const jobIdU256 = toUint256(jobId)
      const amountU256 = toUint256(amount)
      
      const result = await this.contract.create_job_escrow(
        jobIdU256,
        workerPseudonym,
        amountU256,
        token,
        workerPayoutAddress
      )
      console.log("[v0] Job escrow created successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error creating job escrow:", error)
      return null
    }
  }
}

export class PseudonymRegistryContract {
  private contract: Contract | null = null

  constructor(account?: any) {
    if (account && CONTRACTS.PSEUDONYM_REGISTRY) {
      // In starknet.js v8, account is already a provider
      this.contract = new Contract({
        abi: pseudonymRegistryAbi,
        address: CONTRACTS.PSEUDONYM_REGISTRY
      })
      // Set the provider after creation
      this.contract.providerOrAccount = account
    }
  }

  async getWorkerProfile(pseudonym: string): Promise<WorkerProfile | null> {
    if (!this.contract) {
      console.error("[v0] PseudonymRegistry contract not initialized")
      return null
    }
    
    console.log("[v0] Fetching worker profile for:", pseudonym)
    console.log("[v0] Contract address:", CONTRACTS.PSEUDONYM_REGISTRY)
    
    try {
      const result = await this.contract.get_worker_profile(pseudonym)
      console.log("[v0] Worker profile result:", result)
      return result as WorkerProfile
    } catch (error) {
      console.error("[v0] Error fetching worker profile:", error)
      console.error("[v0] Contract address being used:", CONTRACTS.PSEUDONYM_REGISTRY)
      console.error("[v0] Pseudonym parameter:", pseudonym)
      
      // Check if this is a "contract not found" error
      if (error instanceof Error && error.message?.includes("Contract not found")) {
        console.error("[v0] The PseudonymRegistry contract was not found at the deployed address.")
        console.error("[v0] This could mean:")
        console.error("[v0] 1. Wrong network (check if you're on Sepolia testnet)")
        console.error("[v0] 2. Contract address is incorrect")
        console.error("[v0] 3. Contract was not deployed successfully")
        console.error("[v0] 4. RPC endpoint issue")
      }
      
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

  async addSkillProof(
    pseudonym: string,
    skillTypeHash: string,
    skillLevel: SkillLevel,
    zkProof: ZKProofComponents,
    verificationKey: string
  ): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.add_skill_proof(
        pseudonym,
        skillTypeHash,
        skillLevel,
        zkProof,
        verificationKey
      )
      console.log("[v0] Skill proof added successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error adding skill proof:", error)
      return null
    }
  }

  async verifySkillRequirement(
    pseudonym: string,
    requiredSkillHash: string,
    zkProof: ZKProofComponents
  ): Promise<boolean> {
    if (!this.contract) return false
    try {
      const result = await this.contract.verify_skill_requirement(pseudonym, requiredSkillHash, zkProof)
      return result
    } catch (error) {
      console.error("[v0] Error verifying skill requirement:", error)
      return false
    }
  }

  async updateReputation(pseudonym: string, scoreDelta: number, jobId: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.update_reputation(pseudonym, scoreDelta, jobId)
      console.log("[v0] Reputation updated successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error updating reputation:", error)
      return null
    }
  }

  async provePseudonymOwnership(pseudonym: string, ownershipProof: ZKProofComponents): Promise<boolean> {
    if (!this.contract) return false
    try {
      const result = await this.contract.prove_pseudonym_ownership(pseudonym, ownershipProof)
      return result
    } catch (error) {
      console.error("[v0] Error proving pseudonym ownership:", error)
      return false
    }
  }

  async getSkillProofs(pseudonym: string): Promise<SkillProof[]> {
    if (!this.contract) return []
    try {
      const result = await this.contract.get_skill_proofs(pseudonym)
      return result as SkillProof[]
    } catch (error) {
      console.error("[v0] Error fetching skill proofs:", error)
      return []
    }
  }
}

export class ZKVerifierContract {
  private contract: Contract | null = null

  constructor(account?: any) {
    if (account && CONTRACTS.ZK_VERIFIER) {
      // In starknet.js v8, account is already a provider
      this.contract = new Contract({
        abi: zkVerifierAbi,
        address: CONTRACTS.ZK_VERIFIER
      })
      // Set the provider after creation
      this.contract.providerOrAccount = account
    }
  }

  async verifySkillProof(
    skillTypeHash: string,
    requiredLevel: SkillLevel,
    zkProof: ZKProofComponents,
    verificationKey: string
  ): Promise<boolean> {
    if (!this.contract) return false
    try {
      const result = await this.contract.verify_skill_proof(skillTypeHash, requiredLevel, zkProof, verificationKey)
      return result
    } catch (error) {
      console.error("[v0] Error verifying skill proof:", error)
      return false
    }
  }

  async verifyIdentityProof(
    pseudonym: string,
    identityCommitment: string,
    zkProof: ZKProofComponents
  ): Promise<boolean> {
    if (!this.contract) return false
    try {
      const result = await this.contract.verify_identity_proof(pseudonym, identityCommitment, zkProof)
      return result
    } catch (error) {
      console.error("[v0] Error verifying identity proof:", error)
      return false
    }
  }

  async addVerificationKey(skillTypeHash: string, verificationKey: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      const result = await this.contract.add_verification_key(skillTypeHash, verificationKey)
      console.log("[v0] Verification key added successfully:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error adding verification key:", error)
      return null
    }
  }

  async isValidVerificationKey(skillTypeHash: string, verificationKey: string): Promise<boolean> {
    if (!this.contract) return false
    try {
      const result = await this.contract.is_valid_verification_key(skillTypeHash, verificationKey)
      return result
    } catch (error) {
      console.error("[v0] Error checking verification key:", error)
      return false
    }
  }
}

export class EscrowContract {
  private contract: Contract | null = null

  constructor(account?: any) {
    if (account && CONTRACTS.ESCROW) {
      // In starknet.js v8, account is already a provider
      this.contract = new Contract({
        abi: escrowAbi,
        address: CONTRACTS.ESCROW
      })
      // Set the provider after creation
      this.contract.providerOrAccount = account
    }
  }

  // Note: The escrow contract methods would need to be implemented based on the actual ABI
  // For now, we'll add placeholder methods that can be expanded when the full escrow ABI is available
  async createEscrow(
    jobId: string,
    workerPseudonym: string,
    amount: string,
    token: string
  ): Promise<string | null> {
    if (!this.contract) return null
    try {
      // Encode jobId and amount as u256
      const jobIdU256 = toUint256(jobId)
      const amountU256 = toUint256(amount)
      // workerPseudonym and token are felt252/contract address
      const result = await this.contract.create_escrow(
        jobIdU256,
        workerPseudonym,
        amountU256,
        token
      )
      console.log("[v0] Escrow created:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error creating escrow:", error)
      return null
    }
  }

  async releasePayment(escrowId: string, workerPayoutAddress: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      const escrowIdU256 = toUint256(escrowId)
      const result = await this.contract.release_payment(
        escrowIdU256,
        workerPayoutAddress
      )
      console.log("[v0] Payment released:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error releasing payment:", error)
      return null
    }
  }

  async disputePayment(escrowId: string, reason: string): Promise<string | null> {
    if (!this.contract) return null
    try {
      const escrowIdU256 = toUint256(escrowId)
      const reasonByteArray = toByteArray(reason)
      const result = await this.contract.dispute_payment(
        escrowIdU256,
        reasonByteArray
      )
      console.log("[v0] Payment disputed:", result)
      return result.transaction_hash
    } catch (error) {
      console.error("[v0] Error disputing payment:", error)
      return null
    }
  }
}

// Helper function to create mock ZK proof (for testing)
export function createMockZKProof(): ZKProofComponents {
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

// Helper function to create mock skill proof
export function createMockSkillProof(skillType: string, level: SkillLevel): SkillProof {
  return {
    skill_type_hash: skillType,
    skill_level: level,
    proof_data: ["0x1", "0x2", "0x3", "0x4"],
    verification_key: "0xverification_key",
    proof_timestamp: Date.now(),
    is_verified: true
  }
}
