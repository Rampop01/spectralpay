"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Send, Loader2 } from "lucide-react"
import { useApplyForJob } from "@/hooks/use-job-marketplace"
import { useStarknetWallet } from "@/lib/starknet/wallet"
import { createMockZKProof } from "@/lib/starknet/contracts"

interface ApplyJobDialogProps {
  jobId: string
  jobTitle: string
}

export function ApplyJobDialog({ jobId, jobTitle }: ApplyJobDialogProps) {
  const { isConnected } = useStarknetWallet()
  const { applyForJob, applying, error } = useApplyForJob()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    pseudonym: "",
    proposal: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    // Generate mock ZK proof (in production, this would be a real ZK proof)
    const zkProof = createMockZKProof()

    // Generate proposal hash
    const proposalHash = "0x" + Math.random().toString(16).slice(2)

    const txHash = await applyForJob(jobId, formData.pseudonym, zkProof, proposalHash)

    if (txHash) {
      alert(`Application submitted successfully! Transaction: ${txHash}`)
      setOpen(false)
      setFormData({ pseudonym: "", proposal: "" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          Apply Anonymously
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl">Apply for Job</DialogTitle>
          <DialogDescription>{jobTitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="pseudonym">Your Pseudonym</Label>
            <Input
              id="pseudonym"
              placeholder="e.g., CryptoNinja_4829"
              value={formData.pseudonym}
              onChange={(e) => setFormData({ ...formData, pseudonym: e.target.value })}
              required
              className="bg-background/50 font-mono"
            />
            <p className="text-xs text-muted-foreground">Use your registered pseudonym from the Pseudonym Registry</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal">Your Proposal</Label>
            <Textarea
              id="proposal"
              placeholder="Explain why you're the best fit for this job..."
              value={formData.proposal}
              onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
              required
              rows={6}
              className="bg-background/50"
            />
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 space-y-2">
            <h4 className="font-semibold text-sm">Application includes:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Zero-knowledge proof of skills</li>
              <li>• Your reputation score and completed jobs</li>
              <li>• Encrypted proposal (only visible to employer)</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={applying || !isConnected} className="flex-1 bg-primary hover:bg-primary/90">
              {applying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
