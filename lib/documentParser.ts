// A basic list of skills to look for (expand this list as needed)
const SKILL_DATABASE = [
  "React", "Next.js", "Node.js", "TypeScript", "JavaScript", "Python", 
  "Java", "C++", "C#", "SQL", "NoSQL", "MongoDB", "PostgreSQL", 
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git", 
  "CI/CD", "Machine Learning", "Data Analysis", "Communication", 
  "Problem Solving", "Teamwork", "Agile", "Scrum", "HTML", "CSS", 
  "Tailwind", "Redux", "GraphQL", "REST API"
]

// Lazy load PDF.js only in browser environment
let pdfjsLib: typeof import("pdfjs-dist") | null = null
const initPdfJs = async () => {
  if (typeof window !== "undefined" && !pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist")
    // Set the worker source for PDF.js to a CDN for client-side usage
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  }
  return pdfjsLib
}

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type

  if (fileType === "application/pdf") {
    return await parsePDF(file)
  } else if (
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await parseDocx(file)
  } else if (fileType === "text/plain") {
    return await file.text()
  } else {
    throw new Error("Unsupported file format")
  }
}

const parsePDF = async (file: File): Promise<string> => {
  const pdfjs = await initPdfJs()
  if (!pdfjs) {
    throw new Error("PDF.js not available")
  }
  
  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise
  let fullText = ""

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item: any) => item.str).join(" ")
    fullText += pageText + "\n"
  }

  return fullText
}

const parseDocx = async (file: File): Promise<string> => {
  const mammoth = await import("mammoth")
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

export const analyzeSkills = (text: string): string[] => {
  const lowerCaseText = text.toLowerCase()
  // Filter the database to find skills present in the text
  // Using word boundary regex \b to avoid partial matches (e.g., "Java" inside "JavaScript")
  return SKILL_DATABASE.filter((skill) => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special chars for regex
    const regex = new RegExp(`\\b${escapedSkill.toLowerCase()}\\b`)
    return regex.test(lowerCaseText)
  })
}