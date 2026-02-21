// "use client"

// import { useAppStore } from "@/lib/store"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { SkillBadge } from "@/components/ui/skill-badge"
// import { calculateMatchScore } from "@/lib/mock-data"
// import Link from "next/link"
// import { SparklesIcon } from "@heroicons/react/24/outline"

// export default function RecommendationsPage() {
//   const { currentUser, opportunities } = useAppStore()

//   if (!currentUser) return null

//   const recommendedOpportunities = opportunities
//     .map((opp) => ({
//       ...opp,
//       matchScore: calculateMatchScore(currentUser.skills, opp.skills),
//       matchedSkills: currentUser.skills.filter((skill) =>
//         opp.skills.some(
//           (req) => skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase()),
//         ),
//       ),
//       missingSkills: opp.skills.filter(
//         (skill) =>
//           !currentUser.skills.some(
//             (s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()),
//           ),
//       ),
//     }))
//     .sort((a, b) => b.matchScore - a.matchScore)

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Personalized Recommendations</h1>
//         <p className="mt-1 text-muted-foreground">Opportunities ranked by your skill match score</p>
//       </div>

//       <div className="space-y-4">
//         {recommendedOpportunities.map((opp, index) => (
//           <Card key={opp.id} className="glass rounded-2xl p-6 transition-all hover:shadow-xl">
//             <div className="flex items-start gap-6">
//               {/* Match Score Badge */}
//               <div className="flex-shrink-0">
//                 <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-primary">{opp.matchScore}%</div>
//                     <div className="text-xs text-muted-foreground">Match</div>
//                   </div>
//                 </div>
//                 {index === 0 && (
//                   <div className="mt-2 flex items-center justify-center gap-1 text-xs text-primary">
//                     <SparklesIcon className="h-3 w-3" />
//                     <span>Best Match</span>
//                   </div>
//                 )}
//               </div>

//               {/* Opportunity Details */}
//               <div className="flex-1 min-w-0">
//                 <div className="mb-3">
//                   <div className="flex items-start justify-between gap-4 mb-2">
//                     <div>
//                       <h3 className="text-xl font-semibold text-foreground">{opp.title}</h3>
//                       <p className="text-muted-foreground">{opp.company}</p>
//                     </div>
//                     <span
//                       className={`rounded-full px-3 py-1 text-xs font-medium ${
//                         opp.type === "internship"
//                           ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
//                           : opp.type === "project"
//                             ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
//                             : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
//                       }`}
//                     >
//                       {opp.type}
//                     </span>
//                   </div>

//                   <p className="text-sm text-muted-foreground line-clamp-2">{opp.description}</p>
//                 </div>

//                 <div className="grid gap-4 md:grid-cols-2 mb-4">
//                   <div>
//                     <h4 className="mb-2 text-sm font-medium text-green-600 dark:text-green-400">
//                       ✓ Your Matching Skills ({opp.matchedSkills.length})
//                     </h4>
//                     <div className="flex flex-wrap gap-1">
//                       {opp.matchedSkills.map((skill: string) => (
//                         <SkillBadge key={skill} skill={skill} variant="matched" />
//                       ))}
//                     </div>
//                   </div>

//                   {opp.missingSkills.length > 0 && (
//                     <div>
//                       <h4 className="mb-2 text-sm font-medium text-orange-600 dark:text-orange-400">
//                         ⚠ Skills to Learn ({opp.missingSkills.length})
//                       </h4>
//                       <div className="flex flex-wrap gap-1">
//                         {opp.missingSkills.map((skill: string) => (
//                           <SkillBadge key={skill} skill={skill} variant="missing" />
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Button asChild>
//                     <Link href={`/opportunities/${opp.id}`}>View Details & Apply</Link>
//                   </Button>
//                   {opp.stipend && <span className="text-sm text-muted-foreground">💰 {opp.stipend}</span>}
//                   {opp.duration && <span className="text-sm text-muted-foreground">⏱️ {opp.duration}</span>}
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SkillBadge } from "@/components/ui/skill-badge"
import { calculateMatchScore } from "@/lib/mock-data"
import { getDaysUntil } from "@/lib/utils" // Imported utility from Detail Page logic
import Link from "next/link"
import { SparklesIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

export default function RecommendationsPage() {
  const { currentUser, opportunities, applications } = useAppStore()

  if (!currentUser) return null

  const recommendedOpportunities = opportunities
    .map((opp) => {
      const matchScore = calculateMatchScore(currentUser.skills, opp.skills)
      const hasApplied = applications.some(
        (app) => app.opportunityId === opp.id && app.studentId === currentUser.id,
      )
      
      return {
        ...opp,
        matchScore,
        hasApplied,
        matchedSkills: currentUser.skills.filter((skill) =>
          opp.skills.some(
            (req) => skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase()),
          ),
        ),
        missingSkills: opp.skills.filter(
          (skill) =>
            !currentUser.skills.some(
              (s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()),
            ),
        ),
      }
    })
    // Filter: Only include matches strictly above 75%
    .filter((opp) => opp.matchScore > 75)
    .sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Personalized Recommendations</h1>
        <p className="mt-1 text-muted-foreground">Top matches based on your profile (75%+ match score)</p>
      </div>

      <div className="space-y-4">
        {recommendedOpportunities.length > 0 ? (
          recommendedOpportunities.map((opp, index) => (
            <Card key={opp.id} className="glass rounded-2xl p-4 transition-all hover:shadow-xl sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                {/* Match Score Badge */}
                <div className="shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{opp.matchScore}%</div>
                      <div className="text-xs text-muted-foreground">Match</div>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-primary font-medium">
                      <SparklesIcon className="h-3 w-3" />
                      <span>Best Match</span>
                    </div>
                  )}
                </div>

                {/* Opportunity Details */}
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{opp.title}</h3>
                        <p className="text-muted-foreground">{opp.company}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
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

                    <p className="text-sm text-muted-foreground line-clamp-2">{opp.description}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-green-600 dark:text-green-400">
                        ✓ Your Matching Skills ({opp.matchedSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {opp.matchedSkills.map((skill: string) => (
                          <SkillBadge key={skill} skill={skill} variant="matched" />
                        ))}
                      </div>
                    </div>

                    {opp.missingSkills.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                          ⚠ Skills to Learn ({opp.missingSkills.length})
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {opp.missingSkills.map((skill: string) => (
                            <SkillBadge key={skill} skill={skill} variant="missing" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {opp.hasApplied ? (
                        <Button variant="outline" disabled className="gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          Applied
                        </Button>
                      ) : (
                        <Button asChild>
                          <Link href={`/opportunities/${opp.id}`}>View Details & Apply</Link>
                        </Button>
                      )}
                      {opp.stipend && <span className="text-sm text-muted-foreground">💰 {opp.stipend}</span>}
                      {opp.duration && <span className="text-sm text-muted-foreground">⏱️ {opp.duration}</span>}
                    </div>
                    
                    {/* Urgency indicator from Detail Page logic */}
                    {getDaysUntil(opp.deadline) <= 3 && (
                      <span className="text-xs font-medium text-red-600 animate-pulse">
                        Closing Soon!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <p className="text-muted-foreground">No recommendations above 75% found for your current skills.</p>
            <Button variant="link" asChild className="mt-2">
              <Link href="/opportunities">Browse all opportunities</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}