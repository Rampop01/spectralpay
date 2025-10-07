"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Briefcase, DollarSign, Clock, CheckCircle2, Star, TrendingUp, Shield, Eye, FileText } from "lucide-react"

export default function DashboardPage() {
  const [userType] = useState<"worker" | "employer">("worker")

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
                  Welcome back, <span className="text-primary font-mono">CryptoNinja_4829</span>
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Eye className="mr-2 h-4 w-4" />
                View Public Profile
              </Button>
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
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Jobs Completed</div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold">$24,500</div>
              <div className="text-sm text-muted-foreground">Total Earned</div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold">4.9</div>
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
              <TabsTrigger value="applications">Applications</TabsTrigger>
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

            <TabsContent value="profile" className="space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold font-mono">CryptoNinja_4829</h3>
                      <p className="text-muted-foreground">Anonymous Worker</p>
                    </div>
                    <Button variant="outline" className="border-primary/50 bg-transparent">
                      Edit Profile
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Member Since</div>
                      <div className="font-semibold">Dec 2024</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Reputation</div>
                      <div className="font-semibold flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        4.9 / 5.0
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                      <div className="font-semibold">100%</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <h4 className="font-semibold">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Solidity", "Cairo", "Smart Contract Auditing", "Security", "Starknet"].map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <h4 className="font-semibold">Bio</h4>
                    <p className="text-muted-foreground">
                      Experienced smart contract auditor specializing in DeFi protocols and zero-knowledge proof
                      systems. 5+ years in blockchain security with focus on Starknet ecosystem.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
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
