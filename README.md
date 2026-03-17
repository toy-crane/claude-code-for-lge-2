# claude-code-for-lge-2

Next.js + shadcn/ui 기반 프로젝트입니다.

## 기술 스택

- **Framework**: Next.js 16.1.6 (Turbopack, App Router)
- **UI**: shadcn/ui 4.x, Radix UI, Tailwind CSS 4, lucide-react
- **Language**: TypeScript 5.x
- **Runtime**: React 19
- **Package Manager**: Bun

## 프로젝트 구조

```
├── app/              # Next.js App Router
│   ├── layout.tsx    # 루트 레이아웃
│   ├── page.tsx      # 홈 페이지
│   └── globals.css   # 전역 스타일
├── components/       # 공유 컴포넌트
│   ├── ui/           # shadcn/ui 컴포넌트
│   └── theme-provider.tsx
├── hooks/            # 커스텀 훅
├── lib/              # 유틸리티
│   └── utils.ts      # cn() 등 헬퍼 함수
└── public/           # 정적 파일
```

## 시작하기

```bash
# 의존성 설치
bun install

# 개발 서버 실행
bun dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `bun dev` | 개발 서버 실행 (Turbopack) |
| `bun run build` | 프로덕션 빌드 |
| `bun start` | 프로덕션 서버 실행 |
| `bun run lint` | ESLint 검사 |
| `bun run format` | Prettier 포맷팅 |
| `bun run typecheck` | TypeScript 타입 검사 |

## UI 컴포넌트 추가

```bash
npx shadcn@latest add button
```

추가된 컴포넌트는 `components/ui` 디렉토리에 배치됩니다.
