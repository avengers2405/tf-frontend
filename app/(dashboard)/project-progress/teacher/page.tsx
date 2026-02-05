'use client';
//add filter based on project name, team name, team lead name
//print static projectc data when the project is clicked. 
import { useState } from 'react';
import { Users, ClipboardList, TrendingUp } from 'lucide-react';
import ProjectDashboardView from '../../../../components/project-details';

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
    startDate: '2025-01-15',
    expectedCompletion: '2025-05-30'
  };

interface Project {
  id: string;
  title: string;
  teamName: string;
  startDate: string;
  expectedEnd: string;
  status: 'ongoing' | 'completed' | 'pending';
  teamSize: number;
  progress: number;
}

export default function TeacherDashboard() {
     
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  // Sample projects data - replace with actual data fetching
  const projects: Project[] = [
    {
      id: '101',
      title: 'AI-Powered Campus Management System',
      teamName: 'Team Alpha',
      startDate: '2025-01-15',
      expectedEnd: '2025-05-30',
      status: 'ongoing',
      teamSize: 4,
      progress: 35
    },
    {
      id: '101',
      title: 'Smart Library Management System',
      teamName: 'Team Beta',
      startDate: '2025-01-10',
      expectedEnd: '2025-04-30',
      status: 'ongoing',
      teamSize: 3,
      progress: 60
    },
    {
      id: '101',
      title: 'Student Performance Analytics Dashboard',
      teamName: 'Team Gamma',
      startDate: '2024-10-01',
      expectedEnd: '2025-02-15',
      status: 'ongoing',
      teamSize: 5,
      progress: 85
    },
    {
      id: '101',
      title: 'Campus Event Management Platform',
      teamName: 'Team Delta',
      startDate: '2024-11-20',
      expectedEnd: '2025-03-30',
      status: 'ongoing',
      teamSize: 4,
      progress: 45
    }
  ];

  const projectNames = Array.from(projects.map(p => p.title));
  const teamNames = Array.from(projects.map(p => p.teamName));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredProjects = projects.filter((project) => {
    const projectMatch =
      projectFilter === '' || project.title === projectFilter;

    const teamMatch =
      teamFilter === '' || project.teamName === teamFilter;

    return projectMatch && teamMatch;
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  if (selectedProject) {
    return (
      <ProjectDashboardView 
        projectData={projectData} 
        userRole="TEACHER"
        onBack={() => setSelectedProject(null)} // Add a back button handler
      />
    );
  }
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
            <p className="text-gray-600 mt-1">Monitor and manage all student projects</p>
          </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {/* Project Name Search */}
    <div>
        <label className="text-sm text-gray-600">Project Name</label>
        <select
            value={projectFilter}
            onChange={(e) =>{ setProjectFilter(e.target.value) , setTeamFilter('')}}
            className="mt-1 w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
            <option value="">All Projects</option>
            {projectNames.map(project => (
            <option key={project} value={project}>{project}</option>
            ))}
        </select>
    </div>

    {/* Team Name Filter */}
    <div>
        <label className="text-sm text-gray-600">Team Name</label>
        <select
            value={teamFilter}
            onChange={(e) => {setTeamFilter(e.target.value) , setProjectFilter('')}}
            className="mt-1 w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
            <option value="">All Teams</option>
            {teamNames.map(team => (
            <option key={team} value={team}>{team}</option>
            ))}
        </select>
    </div>

    </div>
        </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{projects.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ongoing</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {projects.filter(p => p.status === 'ongoing').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {projects.reduce((acc, p) => acc + p.teamSize, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Progress</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{project.teamName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{project.teamSize} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.expectedEnd).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}