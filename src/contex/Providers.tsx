"use client"

import { ToastProvider } from '@/components/ui/UseToast'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <SessionProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </SessionProvider>
    </div>
  )
}

export default Providers
