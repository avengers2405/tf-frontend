"use client"
import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import ProjectDashboardView from '../../../../components/project-details';
import ProjectTimeline from '../../../../components/project-timeline';
import ChatLogbook from '../../../../components/chat-logbook';
import { useState } from 'react';

enum PhaseStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LOCKED = 'LOCKED',
}

const StudentDashboard = () => {
  // Static data (Will be replaced by JWT/API call later)
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const projectData = {
    project_id: "101",
    title: 'AI-Powered Campus Management System',
    description: 'Developing an intelligent campus management system that uses machine learning to optimize resource allocation, predict maintenance needs, and enhance student experience through personalized recommendations.',

    technology_stack: 'Next.js, React, Tailwind CSS, Prisma, PostgreSQL, OpenAI API',
    academic_year: '2025-2026',
    repo_url: "https://github.com/team-alpha/campus-management-system",
    groupName: 'Team Alpha',
    members: [
      { name: 'Alex Kumar', role: 'Team Lead' },
      { name: 'Sarah Johnson', role: 'Backend Developer' },
      { name: 'Mike Chen', role: 'Frontend Developer' },
      { name: 'Priya Sharma', role: 'ML Engineer' }
    ],
    teacher: {
      name: 'Dr. Robert Martinez',
      email: 'r.martinez@university.edu',
      department: 'Computer Science'
    },
    startDate: '2025-01-15',
    expectedCompletion: '2025-05-30', 
   phases: [
  {
    phase_id: 1,
    project_id: "101",
    phase_name: "Requirements Gathering",
    phase_description: "Defining system architecture and user stories.",
    start_date: "2025-01-15",
    end_date: "2025-02-01",
    status: PhaseStatus.CLOSED,
    comments: "Completed 2 days early."
  },
  {
    phase_id: 2,
    project_id: "101",
    phase_name: "Backend Development",
    phase_description: "Setting up Prisma schema and API endpoints for student management.",
    start_date: "2025-02-02",
    end_date: "2025-03-15",
    status: PhaseStatus.OPEN,
    comments: null
  },
  {
    phase_id: 3,
    project_id: "101",
    phase_name: "Frontend Development",
    phase_description: "Developing React UI components and integrating with backend APIs.",
    start_date: "2025-03-16",
    end_date: "2025-04-10",
    status: PhaseStatus.OPEN,
    comments: "UI design in progress."
  },
  {
    phase_id: 4,
    project_id: "101",
    phase_name: "Testing & Deployment",
    phase_description: "Performing unit testing, integration testing, and deploying the application.",
    start_date: "2025-04-11",
    end_date: "2025-04-25",
    status: PhaseStatus.OPEN,
    comments: null
  }
]
  };

const handleStatusChange = (phaseId: number, newStatus: string) => {
  console.log(`Phase ${phaseId} updated to ${newStatus}`);
  // In the future, add your API call here to update the DB
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Dashboard</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content (Component) */}
          <div className="lg:col-span-2">
            <ProjectDashboardView projectData={projectData} userRole="STUDENT" />
          </div>

          {/* Supervisor Sidebar (Only in Student View) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Project Supervisor
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">{projectData.teacher.name}</p>
                <p className="text-sm text-gray-600 mb-1">{projectData.teacher.email}</p>
                <p className="text-sm text-gray-500">{projectData.teacher.department}</p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Timeline</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {projectData.startDate} — {projectData.expectedCompletion}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Logbook Component */}
            <div className="lg:col-span-1 mt-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  {/* Changed text-blue-600 here */}
                  <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                  Project Logbook
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-4">
                  Access the automated logbook and project history.
                  </p>
                  <button
                    onClick={() => setIsLogbookOpen(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium"
                  >
                    Open Smart Logbook
                  </button>
                </div>
              <ChatLogbook 
                isOpen={isLogbookOpen}
                onClose={() => setIsLogbookOpen(false)}
                projectData={projectData}
                userRole="STUDENT"
              />
              </div>
            </div>

          </div>
        </div>
        <ProjectTimeline 
          phases={projectData.phases} 
          userRole="STUDENT" 
          onStatusChange={handleStatusChange}
             />
        </div>
      </div>
   
  );
};

export default StudentDashboard;