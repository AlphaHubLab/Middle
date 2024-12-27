import DangerZoneSetting from "~components/options/danger-zone-setting"
import GeneralSetting from "~components/options/general-setting"
import IdentitySection from "~components/options/identity-setting"
import DraftProvider from "~contexts/draft-context"
import PersistProvider from "~contexts/persisting-context"
import SettingProvider from "~contexts/setting-context"

export default function OptionMain({ isDev = false }) {
  return (
    <DraftProvider>
      <PersistProvider isDev={isDev}>
        <SettingProvider isDev={isDev}>
          <div className="w-full max-w-[650px] mx-auto p-4">
            <GeneralSetting />
            <IdentitySection />
            <DangerZoneSetting />
          </div>
        </SettingProvider>
      </PersistProvider>
    </DraftProvider>
  )
}
