"use client"

// 다이얼로그 기반 할 일 추가 폼 (아이콘 버튼 트리거, Calendar 마감일 선택)
import { useState, useTransition } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { IconPlus, IconCalendar } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import type { Priority, Category } from "@/hooks/use-todos"

type Props = {
  onAdd: (text: string, priority: Priority, dueDate?: string, category?: Category, description?: string) => void
}

const CATEGORIES: Category[] = ["업무", "개인", "쇼핑"]

const PRIORITY_ORDER: Priority[] = ["high", "normal", "low"]
const PRIORITY_LABELS: Record<Priority, string> = {
  high: "높음",
  normal: "보통",
  low: "낮음",
}

export function TodoInput({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [priority, setPriority] = useState<Priority>("normal")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [category, setCategory] = useState<Category | undefined>(undefined)
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [urlError, setUrlError] = useState("")
  const [isPending, startTransition] = useTransition()

  function resetForm() {
    setValue("")
    setPriority("normal")
    setDueDate(undefined)
    setCategory(undefined)
    setUrl("")
    setDescription("")
    setUrlError("")
  }

  function fetchMetadata() {
    setUrlError("")
    startTransition(async () => {
      const res = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) {
        const data = await res.json()
        setUrlError(data.error || "메타데이터를 가져올 수 없습니다")
        return
      }
      const data = await res.json()
      setDescription([data.title, data.description].filter(Boolean).join(" - "))
    })
  }

  function handleAdd() {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed, priority, dueDate ? format(dueDate, "yyyy-MM-dd") : undefined, category, description || undefined)
    resetForm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" aria-label="할 일 추가">
          <IconPlus />
          추가하기
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>할 일 추가</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="todo-text">할 일</FieldLabel>
            <Input
              id="todo-text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="할 일을 입력하세요"
            />
          </Field>
          <Field>
            <FieldLabel>마감일</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                  aria-label="마감일"
                >
                  <IconCalendar className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "yyyy-MM-dd") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <FieldLabel id="priority-label">우선순위</FieldLabel>
            <ToggleGroup
              type="single"
              value={priority}
              onValueChange={(val) => {
                if (val) setPriority(val as Priority)
              }}
              aria-labelledby="priority-label"
            >
              {PRIORITY_ORDER.map((p) => (
                <ToggleGroupItem key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>
          <Field>
            <FieldLabel id="category-label">카테고리</FieldLabel>
            <ToggleGroup
              type="single"
              value={category ?? ""}
              onValueChange={(val) => {
                setCategory(val ? (val as Category) : undefined)
              }}
              aria-labelledby="category-label"
            >
              {CATEGORIES.map((c) => (
                <ToggleGroupItem key={c} value={c}>
                  {c}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="todo-url">URL</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="todo-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
              <Button
                type="button"
                variant="outline"
                onClick={fetchMetadata}
                disabled={!url || isPending}
                aria-label="메타데이터 가져오기"
              >
                {isPending ? "로딩..." : "가져오기"}
              </Button>
            </div>
            {urlError && (
              <p className="text-sm text-destructive">{urlError}</p>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button onClick={handleAdd}>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
