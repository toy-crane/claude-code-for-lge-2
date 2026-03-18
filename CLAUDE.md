# Todo App

## Architecture
Server Components 우선, 클라이언트 상태는 최소화.

## Workflow
- 패키지 매니저: bun
- 커밋 메시지: Conventional Commits (feat:, fix:, refactor:)

## Development Workflow
- Red Green Refactor 사이클을 따른다
- 한 번에 하나의 테스트만 작성하고, 구현까지 완료한 뒤 다음 테스트로 넘어간다
- 하나의 기능이 끝날 때마다 커밋한다
- Stop hook이 테스트 통과를 강제하므로, 테스트와 구현을 한 턴에 처리한다

## Plan Mode
- 계획 끝에 미해결 질문을 포함하세요

## Rules
- 모든 대화에서 한글만 사용