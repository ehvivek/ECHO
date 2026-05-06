'use client';

export default function CherryBlossomBranch() {
  return (
    <>
      {/* Top-left branch */}
      <svg
        className="fixed top-0 left-0 w-48 h-48 md:w-64 md:h-64 opacity-20 pointer-events-none z-0"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M-10 0 Q30 40 50 80 Q60 100 80 110 Q100 120 120 140"
          stroke="#D4849A"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M50 80 Q40 60 20 55"
          stroke="#D4849A"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M80 110 Q90 90 110 85"
          stroke="#D4849A"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Blossoms */}
        {[
          { cx: 20, cy: 55, r: 8 },
          { cx: 50, cy: 80, r: 10 },
          { cx: 80, cy: 110, r: 9 },
          { cx: 110, cy: 85, r: 7 },
          { cx: 120, cy: 140, r: 11 },
          { cx: 35, cy: 35, r: 6 },
        ].map((b, i) => (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx={b.cx}
                cy={b.cy}
                rx={b.r * 0.45}
                ry={b.r}
                fill="#FFB6C1"
                opacity={0.6}
                transform={`rotate(${angle} ${b.cx} ${b.cy})`}
              />
            ))}
            <circle cx={b.cx} cy={b.cy} r={b.r * 0.25} fill="#FFD700" opacity={0.7} />
          </g>
        ))}
      </svg>

      {/* Top-right branch (mirrored) */}
      <svg
        className="fixed top-0 right-0 w-48 h-48 md:w-64 md:h-64 opacity-20 pointer-events-none z-0"
        viewBox="0 0 200 200"
        fill="none"
        style={{ transform: 'scaleX(-1)' }}
      >
        <path
          d="M-10 0 Q30 40 50 80 Q60 100 80 110 Q100 120 120 140"
          stroke="#D4849A"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M50 80 Q40 60 20 55"
          stroke="#D4849A"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M80 110 Q90 90 110 85"
          stroke="#D4849A"
          strokeWidth="1.5"
          fill="none"
        />
        {[
          { cx: 20, cy: 55, r: 8 },
          { cx: 50, cy: 80, r: 10 },
          { cx: 80, cy: 110, r: 9 },
          { cx: 110, cy: 85, r: 7 },
          { cx: 120, cy: 140, r: 11 },
        ].map((b, i) => (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx={b.cx}
                cy={b.cy}
                rx={b.r * 0.45}
                ry={b.r}
                fill="#FFB6C1"
                opacity={0.6}
                transform={`rotate(${angle} ${b.cx} ${b.cy})`}
              />
            ))}
            <circle cx={b.cx} cy={b.cy} r={b.r * 0.25} fill="#FFD700" opacity={0.7} />
          </g>
        ))}
      </svg>
    </>
  );
}
