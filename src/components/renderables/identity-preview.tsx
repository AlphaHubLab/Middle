import * as C from "~components/ui/collapsible"
import Copiable from "~components/ui/copiable"
import type { IIdentity } from "~lib/types"

export const IdentityPreview = ({ identity }: { identity: IIdentity }) => {
  return (
    <div className="w-full flex">
      <div
        style={{ color: identity.color }}
        className="w-4 text-xs flex items-center h-6">
        <p>ID</p>
      </div>
      <div className="w-full">
        <C.Collapsible>
          <C.Toggle>
            <header className="select-none text-black/80 text-sm font-medium py-[2px] cursor-pointer px-2 hover:bg-slate-100 rounded-md ">
              <p>{identity.label}</p>
            </header>
          </C.Toggle>
          <C.Content>
            <div className="pl-2 pb-3 w-full">
              {identity.items.map((item, i) => (
                <div
                  key={`${item}-${i}`}
                  style={{ borderColor: identity.color }}
                  className="flex px-2 gap-2 border-l text-sm text-black/50 w-full">
                  <p className="font-medium">{item.key}:</p>
                  <Copiable textToCopy={item.value}>
                    <p className="px-2 text-black/50 break-all w-full">
                      {item.value}
                    </p>
                  </Copiable>
                </div>
              ))}
            </div>
          </C.Content>
        </C.Collapsible>
      </div>
    </div>
  )
}
