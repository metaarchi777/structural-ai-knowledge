# AI 구조설계 지식 그래프 (Structural AI Knowledge Graph)

구조설계 분야의 AI 적용 전략과 지식 체계(온톨로지)를 은하계 형태의 인터랙티브 그래프로 시각화한 웹 애플리케이션입니다.

- **73개 노드 / 127개 링크** — 프로젝트, 구조 시스템, 설계 단계, 구조 부재, 설계 하중, AI 적용, 설계 기준, 소프트웨어, 설계 문서, 특수 검토의 10개 카테고리
- 순수 정적 사이트 (백엔드 없음) — GitHub Pages에 바로 배포 가능

## 기능

- **은하계 공전 애니메이션**: AI 구조설계 허브를 중심으로 노드들이 타원 궤도로 공전
- **위키 스타일 상세 패널**: 노드 클릭 시 오른쪽에 상세 정보 표시
- **드래그 이동**: 노드를 드래그하여 자유롭게 이동 (더블클릭으로 궤도 복귀)
- **카테고리 필터 / 검색**: 카테고리별 필터링, 노드 검색
- **줌/팬**: 스크롤로 줌, 빈 공간 드래그로 화면 이동

## 온톨로지 데이터 수정

모든 노드·링크 데이터는 단일 파일에 정의되어 있습니다:

```
client/src/lib/graphData.ts
```

- `GRAPH_NODES`: 노드 배열 (`id`, `label`, `category`, `size`, `description`, `details`, `aiOpportunity`, `phase`)
- `GRAPH_LINKS`: 링크 배열 (`source`, `target`, `label`, `strength`) — source/target은 반드시 존재하는 노드 `id`를 참조해야 합니다
- 새 카테고리를 추가할 경우 `NodeCategory` 타입, `NODE_COLORS`, `NODE_LABELS`에 함께 등록하세요

## GitHub Pages 배포

### 자동 배포 (권장)

1. 이 저장소를 GitHub에 push 합니다
2. GitHub 저장소 → **Settings** → **Pages** → Source를 **GitHub Actions**로 변경
3. `main` 브랜치에 push 하면 자동으로 빌드·배포됩니다 (`.github/workflows/deploy.yml`)
4. 배포 URL: `https://{username}.github.io/{repo-name}/`

저장소 이름은 워크플로가 자동으로 감지하여 base path에 반영하므로 별도 설정이 필요 없습니다.

### 수동 빌드

```bash
pnpm install
VITE_BASE_PATH=/{repo-name}/ pnpm run build   # 결과물: dist/
```

## 로컬 개발

요구 사항: Node.js 22 이상, pnpm 10

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm run check  # 타입 검사
pnpm run build  # 프로덕션 빌드
```

## 기술 스택

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4** + **shadcn/ui**
- **Canvas API** (은하계 그래프 렌더링)
- **Recharts** (통계 차트)

## 라이선스

MIT
