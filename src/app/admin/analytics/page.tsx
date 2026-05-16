import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, FileText, BarChart3, TrendingUp, Clock, Award, Mic } from "lucide-react"

const stats = {
  totalUsers: 1250,
  activeUsers: 890,
  totalCourses: 45,
  totalExams: 120,
  submissions: 3400,
  voiceSessions: 560,
}

const monthlyData = [
  { month: "Jan", users: 450, completions: 120 },
  { month: "Feb", users: 520, completions: 180 },
  { month: "Mar", users: 610, completions: 240 },
  { month: "Apr", users: 720, completions: 310 },
  { month: "May", users: 850, completions: 380 },
  { month: "Jun", users: 940, completions: 450 },
]

const topCourses = [
  { id: "1", name: "Python for Data Science", students: 320, completion: 78 },
  { id: "2", name: "Introduction to ML", students: 280, completion: 65 },
  { id: "3", name: "Data Science Fundamentals", students: 250, completion: 72 },
  { id: "4", name: "Deep Learning", students: 180, completion: 58 },
  { id: "5", name: "AI Ethics", students: 150, completion: 82 },
]

const recentActivity = [
  { id: "1", type: "enrollment", user: "Emma Wilson", item: "Python for Data Science", time: "2 min ago" },
  { id: "2", type: "submission", user: "James Lee", item: "ML Quiz #3", time: "5 min ago" },
  { id: "3", type: "completion", user: "Mike Chen", item: "Introduction to ML", time: "15 min ago" },
  { id: "4", type: "voice", user: "Sarah Johnson", item: "Voice Session", time: "30 min ago" },
  { id: "5", type: "certificate", user: "Lisa Brown", item: "Python Certificate", time: "1 hour ago" },
]

export default function AdminAnalyticsPage() {
  return (
    <AppShell role="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Platform Analytics</h1>
            <p className="text-muted-foreground font-medium">Real-time insights into educator performance and student growth.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl font-bold">
              <Clock className="h-4 w-4 mr-2" /> Last 30 Days
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none bg-gradient-to-br from-card to-secondary/30 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Users className="h-16 w-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{stats.totalUsers.toLocaleString()}</div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 w-fit px-1.5 py-0.5 rounded">
                <TrendingUp className="h-3 w-3" />
                +12.5%
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none bg-gradient-to-br from-card to-indigo-500/5 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <BookOpen className="h-16 w-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-indigo-500">{stats.totalCourses}</div>
              <p className="mt-1 text-[10px] font-bold text-muted-foreground">5 New Modules Created</p>
            </CardContent>
          </Card>

          <Card className="border-none bg-gradient-to-br from-card to-purple-500/5 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Mic className="h-16 w-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">AI Voice Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-purple-500">{stats.voiceSessions}</div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 w-fit px-1.5 py-0.5 rounded">
                <TrendingUp className="h-3 w-3" />
                +24.1%
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-gradient-to-br from-card to-emerald-500/5 shadow-sm overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Award className="h-16 w-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-500">182</div>
              <p className="mt-1 text-[10px] font-bold text-muted-foreground">89% Satisfaction Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black">User Growth</CardTitle>
              <CardDescription className="text-xs font-medium">Monthly registration trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-muted-foreground">{data.month}</span>
                      <span>{data.users} users</span>
                    </div>
                    <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                        style={{ width: `${(data.users / 1000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black">Success Metrics</CardTitle>
              <CardDescription className="text-xs font-medium">Module completions per month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyData.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-muted-foreground">{data.month}</span>
                      <span className="text-emerald-500">{data.completions} completions</span>
                    </div>
                    <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(data.completions / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Courses</CardTitle>
              <CardDescription>By enrollment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground">{course.students} students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{course.completion}%</p>
                      <p className="text-xs text-muted-foreground">completion</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Platform activity feed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.type === "enrollment" && <Users className="h-4 w-4 text-primary" />}
                      {activity.type === "submission" && <FileText className="h-4 w-4 text-primary" />}
                      {activity.type === "completion" && <Award className="h-4 w-4 text-green-600" />}
                      {activity.type === "voice" && <Mic className="h-4 w-4 text-primary" />}
                      {activity.type === "certificate" && <Award className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.type === "enrollment" && "enrolled in"}
                        {activity.type === "submission" && "submitted"}
                        {activity.type === "completion" && "completed"}
                        {activity.type === "voice" && "completed voice session"}
                        {activity.type === "certificate" && "earned certificate for"}{" "}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}