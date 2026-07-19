/**
 * RoadmapView.tsx
 * AI 로드맵 타임라인 뷰
 */
import { GRAPH_NODES } from '@/lib/graphData';

export default function RoadmapView() {
  const phases = [
    {
      id: 1,
      label: 'Phase 1',
      title: '설계자료 DB화 및 업무 표준화',
      period: '0 ~ 12개월',
      color: '#10b981',
      bg: '#10b98112',
      tasks: [
        { title: '설계자료 DB화', desc: '구조설계·현장지원·안전진단 업무의 설계자료 데이터 확보. 초고층·데이터센터·대공간·아파트 기존 구조설계도서 데이터 구축 및 우선순위 결정', impact: '지식 자산 기반 구축' },
        { title: '업무 표준화', desc: '업무 전 과정에 걸쳐 세분화하고 표준화하여 정의. AI 자동화를 위한 업무 단위 분해', impact: 'AI 학습 데이터 품질 향상' },
        { title: '업무 스킬화', desc: '암묵지의 형식화 — 숙련 엔지니어의 노하우를 문서화·데이터화하여 AI 학습 가능한 형태로 변환', impact: '조직 지식 자산화' },
        { title: '업무 담당자 조직 구성', desc: 'AI 구조설계 TF 구성. 구조설계팀 + IT/AI 파트너 협력 체계 및 역할 정의', impact: 'TF 운영 체계 확립' },
      ],
    },
    {
      id: 2,
      label: 'Phase 2',
      title: '자동화 기반 구축',
      period: '12 ~ 24개월',
      color: '#00d4ff',
      bg: '#00d4ff12',
      tasks: [
        { title: '구조시스템 대안 AI 검토', desc: 'Phase 1 DB 기반으로 용도별 구조 시스템 대안을 AI가 자동 비교·검토하여 최적안 제시', impact: '기획 기간 50% 단축' },
        { title: '기존 DB 기반 가정단면 추출 자동화', desc: '유사 프로젝트 DB에서 가정단면 자동 추출. 초기 구조 계획 시간 대폭 단축', impact: '가정단면 산정 80% 자동화' },
        { title: '세분화된 구조설계 업무 자동화', desc: '설계하중 자동 산정, 구조해석용 모델링 자동화 등 표준화된 업무 단위별 자동화 적용', impact: '반복 업무 80% 자동화' },
        { title: '세분화된 안전진단 업무 자동화', desc: '철근배근탐사 판독 및 보고서 AI 자동화. 안전진단 현장 데이터 자동 분석·보고서 생성', impact: '안전진단 보고서 70% 자동화' },
      ],
    },
    {
      id: 3,
      label: 'Phase 3',
      title: '지능형 설계 보조',
      period: '24 ~ 36개월',
      color: '#7c3aed',
      bg: '#7c3aed12',
      tasks: [
        { title: '부재 단면 최적화 AI 검토', desc: '슬래브·보·기둥·벽체 단면을 AI가 자동 최적화. 재료비 절감 및 구조 성능 극대화', impact: '재료비 10~15% 절감' },
        { title: '설계 변경 내용 AI 검토', desc: '설계 변경 사항 발생 시 AI가 영향 범위 자동 분석 및 검토 의견 제시', impact: '변경 대응 시간 95% 단축' },
        { title: '구조설계 기준 적합여부 AI 검토', desc: 'KDS·건축구조기준 등 설계 기준 준수 여부를 AI가 자동 검토. RAG 기반 기준 검색 연동', impact: '기준 검토 오류 90% 감소' },
        { title: '구조도면-구조설계 일치여부 AI 검토', desc: '구조도면과 구조계산서의 일치 여부를 AI가 자동 비교·검증. 도면 오류 자동 탐지', impact: '도면 오류 80% 자동 탐지' },
      ],
    },
  ];

  const aiNodes = GRAPH_NODES.filter(n => n.category === 'ai' && n.phase);

  return (
    <div className="flex-1 overflow-y-auto p-6 blueprint-grid">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest font-mono-data mb-2" style={{ color: '#00d4ff', opacity: 0.7 }}>
            AI Roadmap
          </p>
          <h2 className="font-display text-3xl font-bold" style={{ color: '#f1f5f9' }}>
            AI 활용 구조설계 로드맵
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#64748b' }}>
            데이터센터를 파일럿으로 시작하여 아파트·초고층·대공간으로 확대하는 3단계 전략
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, #10b981, #00d4ff, #7c3aed)' }}
          />

          <div className="flex flex-col gap-10">
            {phases.map((phase, pi) => (
              <div key={phase.id} className="relative pl-20">
                {/* Phase circle */}
                <div
                  className="absolute left-4 top-0 w-9 h-9 rounded-full flex items-center justify-center font-display text-lg font-bold"
                  style={{
                    background: phase.bg,
                    border: `2px solid ${phase.color}`,
                    color: phase.color,
                    boxShadow: `0 0 20px ${phase.color}40`,
                    transform: 'translateX(-50%)',
                    left: '2rem',
                  }}
                >
                  {phase.id}
                </div>

                {/* Phase header */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display text-xl font-bold" style={{ color: phase.color }}>
                      {phase.label}
                    </span>
                    <span className="text-lg font-semibold" style={{ color: '#f1f5f9' }}>
                      {phase.title}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded font-mono-data"
                      style={{ background: phase.bg, color: phase.color, border: `1px solid ${phase.color}40` }}
                    >
                      {phase.period}
                    </span>
                  </div>
                </div>

                {/* Tasks grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {phase.tasks.map((task, ti) => (
                    <div
                      key={ti}
                      className="p-4 rounded-lg"
                      style={{
                        background: phase.bg,
                        border: `1px solid ${phase.color}25`,
                        animationDelay: `${pi * 200 + ti * 80}ms`,
                      }}
                    >
                      <h4 className="text-sm font-semibold mb-1" style={{ color: '#e2e8f0' }}>
                        {task.title}
                      </h4>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: '#64748b' }}>
                        {task.desc}
                      </p>
                      <div
                        className="text-xs px-2 py-1 rounded font-mono-data"
                        style={{ background: phase.color + '15', color: phase.color }}
                      >
                        → {task.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4대 영역 확장 */}
        <div className="mt-12 p-6 rounded-xl" style={{ background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <h3 className="font-display text-xl font-bold mb-4" style={{ color: '#00d4ff' }}>
            4대 구조설계 영역 확장 전략
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '데이터센터', status: '파일럿', color: '#00d4ff', desc: '장스팬·고하중·복합구조', order: '1순위' },
              { label: '아파트', status: '2단계', color: '#10b981', desc: '표준화·반복구조·배근도', order: '2순위' },
              { label: '초고층', status: '3단계', color: '#f59e0b', desc: '풍하중·지진·아웃리거', order: '3순위' },
              { label: '대공간', status: '4단계', color: '#7c3aed', desc: '트러스·케이블·형태최적화', order: '4순위' },
            ].map(d => (
              <div
                key={d.label}
                className="p-4 rounded-lg text-center"
                style={{ background: d.color + '10', border: `1px solid ${d.color}30` }}
              >
                <div className="text-xs font-mono-data mb-1" style={{ color: d.color }}>{d.order}</div>
                <div className="font-display text-base font-bold mb-1" style={{ color: '#f1f5f9' }}>{d.label}</div>
                <div
                  className="text-xs px-2 py-0.5 rounded mb-2 inline-block"
                  style={{ background: d.color + '20', color: d.color }}
                >
                  {d.status}
                </div>
                <p className="text-xs" style={{ color: '#64748b' }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
