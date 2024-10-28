'use client'
import { SessionProvider } from "next-auth/react"
import React from "react"

type AuthproviderProps = {
    children : React.ReactNode
}

export default function Authprovider({children}: AuthproviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}