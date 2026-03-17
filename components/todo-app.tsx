"use client"

import { useState } from "react"
import { useTodos } from "@/hooks/use-todos"
import { TodoInput } from "@/components/todo-input"
import { TodoList } from "@/components/todo-list"
import { TodoFilter, type Filter } from "@/components/todo-filter"
import { TodoSort, type Sort } from "@/components/todo-sort"
import { TodoSearch } from "@/components/todo-search"
import { TodoCategoryFilter, type CategoryFilter } from "@/components/todo-category-filter"
import { sortTodos } from "@/lib/todo-store"

export function TodoApp() {
  const { todos, isLoaded, addTodo, toggleTodo, deleteTodo, editTodo } =
    useTodos()
  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<Sort>("createdAt")
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")

  if (!isLoaded) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        불러오는 중...
      </p>
    )
  }

  const filteredTodos = sortTodos(
    todos.filter((todo) => {
      if (search && !todo.text.includes(search)) return false
      if (categoryFilter !== "all" && todo.category !== categoryFilter) return false
      if (filter === "active") return !todo.completed
      if (filter === "completed") return todo.completed
      return true
    }),
    sort
  )

  const emptyMessage =
    todos.length === 0 ? "할 일을 추가해보세요" : "할 일이 없습니다"

  return (
    <div className="flex flex-col gap-4">
      <TodoInput onAdd={addTodo} />
      <TodoSearch value={search} onChange={setSearch} />
      <div className="flex gap-4">
        <TodoFilter current={filter} onChange={setFilter} />
        <TodoSort current={sort} onChange={setSort} />
      </div>
      <TodoCategoryFilter current={categoryFilter} onChange={setCategoryFilter} />
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
