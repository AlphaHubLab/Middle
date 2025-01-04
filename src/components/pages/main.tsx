import Editor from "~components/editor/editor"
import NavbarContainer from "~components/navbar/navbar-container"
import Inbox from "~components/task-manager/inbox"
import { useAppState } from "~contexts/app-context"

export default function Main() {
  const { editMode, viewMode, setEditMode } = useAppState()

  const showTaskList = !editMode && !viewMode

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
          {showTaskList && (
            <div
              onClick={() => setEditMode(true)}
              className="hover:cursor-text absolute w-full h-full left-0 top-0 bg-white/50"></div>
          )}
          <Editor disabled={!editMode} />
        </div>
        <div className="flex w-full justify-center">
          <div
            className={`${!editMode ? "top-[296px]" : "top-[calc(100%-126px)]"} transform duration-200 bg-red-100/20 absolute overflow-y-hidden max-w-[690px] mx-auto top-[230px] h-[calc(100%-330px)] w-full`}>
            <Inbox show={showTaskList} setHide={setEditMode} />
          </div>
          <div className="gradientback"></div>
        </div>
      </div>
      {/* </Profiler> */}
    </>
  )
}
