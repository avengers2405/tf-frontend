"use client";

import { useState } from "react";
import {
  Users,
  ClipboardList,
  TrendingUp,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

import ProjectDashboardView from "../../../../components/project-details";
import ProjectTimeline from "../../../../components/project-timeline";
import ChatLogbook from "../../../../components/chat-logbook";

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
}

interface Project {
  id: string;
  project_id: string;
  title: string;
  description: string;
  repo_url: string;
  groupName: string;
  members: { name: string; role: string }[];
  phases: Phase[];
}

export default function TeacherDashboard() {
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [isLogbookOpen, setIsLogbookOpen] =
    useState(false);

  const projects: Project[] = [
    {
      id: "101",
      project_id: "101",
      title: "AI-Powered Campus Management System",
      description: "AI-based intelligent campus system.",
      repo_url:
        "https://github.com/team-alpha/campus-management-system",
      groupName: "Team Alpha",
      members: [
        { name: "Alex Kumar", role: "Team Lead" },
        { name: "Sarah Johnson", role: "Backend Developer" },
      ],
      phases: [
        {
          phase_id: 1,
          project_id: "101",
          phase_name: "Requirements Gathering",
          phase_description: "System architecture.",
          start_date: "2025-01-15",
          end_date: "2025-02-01",
          status: PhaseStatus.CLOSED,
        },
        {
          phase_id: 2,
          project_id: "101",
          phase_name: "Backend Development",
          phase_description: "API setup.",
          start_date: "2025-02-02",
          end_date: "2025-03-15",
          status: PhaseStatus.SUBMITTED,
        },
      ],
    },
  ];

  const handleStatusChange = (
    phaseId: number,
    newStatus: PhaseStatus
  ) => {
    console.log(
      `Teacher updated Phase ${phaseId} to ${newStatus}`
    );
  };

  if (selectedProject) {
    const closedCount =
      selectedProject.phases.filter(
        (p) => p.status === PhaseStatus.CLOSED
      ).length;

    const progress =
      (closedCount /
        selectedProject.phases.length) *
      100;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center text-gray-600 hover:text-blue-600 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>

          <ProjectDashboardView
            projectData={selectedProject}
            userRole="TEACHER"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                Project Documentation
              </h3>
              <button
                onClick={() => setIsLogbookOpen(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Open Smart Logbook
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                Live Progress
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {Math.round(progress)}%
              </p>
              <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <ProjectTimeline
            phases={selectedProject.phases}
            userRole="TEACHER"
            onStatusChange={handleStatusChange}
          />
        </div>

        <ChatLogbook
          isOpen={isLogbookOpen}
          onClose={() => setIsLogbookOpen(false)}
          projectData={selectedProject}
          userRole="TEACHER"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          All Projects
        </h1>

        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition mb-4"
          >
            <h2 className="text-lg font-semibold">
              {project.title}
            </h2>
            <p className="text-sm text-gray-500">
              {project.groupName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
