import moment from "moment"
import type { ChangeEvent } from "react"
import { IoTimeOutline } from "react-icons/io5"

import * as C from "~components/ui/collapsible"
import type { IIdentity } from "~lib/types"

interface IDateProps {
  timestamp: number
  setter: (timestamp: number) => void
}

interface IIdentityProps {
  identities: IIdentity[]
  removeIdentity: (id: number) => void
}

export const DateWithProps = ({ timestamp, setter }: IDateProps) => {
  const date = moment(timestamp).format().slice(0, -9)

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value).getTime()
    setter(date)
  }

  return (
    <div className="flex items-center h-10 gap-2">
      <div className="w-4 flex justify-center">
        <IoTimeOutline />
      </div>
      <input
        type="datetime-local"
        className="border text-sm text-zinc-500 border-dashed outline-none focus:bg-zinc-100 rounded-md px-1 my-1"
        value={date}
        onChange={handleOnChange}
      />
      <div className="flex flex-auto gap-2 text-xs items-center justify-start">
        <button
          className="border hover:bg-zinc-100 rounded-md px-2 py-[3px]"
          onClick={() => setter(timestamp + 24 * 60 * 60 * 1000)}>
          +24H
        </button>
        <button
          className="border hover:bg-zinc-100 rounded-md px-2 py-[3px]"
          onClick={() => setter(timestamp + 7 * 24 * 60 * 60 * 1000)}>
          +7D
        </button>
        <button
          className="border hover:bg-zinc-100 rounded-md px-2 py-[3px]"
          onClick={() => setter((new Date().getTime() / 10_000) * 10_000)}>
          Now
        </button>
      </div>
      <button
        className="text-rose-500 hover:text-rose-300 text-xs"
        onClick={() => setter(-1)}>
        Remove
      </button>
    </div>
  )
}

export const TagsWithProps = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex">
      <div className="w-4 flex items-center justify-center text-zinc-500 text-xs">#</div>
      <div className="pl-2 min-h-10 flex pb-1 flex-wrap oveflow-hidden items-center gap-1">
        {tags.map((tag, i) => (
          <span
            role="status"
            className="before:content-[x] text-zinc-400 bg-zinc-100 rounded-md text-xs px-2 py-1"
            key={`tags-${i}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export const IdentityWithProps = ({
  identities,
  removeIdentity
}: IIdentityProps) => {
  // Maybe managing by id
  //
  // const { setting } = useSettingContext()
  // const { identities } = setting

  // const selectedIdentities = (() => {
  //   const _identities = []

  //   identities.forEach((identity) => {
  //     if (ids.includes(identity.id)) {
  //       _identities.push(identity)
  //     }
  //   })

  //   return _identities
  // })()

  return (
    <div>
      {identities.map((identity, i) => (
        <div key={`added-identity-${i}`} className="flex items-center">
          <div
            style={{ color: identity.color }}
            className="w-4 text-xs h-full flex items-center justify-center">
            <p>ID</p>
          </div>
          <div className="w-full flex text-sm text-zinc-700 py-1">
            <div className="w-full">
              <C.Collapsible>
                <C.Toggle>
                  <div className="font-bold py-[2px] cursor-pointer px-2 hover:bg-zinc-100 rounded-md ">
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
            </div>
            <div className="flex items-start pt-1 pl-2">
              <button
                onClick={() => removeIdentity(identity.id)}
                className="text-xs text-rose-500 hover:text-rose-300">
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
