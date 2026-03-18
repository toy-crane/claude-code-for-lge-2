import { render, screen, cleanup, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { TodoApp } from "@/components/todo-app"

// 다이얼로그를 열고 할 일을 입력하는 헬퍼
async function openDialogAndType(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.click(screen.getByRole("button", { name: "할 일 추가" }))
  const input = screen.getByLabelText("할 일")
  await user.type(input, text)
  return input
}

describe("TodoApp", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('"할 일 추가" 버튼 클릭 → 다이얼로그에서 입력 후 추가 → 목록에 추가됨', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await openDialogAndType(user, "장보기")
    await user.click(screen.getByRole("button", { name: "추가" }))

    expect(screen.getByText("장보기")).toBeInTheDocument()
  })

  it("빈 입력 상태에서 추가 → Todo가 추가되지 않음", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.click(screen.getByRole("button", { name: "할 일 추가" }))
    await user.click(screen.getByRole("button", { name: "추가" }))

    expect(screen.getByText("할 일을 추가해보세요")).toBeInTheDocument()
  })

  it("체크박스 클릭 → 완료 표시 (취소선)", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await openDialogAndType(user, "장보기")
    await user.click(screen.getByRole("button", { name: "추가" }))

    const checkbox = screen.getByRole("checkbox")
    await user.click(checkbox)

    const todoText = screen.getByText("장보기")
    expect(todoText.closest("div")!.className).toContain("line-through")
  })

  it("삭제 버튼 클릭 → 해당 항목 제거", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await openDialogAndType(user, "장보기")
    await user.click(screen.getByRole("button", { name: "추가" }))
    expect(screen.getByText("장보기")).toBeInTheDocument()

    const deleteButton = screen.getByRole("button", { name: "" })
    await user.click(deleteButton)

    expect(screen.queryByText("장보기")).not.toBeInTheDocument()
  })

  it("Todo 추가 시 기본 우선순위는 '보통'", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await openDialogAndType(user, "장보기")
    await user.click(screen.getByRole("button", { name: "추가" }))

    // 목록에 보통 배지가 표시됨
    expect(screen.getByText("보통")).toBeInTheDocument()
  })

  it("'높음' 우선순위 선택 후 Todo 추가 → '높음' 배지 표시", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.click(screen.getByRole("button", { name: "할 일 추가" }))
    await user.click(screen.getByRole("radio", { name: "높음" }))

    const input = screen.getByLabelText("할 일")
    await user.type(input, "긴급 작업")
    await user.click(screen.getByRole("button", { name: "추가" }))

    expect(screen.getByText("높음")).toBeInTheDocument()
  })

  it("'낮음' 우선순위 선택 후 Todo 추가 → '낮음' 배지 표시", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.click(screen.getByRole("button", { name: "할 일 추가" }))
    await user.click(screen.getByRole("radio", { name: "낮음" }))

    const input = screen.getByLabelText("할 일")
    await user.type(input, "나중에 할 일")
    await user.click(screen.getByRole("button", { name: "추가" }))

    expect(screen.getByText("낮음")).toBeInTheDocument()
  })

  it("서로 다른 우선순위의 Todo를 추가하면 각각의 배지가 표시됨", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    // 높음 우선순위로 추가
    await user.click(screen.getByRole("button", { name: "할 일 추가" }))
    await user.click(screen.getByRole("radio", { name: "높음" }))
    await user.type(screen.getByLabelText("할 일"), "긴급")
    await user.click(screen.getByRole("button", { name: "추가" }))

    // 낮음 우선순위로 추가
    await user.click(screen.getByRole("button", { name: "할 일 추가" }))
    await user.click(screen.getByRole("radio", { name: "낮음" }))
    await user.type(screen.getByLabelText("할 일"), "여유")
    await user.click(screen.getByRole("button", { name: "추가" }))

    expect(screen.getByText("긴급")).toBeInTheDocument()
    expect(screen.getByText("여유")).toBeInTheDocument()
    expect(screen.getByText("높음")).toBeInTheDocument()
    expect(screen.getByText("낮음")).toBeInTheDocument()
  })

  it("description이 있는 Todo → text 아래에 description 표시", async () => {
    // localStorage에 description이 포함된 todo를 미리 저장
    const todos = [
      {
        id: "1",
        text: "읽을거리",
        completed: false,
        priority: "normal",
        createdAt: Date.now(),
        description: "흥미로운 글 요약",
      },
    ]
    localStorage.setItem("todos", JSON.stringify(todos))

    render(<TodoApp />)

    expect(screen.getByText("읽을거리")).toBeInTheDocument()
    expect(screen.getByText("흥미로운 글 요약")).toBeInTheDocument()
  })

  it("URL 입력 후 추가 → 메타데이터가 description으로 표시", async () => {
    // fetch mock: API 응답
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ title: "Example Domain", description: "테스트 설명" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )

    const user = userEvent.setup()
    render(<TodoApp />)

    await user.click(screen.getByRole("button", { name: "할 일 추가" }))
    await user.type(screen.getByLabelText("할 일"), "읽기")
    await user.type(screen.getByLabelText("URL"), "https://example.com")
    await user.click(screen.getByRole("button", { name: "메타데이터 가져오기" }))

    // 메타데이터 로드 후 다이얼로그 안에 표시 확인
    await waitFor(() => {
      expect(screen.getByText("Example Domain - 테스트 설명")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: "추가" }))

    // 목록에 description이 표시됨
    expect(screen.getByText("읽기")).toBeInTheDocument()
    expect(screen.getByText("Example Domain - 테스트 설명")).toBeInTheDocument()

    vi.restoreAllMocks()
  })

  it("URL 메타데이터 가져오기 실패 시 에러 메시지 표시", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "메타데이터를 가져올 수 없습니다" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    )

    const user = userEvent.setup()
    render(<TodoApp />)

    await user.click(screen.getByRole("button", { name: "할 일 추가" }))
    await user.type(screen.getByLabelText("URL"), "https://invalid-url.com")
    await user.click(screen.getByRole("button", { name: "메타데이터 가져오기" }))

    await waitFor(() => {
      expect(screen.getByText("메타데이터를 가져올 수 없습니다")).toBeInTheDocument()
    })

    vi.restoreAllMocks()
  })

  it("페이지 새로고침 → 기존 목록 유지 (localStorage 영속성)", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<TodoApp />)

    await openDialogAndType(user, "장보기")
    await user.click(screen.getByRole("button", { name: "추가" }))
    expect(screen.getByText("장보기")).toBeInTheDocument()

    // 컴포넌트 언마운트 (페이지 떠남 시뮬레이션)
    unmount()

    // 새로 렌더링 (페이지 새로고침 시뮬레이션)
    render(<TodoApp />)

    expect(screen.getByText("장보기")).toBeInTheDocument()
  })
})
