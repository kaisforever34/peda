"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hash, Loader2, PartyPopper } from "lucide-react"
import { joinClassroomByCode } from "@/app/actions/viral"
import { toast } from "sonner"
import { useLanguage } from "@/components/language-provider"

export function JoinClassDialog() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState("")
  const [success, setSuccess] = useState<any>(null)

  const handleJoin = async () => {
    if (!code || code.length < 6) {
      toast.error("Please enter a valid 6-character code")
      return
    }

    setLoading(true)
    try {
      const result = await joinClassroomByCode({ joinCode: code })
      if (result.success) {
        setSuccess(result.data)
        toast.success(`Welcome to ${result.data?.classroomTitle}!`)
      } else {
        toast.error(result.error || "Failed to join class")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setSuccess(null)
    setCode("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
          <Hash className="h-4 w-4" />
          Join with Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        {success ? (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="h-10 w-10" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-center">Success!</DialogTitle>
              <DialogDescription className="text-center text-lg font-medium text-foreground">
                You've successfully joined <strong>{success.classroomTitle}</strong>.
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              We've automatically enrolled you in {success.courseCount} classroom courses.
            </p>
            <DialogFooter className="sm:justify-center pt-4">
              <Button onClick={handleClose} className="px-12 rounded-xl font-bold">Awesome</Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Join a Classroom</DialogTitle>
              <DialogDescription className="font-medium">
                Enter the 6-character code provided by your teacher to instantly join their class and access all materials.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Class Code
                </Label>
                <Input
                  id="code"
                  placeholder="E.G. DZ-A7C"
                  className="h-14 text-center text-2xl font-black tracking-[0.5em] rounded-2xl uppercase border-2 focus-visible:ring-primary/20"
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleJoin} 
                disabled={loading || code.length < 6}
                className="w-full h-12 rounded-xl font-bold text-lg shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Joining...</>
                ) : (
                  "Join Class"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
