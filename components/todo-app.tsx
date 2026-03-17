"use client"

import { useTodos } from "@/hooks/use-todos"
import { TodoInput } from "@/components/todo-input"
import { TodoList } from "@/components/todo-list"

export function TodoApp() {
  const { todos, isLoaded, addTodo, toggleTodo, deleteTodo, editTodo } =
    useTodos()

  if (!isLoaded) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        불러오는 중...
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <TodoInput onAdd={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />
    </div>
  )
}
