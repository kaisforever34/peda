"use client"

import { SignUp } from "@clerk/nextjs"
import { BookOpen, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { getIsDemoMode } from "@/lib/auth"

export default function RegisterPage() {
  const { language, setLanguage, t } = useLanguage()
  const isDemoMode = getIsDemoMode()
  const benefits = [
    "Personalized AI Study Plans",
    "Real-time Voice Coaching",
    "Smart Performance Analytics",
    "Official Certifications",
    "Interactive STEM Simulations"
  ]

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Language Toggle Overlay */}
      <div className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-md rounded-lg p-1 border shadow-sm flex gap-1">
        {(["en", "fr", "ar"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-md transition-all ${
              language === lang ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Left Side - Visual Benefits */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-primary/20" />
        
        {/* Abstract Tech Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 max-w-lg">
          <Link href="/" className="flex items-center gap-2 mb-12 group">
            <img src="/logo.jpeg" alt="PEDA Logo" className="h-12 w-auto object-contain rounded-md shadow-lg transition-transform group-hover:scale-105" />
          </Link>

          <h2 className="text-4xl font-extrabold text-white leading-tight mb-8">
            The future of learning is <span className="text-primary italic">here.</span>
          </h2>

          <div className="space-y-6">
            {benefits.map((benefit, i) => (
              <div 
                key={benefit} 
                className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-2"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <span className="text-slate-300 font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
             <p className="text-slate-400 italic text-sm">
               "PEDA has completely transformed how I prepare for my baccalaureate. The AI feedback on my English pronunciation is a game-changer!"
             </p>
             <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                <div>
                   <div className="text-white text-sm font-bold">Lina Mansouri</div>
                   <div className="text-muted-foreground text-xs">High School Student, Algiers</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side - SignUp Form */}
      <div className="flex flex-col items-center justify-center p-8 bg-background relative overflow-auto">
        <div className="w-full max-w-md space-y-8 py-12">
          <div className="flex flex-col items-center lg:items-start">
             <div className="lg:hidden mb-8">
               <Link href="/" className="flex items-center gap-2">
                 <img src="/logo.jpeg" alt="PEDA Logo" className="h-10 w-auto object-contain rounded-md shadow-sm" />
               </Link>
             </div>
             <h1 className="text-3xl font-bold tracking-tight text-foreground">Create your account</h1>
             <p className="text-muted-foreground mt-2 text-center lg:text-left">Join thousands of students and teachers today.</p>
          </div>

          <div className="clerk-wrapper">
             {isDemoMode ? (
               <div className="p-8 border-2 border-dashed border-primary/20 bg-primary/5 rounded-[2rem] text-center">
                 <h3 className="text-lg font-bold text-primary mb-2">Registration is in Demo Mode</h3>
                 <p className="text-sm text-muted-foreground mb-6">Authentication keys are not configured. You can still explore the platform using the links below.</p>
                 <div className="flex flex-col gap-3">
                    <Link href="/student/dashboard">
                      <Button className="w-full rounded-xl">Go to Student Dashboard</Button>
                    </Link>
                    <Link href="/teacher/dashboard">
                      <Button variant="outline" className="w-full rounded-xl">Go to Teacher Dashboard</Button>
                    </Link>
                 </div>
               </div>
             ) : (
               <SignUp 
                 routing="hash"
                 forceRedirectUrl="/onboarding"
                 appearance={{
                   elements: {
                     rootBox: "w-full",
                     card: "shadow-none border-none p-0 bg-transparent",
                     header: "hidden",
                     socialButtonsBlockButton: "rounded-xl border-border hover:bg-accent h-11",
                     formButtonPrimary: "bg-primary hover:bg-primary/90 rounded-xl h-11 text-sm font-bold shadow-md",
                     formFieldInput: "rounded-xl border-border h-11 focus:ring-primary",
                     footer: "hidden",
                   }
                 }}
                 signInUrl="/login"
               />
             )}
          </div>

          <div className="text-center lg:text-left pt-4">
             <p className="text-sm text-muted-foreground">
               Already have an account?{" "}
               <Link href="/login" className="text-primary font-bold hover:underline">
                 Sign in instead
               </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
