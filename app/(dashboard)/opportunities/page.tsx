// // "use client"

// // import { useState } from "react"
// // import { useAppStore } from "@/lib/store"
// // import { Card } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { SkillBadge } from "@/components/ui/skill-badge"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline"
// // import Link from "next/link"
// // import { getDaysUntil } from "@/lib/utils"

// // export default function OpportunitiesPage() {
// //   const { opportunities } = useAppStore()
// //   const [search, setSearch] = useState("")
// //   const [typeFilter, setTypeFilter] = useState<string>("all")
// //   const [sortBy, setSortBy] = useState("recent")

// //   const filteredOpportunities = opportunities
// //     .filter((opp) => {
// //       const matchesSearch =
// //         opp.title.toLowerCase().includes(search.toLowerCase()) ||
// //         opp.company.toLowerCase().includes(search.toLowerCase()) ||
// //         opp.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()))

// //       const matchesType = typeFilter === "all" || opp.type === typeFilter

// //       return matchesSearch && matchesType
// //     })
// //     .sort((a, b) => {
// //       if (sortBy === "deadline") {
// //         return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
// //       }
// //       return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
// //     })

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// //         <div>
// //           <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunities</h1>
// //           <p className="text-muted-foreground">{filteredOpportunities.length} opportunities available</p>
// //         </div>
// //         <Button asChild className="w-full sm:w-auto">
// //           <Link href="/post-opportunity">Post Opportunity</Link>
// //         </Button>
// //       </div>

// //       {/* Improved Filters Bar */}
// //       <Card className="glass rounded-2xl p-4 border-muted/20">
// //         <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
// //           <div className="relative md:col-span-6">
// //             <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //             <Input
// //               placeholder="Search title, company, or skills..."
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               className="pl-9 bg-background/50"
// //             />
// //           </div>

// //           <div className="flex gap-3 md:col-span-6">
// //             <Select value={typeFilter} onValueChange={setTypeFilter}>
// //               <SelectTrigger className="w-full bg-background/50">
// //                 <div className="flex items-center gap-2">
// //                   <FunnelIcon className="h-4 w-4 text-muted-foreground" />
// //                   <SelectValue placeholder="Type" />
// //                 </div>
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="all">All Types</SelectItem>
// //                 <SelectItem value="internship">Internships</SelectItem>
// //                 <SelectItem value="project">Projects</SelectItem>
// //                 <SelectItem value="fulltime">Full-time</SelectItem>
// //               </SelectContent>
// //             </Select>

// //             <Select value={sortBy} onValueChange={setSortBy}>
// //               <SelectTrigger className="w-full bg-background/50">
// //                 <div className="flex items-center gap-2">
// //                   <ArrowsUpDownIcon className="h-4 w-4 text-muted-foreground" />
// //                   <SelectValue placeholder="Sort" />
// //                 </div>
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="recent">Most Recent</SelectItem>
// //                 <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
// //               </SelectContent>
// //             </Select>
// //           </div>
// //         </div>
// //       </Card>

// //       {/* Opportunities Grid */}
// //       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// //         {filteredOpportunities.map((opp) => {
// //           const daysLeft = getDaysUntil(opp.deadline)

// //           return (
// //             <Card
// //               key={opp.id}
// //               className="glass group flex flex-col rounded-2xl p-5 transition-all hover:shadow-xl hover:border-primary/40"
// //             >
// //               {/* Top Section */}
// //               <div className="mb-4">
// //                 <div className="mb-2 flex items-start justify-between">
// //                   <div className="flex-1 min-w-0 mr-2">
// //                     <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
// //                       {opp.title}
// //                     </h3>
// //                     <p className="text-sm text-muted-foreground font-medium">{opp.company}</p>
// //                   </div>
// //                   <span
// //                     className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold ${
// //                       opp.type === "internship"
// //                         ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
// //                         : opp.type === "project"
// //                           ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
// //                           : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
// //                     }`}
// //                   >
// //                     {opp.type}
// //                   </span>
// //                 </div>
// //                 <p className="text-sm text-muted-foreground line-clamp-2 h-10">
// //                   {opp.description}
// //                 </p>
// //               </div>

// //               {/* Badges Section */}
// //               <div className="mb-4 flex flex-wrap gap-1.5">
// //                 {opp.skills.slice(0, 3).map((skill) => (
// //                   <SkillBadge key={skill} skill={skill} />
// //                 ))}
// //                 {opp.skills.length > 3 && (
// //                   <span className="text-xs text-muted-foreground self-center">
// //                     +{opp.skills.length - 3}
// //                   </span>
// //                 )}
// //               </div>

