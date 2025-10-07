import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Lock, Zap, Globe, Eye, FileCheck, ArrowRight, CheckCircle2, Users, Briefcase } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            

            <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
              Work <span className="text-primary text-glow">Anonymously</span>.
              <br />
              Get Paid <span className="text-accent">Fairly</span>.
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              The first privacy-preserving payment platform where workers earn without revealing identity, and employers
              hire based purely on skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/for-workers">
                <Button size="lg" className="bg-primary hover:bg-primary/90 glow-blue text-lg px-8">
                  Start as Worker
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/for-employers">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 hover:border-primary text-lg px-8 bg-transparent"
                >
                  Hire Anonymously
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Private</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-accent">0%</div>
                <div className="text-sm text-muted-foreground">Platform Fee</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Automated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Privacy-First <span className="text-primary">Payment Protocol</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built on Starknet with zero-knowledge proofs for complete anonymity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Anonymous Identity</h3>
                <p className="text-muted-foreground">
                  Create pseudonymous profiles with verified skills. Work without revealing your real identity.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Smart Escrow</h3>
                <p className="text-muted-foreground">
                  Automated payments via smart contracts. Funds released upon verified completion.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">ZK Compliance</h3>
                <p className="text-muted-foreground">
                  Prove compliance and reputation without exposing sensitive personal data.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Globe className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Global Access</h3>
                <p className="text-muted-foreground">
                  Hire and work globally without geographic bias or discrimination.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Instant Payments</h3>
                <p className="text-muted-foreground">
                  Receive payments immediately upon task verification. No delays or disputes.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Zero Liability</h3>
                <p className="text-muted-foreground">
                  Employers reduce data liability. No sensitive worker information stored.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              How It <span className="text-primary">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* For Workers */}
            <Card className="p-8 bg-card/50 backdrop-blur border-primary/30">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">For Workers</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Create Anonymous Profile</h4>
                      <p className="text-sm text-muted-foreground">
                        Register with a pseudonymous identity and verify your skills
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Browse & Apply</h4>
                      <p className="text-sm text-muted-foreground">
                        Find jobs and apply without revealing your real identity
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Complete Work</h4>
                      <p className="text-sm text-muted-foreground">
                        Deliver quality work and maintain your reputation score
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Get Paid Automatically</h4>
                      <p className="text-sm text-muted-foreground">Receive instant payment when work is verified</p>
                    </div>
                  </div>
                </div>

                <Link href="/for-workers">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Start Working
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* For Employers */}
            <Card className="p-8 bg-card/50 backdrop-blur border-accent/30">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-accent" />
                  <h3 className="text-2xl font-bold">For Employers</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Post Job</h4>
                      <p className="text-sm text-muted-foreground">
                        Create job listing with scope, budget, and deadline
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Review Applications</h4>
                      <p className="text-sm text-muted-foreground">
                        Evaluate candidates based on skills and reputation
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Fund Escrow</h4>
                      <p className="text-sm text-muted-foreground">Deposit payment into smart contract escrow</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Auto-Release Payment</h4>
                      <p className="text-sm text-muted-foreground">Payment released automatically upon verification</p>
                    </div>
                  </div>
                </div>

                <Link href="/for-employers">
                  <Button className="w-full bg-accent hover:bg-accent/90">
                    Start Hiring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 backdrop-blur">
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold">
                    Why <span className="text-primary">SpectralPay</span>?
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    The future of fair, private, and compliant global payments
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">No Identity Exposure</h4>
                      <p className="text-sm text-muted-foreground">Workers protected from harassment and retaliation</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Zero Bias Hiring</h4>
                      <p className="text-sm text-muted-foreground">Decisions based purely on skills and quality</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Automated Compliance</h4>
                      <p className="text-sm text-muted-foreground">Tax-ready records without personal data</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Trustless Escrow</h4>
                      <p className="text-sm text-muted-foreground">Smart contracts eliminate payment disputes</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Global Talent Pool</h4>
                      <p className="text-sm text-muted-foreground">Access workers worldwide without restrictions</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Reduced Liability</h4>
                      <p className="text-sm text-muted-foreground">No sensitive employee data to protect</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Ready to Experience <span className="text-primary">True Privacy</span>?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join the future of anonymous, fair, and compliant global payments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/for-workers">
                <Button size="lg" className="bg-primary hover:bg-primary/90 glow-blue text-lg px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 hover:border-primary text-lg px-8 bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                
                <span className="font-bold text-lg">SpectralPay</span>
              </div>
              <p className="text-sm text-muted-foreground">Privacy-first payment protocol on Starknet</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/jobs" className="block hover:text-foreground">
                  Browse Jobs
                </Link>
                <Link href="/how-it-works" className="block hover:text-foreground">
                  How It Works
                </Link>
                <Link href="/pricing" className="block hover:text-foreground">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/docs" className="block hover:text-foreground">
                  Documentation
                </Link>
                <Link href="/faq" className="block hover:text-foreground">
                  FAQ
                </Link>
                <Link href="/support" className="block hover:text-foreground">
                  Support
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/privacy" className="block hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="/compliance" className="block hover:text-foreground">
                  Compliance
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>© 2025 SpectralPay. Built on Starknet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
