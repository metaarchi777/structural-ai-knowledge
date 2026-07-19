/**
 * LeftPanel.tsx
 * Strategic Intelligence Dashboard — Left sidebar
 * Category filters + project list + legend
 */
import { NODE_COLORS, NODE_LABELS, GRAPH_NODES, type NodeCategory } from '@/lib/graphData';

interface Props {
  activeCategories: Set<NodeCategory>;
  onToggleCategory: (cat: NodeCategory) => void;
}

const ALL_CATEGORIES: NodeCategory[] = [
  'project', 'structure', 'design-phase', 'member', 'load', 'ai', 'standard', 'tool', 'document', 'special',
];

const CATEGORY_ICONS: Record<NodeCategory, string> = {
  project: '◈',
  structure: '⬡',
  'design-phase': '▷',
  member: '⬛',
  load: '↓',
  ai: '✦',
  standard: '⊞',
  tool: '⚙',
  document: '📄',
  special: '⚠',
};

export default function LeftPanel({ activeCategories, onToggleCategory }: Props) {
  const counts = Object.fromEntries(
    ALL_CATEGORIES.map(cat => [cat, GRAPH_NODES.filter(n => n.category === cat).length])
  );

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col gap-4 p-4 overflow-y-auto"
      style={{
        background: 'rgba(11, 16, 30, 0.97)',
        borderRight: '1px solid rgba(0,212,255,0.12)',
      }}
    >
      {/* Title */}
      <div className="pt-2">
        <p className="text-xs font-mono-data uppercase tracking-widest" style={{ color: '#00d4ff', opacity: 0.7 }}>
          Knowledge Graph
        </p>
        <h2 className="font-display text-lg font-bold mt-1" style={{ color: '#e2e8f0' }}>
          구조설계 지식 체계
        </h2>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(0,212,255,0.1)' }} />

      {/* Category filters */}
      <div>
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#64748b' }}>
          카테고리 필터
        </p>
        <div className="flex flex-col gap-1.5">
          {ALL_CATEGORIES.map(cat => {
            const active = activeCategories.has(cat);
            const color = NODE_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className="flex items-center gap-2.5 px-3 py-2 rounded transition-all text-left"
                style={{
                  background: active ? color + '18' : 'transparent',
                  border: `1px solid ${active ? color + '50' : 'transparent'}`,
                  opacity: active ? 1 : 0.45,
                }}
              >
                <span style={{ color, fontSize: '14px', lineHeight: 1 }}>
                  {CATEGORY_ICONS[cat]}
                </span>
                <span className="flex-1 text-sm" style={{ color: active ? '#e2e8f0' : '#94a3b8' }}>
                  {NODE_LABELS[cat]}
                </span>
                <span
                  className="text-xs font-mono-data px-1.5 py-0.5 rounded"
                  style={{ background: color + '22', color }}
                >
                  {counts[cat]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(0,212,255,0.1)' }} />

      {/* AI Roadmap phases */}
      <div>
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#64748b' }}>
          AI 로드맵
        </p>
        {[
          { phase: 1, label: 'Phase 1', sub: 'DB화·업무 표준화', period: '0~12개월', color: '#10b981' },
          { phase: 2, label: 'Phase 2', sub: '자동화 기반 구축', period: '12~24개월', color: '#00d4ff' },
          { phase: 3, label: 'Phase 3', sub: '지능형 설계 보조', period: '24~36개월', color: '#7c3aed' },
        ].map(p => (
          <div
            key={p.phase}
            className="flex items-start gap-3 mb-3 p-2.5 rounded"
            style={{ background: p.color + '10', border: `1px solid ${p.color}25` }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold font-display mt-0.5"
              style={{ background: p.color + '30', color: p.color, border: `1px solid ${p.color}60` }}
            >
              {p.phase}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: p.color }}>{p.label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#cbd5e1' }}>{p.sub}</p>
              <p className="text-xs mt-0.5 font-mono-data" style={{ color: '#64748b' }}>{p.period}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ height: '1px', background: 'rgba(0,212,255,0.1)' }} />
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '프로젝트', value: '5+', color: '#00d4ff' },
          { label: 'AI 과제', value: '9', color: '#7c3aed' },
          { label: '구조 부재', value: '5', color: '#f59e0b' },
          { label: '설계 단계', value: '4', color: '#10b981' },
        ].map(s => (
          <div
            key={s.label}
            className="p-2 rounded text-center"
            style={{ background: s.color + '10', border: `1px solid ${s.color}25` }}
          >
            <p className="text-lg font-bold font-display" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
