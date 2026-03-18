# Todo App

Next.js + shadcn/ui 기반의 Todo 앱.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind CSS v4
- **패키지 매니저**: bun
- **테스트**: Vitest + Testing Library
- **상태 저장**: localStorage

## 기능

- Todo 추가 (Enter 키)
- 완료 상태 토글 (체크박스)
- Todo 삭제
- 인라인 편집 (더블클릭)
- 새로고침 후 데이터 유지 (localStorage)
- 필터링 / 검색 / 정렬 / 카테고리

## 시작하기

```bash
bun install
bun dev
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `bun dev` | 개발 서버 실행 (Turbopack) |
| `bun build` | 프로덕션 빌드 |
| `bun test` | 테스트 실행 |
| `bun test:watch` | 테스트 watch 모드 |
| `bun lint` | ESLint 실행 |
| `bun format` | Prettier 포맷팅 |
| `bun typecheck` | TypeScript 타입 검사 |

## UI 컴포넌트 추가

```bash
npx shadcn@latest add button
```

컴포넌트는 `components/ui/` 디렉토리에 위치합니다.

```tsx
import { Button } from "@/components/ui/button";
```
