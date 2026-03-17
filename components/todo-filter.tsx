import { Button } from "@/components/ui/button"

export type Filter = "all" | "active" | "completed"

type Props = {
  current: Filter
  onChange: (filter: Filter) => void
}

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행중" },
  { value: "completed", label: "완료" },
]

export function TodoFilter({ current, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          variant={current === value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
