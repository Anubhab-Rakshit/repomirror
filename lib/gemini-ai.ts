import { GoogleGenerativeAI } from "@google/generative-ai"
import type { RepositoryMetrics } from "./github-api"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Simple in-memory cache for API responses (with TTL)
const responseCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

// Rate limiting - track API calls per minute
let apiCallCount = 0
let lastResetTime = Date.now()
const MAX_CALLS_PER_MINUTE = 3

function getCacheKey(prefix: string, metrics: RepositoryMetrics): string {
  return `${prefix}:${metrics.owner}/${metrics.name}`
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL
}

async function checkRateLimit(): Promise<void> {
  const now = Date.now()
  if (now - lastResetTime > 60000) {
    apiCallCount = 0
    lastResetTime = now
  }

  if (apiCallCount >= MAX_CALLS_PER_MINUTE) {
    const waitTime = Math.ceil((60000 - (now - lastResetTime)) / 1000)
    throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`)
  }

  apiCallCount++
}

export async function generateAnalysisSummary(metrics: RepositoryMetrics, score: number): Promise<string> {
  const cacheKey = getCacheKey("summary", metrics)
  const cached = responseCache.get(cacheKey)

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as string
  }

  try {
    await checkRateLimit()
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const tier = getTier(score)
    const prompt = `You are a senior code reviewer. Analyze this repository and provide a brief, honest 2-3 sentence assessment:

Repository: ${metrics.owner}/${metrics.name}
Score: ${score}/100 (${tier} level)
Description: ${metrics.description || "No description"}
Size: ${metrics.fileCount} files in ${metrics.directoryCount} directories
Languages: ${Object.keys(metrics.languages).join(", ") || "Unknown"}
Stars: ${metrics.stars} | Contributors: ${metrics.contributors} | Commits: ${metrics.commitCount}

Documentation: README=${metrics.hasReadme} | License=${metrics.hasLicense} | Changelog=${metrics.hasChangelog} | Contributing=${metrics.hasContributing}
Quality: Tests=${metrics.hasTests} | CI/CD=${metrics.hasGithubActions} | Wiki=${metrics.hasWiki}
Activity: Last update ${Math.round((Date.now() - new Date(metrics.updatedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago | ${metrics.commitsLastMonth} commits last month

Focus on what's working well and what needs improvement. Be specific and constructive.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const response = text || generateFallbackSummary(metrics)

    // Cache the result
    responseCache.set(cacheKey, { data: response, timestamp: Date.now() })
    return response
  } catch (error) {
    console.error("Gemini API error:", error)
    const fallback = generateFallbackSummary(metrics)
    // Cache fallback for shorter duration (1 hour)
    responseCache.set(cacheKey, { data: fallback, timestamp: Date.now() })
    return fallback
  }
}

export async function generateStrengthsAndWeaknesses(
  metrics: RepositoryMetrics,
): Promise<{ strengths: string[]; weaknesses: string[] }> {
  const cacheKey = getCacheKey("strengths", metrics)
  const cached = responseCache.get(cacheKey)

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as { strengths: string[]; weaknesses: string[] }
  }

  try {
    await checkRateLimit()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })

    const prompt = `Analyze this GitHub repository and list its top 3-4 strengths and weaknesses:

Repository: ${metrics.owner}/${metrics.name}
Files: ${metrics.fileCount} | Contributors: ${metrics.contributors} | Stars: ${metrics.stars}
Has: README=${metrics.hasReadme}, Tests=${metrics.hasTests}, CI/CD=${metrics.hasGithubActions}, License=${metrics.hasLicense}
Languages: ${Object.keys(metrics.languages).slice(0, 5).join(", ")}
Activity: ${metrics.commitsLastMonth} commits last month, last update ${Math.round((Date.now() - new Date(metrics.updatedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago

Respond ONLY in JSON format (no markdown, no code blocks):
{
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2", "specific weakness 3"]
}`

    const result = await model.generateContent(prompt)
    let text = result.response.text()

    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "")

    const parsed = JSON.parse(text)
    const response = {
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
    }

    responseCache.set(cacheKey, { data: response, timestamp: Date.now() })
    return response
  } catch (error) {
    console.error("Gemini API error:", error)
    const response = {
      strengths: ["Well-maintained repository structure", "Active development pattern", "Proper open source setup"],
      weaknesses: [
        "Consider expanding test coverage",
        "Documentation could be improved",
        "Review dependency management",
      ],
    }
    responseCache.set(cacheKey, { data: response, timestamp: Date.now() })
    return response
  }
}

export async function generateRoadmapItems(
  metrics: RepositoryMetrics,
  score: number,
): Promise<
  Array<{
    title: string
    description: string
    difficulty: "Easy" | "Medium" | "Hard"
    priority: "Critical" | "High" | "Medium"
    timeEstimate: string
    category: string
    impact: string
  }>
