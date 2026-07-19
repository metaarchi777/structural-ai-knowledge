/**
 * Header.tsx
 * Strategic Intelligence Dashboard — Top navigation bar with search
 */
import { useState, useRef, useEffect } from 'react';
import { Info, Search, X, Waypoints } from 'lucide-react';
import { GRAPH_NODES, type GraphNode } from '@/lib/graphData';

interface Props {
  onSearchSelect: (node: GraphNode | null) => void;
}

export default function Header({ onSearchSelect }: Props) {
  const [showInfo, setShowInfo] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GraphNode[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search logic
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setShowResults(false); return; }
    const matched = GRAPH_NODES.filter(n =>
      n.label.toLowerCase().includes(q) ||
      (n.labelEn?.toLowerCase().includes(q)) ||
      n.description.toLowerCase().includes(q) ||
      (n.aiOpportunity?.toLowerCase().includes(q)) ||
      n.id.toLowerCase().includes(q)
    ).slice(0, 8);
    setResults(matched);
    setShowResults(true);
    setFocusIdx(-1);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (node: GraphNode) => {
    onSearchSelect(node);
    setQuery(node.label);
    setShowResults(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    onSearchSelect(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && focusIdx >= 0) {
      e.preventDefault();
      handleSelect(results[focusIdx]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const CATEGORY_COLORS: Record<string, string> = {
    project: '#00d4ff', structure: '#ff6b35', 'design-phase': '#10b981',
    member: '#f59e0b', load: '#ef4444', ai: '#7c3aed',
    standard: '#64748b', tool: '#0ea5e9', document: '#ec4899', special: '#14b8a6',
  };
  const CATEGORY_LABELS: Record<string, string> = {
    project: '프로젝트', structure: '구조시스템', 'design-phase': '설계단계',
    member: '구조부재', load: '설계하중', ai: 'AI적용',
    standard: '설계기준', tool: '소프트웨어', document: '설계문서', special: '특수검토',
  };

  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-5 h-14 gap-4"
      style={{
        background: 'rgba(9, 13, 26, 0.98)',
        borderBottom: '1px solid rgba(0,212,255,0.15)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* 로고: 실제 로고 이미지를 쓰려면 client/public/logo.png 를 추가한 뒤
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="w-8 h-8 object-contain" /> 로 교체하세요 */}
        <Waypoints
          className="w-8 h-8"
          style={{ color: '#00d4ff', filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.6))' }}
          aria-label="AI 구조설계 지식 그래프"
        />
        <div className="hidden md:block">
          <h1 className="font-display text-base font-bold leading-tight" style={{ color: '#00d4ff', letterSpacing: '0.05em' }}>
            AI 구조설계 지식 그래프
          </h1>
        </div>
      </div>

      {/* ── Search Box ── */}
      <div ref={containerRef} className="relative flex-1 max-w-md">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${showResults && results.length > 0 ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
            transition: 'border-color 0.2s',
          }}
        >
          <Search size={13} style={{ color: '#64748b', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (results.length > 0) setShowResults(true); }}
            placeholder="노드 검색 (예: 구로, 지진하중, AI, ICN062...)"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{
              color: '#e2e8f0',
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: '12px',
            }}
          />
          {query && (
            <button onClick={handleClear} style={{ color: '#475569' }} className="flex-shrink-0">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Dropdown results */}
        {showResults && results.length > 0 && (
          <div
            className="absolute top-full mt-1 w-full rounded-lg overflow-hidden z-50"
            style={{
              background: '#0d1424',
              border: '1px solid rgba(0,212,255,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            {results.map((node, i) => (
              <button
                key={node.id}
                onClick={() => handleSelect(node)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors"
                style={{
                  background: i === focusIdx ? 'rgba(0,212,255,0.1)' : 'transparent',
                  borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                {/* Category dot */}
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[node.category] || '#64748b' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: '#e2e8f0' }}>
                    {node.label}
                  </div>
                  <div className="text-xs truncate mt-0.5" style={{ color: '#64748b' }}>
                    {CATEGORY_LABELS[node.category]} · {node.description.slice(0, 50)}…
                  </div>
                </div>
                {/* Size indicator */}
                <span
                  className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{
                    background: `${CATEGORY_COLORS[node.category]}22`,
                    color: CATEGORY_COLORS[node.category],
                    fontSize: '10px',
                  }}
                >
                  {'●'.repeat(node.size)}
                </span>
              </button>
            ))}
            <div className="px-3 py-1.5 text-center" style={{ color: '#334155', fontSize: '10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              {results.length}개 결과 · ↑↓ 탐색 · Enter 선택
            </div>
          </div>
        )}
        {showResults && query && results.length === 0 && (
          <div
            className="absolute top-full mt-1 w-full rounded-lg px-4 py-3 z-50 text-center"
            style={{
              background: '#0d1424',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#475569',
              fontSize: '12px',
            }}
          >
            "{query}"에 해당하는 노드가 없습니다
          </div>
        )}
      </div>

      {/* Info button */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded transition-colors"
          style={{ color: showInfo ? '#00d4ff' : '#475569' }}
        >
          <Info size={16} />
        </button>
        {showInfo && (
          <div
            className="absolute right-0 top-10 w-72 p-4 rounded-lg z-50 text-sm"
            style={{
              background: '#0f1629',
              border: '1px solid rgba(0,212,255,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <p className="font-semibold mb-2" style={{ color: '#00d4ff' }}>데이터 출처</p>
            <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
              실제 프로젝트 데이터 기반 구성.<br />
              구로 데이터센터 실시설계 구조계산서 (724p),<br />
              인천 가좌 테크센터(ICN062) 구조개요,<br />
              설계하중 엑셀 테이블 등 실무 자료 분석.
            </p>
            <p className="text-xs mt-2" style={{ color: '#475569' }}>
              기획 단계 전략 문서 — 2026년 7월
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
