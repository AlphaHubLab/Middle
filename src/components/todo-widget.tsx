import TodoList from "./todo/todo-container"

export default function TodoWidget() {
  return (
    <div className="p-2 border border-1 rounded-xl bg-white w-[200px] h-[400px] overflow-y-auto">
      <TodoList />
    </div>
  )
}
