/**
 * Home.tsx
 * Strategic Intelligence Dashboard — Main layout
 * Dark Authority Theme: deep navy bg, glowing cyan nodes
 */
import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import RoadmapView from '@/components/RoadmapView';
import StatsView from '@/components/StatsView';
import { type GraphNode, type NodeCategory } from '@/lib/graphData';

const ALL_CATEGORIES = new Set<NodeCategory>([
  'project', 'structure', 'design-phase', 'member', 'load', 'ai', 'standard', 'tool', 'document', 'special',
]);

export default function Home() {
  const [activeView, setActiveView] = useState<'graph' | 'roadmap' | 'stats'>('graph');
  const [activeCategories, setActiveCategories] = useState<Set<NodeCategory>>(new Set(ALL_CATEGORIES));
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightNodeId, setHighlightNodeId] = useState<string | null>(null);

  const toggleCategory = useCallback((cat: NodeCategory) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const handleNodeSelect = useCallback((node: GraphNode | null) => {
    setSelectedNode(node);
  }, []);

  const handleSearchSelect = useCallback((node: GraphNode | null) => {
    if (node) {
      setSelectedNode(node);
      setHighlightNodeId(node.id);
      // Ensure the node's category is visible
      setActiveCategories(prev => {
        if (prev.has(node.category)) return prev;
        const next = new Set(prev);
        next.add(node.category);
        return next;
      });
    } else {
      setHighlightNodeId(null);
    }
  }, []);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden blueprint-grid"
      style={{ background: '#0a0e1a' }}
    >
      <Header activeView={activeView} onViewChange={setActiveView} onSearchSelect={handleSearchSelect} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel always visible */}
        <LeftPanel
          activeCategories={activeCategories}
          onToggleCategory={toggleCategory}
        />

        {/* Main content */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeView === 'graph' && (
            <>
              {/* Graph canvas */}
              <div className="flex-1 relative overflow-hidden">
              {/* 배경: 은은한 방사형 글로우 (외부 이미지 의존 없음) */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(0,212,255,0.07) 0%, rgba(124,58,237,0.04) 45%, transparent 75%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              <div className="absolute inset-0" style={{ zIndex: 1 }}>
              <KnowledgeGraph
                activeCategories={activeCategories}
                onNodeSelect={handleNodeSelect}
                selectedNodeId={selectedNode?.id ?? null}
                highlightNodeId={highlightNodeId}
              />
              </div>

                {/* Hint overlay when no node selected */}
                {!selectedNode && (
                  <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs pointer-events-none"
                    style={{
                      background: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.2)',
                      color: '#64748b',
                    }}
                  >
                    노드를 클릭하여 상세 정보 확인 · 드래그로 이동 · 스크롤로 줌
                  </div>
                )}
              </div>

              {/* Right panel */}
              <RightPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onNodeSelect={setSelectedNode}
              />
            </>
          )}

          {activeView === 'roadmap' && <RoadmapView />}
          {activeView === 'stats' && <StatsView />}
        </main>
      </div>
      {/* Footer watermark */}
      <div
        className="fixed bottom-3 right-4 pointer-events-none"
        style={{ zIndex: 50 }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: 'rgba(100,116,139,0.6)',
            letterSpacing: '0.08em',
          }}
        >
          made by KSN
        </span>
      </div>
    </div>
  );
}
