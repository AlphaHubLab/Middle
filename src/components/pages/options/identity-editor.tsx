import { useEffect, useState, type ChangeEvent } from "react"
import { HexColorPicker } from "react-colorful"

import Input from "~components/ui/input"
import Label from "~components/ui/label"
import type { IIdentity } from "~lib/types"
import { useSetting } from "~providers/setting-provider"

export default function IdentityEditor({
  initialIdentity,
  onClose,
  editorMode
}: {
  initialIdentity: IIdentity
  onClose: () => void
  editorMode: "new" | "edit"
}) {
  const [identity, setIdentity] = useState<IIdentity>(initialIdentity)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [duplicate, setDuplicate] = useState(false)

  const { setting, setSetting } = useSetting()

  useEffect(() => setDuplicate(false), [initialIdentity])

  useEffect(() => setIdentity(initialIdentity), [initialIdentity])

  const onChangeItem = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    property: "key" | "value"
  ) => {
    const items = [...identity.items]
    items[index][property] = e.target.value
    setIdentity((prev) => ({ ...prev, items }))
  }

  const removeItem = (e: any) => {
    const items = [...identity.items]
    const _items = items.toSpliced(Number(e.target.name), 1)
    setIdentity((prev) => ({ ...prev, items: _items }))
  }

  const saveIdentity = () => {
    if (editorMode === "new") {
      let duplicate = (setting.identities as IIdentity[]).find(
        (idn) => idn.label.toLowerCase() === identity.label.toLowerCase()
      )

      if (duplicate) return setDuplicate(true)
    }

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
    <div className="w-full px-2 pb-2 bg-inherit">
      <div className="sticky top-0 py-4 flex text-xs gap-2">
        <button
          className="px-2 py-1 bg-fetch-primary hover:bg-violet-700 text-white rounded-lg"
          onClick={saveIdentity}>
          Save
        </button>
        <button
          className="px-2 py-1 border hover:border-rose-500 text-rose-500 hover:text-rose-300 rounded-lg"
          onClick={onClose}>
          Discard
        </button>
      </div>

      {/* label and color */}
      <div id="label-color" className="py-6">
        {/* hidden modal */}
        {showColorPicker && (
          <div
            onClick={() => setShowColorPicker(false)}
            className="w-full z-10 h-full top-0 left-0 fixed"></div>
        )}
        <h2 className="font-bold text-sm text-zinc-700 border-b-[1px]">
          Name & Color
        </h2>

        <div className="flex gap-2 w-full mt-2">
          {/* label */}
          <div className="w-full">
            <Label className={`${duplicate && "text-rose-500"}`}>Label</Label>
            <Input
              className={`${duplicate && "outline-2 outline-rose-200 bg-rose-200/50 border-rose-200 text-rose-600"}`}
              placeholder="ex: Yield Farming"
              value={identity.label}
              onChange={(e) => {
                setDuplicate(false)
                setIdentity((prev) => ({ ...prev, label: e.target.value }))
              }}
            />
          </div>
          {/* color */}
          <div className="w-full">
            <Label>Color</Label>
            <div className="w-full relative flex items-center gap-2 h-8 justify-around ">
              <button
                onClick={() => setShowColorPicker(true)}
                className="text-sm border w-full h-full bg-slate-200 hover:bg-slate-50 cursor-pointer rounded-md ">
                Pick
              </button>

              {showColorPicker && (
                <div className="absolute top-10 right-0 z-10">
                  <HexColorPicker
                    color={identity.color}
                    onChange={(c) =>
                      setIdentity((prev) => ({ ...prev, color: c }))
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-end">
            <div className="p-1 border rounded-md">
              <div
                style={{ backgroundColor: identity.color }}
                className="w-10 h-6 rounded-sm"></div>
            </div>
          </div>
        </div>
        {duplicate && (
          <p className="text-rose-600 text-xs">
            An identity with label "{identity.label}" existed.
          </p>
        )}
      </div>
      <div>
        <div id="items" className="py-6">
          <div className="sticky top-12 bg-slate-100">
            <h2 className="font-bold text-sm text-zinc-700">Identity items</h2>
            <p className="text-xs text-zinc-500 mb-2 border-b-[1px]">
              Identity items (wallets, socials, etc...)
            </p>
            <div className="py-4 flex items-center w-full">
              <button
                className="text-sm border rounded-md w-full py-1 bg-slate-200 hover:bg-slate-50"
                onClick={() =>
                  setIdentity((prev) => ({
                    ...prev,
                    items: [...prev.items, { key: "", value: "" }]
                  }))
                }>
                +Add
              </button>
            </div>
          </div>
          {identity.items.map((item, i) => (
            <div key={`identity-item-${i}`} className="flex w-full py-1 gap-2">
              <div className="w-full">
                <Label>Name</Label>
                <Input
                  onChange={(e) => onChangeItem(e, i, "key")}
                  className="border"
                  value={item.key}
                />
              </div>
              <div className="w-full">
                <Label>Value</Label>
                <Input
                  onChange={(e) => onChangeItem(e, i, "value")}
                  className="border"
                  value={item.value}
                />
              </div>
              <div className="flex items-end">
                <button
                  className="w-12 text-rose-500 hover:text-rose-300 text-xs"
                  name={i.toString()}
                  onClick={removeItem}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
