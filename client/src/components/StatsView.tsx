/**
 * StatsView.tsx
 * 현황 분석 뷰 — 프로젝트 현황 및 AI 적용 효과 예측
 */
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell } from 'recharts';

export default function StatsView() {
  const timeReduction = [
    { task: '설계하중 산정', before: 5, after: 0.5, unit: '일' },
    { task: '구조계산서 작성', before: 5, after: 0.5, unit: '일' },
    { task: '구조해석 모델링', before: 10, after: 2, unit: '일' },
    { task: '배근도 작성', before: 10, after: 1.5, unit: '일' },
    { task: '설계 변경 대응', before: 2, after: 0.1, unit: '일' },
    { task: '기준 검색', before: 1, after: 0.05, unit: '일' },
  ];

  const aiReadiness = [
    { subject: '데이터 축적', A: 90 },
    { subject: '반복성', A: 85 },
    { subject: '표준화', A: 80 },
    { subject: '자동화 가능성', A: 88 },
    { subject: '경제성', A: 92 },
    { subject: '기술 성숙도', A: 75 },
  ];

  const CYAN = '#00d4ff';
  const ORANGE = '#ff6b35';

  return (
    <div className="flex-1 overflow-y-auto p-6 blueprint-grid">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest font-mono-data mb-2" style={{ color: '#00d4ff', opacity: 0.7 }}>
            Analysis
          </p>
          <h2 className="font-display text-3xl font-bold" style={{ color: '#f1f5f9' }}>
            AI 도입 효과 분석
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#64748b' }}>
            데이터센터 구조설계 업무 기준 AI 도입 전·후 비교
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '설계 기간 단축', value: '50%', sub: '실시설계 기준', color: CYAN },
            { label: '설계 오류 감소', value: '70%', sub: '체크리스트 AI', color: '#10b981' },
            { label: '처리 프로젝트', value: '3×', sub: '엔지니어 1인당', color: '#f59e0b' },
            { label: '지식 자산화', value: '∞', sub: '누적 학습 효과', color: '#7c3aed' },
          ].map(kpi => (
            <div
              key={kpi.label}
              className="p-5 rounded-xl text-center"
              style={{ background: kpi.color + '10', border: `1px solid ${kpi.color}30` }}
            >
              <div className="font-display text-4xl font-bold mb-1" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className="text-sm font-semibold mb-1" style={{ color: '#e2e8f0' }}>{kpi.label}</div>
              <div className="text-xs" style={{ color: '#64748b' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bar chart */}
          <div className="p-5 rounded-xl" style={{ background: 'rgba(15,22,41,0.9)', border: '1px solid rgba(0,212,255,0.12)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#e2e8f0' }}>업무별 소요 시간 비교 (일)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={timeReduction} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} />
                <YAxis type="category" dataKey="task" tick={{ fill: '#94a3b8', fontSize: 10 }} width={90} />
                <Tooltip
                  contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="before" name="현재" fill={ORANGE} opacity={0.7} radius={[0, 3, 3, 0]} />
                <Bar dataKey="after" name="AI 도입 후" fill={CYAN} opacity={0.9} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 justify-center">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
                <div className="w-3 h-3 rounded" style={{ background: ORANGE }} />현재
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
                <div className="w-3 h-3 rounded" style={{ background: CYAN }} />AI 도입 후
              </div>
            </div>
          </div>

          {/* Radar chart */}
          <div className="p-5 rounded-xl" style={{ background: 'rgba(15,22,41,0.9)', border: '1px solid rgba(0,212,255,0.12)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#e2e8f0' }}>데이터센터 AI 도입 준비도</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={aiReadiness}>
                <PolarGrid stroke="rgba(0,212,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="준비도" dataKey="A" stroke={CYAN} fill={CYAN} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project table */}
        <div className="p-5 rounded-xl" style={{ background: 'rgba(15,22,41,0.9)', border: '1px solid rgba(0,212,255,0.12)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#e2e8f0' }}>데이터센터 프로젝트 현황</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
                  {['프로젝트명', '규모', '구조방식', '설계 단계', 'AI 적용 우선순위'].map(h => (
                    <th key={h} className="text-left py-2 px-3 font-semibold" style={{ color: '#475569' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: '구로 데이터센터', scale: 'B5/F8', struct: 'RC+철골+SRC+PT', phase: '착공 완료', priority: '★★★★★' },
                  { name: '인천 가좌 테크센터', scale: 'B1/F8+부속동', struct: 'RC+철골+SRC', phase: '실시설계', priority: '★★★★★' },
                  { name: '부평 데이터센터 2단계', scale: '-', struct: 'RC+철골', phase: '실시설계', priority: '★★★★☆' },
                  { name: '김포 데이터센터', scale: '-', struct: 'RC+철골', phase: 'CD100%', priority: '★★★★☆' },
                  { name: '인천 데이터센터', scale: '-', struct: 'RC+철골', phase: '착공도서', priority: '★★★☆☆' },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid rgba(0,212,255,0.06)' }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-medium" style={{ color: '#e2e8f0' }}>{row.name}</td>
                    <td className="py-2.5 px-3 font-mono-data" style={{ color: '#64748b' }}>{row.scale}</td>
                    <td className="py-2.5 px-3" style={{ color: '#94a3b8' }}>{row.struct}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-xs" style={{ background: CYAN + '15', color: CYAN }}>{row.phase}</span>
                    </td>
                    <td className="py-2.5 px-3" style={{ color: '#f59e0b' }}>{row.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
