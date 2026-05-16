import { Suspense } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { SophisticatedVoiceCoach } from "@/components/voice/voice-assistant"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Star, History, AlertCircle } from "lucide-react"

// Create a wrapper for searchParams access in Client Components
function VoiceCoachContent({ searchParams }: { searchParams: { examId?: string, subject?: string } }) {
  const isExamMode = !!searchParams.examId

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            {isExamMode ? "Voice Examination" : "Adaptive Voice Coach"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {isExamMode 
              ? "This is a teacher-assigned assessment. Record your presentation to be graded by the AI." 
              : "Our advanced AI ecosystem monitors your pronunciation, rhythm, and clarity in real-time."}
          </p>
        </div>
        
        {!isExamMode && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-primary fill-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Skill Level</p>
              <p className="text-sm font-bold">Advanced Speaker</p>
            </div>
          </div>
        )}
      </div>

      {isExamMode && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="py-4">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              Graded Assignment: {searchParams.subject && decodeURIComponent(searchParams.subject)}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Core Component */}
      <SophisticatedVoiceCoach 
        examId={searchParams.examId} 
        initialSubject={searchParams.subject ? decodeURIComponent(searchParams.subject) : undefined} 
      />

      {!isExamMode && (
        <div className="grid gap-6 md:grid-cols-3">
           <Card className="md:col-span-1 border-none bg-indigo-50/50">
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <History className="h-5 w-5 text-indigo-600" />
                 Recent Sessions
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white border border-indigo-100 shadow-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-bold">27 Apr 2026</p>
                      <p className="text-[10px] text-muted-foreground">Self Introduction</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-600">88%</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Score</p>
                    </div>
                  </div>
                ))}
             </CardContent>
           </Card>

           <Card className="md:col-span-2 border-none ring-1 ring-border shadow-sm overflow-hidden">
             <div className="h-1 bg-primary" />
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Your AI Learning Roadmap
                </CardTitle>
                <CardDescription>How the AI evaluates your progress over time</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Diction</span>
                      <span className="text-primary">92%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-primary" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Grammar</span>
                      <span className="text-primary">78%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-primary" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Vocabulary</span>
                      <span className="text-primary">64%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-primary" style={{ width: '64%' }} />
                    </div>
                  </div>
                </div>
             </CardContent>
           </Card>
        </div>
      )}
    </div>
  )
}

export default async function StudentVoiceCoachPage({ searchParams }: { searchParams: Promise<{ examId?: string, subject?: string }> }) {
  const params = await searchParams
  return (
    <AppShell role="STUDENT">
      <Suspense fallback={<div>Loading AI Engine...</div>}>
        <VoiceCoachContent searchParams={params} />
      </Suspense>
    </AppShell>
  )
}
