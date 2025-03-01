import DangerZoneSetting from "~components/options/danger-zone-setting"
import GeneralSetting from "~components/options/general-setting"
import IdentitySection from "~components/options/identity-setting"
import FetchProvider from "~contexts/fetch-provider"

export default function OptionMain({ isDev = false }) {
  return (
    <FetchProvider isDev={isDev}>
      <div className="bg-slate-100">
        <div className="w-full max-w-[650px] mx-auto p-2">
          <GeneralSetting />
          <IdentitySection />
          <DangerZoneSetting />
        </div>
      </div>
    </FetchProvider>
  )
}
