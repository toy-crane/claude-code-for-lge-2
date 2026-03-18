import { Input } from "@/components/ui/input"

type Props = {
  value: string
  onChange: (value: string) => void
}

export function TodoSearch({ value, onChange }: Props) {
  return (
    <Input
      placeholder="검색"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
