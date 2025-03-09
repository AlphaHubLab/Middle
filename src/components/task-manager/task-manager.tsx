import Editor from "~components/editor/editor"
import NavbarContainer from "~components/navbar/navbar-container"
import Inbox from "~components/task-manager/inbox/inbox"
import { useApp } from "~providers/app-context"

export default function TaskManager({ isDev = false }) {
  const { editMode, setEditMode } = useApp()

  return (
    <>
      {/* <Profiler id="todo" onRender={onRender}> */}
      <div className="h-full w-full">
        <NavbarContainer isDev={isDev} />

        <div className="relative h-full w-[calc(100%-64px)] md:w-[calc(100%-286px)]">
          <div
            className={
              "relative w-full h-[calc(100%-180px)] max-w-[650px] overflow-y-auto mx-auto px-4 styled-scrollbar"
            }>
            {!editMode && (
              <div
                onClick={() => setEditMode(true)}
                className="hover:cursor-text absolute w-full h-full left-0 top-0 bg-white/50"></div>
            )}
            <Editor disabled={!editMode} />
          </div>
          <div className="flex justify-center">
            <div
              className={`${!editMode ? "drawer-up" : "drawer-down"} absolute overflow-y-hidden max-w-[690px] h-[calc(100%-170px)] w-[calc(100%-8px)] shadow-md rounded-xl`}>
              <Inbox show={!editMode} setHide={setEditMode} />
            </div>
          </div>
        </div>
      </div>
      {/* </Profiler> */}
    </>
  )
}
