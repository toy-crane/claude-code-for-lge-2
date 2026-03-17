import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, beforeEach } from "vitest"
import { TodoApp } from "@/components/todo-app"

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
})
