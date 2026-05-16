"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Settings, User, Bell, Shield, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemePicker } from "@/components/theme-picker"

export default function SettingsPage() {
  const { t } = useLanguage()

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("settings")}</h1>
          <p className="text-muted-foreground">Manage your account preferences and application settings</p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Profile Settings</CardTitle>
              </div>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid gap-2">
                 <label className="text-sm font-medium">Display Name</label>
                 <Skeleton className="h-10 w-full rounded-md" />
               </div>
               <div className="grid gap-2">
                 <label className="text-sm font-medium">Email Address</label>
                 <Skeleton className="h-10 w-full rounded-md" />
               </div>
               <Button disabled>Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 border-b">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Appearance & Theme</CardTitle>
              </div>
              <CardDescription>Customize the look and feel of the platform using the VoxEval Design System</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ThemePicker />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded ${className}`} />
}