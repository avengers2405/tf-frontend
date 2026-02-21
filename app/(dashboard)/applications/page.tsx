// "use client"

// import { useAppStore } from "@/lib/store"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { formatDate } from "@/lib/utils"
// import { ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"

// export default function ApplicationsPage() {
//   const { currentUser, applications, opportunities } = useAppStore()

//   if (!currentUser) return null

//   const myApplications = applications
//     .filter((app) => app.studentId === currentUser.id)
//     .map((app) => ({
//       ...app,
//       opportunity: opportunities.find((o) => o.id === app.opportunityId),
//     }))

//   const getStageColor = (stage: string) => {
//     switch (stage) {
//       case "selected":
//         return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
//       case "rejected":
//         return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
//       default:
//         return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
//     }
//   }

//   const getStageIcon = (stage: string) => {
//     switch (stage) {
//       case "selected":
//         return <CheckCircleIcon className="h-5 w-5 text-green-600" />
//       case "rejected":
//         return <XCircleIcon className="h-5 w-5 text-red-600" />
//       default:
//         return <ClockIcon className="h-5 w-5 text-blue-600" />
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
//         <p className="mt-1 text-muted-foreground">
//           {myApplications.length} application{myApplications.length !== 1 ? "s" : ""} submitted
//         </p>
//       </div>

//       {myApplications.length > 0 ? (
//         <div className="space-y-4">
//           {myApplications.map((app) => (
//             <Card key={app.id} className="glass rounded-2xl p-6">
//               <div className="flex items-start gap-4">
//                 <div className="flex-shrink-0 mt-1">{getStageIcon(app.stage)}</div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-start justify-between gap-4 mb-2">
//                     <div>
//                       <h3 className="text-lg font-semibold text-foreground">
//                         {app.opportunity?.title || "Unknown Position"}
//                       </h3>
//                       <p className="text-sm text-muted-foreground">{app.opportunity?.company}</p>
//                     </div>
//                     <Badge className={getStageColor(app.stage)}>{app.stage}</Badge>
//                   </div>

//                   <div className="grid gap-3 md:grid-cols-3 mb-4 text-sm">
//                     <div>
//                       <span className="text-muted-foreground">Match Score:</span>
//                       <span className="ml-2 font-medium text-primary">{app.matchScore}%</span>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Applied:</span>
//                       <span className="ml-2 font-medium text-foreground">{formatDate(app.appliedDate)}</span>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Last Updated:</span>
//                       <span className="ml-2 font-medium text-foreground">{formatDate(app.lastUpdated)}</span>
//                     </div>
//                   </div>

//                   <Button size="sm" variant="outline" asChild>
//                     <Link href={`/opportunities/${app.opportunityId}`}>View Opportunity</Link>
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <Card className="glass rounded-2xl p-12 text-center">
//           <ClockIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//           <h2 className="text-xl font-semibold text-foreground mb-2">No Applications Yet</h2>
//           <p className="text-muted-foreground mb-6">Start applying to opportunities that match your skills</p>
//           <Button asChild>
//             <Link href="/opportunities">Browse Opportunities</Link>
//           </Button>
//         </Card>
//       )}
//     </div>
//   )
// }

"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"

export default function ApplicationsPage() {
  const { currentUser, applications, opportunities } = useAppStore()

  if (!currentUser) return null

  // UPDATED: Filter for the user, map the opportunity, then filter by internship type
  const myApplications = applications
    .filter((app) => app.studentId === currentUser.id)
    .map((app) => ({
      ...app,
      opportunity: opportunities.find((o) => o.id === app.opportunityId),
    }))
    .filter((app) => {
      // Safely check the opportunity type (adjust "internship" if your data uses a different string)
      const opportunityType = app.opportunity?.type?.toLowerCase() || ""
      return opportunityType === "internship" || opportunityType === "intern"
    })

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "selected":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "selected":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-600" />
      default:
        return <ClockIcon className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Internship Applications</h1>
        <p className="mt-1 text-muted-foreground">
          {myApplications.length} internship application{myApplications.length !== 1 ? "s" : ""} submitted
        </p>
      </div>

      {myApplications.length > 0 ? (
        <div className="space-y-4">
          {myApplications.map((app) => (
            <Card key={app.id} className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getStageIcon(app.stage)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {app.opportunity?.title || "Unknown Position"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{app.opportunity?.company}</p>
                    </div>
                    <Badge className={getStageColor(app.stage)}>{app.stage}</Badge>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Match Score:</span>
                      <span className="ml-2 font-medium text-primary">{app.matchScore}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Applied:</span>
                      <span className="ml-2 font-medium text-foreground">{formatDate(app.appliedDate)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="ml-2 font-medium text-foreground">{formatDate(app.lastUpdated)}</span>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/opportunities/${app.opportunityId}`}>View Opportunity</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass rounded-2xl p-12 text-center">
          <ClockIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Internship Applications Yet</h2>
          <p className="text-muted-foreground mb-6">Start applying to internships that match your skills</p>
          <Button asChild>
            <Link href="/opportunities">Browse Opportunities</Link>
          </Button>
        </Card>
      )}
    </div>
  )
}