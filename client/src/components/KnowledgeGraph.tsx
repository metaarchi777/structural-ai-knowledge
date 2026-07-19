/**
 * KnowledgeGraph.tsx — Galaxy Disk Orbit v3
 * - Canvas 전용 렌더링 (SVG 오버레이 제거)
 * - Canvas에서 직접 zoom/pan + drag + click 처리
 * - 드래그: 노드를 궤도에서 이탈시켜 자유 이동
 * - 클릭: 노드 선택 → 오른쪽 패널 상세 정보
 * - 더블클릭: 핀 해제 (궤도 복귀)
 */
import { useEffect, useRef, useCallback } from 'react';
import {
  GRAPH_NODES, GRAPH_LINKS, NODE_COLORS,
  type GraphNode, type NodeCategory,
} from '@/lib/graphData';

interface Props {
  activeCategories: Set<NodeCategory>;
  onNodeSelect: (node: GraphNode | null) => void;
  selectedNodeId: string | null;
  highlightNodeId?: string | null;
}

interface ONode {
  data: GraphNode;
  orbitA: number;
  orbitB: number;
  tilt: number;
  speed: number;
  angle: number;
  x: number; y: number;
  twinkleOffset: number;
  twinkleSpeed: number;
  pinned: boolean;
  pinnedX: number; pinnedY: number;
}

interface BGStar {
  x: number; y: number; r: number;
  opacity: number; speed: number; offset: number; color: string;
}

const CENTER_ID = 'ai-core';
const GALAXY_TILT = 0.15;
const BASE_SPEED  = 0.0006;

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

