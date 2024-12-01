import TodoMainSlash from "~components/editor/todo-main"
import NavbarContainer from "~components/navbar/navbar-container"
import TaskList from "~components/tasklist"
import { useAppState } from "~contexts/app-context"
import DraftProvider from "~contexts/draft-context"
import PersistProvider from "~contexts/persisting-context"

export default function Main({ dev }) {
  const { editMode, setEditMode } = useAppState()

  return (
    <>
      {/* <Profiler id="todo" onRender={onRender}> */}
      <div className="relative h-full w-[calc(100%-288px)]">
      <DraftProvider>
        <PersistProvider>

            <NavbarContainer dev={dev} />
            <div
              // style={{ scale: disabled ? "95%" : "100%" }}
              className={"relative w-full max-w-[650px] mx-auto p-4"}>
              {!editMode && (
                <div
                  onClick={() => setEditMode(true)}
                  className="hover:cursor-text absolute w-full h-full left-0 top-0 bg-white/50"></div>
              )}
              <TodoMainSlash disabled={!editMode} />
            </div>

            <div className="flex w-full justify-center">
              <div
                className={`${!editMode ? "top-[296px]" : "top-[calc(100%-126px)]"} transform duration-200 bg-red-100/20 absolute overflow-y-hidden max-w-[650px] mx-auto top-[230px] h-[calc(100%-330px)] w-full`}>
                <TaskList show={!editMode} setHide={setEditMode} />
              </div>
              <div className="gradientback"></div>
            </div>
            </PersistProvider>
          </DraftProvider>

      </div>
      {/* </Profiler> */}
    </>
  )
}
