import React from 'react';

interface BarcodeSvgProps {
  value: string;
  width?: number;
  height?: number;
  showText?: boolean;
}

export const BarcodeSvg: React.FC<BarcodeSvgProps> = ({
  value,
  width = 160,
  height = 42,
  showText = true,
}) => {
  // Generate deterministic bar widths from string hash
  const sanitized = (value || '00000000').replace(/[^a-zA-Z0-9]/g, '');
  const barPattern: number[] = [];
  
  // Guard pattern (start)
  barPattern.push(2, 1, 1);
  
  for (let i = 0; i < sanitized.length; i++) {
    const code = sanitized.charCodeAt(i);
    barPattern.push(
      (code % 3) + 1,
      ((code >> 1) % 2) + 1,
      ((code >> 2) % 3) + 1,
      1
    );
  }
  
  // Guard pattern (end)
  barPattern.push(2, 1, 2);

  const totalUnits = barPattern.reduce((a, b) => a + b, 0);
  const unitWidth = width / totalUnits;

  let currentX = 0;
  const bars = barPattern.map((unit, index) => {
    const isBar = index % 2 === 0;
    const barW = unit * unitWidth;
    const rect = isBar ? (
      <rect
        key={index}
        x={currentX}
        y={0}
        width={barW}
        height={showText ? height - 12 : height}
        fill="#000000"
      />
    ) : null;
    currentX += barW;
    return rect;
  });

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {bars}
        {showText && (
          <text
            x={width / 2}
            y={height - 1}
            textAnchor="middle"
            fontFamily="'Courier New', monospace, sans-serif"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2px"
            fill="#000000"
          >
            {sanitized.padStart(12, '0').slice(-12)}
          </text>
        )}
      </svg>
    </div>
  );
};
