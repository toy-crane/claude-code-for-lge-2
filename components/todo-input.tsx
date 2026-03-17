"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Priority, Category } from "@/hooks/use-todos"

type Props = {
  onAdd: (text: string, priority: Priority, dueDate?: string, category?: Category) => void
}

const CATEGORIES: Category[] = ["업무", "개인", "쇼핑"]

const PRIORITY_CONFIG: Record<Priority, { label: string; style: string }> = {
  high: { label: "높음", style: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  normal: { label: "보통", style: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  low: { label: "낮음", style: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
}

const PRIORITY_ORDER: Priority[] = ["high", "normal", "low"]

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState("")
  const [priority, setPriority] = useState<Priority>("normal")
  const [dueDate, setDueDate] = useState("")
  const [category, setCategory] = useState<Category | undefined>(undefined)

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return
    if (e.key !== "Enter") return
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed, priority, dueDate || undefined, category)
    setValue("")
    setDueDate("")
    setCategory(undefined)
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        className="flex-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할 일을 입력하고 Enter를 누르세요"
      />
      <Input
        type="date"
        aria-label="마감일"
        className="w-36"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <div className="flex gap-1">
        {PRIORITY_ORDER.map((p) => (
          <Button
            key={p}
            variant="ghost"
            size="sm"
            className={`h-8 px-2 text-xs ${
              priority === p
                ? PRIORITY_CONFIG[p].style
                : "text-muted-foreground"
            }`}
            onClick={() => setPriority(p)}
          >
            {PRIORITY_CONFIG[p].label}
          </Button>
        ))}
      </div>
      <div className="flex gap-1">
        {CATEGORIES.map((c) => (
          <Button
            key={c}
            variant="ghost"
            size="sm"
            className={`h-8 px-2 text-xs ${
              category === c
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                : "text-muted-foreground"
            }`}
            onClick={() => setCategory(category === c ? undefined : c)}
          >
            {c}
          </Button>
        ))}
      </div>
    </div>
  )
}
