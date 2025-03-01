import { useSetting } from "providers/setting-context"
import { useEffect, useState } from "react"
import { HexColorPicker } from "react-colorful"

import Input from "~components/ui/input"
import Label from "~components/ui/label"
import { Note, P, Section } from "~components/ui/typograrphy"
import type { IIdentity } from "~lib/types"

import { IdentityPreview } from "../../renderables/identity-preview"

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
  const { setting } = useSetting()

  const { identities } = setting

  const [open, setOpen] = useState(false)
  const [showIdEditor, setShowIdEditor] = useState(false)
  const [editorMode, setEditorMode] = useState("new")
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
    const timer = setTimeout(() => setShowIdEditor(false), 200)
    return () => clearTimeout(timer)
  }

  return (
    <Section title="Identities">
      <P>
        Creating well-managed identities allows you to track your activities
        more precisely. Assign one or more wallets, social accounts, or other
        identifiers to a task for better tracking and organization.
      </P>
      <Note variant="red">
        <b>DO NOT STORE</b> passwords, key phrases, private keys or other
        sensetive data in identity items!
      </Note>

      <div className="my-6">
        <div className="flex">
          <div className="w-full">
            <div
              onClick={() => {
                if (showIdEditor === false) {
                  openEditor(createNewIdentity(identities))
                  setEditorMode("new")
                }
              }}
              style={{ height: !open ? "52px" : "452px" }}
              className={`${!showIdEditor && "cursor-pointer hover:bg-fetch-secondary/70"} w-full overflow-hidden transition-all duration-300 px-2 bg-fetch-secondary/40 rounded-2xl`}>
              <div
                className={`text-sm font-medium w-full h-[52px] flex items-center px-2 text-fetch-primary/90 border-b-[1px]  ${open || showIdEditor ? "border-black/10" : "border-transparent"}`}>
                +Add Identity
              </div>
              {showIdEditor && (
                <div className="h-[400px] overflow-y-auto overflow-x-hidden styled-scrollbar">
                  <IdentityEditor
                    editorMode={editorMode}
                    initialIdentity={initialIdentity}
                    onClose={onClose}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="my-6">
        <h2 className="font-medium text-sm border-b text-black/80">
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
            {identities.map((identity: IIdentity) => (
              <IdentityPerviewWithToolbar
                key={`loaded-identity-${identity.id}`}
                identity={identity}
                setEditorMode={setEditorMode}
                openEditor={openEditor}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}

const IdentityPerviewWithToolbar = ({
  identity,
  openEditor,
  setEditorMode
}) => {
  const { setSetting } = useSetting()

  const [showWarning, setShowWarning] = useState(false)

  const removeIdentity = (id: number) => {
    setSetting((prev) => ({
      ...prev,
      identities: prev.identities.filter((identity) => identity.id !== id)
    }))
  }

  return (
    <div className="flex w-full items-center">
      <div className="flex w-full">
        <div className="flex-auto">
          <IdentityPreview identity={identity} />
        </div>
        <div className="flex w-fit gap-2 h-6 items-center text-xs pl-2">
          {!showWarning ? (
            <>
              <button
                className="text-blue-500 hover:text-blue-300"
                onClick={() => {
                  openEditor(structuredClone(identity))
                  setEditorMode("edit")
                }}>
                Edit
              </button>
              <button
                className="text-rose-500 hover:text-rose-300"
                onClick={() => setShowWarning(true)}>
                Delete
              </button>
            </>
          ) : (
            <div className="flex bg-rose-100 rounded-md border-rose-500 px-2 gap-4">
              <p className="shrink-0 text-rose-500">
                Delete "{identity.label}"?
              </p>
              <button
                className="text-rose-500 hover:text-rose-300"
                onClick={() => removeIdentity(identity.id)}>
                YES!
              </button>
              <button
                className="text-blue-500 hover:text-blue-300"
                onClick={() => setShowWarning(false)}>
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const IdentityEditor = ({ initialIdentity, onClose, editorMode }) => {
  const [identity, setIdentity] = useState<IIdentity>(initialIdentity)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [duplicate, setDuplicate] = useState(false)

  const { setting, setSetting } = useSetting()

  useEffect(() => setDuplicate(false), [initialIdentity])

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
