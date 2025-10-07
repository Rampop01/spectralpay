import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ApplyJobDialog } from "@/components/apply-job-dialog"
import { Search, Filter, Clock, DollarSign, Star } from "lucide-react"

export default function JobsPage() {
  const jobs = [
    {
      id: 1,
      title: "Smart Contract Auditor",
      employer: "CryptoOrg_2847",
      budget: 5000,
      deadline: "14 days",
      skills: ["Solidity", "Security", "Cairo"],
      reputation: 4.9,
      description: "Need experienced auditor for DeFi protocol smart contracts on Starknet.",
    },
    {
      id: 2,
      title: "Frontend Developer",
      employer: "WebStudio_9182",
      budget: 3000,
      deadline: "21 days",
      skills: ["React", "TypeScript", "Web3"],
      reputation: 4.7,
      description: "Build responsive dApp interface with wallet integration.",
    },
    {
      id: 3,
      title: "Technical Writer",
      employer: "Protocol_5631",
      budget: 1500,
      deadline: "10 days",
      skills: ["Documentation", "Blockchain", "English"],
      reputation: 4.8,
      description: "Create comprehensive documentation for blockchain protocol.",
    },
    {
      id: 4,
      title: "UI/UX Designer",
      employer: "DesignDAO_4429",
      budget: 2500,
      deadline: "18 days",
      skills: ["Figma", "Web3 Design", "Prototyping"],
      reputation: 4.6,
      description: "Design modern interface for NFT marketplace platform.",
    },
    {
      id: 5,
      title: "Backend Engineer",
      employer: "DevTeam_7753",
      budget: 4000,
      deadline: "30 days",
      skills: ["Node.js", "PostgreSQL", "API Design"],
      reputation: 4.9,
      description: "Build scalable backend infrastructure for web3 application.",
    },
    {
      id: 6,
      title: "Security Researcher",
      employer: "SecLab_3318",
      budget: 6000,
      deadline: "20 days",
      skills: ["Penetration Testing", "Cryptography", "ZK Proofs"],
      reputation: 5.0,
      description: "Conduct security assessment of zero-knowledge proof implementation.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold">
                Browse <span className="text-primary">Anonymous Jobs</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Find opportunities that match your skills. Apply without revealing your identity.
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, skills, or keywords..."
                  className="pl-10 bg-card/50 border-border/50"
                />
              </div>
              <Button variant="outline" className="border-primary/50 hover:border-primary bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary">
                All Jobs
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary">
                Development
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary">
                Design
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary">
                Security
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary">
                Writing
              </Badge>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4 max-w-5xl">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          Posted by <span className="text-foreground font-mono">{job.employer}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {job.reputation}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-bold text-primary">${job.budget.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.deadline}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{job.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Escrow Protected</span>
                    </div>
                    <ApplyJobDialog jobId={job.id.toString()} jobTitle={job.title} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="border-primary/50 hover:border-primary bg-transparent">
              Load More Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
