"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  BriefcaseIcon,
  UserGroupIcon,
  ChartBarIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"

export default function AnalyticsPage() {
  const { students, opportunities, applications } = useAppStore()

  // Department distribution
  const deptCounts: Record<string, number> = {}
  students.forEach((s) => {
    deptCounts[s.department] = (deptCounts[s.department] || 0) + 1
  })
  const deptData = Object.entries(deptCounts).map(([name, value]) => ({
    name,
    value,
  }))

  // Year distribution
  const yearCounts: Record<number, number> = {}
  students.forEach((s) => {
    yearCounts[s.year] = (yearCounts[s.year] || 0) + 1
  })
  const yearData = Object.entries(yearCounts).map(([name, value]) => ({
    name: `Year ${name}`,
    value: Number(value),
  }))

  // Application stages
  const stageCounts: Record<string, number> = {}
  applications.forEach((a) => {
    stageCounts[a.stage] = (stageCounts[a.stage] || 0) + 1
  })
  const stageData = Object.entries(stageCounts).map(([name, value]) => ({
    name,
    value,
  }))




  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const avgCGPA = (
    students.reduce((sum, s) => sum + s.cgpa, 0) / students.length
  ).toFixed(2)

  const placementRate =
    applications.length > 0
      ? (
          (applications.filter((a) => a.stage === "selected").length /
            applications.length) *
          100
        ).toFixed(1)
      : "0"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>


        <p className="mt-1 text-muted-foreground">
          Comprehensive insights and statistics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={students.length}
          description="Registered in database"
          icon={<UserGroupIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Active Opportunities"
          value={opportunities.length}
          description="Currently available"
          icon={<BriefcaseIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Average CGPA"
          value={avgCGPA}
          description="Across all students"
          icon={<AcademicCapIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Placement Rate"
          value={`${placementRate}%`}
          description="Selection success rate"
          icon={<ChartBarIcon className="h-6 w-6" />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>
      <Link href="/analytics/unplaced">

  <Card className="glass rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
    <h2 className="text-xl font-semibold text-foreground mb-2">
      Unplaced Students Analysis
    </h2>
    <p className="text-sm text-muted-foreground">
      Identify students who have attended multiple interviews but are still not placed
    </p>
  </Card>
</Link>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Distribution */}
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Department Distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={({ name, percent }: any) =>
                  //   `${name} ${(percent * 100).toFixed(0)}%`
                  // }
                  
                  outerRadius={80}
                  dataKey="value"
                >
                  {deptData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Year Distribution */}
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Year-wise Distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--chart-1))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

    
        {/* Application Pipeline */}
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Application Pipeline
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  
                  outerRadius={80}
                  dataKey="value"
                >
                  {stageData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}


