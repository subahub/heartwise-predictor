import { motion } from 'framer-motion';

interface RiskGaugeProps {
  score: number;
  level: 'low' | 'medium' | 'high';
  size?: number;
}

export default function RiskGauge({ score, level, size = 220 }: RiskGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  const colorMap = {
    low: 'hsl(142, 70%, 45%)',
    medium: 'hsl(38, 92%, 50%)',
    high: 'hsl(0, 75%, 55%)',
  };

  const labelMap = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M 10 ${center} A ${radius} ${radius} 0 0 1 ${size - 10} ${center}`}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.path
          d={`M 10 ${center} A ${radius} ${radius} 0 0 1 ${size - 10} ${center}`}
          fill="none"
          stroke={colorMap[level]}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        {/* Score text */}
        <text x={center} y={center - 10} textAnchor="middle" className="font-heading" fill={colorMap[level]} fontSize="42" fontWeight="700">
          {score}
        </text>
        <text x={center} y={center + 15} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13">
          out of 100
        </text>
      </svg>
      <span
        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${
          level === 'low' ? 'bg-risk-low/10 risk-low' : level === 'medium' ? 'bg-risk-medium/10 risk-medium' : 'bg-risk-high/10 risk-high'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${level === 'low' ? 'bg-risk-low' : level === 'medium' ? 'bg-risk-medium' : 'bg-risk-high'}`} />
        {labelMap[level]}
      </span>
    </div>
  );
}
