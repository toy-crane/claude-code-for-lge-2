import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, beforeEach } from "vitest"
import { TodoApp } from "@/components/todo-app"

async function addTodo(user: ReturnType<typeof userEvent.setup>, text: string) {
  const input = screen.getByPlaceholderText(/할 일/i)
  await user.type(input, text)
  await user.keyboard("{Enter}")
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

    const input = screen.getByPlaceholderText(/할 일/i)
    await user.type(input, "테스트 할 일")
    await user.keyboard("{Enter}")

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

      const dateInput = screen.getByLabelText("마감일")
      await user.type(dateInput, "2026-03-20")

      await addTodo(user, "마감일 있는 할 일")

      expect(screen.getByText("마감일 있는 할 일")).toBeInTheDocument()
      expect(screen.getByText("2026-03-20")).toBeInTheDocument()
    })
  })

  describe("정렬", () => {
    it("이름순 선택 시 가나다순 정렬", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodo(user, "다라마")
      await addTodo(user, "가나다")
      await addTodo(user, "바사아")

      await user.click(screen.getByRole("button", { name: "이름순" }))

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

      await user.click(screen.getByRole("button", { name: "최신순" }))

      const items = screen.getAllByRole("checkbox")
      const texts = items.map((_, i) =>
        items[i].closest("div")?.querySelector("span.flex-1")?.textContent
      )
      expect(texts).toEqual(["세 번째", "두 번째", "첫 번째"])
    })

    it("마감일순 선택 시 가까운 마감일부터 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      const dateInput = screen.getByLabelText("마감일")

      await user.type(dateInput, "2026-03-25")
      await addTodo(user, "늦은 마감")

      await user.type(dateInput, "2026-03-18")
      await addTodo(user, "빠른 마감")

      await user.type(dateInput, "2026-03-22")
      await addTodo(user, "중간 마감")

      await user.click(screen.getByRole("button", { name: "마감일순" }))

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

      const dateInput = screen.getByLabelText("마감일")
      await user.type(dateInput, "2026-03-20")
      await addTodo(user, "마감일 있음")

      await user.click(screen.getByRole("button", { name: "마감일순" }))

      const items = screen.getAllByRole("checkbox")
      const texts = items.map((_, i) =>
        items[i].closest("div")?.querySelector("span.flex-1")?.textContent
      )
      expect(texts).toEqual(["마감일 있음", "마감일 없음"])
    })

    it("현재 정렬 기준이 버튼에 표시됨", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      const latestBtn = screen.getByRole("button", { name: "최신순" })
      const nameBtn = screen.getByRole("button", { name: "이름순" })

      expect(latestBtn).toHaveAttribute("data-variant", "default")
      expect(nameBtn).toHaveAttribute("data-variant", "outline")

      await user.click(nameBtn)

      expect(latestBtn).toHaveAttribute("data-variant", "outline")
      expect(nameBtn).toHaveAttribute("data-variant", "default")
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

      // 입력 영역이 아닌 카테고리 필터 영역에서도 "업무"가 있으므로 첫 번째(입력) 버튼 클릭
      const buttons = screen.getAllByRole("button", { name: "업무" })
      await user.click(buttons[0])
      await addTodo(user, "보고서 작성")

      expect(screen.getByText("보고서 작성")).toBeInTheDocument()
      // 입력 버튼 + 카테고리 필터 버튼 + 배지 = 3개
      const allTexts = screen.getAllByText("업무")
      expect(allTexts.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe("카테고리별 필터", () => {
    function getCategoryFilterButton(name: string) {
      const container = screen.getByTestId("category-filter")
      return within(container).getByRole("button", { name })
    }

    it("'업무' 필터 선택 시 업무 항목만 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 입력 영역의 카테고리 버튼 (첫 번째)
      const inputButtons = screen.getAllByRole("button", { name: "업무" })
      await user.click(inputButtons[0])
      await addTodo(user, "보고서 작성")

      const personalButtons = screen.getAllByRole("button", { name: "개인" })
      await user.click(personalButtons[0])
      await addTodo(user, "운동하기")

      await user.click(getCategoryFilterButton("업무"))

      expect(screen.getByText("보고서 작성")).toBeInTheDocument()
      expect(screen.queryByText("운동하기")).not.toBeInTheDocument()
    })

    it("'전체' 선택 시 전체 목록 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      const inputButtons = screen.getAllByRole("button", { name: "업무" })
      await user.click(inputButtons[0])
      await addTodo(user, "보고서 작성")

      const personalButtons = screen.getAllByRole("button", { name: "개인" })
      await user.click(personalButtons[0])
      await addTodo(user, "운동하기")

      await user.click(getCategoryFilterButton("업무"))
      expect(screen.queryByText("운동하기")).not.toBeInTheDocument()

      await user.click(getCategoryFilterButton("전체"))

      expect(screen.getByText("보고서 작성")).toBeInTheDocument()
      expect(screen.getByText("운동하기")).toBeInTheDocument()
    })
  })

  describe("필터링", () => {
    function getStatusFilterButton(name: string) {
      const container = screen.getByTestId("status-filter")
      return within(container).getByRole("button", { name })
    }

    it("'전체' 필터 선택 시 5개 모두 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodosAndToggle(user)
      await user.click(getStatusFilterButton("전체"))

      const checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes).toHaveLength(5)
    })

    it("'진행중' 필터 선택 시 미완료 3개만 표시", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodosAndToggle(user)
      await user.click(getStatusFilterButton("진행중"))

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
      await user.click(getStatusFilterButton("완료"))

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
      await user.click(getStatusFilterButton("진행중"))
      expect(screen.getByText("할 일을 추가해보세요")).toBeInTheDocument()

      // 할 일이 있지만 필터 결과가 0개이면 필터 메시지
      await user.click(getStatusFilterButton("전체"))
      await addTodo(user, "할 일 1")
      const checkbox = screen.getByRole("checkbox")
      await user.click(checkbox)
      await user.click(getStatusFilterButton("진행중"))
      expect(screen.getByText("할 일이 없습니다")).toBeInTheDocument()
    })

    it("'완료' 필터 중 미완료로 변경 시 목록에서 사라짐", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      await addTodosAndToggle(user)
      await user.click(getStatusFilterButton("완료"))

      let checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes).toHaveLength(2)

      await user.click(checkboxes[0])

      checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes).toHaveLength(1)
    })

    it("현재 필터 버튼에 active 스타일 적용", async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      const allButton = getStatusFilterButton("전체")
      const activeButton = getStatusFilterButton("진행중")
      const completedButton = getStatusFilterButton("완료")

      expect(allButton).toHaveAttribute("data-variant", "default")
      expect(activeButton).toHaveAttribute("data-variant", "outline")
      expect(completedButton).toHaveAttribute("data-variant", "outline")

      await user.click(activeButton)

      expect(allButton).toHaveAttribute("data-variant", "outline")
      expect(activeButton).toHaveAttribute("data-variant", "default")
      expect(completedButton).toHaveAttribute("data-variant", "outline")
    })
  })
})
