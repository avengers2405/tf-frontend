"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SkillBadge } from "@/components/ui/skill-badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon } from "@heroicons/react/24/outline"

export default function ResumesPage() {
  const { students, currentRole } = useAppStore()
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [minCGPA, setMinCGPA] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showAnonymous, setShowAnonymous] = useState(currentRole === "recruiter")

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase())) ||
      student.department.toLowerCase().includes(search.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || student.department === departmentFilter
    const matchesYear = yearFilter === "all" || student.year.toString() === yearFilter
    const matchesCGPA = !minCGPA || student.cgpa >= Number.parseFloat(minCGPA)

    return matchesSearch && matchesDepartment && matchesYear && matchesCGPA
  })

  const departments = Array.from(new Set(students.map((s) => s.department)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {showAnonymous ? "Anonymous Student Database" : "Student Database"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} found
          </p>
        </div>
        {currentRole === "recruiter" && (
          <Button variant="outline" onClick={() => setShowAnonymous(!showAnonymous)} className="w-full sm:w-auto">
            <EyeIcon className="mr-2 h-4 w-4" />
            {showAnonymous ? "Show Full Profiles" : "Show Anonymous"}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="glass rounded-2xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <div className="relative w-full flex-1 min-w-0 sm:min-w-[220px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <FunnelIcon className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="1">Year 1</SelectItem>
              <SelectItem value="2">Year 2</SelectItem>
              <SelectItem value="3">Year 3</SelectItem>
              <SelectItem value="4">Year 4</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            step="0.1"
            placeholder="Min CGPA"
            value={minCGPA}
            onChange={(e) => setMinCGPA(e.target.value)}
            className="w-full sm:w-[120px]"
          />
        </div>
      </Card>

      {/* Student Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card
            key={student.id}
            className="glass group rounded-2xl p-5 transition-all hover:shadow-xl hover:border-primary/50 cursor-pointer"
            onClick={() => setSelectedStudent(student)}
          >
            <div className="mb-4">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {showAnonymous ? `Student ${student.id}` : student.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {student.department} • Year {student.year}
              </p>
              <p className="text-sm font-medium text-primary">CGPA: {student.cgpa}</p>
            </div>

            <div className="mb-4">
              <h4 className="mb-2 text-xs font-medium text-muted-foreground">Top Skills</h4>
              <div className="flex flex-wrap gap-1">
                {student.skills.slice(0, 4).map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
                {student.skills.length > 4 && (
                  <span className="text-xs text-muted-foreground">+{student.skills.length - 4}</span>
                )}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-1 sm:grid-cols-5">
              {Object.entries(student.domains).map(([domain, score]) => (
                <div key={domain} className="text-center">
                  <div className="text-xs font-medium text-primary">{score}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">
                    {domain === "appDev" ? "App" : domain.slice(0, 3)}
                  </div>
                </div>
              ))}
            </div>

            {student.leadership.length > 0 && (
              <div className="mb-3">
                <h4 className="mb-1 text-xs font-medium text-muted-foreground">Leadership</h4>
                <p className="text-xs text-foreground line-clamp-1">{student.leadership[0]}</p>
              </div>
            )}

            <Button size="sm" variant="outline" className="w-full bg-transparent">
              View Full Profile
            </Button>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No students found matching your criteria</p>
        </Card>
      )}

      {/* Student Detail Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showAnonymous && selectedStudent ? `Student ${selectedStudent.id}` : selectedStudent?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  {selectedStudent.department} • Year {selectedStudent.year} • CGPA: {selectedStudent.cgpa}
                </p>
                {!showAnonymous && <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>}
              </div>

              <div>
                <h4 className="mb-2 font-medium text-foreground">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map((skill: string) => (
                    <SkillBadge key={skill} skill={skill} />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-foreground">Domain Expertise</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {Object.entries(selectedStudent.domains).map(([domain, score]: [string, any]) => (
                    <div key={domain} className="text-center rounded-lg border border-border p-3">
                      <div className="text-2xl font-bold text-primary">{score}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {domain === "appDev" ? "App Dev" : domain}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedStudent.projects.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium text-foreground">Projects</h4>
                  {selectedStudent.projects.map((project: any) => (
                    <div key={project.id} className="mb-3 rounded-lg border border-border p-3">
                      <h5 className="font-medium text-foreground">{project.title}</h5>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.skills.map((skill: string) => (
                          <SkillBadge key={skill} skill={skill} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedStudent.experience.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium text-foreground">Experience</h4>
                  {selectedStudent.experience.map((exp: any) => (
                    <div key={exp.id} className="mb-3 rounded-lg border border-border p-3">
                      <h5 className="font-medium text-foreground">{exp.title}</h5>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} • {exp.duration}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedStudent.leadership.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium text-foreground">Leadership & Activities</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedStudent.leadership.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