// //               {/* Meta Info Section */}
// //               <div className="mb-6 space-y-2 text-xs border-t border-muted/10 pt-4">
// //                 <div className="flex items-center justify-between">
// //                    <div className="flex flex-col gap-1">
// //                       {opp.stipend && <span className="flex items-center gap-1.5">💰 <span className="text-foreground/80">{opp.stipend}</span></span>}
// //                       {opp.duration && <span className="flex items-center gap-1.5">⏱️ <span>{opp.duration}</span></span>}
// //                    </div>
// //                    <div className="text-right flex flex-col gap-1">
// //                       <span className={daysLeft <= 3 && daysLeft > 0 ? "text-destructive font-semibold" : ""}>
// //                         📅 {daysLeft > 0 ? `${daysLeft} days left` : "Closed"}
// //                       </span>
// //                       {opp.applicants && <span className="text-muted-foreground">👥 {opp.applicants} applied</span>}
// //                    </div>
// //                 </div>
// //               </div>

// //               {/* Fixed Button at the bottom */}
// //               <div className="mt-auto">
// //                 <Button asChild className="w-full shadow-sm" variant="outline" size="sm">
// //                   <Link href={`/opportunities/${opp.id}`}>View Details</Link>
// //                 </Button>
// //               </div>
// //             </Card>
// //           )
// //         })}
// //       </div>

// //       {filteredOpportunities.length === 0 && (
// //         <Card className="glass rounded-2xl p-16 text-center border-dashed">
// //           <div className="max-w-xs mx-auto space-y-2">
// //              <p className="text-lg font-medium">No results found</p>
// //              <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms to find what you're looking for.</p>
// //              <Button variant="link" onClick={() => {setSearch(""); setTypeFilter("all")}}>Clear all filters</Button>
// //           </div>
// //         </Card>
// //       )}
// //     </div>
// //   )
// // }
// // // "use client"

// // // import { useState } from "react"
// // // import { useAppStore } from "@/lib/store"
// // // import { Card } from "@/components/ui/card"
// // // import { Button } from "@/components/ui/button"
// // // import { Input } from "@/components/ui/input"
// // // import { SkillBadge } from "@/components/ui/skill-badge"
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // // import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline"
// // // import Link from "next/link"
// // // import { getDaysUntil } from "@/lib/utils"

// // // // 🔹 Skill analysis utilities
// // // import { analyzeSkillGap } from "@/lib/skill-gap-analysis/gap"
// // // import { calculateSkillImportance } from "@/lib/skill-gap-analysis/importance"

// // // export default function OpportunitiesPage() {
// // //   const { opportunities } = useAppStore()

// // //   const [search, setSearch] = useState("")
// // //   const [typeFilter, setTypeFilter] = useState<string>("all")
// // //   const [sortBy, setSortBy] = useState("recent")

// // //   // ✅ Resume skills from localStorage
// // //   const resumeSkills =
// // //     typeof window !== "undefined"
// // //       ? JSON.parse(localStorage.getItem("parsedSkills") || "[]").map(
// // //           (s: any) => s.skill
// // //         )
// // //       : []

// // //   // ✅ Global skill importance across ALL opportunities
// // //   const skillImportance = calculateSkillImportance(opportunities)

// // //   const filteredOpportunities = opportunities
// // //     .filter((opp) => {
// // //       const matchesSearch =
// // //         opp.title.toLowerCase().includes(search.toLowerCase()) ||
// // //         opp.company.toLowerCase().includes(search.toLowerCase()) ||
// // //         opp.skills.some((skill) =>
// // //           skill.toLowerCase().includes(search.toLowerCase())
// // //         )

// // //       const matchesType = typeFilter === "all" || opp.type === typeFilter
// // //       return matchesSearch && matchesType
// // //     })
// // //     .sort((a, b) => {
// // //       if (sortBy === "deadline") {
// // //         return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
// // //       }
// // //       return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
// // //     })

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Header */}
// // //       <div className="flex items-center justify-between">
// // //         <div>
// // //           <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
// // //           <p className="mt-1 text-muted-foreground">
// // //             {filteredOpportunities.length} opportunities available
// // //           </p>
// // //         </div>
// // //       </div>

// // //       {/* Filters */}
// // //       <Card className="glass rounded-2xl p-4">
// // //         <div className="flex flex-wrap items-center gap-4">
// // //           <div className="relative flex-1 min-w-[200px]">
// // //             <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
// // //             <Input
// // //               placeholder="Search by title, company, or skills..."
// // //               value={search}
// // //               onChange={(e) => setSearch(e.target.value)}
// // //               className="pl-10"
// // //             />
// // //           </div>

// // //           <Select value={typeFilter} onValueChange={setTypeFilter}>
// // //             <SelectTrigger className="w-[180px]">
// // //               <FunnelIcon className="mr-2 h-4 w-4" />
// // //               <SelectValue />
// // //             </SelectTrigger>
// // //             <SelectContent>
// // //               <SelectItem value="all">All Types</SelectItem>
// // //               <SelectItem value="internship">Internships</SelectItem>
// // //               <SelectItem value="project">Projects</SelectItem>
// // //               <SelectItem value="fulltime">Full-time</SelectItem>
// // //             </SelectContent>
// // //           </Select>

