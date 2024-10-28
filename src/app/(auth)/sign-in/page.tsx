'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
     <div>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
     </div>
    )
  }
  return (
     <div>
      Not signed in <br />
      <button className="bg-orange-400 m-3 py-2 px-4 " onClick={() => signIn()}>Sign in</button>
     </div>
  )
}