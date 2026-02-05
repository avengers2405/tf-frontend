"use client"
import React from 'react';
import { GraduationCap } from 'lucide-react';
import ProjectDashboardView from '../../../../components/project-details';

const StudentDashboard = () => {
  // Static data (Will be replaced by JWT/API call later)
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
    expectedCompletion: '2025-05-30'
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;