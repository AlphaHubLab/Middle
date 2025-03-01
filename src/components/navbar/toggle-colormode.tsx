import { useSetting } from "~contexts/setting-context"

export default function ToggleTheme() {
  const { setSetting } = useSetting()

  return (
    <button
      onClick={() =>
        setSetting((prev) => ({ ...prev, darkMode: !prev.darkMode }))
      }>
      Toggle
    </button>
  )
}
