"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, Loader2 } from "lucide-react"
import { getTeacherNotes, addTeacherNote } from "@/app/actions/teacher-notes"
import { SafeDate } from "@/components/ui/safe-date"

export function TeacherNotesDialog({ studentId, studentName }: { studentId: string, studentName: string }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState("")

  useEffect(() => {
    if (open) {
      setLoading(true)
      getTeacherNotes(studentId)
        .then(setNotes)
        .finally(() => setLoading(false))
    }
  }, [open, studentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    
    setLoading(true)
    const newNote = await addTeacherNote(studentId, content)
    setNotes([newNote, ...notes])
    setContent("")
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
          <FileText className="h-4 w-4 mr-2" />
          Private Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Private Notes: {studentName}</DialogTitle>
          <DialogDescription>
            These notes are only visible to you. Use them to track student progress or struggles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Textarea 
            placeholder="Add a new observation..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            className="resize-none"
          />
          <Button type="submit" disabled={loading || !content.trim()} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Save Note
          </Button>
        </form>

        <div className="mt-6 space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {loading && notes.length === 0 ? (
            <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : notes.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-4 border-2 border-dashed rounded-lg">No notes yet.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg text-sm">
                <p className="text-slate-700">{note.content}</p>
                <p className="text-[10px] text-muted-foreground mt-2 font-medium">
                  <SafeDate date={note.createdAt} />
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
