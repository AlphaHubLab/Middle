import TodoMainSlash from "~components/editor/todo-main"
import NavbarContainer from "~components/navbar/navbar-container"
// import TaskList from "~components/task-manager/upcomming-list"
import Inbox from "~components/task-manager/inbox"
import { useAppState } from "~contexts/app-context"
import DraftProvider from "~contexts/draft-context"
import PersistProvider from "~contexts/persisting-context"
import SettingProvider from "~contexts/setting-context"
import VisibleTasksProvider from "~contexts/visible-tasks-context"

export default function Main({ isDev = false }) {
  const { editMode, viewMode, setEditMode } = useAppState()

  const showTaskList = !editMode && !viewMode

  return (
    <>
      {/* <Profiler id="todo" onRender={onRender}> */}
      <div className="relative h-full w-[calc(100%-288px)]">
        <SettingProvider isDev={isDev}>
          <DraftProvider>
            <PersistProvider isDev={isDev}>
              <VisibleTasksProvider>
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
                  <TodoMainSlash disabled={!editMode} />
                </div>

                <div className="flex w-full justify-center">
                  <div
                    className={`${!editMode ? "top-[296px]" : "top-[calc(100%-126px)]"} transform duration-200 bg-red-100/20 absolute overflow-y-hidden max-w-[650px] mx-auto top-[230px] h-[calc(100%-330px)] w-full`}>
                    <Inbox show={showTaskList} setHide={setEditMode} />
                  </div>
                  <div className="gradientback"></div>
                </div>
              </VisibleTasksProvider>
            </PersistProvider>
          </DraftProvider>
        </SettingProvider>
      </div>
      {/* </Profiler> */}
    </>
  )
}
