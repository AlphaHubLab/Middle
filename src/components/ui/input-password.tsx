import { useState, type Dispatch } from "react"
import { PiEye, PiEyeSlash } from "react-icons/pi"

export default function PasswordInput({
  setter
}: {
  setter: Dispatch<string>
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex h-8 gap-2 text-sm border appearence-none leading-tight p-1 rounded-xl w-full has-[:focus]:outline outline-violet-400">
      <input
        className="outline-none flex-auto"
        onChange={(e) => setter(e.target.value)}
        type={show ? "text" : "password"}
      />
      <button
        className="cursor-pointer text-lg flex items-center hover:text-zinc-500/50 text-zinc-500"
        onClick={() => setShow(!show)}>
        {show ? <PiEyeSlash /> : <PiEye />}
      </button>
    </div>
  )
}
