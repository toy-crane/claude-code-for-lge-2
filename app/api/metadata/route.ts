// URL 메타데이터 추출 API Route
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: Request) {
  const body = await request.json()
  const { url } = body

  if (!url || typeof url !== "string") {
    return Response.json({ error: "URL이 필요합니다" }, { status: 400 })
  }

  try {
    const { stdout } = await execAsync(`defuddle parse ${JSON.stringify(url)} --json`)
    const parsed = JSON.parse(stdout)
    return Response.json({
      title: parsed.title || "",
      description: parsed.description || "",
    })
  } catch {
    return Response.json({ error: "메타데이터를 가져올 수 없습니다" }, { status: 500 })
  }
}
