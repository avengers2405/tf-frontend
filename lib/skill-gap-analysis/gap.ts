import { normalizeSkill } from "./normalize"

export function analyzeSkillGap(
  resumeSkills: string[],
  requiredSkills: string[]
) {
  const resumeSet = new Set(resumeSkills.map(normalizeSkill))

  const matched: string[] = []
  const missing: string[] = []

  requiredSkills.forEach((skill) => {
    const s = normalizeSkill(skill)
    if (resumeSet.has(s)) matched.push(skill)
    else missing.push(skill)
  })

  return { matched, missing }
}