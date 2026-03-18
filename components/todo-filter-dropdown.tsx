"use client"

// 필터 + 정렬 통합 드롭다운 메뉴
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconFilter } from "@tabler/icons-react"
import type { Category } from "@/hooks/use-todos"

export type Filter = "all" | "active" | "completed"
export type CategoryFilter = "all" | Category
export type Sort = "createdAt" | "name" | "dueDate"

type Props = {
  filter: Filter
  onFilterChange: (filter: Filter) => void
  categoryFilter: CategoryFilter
  onCategoryFilterChange: (filter: CategoryFilter) => void
  sort: Sort
  onSortChange: (sort: Sort) => void
}

const STATUS_FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행중" },
  { value: "completed", label: "완료" },
]

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "업무", label: "업무" },
  { value: "개인", label: "개인" },
  { value: "쇼핑", label: "쇼핑" },
]

const SORTS: { value: Sort; label: string }[] = [
  { value: "createdAt", label: "최신순" },
  { value: "name", label: "이름순" },
  { value: "dueDate", label: "마감일순" },
]

export function TodoFilterDropdown({
  filter,
  onFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sort,
  onSortChange,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="필터">
          <IconFilter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>상태</DropdownMenuLabel>
        {STATUS_FILTERS.map(({ value, label }) => (
          <DropdownMenuCheckboxItem
            key={value}
            checked={filter === value}
            onCheckedChange={() => onFilterChange(value)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>카테고리</DropdownMenuLabel>
        {CATEGORY_FILTERS.map(({ value, label }) => (
          <DropdownMenuCheckboxItem
            key={value}
            checked={categoryFilter === value}
            onCheckedChange={() => onCategoryFilterChange(value)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>정렬</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={(val) => onSortChange(val as Sort)}>
          {SORTS.map(({ value, label }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