// // //           <Select value={sortBy} onValueChange={setSortBy}>
// // //             <SelectTrigger className="w-[180px]">
// // //               <SelectValue />
// // //             </SelectTrigger>
// // //             <SelectContent>
// // //               <SelectItem value="recent">Most Recent</SelectItem>
// // //               <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
// // //             </SelectContent>
// // //           </Select>
// // //         </div>
// // //       </Card>

// // //       {/* Opportunities Grid */}
// // //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// // //         {filteredOpportunities.map((opp) => {
// // //           const daysLeft = getDaysUntil(opp.deadline)

// // //           // 🔥 Skill gap analysis
// // //           const { matched, missing } = analyzeSkillGap(
// // //             resumeSkills,
// // //             opp.skills
// // //           )

// // //           const matchPercent = Math.round(
// // //             (matched.length / opp.skills.length) * 100
// // //           )

// // //           const readiness =
// // //             matchPercent >= 75
// // //               ? "ready"
// // //               : matchPercent >= 50
// // //               ? "almost"
// // //               : "needs-prep"

// // //           const criticalMissing = skillImportance
// // //             .filter((s) =>
// // //               missing.some(
// // //                 (m) => m.toLowerCase() === s.skill
// // //               )
// // //             )
// // //             .slice(0, 3)

// // //           return (
// // //             <Card
// // //               key={opp.id}
// // //               className="glass group rounded-2xl p-5 transition-all hover:shadow-xl hover:border-primary/50"
// // //             >
// // //               <div className="mb-3">
// // //                 <div className="mb-2 flex items-start justify-between">
// // //                   <div className="flex-1">
// // //                     <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
// // //                       {opp.title}
// // //                     </h3>
// // //                     <p className="text-sm text-muted-foreground">{opp.company}</p>

// // //                     {/* Match % */}
// // //                     <p className="mt-1 text-xs font-medium text-primary">
// // //                       🎯 Match: {matchPercent}%
// // //                     </p>
// // //                   </div>

// // //                   <span
// // //                     className={`rounded-full px-2 py-1 text-xs font-medium ${
// // //                       readiness === "ready"
// // //                         ? "bg-green-100 text-green-700"
// // //                         : readiness === "almost"
// // //                         ? "bg-yellow-100 text-yellow-700"
// // //                         : "bg-red-100 text-red-700"
// // //                     }`}
// // //                   >
// // //                     {readiness === "ready"
// // //                       ? "Ready"
// // //                       : readiness === "almost"
// // //                       ? "Almost Ready"
// // //                       : "Needs Prep"}
// // //                   </span>
// // //                 </div>

// // //                 <p className="text-sm text-muted-foreground line-clamp-2">
// // //                   {opp.description}
// // //                 </p>
// // //               </div>

// // //               {/* Skills */}
// // //               <div className="mb-3 flex flex-wrap gap-1">
// // //                 {opp.skills.slice(0, 3).map((skill) => (
// // //                   <SkillBadge key={skill} skill={skill} />
// // //                 ))}
// // //                 {opp.skills.length > 3 && (
// // //                   <span className="text-xs text-muted-foreground">
// // //                     +{opp.skills.length - 3} more
// // //                   </span>
// // //                 )}
// // //               </div>

// // //               {/* Missing Important Skills */}
// // //               {criticalMissing.length > 0 && (
// // //                 <div className="mb-3">
// // //                   <p className="text-xs text-muted-foreground mb-1">
// // //                     Missing important skills:
// // //                   </p>
// // //                   <div className="flex flex-wrap gap-1">
// // //                     {criticalMissing.map((s) => (
// // //                       <SkillBadge
// // //                         key={s.skill}
// // //                         skill={s.skill}
// // //                         variant="missing"
// // //                       />
// // //                     ))}
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {/* Meta */}
// // //               <div className="mb-4 space-y-1 text-xs text-muted-foreground">
// // //                 {opp.stipend && <p>💰 {opp.stipend}</p>}
// // //                 {opp.duration && <p>⏱️ {opp.duration}</p>}
// // //                 <p className={daysLeft <= 3 ? "text-red-600 font-medium" : ""}>
// // //                   📅 {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
// // //                 </p>
// // //                 {opp.applicants && <p>👥 {opp.applicants} applicants</p>}
// // //               </div>

// // //               <Button asChild className="w-full" size="sm">
// // //                 <Link href={`/opportunities/${opp.id}`}>View Details</Link>
// // //               </Button>
// // //             </Card>
// // //           )
// // //         })}
// // //       </div>

