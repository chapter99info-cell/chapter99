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
  { pct: 30, color: '#22c55e' },
  { pct: 45, color: '#3b82f6' },
  { pct: 60, color: '#a855f7' },
  { pct: 95, color: '#ef4444' },
  { pct: 75, color: '#22c55e' },
  { pct: 100, color: '#ef4444' },
] as const;
