"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SkillBadge } from "@/components/ui/skill-badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { getDaysUntil } from "@/lib/utils"

export default function OpportunitiesPage() {
  const { opportunities } = useAppStore()
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState("recent")

  const filteredOpportunities = opportunities
    .filter((opp) => {
      const matchesSearch =
        opp.title.toLowerCase().includes(search.toLowerCase()) ||
        opp.company.toLowerCase().includes(search.toLowerCase()) ||
        opp.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()))

      const matchesType = typeFilter === "all" || opp.type === typeFilter

      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunities</h1>
          <p className="text-muted-foreground">{filteredOpportunities.length} opportunities available</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/post-opportunity">Post Opportunity</Link>
        </Button>
      </div>

      {/* Improved Filters Bar */}
      <Card className="glass rounded-2xl p-4 border-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="relative md:col-span-6">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search title, company, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50"
            />
          </div>

          <div className="flex gap-3 md:col-span-6">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full bg-background/50">
                <div className="flex items-center gap-2">
                  <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="internship">Internships</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
                <SelectItem value="fulltime">Full-time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full bg-background/50">
                <div className="flex items-center gap-2">
                  <ArrowsUpDownIcon className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Sort" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOpportunities.map((opp) => {
          const daysLeft = getDaysUntil(opp.deadline)

          return (
            <Card
              key={opp.id}
              className="glass group flex flex-col rounded-2xl p-5 transition-all hover:shadow-xl hover:border-primary/40"
            >
              {/* Top Section */}
              <div className="mb-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1 min-w-0 mr-2">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {opp.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">{opp.company}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold ${
                      opp.type === "internship"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : opp.type === "project"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    }`}
                  >
                    {opp.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                  {opp.description}
                </p>
              </div>

              {/* Badges Section */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {opp.skills.slice(0, 3).map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
                {opp.skills.length > 3 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{opp.skills.length - 3}
                  </span>
                )}
              </div>

              {/* Meta Info Section */}
              <div className="mb-6 space-y-2 text-xs border-t border-muted/10 pt-4">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col gap-1">
                      {opp.stipend && <span className="flex items-center gap-1.5">💰 <span className="text-foreground/80">{opp.stipend}</span></span>}
                      {opp.duration && <span className="flex items-center gap-1.5">⏱️ <span>{opp.duration}</span></span>}
                   </div>
                   <div className="text-right flex flex-col gap-1">
                      <span className={daysLeft <= 3 && daysLeft > 0 ? "text-destructive font-semibold" : ""}>
                        📅 {daysLeft > 0 ? `${daysLeft} days left` : "Closed"}
                      </span>
                      {opp.applicants && <span className="text-muted-foreground">👥 {opp.applicants} applied</span>}
                   </div>
                </div>
              </div>

              {/* Fixed Button at the bottom */}
              <div className="mt-auto">
                <Button asChild className="w-full shadow-sm" variant="outline" size="sm">
                  <Link href={`/opportunities/${opp.id}`}>View Details</Link>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredOpportunities.length === 0 && (
        <Card className="glass rounded-2xl p-16 text-center border-dashed">
          <div className="max-w-xs mx-auto space-y-2">
             <p className="text-lg font-medium">No results found</p>
             <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms to find what you're looking for.</p>
             <Button variant="link" onClick={() => {setSearch(""); setTypeFilter("all")}}>Clear all filters</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
// "use client"

// import { useState } from "react"
// import { useAppStore } from "@/lib/store"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { SkillBadge } from "@/components/ui/skill-badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline"
// import Link from "next/link"
// import { getDaysUntil } from "@/lib/utils"

// // 🔹 Skill analysis utilities
// import { analyzeSkillGap } from "@/lib/skill-gap-analysis/gap"
// import { calculateSkillImportance } from "@/lib/skill-gap-analysis/importance"

// export default function OpportunitiesPage() {
//   const { opportunities } = useAppStore()

//   const [search, setSearch] = useState("")
//   const [typeFilter, setTypeFilter] = useState<string>("all")
//   const [sortBy, setSortBy] = useState("recent")

//   // ✅ Resume skills from localStorage
//   const resumeSkills =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("parsedSkills") || "[]").map(
//           (s: any) => s.skill
//         )
//       : []

//   // ✅ Global skill importance across ALL opportunities
//   const skillImportance = calculateSkillImportance(opportunities)

//   const filteredOpportunities = opportunities
//     .filter((opp) => {
//       const matchesSearch =
//         opp.title.toLowerCase().includes(search.toLowerCase()) ||
//         opp.company.toLowerCase().includes(search.toLowerCase()) ||
//         opp.skills.some((skill) =>
//           skill.toLowerCase().includes(search.toLowerCase())
//         )

//       const matchesType = typeFilter === "all" || opp.type === typeFilter
//       return matchesSearch && matchesType
//     })
//     .sort((a, b) => {
//       if (sortBy === "deadline") {
//         return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
//       }
//       return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
//     })

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
//           <p className="mt-1 text-muted-foreground">
//             {filteredOpportunities.length} opportunities available
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <Card className="glass rounded-2xl p-4">
//         <div className="flex flex-wrap items-center gap-4">
//           <div className="relative flex-1 min-w-[200px]">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search by title, company, or skills..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           <Select value={typeFilter} onValueChange={setTypeFilter}>
//             <SelectTrigger className="w-[180px]">
//               <FunnelIcon className="mr-2 h-4 w-4" />
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Types</SelectItem>
//               <SelectItem value="internship">Internships</SelectItem>
//               <SelectItem value="project">Projects</SelectItem>
//               <SelectItem value="fulltime">Full-time</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="recent">Most Recent</SelectItem>
//               <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </Card>

//       {/* Opportunities Grid */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {filteredOpportunities.map((opp) => {
//           const daysLeft = getDaysUntil(opp.deadline)

//           // 🔥 Skill gap analysis
//           const { matched, missing } = analyzeSkillGap(
//             resumeSkills,
//             opp.skills
//           )

//           const matchPercent = Math.round(
//             (matched.length / opp.skills.length) * 100
//           )

//           const readiness =
//             matchPercent >= 75
//               ? "ready"
//               : matchPercent >= 50
//               ? "almost"
//               : "needs-prep"

//           const criticalMissing = skillImportance
//             .filter((s) =>
//               missing.some(
//                 (m) => m.toLowerCase() === s.skill
//               )
//             )
//             .slice(0, 3)

//           return (
//             <Card
//               key={opp.id}
//               className="glass group rounded-2xl p-5 transition-all hover:shadow-xl hover:border-primary/50"
//             >
//               <div className="mb-3">
//                 <div className="mb-2 flex items-start justify-between">
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
//                       {opp.title}
//                     </h3>
//                     <p className="text-sm text-muted-foreground">{opp.company}</p>

//                     {/* Match % */}
//                     <p className="mt-1 text-xs font-medium text-primary">
//                       🎯 Match: {matchPercent}%
//                     </p>
//                   </div>

//                   <span
//                     className={`rounded-full px-2 py-1 text-xs font-medium ${
//                       readiness === "ready"
//                         ? "bg-green-100 text-green-700"
//                         : readiness === "almost"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {readiness === "ready"
//                       ? "Ready"
//                       : readiness === "almost"
//                       ? "Almost Ready"
//                       : "Needs Prep"}
//                   </span>
//                 </div>

//                 <p className="text-sm text-muted-foreground line-clamp-2">
//                   {opp.description}
//                 </p>
//               </div>

//               {/* Skills */}
//               <div className="mb-3 flex flex-wrap gap-1">
//                 {opp.skills.slice(0, 3).map((skill) => (
//                   <SkillBadge key={skill} skill={skill} />
//                 ))}
//                 {opp.skills.length > 3 && (
//                   <span className="text-xs text-muted-foreground">
//                     +{opp.skills.length - 3} more
//                   </span>
//                 )}
//               </div>

//               {/* Missing Important Skills */}
//               {criticalMissing.length > 0 && (
//                 <div className="mb-3">
//                   <p className="text-xs text-muted-foreground mb-1">
//                     Missing important skills:
//                   </p>
//                   <div className="flex flex-wrap gap-1">
//                     {criticalMissing.map((s) => (
//                       <SkillBadge
//                         key={s.skill}
//                         skill={s.skill}
//                         variant="missing"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Meta */}
//               <div className="mb-4 space-y-1 text-xs text-muted-foreground">
//                 {opp.stipend && <p>💰 {opp.stipend}</p>}
//                 {opp.duration && <p>⏱️ {opp.duration}</p>}
//                 <p className={daysLeft <= 3 ? "text-red-600 font-medium" : ""}>
//                   📅 {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
//                 </p>
//                 {opp.applicants && <p>👥 {opp.applicants} applicants</p>}
//               </div>

//               <Button asChild className="w-full" size="sm">
//                 <Link href={`/opportunities/${opp.id}`}>View Details</Link>
//               </Button>
//             </Card>
//           )
//         })}
//       </div>

//       {filteredOpportunities.length === 0 && (
//         <Card className="glass rounded-2xl p-12 text-center">
//           <p className="text-muted-foreground">
//             No opportunities found matching your criteria
//           </p>
//         </Card>
//       )}
//     </div>
//   )
// }