// // //       {filteredOpportunities.length === 0 && (
// // //         <Card className="glass rounded-2xl p-12 text-center">
// // //           <p className="text-muted-foreground">
// // //             No opportunities found matching your criteria
// // //           </p>
// // //         </Card>
// // //       )}
// // //     </div>
// // //   )
// // // }

// "use client"

// import { useState } from "react"
// import { useAppStore } from "@/lib/store"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { SkillBadge } from "@/components/ui/skill-badge"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent } from "@/components/ui/dialog"
// import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, SparklesIcon, UserCircleIcon, CurrencyRupeeIcon, AcademicCapIcon, XMarkIcon } from "@heroicons/react/24/outline"
// import Link from "next/link"
// import { getDaysUntil } from "@/lib/utils"
// // Import the logic we built previously
// import { analyzeOpportunity, generateUserIdeal, UserPreferences } from "@/lib/vibe-logic"
// import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

// export default function OpportunitiesPage() {
//   const { opportunities } = useAppStore()
//   const [search, setSearch] = useState("")
//   const [typeFilter, setTypeFilter] = useState<string>("all")
//   const [sortBy, setSortBy] = useState("recent")

//   // --- VIBE CHECK STATE ---
//   const [userPrefs, setUserPrefs] = useState<UserPreferences>({
//     focusArea: "Full Stack",
//     priority: "Learning",
//     location: "Remote"
//   })
//   const [selectedOpp, setSelectedOpp] = useState<any>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [analyzing, setAnalyzing] = useState(false)

//   // --- CHART DATA GENERATOR ---
//   const getChartData = () => {
//     if (!selectedOpp) return [];
    
//     const oppStats = analyzeOpportunity(selectedOpp, userPrefs);
//     const userStats = generateUserIdeal(userPrefs);

//     return [
//       { subject: 'Salary', A: userStats.financials, B: oppStats.financials, fullMark: 100 },
//       { subject: 'Mentorship', A: userStats.mentorship, B: oppStats.mentorship, fullMark: 100 },
//       { subject: 'Innovation', A: userStats.innovation, B: oppStats.innovation, fullMark: 100 },
//       { subject: 'Work/Life', A: userStats.wlb, B: oppStats.wlb, fullMark: 100 },
//       { subject: 'Skills', A: userStats.skillMatch, B: oppStats.skillMatch, fullMark: 100 },
//       { subject: 'Growth', A: userStats.coolness, B: oppStats.coolness, fullMark: 100 },
//     ];
//   }

//   const handleCheckVibe = (opp: any) => {
//     setSelectedOpp(opp);
//     setAnalyzing(true);
//     setIsModalOpen(true);
//     setTimeout(() => setAnalyzing(false), 1200); // Cinematic delay
//   }

//   const filteredOpportunities = opportunities
//     .filter((opp) => {
//       const matchesSearch =
//         opp.title.toLowerCase().includes(search.toLowerCase()) ||
//         opp.company.toLowerCase().includes(search.toLowerCase()) ||
//         opp.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()))

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
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunities</h1>
//           <p className="text-muted-foreground">{filteredOpportunities.length} opportunities available</p>
//         </div>
//         <Button asChild className="w-full sm:w-auto">
//           <Link href="/post-opportunity">Post Opportunity</Link>
//         </Button>
//       </div>

//       {/* --- VIBE PROFILE CARD --- */}
//       <Card className="glass rounded-2xl p-4 border-primary/20 bg-primary/5">
//         <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//             <div className="flex items-center gap-3 w-full md:w-auto">
//                 <div className="p-2 bg-background rounded-full shadow-sm text-primary">
//                     <UserCircleIcon className="w-6 h-6" />
//                 </div>
//                 <div>
//                     <h3 className="font-bold text-sm">Vibe Preferences</h3>
//                     <p className="text-xs text-muted-foreground">Calibrate the AI to find your perfect fit</p>
//                 </div>
//             </div>
            
//             <div className="flex flex-wrap gap-2 w-full md:w-auto">
//                 <Select value={userPrefs.focusArea} onValueChange={(v: any) => setUserPrefs({...userPrefs, focusArea: v})}>
//                     <SelectTrigger className="w-[140px] h-9 text-xs bg-background border-0 shadow-sm"><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="Full Stack">Full Stack</SelectItem>
//                         <SelectItem value="AI/ML">AI / ML</SelectItem>
//                         <SelectItem value="Mobile">Mobile Dev</SelectItem>
//                         <SelectItem value="Data">Data Science</SelectItem>
//                         <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
//                     </SelectContent>
//                 </Select>
                
//                 <Select value={userPrefs.priority} onValueChange={(v: any) => setUserPrefs({...userPrefs, priority: v})}>
//                     <SelectTrigger className="w-[130px] h-9 text-xs bg-background border-0 shadow-sm"><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="Money">💰 Money</SelectItem>
//                         <SelectItem value="Learning">🎓 Learning</SelectItem>
//                         <SelectItem value="Balance">🧘 Balance</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>
//         </div>
//       </Card>

