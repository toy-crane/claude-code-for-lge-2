import type { Todo } from "@/hooks/use-todos"
import type { Sort } from "@/components/todo-sort"

// 정렬 기준에 따라 할 일 목록을 정렬
export function sortTodos(todos: Todo[], sort: Sort): Todo[] {
  return [...todos].sort((a, b) => {
    if (sort === "name") return a.text.localeCompare(b.text, "ko")
    if (sort === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    }
    return b.createdAt - a.createdAt
  })
}
