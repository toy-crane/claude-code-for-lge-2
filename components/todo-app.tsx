"use client"

import { useState } from "react"
import { useTodos } from "@/hooks/use-todos"
import { TodoInput } from "@/components/todo-input"
import { TodoList } from "@/components/todo-list"
import { TodoSearch } from "@/components/todo-search"
import { TodoFilterDropdown, type Filter, type CategoryFilter, type Sort } from "@/components/todo-filter-dropdown"
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Todo</h1>
        <TodoInput onAdd={addTodo} />
      </div>
      <div className="flex gap-2">
        <TodoSearch value={search} onChange={setSearch} />
        <TodoFilterDropdown
          filter={filter}
          onFilterChange={setFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sort={sort}
          onSortChange={setSort}
        />
      </div>
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
