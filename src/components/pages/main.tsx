import Editor from "~components/editor/editor"
import NavbarContainer from "~components/navbar/navbar-container"
import Inbox from "~components/task-manager/inbox"
import { useAppState } from "~contexts/app-context"

export default function Main() {
  const { editMode, setEditMode } = useAppState()
  return (
    <>
      {/* <Profiler id="todo" onRender={onRender}> */}
      <div className="relative h-full w-[calc(100%-288px)]">
        <NavbarContainer />
        <div
          // style={{ scale: disabled ? "95%" : "100%" }}
          className={
            "relative w-full h-[calc(100%-288px)] max-w-[650px] overflow-y-auto mx-auto px-4 styled-scrollbar"
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
            className={`${!editMode ? "top-[296px]" : "top-[calc(100%-126px)]"} transform duration-200 absolute overflow-y-hidden max-w-[690px] top-[230px] h-[calc(100%-286px)] w-[calc(100%-8px)] shadow-md rounded-xl`}>
            <Inbox show={!editMode} setHide={setEditMode} />
          </div>
          <div className="gradientback"></div>
        </div>
      </div>
      {/* </Profiler> */}
    </>
  )
}