//       {/* Filters */}
//       <Card className="glass rounded-2xl p-4 border-muted/20">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
//           <div className="relative md:col-span-6">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search title, company, or skills..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-9 bg-background/50"
//             />
//           </div>

//           <div className="flex gap-3 md:col-span-6">
//             <Select value={typeFilter} onValueChange={setTypeFilter}>
//               <SelectTrigger className="w-full bg-background/50">
//                 <div className="flex items-center gap-2">
//                   <FunnelIcon className="h-4 w-4 text-muted-foreground" />
//                   <SelectValue placeholder="Type" />
//                 </div>
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Types</SelectItem>
//                 <SelectItem value="internship">Internships</SelectItem>
//                 <SelectItem value="project">Projects</SelectItem>
//                 <SelectItem value="fulltime">Full-time</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full bg-background/50">
//                 <div className="flex items-center gap-2">
//                   <ArrowsUpDownIcon className="h-4 w-4 text-muted-foreground" />
//                   <SelectValue placeholder="Sort" />
//                 </div>
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="recent">Most Recent</SelectItem>
//                 <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </Card>

//       {/* Opportunities Grid */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {filteredOpportunities.map((opp) => {
//           const daysLeft = getDaysUntil(opp.deadline)

//           return (
//             <Card
//               key={opp.id}
//               className="glass group flex flex-col rounded-2xl p-5 transition-all hover:shadow-xl hover:border-primary/40"
//             >
//               <div className="mb-4">
//                 <div className="mb-2 flex items-start justify-between">
//                   <div className="flex-1 min-w-0 mr-2">
//                     <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
//                       {opp.title}
//                     </h3>
//                     <p className="text-sm text-muted-foreground font-medium">{opp.company}</p>
//                   </div>
//                   <span
//                     className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold ${
//                       opp.type === "internship"
//                         ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
//                         : opp.type === "project"
//                           ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
//                           : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
//                     }`}
//                   >
//                     {opp.type}
//                   </span>
//                 </div>
//                 <p className="text-sm text-muted-foreground line-clamp-2 h-10">
//                   {opp.description}
//                 </p>
//               </div>

//               <div className="mb-4 flex flex-wrap gap-1.5">
//                 {opp.skills.slice(0, 3).map((skill) => (
//                   <SkillBadge key={skill} skill={skill} />
//                 ))}
//                 {opp.skills.length > 3 && (
//                   <span className="text-xs text-muted-foreground self-center">
//                     +{opp.skills.length - 3}
//                   </span>
//                 )}
//               </div>

//               <div className="mb-6 space-y-2 text-xs border-t border-muted/10 pt-4">
//                 <div className="flex items-center justify-between">
//                    <div className="flex flex-col gap-1">
//                       {opp.stipend && <span className="flex items-center gap-1.5">💰 <span className="text-foreground/80">{opp.stipend}</span></span>}
//                       {opp.duration && <span className="flex items-center gap-1.5">⏱️ <span>{opp.duration}</span></span>}
//                    </div>
//                    <div className="text-right flex flex-col gap-1">
//                       <span className={daysLeft <= 3 && daysLeft > 0 ? "text-destructive font-semibold" : ""}>
//                         📅 {daysLeft > 0 ? `${daysLeft} days left` : "Closed"}
//                       </span>
//                       {opp.applicants && <span className="text-muted-foreground">👥 {opp.applicants} applied</span>}
//                    </div>
//                 </div>
//               </div>

//               <div className="mt-auto grid grid-cols-2 gap-2">
//                 <Button 
//                     onClick={() => handleCheckVibe(opp)}
//                     className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm border-0" 
//                     size="sm"
//                 >
//                   <SparklesIcon className="w-3 h-3 mr-1.5 text-yellow-300" />
//                   Vibe Check
//                 </Button>
//                 <Button asChild className="w-full shadow-sm" variant="outline" size="sm">
//                   <Link href={`/opportunities/${opp.id}`}>Details</Link>
//                 </Button>
//               </div>
//             </Card>
//           )
//         })}
//       </div>

//       {filteredOpportunities.length === 0 && (
//         <Card className="glass rounded-2xl p-16 text-center border-dashed">
//           <div className="max-w-xs mx-auto space-y-2">
//              <p className="text-lg font-medium">No results found</p>
//              <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms to find what you're looking for.</p>
//              <Button variant="link" onClick={() => {setSearch(""); setTypeFilter("all")}}>Clear all filters</Button>
//           </div>
//         </Card>
//       )}

