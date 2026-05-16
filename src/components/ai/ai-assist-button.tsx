"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Brain, 
  PenTool, 
  BarChart, 
  FileText, 
  Plus, 
  Lightbulb,
  X,
  RefreshCw,
  Copy,
  Check,
  Layers
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export type AIMode = "lesson" | "grading" | "content" | "admin" | "syllabus"

interface AIAssistButtonProps {
  mode: AIMode
  context?: string
  onAction?: (result: string) => void
  className?: string
}

const MODE_CONFIG = {
  lesson: {
    label: "AI Lesson Planner",
    description: "Generate creative activities and pedagogical objectives.",
    icon: Lightbulb,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    prompt: "Suggest 3 creative activities and learning objectives for this module.",
    placeholder: "Based on the official Algerian curriculum, here are some suggested activities..."
  },
  grading: {
    label: "AI Grading Helper",
    description: "Summarize performance trends and generate feedback.",
    icon: BarChart,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    prompt: "Analyze these results and generate personalized comments.",
    placeholder: "Analyzing submission data... Most students struggled with pronunciation of 'th' sounds."
  },
  content: {
    label: "AI Content Creator",
    description: "Simplify text, generate quizzes, or adapt reading levels.",
    icon: PenTool,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    prompt: "Simplify this text and generate 5 quiz questions.",
    placeholder: "Generating quiz questions... \n1. What is the main idea of the passage?"
  },
  admin: {
    label: "AI Admin Assistant",
    description: "Automate scheduling and report drafting.",
    icon: FileText,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    prompt: "Draft a weekly progress report for this class.",
    placeholder: "Drafting report... Class 3AS Math 1 showed 15% improvement in participation this week."
  },
  syllabus: {
    label: "AI Course Architect",
    description: "Generate a complete multi-module syllabus based on your course title.",
    icon: Layers,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    prompt: "Generate a structured 2-module syllabus for this topic.",
    placeholder: "Analyzing curriculum standards... Generating structured modules and lessons."
  }
}

export function AIAssistButton({ mode, context, onAction, className }: AIAssistButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)

  const config = MODE_CONFIG[mode]
  const Icon = config.icon

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 2000))
    setResult(config.placeholder + "\n\n[AI analysis complete based on context: " + (context || "current section") + "]")
    setIsGenerating(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`rounded-full h-8 px-3 text-[11px] font-bold uppercase tracking-wider gap-2 shadow-sm transition-all hover:shadow-md ${config.bgColor} ${config.borderColor} ${config.color} ${className}`}
      >
        <Sparkles className="h-3 w-3" />
        AI Assist
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <div className={`p-8 ${config.bgColor} border-b ${config.borderColor}`}>
            <DialogHeader>
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner ${config.bgColor} border ${config.borderColor}`}>
                  <Icon className={`h-6 w-6 ${config.color}`} />
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className={`h-4 w-4 ${config.color} animate-pulse`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.color}`}>Context Aware IA</span>
                </div>
              </div>
              <DialogTitle className="text-2xl font-black text-foreground tracking-tight">
                {config.label}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                {config.description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 bg-card space-y-6">
            {!result && !isGenerating ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border italic text-sm text-muted-foreground">
                  "{config.prompt}"
                </div>
                <Button 
                  onClick={handleGenerate} 
                  className={`w-full h-12 rounded-2xl font-bold gap-2 shadow-lg transition-all active:scale-95 ${config.bgColor.replace('/10', '')} text-white hover:opacity-90`}
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate AI Insights
                </Button>
              </div>
            ) : isGenerating ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <RefreshCw className={`h-12 w-12 ${config.color} animate-spin`} />
                  <Brain className={`absolute inset-0 m-auto h-5 w-5 ${config.color}`} />
                </div>
                <p className="font-bold text-foreground animate-pulse tracking-wide">Processing contextual data...</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-5 rounded-3xl bg-secondary border border-border text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {result}
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-2xl font-bold gap-2"
                    onClick={() => {
                      setResult("")
                      handleGenerate()
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button 
                    className={`flex-1 h-12 rounded-2xl font-bold gap-2 ${config.bgColor.replace('/10', '')} text-white hover:opacity-90`}
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Use Result"}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-secondary/30 border-t border-border flex justify-center">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Powered by PEDA Linguistic Engine</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
