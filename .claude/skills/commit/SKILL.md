---
name: commit
description: Conventional Commit 형식으로 변경사항을 커밋합니다. 코드 변경 후 커밋 요청, "커밋해줘", "변경사항 정리해줘" 요청 시 사용. 단순 git 명령어 질문에는 사용하지 않음.
---

# Commit Skill

## 커밋 절차

1. `git status`와 `git diff --staged`를 실행하여 전체 상태를 파악합니다
2. 스테이징된 변경이 없으면 `git diff`와 `git status`를 기반으로 수정된 파일 및 untracked 파일을 확인하고 관련 파일을 스테이징합니다
3. 변경 내용을 분석하여 Conventional Commit 형식으로 커밋 메시지를 작성하고 자동으로 커밋합니다

## 커밋 메시지 규칙

- 형식: <type>(<scope>): <description>
- type: feat, fix, refactor, test, docs, chore
- scope: 변경된 주요 모듈/컴포넌트 이름
- description: 영어, 소문자, 현재형, 50자 이내

## 예시

- feat(todo): add filter tabs for completion status
- fix(todo-item): resolve checkbox toggle not persisting
