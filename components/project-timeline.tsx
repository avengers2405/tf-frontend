import React, { useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, Circle, Clock, Lock } from 'lucide-react';

enum PhaseStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LOCKED = 'LOCKED',
}

interface Phase {
  phase_id: number;
  project_id: string;
  phase_name: string;
  phase_description: string;
  start_date: Date;       // or string if coming from API
  end_date: Date;         // or string if coming from API
  status: PhaseStatus;
  comments?: string | null;
}

interface ProjectTimelineProps {
  phases: Phase[];
  userRole: string; 
  onStatusChange?: (phaseId: number, newStatus: PhaseStatus) => void;
}



const ProjectTimeline = ({ phases, userRole, onStatusChange }: ProjectTimelineProps) => {
  const [localPhases, setLocalPhases] = useState<Phase[]>(phases);
  const isTeacher = userRole === 'TEACHER';

  useEffect(() => {
    setLocalPhases(phases);
  }, [phases]);

  const handleInternalChange = (phaseId: number, newStatus: PhaseStatus) => {
    // 3. Update local UI immediately
    const updatedPhases = localPhases.map((p) => 
      p.phase_id === phaseId ? { ...p, status: newStatus } : p
    );
    setLocalPhases(updatedPhases);

    // 4. Notify the parent (for API calls/database updates)
    if (onStatusChange) {
      onStatusChange(phaseId, newStatus);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Project Timeline
      </h3>
      
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-gray-200 before:to-transparent">
        {localPhases.map((phase, index) => (
          <div key={phase.phase_id} className="relative flex items-start group">
            <div className="absolute left-0 flex items-center justify-center w-10 h-10">
              {phase.status === PhaseStatus.CLOSED ? (
                <CheckCircle2 className="w-6 h-6 text-green-500 bg-white rounded-full z-10" />
              ) : phase.status === PhaseStatus.OPEN ? (
                <div className="w-4 h-4 bg-blue-600 rounded-full ring-4 ring-blue-100 z-10 animate-pulse" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400 bg-white z-10" />
              )}
            </div>
            
            <div className="ml-14 flex-1 pb-4 border-b border-gray-50 group-last:border-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-semibold ${phase.status === 'OPEN' ? 'text-blue-700' : 'text-gray-900'}`}>
                  {phase.phase_name}
                </h4>
                {isTeacher ? (
                    <div className="relative inline-block mt-1">
                      <select
                        value={phase.status}
                        onChange={(e) => handleInternalChange(phase.phase_id, e.target.value as PhaseStatus)}
                        className="appearance-none bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 pr-6 rounded border border-blue-100 cursor-pointer hover:bg-blue-100 focus:outline-none"
                      >
                        {Object.values(PhaseStatus).map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {phase.status}
                    </span>
                  )}
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {new Date(phase.start_date).toLocaleDateString()} - {new Date(phase.end_date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{phase.phase_description}</p>
              {phase.comments && (
                <p className="mt-2 text-xs italic text-gray-500">Note: {phase.comments}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimeline;