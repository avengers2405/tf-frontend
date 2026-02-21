// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useAppStore } from "@/lib/store"
// import { StatCard } from "@/components/ui/stat-card"
// import { SkillBadge } from "@/components/ui/skill-badge"
// import { DomainChart } from "@/components/ui/domain-chart"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/ui/switch"

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import {
//   BriefcaseIcon,
//   DocumentTextIcon,
//   ChartBarIcon,
//   ArrowUpTrayIcon,
//   ArrowDownTrayIcon,
//   UserGroupIcon,
//   LightBulbIcon,
//   EyeIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   DocumentIcon,
// } from "@heroicons/react/24/outline"
// import { calculateMatchScore, generateTeamRecommendations } from "@/lib/mock-data"
// import Link from "next/link"
// import { analyzeSkillGap } from "@/lib/skill-gap-analysis/gap"
// import { calculateSkillImportance } from "@/lib/skill-gap-analysis/importance"
// import { normalizeSkillList } from "@/lib/skill-gap-analysis/normalize"

// interface DomainData {
//   web: number
//   ml: number
//   core: number
//   systems: number
//   tools: number
// }

// export default function StudentDashboard() {
//   const { currentUser, opportunities, applications, students, setTeamRecommendations } = useAppStore()

//   // Dialog States
//   const [showResumeUpload, setShowResumeUpload] = useState(false)
//   const [showMatchAnalysis, setShowMatchAnalysis] = useState(false)
//   const [showAnonymousResume, setShowAnonymousResume] = useState(false)
//   const [showChatbot, setShowChatbot] = useState(false)

//   // Parser & Data States
//   const [isUploading, setIsUploading] = useState(false)
//   const [extractedSkills, setExtractedSkills] = useState<any[] | null>(null)
//   const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)

//   // Resume PDFs State
//   const [resumes, setResumes] = useState<any[]>([])
//   const [loadingResumes, setLoadingResumes] = useState(true)
//   const [pdfUrls, setPdfUrls] = useState<{ [key: string]: string }>({})
//   const [showAnonymizedResumes, setShowAnonymizedResumes] = useState(false)

//   // State for the chart - initialized with current user domains
//   // Normalize old + new domain keys into ONE consistent shape
//   const normalizedDomains: DomainData = {
//     web: currentUser?.domains?.web ?? 0,
//     ml: currentUser?.domains?.ml ?? 0,

//     core:
//       (currentUser?.domains as any)?.core ??
//       currentUser?.domains?.cp ??
//       0,

//     systems:
//       (currentUser?.domains as any)?.systems ??
//       currentUser?.domains?.appDev ??
//       0,

//     tools:
//       (currentUser?.domains as any)?.tools ??
//       currentUser?.domains?.cyber ??
//       0,
//   }

//   useEffect(() => {
//     const storedSkills = localStorage.getItem("parsedSkills")

//     if (storedSkills) {
//       setExtractedSkills(JSON.parse(storedSkills))
//     }
//   }, [])

//   const resumeSkillList = extractedSkills
//   ? normalizeSkillList(extractedSkills.map((s: any) => s.skill))
//   : []
//   // State for chart (THIS WAS CORRECT)
//   const [dynamicDomains, setDynamicDomains] =
//     useState<DomainData>(normalizedDomains)


//   // Fetch resumes list from backend
//   useEffect(() => {
//     const fetchResumesList = async () => {
//       try {
//         setLoadingResumes(true)
//         const anonymizedParam = showAnonymizedResumes ? '?anonymized=true' : ''
//         const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/list${anonymizedParam}`)
//         if (response.ok) {
//           const data = await response.json()
//           setResumes(data.resumes || [])
//         }
//       } catch (error) {
//         console.error("Failed to fetch resumes list:", error)
//       } finally {
//         setLoadingResumes(false)
//       }
//     }

//     if (currentUser) {
//       // Clear existing PDFs when switching modes
//       setPdfUrls({})
//       fetchResumesList()
//     }
//   }, [currentUser, showAnonymizedResumes])

//   // Fetch individual PDF files
//   useEffect(() => {
//     const fetchPDFFile = async (resumeId: string, filename: string) => {
//       try {
//         const anonymizedParam = showAnonymizedResumes ? '?anonymized=true' : ''
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/download/${resumeId}${anonymizedParam}`
//         )
//         if (response.ok) {
//           const blob = await response.blob()
//           const url = URL.createObjectURL(blob)
//           setPdfUrls((prev) => ({ ...prev, [resumeId]: url }))
//         }
//       } catch (error) {
//         console.error(`Failed to fetch PDF ${filename}:`, error)
//       }
//     }

//     // Fetch all PDFs once we have the list
//     resumes.forEach((resume) => {
//       if (resume.id && !pdfUrls[resume.id]) {
//         fetchPDFFile(resume.id, resume.filename)
//       }
//     })

//     // Cleanup blob URLs on unmount
//     return () => {
//       Object.values(pdfUrls).forEach((url) => URL.revokeObjectURL(url))
//     }
//   }, [resumes, showAnonymizedResumes])

//   if (!currentUser) return null

//   const myApplications = applications.filter((app) => app.studentId === currentUser.id)

//   const recommendedOpportunities = opportunities
//     .map((opp) => ({
//       ...opp,
//       matchScore: calculateMatchScore(currentUser.skills, opp.skills),
//     }))
//     .sort((a, b) => b.matchScore - a.matchScore)
//     .slice(0, 3)

//   // 🔥 Global skill-gap summary across ALL opportunities
// const skillImportance = calculateSkillImportance(opportunities)

// const allOpportunitySkills = opportunities.flatMap((o) => o.skills)

// // Matched vs missing across entire opportunity pool
// const { missing: globalMissingSkills } = analyzeSkillGap(
//   resumeSkillList,
//   allOpportunitySkills
// )

// // Rank missing skills by importance
// const prioritizedMissingSkills = skillImportance
//   .filter((s) =>
//     globalMissingSkills.some(
//       (m) => m.toLowerCase() === s.skill
//     )
//   )
//   .slice(0, 8) // show top 8 only

//   const allRequiredSkills = new Set(opportunities.flatMap((o) => o.skills))
//   const missingSkills = Array.from(allRequiredSkills)
//     .filter(
//       (skill) =>
//         !currentUser.skills.some(
//           (s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()),
//         ),
//     )
//     .slice(0, 8)

//   // --- REAL API CALL TO BACKEND ---
//   const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setIsUploading(true)
//     const formData = new FormData()
//     formData.append("resume", file)
//     formData.append("userid", currentUser?.id || "")

//     try {

    
//     const response = await fetch("http://localhost:5000/resumeParser/parse-resume", {
//       method: "POST",
//       body: formData,
//     })

//       console.log("Going for: ", `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/upload`)
// //       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/upload`, {
// //         method: "POST",
// //         body: formData,
// //       })


//       if (!response.ok) throw new Error("Connection to backend failed")

//       const data = await response.json()

//       if (data.success) {
//         // 1. Update list of badges
//         setExtractedSkills(data.skills)
//         localStorage.setItem(
//         "parsedSkills",
//         JSON.stringify(data.skills)
//       )
//         // 2. Update Domain Chart (Mapping backend categories to UI bars)
//         const newChart: DomainData = {
//           web: 0,
//           ml: 0,
//           core: 0,
//           systems: 0,
//           tools: 0,
//         }

//         data.skills.forEach((s: any) => {
//           const cat = s.category.toLowerCase()

//           if (cat === "frontend" || cat === "backend")
//             newChart.web += 12

//           if (cat === "ml_ai")
//             newChart.ml += 20

//           if (cat === "programming_languages")
//             newChart.core += 15

//           if (cat === "database" || cat === "devops")
//             newChart.systems += 12

//           if (cat === "tools_and_others")
//             newChart.tools += 10
//         })


//         setDynamicDomains({
//           web: Math.min(newChart.web, 100),
//           ml: Math.min(newChart.ml, 100),
//           core: Math.min(newChart.core, 100),
//           systems: Math.min(newChart.systems, 100),
//           tools: Math.min(newChart.tools, 100),
//         })


//         setShowResumeUpload(false)
//       }
//     } catch (error) {
//       console.error("Upload error:", error)
//       alert("Failed to connect to Parser. Ensure backend is running on port 5000.")
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const handleGenerateTeam = () => {
//     const recommendations = generateTeamRecommendations(currentUser, students)
//     setTeamRecommendations(recommendations)
//   }

//   const handleDownloadResume = (e: React.MouseEvent, pdfUrl: string, filename: string) => {
//     e.stopPropagation() // Prevent opening in new tab
//     const link = document.createElement('a')
//     link.href = pdfUrl
//     link.download = filename
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Welcome!!!</h1>
//         <p className="mt-1 text-muted-foreground">Here's your personalized dashboard</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           title="Applications"
//           value={myApplications.length}
//           description="Active applications"
//           icon={<DocumentTextIcon className="h-6 w-6" />}
//         />
//         <StatCard
//           title="Match Score"
//           value={`${recommendedOpportunities[0]?.matchScore || 0}%`}
//           description="Best opportunity match"
//           icon={<ChartBarIcon className="h-6 w-6" />}
//           trend={{ value: 12, isPositive: true }}
//         />
//         <StatCard
//           title="Skills"
//           value={extractedSkills ? extractedSkills.length : currentUser.skills.length}
//           description={extractedSkills ? "From Resume" : "From Profile"}
//           icon={<LightBulbIcon className="h-6 w-6" />}
//         />
//         <StatCard
//           title="CGPA"
//           value={currentUser.cgpa}
//           description={`${currentUser.year}${currentUser.year === 1 ? "st" : currentUser.year === 2 ? "nd" : currentUser.year === 3 ? "rd" : "th"} Year`}
//           icon={<BriefcaseIcon className="h-6 w-6" />}
//         />
//       </div>

//       {/* EXTRACTED SKILLS SECTION - Shows only after successful parse */}
//       {extractedSkills && (
//         <Card className="glass rounded-2xl p-6 border-t-4 border-primary animate-in fade-in slide-in-from-top-4 duration-500">
//           <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center">
//             <CheckCircleIcon className="h-6 w-6 mr-2 text-primary" />
//             Skills Extracted from Resume
//           </h2>
//           <div className="flex flex-wrap gap-2">
//             {extractedSkills.map((s, i) => (
//               <SkillBadge key={i} skill={s.skill} variant="matched" />
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* Main Grid */}
//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Domain Ranking */}
//         <Card className="glass lg:col-span-2 rounded-2xl p-6">
//           <h2 className="mb-4 text-xl font-semibold text-foreground">Domain Strength Analysis</h2>
//           <div className="h-72">
//             <DomainChart domains={dynamicDomains} />
//           </div>
//         </Card>

//         {/* Quick Actions */}
//         <Card className="glass rounded-2xl p-6">
//           <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
//           <div className="space-y-3">
//             <Button onClick={() => setShowResumeUpload(true)} className="w-full justify-start" variant="outline">
//               <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
//               Upload Resume
//             </Button>
//             <Button onClick={() => setShowAnonymousResume(true)} className="w-full justify-start" variant="outline">
//               <EyeIcon className="mr-2 h-5 w-5" />
//               Preview Anonymous Resume
//             </Button>
//             <Link href="/team-builder">
//               <Button className="w-full justify-start bg-transparent" variant="outline">
//                 <UserGroupIcon className="mr-2 h-5 w-5" />
//                 Find Team Members
//               </Button>
//             </Link>
//             <Button onClick={() => setShowChatbot(true)} className="w-full justify-start" variant="outline">
//               <LightBulbIcon className="mr-2 h-5 w-5" />
//               Ask FAQ Bot
//             </Button>
//           </div>
//         </Card>
//       </div>

//       {/* Recommended Opportunities */}
//       <Card className="glass rounded-2xl p-6">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-xl font-semibold text-foreground">Recommended For You</h2>
//           <Link href="/recommendations">
//             <Button variant="ghost" size="sm">View All</Button>
//           </Link>
//         </div>
//         <div className="grid gap-4 md:grid-cols-3">
//           {recommendedOpportunities.map((opp) => (
//             <div
//               key={opp.id}
//               className="glass rounded-xl border border-border p-4 transition-all hover:shadow-lg cursor-pointer"
//               onClick={() => {
//                 setSelectedOpportunity(opp)
//                 setShowMatchAnalysis(true)
//               }}
//             >
//               <div className="mb-3 flex items-start justify-between">
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-foreground">{opp.title}</h3>
//                   <p className="text-sm text-muted-foreground">{opp.company}</p>
//                 </div>
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                   <span className="text-sm font-bold text-primary">{opp.matchScore}%</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </Card>

//       {/* Missing Skills */}
// <Card className="glass rounded-2xl p-6">
//   <h2 className="mb-2 text-xl font-semibold text-foreground">
//     Skill Gap Analysis
//   </h2>

//   <p className="mb-4 text-sm text-muted-foreground">
//     Based on current opportunities and your resume, focus on improving these high-impact skills:
//   </p>

//   {prioritizedMissingSkills.length > 0 ? (
//     <div className="flex flex-wrap gap-2">
//       {prioritizedMissingSkills.map((s) => (
//         <SkillBadge
//           key={s.skill}
//           skill={s.skill}
//           variant="missing"
//         />
//       ))}
//     </div>
//   ) : (
//     <p className="text-sm text-green-600 font-medium">
//       🎉 Great job! You meet the key skill requirements for current opportunities.
//     </p>
//   )}
// </Card>

//       {/* Resume Section */}
//       <Card className="glass rounded-2xl p-6">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-xl font-semibold text-foreground flex items-center">
//             <DocumentIcon className="h-6 w-6 mr-2" />
//             Resume
//           </h2>
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-muted-foreground">Anonymized</span>
//             <Switch 
//               checked={showAnonymizedResumes} 
//               onCheckedChange={setShowAnonymizedResumes}
//             />
//           </div>
//         </div>
//         <div className="relative">
//           {loadingResumes ? (
//             <div className="flex gap-4 overflow-x-auto pb-4">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="flex-shrink-0 w-48 h-64 rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center animate-pulse"
//                 >
//                   <DocumentIcon className="h-12 w-12 text-muted-foreground" />
//                   <p className="mt-2 text-xs text-muted-foreground">Loading...</p>
//                 </div>
//               ))}
//             </div>
//           ) : resumes.length > 0 ? (
//             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
//               {resumes.map((resume, index) => {
//                 const pdfUrl = pdfUrls[resume.id]
//                 const isLoading = !pdfUrl

//                 return (
//                   <div
//                     key={resume.id || index}
//                     className="flex-shrink-0 w-48 rounded-xl border border-border bg-card hover:shadow-lg transition-all cursor-pointer group"
//                     onClick={() => pdfUrl && window.open(pdfUrl, '_blank')}
//                   >
//                     <div className="h-56 rounded-t-xl bg-muted/30 flex items-center justify-center border-b border-border relative overflow-hidden">
//                       {isLoading ? (
//                         <div className="flex flex-col items-center">
//                           <DocumentIcon className="h-12 w-12 text-muted-foreground animate-pulse" />
//                           <p className="mt-2 text-xs text-muted-foreground">Loading...</p>
//                         </div>
//                       ) : (
//                         <>
//                           <div className="w-full h-full overflow-hidden relative">
//                             <iframe
//                               src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
//                               className="absolute inset-0 pointer-events-none border-0"
//                               style={{ 
//                                 width: 'calc(100% + 20px)',
//                                 height: 'calc(100% + 20px)',
//                                 overflow: 'hidden'
//                               }}
//                               title={`Preview of ${resume.filename}`}
//                             />
//                           </div>
//                           <button
//                             onClick={(e) => handleDownloadResume(e, pdfUrl, resume.filename)}
//                             className="absolute top-2 right-2 p-2 rounded-lg bg-primary/90 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary z-10"
//                             title="Download resume"
//                           >
//                             <ArrowDownTrayIcon className="h-4 w-4" />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                     <div className="p-3">
//                       <p className="text-sm font-medium text-foreground truncate" title={resume.filename || `Resume ${index + 1}`}>
//                         {resume.filename || `Resume ${index + 1}`}
//                       </p>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {resume.uploadDate ? new Date(resume.uploadDate).toLocaleDateString() : 'PDF Document'}
//                       </p>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-12 text-center">
//               <DocumentIcon className="h-16 w-16 text-muted-foreground/50 mb-3" />
//               <p className="text-sm text-muted-foreground">No resumes uploaded yet</p>
//               <Button
//                 onClick={() => setShowResumeUpload(true)}
//                 className="mt-4"
//                 variant="outline"
//                 size="sm"
//               >
//                 Upload Your First Resume
//               </Button>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* --- DIALOGS --- */}

//       {/* Resume Upload Dialog */}
//       <Dialog open={showResumeUpload} onOpenChange={setShowResumeUpload}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Upload Resume</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className={`rounded-xl border-2 border-dashed border-border p-8 text-center ${isUploading ? 'bg-muted animate-pulse' : ''}`}>
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 onChange={handleResumeUpload}
//                 className="hidden"
//                 id="resume-upload"
//                 disabled={isUploading}
//               />
//               <label htmlFor="resume-upload" className="cursor-pointer">
//                 <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-muted-foreground" />
//                 <p className="mt-2 text-sm text-foreground">{isUploading ? "Extracting Skills..." : "Click to upload"}</p>
//               </label>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Match Analysis Dialog */}
//       <Dialog open={showMatchAnalysis} onOpenChange={setShowMatchAnalysis}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader><DialogTitle>Match Analysis</DialogTitle></DialogHeader>
//           {selectedOpportunity && (
//             <div className="space-y-4">
//               <div className="text-center">
//                 <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
//                   <span className="text-3xl font-bold text-primary">{selectedOpportunity.matchScore}%</span>
//                 </div>
//                 <h3 className="mt-4 text-lg font-semibold">{selectedOpportunity.title}</h3>
//                 <p className="text-sm text-muted-foreground">{selectedOpportunity.company}</p>
//               </div>
//               <div>
//                 <h4 className="mb-2 text-sm font-medium">Matched Skills:</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {currentUser.skills.filter(skill => selectedOpportunity.skills.some((req: string) => skill.toLowerCase().includes(req.toLowerCase()))).map(skill => (
//                     <SkillBadge key={skill} skill={skill} variant="matched" />
//                   ))}
//                 </div>
//               </div>
//               <Button className="w-full" asChild>
//                 <Link href={`/opportunities/${selectedOpportunity.id}`}>View Details & Apply</Link>
//               </Button>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Anonymous Resume Dialog */}
//       <Dialog open={showAnonymousResume} onOpenChange={setShowAnonymousResume}>
//         <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader><DialogTitle>Anonymous Resume Preview</DialogTitle></DialogHeader>
//           <div className="space-y-4">
//             <div className="rounded-xl border border-border bg-muted/50 p-4">
//               <h3 className="font-semibold">Student ID: {currentUser.id.slice(0, 8)}</h3>
//               <p className="text-sm text-muted-foreground">{currentUser.department} • CGPA: {currentUser.cgpa}</p>
//             </div>
//             <div>
//               <h4 className="mb-2 font-medium">Skills</h4>
//               <div className="flex flex-wrap gap-2">
//                 {currentUser.skills.map(skill => <SkillBadge key={skill} skill={skill} />)}
//               </div>
//             </div>
//             <div>
//               <h4 className="mb-2 font-medium">Projects</h4>
//               {currentUser.projects.map(p => (
//                 <div key={p.id} className="mb-3 rounded-lg border border-border p-3">
//                   <h5 className="font-medium">{p.title}</h5>
//                   <p className="text-sm text-muted-foreground">{p.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Chatbot Dialog */}
//       <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader><DialogTitle>FAQ Assistant</DialogTitle></DialogHeader>
//           <div className="space-y-3">
//             {[{ q: "What is the eligibility criteria?", a: "Min 7.0 CGPA" }, { q: "How do I apply?", a: "Click Apply on any card." }].map((faq) => (
//               <details key={faq.q} className="group rounded-lg border border-border p-3">
//                 <summary className="cursor-pointer font-medium">{faq.q}</summary>
//                 <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
//               </details>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { StatCard } from "@/components/ui/stat-card"
import { SkillBadge } from "@/components/ui/skill-badge"
import { DomainChart } from "@/components/ui/domain-chart"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  LightBulbIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline"
import { calculateMatchScore, generateTeamRecommendations } from "@/lib/mock-data"
import Link from "next/link"
import { analyzeSkillGap } from "@/lib/skill-gap-analysis/gap"
import { calculateSkillImportance } from "@/lib/skill-gap-analysis/importance"
import { normalizeSkillList } from "@/lib/skill-gap-analysis/normalize"

interface DomainData {
  web: number
  ml: number
  cp: number
  appDev: number
  cyber: number
}

export default function StudentDashboard() {
  const { currentUser, opportunities, applications, students, setTeamRecommendations } = useAppStore()

  // Dialog States
  const [showResumeUpload, setShowResumeUpload] = useState(false)
  const [showMatchAnalysis, setShowMatchAnalysis] = useState(false)
  const [showAnonymousResume, setShowAnonymousResume] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  // Parser & Data States
  const [isUploading, setIsUploading] = useState(false)
  const [extractedSkills, setExtractedSkills] = useState<any[] | null>(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)

  // Resume PDFs State
  const [resumes, setResumes] = useState<any[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [pdfUrls, setPdfUrls] = useState<{ [key: string]: string }>({})
  const [showAnonymizedResumes, setShowAnonymizedResumes] = useState(false)

  // State for the chart - initialized with current user domains
  // Normalize old + new domain keys into ONE consistent shape
  const normalizedDomains: DomainData = {
    web: currentUser?.domains?.web ?? 0,
    ml: currentUser?.domains?.ml ?? 0,

    cp:
      (currentUser?.domains as any)?.core ??
      currentUser?.domains?.cp ??
      0,

    appDev:
      (currentUser?.domains as any)?.systems ??
      currentUser?.domains?.appDev ??
      0,

    cyber:
      (currentUser?.domains as any)?.tools ??
      currentUser?.domains?.cyber ??
      0,
  }

  useEffect(() => {
    const storedSkills = localStorage.getItem("parsedSkills")

    if (storedSkills) {
      setExtractedSkills(JSON.parse(storedSkills))
    }
  }, [])

  const resumeSkillList = extractedSkills
    ? normalizeSkillList(extractedSkills.map((s: any) => s.skill))
    : []
  // State for chart (THIS WAS CORRECT)
  const [dynamicDomains, setDynamicDomains] =
    useState<DomainData>(normalizedDomains)


  // Fetch resumes list from backend
  useEffect(() => {
    const fetchResumesList = async () => {
      try {
        setLoadingResumes(true)
        const anonymizedParam = showAnonymizedResumes ? '?anonymized=true' : ''
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/list${anonymizedParam}`, {
          credentials: "include"
        })
        if (response.ok) {
          const data = await response.json()
          setResumes(data.documents || [])
        }
      } catch (error) {
        console.error("Failed to fetch resumes list:", error)
      } finally {
        setLoadingResumes(false)
      }
    }

    if (currentUser) {
      // Clear existing PDFs when switching modes
      setPdfUrls({})
      fetchResumesList()
    }
  }, [currentUser, showAnonymizedResumes])

  // Fetch individual PDF files
  useEffect(() => {
    const fetchPDFFile = async (resumeId: string, filename: string) => {
      try {
        const anonymizedParam = showAnonymizedResumes ? '?anonymized=true' : ''
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/download/${resumeId}${anonymizedParam}`,
          { credentials: "include" }
        )
        if (response.ok) {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          setPdfUrls((prev) => ({ ...prev, [resumeId]: url }))
        }
      } catch (error) {
        console.error(`Failed to fetch PDF ${filename}:`, error)
      }
    }

    // Fetch all PDFs once we have the list
    resumes.forEach((resume) => {
      if (resume.id && !pdfUrls[resume.id]) {
        fetchPDFFile(resume.id, resume.name)
      }
    })

    // Cleanup blob URLs on unmount
    return () => {
      Object.values(pdfUrls).forEach((url) => URL.revokeObjectURL(url))
    }
  }, [resumes, showAnonymizedResumes])

  if (!currentUser) return null

  const myApplications = applications.filter((app) => app.studentId === currentUser.id)

  const recommendedOpportunities = opportunities
    .map((opp) => ({
      ...opp,
      matchScore: calculateMatchScore(currentUser.skills, opp.skills),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)

  // 🔥 Global skill-gap summary across ALL opportunities
    const skillImportance = calculateSkillImportance(opportunities)

    const allOpportunitySkills = opportunities.flatMap((o) => o.skills)

    // Matched vs missing across entire opportunity pool
    const { missing: globalMissingSkills } = analyzeSkillGap(
      resumeSkillList,
      allOpportunitySkills
    )

    // Rank missing skills by importance
    const prioritizedMissingSkills = skillImportance
      .filter((s) =>
        globalMissingSkills.some(
          (m) => m.toLowerCase() === s.skill
        )
      )
      .slice(0, 8) // show top 8 only

  const allRequiredSkills = new Set(opportunities.flatMap((o) => o.skills))
  const missingSkills = Array.from(allRequiredSkills)
    .filter(
      (skill) =>
        !currentUser.skills.some(
          (s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()),
        ),
    )
    .slice(0, 8)

  // --- REAL API CALL TO BACKEND ---
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("resume", file)
    formData.append("userid", currentUser?.id || "")

    try {


      const response = await fetch("http://localhost:5000/resumeParser/parse-resume", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      console.log("Going for: ", `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/upload`)
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })


      if (!response.ok) throw new Error("Connection to backend failed")

      const data = await response.json()

      if (data.success) {
        // 1. Update list of badges
        setExtractedSkills(data.skills)
        localStorage.setItem(
          "parsedSkills",
          JSON.stringify(data.skills)
        )
        // 2. Update Domain Chart (Mapping backend categories to UI bars)
        const newChart: DomainData = {
          web: 0,
          ml: 0,
          cp: 0,
          appDev: 0,
          cyber: 0,
        }

        data.skills.forEach((s: any) => {
          const cat = s.category.toLowerCase()

          if (cat === "frontend" || cat === "backend")
            newChart.web += 12

          if (cat === "ml_ai")
            newChart.ml += 20

          if (cat === "programming_languages")
            newChart.cp += 15

          if (cat === "database" || cat === "devops")
            newChart.appDev += 12

          if (cat === "tools_and_others")
            newChart.cyber += 10
        })


        setDynamicDomains({
          web: Math.min(newChart.web, 100),
          ml: Math.min(newChart.ml, 100),
          cp: Math.min(newChart.cp, 100),
          appDev: Math.min(newChart.appDev, 100),
          cyber: Math.min(newChart.cyber, 100),
        })


        setShowResumeUpload(false)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to connect to Parser. Ensure backend is running on port 5000.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleGenerateTeam = () => {
    const recommendations = generateTeamRecommendations(currentUser, students)
    setTeamRecommendations(recommendations)
  }

  const handleDownloadResume = (e: React.MouseEvent, pdfUrl: string, filename: string) => {
    e.stopPropagation() // Prevent opening in new tab
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome!!!</h1>
        <p className="mt-1 text-muted-foreground">Here's your personalized dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Applications"
          value={myApplications.length}
          description="Active applications"
          icon={<DocumentTextIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Match Score"
          value={`${recommendedOpportunities[0]?.matchScore || 0}%`}
          description="Best opportunity match"
          icon={<ChartBarIcon className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Skills"
          value={extractedSkills ? extractedSkills.length : currentUser.skills.length}
          description={extractedSkills ? "From Resume" : "From Profile"}
          icon={<LightBulbIcon className="h-6 w-6" />}
        />
        <StatCard
          title="CGPA"
          value={currentUser.cgpa}
          description={`${currentUser.year}${currentUser.year === 1 ? "st" : currentUser.year === 2 ? "nd" : currentUser.year === 3 ? "rd" : "th"} Year`}
          icon={<BriefcaseIcon className="h-6 w-6" />}
        />
      </div>

      {/* EXTRACTED SKILLS SECTION - Shows only after successful parse */}
      {extractedSkills && (
        <Card className="glass rounded-2xl p-6 border-t-4 border-primary animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center">
            <CheckCircleIcon className="h-6 w-6 mr-2 text-primary" />
            Skills Extracted from Resume
          </h2>
          <div className="flex flex-wrap gap-2">
            {extractedSkills.map((s, i) => (
              <SkillBadge key={i} skill={s.skill} variant="matched" />
            ))}
          </div>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Domain Ranking */}
        <Card className="glass lg:col-span-2 rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Domain Strength Analysis</h2>
          <div className="h-72">
            <DomainChart domains={dynamicDomains} />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="space-y-3">
            <Button onClick={() => setShowResumeUpload(true)} className="w-full justify-start" variant="outline">
              <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
              Upload Resume
            </Button>
            <Button onClick={() => setShowAnonymousResume(true)} className="w-full justify-start" variant="outline">
              <EyeIcon className="mr-2 h-5 w-5" />
              Preview Anonymous Resume
            </Button>
            <Link href="/team-builder" className="block">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <UserGroupIcon className="mr-2 h-5 w-5" />
                Find Team Members
              </Button>
            </Link>
            <Button onClick={() => setShowChatbot(true)} className="w-full justify-start" variant="outline">
              <LightBulbIcon className="mr-2 h-5 w-5" />
              Ask FAQ Bot
            </Button>
          </div>
        </Card>
      </div>

      {/* Recommended Opportunities */}
      {/* <Card className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recommended For You</h2>
          <Link href="/recommendations">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {recommendedOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="glass rounded-xl border border-border p-4 transition-all hover:shadow-lg cursor-pointer"
              onClick={() => {
                setSelectedOpportunity(opp)
                setShowMatchAnalysis(true)
              }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{opp.title}</h3>
                  <p className="text-sm text-muted-foreground">{opp.company}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">{opp.matchScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card> */}

      {/* Missing Skills */}
      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Skill Gap Analysis
        </h2>

        <p className="mb-4 text-sm text-muted-foreground">
          Based on current opportunities and your resume, focus on improving these high-impact skills:
        </p>

        {prioritizedMissingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {prioritizedMissingSkills.map((s) => (
              <SkillBadge
                key={s.skill}
                skill={s.skill}
                variant="missing"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-green-600 font-medium">
            🎉 Great job! You meet the key skill requirements for current opportunities.
          </p>
        )}
      </Card>

      {/* Resume Section */}
      <Card className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <DocumentIcon className="h-6 w-6 mr-2" />
            Resume
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Anonymized</span>
            <Switch
              checked={showAnonymizedResumes}
              onCheckedChange={setShowAnonymizedResumes}
            />
          </div>
        </div>
        <div className="relative">
          {loadingResumes ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-48 h-64 rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center animate-pulse"
                >
                  <DocumentIcon className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-xs text-muted-foreground">Loading...</p>
                </div>
              ))}
            </div>
          ) : resumes.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {resumes.map((resume, index) => {
                const pdfUrl = pdfUrls[resume.id]
                const isLoading = !pdfUrl

                return (
                  <div
                    key={resume.id || index}
                    className="flex-shrink-0 w-48 rounded-xl border border-border bg-card hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => pdfUrl && window.open(pdfUrl, '_blank')}
                  >
                    <div className="h-56 rounded-t-xl bg-muted/30 flex items-center justify-center border-b border-border relative overflow-hidden">
                      {isLoading ? (
                        <div className="flex flex-col items-center">
                          <DocumentIcon className="h-12 w-12 text-muted-foreground animate-pulse" />
                          <p className="mt-2 text-xs text-muted-foreground">Loading...</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-full h-full overflow-hidden relative">
                            <iframe
                              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                              className="absolute inset-0 pointer-events-none border-0"
                              style={{
                                width: 'calc(100% + 20px)',
                                height: 'calc(100% + 20px)',
                                overflow: 'hidden'
                              }}
                              title={`Preview of ${resume.name}`}
                            />
                          </div>
                          <button
                            onClick={(e) => handleDownloadResume(e, pdfUrl, resume.name)}
                            className="absolute top-2 right-2 p-2 rounded-lg bg-primary/90 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary z-10"
                            title="Download resume"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-foreground truncate" title={resume.name || `Resume ${index + 1}`}>
                        {resume.name || `Resume ${index + 1}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {resume.created_at ? new Date(resume.created_at).toLocaleDateString() : 'PDF Document'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DocumentIcon className="h-16 w-16 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No resumes uploaded yet</p>
              <Button
                onClick={() => setShowResumeUpload(true)}
                className="mt-4"
                variant="outline"
                size="sm"
              >
                Upload Your First Resume
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* --- DIALOGS --- */}

      {/* Resume Upload Dialog */}
      <Dialog open={showResumeUpload} onOpenChange={setShowResumeUpload}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className={`rounded-xl border-2 border-dashed border-border p-8 text-center ${isUploading ? 'bg-muted animate-pulse' : ''}`}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
                disabled={isUploading}
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-foreground">{isUploading ? "Extracting Skills..." : "Click to upload"}</p>
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Match Analysis Dialog */}
      <Dialog open={showMatchAnalysis} onOpenChange={setShowMatchAnalysis}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Match Analysis</DialogTitle></DialogHeader>
          {selectedOpportunity && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-3xl font-bold text-primary">{selectedOpportunity.matchScore}%</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{selectedOpportunity.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedOpportunity.company}</p>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium">Matched Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.filter(skill => selectedOpportunity.skills.some((req: string) => skill.toLowerCase().includes(req.toLowerCase()))).map(skill => (
                    <SkillBadge key={skill} skill={skill} variant="matched" />
                  ))}
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/opportunities/${selectedOpportunity.id}`}>View Details & Apply</Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Anonymous Resume Dialog */}
      <Dialog open={showAnonymousResume} onOpenChange={setShowAnonymousResume}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Anonymous Resume Preview</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <h3 className="font-semibold">Student ID: {currentUser.id.slice(0, 8)}</h3>
              <p className="text-sm text-muted-foreground">{currentUser.department} • CGPA: {currentUser.cgpa}</p>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map(skill => <SkillBadge key={skill} skill={skill} />)}
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Projects</h4>
              {currentUser.projects.map(p => (
                <div key={p.id} className="mb-3 rounded-lg border border-border p-3">
                  <h5 className="font-medium">{p.title}</h5>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chatbot Dialog */}
      <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>FAQ Assistant</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {[{ q: "What is the eligibility criteria?", a: "Min 7.0 CGPA" }, { q: "How do I apply?", a: "Click Apply on any card." }].map((faq) => (
              <details key={faq.q} className="group rounded-lg border border-border p-3">
                <summary className="cursor-pointer font-medium">{faq.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}