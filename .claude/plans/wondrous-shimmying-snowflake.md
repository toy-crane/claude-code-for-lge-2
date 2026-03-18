# Stop Hook: command 타입으로 테스트 통과 강제

## Context

현재 Stop 훅은 `prompt` 타입으로 경량 LLM이 종료 여부를 판단한다. 이 방식은 실제 테스트를 실행하지 않으므로 테스트 통과를 보장할 수 없다. `command` 타입으로 변경하여 `bun test`를 실행하고, 실패 시 Claude를 차단한다.

**트레이드오프**: TDD RED 단계를 별도 턴으로 분리하는 워크플로우는 포기. 대신 "테스트 작성 + 구현"을 한 턴에 요청하는 방식으로 전환.

## 변경 사항

### 1. `.claude/hooks/test-gate.sh` 생성

```bash
#!/bin/bash

# 무한 루프 방지: 재시도 카운터
COUNTER_FILE="/tmp/claude-test-gate-retry"
COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

if [ "$COUNT" -ge 3 ]; then
  echo "3회 재시도 후에도 테스트 실패. 사용자 개입 필요." >&2
  rm -f "$COUNTER_FILE"
  exit 0
fi

# 테스트 실행
if bun test 2>/tmp/test-gate.err; then
  rm -f "$COUNTER_FILE"
  exit 0
else
  echo "테스트 실패 (시도 $COUNT/3):" >&2
  tail -30 /tmp/test-gate.err >&2
  exit 2
fi
```

- 기존 `lint.sh`의 exit code 패턴(0=통과, 2=차단)을 동일하게 따름
- 무한루프 방지를 위해 3회 재시도 제한

### 2. `.claude/settings.json` Stop 훅 변경

기존 `prompt` 타입 → `command` 타입으로 교체:

```json
"Stop": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "\"$(git rev-parse --show-toplevel)\"/.claude/hooks/test-gate.sh",
        "timeout": 120
      }
    ]
  }
]
```

### 3. CLAUDE.md 워크플로우 업데이트

RED/GREEN 분리 워크플로우를 한 턴 통합 방식으로 수정:

```markdown
## Development Workflow
- Red Green Refactor 사이클을 따른다
- 한 번에 하나의 테스트만 작성하고, 구현까지 완료한 뒤 다음 테스트로 넘어간다
- 하나의 기능이 끝날 때마다 커밋한다
- Stop hook이 테스트 통과를 강제하므로, 테스트와 구현을 한 턴에 처리한다
```

## 수정 대상 파일

- `.claude/hooks/test-gate.sh` (신규)
- `.claude/settings.json` (수정)
- `CLAUDE.md` (수정)

## 검증 방법

1. `chmod +x .claude/hooks/test-gate.sh`로 실행 권한 부여
2. 테스트가 통과하는 상태에서 Claude 종료 → 정상 종료 확인
3. 의도적으로 실패하는 테스트 추가 후 Claude 종료 → 차단되는지 확인
