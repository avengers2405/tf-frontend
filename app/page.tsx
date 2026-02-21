"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { mockStudents, mockOpportunities, mockApplications, mockNotifications } from "@/lib/mock-data"

export default function HomePage() {
  const router = useRouter()
  const { currentRole, setCurrentUser, opportunities, students, bulkAddStudents } = useAppStore()

  useEffect(() => {
    const store = useAppStore.getState()
    
    // Initialize mock data only once on first load
    if (store.students.length === 0) {
      bulkAddStudents(mockStudents)
    }

    if (store.opportunities.length === 0) {
      mockOpportunities.forEach((opp) => {
        useAppStore.getState().addOpportunity(opp)
      })
    }

    if (store.applications.length === 0) {
      mockApplications.forEach((app) => {
        useAppStore.getState().addApplication(app)
      })
    }

    if (store.notifications.length === 0) {
      mockNotifications.forEach((notif) => {
        useAppStore.getState().addNotification(notif)
      })
    }

    // Set current user (mock)
    setCurrentUser(mockStudents[0])

    // Redirect to appropriate dashboard
    router.push(`/dashboard/${currentRole}`)
  }, [currentRole, router, setCurrentUser, bulkAddStudents])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Loading Katana...</p>
      </div>
    </div>
  )
}
