import ButtonFull from "~components/ui/buttons/full-w-buttons"
import { Section } from "~components/ui/typograrphy"
import SessionProvider, { useSession } from "~providers/session-provider"

import Dashboard from "./dashboard"

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
      <div className="w-full max-w-[650px] mx-auto p-4">
        {!session && (
          <Section title="Log in">
            <div className="h-[500px]">
              <div className="h-1/2 flex flex-col justify-center">
                <h2 className="w-full text-center font-medium text-xl">
                  Log in to your cloud space
                </h2>
                <p className="text-black/50 w-full text-center">
                  Manage your backups, share task with the world, and more!
                </p>
              </div>
              <div className="h-1/2 flex flex-col justify-end">
                <ButtonFull
                  variant="primary"
                  onClick={() =>
                    chrome.windows.create({
                      url: `http://localhost:3000/auth?id=${chrome.runtime.id}`,
                      type: "popup",
                      width: 400,
                      height: 600
                    })
                  }>
                  Sign in with ethereum
                </ButtonFull>
              </div>
            </div>
          </Section>
        )}
        {session && <Dashboard />}
      </div>
    </div>
  )
}
