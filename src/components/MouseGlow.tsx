"use client"

import React, { useEffect, useState, useRef, useCallback } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface RipplePoint {
  x: number;
  y: number;
  timestamp: number;
  id: number;
  direction: number;
  velocity: number;
}

const MouseGlow: React.FC = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [ripples, setRipples] = useState<RipplePoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const lastPositionRef = useRef({ x: 0, y: 0, timestamp: 0 });
  const lastRippleRef = useRef({ x: 0, y: 0, timestamp: 0 });
  const rippleIdRef = useRef(0);

  // 生成微光顏色 - 非常淡的白色微光
  const getSubtleGlowColor = useCallback((x: number, y: number): string => {
    const element = document.elementFromPoint(x, y);
    if (!element) return 'rgba(255, 255, 255, 0.15)';

    const computedStyle = window.getComputedStyle(element);
    let backgroundColor = computedStyle.backgroundColor;

    // 解析顏色
    const parseColor = (colorStr: string): [number, number, number] => {
      if (colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') {
        return [0, 0, 0];
      }
      
      const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (rgbMatch) {
        return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
      }
      
      return [0, 0, 0];
    };

    // 尋找背景顏色
    if (backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)') {
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const parentStyle = window.getComputedStyle(parent);
        const parentBg = parentStyle.backgroundColor;
        if (parentBg !== 'transparent' && parentBg !== 'rgba(0, 0, 0, 0)') {
          backgroundColor = parentBg;
          break;
        }
        parent = parent.parentElement;
      }
    }

    const [r, g, b] = parseColor(backgroundColor);
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    
    // 生成非常微弱的對比色
    if (brightness < 0.3) {
      // 深色背景：微弱白光
      return 'rgba(255, 255, 255, 0.12)';
    } else if (brightness < 0.7) {
      // 中等亮度：微弱淺色
      return 'rgba(255, 255, 255, 0.08)';
    } else {
      // 亮色背景：微弱深色
      return 'rgba(0, 0, 0, 0.06)';
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const lastPos = lastPositionRef.current;
      
      // 計算距離，更頻繁地記錄軌跡點
      const deltaX = e.clientX - lastPos.x;
      const deltaY = e.clientY - lastPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // 極高頻率地添加軌跡點，確保絕對平滑
      if (distance > 0.5) { // 極低閾值，記錄每個微小移動
        const newPoint: TrailPoint = {
          x: e.clientX,
          y: e.clientY,
          timestamp: now
        };

        setTrail(prevTrail => {
          // 0.08秒極短彗星軌跡
          const filteredTrail = prevTrail.filter(point => now - point.timestamp < 80);
          // 極短彗星只需要很少點
          return [...filteredTrail, newPoint].slice(-8);
        });

        lastPositionRef.current = { x: e.clientX, y: e.clientY, timestamp: now };
        
        // 創建湖面滑動效果 - 根據移動方向和速度
        const lastRipple = lastRippleRef.current;
        const rippleDistance = Math.sqrt((e.clientX - lastRipple.x) ** 2 + (e.clientY - lastRipple.y) ** 2);
        const deltaTime = now - lastRipple.timestamp;
        
        if (deltaTime > 100 && rippleDistance > 30) {
          // 計算移動方向和速度
          const direction = Math.atan2(e.clientY - lastRipple.y, e.clientX - lastRipple.x);
          const velocity = deltaTime > 0 ? rippleDistance / deltaTime : 0;
          
          const newRipple: RipplePoint = {
            x: e.clientX,
            y: e.clientY,
            timestamp: now,
            id: rippleIdRef.current++,
            direction,
            velocity: Math.min(velocity * 10, 20) // 限制速度
          };
          
          setRipples(prevRipples => {
            const filteredRipples = prevRipples.filter(ripple => now - ripple.timestamp < 1500);
            return [...filteredRipples, newRipple].slice(-6); // 最多6個水波
          });
          
          lastRippleRef.current = { x: e.clientX, y: e.clientY, timestamp: now };
        }
      }

      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // 短彗星和水波清理
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setTrail(prevTrail => prevTrail.filter(point => now - point.timestamp < 80));
      setRipples(prevRipples => prevRipples.filter(ripple => now - ripple.timestamp < 1500));
    }, 15);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(cleanupInterval);
    };
  }, []);

  if (!isVisible || trail.length < 2) return null;

  // 創建極其平滑的路徑
  const createUltraSmoothPath = (points: TrailPoint[]) => {
    if (points.length < 2) return '';
    
    // 如果點太少，直接連線
    if (points.length === 2) {
      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // 使用 Catmull-Rom 樣條曲線創造超平滑效果
    for (let i = 1; i < points.length; i++) {
      const p0 = points[Math.max(i - 2, 0)];
      const p1 = points[Math.max(i - 1, 0)];
      const p2 = points[i];
      const p3 = points[Math.min(i + 1, points.length - 1)];
      
      if (i === 1) {
        // 第一段使用簡單的二次曲線
        const cpX = (p1.x + p2.x) / 2;
        const cpY = (p1.y + p2.y) / 2;
        path += ` Q ${cpX} ${cpY} ${p2.x} ${p2.y}`;
      } else {
        // 使用三次貝塞爾曲線創造超平滑效果
        const tension = 0.3; // 張力參數，控制曲線的平滑度
        
        // 計算控制點
        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;
        
        path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
      }
    }
    
    return path;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <svg className="w-full h-full">
        <defs>
          {/* 沿路徑的漸變效果 */}
          <linearGradient id="pathGradient" gradientUnits="userSpaceOnUse">
            <stop offset="0%" style={{ stopColor: 'rgba(255, 255, 255, 0)', stopOpacity: 0 }} />
            <stop offset="70%" style={{ stopColor: 'rgba(255, 255, 255, 0.03)', stopOpacity: 1 }} />
            <stop offset="90%" style={{ stopColor: 'rgba(255, 255, 255, 0.08)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255, 255, 255, 0.12)', stopOpacity: 1 }} />
          </linearGradient>
          
          {/* 極其微弱的發光濾鏡 */}
          <filter id="subtleBlur" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* 渲染多條路徑段，每段有不同的透明度 */}
        {trail.length > 1 && (() => {
          const segments = [];
          const now = Date.now();
          
          // 將軌跡分成極短的段落，適配極短彗星效果
          for (let i = 0; i < trail.length - 1; i += 1) {
            const segmentPoints = trail.slice(i, Math.min(i + 4, trail.length));
            if (segmentPoints.length < 2) continue;
            
            // 計算這個段落的平均年齡
            const avgAge = segmentPoints.reduce((sum, point) => sum + (now - point.timestamp), 0) / segmentPoints.length;
            const fadeProgress = Math.min(avgAge / 80, 1);
            const opacity = Math.max(0, 1 - fadeProgress);
            
            if (opacity <= 0.01) continue;
            
            // 使用超平滑路徑算法
            const segmentPath = createUltraSmoothPath(segmentPoints);
            
            segments.push(
              <g key={i}>
                {/* 極微弱的背景光暈 */}
                <path
                  d={segmentPath}
                  stroke={`rgba(250, 248, 240, ${0.006 * opacity})`}
                  strokeWidth="24"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#subtleBlur)"
                />
                
                {/* 微弱的中層光 */}
                <path
                  d={segmentPath}
                  stroke={`rgba(255, 252, 245, ${0.012 * opacity})`}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#subtleBlur)"
                />
                
                {/* 隱約的核心線 */}
                <path
                  d={segmentPath}
                  stroke={`rgba(255, 255, 250, ${0.018 * opacity})`}
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          }
          
          return segments;
        })()}
        
        {/* 湖面滑動波紋效果 */}
        {ripples.map((ripple) => {
          const now = Date.now();
          const age = now - ripple.timestamp;
          const progress = age / 1500; // 1.5秒擴散時間
          const spreadDistance = progress * 120; // 波紋傳播距離
          const opacity = Math.max(0, (1 - progress) * 0.012); // 微弱透明度
          
          if (opacity <= 0.001) return null;
          
          // 根據移動方向創建橢圓形波紋
          const perpDirection = ripple.direction + Math.PI / 2; // 垂直於移動方向
          
          // 創建多個橢圓波紋，模擬水被推開的效果
          const waves = [];
          for (let i = 0; i < 3; i++) {
            const offset = i * 25;
            const waveOpacity = opacity * (1 - i * 0.3);
            const waveWidth = 60 + ripple.velocity * 2; // 基於速度調整寬度
            const waveHeight = 30 + ripple.velocity;
            
            waves.push(
              <ellipse
                key={`wave-${i}`}
                cx={ripple.x + Math.cos(ripple.direction) * offset}
                cy={ripple.y + Math.sin(ripple.direction) * offset}
                rx={waveWidth + spreadDistance}
                ry={waveHeight + spreadDistance * 0.5}
                fill="none"
                stroke={`rgba(255, 252, 240, ${waveOpacity})`}
                strokeWidth="1.5"
                transform={`rotate(${(ripple.direction * 180) / Math.PI} ${ripple.x + Math.cos(ripple.direction) * offset} ${ripple.y + Math.sin(ripple.direction) * offset})`}
                filter="url(#subtleBlur)"
              />
            );
          }
          
          // 兩側的分流波紋
          const sideWaves = [];
          for (let side of [-1, 1]) {
            const sideAngle = ripple.direction + side * Math.PI / 6; // 左右30度
            const sideX = ripple.x + Math.cos(sideAngle) * spreadDistance * 0.7;
            const sideY = ripple.y + Math.sin(sideAngle) * spreadDistance * 0.7;
            
            sideWaves.push(
              <ellipse
                key={`side-${side}`}
                cx={sideX}
                cy={sideY}
                rx={40 + spreadDistance * 0.6}
                ry={20 + spreadDistance * 0.3}
                fill="none"
                stroke={`rgba(255, 252, 240, ${opacity * 0.6})`}
                strokeWidth="1"
                transform={`rotate(${(sideAngle * 180) / Math.PI} ${sideX} ${sideY})`}
                filter="url(#subtleBlur)"
              />
            );
          }
          
          return (
            <g key={ripple.id}>
              {waves}
              {sideWaves}
            </g>
          );
        })}

        {/* 當前位置的極微弱光點 */}
        {trail.length > 0 && (
          <circle
            cx={trail[trail.length - 1].x}
            cy={trail[trail.length - 1].y}
            r="6"
            fill="rgba(255, 252, 240, 0.02)"
            filter="url(#subtleBlur)"
          />
        )}
      </svg>
    </div>
  );
};

export default MouseGlow;