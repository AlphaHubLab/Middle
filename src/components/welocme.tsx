import TodoWidget from "./todo-widget"

export default function Welcome() {
  return (
    <>
      <div className="flex flex-col w-full h-full bg-blue-400 justify-center items-center">
        <p className="text-white font-bold text-lg ">Welcome to the Middle</p>
        <p>Sample widget</p>
        <TodoWidget />
      </div>
    </>
  )
}
