"use client"
import React, { useState } from 'react';
import { X, Send, BookOpen } from 'lucide-react';
import CommitLog from '@/components/commit-log';

interface ChatLogbookProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: any;
  userRole: 'STUDENT' | 'TEACHER';
}

const ChatLogbook = ({ isOpen, onClose, projectData, userRole }: ChatLogbookProps) => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "" }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // try {
    //   const response = await fetch('/api/chat', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ messages: [...messages, userMessage], projectData })
    //   });
    //   const data = await response.json();
    //   setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    // } catch (error) {
    //   setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to AI.' }]);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  if (!isOpen) return null;

  return (
    // CHANGED: Added backdrop-blur-md and changed to bg-black/40 for a clean blurred overlay
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 mr-2" /> 
            <h3 className="text-lg font-semibold">Project Tracker</h3>
          </div>
          {/* CHANGED: Added hover effects and padding to the close button */}
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-blue-700 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body - CommitLog fetches automatically on mount inside the modal */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <CommitLog projectId={projectData.project_id} />
          
          {/* Render Chat Messages */}
          {messages.map((msg, idx) => (
            // Added a check to hide empty initial assistant messages
            msg.content && (
              <div key={idx} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-50 ml-auto' : 'bg-gray-100 mr-auto'} max-w-[80%]`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            )
          ))}
          
          {isLoading && <div className="animate-pulse bg-gray-100 h-10 w-20 rounded" />}
        </div>

        {/* Input area - Only available to TEACHER */}
        {userRole === "TEACHER" && (
          <div className="border-t p-4 flex space-x-2">
            <textarea 
              value={inputMessage} 
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 border rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type here..."
              rows={1}
            />
            <button 
              onClick={handleSendMessage} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLogbook;