import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RegisterPseudonymDialog } from "@/components/register-pseudonym-dialog"
import { Shield, Eye, Award, TrendingUp, CheckCircle2 } from "lucide-react"

export default function ForWorkersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm text-primary">
              <Shield className="h-4 w-4" />
              <span>For Workers</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-balance">
              Work <span className="text-primary">Freely</span>.
              <br />
              Stay <span className="text-accent">Anonymous</span>.
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build your career without compromising your privacy. Get paid fairly based on your skills, not your
              identity.
            </p>

            <div className="flex justify-center pt-4">
              <RegisterPseudonymDialog />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <Eye className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">Complete Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Your real identity stays hidden. Work without fear of exposure.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <Award className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-bold mb-2">Skill-Based Reputation</h3>
              <p className="text-sm text-muted-foreground">
                Build credibility through quality work, not personal background.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <TrendingUp className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">Fair Compensation</h3>
              <p className="text-sm text-muted-foreground">
                Get paid what you deserve, regardless of location or demographics.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30">
              <CheckCircle2 className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-bold mb-2">Instant Payments</h3>
              <p className="text-sm text-muted-foreground">
                Automated escrow releases funds immediately upon completion.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Profile Creation Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur border-primary/30">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold">Create Your Anonymous Profile</h2>
                  <p className="text-muted-foreground">Start working privately in minutes</p>
                </div>

                <div className="text-center py-8">
                  <RegisterPseudonymDialog />
                  <p className="text-sm text-muted-foreground mt-4">
                    Connect your Starknet wallet to create your anonymous worker profile
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Who Benefits?</h2>
              <p className="text-xl text-muted-foreground">Perfect for workers who need privacy protection</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur">
                <h3 className="font-bold text-lg mb-3">🔒 Security Researchers</h3>
                <p className="text-sm text-muted-foreground">
                  Work on sensitive projects without exposing your identity to potential threats
                </p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur">
                <h3 className="font-bold text-lg mb-3">📰 Journalists & Activists</h3>
                <p className="text-sm text-muted-foreground">
                  Earn income while protecting yourself from retaliation or harassment
                </p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur">
                <h3 className="font-bold text-lg mb-3">🌍 Global Freelancers</h3>
                <p className="text-sm text-muted-foreground">
                  Get fair pay regardless of your location or demographic background
                </p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur">
                <h3 className="font-bold text-lg mb-3">💼 Multi-Client Workers</h3>
                <p className="text-sm text-muted-foreground">
                  Work for competing companies without conflicts of interest
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">
              Ready to Start Working <span className="text-primary">Anonymously</span>?
            </h2>
            <p className="text-xl text-muted-foreground">Create your profile and browse available jobs today</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <RegisterPseudonymDialog />
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-primary/50 hover:border-primary bg-transparent">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
