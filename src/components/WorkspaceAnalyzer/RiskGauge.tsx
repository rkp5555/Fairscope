import React, { useEffect, useState } from 'react';

interface RiskGaugeProps {
  score: number; // 0 to 100
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, size = 110 }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * displayScore) / 100;

  const getColor = (s: number) => {
    if (s <= 25) return { stroke: '#22C55E', text: 'text-[#22C55E]', label: 'Safe Boundary' };
    if (s <= 65) return { stroke: '#F59E0B', text: 'text-[#F59E0B]', label: 'Partial Creep' };
    return { stroke: '#FB7185', text: 'text-[#FB7185]', label: 'Severe Creep' };
  };

  const status = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full -rotate-[135deg] transform"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            className="text-[#27272A]"
          />

          {/* Animated active arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={status.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
          <span className="text-2xl font-mono font-bold tracking-tight text-[#FAFAFA]">
            {displayScore}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
            Risk Score
          </span>
        </div>
      </div>

      <span className={`text-xs font-mono font-bold mt-[-6px] ${status.text}`}>
        {status.label}
      </span>
    </div>
  );
};
