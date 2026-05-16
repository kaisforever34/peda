"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
type ThemeId = "obsidian" | "arctic" | "terra" | "signal"

interface CustomTheme {
  id: ThemeId
  name: string
  tone: string
  emoji: string
  best: string
  bg: string
  surface: string
  border: string
  accent: string
  accent2: string
  text: string
  muted: string
  pill: string
  pillText: string
  scores: [number, number, number]
  fontDisplay: string
}

// ─── Theme Definitions ────────────────────────────────────────────────────────
const THEMES: CustomTheme[] = [
  {
    id: "obsidian",
    name: "Obsidian Pulse",
    tone: "Premium Dark",
    emoji: "🌑",
    best: "University & certification",
    bg: "#0a0a0f",
    surface: "#12121f",
    border: "#1e1e35",
    accent: "#6c63ff",
    accent2: "#ff6584",
    text: "#f0f0ff",
    muted: "#8585a8",
    pill: "#6c63ff22",
    pillText: "#9d98ff",
    scores: [82, 74, 91],
    fontDisplay: "Syne",
  },
  {
    id: "arctic",
    name: "Arctic Clarity",
    tone: "Light Editorial",
    emoji: "❄️",
    best: "K-12 & friendly UX",
    bg: "#f0f4ff",
    surface: "#ffffff",
    border: "#dce5f7",
    accent: "#2563eb",
    accent2: "#0ea5e9",
    text: "#0f1b35",
    muted: "#6b7fa3",
    pill: "#dbeafe",
    pillText: "#1d4ed8",
    scores: [78, 88, 65],
    fontDisplay: "Playfair Display",
  },
  {
    id: "terra",
    name: "Terra Studio",
    tone: "Warm Organic",
    emoji: "🍂",
    best: "Adult learning & tutoring",
    bg: "#fdf6ee",
    surface: "#fefaf5",
    border: "#e8d9c5",
    accent: "#c05621",
    accent2: "#805ad5",
    text: "#2d1a0e",
    muted: "#8c6b50",
    pill: "#fde8d8",
    pillText: "#9a3412",
    scores: [90, 68, 80],
    fontDisplay: "Fraunces",
  },
  {
    id: "signal",
    name: "Signal Green",
    tone: "Gamified Dark",
    emoji: "🟢",
    best: "Competitive exam prep",
    bg: "#040d0a",
    surface: "#081a12",
    border: "#0d2e1c",
    accent: "#00ff88",
    accent2: "#00cfff",
    text: "#e8fff4",
    muted: "#4d9975",
    pill: "#00ff8822",
    pillText: "#00ff88",
    scores: [95, 83, 77],
    fontDisplay: "Space Grotesk",
  },
]

// ─── Waveform ─────────────────────────────────────────────────────────────────
const BARS = [3, 6, 10, 14, 10, 16, 8, 12, 6, 14, 10, 6, 3]

