"use client"

import { SignIn } from "@clerk/nextjs"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { getIsDemoMode } from "@/lib/auth"

export default function LoginPage() {
  const { language, setLanguage, t } = useLanguage()
  const isDemoMode = getIsDemoMode()

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

      {/* Right Side - Form (Mobile Top) */}
      <div className="flex flex-col items-center justify-center p-8 bg-background order-2 lg:order-1">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="flex items-center gap-2 mb-6 group transition-all">
              <img src="/logo.jpeg" alt="PEDA Logo" className="h-12 w-auto object-contain rounded-md shadow-sm transition-transform group-hover:scale-105" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your dashboard.</p>
          </div>

          <div className="clerk-wrapper">
             {isDemoMode ? (
               <div className="p-6 border border-dashed border-amber-200 bg-amber-50 rounded-2xl text-center">
                 <p className="text-sm text-amber-800 font-medium">Authentication is currently disabled.</p>
                 <p className="text-xs text-amber-600 mt-1">Please configure your Clerk keys in the .env file to enable the sign-in flow.</p>
                 <div className="mt-4 flex flex-col gap-2">
                    <Link href="/student/dashboard">
                      <Button variant="outline" className="w-full text-xs h-9">Demo Student Portal</Button>
                    </Link>
                    <Link href="/teacher/dashboard">
                      <Button variant="outline" className="w-full text-xs h-9">Demo Teacher Portal</Button>
                    </Link>
                 </div>
               </div>
             ) : (
               <SignIn 
                 routing="hash"
                 forceRedirectUrl="/student/dashboard"
                 appearance={{
                   elements: {
                     rootBox: "w-full",
                     card: "shadow-none border-none p-0 bg-transparent",
                     headerTitle: "hidden",
                     headerSubtitle: "hidden",
                     socialButtonsBlockButton: "rounded-xl border-border hover:bg-accent h-11",
                     formButtonPrimary: "bg-primary hover:bg-primary/90 rounded-xl h-11 text-sm font-bold shadow-md",
                     formFieldInput: "rounded-xl border-border h-11 focus:ring-primary",
                     footerAction: "hidden", // We'll use our own links
                   }
                 }}
                 signUpUrl="/register"
               />
             )}
          </div>

          <div className="text-center lg:text-left pt-4">
             <p className="text-sm text-muted-foreground">
               Don&apos;t have an account?{" "}
               <Link href="/register" className="text-primary font-bold hover:underline">
                 Create one now
               </Link>
             </p>
          </div>
        </div>
      </div>

      {/* Left Side - Visual (Mobile Hidden/Bottom) */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-primary relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-indigo-900" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        {/* Animated Shapes */}
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-8">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
            AI-Powered Education
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Empowering Algerian students with <span className="text-cyan-300 italic">Next-Gen</span> AI.
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Join the most advanced learning platform in Algeria. PEDA provides personalized feedback, real-time voice coaching, and interactive courses designed for your success.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
            <div>
              <div className="text-3xl font-bold text-white">10k+</div>
              <div className="text-sm text-white/60">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-white/60">Certified Courses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
