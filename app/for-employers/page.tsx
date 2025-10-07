"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStarknetWallet } from "@/lib/starknet/wallet"
import { usePostJob, useGetApplications, useAssignJob, useApproveWork } from "@/hooks/use-job-marketplace"
import { createMockZKProof } from "@/lib/starknet/contracts"
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
  TrendingUp
} from "lucide-react"

export default function ForEmployersPage() {
  const { address, isConnected, connect } = useStarknetWallet()
  const [activeTab, setActiveTab] = useState("jobs")
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  // Hooks
  const { postJob, posting } = usePostJob()
  const { getApplications, applications, loading: applicationsLoading } = useGetApplications(selectedJob || "")
  const { assignJob, assigning } = useAssignJob()
  const { approveWork, approving } = useApproveWork()

  // Job posting form state
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    paymentAmount: "",
    deadlineDays: 7,
    paymentToken: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c7b05d8c4c4c4c4c4c4c4c" // ETH token address
  })

  // Mock jobs data
  const [jobs, setJobs] = useState([
    {
      id: "1",
      title: "Frontend Developer",
      description: "Build responsive web applications using React and TypeScript",
      payment: "2.5 ETH",
      deadline: "7 days",
      status: "Open",
      applications: 3,
      employer: address
    },
    {
      id: "2",
      title: "Smart Contract Developer", 
      description: "Develop and audit smart contracts on Starknet",
      payment: "5.0 ETH",
      deadline: "14 days",
      status: "Assigned",
      applications: 5,
      employer: address
    }
  ])

  const handlePostJob = async () => {
    if (!isConnected) {
      await connect()
      return
    }

    try {
      const txHash = await postJob(
        jobForm.title,
        jobForm.description,
        jobForm.requiredSkills,
        jobForm.paymentAmount,
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
          paymentToken: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c7b05d8c4c4c4c4c4c4c"
        })
      }
    } catch (error) {
      console.error("Job posting failed:", error)
      alert("Failed to post job. Please try again.")
    }
  }

  const handleAssignJob = async (jobId: string, workerPseudonym: string) => {
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
            <Button size="lg" onClick={connect} className="bg-primary hover:bg-primary/90">
              Connect Wallet
            </Button>
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
                {jobs.map((job) => (
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
                ))}
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
                      <label className="text-sm font-medium">Job Title</label>
                      <input
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="e.g., Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Job Description</label>
                      <textarea
                        value={jobForm.description}
                        onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border rounded-md h-24"
                        placeholder="Describe the work requirements and deliverables..."
                      />
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
                        <label className="text-sm font-medium">Payment Amount (ETH)</label>
                        <input
                          type="number"
                          value={jobForm.paymentAmount}
                          onChange={(e) => setJobForm(prev => ({ ...prev, paymentAmount: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="2.5"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Deadline (days)</label>
                        <input
                          type="number"
                          value={jobForm.deadlineDays}
                          onChange={(e) => setJobForm(prev => ({ ...prev, deadlineDays: parseInt(e.target.value) }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="7"
                        />
                      </div>
                    </div>
                  </div>

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
                    {applications.map((application, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">Worker: {application.worker_pseudonym}</h3>
                              <p className="text-sm text-muted-foreground">
                                Applied: {new Date(application.applied_at * 1000).toLocaleDateString()}
                              </p>
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
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No applications yet</p>
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