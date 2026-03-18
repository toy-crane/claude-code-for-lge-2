import { TodoApp } from "@/components/todo-app"

export default function Page() {
  return (
    <div className="flex min-h-svh items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <TodoApp />
      </div>
    </div>
  )
}
