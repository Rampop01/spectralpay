"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStarknetWallet } from "@/lib/starknet/wallet"
import { useVerifySkillProof, useVerifyIdentityProof, useAddVerificationKey } from "@/hooks/use-zk-verifier"
import { createMockZKProof, SkillLevel } from "@/lib/starknet/contracts"
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Key, 
  User, 
  Award,
  FileText,
  Lock,
  Eye,
  Plus
} from "lucide-react"

export default function ZKVerificationPage() {
  const { address, isConnected, connect } = useStarknetWallet()
  const [activeTab, setActiveTab] = useState("verify")
  const [verificationResults, setVerificationResults] = useState<{
    skillProof: boolean | null
    identityProof: boolean | null
  }>({
    skillProof: null,
    identityProof: null
  })

  // Hooks
  const { verifySkillProof, verifying: verifyingSkill, error: skillError } = useVerifySkillProof()
  const { verifyIdentityProof, verifying: verifyingIdentity, error: identityError } = useVerifyIdentityProof()
  const { addVerificationKey, adding: addingKey, error: keyError } = useAddVerificationKey()

  // Form states
  const [skillForm, setSkillForm] = useState({
    skillTypeHash: "",
    requiredLevel: SkillLevel.Intermediate,
    verificationKey: ""
  })

  const [identityForm, setIdentityForm] = useState({
    pseudonym: "",
    identityCommitment: ""
  })

  const [keyForm, setKeyForm] = useState({
    skillTypeHash: "",
    verificationKey: ""
  })

  const handleVerifySkillProof = async () => {
    if (!isConnected) {
      await connect()
      return
    }

    try {
      const mockProof = createMockZKProof()
      const result = await verifySkillProof(
        skillForm.skillTypeHash,
        skillForm.requiredLevel,
        mockProof,
        skillForm.verificationKey
      )
      
      setVerificationResults(prev => ({ ...prev, skillProof: result }))
      
      if (result) {
        alert("Skill proof verified successfully!")
      } else {
        alert("Skill proof verification failed.")
      }
    } catch (error) {
      console.error("Skill verification failed:", error)
      alert("Failed to verify skill proof.")
    }
  }

  const handleVerifyIdentityProof = async () => {
    if (!isConnected) {
      await connect()
      return
    }

    try {
      const mockProof = createMockZKProof()
      const result = await verifyIdentityProof(
        identityForm.pseudonym,
        identityForm.identityCommitment,
        mockProof
      )
      
      setVerificationResults(prev => ({ ...prev, identityProof: result }))
      
      if (result) {
        alert("Identity proof verified successfully!")
      } else {
        alert("Identity proof verification failed.")
      }
    } catch (error) {
      console.error("Identity verification failed:", error)
      alert("Failed to verify identity proof.")
    }
  }

  const handleAddVerificationKey = async () => {
    if (!isConnected) {
      await connect()
      return
    }

    try {
      const txHash = await addVerificationKey(
        keyForm.skillTypeHash,
        keyForm.verificationKey
      )
      
      if (txHash) {
        alert("Verification key added successfully! Transaction: " + txHash)
        setKeyForm({ skillTypeHash: "", verificationKey: "" })
      }
    } catch (error) {
      console.error("Adding verification key failed:", error)
      alert("Failed to add verification key.")
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">ZK Proof Verification</h1>
              <p className="text-xl text-muted-foreground">
                Connect your wallet to verify zero-knowledge proofs
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">ZK Proof Verification</h1>
            <p className="text-muted-foreground">
              Verify zero-knowledge proofs for skills and identity without revealing sensitive information
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="verify">Verify Proofs</TabsTrigger>
              <TabsTrigger value="keys">Verification Keys</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            {/* Verify Proofs Tab */}
            <TabsContent value="verify" className="space-y-6">
              <div className="grid gap-6">
                {/* Skill Proof Verification */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold">Verify Skill Proof</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Verify that a worker has the required skill level without revealing their identity
                    </p>

                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium">Skill Type Hash</label>
                        <input
                          type="text"
                          value={skillForm.skillTypeHash}
                          onChange={(e) => setSkillForm(prev => ({ ...prev, skillTypeHash: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="0x..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Required Skill Level</label>
                        <select
                          value={skillForm.requiredLevel}
                          onChange={(e) => setSkillForm(prev => ({ ...prev, requiredLevel: parseInt(e.target.value) }))}
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
                      onClick={handleVerifySkillProof}
                      disabled={verifyingSkill}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {verifyingSkill ? "Verifying..." : "Verify Skill Proof"}
                    </Button>

                    {skillError && (
                      <div className="text-red-600 text-sm">{skillError}</div>
                    )}
                  </div>
                </Card>

                {/* Identity Proof Verification */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold">Verify Identity Proof</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Verify that a pseudonym belongs to a specific identity commitment
                    </p>

                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium">Pseudonym</label>
                        <input
                          type="text"
                          value={identityForm.pseudonym}
                          onChange={(e) => setIdentityForm(prev => ({ ...prev, pseudonym: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="worker_abc123"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Identity Commitment</label>
                        <input
                          type="text"
                          value={identityForm.identityCommitment}
                          onChange={(e) => setIdentityForm(prev => ({ ...prev, identityCommitment: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="0x..."
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleVerifyIdentityProof}
                      disabled={verifyingIdentity}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {verifyingIdentity ? "Verifying..." : "Verify Identity Proof"}
                    </Button>

                    {identityError && (
                      <div className="text-red-600 text-sm">{identityError}</div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Verification Keys Tab */}
            <TabsContent value="keys" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Key className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Add Verification Key</h2>
                  </div>
                  <p className="text-muted-foreground">
                    Add new verification keys for different skill types
                  </p>

                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Skill Type Hash</label>
                      <input
                        type="text"
                        value={keyForm.skillTypeHash}
                        onChange={(e) => setKeyForm(prev => ({ ...prev, skillTypeHash: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="0x..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Verification Key</label>
                      <input
                        type="text"
                        value={keyForm.verificationKey}
                        onChange={(e) => setKeyForm(prev => ({ ...prev, verificationKey: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="0x..."
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddVerificationKey}
                    disabled={addingKey}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {addingKey ? "Adding..." : "Add Verification Key"}
                  </Button>

                  {keyError && (
                    <div className="text-red-600 text-sm">{keyError}</div>
                  )}
                </div>
              </Card>

              {/* Existing Keys */}
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Existing Verification Keys</h3>
                  <div className="space-y-2">
                    {[
                      { skillType: "Web Development", key: "0x1234...5678", added: "2 days ago" },
                      { skillType: "Smart Contracts", key: "0x2345...6789", added: "1 week ago" },
                      { skillType: "UI/UX Design", key: "0x3456...7890", added: "2 weeks ago" }
                    ].map((key, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{key.skillType}</p>
                          <p className="text-sm text-muted-foreground">{key.key}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Added {key.added}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Verification Results</h2>
                  <p className="text-muted-foreground">
                  View the results of your recent proof verifications
                  </p>

                  <div className="space-y-4">
                    {/* Skill Proof Result */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Skill Proof Verification</p>
                          <p className="text-sm text-muted-foreground">
                            Skill Type: {skillForm.skillTypeHash || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {verificationResults.skillProof === null ? (
                          <Badge variant="outline">Not Verified</Badge>
                        ) : verificationResults.skillProof ? (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600 hover:bg-red-700">
                            <XCircle className="w-4 h-4 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Identity Proof Result */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Identity Proof Verification</p>
                          <p className="text-sm text-muted-foreground">
                            Pseudonym: {identityForm.pseudonym || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {verificationResults.identityProof === null ? (
                          <Badge variant="outline">Not Verified</Badge>
                        ) : verificationResults.identityProof ? (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600 hover:bg-red-700">
                            <XCircle className="w-4 h-4 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </div>
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
