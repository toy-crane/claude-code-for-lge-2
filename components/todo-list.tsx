import { TodoItem } from "@/components/todo-item"
import type { Todo } from "@/hooks/use-todos"

type Props = {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: Props) {
  if (todos.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        할 일을 추가해보세요
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
