import { Button } from "@/components/ui/button"
import type { Category } from "@/hooks/use-todos"

export type CategoryFilter = "all" | Category

type Props = {
  current: CategoryFilter
  onChange: (filter: CategoryFilter) => void
}

const filters: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "업무", label: "업무" },
  { value: "개인", label: "개인" },
  { value: "쇼핑", label: "쇼핑" },
]

export function TodoCategoryFilter({ current, onChange }: Props) {
  return (
    <div className="flex gap-2" data-testid="category-filter">
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
