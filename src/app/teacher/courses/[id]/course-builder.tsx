"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, Video, FileText, HelpCircle, Save, Settings, Layers, Trash2, Sparkles, Pencil } from "lucide-react"
import { AIAssistButton } from "@/components/ai/ai-assist-button"
import { saveSyllabus } from "@/app/actions/course-builder"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { Input } from "@/components/ui/input"
import { generateCourseOutline } from "@/app/actions/ai-generator"
import { toast } from "sonner"

type Lesson = { id: string; title: string; type: "VIDEO" | "TEXT" | "QUIZ" }
type Module = { id: string; title: string; lessons: Lesson[] }

interface CourseBuilderProps {
  courseId: string
  initialTitle: string
  initialModules: any[]
}

export function CourseBuilderClient({ courseId, initialTitle, initialModules }: CourseBuilderProps) {
  const [modules, setModules] = useState<Module[]>(
    initialModules.length > 0 
      ? initialModules.map(m => ({
          id: m.id,
          title: m.title,
          lessons: m.lessons.map((l: any) => ({ id: l.id, title: l.title, type: l.contentType }))
        }))
      : [{ id: "temp-mod-1", title: "Module 1: Introduction", lessons: [] }]
  )

  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAIArchitect = async () => {
    setIsGenerating(true)
    try {
      const result = await generateCourseOutline({ topic: initialTitle, level: "High School" })
      if (result.success && result.data?.modules) {
        setModules(result.data.modules.map((m: any) => ({
          id: `ai-mod-${Math.random()}`,
          title: m.title,
          lessons: m.lessons.map((l: any) => ({
            id: `ai-les-${Math.random()}`,
            title: l.title,
            type: l.type
          }))
        })))
        toast.success("AI has architected your course syllabus! Review and save.")
      }
    } catch (e) {
      toast.error("AI Generation failed")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSyllabus({
        courseId, 
        modules: modules.map((mod, index) => ({
          id: mod.id,
          title: mod.title,
          order: index + 1,
          lessons: mod.lessons.map((lesson, lIndex) => ({
            id: lesson.id,
            title: lesson.title,
            contentType: lesson.type,
            order: lIndex + 1
          }))
        }))
      })
      if (result.success) {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } else {
        setSaveStatus("error")
      }
    })
  }

  const addModule = () => {
    setModules([...modules, { id: `temp-mod-${Date.now()}`, title: `Module ${modules.length + 1}`, lessons: [] }])
  }

  const updateModuleTitle = (moduleId: string, title: string) => {
    setModules(modules.map(mod => mod.id === moduleId ? { ...mod, title } : mod))
  }

  const addLesson = (moduleId: string, type: "VIDEO" | "TEXT" | "QUIZ") => {
    setModules(modules.map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          lessons: [...mod.lessons, { id: `temp-les-${Date.now()}`, title: `New ${type.toLowerCase()} lesson`, type }]
        }
      }
      return mod
    }))
  }

  const updateLessonTitle = (moduleId: string, lessonId: string, title: string) => {
    setModules(modules.map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          lessons: mod.lessons.map(l => l.id === lessonId ? { ...l, title } : l)
        }
      }
      return mod
    }))
  }

  const confirmRemoveModule = () => {
    if (moduleToDelete) {
      setModules(modules.filter(m => m.id !== moduleToDelete))
      setModuleToDelete(null)
    }
  }

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(mod => {
      if (mod.id === moduleId) {
        return { ...mod, lessons: mod.lessons.filter(l => l.id !== lessonId) }
      }
      return mod
    }))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-foreground">{initialTitle}</h1>
          <p className="text-muted-foreground text-sm font-medium">Interactive Syllabus Builder</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 gap-2"
            onClick={handleAIArchitect}
            disabled={isGenerating || isPending}
          >
            <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? "Architecting..." : "AI Architect"}
          </Button>
          <Button variant="outline" className="rounded-xl border-border hover:bg-accent hover:text-accent-foreground">
            <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
            Settings
          </Button>
          <Button 
            className="rounded-xl shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90" 
            onClick={handleSave}
            disabled={isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "Saving..." : saveStatus === "saved" ? "Saved!" : saveStatus === "error" ? "Error!" : "Save Syllabus"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {modules.map((mod, index) => (
          <Card key={mod.id} className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between bg-secondary/50 pb-4 border-b border-border">
              <div className="flex items-center gap-3 flex-1">
                <div className="cursor-move p-2 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors">
                  <GripVertical className="h-5 w-5" />
                </div>
                <Input 
                  value={mod.title} 
                  onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
                  className="bg-transparent border-none font-bold text-lg focus-visible:ring-1 focus-visible:ring-primary h-auto py-1 px-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <AIAssistButton mode="lesson" context={`Module: ${mod.title}`} />
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setModuleToDelete(mod.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {mod.lessons.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-xl bg-secondary/30">
                  <Layers className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">This module is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mod.lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 pl-4 bg-card border border-border rounded-xl shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="cursor-move text-muted-foreground/50 group-hover:text-primary transition-colors">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <div className={`p-2 rounded-lg ${
                          lesson.type === 'VIDEO' ? 'bg-blue-100 text-blue-600' :
                          lesson.type === 'TEXT' ? 'bg-orange-100 text-orange-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {lesson.type === 'VIDEO' && <Video className="h-4 w-4" />}
                          {lesson.type === 'TEXT' && <FileText className="h-4 w-4" />}
                          {lesson.type === 'QUIZ' && <HelpCircle className="h-4 w-4" />}
                        </div>
                        <Input 
                          value={lesson.title} 
                          onChange={(e) => updateLessonTitle(mod.id, lesson.id, e.target.value)}
                          className="bg-transparent border-none font-semibold text-sm focus-visible:ring-1 focus-visible:ring-primary h-auto py-0.5 px-2 flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <AIAssistButton mode="content" context={`Lesson: ${lesson.title} (${lesson.type})`} />
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all" onClick={() => removeLesson(mod.id, lesson.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-border mt-4">
                <Button variant="outline" size="sm" className="text-xs bg-secondary border-border hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/20" onClick={() => addLesson(mod.id, "VIDEO")}>
                  <Video className="h-3 w-3 mr-1.5" /> Video
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-secondary border-border hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/20" onClick={() => addLesson(mod.id, "TEXT")}>
                  <FileText className="h-3 w-3 mr-1.5" /> Text
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-secondary border-border hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/20" onClick={() => addLesson(mod.id, "QUIZ")}>
                  <HelpCircle className="h-3 w-3 mr-1.5" /> Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button 
          variant="outline" 
          className="w-full py-8 border-2 border-dashed border-border bg-secondary/50 hover:bg-secondary hover:border-primary/50 hover:text-primary transition-all text-muted-foreground font-bold"
          onClick={addModule}
        >
          <Plus className="h-5 w-5 mr-2" /> Add New Module
        </Button>
      </div>

      <DeleteConfirmDialog 
        open={!!moduleToDelete}
        onOpenChange={(open) => !open && setModuleToDelete(null)}
        onConfirm={confirmRemoveModule}
        title="Remove Module?"
        description="This will remove the module from the syllabus. Changes will be permanent after you click 'Save Syllabus'."
      />
    </div>
  )
}
