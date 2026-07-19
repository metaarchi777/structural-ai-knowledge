# AI 구조설계 지식 그래프 — 디자인 아이디어

## 세 가지 스타일 접근

### 1. Obsidian Dark Graph (확률: 0.07)
어두운 배경 위 발광하는 노드-링크 그래프. 지식 탐험의 느낌.

### 2. Engineering Blueprint (확률: 0.02)
청사진 스타일. 기술적 정밀함과 전문성 강조.

### 3. Strategic Intelligence Dashboard (확률: 0.08)
딥 네이비 + 시안 액센트. 임원 보고용 고급 인텔리전스 대시보드.

---

## 선택: Strategic Intelligence Dashboard

### Design Movement
**Data-Driven Executive Intelligence** — Bloomberg Terminal meets Obsidian Graph View. 어두운 배경 위 빛나는 데이터 노드, 군사적 정밀함과 기술적 우아함의 결합.

### Core Principles
1. **Dark Authority**: 깊은 네이비/차콜 배경으로 전문성과 신뢰감 표현
2. **Luminous Data**: 노드와 연결선이 어둠 속에서 빛나는 효과
3. **Structured Hierarchy**: 좌측 사이드바 + 중앙 그래프 + 우측 상세패널의 3단 구조
4. **Precision Motion**: 노드 호버 시 파급 효과, 클릭 시 포커스 전환

### Color Philosophy
- **배경**: `#0a0e1a` (딥 네이비 블랙) — 권위와 집중
- **주요 노드**: `#00d4ff` (일렉트릭 시안) — AI/기술 에너지
- **구조설계 노드**: `#ff6b35` (엔지니어링 오렌지) — 전문성
- **AI 노드**: `#7c3aed` (딥 퍼플) — 혁신
- **연결선**: `rgba(0, 212, 255, 0.3)` — 관계의 흐름
- **텍스트**: `#e2e8f0` — 가독성
- **Signature Brand Color**: `#00d4ff` (Electric Cyan)

### Layout Paradigm
- **좌측 패널 (280px)**: 카테고리 필터 + 프로젝트 목록 + 범례
- **중앙 캔버스 (flex-1)**: D3.js 인터랙티브 포스-다이렉티드 그래프
- **우측 패널 (320px)**: 선택된 노드 상세정보 + AI 적용 방안
- **상단 헤더**: 로고 + 제목 + 뷰 전환 버튼

### Signature Elements
1. **Glowing Nodes**: 노드에 `box-shadow` + `filter: drop-shadow` 발광 효과
2. **Animated Connections**: 연결선 따라 흐르는 점선 애니메이션 (데이터 흐름 표현)
3. **Blueprint Grid**: 배경에 미세한 그리드 패턴 (엔지니어링 감성)

### Interaction Philosophy
- 노드 클릭 → 우측 패널에 상세 정보 슬라이드인
- 카테고리 필터 → 관련 노드 하이라이트, 나머지 페이드아웃
- 줌/패닝 → 자연스러운 그래프 탐색
- 호버 → 연결된 노드들 강조 표시

### Animation
- 초기 로드: 노드들이 중심에서 퍼져나가는 폭발 효과 (600ms ease-out)
- 필터 전환: 300ms fade + scale
- 패널 슬라이드: 250ms cubic-bezier(0.23, 1, 0.32, 1)
- 연결선 흐름: 2s linear 무한 반복 대시 애니메이션

### Typography System
- **Display**: `Rajdhani` (기술적 엔지니어링 느낌, 헤더용)
- **Body**: `Noto Sans KR` (한국어 가독성)
- **Data**: `JetBrains Mono` (수치/코드 표시)
- **Hierarchy**: Display 700 → Body 400/500 → Mono 400

### Brand Essence
**"구조설계의 지식을 AI로 연결한다"** — 구조 엔지니어와 기술 리더를 위한 전략적 지식 플랫폼. 정밀(Precise), 혁신적(Innovative), 신뢰할 수 있는(Authoritative).

### Brand Voice
- 헤드라인: "구조설계의 미래를 설계합니다" / "AI가 바꾸는 엔지니어링의 패러다임"
- CTA: "지식 그래프 탐색하기" / "AI 로드맵 보기"
- 금지어: "환영합니다", "시작하기", "더 알아보기"

### Wordmark & Logo
구조물의 절점(Node)을 형상화한 기하학적 심볼 — 삼각형 트러스 구조에서 영감받은 연결된 점들.

## Style Decisions
- 다크 테마 전용 (라이트 모드 없음) — 임원 발표 환경 최적화
- 한국어 우선, 영문 병기
- 모바일 대응보다 데스크탑 프레젠테이션 최적화