export default function KnowledgeGraph({
  activeCategories, onNodeSelect, selectedNodeId, highlightNodeId,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);
  const frameRef  = useRef<number>(0);
  const bgStarsRef = useRef<BGStar[]>([]);
  const nodesRef  = useRef<ONode[]>([]);
  const centerRef = useRef<{x:number;y:number}>({x:0,y:0});
  // Zoom/pan state
  const transformRef = useRef<{tx:number;ty:number;scale:number}>({tx:0,ty:0,scale:1});
  const hitRef    = useRef<ONode | null>(null);
  // Refs for callbacks (avoid stale closures)
  const onNodeSelectRef = useRef(onNodeSelect);
  const selectedNodeIdRef = useRef(selectedNodeId);
  const highlightNodeIdRef = useRef(highlightNodeId);
  useEffect(() => { onNodeSelectRef.current = onNodeSelect; }, [onNodeSelect]);
  useEffect(() => { selectedNodeIdRef.current = selectedNodeId; }, [selectedNodeId]);
  useEffect(() => { highlightNodeIdRef.current = highlightNodeId; }, [highlightNodeId]);

  const nodeRadius = (n: GraphNode) => {
    if (n.id === CENTER_ID) return 14;
    return 2 + n.size * 1.2;
  };
  // Center node visual radius (separate from hit radius)
  const centerVisualR = 3;  // ~1/5 of original 14

  const makeBGStars = (W: number, H: number): BGStar[] => {
    const pal = ['#ffffff','#c8e6ff','#ffe8c8','#e8c8ff','#c8ffd4','#aaddff'];
    return Array.from({length: 400}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.2+0.15,
      opacity: Math.random()*0.6+0.1,
      speed: Math.random()*0.015+0.003,
      offset: Math.random()*Math.PI*2,
      color: pal[Math.floor(Math.random()*pal.length)],
    }));
  };

  const buildNodes = useCallback((W: number, H: number): ONode[] => {
    const visible = GRAPH_NODES.filter(n => activeCategories.has(n.category));
    const center  = visible.find(n => n.id === CENTER_ID) ?? visible[0];
    const others  = visible.filter(n => n.id !== center.id);
    const cx = W / 2, cy = H / 2;
    const sorted = [...others].sort((a,b) => b.size - a.size);
    const ringCount = 6;
    const maxR = Math.min(W, H) * 0.56;
    const minR = Math.min(W, H) * 0.09;
    const result: ONode[] = [];
    result.push({
      data: center,
      orbitA: 0, orbitB: 0, tilt: 0,
      speed: 0, angle: 0,
      x: cx, y: cy,
      twinkleOffset: 0, twinkleSpeed: 0.05,
      pinned: true, pinnedX: cx, pinnedY: cy,
    });
    sorted.forEach((node, i) => {
      const ring = i % ringCount;
      const a = minR + (ring / (ringCount-1)) * (maxR - minR);
      const flatness = 0.18 + (ring * 0.022);
      const b = a * flatness;
      const tilt = GALAXY_TILT + (ring - ringCount/2) * 0.03;
      const nodesInRing = sorted.filter((_,j) => j % ringCount === ring).length;
      const posInRing   = Math.floor(i / ringCount);
      const startAngle  = (posInRing / nodesInRing) * Math.PI * 2 + ring * 0.3;
      const speed = BASE_SPEED * (1.5 - ring * 0.15) * (Math.random()*0.3+0.85);
      const dir = ring % 2 === 0 ? 1 : -1;
      const scatter = (Math.random() - 0.5) * a * 0.08;
      const scatterB = (Math.random() - 0.5) * b * 0.15;
      result.push({
        data: node,
        orbitA: a + scatter, orbitB: b + scatterB, tilt: tilt + (Math.random()-0.5)*0.04,
        speed: speed * dir, angle: startAngle,
        x: cx, y: cy,
        twinkleOffset: Math.random()*Math.PI*2,
        twinkleSpeed: 0.02 + Math.random()*0.04,
        pinned: false, pinnedX: 0, pinnedY: 0,
      });
    });
    return result;
  }, [activeCategories]);

  const orbitPos = (o: ONode, cx: number, cy: number) => {
    if (o.pinned) return {x: o.pinnedX, y: o.pinnedY};
    const lx = o.orbitA * Math.cos(o.angle);
    const ly = o.orbitB * Math.sin(o.angle);
    return {
      x: cx + lx * Math.cos(o.tilt) - ly * Math.sin(o.tilt),
      y: cy + lx * Math.sin(o.tilt) + ly * Math.cos(o.tilt),
    };
  };

  const draw = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const {tx, ty, scale} = transformRef.current;
    const cx = centerRef.current.x;
    const cy = centerRef.current.y;
    const selId = selectedNodeIdRef.current;
    const hlId  = highlightNodeIdRef.current;

    ctx.clearRect(0,0,W,H);
    // Background
    const bg = ctx.createRadialGradient(W*.5,H*.48,0, W*.5,H*.48, Math.max(W,H)*.75);
    bg.addColorStop(0,'#0a1228');
    bg.addColorStop(.25,'#060d1e');
    bg.addColorStop(.6,'#040a16');
    bg.addColorStop(1,'#020610');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    // Nebula (fixed, no zoom)
    ctx.save();
    ctx.translate(tx, ty); ctx.scale(scale, scale);
    [
      {cx:cx,     cy:cy,     rx:W*.28, ry:H*.12, col:'80,120,255', a:.07},
      {cx:cx+W*.04,cy:cy-H*.02,rx:W*.18,ry:H*.08,col:'140,80,255',a:.05},
      {cx:cx-W*.06,cy:cy+H*.02,rx:W*.14,ry:H*.06,col:'0,180,220',a:.04},
      {cx:cx+W*.1, cy:cy+H*.04,rx:W*.12,ry:H*.05,col:'20,200,140',a:.03},
    ].forEach(n => {
      ctx.save();
      const maxR = Math.max(n.rx,n.ry);
      const sg = ctx.createRadialGradient(n.cx,n.cy,0,n.cx,n.cy,maxR);
      sg.addColorStop(0,`rgba(${n.col},${n.a})`);
      sg.addColorStop(.5,`rgba(${n.col},${n.a*.4})`);
      sg.addColorStop(1,`rgba(${n.col},0)`);
      ctx.scale(n.rx/maxR, n.ry/maxR);
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(n.cx*maxR/n.rx, n.cy*maxR/n.ry, maxR, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();

    // BG stars (no zoom)
    bgStarsRef.current.forEach(s => {
      const tw = .5+.5*Math.sin(frame*s.speed+s.offset);
      const al = s.opacity*(.3+.7*tw);
      ctx.save();
      ctx.globalAlpha = al*0.5;
      const hg = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*3);
      hg.addColorStop(0,'rgba(255,255,255,0.5)');
      hg.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(s.x,s.y,s.r*3,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = al;
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });

    // Apply zoom/pan
    ctx.save();
    ctx.translate(tx, ty); ctx.scale(scale, scale);

    // Orbit guides
    const drawnA = new Set<number>();
    nodesRef.current.forEach(o => {
      if (o.data.id === CENTER_ID || o.orbitA === 0) return;
      const key = Math.round(o.orbitA * 10);
      if (drawnA.has(key)) return;
      drawnA.add(key);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(o.tilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, o.orbitA, o.orbitB, 0, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(100,180,255,0.07)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3,9]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    });

    // Links
    const nodeMap = new Map(nodesRef.current.map(o => [o.data.id, o]));
    GRAPH_LINKS.forEach(l => {
      const src = nodeMap.get(l.source as string);
      const tgt = nodeMap.get(l.target as string);
      if (!src || !tgt) return;
      const str = l.strength ?? 0.5;
      const col = NODE_COLORS[src.data.category];
      const rgb = hexToRgb(col);
      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);
      ctx.strokeStyle = `rgba(${rgb},${0.06 + str*0.1})`;
      ctx.lineWidth = 0.4 + str*0.4;
      ctx.stroke();
    });

    // Nodes
    nodesRef.current.forEach(o => {
      const r = nodeRadius(o.data);
      const col = NODE_COLORS[o.data.category];
      const rgb = hexToRgb(col);
      const isCenter = o.data.id === CENTER_ID;
      const isSelected = o.data.id === selId;
      const isHighlight = o.data.id === hlId;
      const isHovered = hitRef.current?.data.id === o.data.id;
      const tw = .5 + .5*Math.sin(frame*o.twinkleSpeed + o.twinkleOffset);

      if (isCenter) {
        // Center node: small bright star — same style as others but slightly larger
        // Use cyan-purple gradient to blend with galaxy palette
        const vr = centerVisualR; // ~3px visual radius
        const tw = .5 + .5*Math.sin(frame*o.twinkleSpeed + o.twinkleOffset);
        const brightness = 0.85 + tw * 0.15;

        // Soft outer glow (cyan tint)
        const glowR = vr * 7;
        const glow = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,glowR);
        glow.addColorStop(0,`rgba(80,200,255,${0.18 + tw*0.1})`);
        glow.addColorStop(.4,`rgba(120,80,255,${0.08})`);
        glow.addColorStop(1,`rgba(80,120,255,0)`);
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(o.x,o.y,glowR,0,Math.PI*2); ctx.fill();

        // Cross spike (4-point star)
        ctx.save();
        ctx.globalAlpha = brightness * 0.75;
        ctx.strokeStyle = 'rgba(140,220,255,0.9)';
        ctx.lineWidth = 0.7;
        const spike = vr * 4;
        ctx.beginPath();
        ctx.moveTo(o.x - spike, o.y); ctx.lineTo(o.x + spike, o.y);
        ctx.moveTo(o.x, o.y - spike); ctx.lineTo(o.x, o.y + spike);
        ctx.stroke();
        ctx.restore();

        // Core: cyan-white gradient dot
        const coreG = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,vr);
        coreG.addColorStop(0,`rgba(220,245,255,${brightness})`);
        coreG.addColorStop(.5,`rgba(80,200,255,${brightness*0.85})`);
        coreG.addColorStop(1,`rgba(60,100,255,0)`);
        ctx.fillStyle = coreG;
        ctx.beginPath(); ctx.arc(o.x,o.y,vr,0,Math.PI*2); ctx.fill();

        // Label
        ctx.font = `bold 11px 'Noto Sans KR', sans-serif`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = 'rgba(140,220,255,0.95)';
        ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 8;
        ctx.fillText(o.data.label, o.x, o.y + vr + 13);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      } else {
        const brightness = isSelected || isHighlight || isHovered ? 1 : 0.5 + tw*0.5;
        const starR = isSelected || isHighlight ? r*1.6 : r;
        const glowR = starR * (isSelected ? 6 : 4.5);
        const glow = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,glowR);
        const glowA = brightness * (isSelected ? 0.45 : 0.25 + tw*0.2);
        glow.addColorStop(0,`rgba(${rgb},${glowA})`);
        glow.addColorStop(.5,`rgba(${rgb},${glowA*.3})`);
        glow.addColorStop(1,`rgba(${rgb},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(o.x,o.y,glowR,0,Math.PI*2); ctx.fill();

        if (o.data.size >= 4 || isSelected || isHighlight) {
          ctx.save();
          ctx.globalAlpha = brightness * 0.7;
          ctx.strokeStyle = `rgba(${rgb},0.8)`;
          ctx.lineWidth = 0.5;
          const spikeLen = starR * 3.5;
          ctx.beginPath();
          ctx.moveTo(o.x - spikeLen, o.y); ctx.lineTo(o.x + spikeLen, o.y);
          ctx.moveTo(o.x, o.y - spikeLen); ctx.lineTo(o.x, o.y + spikeLen);
          ctx.stroke();
          ctx.restore();
        }

        const coreG = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,starR);
        coreG.addColorStop(0,'rgba(255,255,255,'+(brightness*0.95+0.05)+')');
        coreG.addColorStop(.4,`rgba(${rgb},${brightness*0.9})`);
        coreG.addColorStop(1,`rgba(${rgb},0)`);
        ctx.fillStyle = coreG;
        ctx.beginPath(); ctx.arc(o.x,o.y,starR,0,Math.PI*2); ctx.fill();

        // Selected ring
        if (isSelected) {
          ctx.save();
          ctx.strokeStyle = `rgba(${rgb},0.8)`;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(o.x,o.y,starR+4,0,Math.PI*2); ctx.stroke();
          ctx.restore();
        }

        // Label — always visible
        const fontSize = o.data.size >= 5 ? 11
          : o.data.size >= 4 ? 10.5
          : isSelected || isHighlight || isHovered ? 10
          : 9;
        const labelOpacity = isSelected || isHighlight || isHovered ? 1
          : o.data.size >= 4 ? 0.85
          : 0.55 + tw * 0.2;
        ctx.font = `${isSelected || isHighlight ? 'bold ' : ''}${fontSize}px 'Noto Sans KR', sans-serif`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = labelOpacity;
        ctx.fillStyle = isSelected || isHighlight ? '#ffffff'
          : isHovered ? '#e2e8f0'
          : `rgba(${rgb},0.95)`;
        ctx.shadowColor = col;
        ctx.shadowBlur = isSelected || isHighlight ? 10 : isHovered ? 7 : 4;
        ctx.fillText(o.data.label, o.x, o.y + starR + 12);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    });

    ctx.restore();
  }, []);

  // ── Main loop ─────────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    const loop = () => {
      frameRef.current++;
      const cx = centerRef.current.x;
      const cy = centerRef.current.y;
      nodesRef.current.forEach(o => {
        if (!o.pinned && o.data.id !== CENTER_ID) o.angle += o.speed;
        const p = orbitPos(o, cx, cy);
        o.x = p.x; o.y = p.y;
      });
      draw(frameRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  // ── World position from canvas event ──────────────────────────────────────
  const toWorld = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const {tx, ty, scale} = transformRef.current;
    return {
      x: (clientX - rect.left - tx) / scale,
      y: (clientY - rect.top  - ty) / scale,
    };
  };

  const findHit = (wx: number, wy: number): ONode | null => {
    let best: ONode | null = null;
    let bestDist = Infinity;
    nodesRef.current.forEach(o => {
      const r = nodeRadius(o.data);
      const hitR = Math.max(r * 4, 14);
      const d = Math.hypot(o.x - wx, o.y - wy);
      if (d < hitR && d < bestDist) { best = o; bestDist = d; }
    });
    return best;
  };

  // ── Init ─────────────────────────────────────────────────────────────────
  const init = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.clientWidth  || 900;
    const H = canvas.clientHeight || 700;
    canvas.width  = W; canvas.height = H;
    bgStarsRef.current = makeBGStars(W, H);
    centerRef.current  = {x: W/2, y: H/2};
    nodesRef.current   = buildNodes(W, H);
    transformRef.current = {tx: 0, ty: 0, scale: 1};

    // ── Interaction state ──────────────────────────────────────────────────
    let dragNode: ONode | null = null;
    let dragMoved = false;
    let panStart: {x:number;y:number;tx:number;ty:number} | null = null;
    let lastTap = 0;

    // Wheel zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const {tx, ty, scale} = transformRef.current;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 0.91;
      const newScale = Math.max(0.05, Math.min(8, scale * factor));
      // Zoom toward cursor
      transformRef.current = {
        tx: mx - (mx - tx) * (newScale / scale),
        ty: my - (my - ty) * (newScale / scale),
        scale: newScale,
      };
    };
    canvas.addEventListener('wheel', onWheel, {passive: false});

    const onMouseDown = (e: MouseEvent) => {
      const {x, y} = toWorld(e.clientX, e.clientY);
      const hit = findHit(x, y);
      if (hit) {
        dragNode = hit;
        dragMoved = false;
        canvas.style.cursor = 'grab';
      } else {
        // Start pan
        panStart = {x: e.clientX, y: e.clientY, tx: transformRef.current.tx, ty: transformRef.current.ty};
        canvas.style.cursor = 'grabbing';
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (dragNode) {
        dragMoved = true;
        const {x, y} = toWorld(e.clientX, e.clientY);
        dragNode.pinned = true;
        dragNode.pinnedX = x;
        dragNode.pinnedY = y;
        dragNode.x = x;
        dragNode.y = y;
        canvas.style.cursor = 'grabbing';
      } else if (panStart) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        transformRef.current = {
          ...transformRef.current,
          tx: panStart.tx + dx,
          ty: panStart.ty + dy,
        };
        canvas.style.cursor = 'grabbing';
      } else {
        const {x, y} = toWorld(e.clientX, e.clientY);
        const hit = findHit(x, y);
        hitRef.current = hit;
        canvas.style.cursor = hit ? 'pointer' : 'default';
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (dragNode && !dragMoved) {
        // Click → select node
        onNodeSelectRef.current(dragNode.data);
      }
      dragNode = null;
      panStart = null;
      canvas.style.cursor = 'default';
    };

    const onDblClick = (e: MouseEvent) => {
      const {x, y} = toWorld(e.clientX, e.clientY);
      const hit = findHit(x, y);
      if (hit && hit.data.id !== CENTER_ID) {
        hit.pinned = false;
      }
    };

    const onMouseLeave = () => {
      hitRef.current = null;
      dragNode = null;
      panStart = null;
      canvas.style.cursor = 'default';
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup',   onMouseUp);
    canvas.addEventListener('dblclick',  onDblClick);
    canvas.addEventListener('mouseleave',onMouseLeave);

    startLoop();

    return () => {
      canvas.removeEventListener('wheel',      onWheel);
      canvas.removeEventListener('mousedown',  onMouseDown);
      canvas.removeEventListener('mousemove',  onMouseMove);
      canvas.removeEventListener('mouseup',    onMouseUp);
      canvas.removeEventListener('dblclick',   onDblClick);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [buildNodes, startLoop]);

  useEffect(() => {
    const cleanup = init();
    return () => {
      cancelAnimationFrame(rafRef.current);
      cleanup?.();
    };
  }, [init]);

  useEffect(() => {
    const obs = new ResizeObserver(() => init());
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, [init]);

  return (
    <div ref={wrapRef} className="w-full h-full relative" style={{background:'#020610'}}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{zIndex:1, display:'block', cursor:'default'}}
      />
    </div>
  );
}
