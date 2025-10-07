"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus, Loader2 } from "lucide-react"
import { useRegisterPseudonym } from "@/hooks/use-pseudonym-registry"
import { useStarknetWallet } from "@/lib/starknet/wallet"

export function RegisterPseudonymDialog() {
  const { isConnected } = useStarknetWallet()
  const { registerPseudonym, registering, error } = useRegisterPseudonym()
  const [open, setOpen] = useState(false)
  const [pseudonym, setPseudonym] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    // Generate commitments (in production, these would be proper ZK commitments)
    const identityCommitment = "0x" + Math.random().toString(16).slice(2)
    const skillsCommitment = "0x" + Math.random().toString(16).slice(2)
    const reputationBond = "100000000000000000" // 0.1 ETH in Wei

    const txHash = await registerPseudonym(pseudonym, identityCommitment, skillsCommitment, reputationBond)

    if (txHash) {
      alert(`Pseudonym registered successfully! Transaction: ${txHash}`)
      setOpen(false)
      setPseudonym("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Register Pseudonym
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl">Register Anonymous Identity</DialogTitle>
          <DialogDescription>
            Create your pseudonymous worker profile. Your real identity will never be revealed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="pseudonym">Choose Your Pseudonym</Label>
            <Input
              id="pseudonym"
              placeholder="e.g., CryptoNinja_4829"
              value={pseudonym}
              onChange={(e) => setPseudonym(e.target.value)}
              required
              className="bg-background/50 font-mono"
            />
            <p className="text-xs text-muted-foreground">
              This will be your anonymous identity on the platform. Choose wisely!
            </p>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 space-y-2">
            <h4 className="font-semibold text-sm">Registration Requirements:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Reputation bond: 0.1 ETH (refundable)</li>
              <li>• Zero-knowledge identity commitment</li>
              <li>• Skills verification (can be added later)</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={registering || !isConnected}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {registering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
