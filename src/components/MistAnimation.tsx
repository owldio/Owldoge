export default function MistAnimation() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* 煙霧層 1 - 使用 will-change 優化 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.12) 0%, transparent 100%)',
          filter: 'blur(40px)',
          animation: 'rise1 50s ease-in-out infinite',
          willChange: 'transform, opacity',
          transform: 'translateZ(0)', // 啟用 GPU 加速
        }}
      />

      {/* 煙霧層 2 - 使用 will-change 優化 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.08) 0%, transparent 100%)',
          filter: 'blur(60px)',
          animation: 'rise2 65s ease-in-out infinite',
          animationDelay: '-10s',
          willChange: 'transform, opacity',
          transform: 'translateZ(0)', // 啟用 GPU 加速
        }}
      />

      {/* 暗角效果 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      <style jsx>{`
        @keyframes rise1 {
          0%, 100% {
            transform: translateY(50%) translateX(-5%) translateZ(0);
            opacity: 0;
          }
          20%, 80% {
            opacity: 1;
          }
          50% {
            transform: translateY(0%) translateX(0%) translateZ(0);
            opacity: 1;
          }
        }
        @keyframes rise2 {
          0%, 100% {
            transform: translateY(50%) translateX(5%) translateZ(0);
            opacity: 0;
          }
          20%, 80% {
            opacity: 1;
          }
          50% {
            transform: translateY(0%) translateX(0%) translateZ(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
