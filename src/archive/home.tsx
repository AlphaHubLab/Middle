import { Command } from "cmdk"

import BookmarkContainer from "../components/bookmark/bookmark-container"
import { CommandMenu } from "./command"
import TodoList from "./todo/todo-container"
import WidgetBox from "./widget-box"

export default function Home() {
  return (
    <>
      <div className="flex flex-col w-full h-full p-2 gap-2">
        <nav className="h-16">
          <WidgetBox className="bg-zinc-800">
            <div className="flex justify-around text-zinc-300 items-center h-full">
              <p>ETH: 1.1</p>
              <p>BASE: 0.1</p>
              <p>SCROLL: 0.2</p>
            </div>
          </WidgetBox>
        </nav>

        {/* <div className="h-16"> */}
        <WidgetBox className="bg-zinc-800">
          <div className="flex justify-around text-zinc-300 items-center h-full">
            <CommandMenu />
          </div>
        </WidgetBox>
        {/* </div> */}

        <div className="flex gap-2">
          <section className="basis-2/3">
            <WidgetBox className="text-zinc-300">
              <BookmarkContainer />
            </WidgetBox>
          </section>

          <section className="basis-1/3 flex flex-col gap-2">
            <section className="basis-2/3">
              <WidgetBox className="bg-zinc-800 text-zinc-300">
                <TodoList />
              </WidgetBox>
            </section>
            <section className="basis-1/3">
              <WidgetBox className="bg-zinc-700 text-zinc-300">
                <div>Connect Galxe</div>
              </WidgetBox>
            </section>
          </section>
        </div>

        <div className="flex gap-2">
          <section className="basis-1/2">
            <WidgetBox className="bg-emerald-500 text-zinc-300 border-zinc-400 ">
              <div>Another section</div>
            </WidgetBox>
          </section>

          <section className="basis-1/2">
            <WidgetBox className="text-zinc-300 border border-1 border-zinc-400">
              <div>Another section</div>
            </WidgetBox>
          </section>
        </div>
      </div>
    </>
  )
}
