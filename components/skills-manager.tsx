"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccount } from "@starknet-react/core"
import { 
  PseudonymRegistryContract, 
  SkillLevel, 
  createMockZKProof,
  createMockSkillProof
} from "@/lib/starknet/contracts"
import { Award, Plus, Shield, Star, CheckCircle } from "lucide-react"

interface AddSkillDialogProps {
  pseudonym: string
  onSkillAdded?: () => void
}

export function AddSkillDialog({ pseudonym, onSkillAdded }: AddSkillDialogProps) {
  const { account, isConnected } = useAccount()
  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  
  const [skillForm, setSkillForm] = useState({
    skillType: "",
    skillLevel: SkillLevel.Beginner,
    description: ""
  })

  const handleAddSkillProof = async () => {
    if (!isConnected || !pseudonym || !account) {
      alert("Please connect wallet and set pseudonym")
      return
    }

    setAdding(true)
    try {
      const pseudonymContract = new PseudonymRegistryContract(account)
      
      // Create skill type hash
      const skillTypeHash = "0x" + Math.random().toString(16).slice(2, 66).padStart(64, '0')
      
      // Create mock ZK proof
      const zkProof = createMockZKProof()
      const verificationKey = "0x" + Math.random().toString(16).slice(2, 66).padStart(64, '0')
      
      const txHash = await pseudonymContract.addSkillProof(
        pseudonym,
        skillTypeHash,
        skillForm.skillLevel,
        zkProof,
        verificationKey
      )
      
      if (txHash) {
        alert("Skill proof added successfully! Transaction: " + txHash)
        setSkillForm({
          skillType: "",
          skillLevel: SkillLevel.Beginner,
          description: ""
        })
        setOpen(false)
        onSkillAdded?.()
      }
    } catch (error) {
      console.error("Failed to add skill proof:", error)
      alert("Failed to add skill proof")
    } finally {
      setAdding(false)
    }
  }

  const getSkillLevelName = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.Beginner: return "Beginner"
      case SkillLevel.Intermediate: return "Intermediate"
      case SkillLevel.Advanced: return "Advanced"
      case SkillLevel.Expert: return "Expert"
      default: return "Unknown"
    }
  }

  const getSkillLevelColor = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.Beginner: return "bg-gray-100 text-gray-800"
      case SkillLevel.Intermediate: return "bg-blue-100 text-blue-800"
      case SkillLevel.Advanced: return "bg-green-100 text-green-800"
      case SkillLevel.Expert: return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill Proof
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Skill Proof</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="skillType">Skill Type</Label>
            <Input
              id="skillType"
              placeholder="e.g., JavaScript, Python, Smart Contract Auditing..."
              value={skillForm.skillType}
              onChange={(e) => setSkillForm(prev => ({ ...prev, skillType: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="skillLevel">Skill Level</Label>
            <Select
              value={skillForm.skillLevel.toString()}
              onValueChange={(value) => setSkillForm(prev => ({ 
                ...prev, 
                skillLevel: parseInt(value) as SkillLevel 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SkillLevel.Beginner.toString()}>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSkillLevelColor(SkillLevel.Beginner)}>
                      {getSkillLevelName(SkillLevel.Beginner)}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value={SkillLevel.Intermediate.toString()}>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSkillLevelColor(SkillLevel.Intermediate)}>
                      {getSkillLevelName(SkillLevel.Intermediate)}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value={SkillLevel.Advanced.toString()}>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSkillLevelColor(SkillLevel.Advanced)}>
                      {getSkillLevelName(SkillLevel.Advanced)}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value={SkillLevel.Expert.toString()}>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSkillLevelColor(SkillLevel.Expert)}>
                      {getSkillLevelName(SkillLevel.Expert)}
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your experience with this skill..."
              value={skillForm.description}
              onChange={(e) => setSkillForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
            <Shield className="w-5 h-5 text-blue-600 mr-3" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">ZK Proof Generation</p>
              <p className="text-blue-700">
                A zero-knowledge proof will be generated to verify your skill without revealing your identity.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSkillProof}
              disabled={adding || !skillForm.skillType.trim()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {adding ? "Adding..." : "Add Skill"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SkillsManagerProps {
  pseudonym: string
  skills?: any[]
  onRefresh?: () => void
}

export function SkillsManager({ pseudonym, skills = [], onRefresh }: SkillsManagerProps) {
  const getSkillLevelName = (level: number) => {
    switch (level) {
      case SkillLevel.Beginner: return "Beginner"
      case SkillLevel.Intermediate: return "Intermediate"
      case SkillLevel.Advanced: return "Advanced"
      case SkillLevel.Expert: return "Expert"
      default: return "Unknown"
    }
  }

  const getSkillLevelColor = (level: number) => {
    switch (level) {
      case SkillLevel.Beginner: return "bg-gray-100 text-gray-800 border-gray-300"
      case SkillLevel.Intermediate: return "bg-blue-100 text-blue-800 border-blue-300"
      case SkillLevel.Advanced: return "bg-green-100 text-green-800 border-green-300"
      case SkillLevel.Expert: return "bg-purple-100 text-purple-800 border-purple-300"
      default: return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const mockSkills = [
    { skillType: "Smart Contract Development", level: SkillLevel.Expert, verified: true },
    { skillType: "Cairo Programming", level: SkillLevel.Advanced, verified: true },
    { skillType: "Security Auditing", level: SkillLevel.Expert, verified: false },
    { skillType: "Frontend Development", level: SkillLevel.Intermediate, verified: true },
  ]

  const displaySkills = skills.length > 0 ? skills : mockSkills

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Skills & Certifications</h3>
          <p className="text-sm text-muted-foreground">
            Manage your verified skills and add new certifications
          </p>
        </div>
        <AddSkillDialog pseudonym={pseudonym} onSkillAdded={onRefresh} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displaySkills.map((skill, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{skill.skillType || skill.skill_type_hash}</h4>
                  <Badge className={getSkillLevelColor(skill.level || skill.skill_level)}>
                    {getSkillLevelName(skill.level || skill.skill_level)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {skill.verified || skill.is_verified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {skill.verified || skill.is_verified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
              
              {skill.proof_timestamp && (
                <p className="text-xs text-muted-foreground">
                  Added: {new Date(skill.proof_timestamp * 1000).toLocaleDateString()}
                </p>
              )}
              
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  ZK Proof {skill.verified || skill.is_verified ? "Verified" : "Generated"}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {displaySkills.length === 0 && (
        <Card className="p-8 text-center">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Skills Added Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your anonymous profile by adding verified skills
          </p>
          <AddSkillDialog pseudonym={pseudonym} onSkillAdded={onRefresh} />
        </Card>
      )}
    </div>
  )
}