"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconTrash } from "@tabler/icons-react"
import type { Todo, Priority } from "@/hooks/use-todos"

const PRIORITY_BADGE: Record<Priority, { label: string; style: string }> = {
  high: { label: "높음", style: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  normal: { label: "보통", style: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  low: { label: "낮음", style: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
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
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
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
        <span
          className={`flex-1 cursor-pointer text-sm select-none ${
            todo.completed ? "line-through opacity-50" : ""
          }`}
          onDoubleClick={startEditing}
        >
          {todo.text}
        </span>
      )}
      {todo.dueDate && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {todo.dueDate}
        </span>
      )}
      <span
        className={`shrink-0 rounded px-1.5 py-0.5 text-xs ${PRIORITY_BADGE[todo.priority ?? "normal"].style}`}
      >
        {PRIORITY_BADGE[todo.priority ?? "normal"].label}
      </span>
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
