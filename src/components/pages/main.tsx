import Editor from "~components/editor/editor"
import NavbarContainer from "~components/navbar/navbar-container"
import Inbox from "~components/task-manager/inbox"
import { useApp } from "~contexts/app-context"

export default function Main() {
  const { editMode, setEditMode } = useApp()

  return (
    <>
      {/* <Profiler id="todo" onRender={onRender}> */}
      <div className="relative h-full w-[calc(100%-288px)] dark:bg-fetch-black">
        <NavbarContainer />
        <div
          // style={{ scale: disabled ? "95%" : "100%" }}
          className={
            "relative w-full h-[calc(100%-180px)] max-w-[650px] overflow-y-auto mx-auto px-4 styled-scrollbar"
          }>
          {!editMode && (
            <div
              onClick={() => setEditMode(true)}
              className="hover:cursor-text absolute w-full h-full left-0 top-0 bg-white/50 dark:bg-fetch-black/50"></div>
          )}
          <Editor disabled={!editMode} />
        </div>
        <div className="flex justify-center">
          <div
            // className={`${!editMode ? "top-[200px]" : "top-[calc(100%-126px)]"} transform duration-200 absolute overflow-y-hidden max-w-[690px] h-[calc(100%-180px)] w-[calc(100%-8px)] shadow-md rounded-xl`}>
            className={`${!editMode ? "drawer-up" : "drawer-down"} absolute overflow-y-hidden max-w-[690px] h-[calc(100%-180px)] w-[calc(100%-8px)] shadow-md rounded-xl`}>
            <Inbox show={!editMode} setHide={setEditMode} />
          </div>
          {/* <div className="gradientback"></div> */}
        </div>
      </div>
      {/* </Profiler> */}
    </>
  )
}