function Waveform({ color, active }: { color: string; active: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 20 }}>
      {BARS.map((h, i) => (
        <div
          key={i}
          style={{
            width: 2.5,
            height: h,
            borderRadius: 2,
            background: color,
            opacity: active ? 0.9 : 0.35,
            animationName: active ? "wv" : "none",
            animationDuration: active ? `${0.45 + i * 0.06}s` : "0s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationDelay: `${i * 0.04}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, color, bg, text }: {
  label: string; value: number; color: string; bg: string; text: string;
}) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 8, color: text, opacity: 0.55 }}>{label}</span>
        <span style={{ fontSize: 8, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 3, borderRadius: 4, background: bg, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", borderRadius: 4, background: color, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  )
}

// ─── Theme Card ───────────────────────────────────────────────────────────────
function ThemeCard({ t, selected, onSelect }: { t: CustomTheme; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: t.bg,
        border: `2px solid ${selected ? t.accent : t.border}`,
        borderRadius: 20,
        padding: 18,
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: selected ? "translateY(-4px)" : "translateY(0)",
        boxShadow: selected ? `0 12px 40px ${t.accent}33` : "0 2px 8px rgba(0,0,0,0.08)",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 18, marginBottom: 4 }}>{t.emoji}</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: t.text, fontFamily: `'${t.fontDisplay}', serif`, lineHeight: 1.2 }}>
            {t.name}
          </div>
          <div style={{ fontSize: 10, color: t.muted, marginTop: 2 }}>{t.tone}</div>
        </div>
        <div style={{
          fontSize: 9, fontWeight: 700, padding: "4px 9px", borderRadius: 99,
          background: selected ? t.accent : t.pill,
          color: selected ? "#fff" : t.pillText,
          letterSpacing: 0.5, textTransform: "uppercase",
          transition: "all 0.25s", whiteSpace: "nowrap",
        }}>
          {selected ? "✓ Active" : "Preview"}
        </div>
      </div>

      {/* Mini Dashboard */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: t.text }}>Oral Exam #4</span>
          <div style={{
            width: 24, height: 24, borderRadius: 6, fontSize: 11,
            background: t.accent + "22", border: `1px solid ${t.accent}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>🎙</div>
        </div>
        <div style={{
          background: t.bg, borderRadius: 8, padding: "6px 10px",
          marginBottom: 9, display: "flex", alignItems: "center", gap: 8,
        }}>
          <Waveform color={t.accent} active={selected} />
          <span style={{ fontSize: 9, color: t.muted }}>{selected ? "● Listening…" : "Idle"}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ScoreBar label="Fluency"  value={t.scores[0]} color={t.accent}  bg={t.border} text={t.text} />
          <ScoreBar label="Accuracy" value={t.scores[1]} color={t.accent2} bg={t.border} text={t.text} />
          <ScoreBar label="Vocab"    value={t.scores[2]} color={t.accent}  bg={t.border} text={t.text} />
        </div>
      </div>

      {/* Color chips */}
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {[t.bg, t.surface, t.accent, t.accent2].map((c) => (
          <div key={c} style={{
            width: 18, height: 18, borderRadius: 5,
            background: c, border: `1px solid ${t.border}`, flexShrink: 0,
          }} />
        ))}
        <span style={{ fontSize: 9, color: t.muted, marginLeft: 3, fontFamily: "monospace" }}>{t.accent}</span>
      </div>

      {/* Best for */}
      <div style={{
        background: t.pill, borderRadius: 8, padding: "5px 10px",
        fontSize: 10, color: t.pillText, fontWeight: 600,
      }}>
        Best for: {t.best}
      </div>
    </div>
  )
}

export function ThemePicker() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Use arctic as default if current theme is not in our custom list
  const activeId = THEMES.some(t => t.id === theme) ? theme as ThemeId : "arctic"
  const active = THEMES.find((t) => t.id === activeId)!

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Playfair+Display:wght@700&family=Fraunces:opsz,wght@9..144,700&family=Space+Grotesk:wght@700&family=DM+Sans:wght@400;500;600;800&display=swap');
        @keyframes wv { from { transform: scaleY(0.4); } to { transform: scaleY(1.5); } }
      `}</style>

      <div className="py-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-block", fontSize: 9, fontWeight: 700, letterSpacing: 3,
            color: active.accent, textTransform: "uppercase",
            border: `1px solid ${active.accent}44`, padding: "4px 14px", borderRadius: 99, marginBottom: 12,
          }}>
            VoxEval · Design System
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: 800, color: "var(--foreground)", letterSpacing: -1,
          }}>
            Choose Your Theme
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 6 }}>
            Click any card · waveform animates on the active theme
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18,
          maxWidth: 1080,
          margin: "0 auto 28px",
        }}>
          {THEMES.map((t) => (
            <ThemeCard
              key={t.id}
              t={t}
              selected={activeId === t.id}
              onSelect={() => setTheme(t.id)}
            />
          ))}
        </div>

        <div style={{
          maxWidth: 1080, margin: "0 auto",
          background: active.surface,
          border: `1px solid ${active.accent}44`,
          borderRadius: 16, padding: "16px 22px",
          display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center",
          boxShadow: `0 0 0 1px ${active.accent}22`,
          transition: "border-color 0.4s, box-shadow 0.4s",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: active.accent + "22", border: `1px solid ${active.accent}55`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>
            {active.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontWeight: 800, color: active.text, fontFamily: "'Syne', sans-serif", fontSize: 15 }}>
              {active.name}
            </div>
            <div style={{ fontSize: 12, color: active.muted, marginTop: 2 }}>
              {active.tone} · Best for {active.best}
            </div>
          </div>
          {(["accent", "accent2", "bg", "surface"] as const).map((key) => (
            <div key={key} style={{ textAlign: "center" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: active[key], border: "1px solid #ffffff18",
                margin: "0 auto 4px",
              }} />
              <div style={{ fontSize: 9, color: active.muted, fontFamily: "monospace" }}>{active[key]}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
