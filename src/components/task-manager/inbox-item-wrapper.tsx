export default function InboxItemWrapper({ children }) {
  return (
    <div
      className={`border-[1px] hover:shadow-md rounded-md flex flex-col justify-center overflow-hidden`}>
      <div className="h-full w-full flex w-full">
        <div className=" w-full h-full">
          <div className=" w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  )
}
