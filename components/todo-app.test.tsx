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

    const deleteButton = screen.getByRole("button")
    await user.click(deleteButton)

    expect(screen.queryByText("장보기")).not.toBeInTheDocument()
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
