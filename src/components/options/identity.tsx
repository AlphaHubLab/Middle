import { useState } from "react"
import { HexColorPicker } from "react-colorful"

import Input from "~components/ui/input"
import Label from "~components/ui/label"
import ButtonFetch from "~components/ui/button-fetch"
import { useSettingContext } from "~contexts/setting-context"
import type { IIdentity } from "~lib/types"

const createNewIdentity = (identities: IIdentity[]) => {
  const id =
    identities.length === 0
      ? 0
      : Math.max(...identities.map((identity) => identity.id)) + 1

  return {
    id,
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
  }
}

export default function IdentitySection() {
  const { setting } = useSettingContext()

  const { identities } = setting

  const [showIdEditor, setShowIdEditor] = useState(false)
  const [initialIdentity, setInitialIdenetity] = useState(
    createNewIdentity(identities)
  )

  const openEditor = (initValue: IIdentity) => {
    setShowIdEditor(true)
    setInitialIdenetity(initValue)
  }

  return (
    <div>
      <h1 className="border-b pt-2 pb-4 text-inc-700">Identities</h1>
      <p className="pt-2 pb-4 text-zinc-600">
        Creating a well managed Identities let you track your acitivies more
        precisrly, assign one or more wallets, socials, etc. to a task to track.
        ATTENTION: Don't store password, key phrases, private keys or other
        sensetive data in this section!
      </p>
      <div className="flex">
        {!showIdEditor && (
          <ButtonFetch
            variant="primary"
            onClick={() => openEditor(createNewIdentity(identities))}>
            + Add new Identity
          </ButtonFetch>
        )}
      </div>
      {showIdEditor && (
        <IdentityEditor
          initialIdentity={initialIdentity}
          onClose={() => setShowIdEditor(false)}
        />
      )}
      {identities.length === 0 && (
        <div className="text-sm text-zinc-400">No Identity added yet.</div>
      )}
      {identities.length > 0 && (
        <div>
          {identities.map((id, i) => (
            <div className="flex" key={`loaded-identity-${i}`}>
              <p className="flex-auto">{id.label}</p>
              <p
                className="w-10 h-auto"
                style={{ backgroundColor: id.color }}></p>
              <button onClick={() => openEditor(id)}>edit</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const IdentityEditor = ({ initialIdentity, onClose }) => {
  const [identity, setIdentity] = useState<IIdentity>(initialIdentity)

  const { setSetting } = useSettingContext()

  const onChangeItem = (e, index: number, property: "key" | "value") => {
    const items = [...identity.items]
    items[index][property] = e.target.value
    setIdentity((prev) => ({ ...prev, items }))
  }

  const removeItem = (e) => {
    const items = [...identity.items]
    const _items = items.toSpliced(Number(e.target.name), 1)
    setIdentity((prev) => ({ ...prev, items: _items }))
  }

  const saveIdentity = () => {
    setSetting((prev: Record<string, any>) => {
      const identities = structuredClone(prev.identities)

      let found = identities.find((_identity) => _identity.id === identity.id)

      if (!found) {
        return { ...prev, identities: [...identities, identity] }
      }

      Object.keys(found).forEach((key) => (found[key] = identity[key]))
      return { ...prev, identities }
    })

    onClose()
  }

  return (
    <div className="w-full">
      <div className="flex">
        <ButtonFetch variant="primary" onClick={saveIdentity}>
          Save
        </ButtonFetch>
        <ButtonFetch variant="primary" onClick={onClose}>
          Discard
        </ButtonFetch>
      </div>
      <div className="flex gap-2 w-full">
        <div className="basis-1/2">
          <Label>Label</Label>
          <Input
            placeholder="F(ound) something..."
            value={identity.label}
            onChange={(e) => {
              setIdentity((prev) => ({ ...prev, label: e.target.value }))
            }}
          />
        </div>
        <div className="basis-1/2">
          <Label>Color</Label>
          <HexColorPicker
            color={identity.color}
            onChange={(c) => setIdentity((prev) => ({ ...prev, color: c }))}
          />
        </div>
      </div>
      <div>
        <div>
          <h2>Idenity items (wallets, socials, etc...)</h2>
          {identity.items.map((item, i) => (
            <div key={`identity-item-${i}`} className="flex gap-2">
              <div>
                <Label>Name</Label>
                <Input
                  onChange={(e) => onChangeItem(e, i, "key")}
                  className="border"
                  value={item.key}
                />
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  onChange={(e) => onChangeItem(e, i, "value")}
                  className="border"
                  value={item.value}
                />
              </div>
              <button name={i.toString()} onClick={removeItem}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() =>
          setIdentity((prev) => ({
            ...prev,
            items: [...prev.items, { key: "", value: "" }]
          }))
        }>
        + add
      </button>
    </div>
  )
}
