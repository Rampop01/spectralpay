import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PostJobDialog } from "@/components/post-job-dialog"
import { Briefcase, Globe, Shield, Zap, CheckCircle2 } from "lucide-react"

export default function ForEmployersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-sm text-accent">
              <Briefcase className="h-4 w-4" />
              <span>For Employers</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-balance">
              Hire <span className="text-accent">Global Talent</span>.
              <br />
              Zero <span className="text-primary">Liability</span>.
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access the best workers worldwide without storing sensitive data. Pay fairly based on skills, not
              demographics.
            </p>

            <div className="flex justify-center pt-4">
              <PostJobDialog />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 bg-card/50 backdrop-blur border-accent/30">
              <Globe className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-bold mb-2">Global Talent Pool</h3>
              <p className="text-sm text-muted-foreground">
                Access skilled workers from anywhere without geographic restrictions.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-accent/30">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">Zero Data Liability</h3>
              <p className="text-sm text-muted-foreground">No sensitive employee data to protect or manage.</p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-accent/30">
              <Zap className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-bold mb-2">Automated Payments</h3>
              <p className="text-sm text-muted-foreground">
                Smart contracts handle escrow and payment release automatically.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-accent/30">
              <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">Bias-Free Hiring</h3>
              <p className="text-sm text-muted-foreground">Evaluate candidates purely on skills and work quality.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Posting Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur border-accent/30">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold">Post Your First Job</h2>
                  <p className="text-muted-foreground">Find the perfect anonymous worker for your project</p>
                </div>

                <div className="text-center py-8">
                  <PostJobDialog />
                  <p className="text-sm text-muted-foreground mt-4">
                    Connect your Starknet wallet to post jobs and manage payments
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Simple Hiring Process</h2>
              <p className="text-xl text-muted-foreground">From job posting to payment in 4 easy steps</p>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-l-4 border-l-accent">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Post Job & Fund Escrow</h3>
                    <p className="text-muted-foreground">
                      Create your job listing with requirements and budget. Deposit payment into smart contract escrow
                      for security.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur border-l-4 border-l-accent">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Review Anonymous Applications</h3>
                    <p className="text-muted-foreground">
                      Evaluate candidates based on their pseudonymous reputation, skills, and portfolio. No personal
                      data visible.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur border-l-4 border-l-accent">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Worker Completes Task</h3>
                    <p className="text-muted-foreground">
                      Selected worker delivers the work according to specifications. Communicate through encrypted
                      channels.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur border-l-4 border-l-accent">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Verify & Auto-Release Payment</h3>
                    <p className="text-muted-foreground">
                      Review the deliverables. Once approved, smart contract automatically releases payment to the
                      worker.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30 backdrop-blur">
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold">Why Employers Choose Us</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Reduced Compliance Burden</h4>
                      <p className="text-sm text-muted-foreground">No personal data means less regulatory overhead</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Quality-Based Selection</h4>
                      <p className="text-sm text-muted-foreground">Hire based on skills and reputation only</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">No Payment Disputes</h4>
                      <p className="text-sm text-muted-foreground">Smart contracts eliminate conflicts</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Audit-Ready Records</h4>
                      <p className="text-sm text-muted-foreground">Tax compliant without sensitive data</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Global Talent Access</h4>
                      <p className="text-sm text-muted-foreground">No geographic or demographic barriers</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Zero Platform Fees</h4>
                      <p className="text-sm text-muted-foreground">Only blockchain transaction costs</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">
              Ready to Hire <span className="text-accent">Anonymously</span>?
            </h2>
            <p className="text-xl text-muted-foreground">Post your first job and access global talent today</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PostJobDialog />
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-accent/50 hover:border-accent bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
