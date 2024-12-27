import { init } from "next/dist/compiled/@vercel/og/satori"
import { useEffect, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"

import ButtonFetch from "~components/ui/button-fetch"
import * as C from "~components/ui/collapsible"
import Input from "~components/ui/input"
import Label from "~components/ui/label"
import { Note, P, Section } from "~components/ui/text"
import { useSettingContext } from "~contexts/setting-context"
import type { IIdentity } from "~lib/types"

const createNewIdentity = (identities: IIdentity[]) => {
  // New Id based on last registerrred Id
  const id =
    identities.length === 0
      ? 0
      : Math.max(...identities.map((identity) => identity.id)) + 1

  // Createing a random Hex color
  const color =
    "#" +
    Math.floor(Math.random() * 256).toString(16) +
    Math.floor(Math.random() * 256).toString(16) +
    Math.floor(Math.random() * 256).toString(16)

  return {
    id,
    label: "",
    color,
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

  const [open, setOpen] = useState(false)
  const [showIdEditor, setShowIdEditor] = useState(false)
  const [initialIdentity, setInitialIdentity] = useState(
    createNewIdentity(identities)
  )

  const openEditor = (initValue: IIdentity) => {
    setShowIdEditor(true)
    setOpen(true)
    setInitialIdentity(initValue)
  }

  const onClose = () => {
    setOpen(false)
    const timer = setTimeout(() => setShowIdEditor(false), 700)
    return () => clearTimeout(timer)
  }

  return (
    <Section title="Identities">
      <P>
        Creating a well managed Identities let you track your acitivies more
        precisely, assign one or more wallets, socials, etc. to a task to track.
      </P>
      <Note type="red">
        <b>DO NOT STORE</b> passwords, key phrases, private keys or other
        sensetive data in identity items!
      </Note>

      <div className="my-6">
        <div className="flex">
          <div className="w-full">
            <div
              style={{ height: !open ? "40px" : "440px" }}
              className={`${!showIdEditor && "cursor-pointer hover:bg-zinc-200"} w-full overflow-hidden transition-all duration-500 p-2 bg-zinc-50 border-[1px] rounded-md`}>
              <div
                className={`text-sm w-full flex items-center  ${open && "border-b-[1px]"}`}
                onClick={() =>
                  !showIdEditor && openEditor(createNewIdentity(identities))
                }>
                +Add Identity
              </div>
              {showIdEditor && (
                <div className="h-[400px] overflow-y-auto overflow-x-hidden styled-scrollbar">
                  <IdentityEditor
                    initialIdentity={initialIdentity}
                    onClose={onClose}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h2 className="font-bold text-sm border-b text-zinc-700">
          Your Identities
        </h2>
        {identities.length === 0 && (
          <div className="text-sm text-zinc-400 text-center py-2">
            No Identity added yet.
          </div>
        )}
        {identities.length === 0 && (
          <p className="text-center text-zinc-300">No identities yet</p>
        )}
        {identities.length > 0 && (
          <div className="mt-2">
            {identities.map((identity) => (
              <div
                className="flex w-full items-center"
                key={`loaded-identity-${identity.id}`}>
                <div className="flex w-full">
                  <div
                    style={{ color: identity.color }}
                    className="w-4 text-xs flex items-center h-6">
                    <p>ID</p>
                  </div>
                  <div className="w-full">
                    <IdentityPreview identity={identity} />
                  </div>
                  <div className="flex gap-2 h-6 items-center text-xs pl-2">
                    <button
                      className="text-blue-500 hover:text-blue-300"
                      onClick={() => openEditor(identity)}>
                      Edit
                    </button>
                    <button
                      className="text-rose-500 hover:text-rose-300"
                      onClick={() => openEditor(identity)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}

const IdentityEditor = ({ initialIdentity, onClose }) => {
  const [identity, setIdentity] = useState<IIdentity>(initialIdentity)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [duplicate, setDuplicate] = useState(false)

  const { setting, setSetting } = useSettingContext()

  useEffect(() => setIdentity(initialIdentity), [initialIdentity])

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
    let duplicate = (setting.identities as IIdentity[]).find(
      (idn) => idn.label.toLowerCase() === identity.label.toLowerCase()
    )

    if (duplicate) return setDuplicate(true)

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
    <div className="w-full p-2">
      <div className="flex">
        <ButtonFetch
          variant="primary"
          className="text-sm"
          onClick={saveIdentity}>
          Save
        </ButtonFetch>
        <ButtonFetch variant="primary" className="text-sm" onClick={onClose}>
          Discard
        </ButtonFetch>
      </div>

      {/* label and color */}
      <div id="label-color" className="py-6">
        {/* hidden modal */}
        {showColorPicker && (
          <div
            onClick={() => setShowColorPicker(false)}
            className="w-full h-full top-0 left-0 fixed"></div>
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
                className="text-sm border w-full h-full hover:bg-zinc-100 cursor-pointer rounded-md ">
                Pick
              </button>

              {showColorPicker && (
                <div className="absolute top-10 right-0">
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
          <div className="sticky top-0 bg-zinc-50">
            <h2 className="font-bold text-sm text-zinc-700 ">Identity items</h2>
            <p className="text-xs text-zinc-500 mb-2 border-b-[1px]">
              Identity items (wallets, socials, etc...)
            </p>
            <div className="py-4 flex items-center w-full">
              <button
                className="text-sm border rounded-md w-full py-1"
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

const IdentityPreview = ({ identity }) => {
  return (
    <C.Collapsible>
      <C.Toggle>
        <div className="select-none font-bold py-[2px] cursor-pointer px-2 hover:bg-zinc-100 rounded-md ">
          <p>{identity.label}</p>
        </div>
      </C.Toggle>
      <C.Content>
        <div className="pl-2">
          {identity.items.map((item) => (
            <div
              style={{ borderColor: identity.color }}
              className="flex px-2 gap-2 border-l">
              <p>{item.key}:</p>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </C.Content>
    </C.Collapsible>
  )
}
