"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Square, RefreshCw, Brain, Zap, Globe, MessageSquare, Volume2, ShieldCheck, X } from "lucide-react"

const LANGUAGES = [
  { 
    id: 'en-US', 
    code: 'en',
    label: 'English', 
    flag: '🇺🇸', 
    fillers: ['um', 'uh', 'like', 'well', 'ah', 'actually', 'basically'],
    commonWords: [
      'the', 'and', 'with', 'have', 'that', 'which', 'this', 'there', 'from', 'what', 'about', 'who', 'how', 'will', 
      'would', 'their', 'people', 'more', 'these', 'after', 'first', 'years', 'work', 'also', 'back', 'over',
      'because', 'could', 'just', 'some', 'than', 'into', 'only', 'your', 'its', 'them', 'can', 'our',
      'other', 'new', 'good', 'high', 'old', 'great', 'small', 'large', 'local', 'social', 'long', 'young'
    ],
    script: 'latin'
  },
  { 
    id: 'fr-FR', 
    code: 'fr',
    label: 'Français', 
    flag: '🇫🇷', 
    fillers: ['euh', 'genre', 'alors', 'enfin', 'voilà', 'du coup'],
    commonWords: [
      'les', 'une', 'est', 'dans', 'pour', 'avec', 'nous', 'vous', 'suis', 'était', 'pourquoi', 'plus', 'tout', 
      'parce', 'après', 'aussi', 'maison', 'temps', 'faire', 'bien', 'petit', 'premier', 'beaucoup', 'alors', 'encore',
      'c\'est', 'dans', 'elle', 'être', 'avoir', 'faire', 'mais', 'pour', 'dans', 'plus', 'votre', 'même', 'sous'
    ],
    script: 'latin'
  },
  { 
    id: 'ar-SA', 
    code: 'ar',
    label: 'العربية', 
    flag: '🇸🇦', 
    fillers: ['يعني', 'اممم', 'طيب', 'هاذا', 'عرفت', 'تمام'],
    commonWords: [
      'من', 'في', 'على', 'ان', 'هذا', 'التي', 'كان', 'مع', 'هو', 'هي', 'ما', 'يا', 'إلى', 'كل',
      'الذي', 'الذين', 'كانت', 'قد', 'بعد', 'عند', 'يوم', 'مرة', 'نفس', 'حتى', 'إذا', 'غير',
      'بين', 'خلال', 'كانوا', 'عن', 'لم', 'هذه', 'بها', 'ذلك', 'كانت', 'يكون', 'الآن', 'أمام'
    ],
    script: 'arabic'
  },
  { 
    id: 'es-ES', 
    code: 'es',
    label: 'Español', 
    flag: '🇪🇸', 
    fillers: ['eh', 'este', 'o sea', 'pues', 'entonces', 'digamos'],
    commonWords: [
      'los', 'las', 'que', 'con', 'para', 'por', 'muy', 'esta', 'como', 'pero', 'todo', 'donde', 'cuando', 
      'porque', 'después', 'también', 'casa', 'tiempo', 'decir', 'bien', 'poco', 'primero', 'mucho', 'ahora', 'durante',
      'está', 'este', 'todos', 'parte', 'sobre', 'entre', 'también', 'hasta', 'desde', 'puede', 'entre'
    ],
    script: 'latin'
  },
]

import { submitVoiceExam } from "@/app/actions/voice-submission"
import { analyzeVoiceAction } from "@/app/actions/voice-analysis"
import { useLanguage } from "@/components/language-provider"
import { VoiceResults, WordFeedback } from "@/types"
import { computeVoiceScores } from "@/lib/voice-scoring"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

