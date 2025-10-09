"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAccount } from "@starknet-react/core"
import { WalletConnectButton } from "@/components/wallet-connector"
import { useWorkerProfile, useRegisterPseudonym, useAddSkillProof, useGetSkillProofs } from "@/hooks/use-pseudonym-registry"
import { useJobDetails, useApplyForJob } from "@/hooks/use-job-marketplace"
import { createMockZKProof, createMockSkillProof, SkillLevel } from "@/lib/starknet/contracts"
import { 
  User, 
  Shield, 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Plus,
  Eye,
  FileText,
  Award
} from "lucide-react"

export default function ForWorkersPage() {
  const { address, isConnected } = useAccount()
  const [pseudonym, setPseudonym] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Hooks
  const { profile, loading: profileLoading } = useWorkerProfile(pseudonym || null)
  const { registerPseudonym, registering } = useRegisterPseudonym()
  const { addSkillProof, adding: addingSkill } = useAddSkillProof()
  const { getSkillProofs, skillProofs, loading: skillsLoading } = useGetSkillProofs()

  // Registration form state
  const [registrationForm, setRegistrationForm] = useState({
    pseudonym: "",
    identityCommitment: "",
    skillsCommitment: "",
    reputationBond: "1000000000000000000" // 1 ETH in wei
  })

  // Skill proof form state
  const [skillForm, setSkillForm] = useState({
    skillType: "",
    skillLevel: SkillLevel.Intermediate,
    verificationKey: ""
  })

  useEffect(() => {
    if (address) {
      // Generate a pseudonym based on address
      const generatedPseudonym = `worker_${address.slice(2, 8)}`
      setPseudonym(generatedPseudonym)
    }
  }, [address])

  const handleRegister = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first to register a pseudonym.")
      return
    }

    try {
      const txHash = await registerPseudonym(
        registrationForm.pseudonym,
        registrationForm.identityCommitment,
        registrationForm.skillsCommitment,
        registrationForm.reputationBond
      )
      
      if (txHash) {
        setIsRegistered(true)
        setPseudonym(registrationForm.pseudonym)
        alert("Registration successful! Transaction: " + txHash)
      }
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Registration failed. Please try again.")
    }
  }

  const handleAddSkill = async () => {
    if (!pseudonym) return

    try {
      const mockProof = createMockZKProof()
      const txHash = await addSkillProof(
        pseudonym,
        skillForm.skillType,
        skillForm.skillLevel,
        mockProof,
        skillForm.verificationKey
      )
      
      if (txHash) {
        alert("Skill proof added! Transaction: " + txHash)
        // Refresh skill proofs
        getSkillProofs(pseudonym)
      }
    } catch (error) {
      console.error("Adding skill failed:", error)
      alert("Failed to add skill proof.")
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Welcome to SpectralPay</h1>
              <p className="text-xl text-muted-foreground">
                Connect your wallet to start working anonymously and earning fairly
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
            <h1 className="text-4xl font-bold">Worker Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your anonymous profile, skills, and job applications
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              {!isRegistered ? (
                <Card className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Register Your Pseudonym</h2>
                      <p className="text-muted-foreground">
                        Create an anonymous worker profile to start earning
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium">Pseudonym</label>
                        <input
                          type="text"
                          value={registrationForm.pseudonym}
                          onChange={(e) => setRegistrationForm(prev => ({ ...prev, pseudonym: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="Enter your pseudonym"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Identity Commitment</label>
                        <input
                          type="text"
                          value={registrationForm.identityCommitment}
                          onChange={(e) => setRegistrationForm(prev => ({ ...prev, identityCommitment: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="0x..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Skills Commitment</label>
                        <input
                          type="text"
                          value={registrationForm.skillsCommitment}
                          onChange={(e) => setRegistrationForm(prev => ({ ...prev, skillsCommitment: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="0x..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Reputation Bond (ETH)</label>
                        <input
                          type="number"
                          value={registrationForm.reputationBond}
                          onChange={(e) => setRegistrationForm(prev => ({ ...prev, reputationBond: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="1.0"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleRegister} 
                      disabled={registering}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {registering ? "Registering..." : "Register Pseudonym"}
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {/* Profile Overview */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">{pseudonym}</h2>
                        <p className="text-muted-foreground">Anonymous Worker Profile</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Registered
                      </Badge>
                    </div>
                  </Card>

                  {/* Profile Stats */}
                  {profile && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center space-x-2">
                          <Award className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Reputation</p>
                            <p className="text-2xl font-bold">{profile.reputation_score}</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Jobs Completed</p>
                            <p className="text-2xl font-bold">{profile.completed_jobs}</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total Earnings</p>
                            <p className="text-2xl font-bold">{profile.total_earnings}</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Bond Amount</p>
                            <p className="text-2xl font-bold">{profile.reputation_bond}</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Your Skills</h2>
                    <Button onClick={() => setActiveTab("profile")} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>

                  {/* Add Skill Form */}
                  <div className="grid gap-4 p-4 border rounded-lg">
                    <h3 className="font-semibold">Add New Skill Proof</h3>
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium">Skill Type</label>
                        <input
                          type="text"
                          value={skillForm.skillType}
                          onChange={(e) => setSkillForm(prev => ({ ...prev, skillType: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="e.g., Web Development, Design, Writing"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Skill Level</label>
                        <select
                          value={skillForm.skillLevel}
                          onChange={(e) => setSkillForm(prev => ({ ...prev, skillLevel: parseInt(e.target.value) }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                        >
                          <option value={SkillLevel.Beginner}>Beginner</option>
                          <option value={SkillLevel.Intermediate}>Intermediate</option>
                          <option value={SkillLevel.Advanced}>Advanced</option>
                          <option value={SkillLevel.Expert}>Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Verification Key</label>
                        <input
                          type="text"
                          value={skillForm.verificationKey}
                          onChange={(e) => setSkillForm(prev => ({ ...prev, verificationKey: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="0x..."
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleAddSkill} 
                      disabled={addingSkill || !pseudonym}
                      className="w-full"
                    >
                      {addingSkill ? "Adding Skill..." : "Add Skill Proof"}
                    </Button>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Verified Skills</h3>
                    {skillsLoading ? (
                      <p>Loading skills...</p>
                    ) : skillProofs.length > 0 ? (
                      <div className="space-y-2">
                        {skillProofs.map((skill, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{skill.skill_type_hash}</p>
                              <p className="text-sm text-muted-foreground">
                                Level: {Object.keys(SkillLevel)[skill.skill_level]}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Verified
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No skills added yet</p>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Available Jobs</h2>
                  <p className="text-muted-foreground">
                    Browse and apply for jobs that match your skills
                  </p>
                  
                  {/* Mock jobs for demonstration */}
                  <div className="space-y-4">
                    {[
                      {
                        id: "1",
                        title: "Frontend Developer",
                        description: "Build responsive web applications using React and TypeScript",
                        payment: "2.5 ETH",
                        deadline: "7 days",
                        skills: ["React", "TypeScript", "CSS"]
                      },
                      {
                        id: "2", 
                        title: "Smart Contract Developer",
                        description: "Develop and audit smart contracts on Starknet",
                        payment: "5.0 ETH",
                        deadline: "14 days",
                        skills: ["Cairo", "Starknet", "Solidity"]
                      }
                    ].map((job) => (
                      <Card key={job.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">{job.description}</p>
                            </div>
                            <Badge variant="outline">{job.payment}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{job.deadline}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>{job.skills.join(", ")}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Earnings & Payments</h2>
                  <p className="text-muted-foreground">
                    Track your earnings and payment history
                  </p>
                  
                  {profile && (
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Total Earnings</p>
                          <p className="text-2xl font-bold">{profile.total_earnings} ETH</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Completed Jobs</p>
                          <p className="text-2xl font-bold">{profile.completed_jobs}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}