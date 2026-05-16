import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scale, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 pb-20">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-12 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Button>
        </Link>
        
        <div className="space-y-4 mb-16">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">Last updated: April 28, 2026</p>
        </div>

        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <aside className="hidden md:block space-y-4 sticky top-24 self-start">
            <h3 className="font-bold text-sm uppercase tracking-widest text-primary">On this page</h3>
            <nav className="flex flex-col space-y-3 text-sm text-muted-foreground">
              <a href="#acceptance" className="hover:text-primary transition-colors">Acceptance</a>
              <a href="#usage" className="hover:text-primary transition-colors">User Conduct</a>
              <a href="#intellectual" className="hover:text-primary transition-colors">Intellectual Property</a>
              <a href="#disclaimer" className="hover:text-primary transition-colors">Disclaimer</a>
            </nav>
          </aside>

          <div className="prose dark:prose-invert prose-slate max-w-none">
            <section id="acceptance" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" /> 1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using PEDA, you agree to be bound by these Terms of Service. This platform is designed specifically for the Algerian educational context and uses AI to enhance the learning experience.
              </p>
            </section>

            <section id="usage" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" /> 2. User Conduct
              </h2>
              <p>
                Users must not use the AI voice coaching feature to record or process offensive or illegal content. We reserve the right to suspend accounts that violate these guidelines.
              </p>
            </section>

            <section id="disclaimer" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" /> 3. Disclaimer
              </h2>
              <p>
                While our AI models are highly accurate, they are tools to assist learning and should not be used as the sole basis for critical evaluations without human teacher oversight.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
