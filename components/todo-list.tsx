import { TodoItem } from "@/components/todo-item"
import type { Todo } from "@/hooks/use-todos"

type Props = {
  todos: Todo[]
  emptyMessage?: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

export function TodoList({
  todos,
  emptyMessage = "할 일을 추가해보세요",
  onToggle,
  onDelete,
  onEdit,
}: Props) {
  if (todos.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="flex flex-col divide-y">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