function WordHeatmap({ wordFeedback }: { wordFeedback: WordFeedback[] }) {
  return (
    <div className="space-y-3">
      <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Pronunciation Heatmap</h5>
      <div className="flex flex-wrap gap-x-2 gap-y-2 p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-border shadow-inner">
        {wordFeedback.map((wf, i) => (
          <span 
            key={i} 
            className={cn(
              "px-2 py-1 rounded-lg text-sm font-bold transition-all hover:scale-110 cursor-default",
              wf.score > 85 ? "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20" :
              wf.score > 60 ? "text-amber-600 bg-amber-500/10 border border-amber-500/20" :
              "text-rose-600 bg-rose-500/10 border border-rose-500/20"
            )}
            title={`Score: ${wf.score}%`}
          >
            {wf.word}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 px-2">
         <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-bold text-muted-foreground uppercase">Perfect</span>
         </div>
         <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-[9px] font-bold text-muted-foreground uppercase">Needs Practice</span>
         </div>
         <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="text-[9px] font-bold text-muted-foreground uppercase">Critical</span>
         </div>
      </div>
    </div>
  )
}

export function SophisticatedVoiceCoach({ 
  examId, 
  initialSubject 
}: { 
  examId?: string, 
  initialSubject?: string 
}) {
  const { language: globalLang } = useLanguage()
  const [isRecording, setIsRecording] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<VoiceResults | null>(null)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [timer, setTimer] = useState(0)
  const [selectedLang, setSelectedLang] = useState(LANGUAGES.find(l => l.code === globalLang) || LANGUAGES[0])
  const [liveMismatch, setLiveMismatch] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [selfScore, setSelfScore] = useState(80)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  // Recognition Ref
  const recognitionRef = useRef<any>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Sync with Global Language on initial load
  useEffect(() => {
    const matched = LANGUAGES.find(l => l.code === globalLang)
    if (matched) setSelectedLang(matched)
  }, [globalLang])

  const transcriptRef = useRef("")

  // Sync Recognition Language
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition || !isRecording) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.lang = selectedLang.id
    
    recognition.onresult = (event: any) => {
      let interim = ""
      let final = ""
      let totalConfidence = 0
      let resultCount = 0

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i]
        const transcriptPart = result[0].transcript
        totalConfidence += result[0].confidence
        resultCount++

        if (result.isFinal) {
          final += transcriptPart + " "
        } else {
          interim += transcriptPart
        }
      }
      
      const avgConfidence = resultCount > 0 ? totalConfidence / resultCount : 1

      if (final) {
        const processedFinal = final
        setTranscript(prev => {
          const lastWords = prev.trim().split(/\s+/).slice(-3).join(" ").toLowerCase()
          const incomingWords = processedFinal.trim().toLowerCase()
          let newTranscript = prev
          if (lastWords && incomingWords.startsWith(lastWords)) {
            newTranscript = prev + processedFinal.trim().slice(lastWords.length) + " "
          } else {
            newTranscript = prev + processedFinal
          }
          transcriptRef.current = newTranscript
          return newTranscript
        })
      }
      setInterimTranscript(interim)

      // ROBUST LIVE LANGUAGE CHECK (Using Ref)
      const currentFullText = (transcriptRef.current + interim).toLowerCase()
      const words = currentFullText.split(/\s+/).filter(w => w.length > 1)
      
      if (words.length >= 3) {
        const hasArabic = /[\u0600-\u06FF]/.test(currentFullText)
        const scriptMismatch = (selectedLang.script === 'arabic' && !hasArabic) || 
                              (selectedLang.script === 'latin' && hasArabic)
        
        const commonSet = new Set(selectedLang.commonWords)
        const matches = words.filter(w => commonSet.has(w)).length
        const density = matches / words.length
        
        let mismatchDetected = scriptMismatch
        if (!mismatchDetected) {
           if (words.length > 5 && density < 0.05 && avgConfidence < 0.85) {
              mismatchDetected = true
           }
           if (selectedLang.script === 'latin' && words.length > 4) {
              const otherLangs = LANGUAGES.filter(l => l.id !== selectedLang.id && l.script === 'latin')
              otherLangs.forEach(ol => {
                const oSet = new Set(ol.commonWords)
                const oMatches = words.filter(w => oSet.has(w)).length
                const oDensity = oMatches / words.length
                if (oDensity > density + 0.25) mismatchDetected = true
              })
           }
        }
        setLiveMismatch(mismatchDetected)
      }
    }

    recognition.onerror = (err: any) => {
      console.error("Speech Recognition Error", err)
      if (err.error === 'no-speech') {
        // Handle silence
      }
    }

    recognition.onend = () => { 
      if (isRecordingRef.current) {
        try { recognition.start() } catch (e) {} 
      }
    }
    
    recognitionRef.current = recognition
    recognition.start()

    return () => {
      recognition.onend = null
      recognition.stop()
    }
  }, [selectedLang, isRecording]) // transcript removed from dependencies

  // Need a ref for isRecording to use in onend closure
  const isRecordingRef = useRef(isRecording)
  useEffect(() => { isRecordingRef.current = isRecording }, [isRecording])

  const cleanup = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setIsRecording(true)
      setTimer(0)
      setTranscript("")
      setInterimTranscript("")
      setResults(null)
      setLiveMismatch(false)

      timerIntervalRef.current = setInterval(() => setTimer(t => t + 1), 1000)
      if (recognitionRef.current) recognitionRef.current.start()

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 512 
      
      visualize()

      // MediaRecorder for server-side analysis
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
    } catch (err) {
      console.error("Mic access failed", err)
      toast.error("Could not access microphone")
    }
  }

  const visualize = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const draw = () => {
      if (!isRecording) return
      animationFrameRef.current = requestAnimationFrame(draw)
      
      const bufferLength = analyserRef.current!.frequencyBinCount
      const fftSize = analyserRef.current!.fftSize
      const freqData = new Uint8Array(bufferLength)
      const timeData = new Uint8Array(fftSize)
      
      analyserRef.current!.getByteFrequencyData(freqData)
      analyserRef.current!.getByteTimeDomainData(timeData)
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const bars = 40
      const step = Math.floor(bufferLength / bars)
      const barWidth = (canvas.width / bars) - 4
      const centerY = canvas.height / 2
      
      for (let i = 0; i < bars; i++) {
        // Average the frequencies in the step to get a smoother bar height
        let sum = 0
        for(let j = 0; j < step; j++) {
            sum += freqData[(i * step) + j]
        }
        const avg = sum / step
        const percent = avg / 255
        
        // Minimum bar height of 4px
        const barHeight = Math.max(percent * (canvas.height / 2) * 0.8, 4)
        const x = i * (canvas.width / bars) + 2
        
        // Theme accurate styling (primary color)
        ctx.fillStyle = `rgba(108, 99, 255, ${Math.max(0.3, percent)})`
        ctx.shadowBlur = percent * 15
        ctx.shadowColor = '#6c63ff'
        
        ctx.beginPath()
        ctx.roundRect(x, centerY - barHeight, barWidth, barHeight * 2, barWidth / 2)
        ctx.fill()
      }
    }
    draw()
  }, [isRecording])

  const stopRecording = () => {
    setIsRecording(false)
    cleanup()
    if (recognitionRef.current) recognitionRef.current.stop()
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('audio', audioBlob, 'recording.webm')
        formData.append('language', selectedLang.id)
        formData.append('transcript', transcriptRef.current)
        
        setAnalyzing(true)
        
        // Let the client do the heavy linguistic evaluation we wrote below
        analyzeResults()
        
        // Parallel server upload
        const res = await analyzeVoiceAction(formData)
        
        if (res.success && res.data) {
          setAudioUrl(res.data.audioUrl)
        } else {
          toast.error("Audio save failed")
        }
      }
    } else {
        analyzeResults()
    }
  }

  const analyzeResults = () => {
    setAnalyzing(true)

    const fullText = transcriptRef.current.trim().toLowerCase()
    const spokenWords = fullText.split(/\s+/).filter(w => w.length > 0)

    if (spokenWords.length === 0) {
      setAnalyzing(false)
      return
    }

    // Language validation
    const hasArabicChars = /[\u0600-\u06FF]/.test(fullText)
    const scriptMismatch = (selectedLang.script === 'arabic' && !hasArabicChars) ||
                             (selectedLang.script === 'latin' && hasArabicChars)

    const getDensity = (lang: any) => {
      const commonSet = new Set(lang.commonWords)
      const matches = spokenWords.filter(w => commonSet.has(w)).length
      return matches / spokenWords.length
    }

    const selectedDensity = getDensity(selectedLang)
    let bestMatchLang = selectedLang
    let maxDensity = selectedDensity

    LANGUAGES.forEach(lang => {
      const d = getDensity(lang)
      if (d > maxDensity) { maxDensity = d; bestMatchLang = lang }
    })

    const isActuallyOtherLang = bestMatchLang.id !== selectedLang.id && (maxDensity > selectedDensity + 0.1)
    const languageMismatch = scriptMismatch || isActuallyOtherLang

    // Raw metrics
    const wordsCount = spokenWords.length
    const durationMins = Math.max(timer / 60, 0.1)
    const wpm = Math.round(wordsCount / durationMins)
    const fillerRegex = new RegExp(`\\b(${selectedLang.fillers.join('|')})\\b`, 'gi')
    const fillersCount = (fullText.match(fillerRegex) || []).length

    setTimeout(() => {
      setAnalyzing(false)
      setResults(computeVoiceScores({
        transcript: fullText,
        subject: initialSubject?.trim().toLowerCase(),
        selectedLanguage: selectedLang.label,
        detectedLanguage: bestMatchLang.id !== selectedLang.id ? bestMatchLang.label : undefined,
        languageMismatch,
        fillers: fillersCount,
        wpm,
        durationMs: timer * 1000,
      }))
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-2xl bg-slate-950 text-white min-h-[500px]">
          <CardHeader className="border-b border-white/10 bg-white/5">
             <div className="flex items-center justify-between">
                <div className="flex gap-2">
                   {LANGUAGES.map(l => (
                     <Button 
                       key={l.id} 
                       variant={selectedLang.id === l.id ? "default" : "outline"} 
                       size="sm"
                       onClick={() => setSelectedLang(l)}
                       className={`rounded-xl transition-all ${selectedLang.id === l.id ? "bg-primary border-primary" : "border-white/10 text-white hover:bg-white/10"}`}
                     >
                       <span className="mr-2">{l.flag}</span> {l.label}
                     </Button>
                   ))}
                </div>
                <div className="flex items-center gap-4">
                  {isRecording && (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">AI Listening</span>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${liveMismatch ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-green-500/20 text-green-500"}`}>
                        <Globe className="h-3 w-3" />
                        {liveMismatch ? "Mismatch Detected" : "Language Match"}
                      </div>
                    </div>
                  )}
                  <div className="font-mono text-2xl font-bold text-primary">
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </div>
                </div>
             </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col relative h-[450px]">
             <div className="absolute inset-0 flex items-center justify-center opacity-80">
                <canvas ref={canvasRef} width={600} height={400} className="w-full h-full" />
             </div>

             <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12 text-center">
                {!isRecording && !results && !analyzing ? (
                   <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="h-24 w-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto">
                         <Mic className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold mb-2">PEDA Multilingual Coach</h2>
                        <p className="text-white/50 max-w-sm">Select your language above and start speaking for a deep data-driven analysis.</p>
                      </div>
                      <Button size="lg" onClick={startRecording} className="rounded-full px-12 h-14 text-lg font-bold shadow-xl shadow-primary/30">
                        Begin Session
                      </Button>
                   </div>
                ) : isRecording ? (
                   <div className="w-full space-y-8 animate-in fade-in duration-300">
                      <div className="space-y-2">
                        <p className="text-white/40 text-xs font-mono uppercase tracking-[0.3em]">{transcript || "Waiting for signal..."}</p>
                        <h3 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                          {interimTranscript || "Listening to your flow..."}
                        </h3>
                      </div>
                      <Button variant="destructive" size="lg" className="rounded-full px-12 h-12 font-bold" onClick={stopRecording}>
                         STOP ANALYZING
                      </Button>
                   </div>
                ) : null}
             </div>

             <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3" /> Encrypted Session • {selectedLang.id}
             </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Insights Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             {analyzing ? (
               <div className="py-24 flex flex-col items-center gap-4">
                  <div className="relative">
                    <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                    <Brain className="absolute inset-0 m-auto h-5 w-5 text-primary" />
                  </div>
                  <p className="font-bold text-foreground animate-pulse">Linguistic Processing...</p>
               </div>
             ) : results ? (
               <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-4 rounded-3xl bg-secondary border flex flex-col items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase">Phonetics</span>
                        <span className={`text-3xl font-black ${results.isGibberish ? "text-red-600" : "text-primary"}`}>{results.scores.phonetics}%</span>
                     </div>
                     <div className="p-4 rounded-3xl bg-secondary border flex flex-col items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase text-center">Subject Accuracy</span>
                        <span className={`text-3xl font-black ${results.scores.accuracy < 40 ? "text-red-500" : "text-blue-600"}`}>{results.scores.accuracy}%</span>
                     </div>
                     <div className="p-4 rounded-3xl bg-secondary border flex flex-col items-center justify-center col-span-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase text-center">Detected Emotion</span>
                        <span className="text-xl font-bold text-foreground">{results.emotion || "Neutral"}</span>
                     </div>
                  </div>
                  
                  <div className={`p-5 rounded-3xl text-white shadow-xl ${results.isGibberish ? "bg-red-600" : "bg-gradient-to-br from-primary to-indigo-600"}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-4 w-4 fill-white" />
                        <span className="text-xs font-bold uppercase">AI Evaluation Result</span>
                      </div>
                      <p className="text-sm italic leading-relaxed font-medium mb-4">"{results.aiAdvise}"</p>
                      
                      {results.nextPrompt && (
                        <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20">
                          <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">AI Follow-up Question</p>
                          <p className="text-base font-medium">"{results.nextPrompt}"</p>
                        </div>
                      )}
                  </div>

                  {results.wordFeedback && results.wordFeedback.length > 0 && (
                    <WordHeatmap wordFeedback={results.wordFeedback} />
                  )}

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Detected Fillers</h5>
                    <div className="p-4 border rounded-2xl bg-secondary text-foreground">
                       <p className="text-2xl font-bold">{results.fillers}</p>
                       <p className="text-[10px] font-bold">Linguistic deviations found</p>
                    </div>
                  </div>

                  {audioUrl && (
                    <div className="space-y-2">
                       <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Recorded Voice</h5>
                       <audio src={audioUrl} controls className="w-full h-10 rounded-xl" />
                    </div>
                  )}

                  {examId ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                        <div className="flex justify-between items-center">
                          <h5 className="text-[10px] font-black text-primary uppercase tracking-widest">Self Evaluation</h5>
                          <span className="text-sm font-bold text-primary">{selfScore}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={selfScore} 
                          onChange={(e) => setSelfScore(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-primary/10 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                        <p className="text-[10px] text-muted-foreground italic">How do you feel you performed on this task?</p>
                      </div>

                      <Button 
                        className="w-full rounded-2xl h-12 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95"
                        disabled={isSubmitting}
                        onClick={async () => {
                          setIsSubmitting(true)
                          try {
                            const res = await submitVoiceExam(examId, results, transcript, audioUrl || undefined, selfScore)
                            if (res.success) {
                              toast.success("Assessment Submitted with Self-Score!")
                              window.location.href = "/student/results"
                            } else {
                              toast.error(res.error || "Failed to submit")
                            }
                          } finally {
                            setIsSubmitting(false)
                          }
                        }}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Result to Exam"}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full rounded-2xl h-12" 
                      onClick={() => { setResults(null); setAudioUrl(null); setTranscript(""); }}
                    >
                      {results.nextPrompt ? "Reply to AI" : "Restart Session"}
                    </Button>
                  )}
               </div>
             ) : (
               <div className="space-y-6 pt-4 text-center">
                  <div className="h-24 w-24 rounded-full bg-secondary border border-dashed border-border flex items-center justify-center mx-auto">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-foreground">Multilingual Engine Standby</p>
                    <p className="text-xs text-muted-foreground">Our AI assistant is ready to analyze your voice across 4 major languages.</p>
                  </div>
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
