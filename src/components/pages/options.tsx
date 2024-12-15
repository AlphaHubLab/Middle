import { useState } from "react"
import { HexColorPicker } from "react-colorful"

export default function OptionMain() {
  return (
    <div>
      <AddIdentity />
    </div>
  )
}

interface IIdentity {
  label: string
  color: string
  items: {
    key: string
    value: string
  }[]
}

const AddIdentity = () => {
  const [identity, setIdentity] = useState<IIdentity>({
    label: "",
    color: "#000000",
    items: [
      {
        key: "Wallet",
        value: ""
      },
      {
        key: "e-mail",
        value: ""
      }
    ]
  })

  return (
    <div className={"w-full"}>
      <pre>{JSON.stringify(identity)}</pre>
      <div className="flex gap-2 w-full">
        <div className="basis-1/2">
          <label>Label</label>
          <input
            placeholder="F(ound) something..."
            value={identity.label}
            onChange={(e) => {
              setIdentity((prev) => ({ ...prev, label: e.target.value }))
            }}
            className="border appearence-none leading-tight p-1 w-full outline-none"
          />
        </div>
        <div className="basis-1/2">
          <label>Color</label>
          <HexColorPicker
            color={identity.color}
            onChange={(c) => setIdentity((prev) => ({ ...prev, color: c }))}
          />
        </div>
      </div>
      <div>
        {identity.items.map((item, i) => (
          <div key={`identity-item-${i}`} className="flex gap-2">
            <input className="border" value={item.key} />
            <input className="border" value={item.value} />
          </div>
        ))}
      </div>
      <button onClick={() => identity.items.push({ key: "", value: "" })}>
        + add
      </button>
    </div>
  )
}
