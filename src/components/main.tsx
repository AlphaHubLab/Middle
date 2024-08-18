import { useState, type ReactNode } from "react"
import { FaTasks } from "react-icons/fa"
import { IoSettingsOutline } from "react-icons/io5"
import { RiHomeLine } from "react-icons/ri"

import TodoList from "./todo/todo-container"
import Home from "./home"

const routes = [
  { route: "Home", icon: RiHomeLine },
  { route: "Tasks", icon: FaTasks },
  { route: "Preferences", icon: IoSettingsOutline }
]

export default function Main({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState("Home")

  return (
    <main className="bg-zinc-800 h-screen p-2">
      <nav className="fixed left-0 h-screen w-12 md:w-16 pl-2 flex flex-col gap-2 text-black justify-center">
        {routes.map((r, i) => (
          <div key={`nav-${i}`}>
            <NavButton
              activePage={activePage}
              route={r.route}
              setter={setActivePage}>
              {<r.icon />}
            </NavButton>
          </div>
        ))}
      </nav>
      <div className="ml-12 md:ml-16 bg-zinc-900 rounded-xl p-2 h-full">
        {activePage === "Home" && <Home />}
        {activePage === "Tasks" && <TodoList />}
        {activePage === "Preferences" && <>Preferences</>}
      </div>
    </main>
  )
}

function NavButton(props: {
  activePage: string
  route: string
  children: ReactNode
  setter: (val: any) => void
}) {
  return (
    <button
      onClick={() => props.setter(props.route)}
      className={`text-lg w-10 h-10 md:w-14 md:h-14 flex items-center justify-center transition duration-200 rounded-lg flex text-md justify-center transition duration-200 p-2 ${props.activePage === props.route ? "bg-white" : "bg-gray-300 hover:bg-gray-200"}`}>
      {props.children}
    </button>
  )
}
