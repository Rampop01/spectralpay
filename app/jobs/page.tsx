"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStarknetWallet } from "@/lib/starknet/wallet"
import { useJobDetails, useApplyForJob } from "@/hooks/use-job-marketplace"
import { createMockZKProof } from "@/lib/starknet/contracts"
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
  const { address, isConnected, connect } = useStarknetWallet()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [showJobDetails, setShowJobDetails] = useState(false)

  // Hooks
  const { jobDetails, loading: jobLoading } = useJobDetails(selectedJob)
  const { applyForJob, applying } = useApplyForJob()

  // Mock jobs data
  const [jobs] = useState([
    {
      id: "1",
      title: "Frontend Developer",
      description: "Build responsive web applications using React and TypeScript. We need someone with strong experience in modern frontend frameworks.",
      category: "Development",
      payment: "2.5 ETH",
      deadline: "7 days",
      skills: ["React", "TypeScript", "CSS", "JavaScript"],
      employer: "0x1234...5678",
      applications: 12,
      reputation: 4.8,
      posted: "2 days ago"
    },
    {
      id: "2",
      title: "Smart Contract Developer",
      description: "Develop and audit smart contracts on Starknet. Experience with Cairo programming language required.",
      category: "Blockchain",
      payment: "5.0 ETH",
      deadline: "14 days",
      skills: ["Cairo", "Starknet", "Solidity", "Web3"],
      employer: "0x2345...6789",
      applications: 8,
      reputation: 4.9,
      posted: "1 day ago"
    },
    {
      id: "3",
      title: "UI/UX Designer",
      description: "Design intuitive user interfaces for a DeFi application. Must have experience with Figma and design systems.",
      category: "Design",
      payment: "1.8 ETH",
      deadline: "10 days",
      skills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
      employer: "0x3456...7890",
      applications: 15,
      reputation: 4.7,
      posted: "3 days ago"
    },
    {
      id: "4",
      title: "Content Writer",
      description: "Create technical documentation and blog posts about blockchain technology. Strong writing skills and crypto knowledge required.",
      category: "Writing",
      payment: "1.2 ETH",
      deadline: "5 days",
      skills: ["Technical Writing", "Blockchain", "SEO", "Content Strategy"],
      employer: "0x4567...8901",
      applications: 6,
      reputation: 4.6,
      posted: "1 day ago"
    },
    {
      id: "5",
      title: "DevOps Engineer",
      description: "Set up CI/CD pipelines and manage cloud infrastructure for blockchain applications. AWS and Docker experience required.",
      category: "DevOps",
      payment: "3.5 ETH",
      deadline: "12 days",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      employer: "0x5678...9012",
      applications: 4,
      reputation: 4.9,
      posted: "4 days ago"
    }
  ])

  const categories = ["all", "Development", "Blockchain", "Design", "Writing", "DevOps", "Marketing"]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleViewJob = (jobId: string) => {
    setSelectedJob(jobId)
    setShowJobDetails(true)
  }

  const handleApplyForJob = async (jobId: string) => {
    if (!isConnected) {
      await connect()
      return
    }

    try {
      const mockProof = createMockZKProof()
      const proposalHash = "0x" + Math.random().toString(16).substr(2, 64)
      const workerPseudonym = `worker_${address?.slice(2, 8)}`
      
      const txHash = await applyForJob(jobId, workerPseudonym, mockProof, proposalHash)
      
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
              {filteredJobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <Badge variant="outline">{job.category}</Badge>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">{job.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{job.payment}</div>
                        <div className="text-sm text-muted-foreground">Payment</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{job.applications} applications</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{job.reputation}/5.0</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>Remote</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Posted {job.posted} by {job.employer}
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
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <Card className="p-8 text-center">
                <div className="space-y-4">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">No jobs found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or check back later
                    </p>
                  </div>
                </div>
              </Card>
            )}
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

              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    handleApplyForJob(jobDetails.id)
                    setShowJobDetails(false)
                  }}
                  disabled={applying}
                >
                  <Send className="w-4 h-4 mr-1" />
                  {applying ? "Applying..." : "Apply for this Job"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}