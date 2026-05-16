import type { Metadata } from "next"
import "./globals.css"
import { Outfit } from "next/font/google"

const outfit = Outfit({ subsets: ["latin"] })
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { NotificationProvider } from "@/components/notification-provider"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "PEDA - AI Learning Platform",
  description: "Student + Teacher AI Learning Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} min-h-full flex flex-col`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="arctic"
          enableSystem={false}
          themes={['light', 'dark', 'obsidian', 'arctic', 'terra', 'signal']}
          disableTransitionOnChange
        >
          <LanguageProvider>
            <NotificationProvider>
              {children}
              <Toaster position="top-right" richColors />
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
