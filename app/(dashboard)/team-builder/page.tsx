"use client"

import { useEffect, useState, useMemo } from "react"
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
  CheckCircleIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"
import MiniSearch from 'minisearch'

// Helper function to transform domains array to object format
const transformDomains = (domainsArray: any[]) => {
  const domainsObj = {
    web: 0,
    ml: 0,
    cp: 0,
    appDev: 0,
    cyber: 0
  };
  
  domainsArray?.forEach(domain => {
    const name = domain.name.toLowerCase();
    if (name.includes('web')) domainsObj.web = domain.value;
    else if (name.includes('machine learning') || name.includes('ai')) domainsObj.ml = domain.value;
    else if (name.includes('competitive')) domainsObj.cp = domain.value;
    else if (name.includes('app')) domainsObj.appDev = domain.value;
    else if (name.includes('cyber')) domainsObj.cyber = domain.value;
  });
  
  return domainsObj;
};

export default function TeamBuilderPage() {
  const { user: currentUser, loading: userLoading } = useUser()
  
  // Local state for Team Creation
  const [myTeams, setMyTeams] = useState<any[]>([]) 
  const [isCreating, setIsCreating] = useState(false)
  const [draftTeamName, setDraftTeamName] = useState("")
  const [draftMembers, setDraftMembers] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // State for the Search and Team Details Popup
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/students", {
          credentials: "include"
        });
        const data = await response.json();
        console.log("Fetched students:", data);
        if (response.ok) {
          // Transform the data to include the domains in the expected format
          const transformedStudents = data.map((student: any) => ({
            ...student,
            domains: transformDomains(student.domains),
            skills: student.skills || [],
            matchScore: Math.floor(Math.random() * 40) + 60 // Generate mock match score
          }));
          setStudents(transformedStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students from database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchMyTeams = async () => {
      // Wait until the user context provides the ID
      if (!currentUser?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/team-builder/get-my-teams/${currentUser.id}`, {
          credentials: "include"
        });
        
        if (response.ok) {
          const data = await response.json();
          // data is already the formatted array from your controller
          setMyTeams(data);
        } else {
          const errorData = await response.json();
          console.error("Team fetch failed:", errorData.error);
        }
      } catch (error) {
        console.error("Network error fetching teams:", error);
        toast.error("Connection lost. Could not sync teams.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTeams();
  }, [currentUser?.id]);

  // --- MiniSearch Logic ---
  const filteredCandidates = useMemo(() => {
    // Exclude current user and ensure they have a name
    const validStudents = students.filter(s => s.name && s.id !== currentUser?.id);

    // If no search, return everyone (minus the current user)
    if (!searchQuery.trim()) {
      return validStudents;
    }

    const miniSearch = new MiniSearch({
      fields: ['name', 'skills', 'department'], 
      storeFields: ['id'], // We only need the ID to map back to the full student objects
      searchOptions: {
        boost: { name: 2, skills: 1.5, department: 1 }, 
        prefix: true, 
        fuzzy: 0.2  
      }
    });

    miniSearch.addAll(validStudents);

    // Perform Search
    let results = miniSearch.search(searchQuery, { combineWith: 'AND' });

    // Fallback to OR if no exact matches
    if (results.length === 0) {
       results = miniSearch.search(searchQuery, { combineWith: 'OR' });
    }

    // Map results back to full student objects
    return results.map((result: any) => {
      return validStudents.find(s => s.id === result.id);
    }).filter(Boolean); // Filter out undefined just in case

  }, [searchQuery, students, currentUser]);

  // --- Handlers ---

  const startCreation = () => {
    if (!currentUser) return
      
    const formattedUser = {
      ...currentUser,
      name: currentUser.name || currentUser.full_name || currentUser.username
    }

    setIsCreating(true)
    setDraftMembers([formattedUser]) 
    setDraftTeamName("")
    setSearchQuery("") // Reset search on new creation
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

  const saveTeam = async () => {
    if (!draftTeamName.trim()) {
      toast.error("Please give your team a name.");
      return;
    }
    if (draftMembers.length < 2) {
      toast.error("A team needs at least 2 members.");
      return;
    }
    if (!currentUser) {
      toast.error("User not authenticated.");
      return;
    }

  try {
    const response = await fetch('http://localhost:5000/api/team-builder/create-team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify({
        group_name: draftTeamName,
        // Send IDs of selected teammates (already registration_numbers from /students fetch)
        student_ids: draftMembers
          .filter(m => m.id !== currentUser.id) // Filter out the currentUser's user_id
          .map(m => m.registration_number),
        // Send the creator's user_id for backend lookup
        creator_user_id: currentUser.id 
      })
    });

      const data = await response.json();

      if (response.ok) {
        const newTeam = {
          id: data.group_id, 
          name: draftTeamName,
          members: draftMembers,
          createdAt: new Date(),
        };

        setMyTeams(prev => [newTeam, ...prev]);
        setIsCreating(false);
        setDraftMembers([]);
        setDraftTeamName("");
        setSearchQuery(""); // Clear search on save
        toast.success(`Team created! ID: ${data.group_id}`);
      } else {
        toast.error(data.error || "Failed to create team");
      }
    } catch (error) {
      toast.error("Connection error. Please try again.");
    }
  }

  const cancelCreation = () => {
    setIsCreating(false)
    setDraftMembers([])
    setSearchQuery("") // Clear search on cancel
  }

  const handleRegenerateRecommendations = () => {
    // Shuffle the students array to simulate regeneration
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    setStudents(shuffled.map(student => ({
      ...student,
      matchScore: Math.floor(Math.random() * 40) + 60
    })));
    setSearchQuery("") // Clear search on regenerate
  }

  if (userLoading) {
    return <div className="flex items-center justify-center h-96">
      <div className="text-lg">Loading user...</div>
    </div>
  }

  if (!currentUser) {
    return <div className="flex items-center justify-center h-96">
      <div className="text-lg">Please log in to access team builder.</div>
    </div>
  }

  return (
    <div className="space-y-8 pb-12 relative">
      {/* --- Header --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Builder</h1>
          <p className="mt-1 text-muted-foreground">Build complementary teams for your projects</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {!isCreating && (
            <Button onClick={startCreation} className="w-full bg-primary text-primary-foreground sm:w-auto">
              <PlusIcon className="mr-2 h-5 w-5" />
              Create New Team
            </Button>
          )}
          <Button variant="outline" onClick={handleRegenerateRecommendations} className="w-full sm:w-auto">
            <SparklesIcon className="mr-2 h-5 w-5" />
            Regenerate Recs
          </Button>
        </div>
      </div>

      {/* --- Active Creation Staging Area --- */}
      {isCreating && (
        <Card className="border-primary/50 bg-primary/5 rounded-2xl p-6 sticky top-4 z-10 backdrop-blur-md shadow-lg">
          <div className="flex flex-col gap-4">
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

            {/* --- MiniSearch Bar --- */}
            <div className="relative mt-2">
               <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder="Search candidates... (e.g. 'Rahul React')" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 bg-background/90"
               />
               {searchQuery && (
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                   {filteredCandidates.length} results
                 </div>
               )}
            </div>

          </div>
        </Card>
      )}

      {/* --- My Teams List --- */}
      {myTeams.length > 0 && !isCreating && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center">
            <UserGroupIcon className="mr-2 h-5 w-5" />
            My Teams ({myTeams.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myTeams.map((team) => (
              <Card 
                key={team.id} 
                onClick={() => setSelectedTeam(team)}
                className="glass rounded-2xl p-5 border-l-4 border-l-primary shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]"
              >
              <div className="flex justify-between items-start mb-4 border-b pb-3">
                <div>
                  <h3 className="font-bold text-lg">{team.name}</h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-mono text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20 w-fit">
                      ID: {team.id}
                    </p>
                  </div>
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

      {/* --- Recommendations Grid --- */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center gap-2">
          {searchQuery ? (
             <>
               <MagnifyingGlassIcon className="h-5 w-5" />
               Search Results
             </>
          ) : (
             isCreating ? "Select Teammates" : "Recommended Teammates"
          )}
        </h2>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        ) : filteredCandidates.length === 0 ? (
           <div className="text-center py-12 text-muted-foreground">
             <p>No students found matching "{searchQuery}"</p>
             <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">Clear Search</Button>
           </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCandidates.map((student: any) => {
              if (!student) return null

              const isSelected = draftMembers.some(m => m.id === student.id)

              return (
                <Card 
                  key={student.id} 
                  className={`glass rounded-2xl p-6 transition-all duration-200 ${
                    isSelected ? "ring-2 ring-primary border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        {student.name}
                        {isSelected && <CheckCircleIcon className="w-5 h-5 text-primary" />}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student.department || 'No Department'} • Year {student.year}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">{student.matchScore}%</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium text-foreground">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {student.skills && student.skills.length > 0 ? (
                        student.skills.slice(0, 6).map((skill: string, index: number) => {
                          // Search Match Logic
                          const isSearchMatch = searchQuery && searchQuery.toLowerCase().split(/\s+/).some(t => t.length > 1 && skill.toLowerCase().includes(t));
                          const isComplementary = !currentUser?.skills?.includes(skill);

                          return (
                            <SkillBadge 
                              key={`${skill}-${index}`} 
                              skill={skill} 
                              variant={isSearchMatch ? "matched" : (isComplementary ? "default" : "secondary")} 
                              className={isSearchMatch ? "ring-2 ring-primary bg-primary/20 font-bold" : ""}
                            />
                          );
                        })
                      ) : (
                        <span className="text-sm text-muted-foreground">No skills listed</span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 h-32">
                    <h4 className="mb-2 text-sm font-medium text-foreground">Domain Strength</h4>
                    <DomainChart domains={student.domains} />
                  </div>

                  <div className="flex gap-2">
                    {isCreating ? (
                      <Button 
                        size="sm" 
                        className="flex-1" 
                        variant={isSelected ? "secondary" : "default"}
                        onClick={() => toggleMemberSelection(student)}
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
                        Start Team with {student.name.split(' ')[0]}
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
        )}
      </div>

      {/* --- Team Details Modal / Popup --- */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-background shadow-2xl rounded-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-primary/5 p-6 border-b flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedTeam.name}</h3>
                <p className="text-[10px] font-mono text-primary bg-primary/5 px-2 py-0.5 mt-1 rounded border border-primary/20 w-fit">
                  Group ID: {selectedTeam.id}
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
                      <p className="text-xs text-muted-foreground">Member</p>
                      <p className="text-xs text-muted-foreground">
                        {member.department || "No Department listed"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}