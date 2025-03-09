import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react"

import { FETCH_API } from "~fetch.config"

interface ISession {
  address: `0x${string}`
  chainId: number
}

interface ISessionContext {
  session: ISession | null
  getSession: () => void
  signOut: () => void
  error: string
  isPending: boolean
}

const Session = createContext<ISessionContext>(null)

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSesion] = useState<ISession>(null)
  const [error, setError] = useState("")
  const [isPending, setPending] = useState(false)

  const getSession = async () => {
    setPending(true)

    try {
      const res = await fetch(`${FETCH_API}/auth/session`, {
        method: "GET",
        credentials: "include"
      })

      if (res.ok) {
        const json = await res.json()
        setSesion(json)
      } else {
        setSesion(null)
      }
    } catch (err) {
      setError("Something happened, We are working hard to fix it.")
    }
    setPending(false)
  }

  const signOut = async () => {
    setPending(true)

    try {
      const res = await fetch(`${FETCH_API}/auth/signout`, {
        method: "GET",
        credentials: "include"
      })

      if (res.ok) setSesion(null)
      else setError("Something happened, We are working hard to fix it.")
    } catch (err) {
      setError("Something happened, We are working hard to fix it.")
    }

    setPending(false)
  }

  useEffect(() => {
    ;(async () => await getSession())()
  }, [])

  const context = { session, getSession, signOut, isPending, error }

  return <Session.Provider value={context}>{children}</Session.Provider>
}

export const useSession = () => useContext(Session)
