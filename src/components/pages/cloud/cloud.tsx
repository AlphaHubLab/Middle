import SessionProvider, { useSession } from "~providers/session-provider"

import Dashboard from "./dashboard"
import SignIn from "./sign-in"

export default function Cloud() {
  return (
    <SessionProvider>
      <DashboardWithSession />
    </SessionProvider>
  )
}

const DashboardWithSession = () => {
  const { session } = useSession()

  return (
    <div className="bg-slate-100 min-h-screen">
      {!session ? (
        <div className="w-full max-w-[650px] mx-auto p-4">
          <SignIn />
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  )
}
