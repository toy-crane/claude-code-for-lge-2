"use client"

// 할 일 항목 컴포넌트 (Badge 기반 스타일링)
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IconTrash } from "@tabler/icons-react"
import type { Todo, Priority } from "@/hooks/use-todos"

const PRIORITY_BADGE: Record<Priority, { label: string; variant: "destructive" | "secondary" | "outline" }> = {
  high: { label: "높음", variant: "destructive" },
  normal: { label: "보통", variant: "secondary" },
  low: { label: "낮음", variant: "outline" },
}

type Props = {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)

  function startEditing() {
    setEditValue(todo.text)
    setIsEditing(true)
  }

  function confirmEdit() {
    const trimmed = editValue.trim()
    if (trimmed) {
      onEdit(todo.id, trimmed)
    }
    setIsEditing(false)
  }

  function cancelEdit() {
    setEditValue(todo.text)
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") confirmEdit()
    else if (e.key === "Escape") cancelEdit()
  }

  return (
    <div className="flex items-center gap-2 py-1">
      {/* 체크박스: 완료 상태 토글 */}
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="h-5 w-5 rounded-full border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />
      {isEditing ? (
        <Input
          className="h-7 flex-1 text-sm"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={confirmEdit}
          autoFocus
        />
      ) : (
        <div
          className={`flex-1 cursor-pointer select-none ${
            todo.completed ? "line-through opacity-50" : ""
          }`}
          onDoubleClick={startEditing}
        >
          <span className="text-sm">{todo.text}</span>
          {todo.description && (
            <p className="text-xs text-muted-foreground">{todo.description}</p>
          )}
        </div>
      )}
      {todo.category && (
        <Badge variant="default" className="shrink-0">
          {todo.category}
        </Badge>
      )}
      {todo.dueDate && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {todo.dueDate}
        </span>
      )}
      <Badge variant={PRIORITY_BADGE[todo.priority ?? "normal"].variant} className="shrink-0">
        {PRIORITY_BADGE[todo.priority ?? "normal"].label}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(todo.id)}
      >
        <IconTrash size={16} />
      </Button>
    </div>
  )
}
