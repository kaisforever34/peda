import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

import { checkLanguageMismatch } from "@/lib/language-detection"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Mock AI analysis function
const analyzeVoiceSession = async (audioBlob: Blob, transcript: string, expectedLanguage: string) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const wordCount = transcript.split(/\s+/).filter(word => word.length > 0).length;
  
  // LANGUAGE VALIDATION LOGIC
  const { mismatch: languageMismatch, message: validationMessage } = checkLanguageMismatch(transcript, expectedLanguage);

  // Generate scores
  let clarityScore = 70 + Math.random() * 25;
  let confidenceScore = 60 + Math.random() * 30;
  let accuracyScore = 75 + Math.random() * 20;

  // Penalize heavily if mismatch detected
  if (languageMismatch) {
    clarityScore = Math.min(clarityScore, 15 + Math.random() * 10);
    confidenceScore = Math.min(confidenceScore, 20 + Math.random() * 10);
    accuracyScore = 0; // Fraudulent attempts get 0 accuracy
  }

  const wordRate = wordCount / (Math.max(10, wordCount / 3) / 60);
  const paceScore = Math.round(Math.min(100, (wordRate / 140) * 100));

  const feedback = languageMismatch 
    ? [{ type: 'negative', message: validationMessage }]
    : [
        { type: 'positive', message: clarityScore > 85 ? "Excellent clarity!" : "Good clarity." },
        { type: 'positive', message: "Good pace for learning." },
        { type: 'positive', message: "Your pronunciation is consistent." }
      ];

  const emotions = ["Confident", "Hesitant", "Enthusiastic", "Nervous", "Neutral"];
  const emotion = languageMismatch ? "Inconsistent" : emotions[Math.floor(Math.random() * emotions.length)];

  return {
    transcript,
    duration: Math.round(wordCount / 2.5),
    wordCount,
    pace: paceScore,
    clarityScore: Math.round(clarityScore),
    confidenceScore: Math.round(confidenceScore),
    accuracyScore: Math.round(accuracyScore),
    emotion,
    languageMismatch,
    feedback,
    scores: {
      pace: paceScore,
      clarity: Math.round(clarityScore),
      confidence: Math.round(confidenceScore),
      accuracy: Math.round(accuracyScore),
      overall: languageMismatch ? 5 : Math.round((clarityScore + confidenceScore + accuracyScore) / 3)
    }
  };
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as Blob | null;
    const transcript = formData.get("transcript") as string | null;
    const studentId = formData.get("studentId") as string | null;
    const promptId = formData.get("promptId") as string | null;
    const language = formData.get("language") as string || "English";
    
    if (!audio || !transcript || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields: audio, transcript, or studentId" },
        { status: 400 }
      );
    }
    
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });
    
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!currentUser || (currentUser.id !== studentId && currentUser.role !== "TEACHER" && currentUser.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Analyze with strict language validation
    const analysis = await analyzeVoiceSession(audio, transcript, language);
    
    // Save voice session to database
    const voiceSession = await prisma.voiceSession.create({
      data: {
        studentId,
        prompt: promptId || "Practice session",
        transcript,
        audioUrl: "", // Mock URL
        scores: analysis.scores,
        feedback: analysis.feedback,
        pace: analysis.pace,
        clarity: analysis.clarityScore,
        confidence: analysis.confidenceScore,
        emotion: analysis.emotion,
        duration: analysis.duration
      }
    });
    
    return NextResponse.json({
      session: voiceSession,
      analysis,
      warning: analysis.languageMismatch ? "Language mismatch detected. Scores have been penalized." : null
    }, { status: 201 });
    
  } catch (error) {
    console.error("Voice session processing error:", error);
    return NextResponse.json(
      { error: "Failed to process voice session" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    
    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!currentUser || (currentUser.id !== studentId && currentUser.role !== "TEACHER" && currentUser.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const sessions = await prisma.voiceSession.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
      take: 20
    });
    
    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}