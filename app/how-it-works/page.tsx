import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Lock, FileCheck, Zap, ArrowRight, CheckCircle2 } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-balance">
              How <span className="text-primary">SpectralPay</span> Works
            </h1>
            <p className="text-xl text-muted-foreground">
              Privacy-preserving payments powered by Starknet smart contracts and zero-knowledge proofs
            </p>
          </div>

          {/* Technology Stack */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Built on <span className="text-primary">Cutting-Edge Technology</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Starknet</h3>
                <p className="text-sm text-muted-foreground">Layer 2 scaling solution with native ZK-proof support</p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-bold mb-2">Smart Escrow</h3>
                <p className="text-sm text-muted-foreground">Trustless payment contracts with automated release</p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">ZK Proofs</h3>
                <p className="text-sm text-muted-foreground">Verify credentials without revealing identity</p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-bold mb-2">Instant Settlement</h3>
                <p className="text-sm text-muted-foreground">Fast, low-cost transactions on Layer 2</p>
              </Card>
            </div>
          </div>

          {/* Process Flow */}
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold text-center">
              The <span className="text-primary">Complete Process</span>
            </h2>

            {/* Step 1 */}
            <Card className="p-8 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  1
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold">Anonymous Identity Creation</h3>
                  <p className="text-muted-foreground">
                    Workers create pseudonymous profiles using wallet addresses. No personal information is collected or
                    stored. Skills and credentials can be verified using zero-knowledge proofs without revealing
                    identity.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Wallet-based authentication</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>ZK credential verification</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Reputation tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-8 bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-l-accent">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">
                  2
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold">Job Posting & Matching</h3>
                  <p className="text-muted-foreground">
                    Employers post jobs with requirements, budget, and deadline. Workers browse and apply anonymously.
                    Matching is based purely on skills, reputation, and work history - no personal data visible.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>Skill-based matching</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>Reputation filtering</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>Anonymous applications</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-8 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  3
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold">Smart Contract Escrow</h3>
                  <p className="text-muted-foreground">
                    When a worker is selected, the employer deposits payment into a smart contract escrow. Funds are
                    locked and can only be released when work is verified and approved. No intermediaries needed.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Trustless escrow</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Automated release</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Dispute resolution</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 4 */}
            <Card className="p-8 bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-l-accent">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">
                  4
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold">Work Completion & Verification</h3>
                  <p className="text-muted-foreground">
                    Worker completes the task and submits deliverables. Employer reviews and verifies the work. Once
                    approved, the smart contract automatically releases payment to the worker's wallet.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>Milestone tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>Instant payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>Reputation update</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 5 */}
            <Card className="p-8 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  5
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold">Compliance & Audit Trail</h3>
                  <p className="text-muted-foreground">
                    All transactions are recorded on-chain for transparency and compliance. Tax-ready audit trails are
                    generated without exposing worker identities. Employers get compliant records, workers stay
                    anonymous.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>On-chain records</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Tax compliance</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Privacy preserved</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto text-center space-y-6 mt-20">
            <h2 className="text-4xl font-bold">
              Ready to Get <span className="text-primary">Started</span>?
            </h2>
            <p className="text-xl text-muted-foreground">Join the future of anonymous, fair, and compliant payments</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/for-workers">
                <Button size="lg" className="bg-primary hover:bg-primary/90 glow-blue">
                  Start as Worker
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/for-employers">
                <Button size="lg" variant="outline" className="border-primary/50 hover:border-primary bg-transparent">
                  Hire Talent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
