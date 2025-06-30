"use client"

import { AuthProvider } from "@/lib/auth-context"
import { SidebarProvider } from "@/lib/sidebar-context"
import { ClientLayout } from "@/components/client-layout"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <ClientLayout>
          {children}
        </ClientLayout>
      </SidebarProvider>
    </AuthProvider>
  )
} 