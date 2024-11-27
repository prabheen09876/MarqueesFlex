import { useEffect, useState } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();
    const duration = 2000; // 2 seconds

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth progress
      const easeOutCubic = (x: number): number => {
        return 1 - Math.pow(1 - x, 3);
      };

      const easedProgress = easeOutCubic(progress) * 100;
      setProgress(Math.min(Math.round(easedProgress), 100));
      
      // Smooth rotation animation
      setRotation(progress * 720); // Two full rotations

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="w-32 h-32 relative animate-pulse">
        {/* Outer static ring */}
        <div className="absolute inset-0 border-8 border-gray-200 rounded-full"></div>
        
        {/* Animated progress ring */}
        <div 
          className="absolute inset-0 border-8 border-[#0A3981] rounded-full transition-all duration-300 ease-out"
          style={{
            clipPath: `polygon(50% 50%, -50% -50%, ${progress}% -50%, ${progress}% 150%, -50% 150%)`,
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease-out',
          }}
        ></div>
        
        {/* Inner circle with gradient background */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-inner">
          <div className="relative">
            <span className="text-2xl font-bold text-[#0A3981] transition-all duration-300"
                  style={{ opacity: progress === 100 ? 0 : 1 }}>
              {progress}%
            </span>
            {progress === 100 && (
              <div className="absolute inset-0 flex items-center justify-center animate-fadeIn">
                <svg className="w-6 h-6 text-[#0A3981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Loading text with gradient and animation */}
      <div className="mt-4 relative overflow-hidden">
        <div className="text-lg font-semibold text-[#0A3981] relative z-10 px-4">
          Loading
          <span className="inline-flex ml-1">
            <span className="animate-bounce delay-0">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A3981]/10 to-transparent animate-shimmer"></div>
      </div>
    </div>
  );
}
