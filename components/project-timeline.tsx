"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Lock,
} from "lucide-react";

enum PhaseStatus {
  OPEN = "OPEN",
  SUBMITTED = "SUBMITTED",
  CLOSED = "CLOSED",
  LOCKED = "LOCKED",
}

interface Phase {
  phase_id: number;
  project_id: string;
  phase_name: string;
  phase_description: string;
  start_date: string;
  end_date: string;
  status: PhaseStatus;
  comments?: string | null;
}

interface ProjectTimelineProps {
  phases: Phase[];
  userRole: "STUDENT" | "TEACHER";
  onStatusChange?: (
    phaseId: number,
    newStatus: PhaseStatus
  ) => void;
}

const ProjectTimeline = ({
  phases,
  userRole,
  onStatusChange,
}: ProjectTimelineProps) => {
  const [localPhases, setLocalPhases] =
    useState<Phase[]>(phases);

  const isTeacher = userRole === "TEACHER";

  useEffect(() => {
    setLocalPhases(phases);
  }, [phases]);

  const handleSubmit = (phaseId: number) => {
    updatePhaseStatus(phaseId, PhaseStatus.SUBMITTED);
  };

  const handleApprove = (phaseId: number) => {
    updatePhaseStatus(phaseId, PhaseStatus.CLOSED);
  };

  const updatePhaseStatus = (
    phaseId: number,
    newStatus: PhaseStatus
  ) => {
    const updated = localPhases.map((p) =>
      p.phase_id === phaseId
        ? { ...p, status: newStatus }
        : p
    );

    setLocalPhases(updated);

    if (onStatusChange) {
      onStatusChange(phaseId, newStatus);
    }
  };

  const completedCount = localPhases.filter(
    (p) => p.status === PhaseStatus.CLOSED
  ).length;

  const progress =
    (completedCount / localPhases.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Project Timeline
      </h3>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">
            Overall Progress
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-gray-200 before:to-transparent">
        {localPhases.map((phase) => (
          <div
            key={phase.phase_id}
            className="relative flex items-start group"
          >
            <div className="absolute left-0 flex items-center justify-center w-10 h-10">
              {phase.status === PhaseStatus.CLOSED ? (
                <CheckCircle2 className="w-6 h-6 text-green-500 bg-white rounded-full z-10" />
              ) : phase.status ===
                PhaseStatus.SUBMITTED ? (
                <div className="w-4 h-4 bg-yellow-500 rounded-full ring-4 ring-yellow-100 z-10" />
              ) : phase.status === PhaseStatus.OPEN ? (
                <div className="w-4 h-4 bg-blue-600 rounded-full ring-4 ring-blue-100 z-10 animate-pulse" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400 bg-white z-10" />
              )}
            </div>

            <div className="ml-14 flex-1 pb-4 border-b border-gray-50 group-last:border-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900">
                  {phase.phase_name}
                </h4>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-gray-100 text-gray-600">
                    {phase.status}
                  </span>

                  {/* STUDENT SUBMIT */}
                  {userRole === "STUDENT" &&
                    phase.status ===
                      PhaseStatus.OPEN && (
                      <button
                        onClick={() =>
                          handleSubmit(
                            phase.phase_id
                          )
                        }
                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Submit
                      </button>
                    )}

                  {/* TEACHER APPROVE */}
                  {isTeacher &&
                    phase.status ===
                      PhaseStatus.SUBMITTED && (
                      <button
                        onClick={() =>
                          handleApprove(
                            phase.phase_id
                          )
                        }
                        className="text-xs px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}
                </div>

                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {phase.start_date} -{" "}
                  {phase.end_date}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {phase.phase_description}
              </p>

              {phase.comments && (
                <p className="mt-2 text-xs italic text-gray-500">
                  Note: {phase.comments}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimeline;
