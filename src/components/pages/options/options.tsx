import DangerZoneSetting from "~components/pages/options/danger-zone-setting"
import GeneralSetting from "~components/pages/options/general-setting"
import IdentitySection from "~components/pages/options/identity-setting"
import FetchProvider from "~providers/fetch-provider"

export default function Options({ isDev = false }) {
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
