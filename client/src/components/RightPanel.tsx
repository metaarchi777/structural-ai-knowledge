/**
 * RightPanel.tsx
 * LLM Wiki Style — Wikipedia meets Obsidian meets Bloomberg Terminal
 * Tabs: 개요 | 설계 데이터 | AI 적용 | 연결
 */
import { useState } from 'react';
import { NODE_COLORS, NODE_LABELS, GRAPH_LINKS, GRAPH_NODES, type GraphNode } from '@/lib/graphData';
import { X, ChevronRight, ExternalLink, Database, Cpu, Link2, BookOpen } from 'lucide-react';

interface Props {
  node: GraphNode | null;
  onClose: () => void;
  onNodeSelect: (node: GraphNode) => void;
}

type Tab = 'overview' | 'data' | 'ai' | 'links';

const PHASE_COLORS = ['', '#10b981', '#00d4ff', '#a78bfa'];
const PHASE_LABELS = ['', 'Phase 1', 'Phase 2', 'Phase 3'];

function EmptyState() {
  return (
    <aside
      className="w-80 flex-shrink-0 flex flex-col items-center justify-center p-8"
      style={{ background: 'rgba(8,13,26,0.98)', borderLeft: '1px solid rgba(0,212,255,0.10)' }}
    >
      <div className="text-center" style={{ opacity: 0.45 }}>
        <div style={{ fontSize: 40, color: '#00d4ff', marginBottom: 12 }}>◈</div>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
          노드를 클릭하면<br />위키 스타일 상세 정보가<br />표시됩니다
        </p>
        <div style={{ marginTop: 20, padding: '8px 12px', background: 'rgba(0,212,255,0.06)', borderRadius: 4, border: '1px solid rgba(0,212,255,0.15)' }}>
          <p style={{ color: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
            드래그로 노드 이동 가능<br />스크롤로 줌 조절
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function RightPanel({ node, onClose, onNodeSelect }: Props) {
  const [tab, setTab] = useState<Tab>('overview');

  if (!node) return <EmptyState />;

  const color = NODE_COLORS[node.category];

  // Connected nodes
  const connectedIds = new Set<string>();
  const linkLabels: Record<string, string> = {};
  GRAPH_LINKS.forEach(l => {
    const src = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
    const tgt = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
    if (src === node.id) { connectedIds.add(tgt); if (l.label) linkLabels[tgt] = l.label; }
    if (tgt === node.id) { connectedIds.add(src); if (l.label) linkLabels[src] = l.label; }
  });
  const connectedNodes = GRAPH_NODES.filter(n => connectedIds.has(n.id));

  const hasData = node.details && Object.keys(node.details).length > 0;
  const hasAI = !!node.aiOpportunity;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
    { id: 'overview', label: '개요', icon: <BookOpen size={12} /> },
    { id: 'data', label: '데이터', icon: <Database size={12} />, disabled: !hasData },
    { id: 'ai', label: 'AI 적용', icon: <Cpu size={12} />, disabled: !hasAI },
    { id: 'links', label: `연결 (${connectedNodes.length})`, icon: <Link2 size={12} /> },
  ];

  return (
    <aside
      className="w-80 flex-shrink-0 flex flex-col overflow-hidden"
      style={{ background: 'rgba(8,13,26,0.98)', borderLeft: `1px solid ${color}25` }}
    >
      {/* ── Header ── */}
      <div className="flex-shrink-0 p-4" style={{ borderBottom: `1px solid ${color}18` }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: color + '1a', color, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}
              >
                {NODE_LABELS[node.category]}
              </span>
              {node.phase && (
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: PHASE_COLORS[node.phase] + '1a', color: PHASE_COLORS[node.phase], fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}
                >
                  {PHASE_LABELS[node.phase]}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold mt-2 leading-tight" style={{ color: '#f1f5f9', fontFamily: "'Noto Sans KR', sans-serif" }}>
              {node.label}
            </h3>
            {node.labelEn && (
              <p className="text-xs mt-0.5" style={{ color: '#8fa8c0', fontFamily: 'JetBrains Mono, monospace' }}>{node.labelEn}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded flex-shrink-0 transition-colors"
            style={{ color: '#64748b' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            <X size={14} />
          </button>
        </div>
        {/* Importance bar */}
        <div className="flex gap-1 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i < node.size ? color : color + '1a' }} />
          ))}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex-shrink-0 flex" style={{ borderBottom: `1px solid rgba(0,212,255,0.08)` }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => !t.disabled && setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-xs transition-colors"
            style={{
              color: t.disabled ? '#2d3748' : tab === t.id ? color : '#64748b',
              borderBottom: tab === t.id ? `2px solid ${color}` : '2px solid transparent',
              background: tab === t.id ? color + '08' : 'transparent',
              cursor: t.disabled ? 'not-allowed' : 'pointer',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
            }}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: `${color}30 transparent` }}>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="p-4 flex flex-col gap-4">
            {/* Description block — wiki-style */}
            <div
              className="p-3 rounded"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}15` }}
            >
              <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1', fontFamily: "'Noto Sans KR', sans-serif" }}>
                {node.description}
              </p>
            </div>

            {/* Quick-fact table (top details) */}
            {hasData && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1" style={{ background: `${color}20` }} />
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>핵심 사양</span>
                  <div className="h-px flex-1" style={{ background: `${color}20` }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(node.details!).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="flex gap-2 items-start">
                      <span className="text-xs flex-shrink-0" style={{ color: '#64748b', minWidth: 72, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{k}</span>
                      <span className="text-xs" style={{ color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{v}</span>
                    </div>
                  ))}
                  {Object.keys(node.details!).length > 4 && (
                    <button
                      onClick={() => setTab('data')}
                      className="flex items-center gap-1 text-xs mt-1"
                      style={{ color: color }}
                    >
                      <span>전체 데이터 보기</span>
                      <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* AI opportunity teaser */}
            {hasAI && (
              <div
                className="p-3 rounded"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Cpu size={12} style={{ color: '#a78bfa' }} />
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>AI 적용 기회</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#c4b5fd', fontFamily: "'Noto Sans KR', sans-serif" }}>
                  {node.aiOpportunity!.length > 80 ? node.aiOpportunity!.slice(0, 80) + '...' : node.aiOpportunity}
                </p>
                <button
                  onClick={() => setTab('ai')}
                  className="flex items-center gap-1 text-xs mt-2"
                  style={{ color: '#a78bfa' }}
                >
                  <span>자세히 보기</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            )}

            {/* Source citation */}
            <div
              className="p-2 rounded flex items-start gap-2"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <ExternalLink size={11} style={{ color: '#475569', flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, lineHeight: 1.5 }}>
                출처: 구글 드라이브<br />[CNP] 데이터센터 폴더
              </p>
            </div>
          </div>
        )}

        {/* DATA TAB */}
        {tab === 'data' && hasData && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database size={13} style={{ color }} />
              <span className="text-xs uppercase tracking-wider" style={{ color, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>설계 데이터 전체</span>
            </div>
            <div className="flex flex-col gap-0" style={{ border: `1px solid ${color}15`, borderRadius: 4, overflow: 'hidden' }}>
              {Object.entries(node.details!).map(([k, v], i) => (
                <div
                  key={k}
                  className="flex gap-3 p-2.5"
                  style={{
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderBottom: i < Object.keys(node.details!).length - 1 ? `1px solid ${color}0d` : 'none',
                  }}
                >
                  <span
                    className="text-xs flex-shrink-0"
                    style={{ color: '#8fa8c0', minWidth: 80, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}
                  >
                    {k}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, wordBreak: 'break-all' }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Source */}
            <div className="mt-3 p-2 rounded flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <ExternalLink size={11} style={{ color: '#475569' }} />
              <span className="text-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>
                구로DC 실시설계 구조계산서 (724p) · ICN062 설계하중표
              </span>
            </div>
          </div>
        )}

        {/* AI TAB */}
        {tab === 'ai' && hasAI && (
          <div className="p-4 flex flex-col gap-4">
            {/* Phase badge */}
            {node.phase && (
              <div
                className="flex items-center gap-3 p-3 rounded"
                style={{ background: PHASE_COLORS[node.phase] + '10', border: `1px solid ${PHASE_COLORS[node.phase]}30` }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: PHASE_COLORS[node.phase] + '20', border: `1px solid ${PHASE_COLORS[node.phase]}` }}>
                  <span className="text-xs font-bold" style={{ color: PHASE_COLORS[node.phase], fontFamily: 'JetBrains Mono, monospace' }}>{node.phase}</span>
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: PHASE_COLORS[node.phase], fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{PHASE_LABELS[node.phase]} 목표</p>
                  <p className="text-xs" style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>
                    {node.phase === 1 ? '0~12개월' : node.phase === 2 ? '12~24개월' : '24~36개월'}
                  </p>
                </div>
              </div>
            )}

            {/* Full AI opportunity */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu size={12} style={{ color: '#a78bfa' }} />
                <span className="text-xs uppercase tracking-wider" style={{ color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>AI 적용 방향</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#c4b5fd', fontFamily: "'Noto Sans KR', sans-serif" }}>
                {node.aiOpportunity}
              </p>
            </div>

            {/* Phase roadmap mini */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1" style={{ background: 'rgba(124,58,237,0.2)' }} />
                <span className="text-xs uppercase tracking-wider" style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>로드맵 위치</span>
                <div className="h-px flex-1" style={{ background: 'rgba(124,58,237,0.2)' }} />
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(p => (
                  <div
                    key={p}
                    className="flex-1 p-2 rounded text-center"
                    style={{
                      background: node.phase === p ? PHASE_COLORS[p] + '18' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${node.phase === p ? PHASE_COLORS[p] + '50' : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    <p className="text-xs font-bold" style={{ color: node.phase === p ? PHASE_COLORS[p] : '#334155', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>P{p}</p>
                    <p className="text-xs" style={{ color: node.phase === p ? PHASE_COLORS[p] + 'cc' : '#1e293b', fontFamily: 'JetBrains Mono, monospace', fontSize: 9 }}>
                      {p === 1 ? 'DB화' : p === 2 ? '자동화' : '지능형'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LINKS TAB */}
        {tab === 'links' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Link2 size={13} style={{ color }} />
              <span className="text-xs uppercase tracking-wider" style={{ color, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>연결된 노드 ({connectedNodes.length})</span>
            </div>
            {connectedNodes.length === 0 ? (
              <p className="text-xs" style={{ color: '#475569' }}>연결된 노드가 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {connectedNodes.map(n => (
                  <button
                    key={n.id}
                    onClick={() => onNodeSelect(n)}
                    className="flex items-center gap-2.5 p-2 rounded text-left w-full transition-colors"
                    style={{ background: NODE_COLORS[n.category] + '0a', border: `1px solid ${NODE_COLORS[n.category]}15` }}
                    onMouseEnter={e => (e.currentTarget.style.background = NODE_COLORS[n.category] + '18')}
                    onMouseLeave={e => (e.currentTarget.style.background = NODE_COLORS[n.category] + '0a')}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: NODE_COLORS[n.category], boxShadow: `0 0 6px ${NODE_COLORS[n.category]}` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: '#e2e8f0', fontFamily: "'Noto Sans KR', sans-serif" }}>{n.label}</p>
                      <p className="text-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{NODE_LABELS[n.category]}{linkLabels[n.id] ? ` · ${linkLabels[n.id]}` : ''}</p>
                    </div>
                    <ChevronRight size={12} style={{ color: '#475569', flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