//       {/* --- VIBE CHECK MODAL --- */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         {/* INCREASED MAX WIDTH HERE (max-w-5xl) */}
//         <DialogContent className="max-w-5xl bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden rounded-2xl h-[85vh] md:h-[600px]">
//             {analyzing ? (
//                 <div className="h-full flex flex-col items-center justify-center space-y-6">
//                     <div className="relative">
//                         <div className="h-20 w-20 rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
//                         <div className="absolute inset-0 flex items-center justify-center text-xl">🧠</div>
//                     </div>
//                     <div className="text-center space-y-2">
//                         <h3 className="text-xl font-bold animate-pulse text-purple-400">Analyzing Compatibility...</h3>
//                         <p className="text-zinc-500 text-sm">Matching {userPrefs.focusArea} skills with {selectedOpp?.company}...</p>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="flex flex-col md:flex-row h-full">
//                     {/* LEFT: CHART */}
//                     <div className="w-full md:w-1/2 bg-zinc-900/50 p-8 flex flex-col relative">
//                         <div className="absolute top-4 left-4 z-10">
//                             <Badge className="bg-zinc-800 text-zinc-300 border-0">Priority: {userPrefs.priority}</Badge>
//                         </div>
//                         <div className="flex-1 min-h-[300px] flex items-center justify-center">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 {/* REDUCED OUTER RADIUS TO 65% TO FIT LABELS */}
//                                 <RadarChart cx="50%" cy="50%" outerRadius="65%" data={getChartData()}>
//                                     <PolarGrid stroke="#52525b" strokeOpacity={0.5} />
//                                     <PolarAngleAxis 
//                                         dataKey="subject" 
//                                         tick={{ fill: 'white', fontSize: 12, fontWeight: 'bold' }} 
//                                     />
//                                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    
//                                     {/* USER RADAR (Purple) */}
//                                     <Radar 
//                                         name="You" 
//                                         dataKey="A" 
//                                         stroke="#a855f7" 
//                                         strokeWidth={3}
//                                         fill="#a855f7" 
//                                         fillOpacity={0.5} 
//                                         dot={{ r: 4, fillOpacity: 1 }}
//                                     />
                                    
//                                     {/* JOB RADAR (Emerald) */}
//                                     <Radar 
//                                         name={selectedOpp?.company} 
//                                         dataKey="B" 
//                                         stroke="#10b981" 
//                                         strokeWidth={3}
//                                         fill="#10b981" 
//                                         fillOpacity={0.5} 
//                                         dot={{ r: 4, fillOpacity: 1 }}
//                                     />
                                    
//                                     <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}/>
//                                 </RadarChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>

//                     {/* RIGHT: INSIGHTS */}
//                     <div className="w-full md:w-1/2 bg-zinc-950 p-6 md:p-8 flex flex-col justify-center border-l border-zinc-800">
//                         <div className="mb-6">
//                             <h2 className="text-2xl font-black mb-1">{selectedOpp?.title}</h2>
//                             <p className="text-zinc-400">{selectedOpp?.company}</p>
//                         </div>

//                         <div className="space-y-4 mb-8">
//                              {/* Dynamic Insights Logic */}
//                              {analyzeOpportunity(selectedOpp, userPrefs).financials > 80 && userPrefs.priority === 'Money' && (
//                                 <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3">
//                                     <CurrencyRupeeIcon className="w-5 h-5 text-emerald-500 shrink-0" />
//                                     <div>
//                                         <h4 className="font-bold text-sm text-emerald-400">High Financial Match</h4>
//                                         <p className="text-xs text-zinc-400">Top tier stipend for this role type.</p>
//                                     </div>
//                                 </div>
//                             )}

//                             {analyzeOpportunity(selectedOpp, userPrefs).skillMatch < 50 ? (
//                                 <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3">
//                                     <AcademicCapIcon className="w-5 h-5 text-red-500 shrink-0" />
//                                     <div>
//                                         <h4 className="font-bold text-sm text-red-400">Skill Gap</h4>
//                                         <p className="text-xs text-zinc-400">Requires skills outside your {userPrefs.focusArea} focus.</p>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex gap-3">
//                                     <SparklesIcon className="w-5 h-5 text-purple-500 shrink-0" />
//                                     <div>
//                                         <h4 className="font-bold text-sm text-purple-400">Great Fit</h4>
//                                         <p className="text-xs text-zinc-400">Your tech stack aligns perfectly.</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="flex gap-3">
//                             <Button className="flex-1 bg-white text-black hover:bg-zinc-200 font-bold">Apply Now</Button>
                            
//                             {/* CLOSE BUTTON */}
//                             <Button 
//                                 variant="outline" 
//                                 className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white" 
//                                 onClick={() => setIsModalOpen(false)}
//                             >
//                                 <XMarkIcon className="w-4 h-4 mr-2" />
//                                 Close
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SkillBadge } from "@/components/ui/skill-badge"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, SparklesIcon, UserCircleIcon, CurrencyRupeeIcon, AcademicCapIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { getDaysUntil } from "@/lib/utils"
import { analyzeOpportunity, generateUserIdeal, UserPreferences } from "@/lib/vibe-logic"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'
import { useUser } from "@/contexts/UserContext"