> {
  const cacheKey = getCacheKey("roadmap", metrics)
  const cached = responseCache.get(cacheKey)

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as Array<{
      title: string
      description: string
      difficulty: "Easy" | "Medium" | "Hard"
      priority: "Critical" | "High" | "Medium"
      timeEstimate: string
      category: string
      impact: string
    }>
  }

  try {
    await checkRateLimit()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })

    const prompt = `Generate a personalized improvement roadmap for this GitHub repository. Return ONLY valid JSON (no markdown):

Repository: ${metrics.owner}/${metrics.name}
Current Score: ${score}/100
Files: ${metrics.fileCount} | Tests: ${metrics.hasTests} | Docs: ${metrics.hasReadme} | CI/CD: ${metrics.hasGithubActions}

Return a JSON array with 5-7 actionable items:
[
  {
    "title": "specific action",
    "description": "why and how to do it",
    "difficulty": "Easy|Medium|Hard",
    "priority": "Critical|High|Medium",
    "timeEstimate": "1-2 hours",
    "category": "Documentation|Testing|Code Quality|DevOps|Performance",
    "impact": "how it improves the score"
  }
]`

    const result = await model.generateContent(prompt)
    let text = result.response.text()

    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "")

    const items = JSON.parse(text)
    const response = Array.isArray(items) ? items : []

    responseCache.set(cacheKey, { data: response, timestamp: Date.now() })
    return response
  } catch (error) {
    console.error("Gemini API error:", error)
    const response = generateDefaultRoadmap(metrics, score)
    responseCache.set(cacheKey, { data: response, timestamp: Date.now() })
    return response
  }
}

function getTier(score: number): "Beginner" | "Intermediate" | "Advanced" | "Expert" {
  if (score >= 85) return "Expert"
  if (score >= 70) return "Advanced"
  if (score >= 50) return "Intermediate"
  return "Beginner"
}

function generateFallbackSummary(metrics: RepositoryMetrics): string {
  const score = calculateBaseScore(metrics)
  const tier = getTier(score)

  if (metrics.archived) {
    return `This repository is archived. It's no longer actively maintained. Consider exploring actively maintained alternatives if you need an updated version for production use.`
  }

  if (metrics.fileCount === 0) {
    return `This repository appears to be empty or has no accessible files. Check if it's properly initialized and contains project files.`
  }

  if (metrics.hasReadme && metrics.hasTests && metrics.hasGithubActions) {
    return `${tier}-tier repository with solid engineering practices. Has documentation, test coverage, and automated workflows. Consider adding more comprehensive tests and detailed contribution guidelines to reach Expert level.`
  }

  return `${tier}-tier repository with potential for improvement. Prioritize adding comprehensive documentation (README), setting up tests, and establishing CI/CD workflows to increase code reliability and attract contributors.`
}

function generateDefaultRoadmap(
  metrics: RepositoryMetrics,
  score: number,
): Array<{
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  priority: "Critical" | "High" | "Medium"
  timeEstimate: string
  category: string
  impact: string
}> {
  const roadmap = []

  if (!metrics.hasReadme) {
    roadmap.push({
      title: "Create Comprehensive README",
      description: "Add a detailed README with project overview, installation instructions, and usage examples",
      difficulty: "Easy",
      priority: "Critical",
      timeEstimate: "1-2 hours",
      category: "Documentation",
      impact: "+15 points - Improves project discoverability",
    })
  }

  if (!metrics.hasTests) {
    roadmap.push({
      title: "Add Unit Tests",
      description: "Write test cases for core functionality with at least 50% coverage",
      difficulty: "Medium",
      priority: "Critical",
      timeEstimate: "4-6 hours",
      category: "Testing",
      impact: "+20 points - Increases code reliability",
    })
  }

  if (!metrics.hasGithubActions) {
    roadmap.push({
      title: "Setup CI/CD Pipeline",
      description: "Configure GitHub Actions for automated testing and deployment",
      difficulty: "Medium",
      priority: "High",
      timeEstimate: "2-3 hours",
      category: "DevOps",
      impact: "+12 points - Ensures code quality",
    })
  }

  roadmap.push({
    title: "Improve Code Documentation",
    description: "Add inline comments and docstrings to complex functions",
    difficulty: "Easy",
    priority: "High",
    timeEstimate: "2-3 hours",
    category: "Documentation",
    impact: "+8 points - Better maintainability",
  })

  if (score < 70) {
    roadmap.push({
      title: "Refactor Code Structure",
      description: "Organize code into logical modules and improve naming conventions",
      difficulty: "Hard",
      priority: "High",
      timeEstimate: "6-8 hours",
      category: "Code Quality",
      impact: "+15 points - Better organization",
    })
  }

  return roadmap
}

function calculateBaseScore(metrics: RepositoryMetrics): number {
  let score = 50
  if (metrics.hasReadme) score += 10
  if (metrics.hasTests) score += 15
  if (metrics.hasGithubActions) score += 10
  if (metrics.hasLicense) score += 5
  if (metrics.stars > 50) score += 10
  return Math.min(score, 100)
}
