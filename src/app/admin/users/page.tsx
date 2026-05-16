import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Search, Plus, MoreVertical } from "lucide-react"
import { getAllUsers } from "@/app/actions/admin"
import { SafeDate } from "@/components/ui/safe-date"

export const dynamic = "force-dynamic"

const roleColors: Record<string, string> = {
  ADMIN: "bg-primary/10 text-primary border-primary/20",
  TEACHER: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  STUDENT: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

const statusColors: Record<string, string> = {
  ACTIVE: "text-emerald-500 font-bold",
  INACTIVE: "text-muted-foreground",
  SUSPENDED: "text-rose-500 font-bold",
}

export default async function AdminUsersPage() {
  const { users } = await getAllUsers()
  const teachers = users.filter(u => u.role === "TEACHER")
  const students = users.filter(u => u.role === "STUDENT")

  return (
    <AppShell role="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">User Management</h1>
            <p className="text-muted-foreground font-medium">Control platform access and oversee educator-student relations.</p>
          </div>
          <Button className="rounded-xl shadow-lg hover:shadow-primary/20 transition-all gap-2">
            <Plus className="h-4 w-4" />
            Add New User
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none bg-gradient-to-br from-card to-secondary/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{users.length}</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-gradient-to-br from-card to-indigo-500/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-indigo-500">{teachers.length}</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-gradient-to-br from-card to-emerald-500/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-500">{students.length}</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-gradient-to-br from-card to-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">
                {users.filter(u => u.status === "ACTIVE").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 pb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Filter users..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-secondary/30 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="rounded-lg">Export CSV</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-4 p-2 text-sm font-medium text-muted-foreground border-b border-border mb-2">
                <div className="col-span-2">User</div>
                <div>Role</div>
                <div>Status</div>
                <div className="text-right">Joined</div>
              </div>
              {users.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No users found.</div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="grid grid-cols-5 gap-4 p-3 rounded-lg border border-border items-center hover:bg-accent/50 transition-colors">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate text-sm">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate font-mono">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-tighter ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${statusColors[user.status]}`}>{user.status}</span>
                    </div>
                    <div className="text-sm text-muted-foreground text-right flex items-center justify-end gap-2">
                      <SafeDate date={user.createdAt} />
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}