import IdentitySection from "~components/options/identity"
import SettingProvider from "~contexts/setting-context"

export default function OptionMain() {
  return (
    <div>
      <SettingProvider isDev={true}>
        <IdentitySection />
      </SettingProvider>
    </div>
  )
}
