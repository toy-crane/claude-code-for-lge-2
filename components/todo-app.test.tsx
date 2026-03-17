import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach } from "vitest"
import { TodoApp } from "@/components/todo-app"

describe("TodoApp", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('입력 필드에 "장보기" 입력 후 Enter → 목록에 추가됨', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText("할 일을 입력하고 Enter를 누르세요")
    await user.type(input, "장보기{Enter}")

    expect(screen.getByText("장보기")).toBeInTheDocument()
  })

  it("빈 입력 상태에서 Enter → Todo가 추가되지 않음", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText("할 일을 입력하고 Enter를 누르세요")
    await user.type(input, "{Enter}")

    expect(screen.getByText("할 일을 추가해보세요")).toBeInTheDocument()
  })

  it("체크박스 클릭 → 완료 표시 (취소선)", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText("할 일을 입력하고 Enter를 누르세요")
    await user.type(input, "장보기{Enter}")

    const checkbox = screen.getByRole("checkbox")
    await user.click(checkbox)

    const todoText = screen.getByText("장보기")
    expect(todoText.className).toContain("line-through")
  })

  it("삭제 버튼 클릭 → 해당 항목 제거", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText("할 일을 입력하고 Enter를 누르세요")
    await user.type(input, "장보기{Enter}")
    expect(screen.getByText("장보기")).toBeInTheDocument()

    const deleteButton = screen.getByRole("button", { name: "" })
    await user.click(deleteButton)

    expect(screen.queryByText("장보기")).not.toBeInTheDocument()
  })

  it("Todo 추가 시 기본 우선순위는 '보통'", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText("할 일을 입력하고 Enter를 누르세요")
    await user.type(input, "장보기{Enter}")

    // 입력 영역 버튼(1개) + 목록 배지(1개) = 2개
    const normalTexts = screen.getAllByText("보통")
    expect(normalTexts.length).toBe(2)
  })

  it("'높음' 우선순위 선택 후 Todo 추가 → '높음' 배지 표시", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const highButton = screen.getByRole("button", { name: "높음" })
    await user.click(highButton)

    const input = screen.getByPlaceholderText("할 일을 입력하고 Enter를 누르세요")
    await user.type(input, "긴급 작업{Enter}")

    // 목록 내 배지 확인 (입력 영역 버튼과 별도)
    const badges = screen.getAllByText("높음")
    expect(badges.length).toBeGreaterThanOrEqual(2) // 입력 버튼 + 배지
  })

  it("'낮음' 우선순위 선택 후 Todo 추가 → '낮음' 배지 표시", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const lowButton = screen.getByRole("button", { name: "낮음" })
    await user.click(lowButton)

    const input = screen.getByPlaceholderText("할 일을 입력하고 Enter를 누르세요")
    await user.type(input, "나중에 할 일{Enter}")

    const badges = screen.getAllByText("낮음")
    expect(badges.length).toBeGreaterThanOrEqual(2)
  })

  it("서로 다른 우선순위의 Todo를 추가하면 각각의 배지가 표시됨", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText("할 일을 입력하고 Enter를 누르세요")

    // 높음 우선순위로 추가
    await user.click(screen.getByRole("button", { name: "높음" }))
    await user.type(input, "긴급{Enter}")

    // 낮음 우선순위로 추가
    await user.click(screen.getByRole("button", { name: "낮음" }))
    await user.type(input, "여유{Enter}")

    expect(screen.getByText("긴급")).toBeInTheDocument()
    expect(screen.getByText("여유")).toBeInTheDocument()

    // 입력 영역 버튼 외에 목록 배지로 높음, 낮음이 각각 존재
    const highBadges = screen.getAllByText("높음")
    const lowBadges = screen.getAllByText("낮음")
    expect(highBadges.length).toBeGreaterThanOrEqual(2)
    expect(lowBadges.length).toBeGreaterThanOrEqual(2)
  })

  it("페이지 새로고침 → 기존 목록 유지 (localStorage 영속성)", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<TodoApp />)

    const input = screen.getByPlaceholderText("할 일을 입력하고 Enter를 누르세요")
    await user.type(input, "장보기{Enter}")
    expect(screen.getByText("장보기")).toBeInTheDocument()

    // 컴포넌트 언마운트 (페이지 떠남 시뮬레이션)
    unmount()

    // 새로 렌더링 (페이지 새로고침 시뮬레이션)
    render(<TodoApp />)

    expect(screen.getByText("장보기")).toBeInTheDocument()
  })
})
