import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export default function TrustScoreChart({ score = 0 }) {
  const data = [
    { name: 'score', value: score, fill: score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444' },
  ];
  return (
    <div style={{ width: '100%', height: 240 }}>
      {/* Accessible fallback for tests/screen readers */}
      <div className="sr-only" aria-label={`Trust score ${score}%`}>{score}%</div>
      <ResponsiveContainer>
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar dataKey="value" cornerRadius={20} />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-current" fontSize={24}>
            {score}%
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
