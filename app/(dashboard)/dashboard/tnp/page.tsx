"use client"
import { useAppStore } from "@/lib/store"
import { StatCard } from "@/components/ui/stat-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BriefcaseIcon, UserGroupIcon, ChartBarIcon, CheckCircleIcon, ClockIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline"
import { DomainChart } from "@/components/ui/domain-chart"

export default function TnPDashboard() {
  const { opportunities, applications, students } = useAppStore()

  const totalApplications = applications.length
  const selectedCount = applications.filter((a) => a.stage === "selected").length
  const inProgressCount = applications.filter((a) => !["selected", "rejected"].includes(a.stage)).length

  // Calculate skill distribution
  const skillCounts: Record<string, number> = {}
  students.forEach((student) => {
    student.skills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1
    })
  })

  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)

  // Mock insights data
  const insights = [
    { opportunity: "Full Stack Developer Intern", attempts: 45, selections: 5, ratio: "11%" },
    { opportunity: "ML Research Intern", attempts: 32, selections: 3, ratio: "9%" },
    { opportunity: "Android Developer Position", attempts: 28, selections: 4, ratio: "14%" },
  ]

  // Calculate average domain scores
  const avgDomains = {
    web: Math.round(students.reduce((sum, s) => sum + s.domains.web, 0) / students.length),
    ml: Math.round(students.reduce((sum, s) => sum + s.domains.ml, 0) / students.length),
    cp: Math.round(students.reduce((sum, s) => sum + s.domains.cp, 0) / students.length),
    appDev: Math.round(students.reduce((sum, s) => sum + s.domains.appDev, 0) / students.length),
    cyber: Math.round(students.reduce((sum, s) => sum + s.domains.cyber, 0) / students.length),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">TnP Coordinator Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Manage placements and track student progress</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Opportunities"
          value={opportunities.length}
          description="Posted this semester"
          icon={<BriefcaseIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Total Applications"
          value={totalApplications}
          description={`${inProgressCount} in progress`}
          icon={<ClockIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Selections"
          value={selectedCount}
          description={`${((selectedCount / totalApplications) * 100).toFixed(1)}% success rate`}
          icon={<CheckCircleIcon className="h-6 w-6" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Registered Students"
          value={students.length}
          description="Across all departments"
          icon={<UserGroupIcon className="h-6 w-6" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Average Domain Distribution */}
        <Card className="glass lg:col-span-2 rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Average Student Domain Strength</h2>
          <div className="h-72">
            <DomainChart domains={avgDomains} />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/post-opportunity">
                <BriefcaseIcon className="mr-2 h-5 w-5" />
                Post New Opportunity
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/bulk-upload">
                <UserGroupIcon className="mr-2 h-5 w-5" />
                Bulk Upload Students
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/resumes">
                <UserGroupIcon className="mr-2 h-5 w-5" />
                View Student Database
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/analytics">
                <ChartBarIcon className="mr-2 h-5 w-5" />
                View Analytics
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/send-invites">
                <PaperAirplaneIcon className="mr-2 h-5 w-5" />
                Send Invites
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* TnP Insights Report */}
      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Placement Insights</h2>
        <p className="mb-4 text-sm text-muted-foreground">Opportunities with high attempts but low selections</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="pb-3 text-sm font-medium text-muted-foreground">Opportunity</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Applications</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Selections</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Success Rate</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {insights.map((insight, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-4 text-sm font-medium text-foreground">{insight.opportunity}</td>
                  <td className="py-4 text-sm text-muted-foreground">{insight.attempts}</td>
                  <td className="py-4 text-sm text-muted-foreground">{insight.selections}</td>
                  <td className="py-4">
                    <span
                      className={`text-sm font-medium ${
                        Number.parseInt(insight.ratio) > 12 ? "text-green-600" : "text-orange-600"
                      }`}
                    >
                      {insight.ratio}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        Number.parseInt(insight.ratio) > 12
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}
                    >
                      {Number.parseInt(insight.ratio) > 12 ? "Good" : "Needs Attention"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top Skills Distribution */}
      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Most Common Skills</h2>
        <div className="space-y-3">
          {topSkills.map(([skill, count]) => (
            <div key={skill} className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{skill}</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(count / students.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Applications */}
      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Recent Applications</h2>
        <div className="space-y-3">
          {applications.slice(0, 5).map((app) => {
            const opportunity = opportunities.find((o) => o.id === app.opportunityId)
            const student = students.find((s) => s.id === app.studentId)

            return (
              <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{opportunity?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Student {student?.id} • Match: {app.matchScore}%
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      app.stage === "selected"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : app.stage === "rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {app.stage}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
