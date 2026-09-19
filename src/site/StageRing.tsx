export function StageRing({ value, color }: { value: number; color: string }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <svg className="stage-ring" viewBox="0 0 100 100" aria-hidden="true">
      <circle className="stage-ring-track" cx="50" cy="50" r={radius} />
      <circle
        className="stage-ring-value"
        cx="50"
        cy="50"
        r={radius}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={value === 0 ? circumference : offset}
      />
    </svg>
  );
}

export const RING_STEPS = [
  { pct: 30, color: '#7cc4f2' },
  { pct: 45, color: '#5db7f0' },
  { pct: 60, color: '#9fd0f0' },
  { pct: 95, color: '#ffffff' },
  { pct: 75, color: '#7cc4f2' },
  { pct: 100, color: '#ffffff' },
] as const;
