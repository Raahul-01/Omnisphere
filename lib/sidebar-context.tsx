"use client";

import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  isLeftSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleLeftSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
  const closeSidebar = () => setIsOpen(false);

  const value = {
    isOpen,
    isLeftSidebarOpen,
    toggleSidebar,
    toggleLeftSidebar,
    closeSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}