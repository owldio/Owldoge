export default function MistAnimation() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* 煙霧層 1 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.15) 0%, transparent 100%)',
          filter: 'blur(40px)',
          animation: 'rise1 50s ease-in-out infinite',
        }}
      />

      {/* 煙霧層 2 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, transparent 100%)',
          filter: 'blur(60px)',
          animation: 'rise2 65s ease-in-out infinite',
          animationDelay: '-10s',
        }}
      />

      {/* 煙霧層 3 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.08) 0%, transparent 100%)',
          filter: 'blur(80px)',
          animation: 'rise3 80s ease-in-out infinite',
          animationDelay: '-20s',
        }}
      />

      {/* SVG 噪聲過濾器增加不規則性 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="4"
            seed="1"
          >
            <animate
              attributeName="baseFrequency"
              values="0.01;0.02;0.01"
              dur="30s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="50" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.3" />
      </svg>

      {/* 暗角效果 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      <style jsx>{`
        @keyframes rise1 {
          0% {
            transform: translateY(50%) translateX(-5%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50%) translateX(5%);
            opacity: 0;
          }
        }
        @keyframes rise2 {
          0% {
            transform: translateY(50%) translateX(5%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50%) translateX(-5%);
            opacity: 0;
          }
        }
        @keyframes rise3 {
          0% {
            transform: translateY(50%) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50%) translateX(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
