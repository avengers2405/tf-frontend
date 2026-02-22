"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserRole, Student, Opportunity, Application, Notification, TeamMember } from "./types"

interface AppState {
  // User state
  currentRole: UserRole
  currentUser: Student | null
  setCurrentRole: (role: UserRole) => void
  setCurrentUser: (user: Student | null) => void

  // Opportunities
  opportunities: Opportunity[]
  addOpportunity: (opportunity: Opportunity) => void
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => void

  // Applications
  applications: Application[]
  addApplication: (application: Application) => void
  updateApplication: (id: string, application: Partial<Application>) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void

  // Students (for TnP/Teacher/Recruiter views)
  students: Student[]
  addStudent: (student: Student) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  bulkAddStudents: (students: Student[]) => void

  // Team recommendations
  teamRecommendations: TeamMember[]
  setTeamRecommendations: (members: TeamMember[]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      currentRole: "student",
      currentUser: null,
      opportunities: [],
      applications: [],
      notifications: [],
      students: [],
      teamRecommendations: [],

      // Actions
      setCurrentRole: (role) => set({ currentRole: role }),
      setCurrentUser: (user) => set({ currentUser: user }),

      addOpportunity: (opportunity) => set((state) => ({ opportunities: [...state.opportunities, opportunity] })),
      updateOpportunity: (id, opportunity) =>
        set((state) => ({
          opportunities: state.opportunities.map((o) => (o.id === id ? { ...o, ...opportunity } : o)),
        })),

      addApplication: (application) => set((state) => ({ applications: [...state.applications, application] })),
      updateApplication: (id, application) =>
        set((state) => ({
          applications: state.applications.map((a) => (a.id === id ? { ...a, ...application } : a)),
        })),

      addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
      updateStudent: (id, student) =>
        set((state) => ({
          students: state.students.map((s) => (s.id === id ? { ...s, ...student } : s)),
        })),
      bulkAddStudents: (students) => set((state) => ({ students: [...state.students, ...students] })),

      setTeamRecommendations: (members) => set({ teamRecommendations: members }),
    }),
    {
      name: "campus-portal-storage",
      version: 2,
      migrate: (persistedState: any) => {
        return {
          ...persistedState,
          notifications: [],
        }
      },
    },
  ),
)
