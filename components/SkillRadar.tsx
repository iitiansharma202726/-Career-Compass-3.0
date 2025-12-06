import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { Skill } from '../types';

interface SkillRadarProps {
  skills: Skill[];
}

const SkillRadar: React.FC<SkillRadarProps> = ({ skills }) => {
  // Take top 6-8 skills to avoid clutter
  const chartData = skills
    .sort((a, b) => b.level - a.level)
    .slice(0, 8)
    .map(skill => ({
      subject: skill.name,
      A: skill.level,
      fullMark: 100,
    }));

  if (chartData.length === 0) {
    return <div className="text-slate-400 text-sm text-center py-10">Not enough data to generate graph</div>;
  }

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#334155" /> {/* slate-700 */}
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} /> {/* slate-400 */}
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skill Level"
            dataKey="A"
            stroke="#3b82f6" /* blue-500 */
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#60a5fa', fontWeight: 600 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadar;