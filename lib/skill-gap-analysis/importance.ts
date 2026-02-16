import type { Opportunity } from "@/lib/types"
import { normalizeSkill } from "./normalize"

export function calculateSkillImportance(opportunities: Opportunity[]) {
  const frequency: Record<string, number> = {}

  opportunities.forEach((opp) => {
    opp.skills.forEach((skill) => {
      const s = normalizeSkill(skill)
      frequency[s] = (frequency[s] || 0) + 1
    })
  })

  return Object.entries(frequency)
    .map(([skill, count]) => ({
      skill,
      count,
      importance: Math.min(count * 15, 100),
    }))
    .sort((a, b) => b.importance - a.importance)
}