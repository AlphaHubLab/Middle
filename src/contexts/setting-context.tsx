import { createContext, useContext, useEffect } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { defaultSetting } from "~fetch.config"
import { mockIdentities } from "~mock/mock-identities"

interface ISettingContext {
  setting: Record<string, any>
  setSetting: any // anys for now
  settingLoading: boolean
}

const SettingContext = createContext<ISettingContext>(null)

export default function SettingProvider({ isDev, children }) {
  const ds = {
    ...defaultSetting,
    identities: isDev ? mockIdentities : []
  }

  const [
    setting,
    setSetting,
    { isLoading: settingLoading, remove: resetSetting }
  ] = useStorage(
    {
      key: "fetch-setting",
      instance: new Storage({
        area: "local"
      })
    },
    (v) => (!v ? ds : v)
  )

  const context = {
    setting,
    setSetting,
    settingLoading
  }

  useEffect(() => {
    if (!setting) return
    if (setting.darkMode) document.body.classList.add("dark")
    if (!setting.darkMode) document.body.classList.remove("dark")
  }, [setting.darkMode])

  //   useEffect(() => {
  //     if (isDev && setting.identities.length === 0) {
  //       setSetting({ identities: mockIdentities })
  //     }
  //   }, [setting])

  return (
    <SettingContext.Provider value={context}>
      {children}
    </SettingContext.Provider>
  )
}

export const useSetting = () => useContext(SettingContext)
