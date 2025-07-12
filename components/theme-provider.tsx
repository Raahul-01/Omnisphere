"use client"

import * as React from "react"

export function ThemeProvider({ 
  children,
  ...props
}: { 
  children: React.ReactNode
  [key: string]: any
}) {
  // Simple theme provider that applies a 'dark' class to the body element
  // No dependency on next-themes
  React.useEffect(() => {
    // Set document class to dark to ensure dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return <>{children}</>;
}

