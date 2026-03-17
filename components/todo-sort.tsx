import { Button } from "@/components/ui/button"

export type Sort = "createdAt" | "name"

type Props = {
  current: Sort
  onChange: (sort: Sort) => void
}

const sorts: { value: Sort; label: string }[] = [
  { value: "createdAt", label: "최신순" },
  { value: "name", label: "이름순" },
]

export function TodoSort({ current, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {sorts.map(({ value, label }) => (
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
