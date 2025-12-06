import React from 'react';
import { LearningTask } from '../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface RoadmapProps {
  tasks: LearningTask[];
}

const Roadmap: React.FC<RoadmapProps> = ({ tasks }) => {
  return (
    <div className="space-y-6">
      {tasks.map((task, index) => (
        <div key={index} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              index === 0 
                ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-blue-900/50 shadow-lg' 
                : 'bg-slate-900 border-slate-700 text-slate-600 group-hover:border-blue-500/50 group-hover:text-blue-400 group-hover:scale-110 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
            }`}>
              {index === 0 ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </div>
            {index !== tasks.length - 1 && <div className="w-0.5 flex-1 bg-slate-700 my-2 group-hover:bg-blue-900 transition-colors duration-300 group-hover:shadow-[0_0_5px_rgba(30,58,138,0.5)]"></div>}
          </div>
          <div className="flex-1 pb-6">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-900/10 hover:-translate-y-1 cursor-default group-hover:bg-slate-900/80">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-100 group-hover:text-blue-200 transition-colors">{task.title}</h4>
                <span className="flex items-center text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-full border border-slate-700 group-hover:border-blue-500/30 group-hover:text-blue-300 transition-colors">
                  <Clock size={12} className="mr-1" />
                  Day {task.day}: {task.duration}
                </span>
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{task.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Roadmap;