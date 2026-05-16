"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Mic, Brain, Award, ArrowRight, Users, CheckCircle2, BarChart3, GraduationCap } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { LandingHeader } from "@/components/layout/landing-header"
import { useState } from "react"
import { GuestVoiceCoach } from "@/components/voice/guest-voice-coach"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function HomePage() {
  const { t, dir } = useLanguage()
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30" dir={dir}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[120px] animate-pulse delay-1000" />
      </div>

      <LandingHeader />

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Brain className="h-3 w-3" />
              Revolutionizing Education in Algeria
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              {t("hero_title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              {t("hero_subtitle")}
            </p>
            <div className="mt-12 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl">
                <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="h-16 px-10 rounded-2xl gap-3 text-lg font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-95 bg-primary hover:bg-primary/90">
                      <Mic className="h-6 w-6" />
                      Try AI Coach Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-0 overflow-hidden border-none bg-transparent">
                    <GuestVoiceCoach onClose={() => setIsDemoOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Link href="/register">
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl gap-3 text-lg font-bold hover:bg-accent/50 transition-all active:scale-95 border-2">
                    {t("get_started")}
                  </Button>
                </Link>
              </div>

              {/* Direct Portal Access */}
              <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-border/10 w-full max-w-xl">
                <Link href="/student/dashboard" className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  Student Portal
                </Link>
                <Link href="/teacher/dashboard" className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Users className="h-4 w-4" />
                  </div>
                  Teacher Portal
                </Link>
              </div>
            </div>

            {/* Dashboard Preview Mockup */}
            <div className="mt-20 relative max-w-5xl mx-auto group">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
               <div className="relative bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl aspect-video flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <div className="text-center space-y-4">
                     <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-bounce">
                        <Brain className="h-8 w-8 text-primary" />
                     </div>
                     <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">PEDA Dashboard Preview</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-3xl font-bold mb-4 tracking-tight sm:text-4xl">Built for Modern Education</h2>
               <p className="text-muted-foreground text-lg italic">"PEDA bridges the gap between traditional learning and the AI-driven future."</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { 
                  title: "AI Voice Coach", 
                  desc: "Perfect your pronunciation with instant AI feedback on pace, clarity, and language accuracy.", 
                  icon: Mic,
                  bgSoftColor: "bg-blue-500/10",
                  iconColor: "text-blue-500"
                },
                { 
                  title: "Smart Course Builder", 
                  desc: "Teachers can create rich, interactive courses with embedded exams and automated grading.", 
                  icon: BookOpen,
                  bgSoftColor: "bg-indigo-500/10",
                  iconColor: "text-indigo-500"
                },
                { 
                  title: "Advanced Analytics", 
                  desc: "Track every milestone with deep insights into student performance and learning gaps.", 
                  icon: BarChart3,
                  bgSoftColor: "bg-emerald-500/10",
                  iconColor: "text-emerald-500"
                }
              ].map((feature, i) => (
                <div key={feature.title} className="p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className={`h-14 w-14 rounded-2xl ${feature.bgSoftColor} flex items-center justify-center mb-6`}>
                    <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-primary p-12 rounded-[3rem] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="relative z-10 max-w-xl">
                   <h2 className="text-3xl font-bold mb-6">Ready to transform your school?</h2>
                   <div className="space-y-4">
                      {[
                        "Free for students during pilot phase",
                        "Easy integration with Algerian curriculum",
                        "Available in AR/FR/EN"
                      ].map(item => (
                        <div key={item} className="flex items-center gap-3">
                           <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                           <span className="font-medium">{item}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="relative z-10 flex-shrink-0">
                   <Link href="/register">
                      <Button size="lg" variant="secondary" className="h-16 px-10 rounded-2xl text-lg font-extrabold hover:scale-105 transition-transform shadow-2xl">
                         Join PEDA Today
                      </Button>
                   </Link>
                </div>
             </div>
          </div>
        </section>

        <footer className="py-16 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2 transition-all cursor-pointer">
                <img src="/logo.jpeg" alt="PEDA Logo" className="h-8 w-auto object-contain rounded-sm grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
              </div>
              <div className="flex gap-8 text-sm">
                 <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                 <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                 <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </div>
              <p className="text-sm">&copy; 2026 PEDA. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
