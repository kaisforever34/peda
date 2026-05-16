import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, MessageSquare, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 pb-20">
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <Link href="/">
          <Button variant="ghost" className="mb-12 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Button>
        </Link>
        
        <div className="grid gap-16 md:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Get in touch</h1>
              <p className="text-muted-foreground text-lg">
                Have questions about PEDA? Our team in Algiers is ready to assist you in Arabic, French, or English.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "contact@peda.dz" },
                { icon: MessageSquare, label: "Support", value: "Available 24/7" },
                { icon: MapPin, label: "Office", value: "Hydra, Algiers, Algeria" }
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border group hover:border-primary/50 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
             <form action={async (formData: FormData) => { "use server"; /* Logic to send email would go here */ }} className="space-y-6 relative z-10">
                <div className="grid gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">First Name</label>
                       <Input name="firstName" required placeholder="Ahmed" className="rounded-xl h-12" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">Last Name</label>
                       <Input name="lastName" required placeholder="Slimani" className="rounded-xl h-12" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold ml-1">Email Address</label>
                    <Input type="email" name="email" required placeholder="ahmed@email.dz" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold ml-1">Message</label>
                    <Textarea name="message" required placeholder="How can we help you today?" className="rounded-xl min-h-[150px] resize-none" />
                </div>
                 <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold gap-2 shadow-lg shadow-primary/25">
                   Send Message <Send className="h-5 w-5" />
                </Button>
             </form>
          </div>
        </div>
      </div>
    </div>
  )
}
