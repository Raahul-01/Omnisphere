"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/src/lib/auth-context"
import { SidebarProvider } from "@/src/lib/sidebar-context"
import { ClientLayout } from "@/components/client-layout"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SidebarProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 