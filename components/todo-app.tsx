"use client"

import { useState } from "react"
import { useTodos } from "@/hooks/use-todos"
import { TodoInput } from "@/components/todo-input"
import { TodoList } from "@/components/todo-list"
import { TodoFilter, type Filter } from "@/components/todo-filter"

export function TodoApp() {
  const { todos, isLoaded, addTodo, toggleTodo, deleteTodo, editTodo } =
    useTodos()
  const [filter, setFilter] = useState<Filter>("all")

  if (!isLoaded) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        불러오는 중...
      </p>
    )
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const emptyMessage =
    todos.length === 0 ? "할 일을 추가해보세요" : "할 일이 없습니다"

  return (
    <div className="flex flex-col gap-4">
      <TodoInput onAdd={addTodo} />
      <TodoFilter current={filter} onChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        emptyMessage={emptyMessage}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />
    </div>
  )
}
