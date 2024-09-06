import Apps from "~components/apps/apps"
import TaskBox from "~components/editor/editor"

export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="w-[0px] invisible md:visible md:basis-1/2 lg:basis-3/5 flex w-full justify-center mt-96">
        <TaskBox />
      </div>
      <div className="basis-full md:basis-1/2 lg:basis-2/5">
        <Apps />
      </div>
    </div>
  )
}
