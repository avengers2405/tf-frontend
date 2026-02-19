"use client";
import React, { useState } from "react";
import { BookOpen, GraduationCap } from "lucide-react";
import ProjectDashboardView from "../../../../components/project-details";
import ProjectTimeline from "../../../../components/project-timeline";
import ChatLogbook from "../../../../components/chat-logbook";

enum PhaseStatus {
  OPEN = "OPEN",
  SUBMITTED = "SUBMITTED",
  CLOSED = "CLOSED",
  LOCKED = "LOCKED",
}

const StudentDashboard = () => {
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);

  const projectData = {
    project_id: "101",
    title: "AI-Powered Campus Management System",
    description:
      "Developing an intelligent campus management system that uses machine learning to optimize resource allocation.",
    technology_stack:
      "Next.js, React, Tailwind CSS, Prisma, PostgreSQL",
    academic_year: "2025-2026",
    repo_url:
      "https://github.com/team-alpha/campus-management-system",
    groupName: "Team Alpha",
    members: [
      { name: "Alex Kumar", role: "Team Lead" },
      { name: "Sarah Johnson", role: "Backend Developer" },
      { name: "Mike Chen", role: "Frontend Developer" },
      { name: "Priya Sharma", role: "ML Engineer" },
    ],
    teacher: {
      name: "Dr. Robert Martinez",
      email: "r.martinez@university.edu",
      department: "Computer Science",
    },
    startDate: "2025-01-15",
    expectedCompletion: "2025-05-30",
    phases: [
      {
        phase_id: 1,
        project_id: "101",
        phase_name: "Requirements Gathering",
        phase_description:
          "Defining system architecture and user stories.",
        start_date: "2025-01-15",
        end_date: "2025-02-01",
        status: PhaseStatus.CLOSED,
        comments: "Completed 2 days early.",
      },
      {
        phase_id: 2,
        project_id: "101",
        phase_name: "Backend Development",
        phase_description:
          "Setting up Prisma schema and API endpoints.",
        start_date: "2025-02-02",
        end_date: "2025-03-15",
        status: PhaseStatus.OPEN,
        comments: null,
      },
      {
        phase_id: 3,
        project_id: "101",
        phase_name: "Frontend Development",
        phase_description:
          "Developing React UI components.",
        start_date: "2025-03-16",
        end_date: "2025-04-10",
        status: PhaseStatus.OPEN,
        comments: null,
      },
    ],
  };

  const handleStatusChange = (
    phaseId: number,
    newStatus: PhaseStatus
  ) => {
    console.log(
      `Student updated Phase ${phaseId} to ${newStatus}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Project Dashboard
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProjectDashboardView
              projectData={projectData}
              userRole="STUDENT"
            />
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Project Supervisor
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold">
                  {projectData.teacher.name}
                </p>
                <p className="text-sm">
                  {projectData.teacher.email}
                </p>
                <p className="text-sm">
                  {projectData.teacher.department}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                Project Logbook
              </h3>
              <button
                onClick={() => setIsLogbookOpen(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Open Smart Logbook
              </button>
            </div>
          </div>
        </div>

        <ProjectTimeline
          phases={projectData.phases}
          userRole="STUDENT"
          onStatusChange={handleStatusChange}
        />

        <ChatLogbook
          isOpen={isLogbookOpen}
          onClose={() => setIsLogbookOpen(false)}
          projectData={projectData}
          userRole="STUDENT"
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
