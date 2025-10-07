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
import { Briefcase, Loader2 } from "lucide-react"
import { usePostJob } from "@/hooks/use-job-marketplace"
import { useStarknetWallet } from "@/lib/starknet/wallet"

export function PostJobDialog() {
  const { isConnected } = useStarknetWallet()
  const { postJob, posting, error } = usePostJob()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    paymentAmount: "",
    deadlineDays: "",
    paymentToken: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH on Starknet
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    // Generate a simple skills hash (in production, this would be more sophisticated)
    const skillsHash = "0x" + Math.random().toString(16).slice(2)

    const txHash = await postJob(
      formData.title,
      formData.description,
      skillsHash,
      formData.paymentAmount,
      Number.parseInt(formData.deadlineDays),
      formData.paymentToken,
    )

    if (txHash) {
      alert(`Job posted successfully! Transaction: ${txHash}`)
      setOpen(false)
      setFormData({
        title: "",
        description: "",
        paymentAmount: "",
        deadlineDays: "",
        paymentToken: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90">
          <Briefcase className="mr-2 h-4 w-4" />
          Post a Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl">Post a New Job</DialogTitle>
          <DialogDescription>
            Create a job listing and deposit payment into escrow. Workers will apply anonymously.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="e.g., Smart Contract Auditor"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the job requirements, deliverables, and expectations..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="bg-background/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Amount (Wei)</Label>
              <Input
                id="payment"
                type="text"
                placeholder="1000000000000000000"
                value={formData.paymentAmount}
                onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                required
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">Enter amount in Wei (1 ETH = 10^18 Wei)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Days)</Label>
              <Input
                id="deadline"
                type="number"
                placeholder="14"
                value={formData.deadlineDays}
                onChange={(e) => setFormData({ ...formData, deadlineDays: e.target.value })}
                required
                min="1"
                className="bg-background/50"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={posting || !isConnected} className="flex-1 bg-primary hover:bg-primary/90">
              {posting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Job"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
