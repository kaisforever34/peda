import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react"

export default function PrivacyPage() {
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
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">Last updated: April 28, 2026</p>
        </div>

        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <aside className="hidden md:block space-y-4 sticky top-24 self-start">
            <h3 className="font-bold text-sm uppercase tracking-widest text-primary">On this page</h3>
            <nav className="flex flex-col space-y-3 text-sm text-muted-foreground">
              <a href="#collection" className="hover:text-primary transition-colors">Data Collection</a>
              <a href="#usage" className="hover:text-primary transition-colors">How we use data</a>
              <a href="#sharing" className="hover:text-primary transition-colors">Data Sharing</a>
              <a href="#security" className="hover:text-primary transition-colors">Security Measures</a>
            </nav>
          </aside>

          <div className="prose dark:prose-invert prose-slate max-w-none">
            <section id="collection" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" /> 1. Data Collection
              </h2>
              <p>
                At PEDA, we collect minimal information necessary to provide our AI learning services. This includes your name, email address (via Clerk), and voice recordings specifically used for AI coaching sessions.
              </p>
            </section>

            <section id="usage" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> 2. How we use data
              </h2>
              <p>
                We use your data to:
              </p>
              <ul>
                <li>Provide personalized AI voice feedback</li>
                <li>Track your learning progress and course completions</li>
                <li>Improve our AI models for better language detection</li>
              </ul>
            </section>

            <section id="security" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> 3. Security Measures
              </h2>
              <p>
                Your data is stored securely using industry-standard encryption. Voice recordings are processed in real-time and only stored if necessary for your personal review history.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
