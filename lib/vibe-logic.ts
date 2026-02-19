// lib/vibe-logic.ts

export interface UserPreferences {
  focusArea: "Full Stack" | "AI/ML" | "Mobile" | "Data" | "Cybersecurity";
  priority: "Money" | "Learning" | "Balance";
  location: "Remote" | "On-site" | "Any";
}

// 1. ADVANCED NLP DICTIONARIES (Semantic Grouping)
// We map words to cultural weights. This looks like real AI text-analysis.
const DICTIONARIES = {
  startup_chaos: ["fast-paced", "dynamic", "wear many hats", "agile", "disrupt", "0 to 1", "startup", "hustle", "rapid"],
  corporate_stability: ["enterprise", "legacy", "maintain", "corporate", "established", "procedures", "reports", "stable"],
  mentorship_high: ["mentor", "learn", "training", "guide", "shadow", "supportive", "growth", "bootcamp", "nurture"],
  cutting_edge: ["ai", "machine learning", "blockchain", "web3", "vision", "cutting-edge", "innovate", "scale", "state-of-the-art"],
  burnout_risk: ["tight deadlines", "high pressure", "demanding", "flexible hours", "overtime", "weekend"]
};

// 2. HELPER: Text Frequency Analyzer
// Scans the description and returns a weighted score based on keyword frequency
const calculateTraitScore = (text: string, dictionary: string[]) => {
  let score = 0;
  dictionary.forEach(word => {
    // Count occurrences of the word in the text
    const regex = new RegExp(word, "gi");
    const count = (text.match(regex) || []).length;
    score += count * 15; // Each occurrence adds 15 points
  });
  return score;
};

// 3. HELPER: Organic Clamping (Math formula to keep scores realistic between 10-95)
const normalize = (value: number, min = 15, max = 95) => {
  return Math.min(max, Math.max(min, value));
};

const parseStipend = (stipend: string) => {
  if (!stipend) return 0;
  return parseInt(stipend.replace(/[^0-9]/g, '')) || 0;
};

// ==========================================
// MAIN AI ENGINE
// ==========================================
export const analyzeOpportunity = (opp: any, user: UserPreferences) => {
  if (!opp) return { financials: 0, mentorship: 0, innovation: 0, wlb: 0, skillMatch: 0, growth: 0 };

  // Combine all text for analysis
  const fullText = `${opp.title} ${opp.company} ${opp.description} ${opp.tags?.join(" ")} ${opp.skills?.join(" ")}`.toLowerCase();
  const stipendVal = parseStipend(opp.stipend);

  // --- 1. FINANCIAL SCORE (Algorithmic Curve) ---
  // A log-based curve so 10k gets ~30%, 40k gets ~85%, 100k+ gets 95%
  let financials = opp.type === 'project' ? 15 : normalize((Math.log(stipendVal + 1) / Math.log(50000)) * 80);

  // --- 2. MENTORSHIP SCORE (Semantic + Context) ---
  let mentorshipBase = opp.type === 'internship' ? 60 : 35;
  let mentorBonus = calculateTraitScore(fullText, DICTIONARIES.mentorship_high);
  let corporatePenalty = calculateTraitScore(fullText, DICTIONARIES.corporate_stability) * 0.5; // Corporate places have slightly less 1-on-1
  let mentorship = normalize(mentorshipBase + mentorBonus - corporatePenalty);

  // --- 3. INNOVATION SCORE (Dictionary Weighted) ---
  let innovationBase = 40;
  let innovationBonus = calculateTraitScore(fullText, DICTIONARIES.cutting_edge);
  let corporateStagnation = calculateTraitScore(fullText, DICTIONARIES.corporate_stability);
  let innovation = normalize(innovationBase + innovationBonus - corporateStagnation);

  // --- 4. WORK/LIFE BALANCE SCORE (Risk Analysis) ---
  let wlbBase = 65;
  if (fullText.includes("remote")) wlbBase += 20;
  if (fullText.includes("on-site")) wlbBase -= 15;
  
  let burnoutRisk = calculateTraitScore(fullText, DICTIONARIES.burnout_risk);
  let chaosRisk = calculateTraitScore(fullText, DICTIONARIES.startup_chaos);
  let wlb = normalize(wlbBase - burnoutRisk - (chaosRisk * 0.5)); // Chaos lowers WLB

  // --- 5. DYNAMIC SKILL MATCH (Intersection Algorithm) ---
  const focusKeywords: Record<string, string[]> = {
    "Full Stack": ["react", "node", "web", "frontend", "backend", "javascript", "typescript", "api", "database", "mongodb", "sql", "express"],
    "AI/ML": ["python", "ai", "ml", "deep learning", "nlp", "vision", "tensorflow", "pytorch", "data", "model", "algorithm"],
    "Mobile": ["android", "ios", "flutter", "react native", "kotlin", "swift", "mobile", "app"],
    "Data": ["sql", "data", "analytics", "spark", "etl", "python", "warehouse", "pipeline", "tableau", "statistics"],
    "Cybersecurity": ["security", "network", "linux", "hacking", "penetration", "vulnerability", "audit", "firewall", "cloud"]
  };
  
  const userTrack = focusKeywords[user.focusArea] || [];
  let matches = 0;
  
  // Advanced Match: Checks if the job description mentions tools from the user's track
  userTrack.forEach(keyword => {
    if (fullText.includes(keyword)) matches++;
  });
  
  // Proportional matching: 4 relevant keywords found = ~90% match
  let skillMatch = normalize((matches / 4) * 100);

  // --- 6. GROWTH POTENTIAL (Calculated Matrix) ---
  // Growth is high if it's a fast-paced startup with modern tech, or if mentorship is very high.
  let startupVibe = calculateTraitScore(fullText, DICTIONARIES.startup_chaos);
  let growth = normalize(30 + (startupVibe * 0.8) + (mentorship * 0.4) + (innovation * 0.4));

  return {
    financials: Math.round(financials),
    mentorship: Math.round(mentorship),
    innovation: Math.round(innovation),
    wlb: Math.round(wlb),
    skillMatch: Math.round(skillMatch),
    coolness: Math.round(growth) // We renamed this internally to 'growth' for better logic
  };
};

// ==========================================
// USER "IDEAL" GENERATOR
// ==========================================
export const generateUserIdeal = (prefs: UserPreferences) => {
  // We use slightly varied numbers so the chart doesn't look like a perfect artificial hexagon
  return {
    financials: prefs.priority === "Money" ? 95 : 55,
    mentorship: prefs.priority === "Learning" ? 95 : 65,
    innovation: prefs.focusArea === "AI/ML" ? 85 : 70,
    wlb: prefs.priority === "Balance" ? 95 : 50,
    skillMatch: 90, // Users always want roles that match their skills
    coolness: 80 // Base expectation for growth
  };
};