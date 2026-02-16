// Canonical skill dictionary to handle short forms & variants
const SKILL_DICTIONARY: Record<string, string[]> = {
  "javascript": ["js", "javascript", "ecmascript"],
  "typescript": ["ts", "typescript"],
  "react": ["react", "reactjs", "react.js"],
  "node.js": ["node", "nodejs", "node.js"],
  "express": ["express", "express.js"],
  "machine learning": ["ml", "machine learning"],
  "deep learning": ["dl", "deep learning"],
  "natural language processing": ["nlp", "natural language processing"],
  "artificial intelligence": ["ai", "artificial intelligence"],
  "postgresql": ["postgres", "postgresql", "postgre sql"],
  "mongodb": ["mongo", "mongodb"],
  "rest api": ["rest", "rest api", "restful api"],
  "ci/cd": ["ci cd", "ci/cd", "continuous integration", "continuous deployment"],
  "docker": ["docker", "docker container"],
  "kubernetes": ["k8s", "kubernetes"],
  "aws": ["aws", "amazon web services"],
  "linux": ["linux", "unix"],
  "python": ["python", "py"],
}

// Normalize a single skill
export function normalizeSkill(skill: string): string {
  if (!skill) return ""

  const cleaned = skill
    .toLowerCase()
    .replace(/\.js/g, "")
    .replace(/\s+/g, " ")
    .trim()

  // Dictionary-based normalization
  for (const canonical in SKILL_DICTIONARY) {
    if (SKILL_DICTIONARY[canonical].includes(cleaned)) {
      return canonical
    }
  }

  return cleaned
}

// Normalize list of skills (deduplicated)
export function normalizeSkillList(skills: string[]): string[] {
  return Array.from(
    new Set(skills.map(normalizeSkill).filter(Boolean))
  )
}