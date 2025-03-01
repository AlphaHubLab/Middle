import type { ReactNode } from "react"

import AuthProvider from "./auth-provider"
import FetchProvider from "./fetch-provider"
import SessionProvider from "./session-provider"

export default function CloudProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SessionProvider>{children}</SessionProvider>
    </AuthProvider>
  )
}
