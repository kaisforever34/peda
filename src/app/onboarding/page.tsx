"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserCircle, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { completeOnboarding } from "@/app/actions/onboarding"
import { Role } from "@prisma/client"

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleComplete = async () => {
    if (!selectedRole) return
    setIsSubmitting(true)
    try {
      await completeOnboarding(selectedRole)
    } catch (error) {
      console.error("Onboarding failed:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <img src="/logo.jpeg" alt="PEDA" className="h-16 w-auto rounded-xl shadow-lg" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Welcome to PEDA
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-lg mx-auto"
          >
            To personalize your experience, please tell us how you'll be using the platform.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Student Role Card */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className={`p-8 cursor-pointer transition-all border-2 group relative overflow-hidden h-full ${
                selectedRole === "STUDENT" 
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                  : "border-border hover:border-primary/50 hover:bg-white"
              }`}
              onClick={() => setSelectedRole("STUDENT")}
            >
              {selectedRole === "STUDENT" && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="space-y-6">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-colors ${
                  selectedRole === "STUDENT" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary"
                }`}>
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">I'm a Student</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Access courses, practice with the AI Voice Coach, and track your learning progress.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary/60" /> Interactive AI Lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary/60" /> Real-time Voice Feedback
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>

          {/* Teacher Role Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className={`p-8 cursor-pointer transition-all border-2 group relative overflow-hidden h-full ${
                selectedRole === "TEACHER" 
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                  : "border-border hover:border-primary/50 hover:bg-white"
              }`}
              onClick={() => setSelectedRole("TEACHER")}
            >
              {selectedRole === "TEACHER" && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="space-y-6">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-colors ${
                  selectedRole === "TEACHER" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary"
                }`}>
                  <UserCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">I'm a Teacher</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Create courses, manage classrooms, and review AI-powered student assessments.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary/60" /> Course Creation Tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary/60" /> Student Analytics
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-4 pt-8"
        >
          <Button 
            size="lg" 
            disabled={!selectedRole || isSubmitting}
            onClick={handleComplete}
            className="h-14 px-12 rounded-2xl font-bold text-lg shadow-xl shadow-primary/25 gap-2 transition-all hover:scale-105 active:scale-95"
          >
            {isSubmitting ? "Setting up your portal..." : "Get Started"}
            {!isSubmitting && <ArrowRight className="h-5 w-5" />}
          </Button>
          <p className="text-sm text-slate-400">
            You can always contact an administrator if you need to change your role later.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
