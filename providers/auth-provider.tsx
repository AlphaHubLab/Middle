import { createContext, useContext, type ReactNode } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

interface IAuthContext {
  jwt: string
  setJwt: (args: string | ((prev: string) => void)) => Promise<void>
}

const Auth = createContext<IAuthContext>(null)

export default function AuthProvider({ children }: { children: ReactNode}) {
  const [jwt, setJwt] = useStorage(
    {
      key: "fetch-jwt",
      instance: new Storage({
        area: "local"
      })
    },
    (v: string) => (!v ? "" : v)
  )
  const context = { jwt, setJwt }

  return <Auth.Provider value={context}>{children}</Auth.Provider>
}

export const useAuth = () => useContext(Auth)
