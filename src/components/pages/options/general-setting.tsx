import { useSetting } from "~providers/setting-context"

import { P, Section, SubSection } from "~components/ui/typograrphy"

export default function GeneralSetting() {
  const { setting, setSetting } = useSetting()

  const setGeneralSetting = (e) => {
    setSetting({ ...setting, [e.target.name]: e.target.value })
  }

  return (
    <Section title="Time Zones">
      <SubSection>
        <h2 className="font-medium text-sm text-fetch-primary/90">
          Editor Time Zone
        </h2>
        <P>
          The time zone you prefer when creating or editing a note or task. You
          can always choose a different time zone directly in the editor.
        </P>
        <select
          name="editorTimeZone"
          className="text-sm outline-none border-b-[1px] rounded-xl w-44 h-10 px-2 text-black/70"
          value={setting.editorTimeZone}
          onChange={setGeneralSetting}>
          <option value="local">Local</option>
          <option value="utc">UTC/GMT</option>
          <option value="est">EST</option>
          <option value="cst">CST</option>
          <option value="mst">MST</option>
          <option value="pst">PST</option>
          <option value="utc+08">WST</option>
        </select>
      </SubSection>
      <SubSection>
        <h2 className="font-medium text-sm text-fetch-primary/90">
          Working Time Zone
        </h2>
        <P>
          The time zone you prefer when viewing a note or task. You can change
          this setting at any time.
        </P>
        <select
          name="preferredTimeZone"
          className="text-sm outline-none border-b-[1px] rounded-xl w-44 h-10 px-2 text-black/70"
          value={setting.preferredTimeZone}
          onChange={setGeneralSetting}>
          <option value="local">Local</option>
          <option value="utc">UTC/GMT</option>
          <option value="est">EST</option>
          <option value="cst">CST</option>
          <option value="mst">MST</option>
          <option value="pst">PST</option>
          <option value="utc+08">WST</option>
        </select>
      </SubSection>
    </Section>
  )
}
