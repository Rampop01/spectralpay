"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAccount } from "@starknet-react/core"
import { WalletConnectButton } from "@/components/wallet-connector"
import { useWorkerProfile } from "@/hooks/use-skill-verification"
import { useWorkSubmission } from "@/hooks/use-work-submission"
import { useRequestExtension } from "@/hooks/use-job-marketplace"
import { WorkerProfile, PseudonymRegistryContract } from "@/lib/starknet/contracts"
import { ContractVerification } from "@/components/contract-verification"
import { User, Briefcase, DollarSign, Clock, CheckCircle2, Star, TrendingUp, Shield, Eye, FileText, Send, Calendar } from "lucide-react"

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [userType] = useState<"worker" | "employer">("worker")
  const [pseudonym, setPseudonym] = useState("")
  const [profile, setProfile] = useState<WorkerProfile | null>(null)
  
  // Hooks
  const { getWorkerProfile, loading: profileLoading } = useWorkerProfile()
  const { submitWork, submitting } = useWorkSubmission()
  const { requestExtension, requesting } = useRequestExtension()

  // Load worker profile
  const loadProfile = async () => {
    if (!pseudonym) return
    
    try {
      const profileData = await getWorkerProfile(pseudonym)
      setProfile(profileData)
    } catch (error) {
      console.error("Failed to load profile:", error)
    }
  }

  useEffect(() => {
    if (pseudonym) {
      loadProfile()
    }
  }, [pseudonym])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Worker Dashboard</h1>
              <p className="text-xl text-muted-foreground">
                Connect your wallet to access your dashboard
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

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, <span className="text-primary font-mono">
                    {profile?.pseudonym || pseudonym || "Anonymous Worker"}
                  </span>
                </p>
              </div>
              <div className="space-x-2">
                {!profile && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter your pseudonym..."
                      value={pseudonym}
                      onChange={(e) => setPseudonym(e.target.value)}
                      className="w-64"
                    />
                    <Button onClick={loadProfile} disabled={!pseudonym || profileLoading}>
                      {profileLoading ? "Loading..." : "Load Profile"}
                    </Button>
                  </div>
                )}
                <Button className="bg-primary hover:bg-primary/90">
                  <Eye className="mr-2 h-4 w-4" />
                  View Public Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{profile?.completed_jobs || 0}</div>
              <div className="text-sm text-muted-foreground">Jobs Completed</div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold">
                {profile ? `${(parseFloat(profile.total_earnings) / Math.pow(10, 18)).toFixed(2)} ETH` : "$0"}
              </div>
              <div className="text-sm text-muted-foreground">Total Earned</div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold">{profile?.reputation_score || 0}</div>
              <div className="text-sm text-muted-foreground">Reputation Score</div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">Active Jobs</div>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="bg-card/50 border border-border/50">
              <TabsTrigger value="active">Active Jobs</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="submit">Submit Work</TabsTrigger>
              <TabsTrigger value="extensions">Extensions</TabsTrigger>
              <TabsTrigger value="debug">Debug</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Smart Contract Audit</h3>
                      <p className="text-sm text-muted-foreground">
                        Employer: <span className="text-foreground font-mono">SecureDAO_8472</span>
                      </p>
                    </div>
                    <Badge className="bg-accent/20 text-accent border-accent/30">In Progress</Badge>
                  </div>

                  <p className="text-muted-foreground">
                    Comprehensive security audit of DeFi lending protocol smart contracts.
                  </p>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span>$5,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>7 days remaining</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-semibold">65%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[65%] rounded-full" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button className="flex-1 bg-primary hover:bg-primary/90">Submit Work</Button>
                    <Button variant="outline" className="border-primary/50 bg-transparent">
                      Message Employer
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Frontend Development</h3>
                      <p className="text-sm text-muted-foreground">
                        Employer: <span className="text-foreground font-mono">WebTeam_3391</span>
                      </p>
                    </div>
                    <Badge className="bg-accent/20 text-accent border-accent/30">In Progress</Badge>
                  </div>

                  <p className="text-muted-foreground">
                    Build responsive React interface with Web3 wallet integration.
                  </p>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span>$3,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>12 days remaining</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-semibold">40%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[40%] rounded-full" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button className="flex-1 bg-primary hover:bg-primary/90">Submit Work</Button>
                    <Button variant="outline" className="border-primary/50 bg-transparent">
                      Message Employer
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 bg-card/50 backdrop-blur">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold">Previous Job #{i}</h3>
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Completed on Jan {15 + i}, 2025</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">$2,500</div>
                      <div className="flex items-center gap-1 text-sm text-yellow-500">
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <span>5.0</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="submit" className="space-y-4">
              <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Submit Work</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="jobId">Job ID</Label>
                      <Input
                        id="jobId"
                        placeholder="Enter job ID..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="workDescription">Work Description</Label>
                      <Textarea
                        id="workDescription"
                        placeholder="Describe the work you've completed..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="submissionUrl">Submission URL</Label>
                      <Input
                        id="submissionUrl"
                        placeholder="https://... or ipfs://..."
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        const jobId = (document.getElementById("jobId") as HTMLInputElement)?.value
                        const description = (document.getElementById("workDescription") as HTMLTextAreaElement)?.value
                        const url = (document.getElementById("submissionUrl") as HTMLInputElement)?.value
                        if (jobId && url) {
                          submitWork(jobId, "0x" + Math.random().toString(16).slice(2, 66).padStart(64, '0'), url)
                            .then(txHash => {
                              if (txHash) {
                                alert("Work submitted successfully! Transaction: " + txHash)
                                // Clear form
                                ;(document.getElementById("jobId") as HTMLInputElement).value = ""
                                ;(document.getElementById("workDescription") as HTMLTextAreaElement).value = ""
                                ;(document.getElementById("submissionUrl") as HTMLInputElement).value = ""
                              }
                            })
                        } else {
                          alert("Please fill in all required fields")
                        }
                      }}
                      disabled={submitting}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {submitting ? "Submitting..." : "Submit Work"}
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="extensions" className="space-y-4">
              <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Request Deadline Extension</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="extJobId">Job ID</Label>
                      <Input
                        id="extJobId"
                        placeholder="Enter job ID..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="requestedDays">Requested Days</Label>
                      <Input
                        id="requestedDays"
                        type="number"
                        placeholder="Number of additional days..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="extensionReason">Reason</Label>
                      <Textarea
                        id="extensionReason"
                        placeholder="Explain why you need an extension..."
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        const jobId = (document.getElementById("extJobId") as HTMLInputElement)?.value
                        const days = parseInt((document.getElementById("requestedDays") as HTMLInputElement)?.value || "0")
                        const reason = (document.getElementById("extensionReason") as HTMLTextAreaElement)?.value
                        if (jobId && days > 0 && reason) {
                          requestExtension(jobId, days, reason)
                            .then(txHash => {
                              if (txHash) {
                                alert("Extension request submitted! Transaction: " + txHash)
                                // Clear form
                                ;(document.getElementById("extJobId") as HTMLInputElement).value = ""
                                ;(document.getElementById("requestedDays") as HTMLInputElement).value = ""
                                ;(document.getElementById("extensionReason") as HTMLTextAreaElement).value = ""
                              }
                            })
                        } else {
                          alert("Please fill in all required fields")
                        }
                      }}
                      disabled={requesting}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {requesting ? "Requesting..." : "Request Extension"}
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              <Card className="p-6 bg-card/50 backdrop-blur">
                <div className="text-center py-12 space-y-4">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">No Pending Applications</h3>
                    <p className="text-muted-foreground">Browse available jobs and apply to start working</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Browse Jobs</Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="debug" className="space-y-4">
              <ContractVerification />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-10 w-10 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold font-mono">
                          {profile?.pseudonym || pseudonym || "Anonymous Worker"}
                        </h3>
                        <p className="text-muted-foreground">
                          {profile?.is_active ? "Active Worker" : "Inactive Worker"}
                        </p>
                      </div>
                      <Button variant="outline" className="border-primary/50 bg-transparent">
                        Edit Profile
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Member Since</div>
                        <div className="font-semibold">
                          {profile 
                            ? new Date(profile.registration_timestamp * 1000).toLocaleDateString()
                            : "Not Registered"
                          }
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Reputation</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {profile?.reputation_score || 0} / 1000
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                        <div className="font-semibold">
                          {profile?.completed_jobs ? "100%" : "No jobs yet"}
                        </div>
                      </div>
                    </div>

                    {profile && (
                      <div className="space-y-3 pt-4 border-t border-border/50">
                        <h4 className="font-semibold">Profile Details</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Owner Commitment:</span>
                            <p className="text-xs text-muted-foreground font-mono break-all">
                              {profile.owner_commitment}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Skills Commitment:</span>
                            <p className="text-xs text-muted-foreground font-mono break-all">
                              {profile.skills_commitment}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Reputation Bond:</span>
                            <span className="ml-2">
                              {(parseFloat(profile.reputation_bond) / Math.pow(10, 18)).toFixed(4)} ETH
                            </span>
                          </div>
                        </div>
                      </div>
                    )}                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Privacy Protected</p>
                      <p className="text-muted-foreground">
                        Your real identity is never exposed. All interactions are pseudonymous.
                      </p>
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
