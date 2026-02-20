"use client"
import React, { useState } from 'react';
import { X, Send, BookOpen, Users, GitCommit } from 'lucide-react';
import CommitLog from '@/components/commit-log'; // Adjust path as needed

interface ProjectViewProps {
  projectData: any;
  userRole?: 'STUDENT' | 'TEACHER';
  onBack?: () => void; // Optional back handler for teacher view
}
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

const ProjectDashboardView = ({ projectData, userRole = 'STUDENT' }: ProjectViewProps) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello! I'm your Smart Logbook Assistant." }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ messages: [...messages, userMessage], projectData })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Main Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{projectData.title}</h2>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Users className="w-4 h-4 mr-2" />
            <span className="font-semibold">{projectData.groupName}</span>
          </div>
          <div className="flex items-center text-sm text-blue-600">
            <GitCommit className="w-4 h-4 mr-2" />
            <a href={projectData.repo_url} target="_blank" className="font-semibold hover:underline truncate">
              {projectData.repo_url}
            </a>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Project Description</h3>
          <p className="text-gray-600 leading-relaxed">{projectData.description}</p>
        </div>

        {/* Team Members */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Team Members
              </h3>
              <div className="space-y-2">
              {projectData.members?.map((member: any, index: number) => (

                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-900 font-medium">{member.name}</span>
                    <span className="text-sm text-gray-600">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
      </div>
    </div>
  );
};

export default ProjectDashboardView;