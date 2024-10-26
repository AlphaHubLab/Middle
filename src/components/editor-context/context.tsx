import * as React from "react"

interface IContext {
  state: { [key: string]: any }
  subscribe: (listener: (k: string | symbol, v: any) => void) => () => boolean
}

const Context = React.createContext<IContext | null>(null)

export const useStore = () => {
  const rerender = React.useState({})[1]
  const tracked = React.useRef({})
  const { state, subscribe } = React.useContext(Context)

  const proxy = React.useRef(
    new Proxy(
      {},
      {
        get(_, key: string) {
          tracked.current[key] = true
          return state[key]
        },
        set(_, key: string, value) {
          state[key] = value
          return true
        }
      }
    )
  )

  React.useEffect(() => {
    subscribe((key) => {
      if (tracked.current[key]) rerender({})
    })
  }, [])

  return proxy.current
}

export const Provider = ({ children, value = {} }) => {
  const state = React.useRef(value)
  const listeners = React.useRef<Set<(k: string | symbol, v: any) => void>>(
    new Set()
  )

  const proxy = React.useRef(
    new Proxy(
      {},
      {
        get(_, key) {
          return state.current[key]
        },
        set(_, key, value) {
          state.current[key] = value
          listeners.current.forEach((listener) => listener(key, value))
          return true
        }
      }
    )
  )

  const subscribe = (listener: (k: string | symbol, v: any) => void) => {
    listeners.current.add(listener)
    return () => listeners.current.delete(listener)
  }

  const context = React.useMemo(() => ({ state: proxy.current, subscribe }), [])
  return <Context.Provider value={context}>{children}</Context.Provider>
}

