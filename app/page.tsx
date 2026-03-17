import { TodoApp } from "@/components/todo-app"

export default function Page() {
  return (
    <div className="flex min-h-svh items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="mb-6 text-2xl font-semibold">Todo</h1>
        <TodoApp />
      </div>
    </div>
  )
}
