"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SkillBadge } from "@/components/ui/skill-badge"
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline"
import { formatDate, getDaysUntil } from "@/lib/utils"
import { calculateMatchScore } from "@/lib/mock-data"

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { opportunities, currentUser, applications, addApplication } = useAppStore()

  const opportunity = opportunities.find((o) => o.id === resolvedParams.id)
  const hasApplied = applications.some(
    (app) => app.opportunityId === resolvedParams.id && app.studentId === currentUser?.id,
  )

  if (!opportunity) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Opportunity not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  const matchScore = currentUser ? calculateMatchScore(currentUser.skills, opportunity.skills) : 0

  const daysLeft = getDaysUntil(opportunity.deadline)

  const applicationStages = [
    { name: "Applied", status: "complete", date: "2025-01-20" },
    { name: "Screening", status: "complete", date: "2025-01-22" },
    { name: "Test", status: "current", date: "2025-01-26" },
    { name: "Interview", status: "upcoming", date: "TBD" },
    { name: "HR Round", status: "upcoming", date: "TBD" },
    { name: "Final", status: "upcoming", date: "TBD" },
  ]

  const handleApply = () => {
    if (!currentUser) return

    const newApplication = {
      id: `APP${Date.now()}`,
      opportunityId: opportunity.id,
      studentId: currentUser.id,
      stage: "applied" as const,
      matchScore,
      appliedDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    addApplication(newApplication)

    // Add notification
    useAppStore.getState().addNotification({
      id: `N${Date.now()}`,
      title: "Application Submitted",
      message: `Your application for ${opportunity.title} has been submitted successfully!`,
      type: "success",
      read: false,
      timestamp: new Date().toISOString(),
    })

    router.push("/applications")
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => router.back()} variant="ghost" size="sm">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass rounded-2xl p-6">
            <div className="mb-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground">{opportunity.title}</h1>
                  <p className="mt-1 text-lg text-muted-foreground">{opportunity.company}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    opportunity.type === "internship"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : opportunity.type === "project"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  }`}
                >
                  {opportunity.type}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {opportunity.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="mb-2 font-semibold text-foreground">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{opportunity.description}</p>
              </div>

              <div>
                <h2 className="mb-2 font-semibold text-foreground">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.map((skill) => {
                    const isMatched = currentUser?.skills.some(
                      (s) =>
                        s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()),
                    )
                    return <SkillBadge key={skill} skill={skill} variant={isMatched ? "matched" : "default"} />
                  })}
                </div>
              </div>

              {opportunity.eligibility && (
                <div>
                  <h2 className="mb-2 font-semibold text-foreground">Eligibility</h2>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {opportunity.eligibility.minCGPA && <li>Minimum CGPA: {opportunity.eligibility.minCGPA}</li>}
                    {opportunity.eligibility.departments && (
                      <li>Departments: {opportunity.eligibility.departments.join(", ")}</li>
                    )}
                    {opportunity.eligibility.years && <li>Year: {opportunity.eligibility.years.join(", ")}</li>}
                  </ul>
                </div>
              )}
            </div>
          </Card>

          {/* Application Timeline */}
          {hasApplied && (
            <Card className="glass rounded-2xl p-6">
              <h2 className="mb-6 text-xl font-semibold text-foreground">Application Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
                <div className="space-y-6">
                  {applicationStages.map((stage) => (
                    <div key={stage.name} className="relative flex items-start gap-4 pl-10">
                      <div className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 ${stage.status === "complete" ? "border-primary bg-primary" :
                        stage.status === "current" ? "border-primary bg-background" : "border-border bg-background"
                        }`}
                      >
                        {stage.status === "complete" && <CheckCircleIcon className="h-5 w-5 text-primary-foreground" />}
                        {stage.status === "current" && <ClockIcon className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <h3 className="font-semibold text-foreground">{stage.name}</h3>
                        <p className="text-sm text-muted-foreground">{stage.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="glass rounded-2xl p-6">
            {currentUser && (
              <div className="mb-4 text-center">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">{matchScore}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Your Match Score</p>
              </div>
            )}

            {hasApplied ? (
              <div className="text-center py-4">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-600 mb-2" />
                <p className="font-medium text-foreground">Application Submitted</p>
                <p className="text-sm text-muted-foreground">We'll notify you of updates</p>
              </div>
            ) : (
              <Button onClick={handleApply} disabled={daysLeft <= 0} className="w-full" size="lg">
                {daysLeft <= 0 ? "Deadline Passed" : "Apply Now"}
              </Button>
            )}
          </Card>

          {/* Details Card */}
          <Card className="glass rounded-2xl p-6">
            <h3 className="mb-4 font-semibold text-foreground">Opportunity Details</h3>
            <div className="space-y-3 text-sm">
              {opportunity.stipend && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stipend</span>
                  <span className="font-medium text-foreground">{opportunity.stipend}</span>
                </div>
              )}
              {opportunity.duration && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">{opportunity.duration}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posted</span>
                <span className="font-medium text-foreground">{formatDate(opportunity.postedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deadline</span>
                <span className={`font-medium ${daysLeft <= 3 ? "text-red-600" : "text-foreground"}`}>
                  {formatDate(opportunity.deadline)}
                  {daysLeft > 0 && ` (${daysLeft}d left)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applicants</span>
                <span className="font-medium text-foreground">{opportunity.applicants || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posted By</span>
                <span className="font-medium text-foreground">{opportunity.postedBy}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
