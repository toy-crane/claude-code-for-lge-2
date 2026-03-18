import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, beforeEach } from "vitest"
import { TodoApp } from "@/components/todo-app"

// 다이얼로그를 열고 할 일을 추가하는 헬퍼
async function addTodo(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.click(screen.getByRole("button", { name: "할 일 추가" }))
  const input = screen.getByLabelText("할 일")
  await user.type(input, text)
  await user.click(screen.getByRole("button", { name: "추가" }))
}

// 드롭다운 필터 메뉴를 열고 메뉴 아이템을 선택하는 헬퍼
async function openFilterDropdown(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "필터" }))
}

// 상태 필터 선택 (전체/진행중/완료)
async function selectStatusFilter(user: ReturnType<typeof userEvent.setup>, optionName: string) {
  await openFilterDropdown(user)
  const items = screen.getAllByRole("menuitemcheckbox", { name: optionName })
  // 상태 섹션은 항상 첫 번째
  await user.click(items[0])
}

// 카테고리 필터 선택 (전체/업무/개인/쇼핑)
async function selectCategoryFilter(user: ReturnType<typeof userEvent.setup>, optionName: string) {
  await openFilterDropdown(user)
  if (optionName === "전체") {
    // "전체"는 상태/카테고리 양쪽에 있으므로 두 번째 항목 선택
    const items = screen.getAllByRole("menuitemcheckbox", { name: "전체" })
    await user.click(items[1])
  } else {
    await user.click(screen.getByRole("menuitemcheckbox", { name: optionName }))
  }
}

// 정렬 선택 (최신순/이름순/마감일순)
async function selectSortOption(user: ReturnType<typeof userEvent.setup>, optionName: string) {
  await openFilterDropdown(user)
  await user.click(screen.getByRole("menuitemradio", { name: optionName }))
}

// Calendar에서 날짜 선택 헬퍼 (aria-label 패턴 사용)
function getCalendarDay(day: string) {
  return screen.getByRole("button", { name: new RegExp(`${day}일`) })
}

async function addTodosAndToggle(user: ReturnType<typeof userEvent.setup>) {
  await addTodo(user, "할 일 1")
  await addTodo(user, "할 일 2")
  await addTodo(user, "할 일 3")
  await addTodo(user, "할 일 4")
  await addTodo(user, "할 일 5")

  const checkboxes = screen.getAllByRole("checkbox")
  await user.click(checkboxes[0])
  await user.click(checkboxes[1])
}

