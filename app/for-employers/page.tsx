"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnectButton } from "@/components/wallet-connector"
import { useAccount } from "@starknet-react/core"
import { validateNetwork } from "@/lib/starknet/config"
import { 
  usePostJob, 
  useGetApplications, 
  useAssignJob, 
  useApproveWork, 
  useJobMarketplace,
  useGetExtensionRequests,
  useRespondToExtension
} from "@/hooks/use-job-marketplace"
import { useWorkerProfile } from "@/hooks/use-skill-verification"
import { createMockZKProof, toUint256, JobStatus, WorkerProfile } from "@/lib/starknet/contracts"
import { 
  Plus, 
  Briefcase, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Eye,
  UserCheck,
  FileText,
  TrendingUp,
  Star
} from "lucide-react"

export default function ForEmployersPage() {
  const { address, isConnected, account } = useAccount()
  const [activeTab, setActiveTab] = useState("jobs")
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  // Hooks
  const { postJob, posting } = usePostJob()
  const { getApplications, applications, loading: applicationsLoading } = useGetApplications()
  const { assignJob, assigning } = useAssignJob()
  const { approveWork, approving } = useApproveWork()
  const { getExtensionRequests, extensionRequests } = useGetExtensionRequests()
  const { respondToExtension, responding } = useRespondToExtension()
  const { getWorkerProfile } = useWorkerProfile()
  const contract = useJobMarketplace()

  // State for worker profiles
  const [workerProfiles, setWorkerProfiles] = useState<Record<string, WorkerProfile>>({})
  const [loadingProfiles, setLoadingProfiles] = useState<Record<string, boolean>>({})

  // Job posting form state
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    paymentAmount: "",
    deadlineDays: 7,
    paymentToken: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7" // ETH token address
  })

  // Real jobs data from contract
  const [jobs, setJobs] = useState<any[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)

  // Fee estimation
  const [estimatedFee, setEstimatedFee] = useState<string>("0.002")
  const [feeLoading, setFeeLoading] = useState(false)

  // Fetch jobs posted by this employer
  const fetchPostedJobs = async () => {
    if (!contract || !address) return
    
    setJobsLoading(true)
    try {
      // In a real implementation, you'd have a method to get jobs by employer
      // For now, we'll just clear the dummy data and show empty state
      setJobs([])
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setJobsLoading(false)
    }
  }

  useEffect(() => {
    if (contract && address) {
      fetchPostedJobs()
    }
  }, [contract, address])

  // Load worker profile for applications
  const loadWorkerProfile = async (pseudonym: string) => {
    if (workerProfiles[pseudonym] || loadingProfiles[pseudonym]) return

    setLoadingProfiles(prev => ({ ...prev, [pseudonym]: true }))
    try {
      const profile = await getWorkerProfile(pseudonym)
      if (profile) {
        setWorkerProfiles(prev => ({ ...prev, [pseudonym]: profile }))
      }
    } catch (error) {
      console.error("Failed to load worker profile:", error)
    } finally {
      setLoadingProfiles(prev => ({ ...prev, [pseudonym]: false }))
    }
  }

  // Estimate transaction fee
  const estimateTransactionFee = async () => {
    if (!contract || !jobForm.title.trim() || !jobForm.paymentAmount || parseFloat(jobForm.paymentAmount) <= 0) {
      setEstimatedFee("0.002")
      return
    }

    setFeeLoading(true)
    try {
      // For Starknet, transaction fees typically range from 0.001 to 0.003 ETH
      // We'll use a reasonable estimate based on complexity
      const baseGas = 0.0015 // Base transaction cost
      const complexityMultiplier = jobForm.description.length > 200 ? 1.2 : 1.0
      const estimatedGas = baseGas * complexityMultiplier
      
      setEstimatedFee(estimatedGas.toFixed(4))
    } catch (error) {
      console.error("Failed to estimate fee:", error)
      // Use default estimate on error
      setEstimatedFee("0.002")
    } finally {
      setFeeLoading(false)
    }
  }

  // Update fee estimation when form changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      estimateTransactionFee()
    }, 500) // Debounce fee estimation

    return () => clearTimeout(timeoutId)
  }, [jobForm.title, jobForm.description, jobForm.paymentAmount, jobForm.deadlineDays, contract])

  // Handle extension request response
  const handleExtensionResponse = async (jobId: string, approve: boolean, response: string) => {
    try {
      const txHash = await respondToExtension(jobId, approve, response)
      if (txHash) {
        alert(`Extension ${approve ? 'approved' : 'rejected'}! Transaction: ${txHash}`)
        // Refresh extension requests
        await getExtensionRequests(jobId)
      }
    } catch (error) {
      console.error("Failed to respond to extension:", error)
      alert("Failed to respond to extension request")
    }
  }

  const handlePostJob = async () => {
    if (!isConnected || !account) {
      alert("Please connect your wallet first to post a job.")
      return
    }

    // Validate network
    const isValidNetwork = await validateNetwork(account)
    if (!isValidNetwork) {
      return
    }

    // Form validation
    if (!jobForm.title.trim()) {
      alert("Please enter a job title")
      return
    }
    
    if (!jobForm.description.trim()) {
      alert("Please enter a job description")
      return
    }
    
    if (!jobForm.paymentAmount || parseFloat(jobForm.paymentAmount) <= 0) {
      alert("Please enter a valid payment amount")
      return
    }
    
    if (jobForm.deadlineDays <= 0 || jobForm.deadlineDays > 365) {
      alert("Please enter a valid deadline (1-365 days)")
      return
    }

    try {
      // Convert ETH to Wei using BigInt for precision
      const paymentAmountFloat = parseFloat(jobForm.paymentAmount)
      const paymentAmountWei = (BigInt(Math.floor(paymentAmountFloat * 1000)) * BigInt(10 ** 15)).toString()
      
      // Create a simple hash for required skills
      const skillsHash = "0x" + Math.random().toString(16).slice(2, 66).padStart(64, '0')
      
      console.log("[v0] Posting job with params:", {
        title: jobForm.title,
        description: jobForm.description,
        skillsHash,
        paymentAmountWei,
        deadlineDays: jobForm.deadlineDays,
        paymentToken: jobForm.paymentToken
      })
      
      const txHash = await postJob(
        jobForm.title,
        jobForm.description,
        skillsHash,
        paymentAmountWei,
        jobForm.deadlineDays,
        jobForm.paymentToken
      )
      
      if (txHash) {
        alert("Job posted successfully! Transaction: " + txHash)
        // Reset form
        setJobForm({
          title: "",
          description: "",
          requiredSkills: "",
          paymentAmount: "",
          deadlineDays: 7,
          paymentToken: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
        })
        // Refresh jobs list
        fetchPostedJobs()
      }
    } catch (error) {
      console.error("Job posting failed:", error)
      
      // Better error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes("User abort")) {
          alert("Transaction was cancelled. Please try again and confirm the transaction in your wallet.")
        } else if (error.message.includes("insufficient")) {
          alert("Insufficient funds. Please make sure you have enough ETH for gas fees.")
        } else if (error.message.includes("Contract not found")) {
          alert("Contract not found. Please make sure you're connected to the correct network (Sepolia testnet).")
        } else {
          alert(`Transaction failed: ${error.message}`)
        }
      } else {
        alert("Failed to post job. Please try again.")
      }
    }
  }

  const handleAssignJob = async (jobId: string, workerPseudonym: string) => {
    if (!isConnected || !account) {
      alert("Please connect your wallet first to assign a job.")
      return
    }

    // Validate network
    const isValidNetwork = await validateNetwork(account)
    if (!isValidNetwork) {
      return
    }
    try {
      const txHash = await assignJob(jobId, workerPseudonym, address || "")
      if (txHash) {
        alert("Job assigned successfully! Transaction: " + txHash)
        // Update job status
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: "Assigned" } : job
        ))
      }
    } catch (error) {
      console.error("Job assignment failed:", error)
      alert("Failed to assign job.")
    }
  }

  const handleApproveWork = async (jobId: string) => {
    if (!isConnected || !account) {
      alert("Please connect your wallet first to approve work.")
      return
    }

    // Validate network
    const isValidNetwork = await validateNetwork(account)
    if (!isValidNetwork) {
      return
    }
    try {
      const txHash = await approveWork(jobId)
      if (txHash) {
        alert("Work approved! Transaction: " + txHash)
        // Update job status
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: "Completed" } : job
        ))
      }
    } catch (error) {
      console.error("Work approval failed:", error)
      alert("Failed to approve work.")
    }
  }

  useEffect(() => {
    if (selectedJob) {
      getApplications(selectedJob)
    }
  }, [selectedJob])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Hire Anonymously</h1>
              <p className="text-xl text-muted-foreground">
                Connect your wallet to start hiring skilled workers without bias
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
            <h1 className="text-4xl font-bold">Employer Dashboard</h1>
            <p className="text-muted-foreground">
              Post jobs, review applications, and manage your workforce anonymously
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="post">Post Job</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="extensions">Extensions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Jobs</h2>
                <Button onClick={() => setActiveTab("post")} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
              </div>

              <div className="grid gap-4">
                {jobsLoading ? (
                  <div className="text-center py-8">
                    <p>Loading your jobs...</p>
                  </div>
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <Card key={job.id} className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <p className="text-muted-foreground">{job.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {job.payment}
                            </Badge>
                            <Badge variant={job.status === "Open" ? "default" : "secondary"}>
                              {job.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.deadline}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{job.applications} applications</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedJob(job.id)
                              setActiveTab("applications")
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Applications
                          </Button>
                          {job.status === "Assigned" && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveWork(job.id)}
                              disabled={approving}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve Work
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <div className="space-y-4">
                      <Briefcase className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold">No jobs posted yet</h3>
                        <p className="text-muted-foreground">
                          Post your first job to start hiring skilled workers
                        </p>
                      </div>
                      <Button onClick={() => setActiveTab("post")} className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Post Your First Job
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Post Job Tab */}
            <TabsContent value="post" className="space-y-6">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Post a New Job</h2>
                    <p className="text-muted-foreground">
                      Create a job listing and find skilled workers
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Job Title *</label>
                      <input
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                        className={`w-full mt-1 px-3 py-2 border rounded-md ${
                          !jobForm.title.trim() ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="e.g., Frontend Developer"
                        required
                      />
                      {!jobForm.title.trim() && (
                        <p className="text-xs text-red-600 mt-1">Job title is required</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Job Description *</label>
                      <textarea
                        value={jobForm.description}
                        onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                        className={`w-full mt-1 px-3 py-2 border rounded-md h-24 ${
                          !jobForm.description.trim() ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="Describe the work requirements and deliverables..."
                        required
                      />
                      {!jobForm.description.trim() && (
                        <p className="text-xs text-red-600 mt-1">Job description is required</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Required Skills</label>
                      <input
                        type="text"
                        value={jobForm.requiredSkills}
                        onChange={(e) => setJobForm(prev => ({ ...prev, requiredSkills: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="e.g., React, TypeScript, CSS"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Payment Amount (ETH) *</label>
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          value={jobForm.paymentAmount}
                          onChange={(e) => setJobForm(prev => ({ ...prev, paymentAmount: e.target.value }))}
                          className={`w-full mt-1 px-3 py-2 border rounded-md ${
                            !jobForm.paymentAmount || parseFloat(jobForm.paymentAmount) <= 0 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="2.5"
                          required
                        />
                        {(!jobForm.paymentAmount || parseFloat(jobForm.paymentAmount) <= 0) && (
                          <p className="text-xs text-red-600 mt-1">Valid payment amount required</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium">Deadline (days) *</label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={isNaN(jobForm.deadlineDays) ? "" : jobForm.deadlineDays}
                          onChange={(e) => setJobForm(prev => ({ ...prev, deadlineDays: parseInt(e.target.value) || 0 }))}
                          className={`w-full mt-1 px-3 py-2 border rounded-md ${
                            jobForm.deadlineDays <= 0 || jobForm.deadlineDays > 365
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="7"
                          required
                        />
                        {(jobForm.deadlineDays <= 0 || jobForm.deadlineDays > 365) && (
                          <p className="text-xs text-red-600 mt-1">Deadline must be 1-365 days</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fee Estimation */}
                  {jobForm.paymentAmount && parseFloat(jobForm.paymentAmount) > 0 && (
                    <div className="border rounded-lg p-4 bg-slate-50 space-y-3">
                      <h3 className="font-medium text-sm">Transaction Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Job Payment:</span>
                          <span className="font-medium">{jobForm.paymentAmount} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated Gas Fee:</span>
                          <span className="font-medium">
                            {feeLoading ? (
                              <span className="animate-pulse">Calculating...</span>
                            ) : (
                              `~${estimatedFee} ETH`
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Total Required:</span>
                          <span className="font-medium">
                            {feeLoading ? (
                              <span className="animate-pulse">Calculating...</span>
                            ) : (
                              `${(parseFloat(jobForm.paymentAmount) + parseFloat(estimatedFee)).toFixed(4)} ETH`
                            )}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        * Gas fees are estimates and may vary based on network conditions
                      </p>
                    </div>
                  )}

                  <Button 
                    onClick={handlePostJob} 
                    disabled={posting}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {posting ? "Posting Job..." : "Post Job"}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Job Applications</h2>
                {selectedJob ? (
                  <p className="text-muted-foreground">
                    Applications for Job #{selectedJob}
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Select a job to view applications
                  </p>
                )}

                {applicationsLoading ? (
                  <p>Loading applications...</p>
                ) : applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application, index) => {
                      const profile = workerProfiles[application.worker_pseudonym]
                      const isProfileLoading = loadingProfiles[application.worker_pseudonym]
                      
                      // Load profile if not already loaded
                      if (!profile && !isProfileLoading) {
                        loadWorkerProfile(application.worker_pseudonym)
                      }
                      
                      return (
                        <Card key={index} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h3 className="font-semibold">Worker: {application.worker_pseudonym}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Applied: {new Date(application.applied_at * 1000).toLocaleDateString()}
                                </p>
                                
                                {/* Worker Profile Info */}
                                {isProfileLoading ? (
                                  <p className="text-sm text-muted-foreground">Loading profile...</p>
                                ) : profile ? (
                                  <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-4 h-4 text-yellow-500" />
                                      <span>{profile.reputation_score} reputation</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                      <span>{profile.completed_jobs} jobs completed</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <DollarSign className="w-4 h-4 text-blue-500" />
                                      <span>{parseFloat(profile.total_earnings) / Math.pow(10, 18)} ETH earned</span>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-red-500">Profile not found</p>
                                )}
                              </div>
                              <Badge variant="outline">
                                {application.status === 1 ? "Pending" : "Reviewed"}
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View Proposal
                              </Button>
                              {profile && (
                                <Button size="sm" variant="outline">
                                  <FileText className="w-4 h-4 mr-1" />
                                  View Profile
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => handleAssignJob(selectedJob!, application.worker_pseudonym)}
                                disabled={assigning}
                              >
                                <UserCheck className="w-4 h-4 mr-1" />
                                {assigning ? "Assigning..." : "Assign Job"}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No applications yet</p>
                )}
              </div>
            </TabsContent>

            {/* Extensions Tab */}
            <TabsContent value="extensions" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Extension Requests</h2>
                {selectedJob ? (
                  <p className="text-muted-foreground">
                    Extension requests for Job #{selectedJob}
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Select a job to view extension requests
                  </p>
                )}

                {selectedJob && (
                  <Button 
                    onClick={() => getExtensionRequests(selectedJob)}
                    className="mb-4"
                  >
                    Load Extension Requests
                  </Button>
                )}

                {extensionRequests.length > 0 ? (
                  <div className="space-y-4">
                    {extensionRequests.map((request, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">Worker: {request.worker_pseudonym}</h3>
                              <p className="text-sm text-muted-foreground">
                                Requested: {new Date(request.requested_at * 1000).toLocaleDateString()}
                              </p>
                              <p className="text-sm font-medium">
                                Extension: {request.requested_days} days
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Reason: {request.reason}
                              </p>
                            </div>
                            <Badge variant={
                              request.status === 1 ? "outline" : 
                              request.status === 2 ? "default" : "destructive"
                            }>
                              {request.status === 1 ? "Pending" : 
                               request.status === 2 ? "Approved" : "Rejected"}
                            </Badge>
                          </div>
                          
                          {request.status === 1 && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  const response = prompt("Enter approval response:") || "Approved"
                                  handleExtensionResponse(selectedJob!, true, response)
                                }}
                                disabled={responding}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  const response = prompt("Enter rejection reason:") || "Rejected"
                                  handleExtensionResponse(selectedJob!, false, response)
                                }}
                                disabled={responding}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          
                          {request.status !== 1 && (
                            <div className="text-sm">
                              <p className="font-medium">Response:</p>
                              <p className="text-muted-foreground">{request.employer_response}</p>
                              <p className="text-xs text-muted-foreground">
                                Responded: {new Date(request.responded_at * 1000).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : selectedJob ? (
                  <p className="text-muted-foreground">No extension requests for this job.</p>
                ) : (
                  <p className="text-muted-foreground">Select a job to view extension requests.</p>
                )}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Analytics & Insights</h2>
                  <p className="text-muted-foreground">
                    Track your hiring performance and platform usage
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Total Jobs Posted</p>
                        <p className="text-2xl font-bold">{jobs.length}</p>
                      </div>
                      <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Total Applications</p>
                        <p className="text-2xl font-bold">
                          {jobs.reduce((sum, job) => sum + job.applications, 0)}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Completed Jobs</p>
                        <p className="text-2xl font-bold">
                          {jobs.filter(job => job.status === "Completed").length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}