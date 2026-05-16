"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, RefreshCw, Brain, Zap, X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { computeVoiceScores } from "@/lib/voice-scoring"

function WordHeatmap({ wordFeedback }: { wordFeedback: { word: string; score: number }[] }) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
      {wordFeedback.map((wf, i) => (
        <span 
          key={i} 
          className={cn(
            "px-2 py-0.5 rounded text-sm font-bold",
            wf.score > 85 ? "text-emerald-400" :
            wf.score > 60 ? "text-amber-400" :
            "text-rose-400"
          )}
        >
          {wf.word}
        </span>
      ))}
    </div>
  )
}

const LANGUAGES = [
  { 
    id: 'en-US', 
    code: 'en',
    label: 'English', 
    flag: '🇺🇸', 
    fillers: ['um', 'uh', 'like', 'well', 'ah'],
    commonWords: ['the', 'and', 'with', 'have', 'that', 'this', 'hello', 'world'],
    script: 'latin'
  },
  { 
    id: 'fr-FR', 
    code: 'fr',
    label: 'Français', 
    flag: '🇫🇷', 
    fillers: ['euh', 'genre', 'alors', 'enfin'],
    commonWords: ['les', 'une', 'est', 'dans', 'pour', 'avec', 'bonjour'],
    script: 'latin'
  },
  { 
    id: 'ar-SA', 
    code: 'ar',
    label: 'العربية', 
    flag: '🇸🇦', 
    fillers: ['يعني', 'اممم', 'طيب'],
    commonWords: ['من', 'في', 'على', 'ان', 'هذا', 'السلام'],
    script: 'arabic'
  },
]

export function GuestVoiceCoach({ onClose }: { onClose?: () => void }) {
  const { language: globalLang } = useLanguage()
  const [isRecording, setIsRecording] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [timer, setTimer] = useState(0)
  const [selectedLang, setSelectedLang] = useState(LANGUAGES.find(l => l.code === globalLang) || LANGUAGES[0])
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<any>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const transcriptRef = useRef("")

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setIsRecording(true)
      setTimer(0)
      setTranscript("")
      setInterimTranscript("")
      setResults(null)
      transcriptRef.current = ""

      timerIntervalRef.current = setInterval(() => setTimer(t => t + 1), 1000)

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = selectedLang.id
        
        recognition.onresult = (event: any) => {
          let interim = ""
          let final = ""
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) final += event.results[i][0].transcript
            else interim += event.results[i][0].transcript
          }
          if (final) {
            setTranscript(prev => prev + final + " ")
            transcriptRef.current += final + " "
          }
          setInterimTranscript(interim)
        }
        recognitionRef.current = recognition
        recognition.start()
      }

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      visualize()
    } catch (err) {
      toast.error("Mic access failed")
    }
  }

  const visualize = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    
    const draw = () => {
      if (!isRecordingRef.current) return
      animationFrameRef.current = requestAnimationFrame(draw)
      const bufferLength = analyserRef.current!.frequencyBinCount
      const freqData = new Uint8Array(bufferLength)
      analyserRef.current!.getByteFrequencyData(freqData)
      
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
      const bars = 30
      const barWidth = (canvasRef.current!.width / bars) - 2
      for (let i = 0; i < bars; i++) {
        const barHeight = (freqData[i * 2] / 255) * canvasRef.current!.height
        ctx.fillStyle = '#6c63ff'
        ctx.fillRect(i * (barWidth + 2), canvasRef.current!.height - barHeight, barWidth, barHeight)
      }
    }
    draw()
  }, [])

  const isRecordingRef = useRef(isRecording)
  useEffect(() => { isRecordingRef.current = isRecording }, [isRecording])

  const stopRecording = () => {
    setIsRecording(false)
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    if (recognitionRef.current) recognitionRef.current.stop()
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())

    setAnalyzing(true)

    const fullText = transcriptRef.current.trim().toLowerCase()
    const spokenWords = fullText.split(/\s+/).filter(w => w.length > 0)
    const wordsCount = spokenWords.length
    const durationMins = Math.max(timer / 60, 0.1)
    const wpm = Math.round(wordsCount / durationMins)

    const fillerRegex = new RegExp(`\\b(${selectedLang.fillers.join('|')})\\b`, 'gi')
    const fillersCount = (fullText.match(fillerRegex) || []).length

    const hasArabicChars = /[\u0600-\u06FF]/.test(fullText)
    const languageMismatch = (selectedLang.script === 'arabic' && !hasArabicChars) ||
                             (selectedLang.script === 'latin' && hasArabicChars)

    setTimeout(() => {
      const voiceResults = computeVoiceScores({
        transcript: fullText,
        selectedLanguage: selectedLang.label,
        languageMismatch,
        fillers: fillersCount,
        wpm,
        durationMs: timer * 1000,
      })

      const avgScore = Math.round(
        (voiceResults.scores.clarity + voiceResults.scores.pace +
         voiceResults.scores.accuracy + voiceResults.scores.phonetics) / 4
      )

      const finalResults = {
        score: avgScore,
        feedback: voiceResults.aiAdvise,
        wordFeedback: voiceResults.wordFeedback,
        transcript: transcriptRef.current,
        language: selectedLang.code,
        timestamp: new Date().toISOString()
      }

      setAnalyzing(false)
      setResults(finalResults)

      try {
        localStorage.setItem("peda_pending_voice_session", JSON.stringify(finalResults))
      } catch (e) {
        console.error("Failed to save guest session", e)
      }
    }, 1500)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden border-none shadow-2xl bg-slate-950 text-white">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Coach Demo
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white/50 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {!results && !analyzing ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center gap-4">
              {LANGUAGES.map(l => (
                <button 
                  key={l.id}
                  onClick={() => setSelectedLang(l)}
                  className={`px-4 py-2 rounded-xl border transition-all ${selectedLang.id === l.id ? "bg-primary border-primary" : "border-white/10 hover:bg-white/5"}`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
            
            <div className="h-32 flex items-center justify-center">
              <canvas ref={canvasRef} width={400} height={100} className="w-full h-full opacity-50" />
            </div>

            <div className="space-y-4">
              {isRecording ? (
                <div className="space-y-4">
                  <p className="text-primary font-mono text-xl">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
                  <p className="text-white/60 italic">"{interimTranscript || transcript || "Listening..."}"</p>
                  <Button variant="destructive" size="lg" className="rounded-full px-12" onClick={stopRecording}>
                    Stop & Analyze
                  </Button>
                </div>
              ) : (
                <Button size="lg" className="rounded-full px-12 h-16 text-lg font-bold" onClick={startRecording}>
                  <Mic className="mr-2 h-6 w-6" /> Start Speaking
                </Button>
              )}
            </div>
          </div>
        ) : analyzing ? (
          <div className="py-12 text-center space-y-4">
            <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto" />
            <p className="text-xl font-bold animate-pulse">AI is processing your voice...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-black text-primary mb-2">{results.score}%</div>
                <div className="text-xs uppercase font-bold text-white/40 tracking-widest">Fluency Score</div>
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold uppercase">AI Feedback</span>
              </div>
              <p className="text-lg leading-relaxed">{results.feedback}</p>
            </div>
            {results.wordFeedback && results.wordFeedback.length > 0 && (
              <WordHeatmap wordFeedback={results.wordFeedback} />
            )}
            <div className="pt-4 flex flex-col gap-3">
              <Button size="lg" className="w-full rounded-2xl h-14 font-bold text-lg" onClick={() => window.location.href = "/register"}>
                Get Your Full Report
              </Button>
              <Button variant="ghost" className="w-full text-white/50" onClick={() => setResults(null)}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
