import { createContext, use, useContext, useEffect } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { mockIdentities } from "~mock/mock-identities"

interface ISettingContext {
  setting: Record<string, any>
  setSetting: any // anys for now
  settingLoading: boolean
}

const SettingContext = createContext({} as ISettingContext)

export default function SettingProvider({ isDev, children }) {
  const defaultSetting = {
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
    (v) => (!v ? defaultSetting : v)
  )

  const context = {
    setting,
    setSetting,
    settingLoading
  }

  //   useEffect(() => {
  //     if (isDev && setting.identities.length === 0) {
  //       setSetting({ identities: mockIdentities })
  //     }
  //   }, [setting])

  useEffect(() => console.log(setting), [setting])

  return (
    <SettingContext.Provider value={context}>
      {children}
    </SettingContext.Provider>
  )
}

export const useSettingContext = () => useContext(SettingContext)
