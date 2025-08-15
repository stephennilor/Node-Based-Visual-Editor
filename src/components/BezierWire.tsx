import React from 'react';

interface BezierWireProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  thickness?: number;
}

export function BezierWire({ 
  startX, 
  startY, 
  endX, 
  endY, 
  color, 
  thickness = 2 
}: BezierWireProps) {
  // Calculate control points for a smooth bezier curve
  const dx = endX - startX;
  const controlOffset = Math.abs(dx) * 0.5 + 50;
  
  const cp1X = startX + controlOffset;
  const cp1Y = startY;
  const cp2X = endX - controlOffset;
  const cp2Y = endY;
  
  const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${endY}`;
  
  return (
    <g>
      {/* Glow effect */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={thickness + 4}
        opacity={0.3}
        filter="blur(2px)"
      />
      {/* Main wire */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        opacity={0.9}
        className="transition-all duration-200 hover:opacity-100"
      />
      {/* Connection points */}
      <circle
        cx={startX}
        cy={startY}
        r={thickness + 1}
        fill={color}
        opacity={0.8}
      />
      <circle
        cx={endX}
        cy={endY}
        r={thickness + 1}
        fill={color}
        opacity={0.8}
      />
    </g>
  );
}