import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, Share2, Calendar, BookOpen, CheckCircle } from "lucide-react"

import { getStudentCertificatesData } from "@/app/actions/certificates"

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

export default async function StudentCertificatesPage() {
  const { certificates, inProgress, badges } = await getStudentCertificatesData()

  return (
    <AppShell role="STUDENT">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground">Your achievements and credentials</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{badges.filter(b => b.earned).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgress.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Certificates</h2>
          {certificates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {certificates.map((cert) => (
                <Card key={cert.id} className="overflow-hidden group hover:border-yellow-500/50 hover:-translate-y-1 transition-all cursor-pointer relative bg-gradient-to-br from-card to-card hover:shadow-lg hover:shadow-yellow-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-yellow-500/10 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                        <Award className="h-8 w-8 text-yellow-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-xs bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-3 py-1 rounded-full shadow-sm">Active</span>
                    </div>
                    <CardTitle className="group-hover:text-yellow-600 transition-colors">{cert.course.title}</CardTitle>
                    <CardDescription>Issued by {cert.course.organizationId || "PEDA Academy"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(cert.issuedAt)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-primary/10 text-primary font-medium px-3 py-1 rounded-full">
                        {cert.course.title}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="flex-1 rounded-full shadow-sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No certificates yet</p>
                <p className="text-sm text-muted-foreground">Complete courses to earn certificates</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Badges</h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {badges.map((badge) => (
              <Card key={badge.id} className={`group relative overflow-hidden transition-all duration-500 ${badge.earned ? "hover:-translate-y-2 hover:shadow-xl hover:shadow-yellow-500/20 border-yellow-500/20" : "opacity-60 grayscale hover:grayscale-0"}`}>
                {badge.earned && <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none" />}
                <CardContent className="p-5 text-center relative z-10">
                  <div className={`h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-3 transition-transform duration-500 ${
                    badge.earned ? "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-inner group-hover:scale-110 group-hover:rotate-12" : "bg-secondary"
                  }`}>
                    <Award className={`h-8 w-8 ${badge.earned ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <p className={`font-bold text-sm ${badge.earned ? "text-yellow-700 dark:text-yellow-500" : ""}`}>{badge.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{badge.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Courses In Progress</h2>
          <div className="space-y-3">
            {inProgress.map((course) => (
              <Card key={course.id} className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <p className="font-bold">{course.title}</p>
                        <p className="text-xs font-medium text-primary">
                          {course.progress}% complete
                        </p>
                      </div>
                    </div>
                    <Button variant="default" size="sm" className="rounded-full shadow-sm">Continue</Button>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-1000"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
