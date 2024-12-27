import Label from "~components/ui/label"
import { P, Section } from "~components/ui/text"
import { useSettingContext } from "~contexts/setting-context"

export default function GeneralSetting() {
  const { setting, setSetting } = useSettingContext()

  const setGeneralSetting = (e) => {
    setSetting({ ...setting, [e.target.name]: e.target.value })
  }

  return (
    <Section title="General">
      <div className="mb-10">
        <h2 className="font-bold text-sm pt-2 text-zinc-800">
          Editor Time Zone
        </h2>
        <P>
          The time zone you preferred when creating/editing a note or task. You
          can always select other options on the editor.
        </P>
        <select
          name="editorTimeZone"
          className="text-sm outline-none border-b-[1px]"
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
      </div>
      <div className="mb-10">
        <h2 className="font-bold pt2-2 text-sm text-zinc-800">
          Working Time Zone
        </h2>
        <P>
          The time zone you preferred when viewing a note or task. You can
          always change this option.
        </P>
        <select
          name="preferredTimeZone"
          className="text-sm outline-none border-b-[1px]"
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
      </div>
    </Section>
  )
}