export default function OpportunitiesPage() {
  const { opportunities } = useAppStore()
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState("recent")
  const { user, loading, error, refreshUser } = useUser()
  
  // --- USER PERMISSION CHECKS ---
  const isStudent = user?.username === "student"
  const canPostOpp = ["teacher", "tnp", "recruiter"].includes(user?.username?.toLowerCase() || "")

  // --- VIBE CHECK STATE ---
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    focusArea: "Full Stack",
    priority: "Learning",
    location: "Remote"
  })
  const [selectedOpp, setSelectedOpp] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  // --- CHART DATA GENERATOR ---
  const getChartData = () => {
    if (!selectedOpp) return []
    
    const oppStats = analyzeOpportunity(selectedOpp, userPrefs)
    const userStats = generateUserIdeal(userPrefs)

    return [
      { subject: 'Salary', A: userStats.financials, B: oppStats.financials, fullMark: 100 },
      { subject: 'Mentorship', A: userStats.mentorship, B: oppStats.mentorship, fullMark: 100 },
      { subject: 'Innovation', A: userStats.innovation, B: oppStats.innovation, fullMark: 100 },
      { subject: 'Work/Life', A: userStats.wlb, B: oppStats.wlb, fullMark: 100 },
      { subject: 'Skills', A: userStats.skillMatch, B: oppStats.skillMatch, fullMark: 100 },
      { subject: 'Growth', A: userStats.coolness, B: oppStats.coolness, fullMark: 100 },
    ]
  }

  const handleCheckVibe = (opp: any) => {
    setSelectedOpp(opp)
    setAnalyzing(true)
    setIsModalOpen(true)
    setTimeout(() => setAnalyzing(false), 1200)
  }

  // --- BULLETPROOF SEARCH AND FILTER LOGIC ---
  // 1. Ensure opportunities is always an array (prevents crash on load)
  const safeOpportunities = Array.isArray(opportunities) ? opportunities : []

  const filteredOpportunities = safeOpportunities
    .filter((opp) => {
      if (!opp) return false

      // 2. Search Matching (Safe & Case-insensitive)
      const searchTerm = search.toLowerCase().trim()
      const safeTitle = opp.title?.toLowerCase() || ""
      const safeCompany = opp.company?.toLowerCase() || ""
      const safeSkills = Array.isArray(opp.skills) ? opp.skills : []

      const matchesSearch = 
        searchTerm === "" || 
        safeTitle.includes(searchTerm) ||
        safeCompany.includes(searchTerm) ||
        safeSkills.some((skill: string) => skill?.toLowerCase().includes(searchTerm))

      // 3. Type Matching (Forces both sides to lowercase to prevent "Internship" !== "internship")
      const safeType = opp.type?.toLowerCase() || ""
      const filterType = typeFilter.toLowerCase()
      const matchesType = typeFilter === "all" || safeType === filterType

      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      // 4. Sorting Logic (Safe Date Parsing)
      if (sortBy === "deadline") {
        return new Date(a.deadline || 0).getTime() - new Date(b.deadline || 0).getTime()
      }
      return new Date(b.postedDate || 0).getTime() - new Date(a.postedDate || 0).getTime()
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunities</h1>
          <p className="text-muted-foreground">{filteredOpportunities.length} opportunities available</p>
        </div>
        
        {canPostOpp && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/post-opportunity">Post Opportunity</Link>
          </Button>
        )}
      </div>

      {isStudent && (
        <Card className="glass rounded-2xl p-4 border-primary/20 bg-primary/5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="p-2 bg-background rounded-full shadow-sm text-primary">
                      <UserCircleIcon className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="font-bold text-sm">Vibe Preferences</h3>
                      <p className="text-xs text-muted-foreground">Calibrate the AI to find your perfect fit</p>
                  </div>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Select value={userPrefs.focusArea} onValueChange={(v: any) => setUserPrefs({...userPrefs, focusArea: v})}>
                      <SelectTrigger className="w-[140px] h-9 text-xs bg-background border-0 shadow-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="Full Stack">Full Stack</SelectItem>
                          <SelectItem value="AI/ML">AI / ML</SelectItem>
                          <SelectItem value="Mobile">Mobile Dev</SelectItem>
                          <SelectItem value="Data">Data Science</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                      </SelectContent>
                  </Select>
                  
                  <Select value={userPrefs.priority} onValueChange={(v: any) => setUserPrefs({...userPrefs, priority: v})}>
                      <SelectTrigger className="w-[130px] h-9 text-xs bg-background border-0 shadow-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="Money">💰 Money</SelectItem>
                          <SelectItem value="Learning">🎓 Learning</SelectItem>
                          <SelectItem value="Balance">🧘 Balance</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
          </div>
        </Card>
      )}

      {/* Filters & Search UI */}
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
                      opp.type?.toLowerCase() === "internship"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : opp.type?.toLowerCase() === "project"
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

              <div className="mb-4 flex flex-wrap gap-1.5">
                {Array.isArray(opp.skills) && opp.skills.slice(0, 3).map((skill: string) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
                {Array.isArray(opp.skills) && opp.skills.length > 3 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{opp.skills.length - 3}
                  </span>
                )}
              </div>

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

              <div className={`mt-auto grid gap-2 ${isStudent ? "grid-cols-2" : "grid-cols-1"}`}>
                {isStudent && (
                  <Button 
                      onClick={() => handleCheckVibe(opp)}
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm border-0" 
                      size="sm"
                  >
                    <SparklesIcon className="w-3 h-3 mr-1.5 text-yellow-300" />
                    Vibe Check
                  </Button>
                )}
                
                <Button asChild className="w-full shadow-sm" variant="outline" size="sm">
                  <Link href={`/opportunities/${opp.id}`}>Details</Link>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredOpportunities.length === 0 && (
        <Card className="glass rounded-2xl p-16 text-center border-dashed">
          <div className="max-w-xs mx-auto space-y-2">
             <p className="text-lg font-medium">No results found</p>
             <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms to find what you're looking for.</p>
             <Button variant="link" onClick={() => {setSearch(""); setTypeFilter("all")}}>Clear all filters</Button>
          </div>
        </Card>
      )}

      {/* --- VIBE CHECK MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden rounded-2xl h-[85vh] md:h-[600px]">
            {analyzing ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xl">🧠</div>
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold animate-pulse text-purple-400">Analyzing Compatibility...</h3>
                        <p className="text-zinc-500 text-sm">Matching {userPrefs.focusArea} skills with {selectedOpp?.company}...</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row h-full">
                    {/* LEFT: CHART */}
                    <div className="w-full md:w-1/2 bg-zinc-900/50 p-8 flex flex-col relative">
                        <div className="absolute top-4 left-4 z-10">
                            <Badge className="bg-zinc-800 text-zinc-300 border-0">Priority: {userPrefs.priority}</Badge>
                        </div>
                        <div className="flex-1 min-h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={getChartData()}>
                                    <PolarGrid stroke="#52525b" strokeOpacity={0.5} />
                                    <PolarAngleAxis 
                                        dataKey="subject" 
                                        tick={{ fill: 'white', fontSize: 12, fontWeight: 'bold' }} 
                                    />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    
                                    <Radar 
                                        name="You" 
                                        dataKey="A" 
                                        stroke="#a855f7" 
                                        strokeWidth={3}
                                        fill="#a855f7" 
                                        fillOpacity={0.5} 
                                        dot={{ r: 4, fillOpacity: 1 }}
                                    />
                                    
                                    <Radar 
                                        name={selectedOpp?.company} 
                                        dataKey="B" 
                                        stroke="#10b981" 
                                        strokeWidth={3}
                                        fill="#10b981" 
                                        fillOpacity={0.5} 
                                        dot={{ r: 4, fillOpacity: 1 }}
                                    />
                                    
                                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}/>
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* RIGHT: INSIGHTS */}
                    <div className="w-full md:w-1/2 bg-zinc-950 p-6 md:p-8 flex flex-col justify-center border-l border-zinc-800">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black mb-1">{selectedOpp?.title}</h2>
                            <p className="text-zinc-400">{selectedOpp?.company}</p>
                        </div>

                        <div className="space-y-4 mb-8">
                             {analyzeOpportunity(selectedOpp, userPrefs).financials > 80 && userPrefs.priority === 'Money' && (
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3">
                                    <CurrencyRupeeIcon className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm text-emerald-400">High Financial Match</h4>
                                        <p className="text-xs text-zinc-400">Top tier stipend for this role type.</p>
                                    </div>
                                </div>
                            )}

                            {analyzeOpportunity(selectedOpp, userPrefs).skillMatch < 50 ? (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3">
                                    <AcademicCapIcon className="w-5 h-5 text-red-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm text-red-400">Skill Gap</h4>
                                        <p className="text-xs text-zinc-400">Requires skills outside your {userPrefs.focusArea} focus.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex gap-3">
                                    <SparklesIcon className="w-5 h-5 text-purple-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm text-purple-400">Great Fit</h4>
                                        <p className="text-xs text-zinc-400">Your tech stack aligns perfectly.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button className="flex-1 bg-white text-black hover:bg-zinc-200 font-bold">Apply Now</Button>
                            
                            <Button 
                                variant="outline" 
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white" 
                                onClick={() => setIsModalOpen(false)}
                            >
                                <XMarkIcon className="w-4 h-4 mr-2" />
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  )
}