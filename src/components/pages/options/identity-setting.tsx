import { useState } from "react"

import { Note, P, Section } from "~components/ui/typograrphy"
import type { IIdentity } from "~lib/types"
import { useSetting } from "~providers/setting-provider"

import { IdentityPreview } from "../../renderables/identity-preview"
import IdentityEditor from "./identity-editor"

const createNewIdentity = (identities: IIdentity[]) => {
  // New Id based on last registered Id
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
  const [editorMode, setEditorMode] = useState<"new" | "edit">("new")
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
      identities: prev.identities.filter(
        (identity: IIdentity) => identity.id !== id
      )
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
