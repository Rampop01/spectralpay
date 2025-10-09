"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccount } from "@starknet-react/core"
import { WalletConnectButton } from "@/components/wallet-connector"
import {
  useJobDetails,
  useApplyForJob,
  useAssignJob,
  useDisputeWork,
  useRequestExtension,
  useRespondToExtension,
  useJobMarketplace
} from "@/hooks/use-job-marketplace"
import {
  useCreateEscrow,
  useReleasePayment,
  useDisputePayment
} from "@/hooks/use-escrow"
import { useWorkSubmission } from "@/hooks/use-work-submission"
import { useSkillVerification, useWorkerProfile } from "@/hooks/use-skill-verification"
import { createMockZKProof, JobStatus } from "@/lib/starknet/contracts"
import { 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Users, 
  Briefcase,
  MapPin,
  Star,
  Eye,
  Send
} from "lucide-react"

export default function JobsPage() {
  const { address, isConnected } = useAccount()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [workerPseudonym, setWorkerPseudonym] = useState("")
  const [workSubmissionUrl, setWorkSubmissionUrl] = useState("")
  const [workDescription, setWorkDescription] = useState("")

  // Hooks
  const { jobDetails, loading: jobLoading } = useJobDetails(selectedJob)
  const { applyForJob, applying } = useApplyForJob()
  const { assignJob, assigning } = useAssignJob()
  const { disputeWork, disputing } = useDisputeWork()
  const { requestExtension, requesting } = useRequestExtension()
  const { respondToExtension, responding } = useRespondToExtension()
  const { submitWork, submitting } = useWorkSubmission()
  const { verifySkillForJob, verifying } = useSkillVerification()
  const { getWorkerProfile } = useWorkerProfile()
  const { createEscrow, creating } = useCreateEscrow()
  const { releasePayment, releasing } = useReleasePayment()
  const { disputePayment, disputing: disputingPayment } = useDisputePayment()
  const contract = useJobMarketplace()

  // Real jobs data from contract
  const [jobs, setJobs] = useState<any[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)

  // Fetch all jobs from contract
  const fetchAllJobs = async () => {
    if (!contract) return
    
    setJobsLoading(true)
    try {
      // In a real implementation, you'd have a method to get all jobs
      // For now, we'll show empty state to indicate contract integration
      setJobs([])
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setJobsLoading(false)
    }
  }

  useEffect(() => {
    if (contract) {
      fetchAllJobs()
    }
  }, [contract])

  const categories = ["all", "Development", "Blockchain", "Design", "Writing", "DevOps", "Marketing"]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.skills && job.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleViewJob = (jobId: string) => {
    setSelectedJob(jobId)
    setShowJobDetails(true)
  }

  const handleApplyForJob = async (jobId: string) => {
    if (!isConnected) {
      alert("Please connect your wallet first to apply for jobs.")
      return
    }

    // Check if we're on Sepolia testnet
    if (!address) {
      alert("Wallet address not available. Please reconnect your wallet.")
      return
    }

    try {
      // Get worker pseudonym from user
      const pseudonym = prompt("Enter your pseudonym:") || `worker_${address?.slice(2, 8)}`
      setWorkerPseudonym(pseudonym)
      
      // Verify skill requirements before applying
      if (jobDetails?.required_skills_hash) {
        console.log("Verifying skills for job application...")
        const skillVerified = await verifySkillForJob(pseudonym, jobDetails.required_skills_hash)
        
        if (!skillVerified) {
          alert("Skill verification failed. You don't meet the requirements for this job.")
          return
        }
      }
      
      const mockProof = createMockZKProof()
      const proposalHash = "0x" + Math.random().toString(16).substr(2, 64)
      
      const txHash = await applyForJob(jobId, pseudonym, mockProof, proposalHash)
      
      if (txHash) {
        alert("Application submitted successfully! Transaction: " + txHash)
      }
    } catch (error) {
      console.error("Application failed:", error)
      alert("Failed to apply for job. Please try again.")
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Find Your Next Job</h1>
              <p className="text-xl text-muted-foreground">
                Connect your wallet to browse and apply for anonymous jobs
              </p>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Job Marketplace</h1>
            <p className="text-muted-foreground">
              Discover opportunities and apply for jobs that match your skills
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search jobs, skills, or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Job Listings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            <div className="grid gap-6">
              {jobsLoading ? (
                <div className="text-center py-8">
                  <p>Loading jobs...</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            {job.category && <Badge variant="outline">{job.category}</Badge>}
                          </div>
                          <p className="text-muted-foreground line-clamp-2">{job.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{job.payment}</div>
                          <div className="text-sm text-muted-foreground">Payment</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {job.deadline && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.deadline}</span>
                          </div>
                        )}
                        {job.applications && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{job.applications} applications</span>
                          </div>
                        )}
                        {job.reputation && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{job.reputation}/5.0</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>Remote</span>
                        </div>
                      </div>

                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {job.posted && `Posted ${job.posted}`} {job.employer && `by ${job.employer}`}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewJob(job.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => handleApplyForJob(job.id)}
                            disabled={applying}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            {applying ? "Applying..." : "Apply Now"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <div className="space-y-4">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">No jobs available</h3>
                      <p className="text-muted-foreground">
                        Jobs will appear here once they are posted to the marketplace
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobDetails && jobDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{jobDetails.title}</h2>
                  <p className="text-muted-foreground">Job ID: {jobDetails.id}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowJobDetails(false)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{jobDetails.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Payment</h3>
                    <p className="text-2xl font-bold text-green-600">{jobDetails.payment_amount} ETH</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Deadline</h3>
                    <p className="text-lg">{jobDetails.work_deadline_days} days</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <Badge variant={jobDetails.status === 1 ? "default" : "secondary"}>
                    {jobDetails.status === 1 ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={async () => {
                    await handleApplyForJob(jobDetails.id)
                    setShowJobDetails(false)
                  }}
                  disabled={applying}
                >
                  <Send className="w-4 h-4 mr-1" />
                  {applying ? "Applying..." : "Apply for this Job"}
                </Button>

                {/* Work Submission Section */}
                {jobDetails?.status === JobStatus.Assigned && (
                  <Card className="p-4 border-2 border-blue-200">
                    <h4 className="font-semibold mb-3">Submit Your Work</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="workDescription">Work Description</Label>
                        <Textarea
                          id="workDescription"
                          placeholder="Describe the work you've completed..."
                          value={workDescription}
                          onChange={(e) => setWorkDescription(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="workSubmissionUrl">Submission URL/IPFS</Label>
                        <Input
                          id="workSubmissionUrl"
                          placeholder="https://... or ipfs://..."
                          value={workSubmissionUrl}
                          onChange={(e) => setWorkSubmissionUrl(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={async () => {
                          if (!workSubmissionUrl.trim()) {
                            alert("Please provide a submission URL")
                            return
                          }
                          const workProofHash = "0x" + Math.random().toString(16).slice(2)
                          const txHash = await submitWork(jobDetails.id, workProofHash, workSubmissionUrl)
                          if (txHash) {
                            alert("Work submitted successfully! Transaction: " + txHash)
                            setWorkDescription("")
                            setWorkSubmissionUrl("")
                          }
                        }}
                        disabled={submitting || !workSubmissionUrl.trim()}
                      >
                        {submitting ? "Submitting..." : "Submit Work"}
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Employer Actions */}
                {jobDetails?.status === JobStatus.Submitted && (
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={async () => {
                        const txHash = jobDetails?.id && jobDetails?.id !== "" && contract
                          ? await contract.approveWork(jobDetails.id)
                          : null
                        if (txHash) alert("Work approved! Transaction: " + txHash)
                      }}
                      disabled={!jobDetails?.id}
                    >
                      Approve Work
                    </Button>
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={async () => {
                        const reason = prompt("Enter dispute reason:") || "No reason provided"
                        const txHash = await disputeWork(jobDetails.id, reason)
                        if (txHash) alert("Work disputed! Transaction: " + txHash)
                      }}
                      disabled={disputing}
                    >
                      {disputing ? "Disputing..." : "Dispute Work"}
                    </Button>
                  </div>
                )}

                {/* Submit Work (Legacy - keeping for backward compatibility) */}
                <Button 
                  className="bg-accent hover:bg-accent/90"
                  onClick={async () => {
                    // For demo: use random proof hash and URI
                    const workProofHash = "0x" + Math.random().toString(16).slice(2)
                    const submissionUri = "ipfs://example-work-proof"
                    const txHash = jobDetails?.id && jobDetails?.id !== "" && contract
                      ? await contract.submitWork(jobDetails.id, workProofHash, submissionUri)
                      : null
                    if (txHash) alert("Work submitted! Transaction: " + txHash)
                  }}
                  disabled={!jobDetails?.id}
                >
                  Submit Work (Quick)
                </Button>

                {/* Approve Work */}
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={async () => {
                    const txHash = jobDetails?.id && jobDetails?.id !== "" && contract
                      ? await contract.approveWork(jobDetails.id)
                      : null
                    if (txHash) alert("Work approved! Transaction: " + txHash)
                  }}
                  disabled={!jobDetails?.id}
                >
                  Approve Work
                </Button>

                {/* Dispute Work */}
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={async () => {
                    const reason = prompt("Enter dispute reason:") || "No reason provided"
                    const txHash = await jobDetails?.id && jobDetails?.id !== "" ?
                      (await disputeWork(jobDetails.id, reason)) : null
                    if (txHash) alert("Work disputed! Transaction: " + txHash)
                  }}
                  disabled={disputing || !jobDetails?.id}
                >
                  {disputing ? "Disputing..." : "Dispute Work"}
                </Button>

                {/* Extend Deadline */}
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600"
                  onClick={async () => {
                    const additionalDays = parseInt(prompt("Enter additional days:") || "0")
                    const txHash = jobDetails?.id && jobDetails?.id !== "" && contract
                      ? await contract.extendDeadline(jobDetails.id, additionalDays)
                      : null
                    if (txHash) alert("Deadline extended! Transaction: " + txHash)
                  }}
                  disabled={!jobDetails?.id}
                >
                  Extend Deadline
                </Button>

                {/* Request Extension */}
                <Button 
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={async () => {
                    const requestedDays = parseInt(prompt("Enter requested extension days:") || "0")
                    const reason = prompt("Enter reason for extension:") || "No reason provided"
                    const txHash = await jobDetails?.id && jobDetails?.id !== "" ?
                      (await requestExtension(jobDetails.id, requestedDays, reason)) : null
                    if (txHash) alert("Extension requested! Transaction: " + txHash)
                  }}
                  disabled={requesting || !jobDetails?.id}
                >
                  {requesting ? "Requesting..." : "Request Extension"}
                </Button>

                {/* Respond to Extension */}
                <Button 
                  className="bg-purple-500 hover:bg-purple-600"
                  onClick={async () => {
                    const approve = confirm("Approve extension request?")
                    const response = prompt("Enter response:") || "No response provided"
                    const txHash = await jobDetails?.id && jobDetails?.id !== "" ?
                      (await respondToExtension(jobDetails.id, approve, response)) : null
                    if (txHash) alert("Extension response sent! Transaction: " + txHash)
                  }}
                  disabled={responding || !jobDetails?.id}
                >
                  {responding ? "Responding..." : "Respond to Extension"}
                </Button>

                {/* Escrow Actions */}
                <Button 
                  className="bg-gray-700 hover:bg-gray-800"
                  onClick={async () => {
                    // For demo: create escrow, release payment, dispute payment
                    const action = prompt("Escrow action: create/release/dispute")
                    if (action === "create") {
                      const workerPseudonym = prompt("Worker pseudonym:") || "demo_worker"
                      const amount = prompt("Amount (wei):") || "1000000000000000000"
                      const token = prompt("Token address:") || "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
                      const txHash = await createEscrow(jobDetails.id, workerPseudonym, amount, token)
                      if (txHash) alert("Escrow created! Transaction: " + txHash)
                    } else if (action === "release") {
                      const escrowId = prompt("Escrow ID:") || "1"
                      const payoutAddress = prompt("Worker payout address:") || address
                      const txHash = await releasePayment(escrowId || "", payoutAddress || "")
                      if (txHash) alert("Payment released! Transaction: " + txHash)
                    } else if (action === "dispute") {
                      const escrowId = prompt("Escrow ID:") || "1"
                      const reason = prompt("Dispute reason:") || "No reason provided"
                      const txHash = await disputePayment(escrowId, reason)
                      if (txHash) alert("Payment disputed! Transaction: " + txHash)
                    }
                  }}
                  disabled={creating || releasing || disputingPayment}
                >
                  Escrow Actions
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}