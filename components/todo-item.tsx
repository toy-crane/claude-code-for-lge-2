"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconTrash } from "@tabler/icons-react"
import type { Todo } from "@/hooks/use-todos"

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
