"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DomainChart } from "@/components/ui/domain-chart"
import { SkillBadge } from "@/components/ui/skill-badge"
import { 
  UserGroupIcon, 
  SparklesIcon, 
  PlusIcon, 
  XMarkIcon, 
  CheckCircleIcon 
} from "@heroicons/react/24/outline"
import { generateTeamRecommendations } from "@/lib/mock-data"
import { toast } from "sonner"

export default function TeamBuilderPage() {
  const { currentUser, students, teamRecommendations, setTeamRecommendations } = useAppStore()
  
  // Local state for Team Creation
  const [myTeams, setMyTeams] = useState<any[]>([]) 
  const [isCreating, setIsCreating] = useState(false)
  const [draftTeamName, setDraftTeamName] = useState("")
  const [draftMembers, setDraftMembers] = useState<any[]>([])

  // State for the Team Details Popup
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  useEffect(() => {
    if (currentUser && teamRecommendations.length === 0) {
      const recommendations = generateTeamRecommendations(currentUser, students)
      setTeamRecommendations(recommendations)
    }
  }, [currentUser, students, teamRecommendations, setTeamRecommendations])

  // --- Handlers ---

  const startCreation = () => {
    if (!currentUser) return
    setIsCreating(true)
    setDraftMembers([currentUser]) 
    setDraftTeamName("")
  }

  const toggleMemberSelection = (student: any) => {
    const isSelected = draftMembers.find(m => m.id === student.id)

    if (isSelected) {
      if (student.id === currentUser?.id) {
        toast.error("You cannot remove yourself from the team.")
        return
      }
      setDraftMembers(prev => prev.filter(m => m.id !== student.id))
    } else {
      if (draftMembers.length >= 6) {
        toast.error("Maximum team size is 6 members.")
        return
      }
      setDraftMembers(prev => [...prev, student])
    }
  }

  const saveTeam = () => {
    if (!draftTeamName.trim()) {
      toast.error("Please give your team a name.")
      return
    }
    if (draftMembers.length < 2) {
      toast.error("A team needs at least 2 members.")
      return
    }

    // Creating a unique ID allows multiple teams with the exact same members
    const newTeam = {
      id: crypto.randomUUID(),
      name: draftTeamName,
      members: draftMembers,
      createdAt: new Date()
    }

    setMyTeams(prev => [...prev, newTeam])
    setIsCreating(false)
    setDraftMembers([])
    toast.success(`Team "${draftTeamName}" created successfully!`)
  }

  const cancelCreation = () => {
    setIsCreating(false)
    setDraftMembers([])
  }

  const handleRegenerateRecommendations = () => {
    if(!currentUser) return
    const recommendations = generateTeamRecommendations(currentUser, students)
    setTeamRecommendations(recommendations)
  }

  if (!currentUser) return null

  return (
    <div className="space-y-8 pb-12 relative">
      {/* --- Header --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Builder</h1>
          <p className="mt-1 text-muted-foreground">Build complementary teams for your projects</p>
        </div>
        <div className="flex gap-2">
          {!isCreating && (
            <Button onClick={startCreation} className="bg-primary text-primary-foreground">
              <PlusIcon className="mr-2 h-5 w-5" />
              Create New Team
            </Button>
          )}
          <Button variant="outline" onClick={handleRegenerateRecommendations}>
            <SparklesIcon className="mr-2 h-5 w-5" />
            Regenerate Recs
          </Button>
        </div>
      </div>

      {/* --- My Teams List --- */}
      {myTeams.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center">
            <UserGroupIcon className="mr-2 h-5 w-5" />
            My Teams ({myTeams.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myTeams.map((team) => (
              <Card 
                key={team.id} 
                // Added onClick to open modal and hover effects
                onClick={() => setSelectedTeam(team)}
                className="glass rounded-2xl p-5 border-l-4 border-l-primary shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-4 border-b pb-3">
                  <div>
                    <h3 className="font-bold text-lg">{team.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Created {team.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                    {team.members.length} Members
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {team.members.map((member: any) => (
                    <div key={member.id} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {member.name}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* --- Active Creation Staging Area --- */}
      {isCreating && (
        <Card className="border-primary/50 bg-primary/5 rounded-2xl p-6 sticky top-4 z-10 backdrop-blur-md shadow-lg">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-end md:items-center">
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">Team Name</label>
              <Input 
                placeholder="Ex: Hackathon Alpha" 
                value={draftTeamName}
                onChange={(e) => setDraftTeamName(e.target.value)}
                className="bg-background/80"
              />
            </div>
            
            <div className="flex-1 flex flex-col items-center">
              <span className="text-sm font-medium mb-2">
                Selected Members ({draftMembers.length}/6)
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {draftMembers.map(m => (
                  <div key={m.id} className="flex items-center gap-1 bg-background rounded-full pl-1 pr-3 py-1 text-xs border shadow-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center font-bold text-[10px]">
                      {m.name.charAt(0)}
                    </div>
                    {m.name}
                    {m.id !== currentUser.id && (
                      <button onClick={() => toggleMemberSelection(m)} className="ml-1 text-muted-foreground hover:text-red-500">
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={cancelCreation}>Cancel</Button>
              <Button onClick={saveTeam}>Save Team</Button>
            </div>
          </div>
        </Card>
      )}

      {/* --- Recommendations Grid --- */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          {isCreating ? "Select Teammates" : "Recommended Teammates"}
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {teamRecommendations.map((member) => {
            const student = students.find((s) => s.id === member.id)
            if (!student) return null

            const isSelected = draftMembers.some(m => m.id === member.id)

            return (
              <Card 
                key={member.id} 
                className={`glass rounded-2xl p-6 transition-all duration-200 ${
                  isSelected ? "ring-2 ring-primary border-primary bg-primary/5" : ""
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      {member.name}
                      {isSelected && <CheckCircleIcon className="w-5 h-5 text-primary" />}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {student.department} • Year {student.year}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-bold text-primary">{member.matchScore}%</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-foreground">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 6).map((skill) => {
                      const isComplementary = !currentUser.skills.includes(skill)
                      return <SkillBadge key={skill} skill={skill} variant={isComplementary ? "matched" : "default"} />
                    })}
                  </div>
                </div>

                <div className="mb-4 h-32">
                  <h4 className="mb-2 text-sm font-medium text-foreground">Domain Strength</h4>
                  <DomainChart domains={member.domains} />
                </div>

                <div className="flex gap-2">
                  {isCreating ? (
                    <Button 
                      size="sm" 
                      className="flex-1" 
                      variant={isSelected ? "secondary" : "default"}
                      onClick={() => toggleMemberSelection(member)}
                    >
                      {isSelected ? (
                        <>
                          <XMarkIcon className="mr-2 h-4 w-4" /> Remove
                        </>
                      ) : (
                        <>
                          <PlusIcon className="mr-2 h-4 w-4" /> Add to Team
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button size="sm" className="flex-1" onClick={startCreation}>
                      <UserGroupIcon className="mr-2 h-4 w-4" />
                      Start Team with {member.name.split(' ')[0]}
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* --- Team Details Modal / Popup --- */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-background shadow-2xl rounded-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-primary/5 p-6 border-b flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedTeam.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Created on {selectedTeam.createdAt.toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedTeam(null)}
                className="p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Content - Full Member List */}
            <div className="p-6">
              <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                Team Members ({selectedTeam.members.length})
              </h4>
              <div className="space-y-3">
                {selectedTeam.members.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      {/* You can add department or role here if available in member object */}
                      <p className="text-xs text-muted-foreground">Member</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t flex justify-end">
                <Button variant="outline" onClick={() => setSelectedTeam(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}