describe("TodoApp", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("할 일을 추가할 수 있다", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await addTodo(user, "테스트 할 일")

    expect(screen.getByText("테스트 할 일")).toBeInTheDocument()
  })

  it("할 일이 없으면 빈 상태 메시지를 보여준다", () => {
    render(<TodoApp />)

    expect(screen.getByText("할 일을 추가해보세요")).toBeInTheDocument()
  })

  describe("마감일 설정", () => {
    it("마감일 없이 할 일 추가 시 정상 추가, 마감일 칸 비어 있음", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodo(user, "마감일 없는 할 일")

      expect(screen.getByText("마감일 없는 할 일")).toBeInTheDocument()
      expect(screen.queryByText(/\d{4}-\d{2}-\d{2}/)).not.toBeInTheDocument()
    })

    it("마감일 있는 할 일 추가 시 목록에 마감일 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 다이얼로그를 열고 Calendar에서 날짜 선택
      await user.click(screen.getByRole("button", { name: "할 일 추가" }))
      await user.click(screen.getByRole("button", { name: "마감일" }))
      await user.click(getCalendarDay("20"))
      const input = screen.getByLabelText("할 일")
      await user.type(input, "마감일 있는 할 일")
      await user.click(screen.getByRole("button", { name: "추가" }))

      expect(screen.getByText("마감일 있는 할 일")).toBeInTheDocument()
      expect(screen.getByText(/\d{4}-\d{2}-20/)).toBeInTheDocument()
    })
  })

  describe("정렬", () => {
    it("이름순 선택 시 가나다순 정렬", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodo(user, "다라마")
      await addTodo(user, "가나다")
      await addTodo(user, "바사아")

      await selectSortOption(user, "이름순")

      const items = screen.getAllByRole("checkbox")
      const texts = items.map((_, i) =>
        items[i].closest("div")?.querySelector("span.flex-1")?.textContent
      )
      expect(texts).toEqual(["가나다", "다라마", "바사아"])
    })

    it("최신순 선택 시 최근 추가 순 정렬", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodo(user, "첫 번째")
      await addTodo(user, "두 번째")
      await addTodo(user, "세 번째")

      await selectSortOption(user, "최신순")

      const items = screen.getAllByRole("checkbox")
      const texts = items.map((_, i) =>
        items[i].closest("div")?.querySelector("span.flex-1")?.textContent
      )
      expect(texts).toEqual(["세 번째", "두 번째", "첫 번째"])
    })

    it("마감일순 선택 시 가까운 마감일부터 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 다이얼로그에서 마감일 포함 할 일 추가
      async function addTodoWithDue(text: string, day: string) {
        await user.click(screen.getByRole("button", { name: "할 일 추가" }))
        await user.click(screen.getByRole("button", { name: "마감일" }))
        await user.click(getCalendarDay(day))
        await user.type(screen.getByLabelText("할 일"), text)
        await user.click(screen.getByRole("button", { name: "추가" }))
      }

      await addTodoWithDue("늦은 마감", "25")
      await addTodoWithDue("빠른 마감", "18")
      await addTodoWithDue("중간 마감", "22")

      await selectSortOption(user, "마감일순")

      const items = screen.getAllByRole("checkbox")
      const texts = items.map((_, i) =>
        items[i].closest("div")?.querySelector("span.flex-1")?.textContent
      )
      expect(texts).toEqual(["빠른 마감", "중간 마감", "늦은 마감"])
    })

    it("마감일 없는 항목은 맨 뒤에 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodo(user, "마감일 없음")

      // 마감일 포함 할 일 추가
      await user.click(screen.getByRole("button", { name: "할 일 추가" }))
      await user.click(screen.getByRole("button", { name: "마감일" }))
      await user.click(getCalendarDay("20"))
      await user.type(screen.getByLabelText("할 일"), "마감일 있음")
      await user.click(screen.getByRole("button", { name: "추가" }))

      await selectSortOption(user, "마감일순")

      const items = screen.getAllByRole("checkbox")
      const texts = items.map((_, i) =>
        items[i].closest("div")?.querySelector("span.flex-1")?.textContent
      )
      expect(texts).toEqual(["마감일 있음", "마감일 없음"])
    })
  })

  describe("검색", () => {
    it("'회의' 검색 시 '회의' 포함 항목만 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodo(user, "팀 회의 준비")
      await addTodo(user, "점심 식사")
      await addTodo(user, "회의록 작성")

      const searchInput = screen.getByPlaceholderText("검색")
      await user.type(searchInput, "회의")

      expect(screen.getByText("팀 회의 준비")).toBeInTheDocument()
      expect(screen.getByText("회의록 작성")).toBeInTheDocument()
      expect(screen.queryByText("점심 식사")).not.toBeInTheDocument()
    })

    it("검색어 지우면 전체 목록 복원", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodo(user, "팀 회의 준비")
      await addTodo(user, "점심 식사")

      const searchInput = screen.getByPlaceholderText("검색")
      await user.type(searchInput, "회의")

      expect(screen.queryByText("점심 식사")).not.toBeInTheDocument()

      await user.clear(searchInput)

      expect(screen.getByText("팀 회의 준비")).toBeInTheDocument()
      expect(screen.getByText("점심 식사")).toBeInTheDocument()
    })
  })

  describe("카테고리 태그", () => {
    it("'업무' 태그 지정 후 저장 시 목록에 태그 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 다이얼로그에서 카테고리 선택 후 할 일 추가
      await user.click(screen.getByRole("button", { name: "할 일 추가" }))
      await user.click(screen.getByRole("radio", { name: "업무" }))
      await user.type(screen.getByLabelText("할 일"), "보고서 작성")
      await user.click(screen.getByRole("button", { name: "추가" }))

      expect(screen.getByText("보고서 작성")).toBeInTheDocument()
      // 배지에 업무 표시
      const allTexts = screen.getAllByText("업무")
      expect(allTexts.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe("카테고리별 필터", () => {
    it("'업무' 필터 선택 시 업무 항목만 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 다이얼로그에서 업무 카테고리로 추가
      await user.click(screen.getByRole("button", { name: "할 일 추가" }))
      await user.click(screen.getByRole("radio", { name: "업무" }))
      await user.type(screen.getByLabelText("할 일"), "보고서 작성")
      await user.click(screen.getByRole("button", { name: "추가" }))

      // 다이얼로그에서 개인 카테고리로 추가
      await user.click(screen.getByRole("button", { name: "할 일 추가" }))
      await user.click(screen.getByRole("radio", { name: "개인" }))
      await user.type(screen.getByLabelText("할 일"), "운동하기")
      await user.click(screen.getByRole("button", { name: "추가" }))

      await selectCategoryFilter(user, "업무")

      expect(screen.getByText("보고서 작성")).toBeInTheDocument()
      expect(screen.queryByText("운동하기")).not.toBeInTheDocument()
    })

    it("'전체' 선택 시 전체 목록 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 다이얼로그에서 업무 카테고리로 추가
      await user.click(screen.getByRole("button", { name: "할 일 추가" }))
      await user.click(screen.getByRole("radio", { name: "업무" }))
      await user.type(screen.getByLabelText("할 일"), "보고서 작성")
      await user.click(screen.getByRole("button", { name: "추가" }))

      // 다이얼로그에서 개인 카테고리로 추가
      await user.click(screen.getByRole("button", { name: "할 일 추가" }))
      await user.click(screen.getByRole("radio", { name: "개인" }))
      await user.type(screen.getByLabelText("할 일"), "운동하기")
      await user.click(screen.getByRole("button", { name: "추가" }))

      await selectCategoryFilter(user, "업무")
      expect(screen.queryByText("운동하기")).not.toBeInTheDocument()

      await selectCategoryFilter(user, "전체")

      expect(screen.getByText("보고서 작성")).toBeInTheDocument()
      expect(screen.getByText("운동하기")).toBeInTheDocument()
    })
  })

  describe("필터링", () => {
    it("'전체' 필터 선택 시 5개 모두 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodosAndToggle(user)
      await selectStatusFilter(user, "전체")

      const checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes).toHaveLength(5)
    })

    it("'진행중' 필터 선택 시 미완료 3개만 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodosAndToggle(user)
      await selectStatusFilter(user, "진행중")

      const checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes).toHaveLength(3)
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked()
      })
    })

    it("'완료' 필터 선택 시 완료 2개만 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodosAndToggle(user)
      await selectStatusFilter(user, "완료")

      const checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes).toHaveLength(2)
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked()
      })
    })

    it("Todo 0개에서 '진행중' 선택 시 빈 상태 메시지", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 전체 할 일이 0개이면 기본 메시지
      await selectStatusFilter(user, "진행중")
      expect(screen.getByText("할 일을 추가해보세요")).toBeInTheDocument()

      // 할 일이 있지만 필터 결과가 0개이면 필터 메시지
      await selectStatusFilter(user, "전체")
      await addTodo(user, "할 일 1")
      const checkbox = screen.getByRole("checkbox")
      await user.click(checkbox)
      await selectStatusFilter(user, "진행중")
      expect(screen.getByText("할 일이 없습니다")).toBeInTheDocument()
    })

    it("'완료' 필터 중 미완료로 변경 시 목록에서 사라짐", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodosAndToggle(user)
      await selectStatusFilter(user, "완료")

      let checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes).toHaveLength(2)

      await user.click(checkboxes[0])

      checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes).toHaveLength(1)
    })
  })
})
