import { generateAnalysisSummary, generateStrengthsAndWeaknesses, generateRoadmapItems } from "./gemini-ai"
import type { RepositoryMetrics } from "./github-api"

export interface AnalysisResult {
  score: number
  tier: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  summary: string
  strengths: string[]
  weaknesses: string[]
  dimensions: DimensionScore[]
  metrics: RepositoryMetrics
  roadmap: RoadmapItem[]
}

export interface DimensionScore {
  name: string
  score: number
  description: string
  color: string
}

export interface RoadmapItem {
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  priority: "Critical" | "High" | "Medium" | "Low"
  timeEstimate: string
  category: "Documentation" | "Testing" | "Code Quality" | "DevOps" | "Performance"
  impact: string
}

export class AnalysisEngine {
  /**
   * Calculate comprehensive repository score based on multiple metrics
   */
  private calculateScore(metrics: RepositoryMetrics): number {
    let score = 50

    // Code organization & structure (25 points)
    if (metrics.hasReadme) score += 8
    if (metrics.hasLicense) score += 5
    if (metrics.hasContributing) score += 4
    score += Math.min((metrics.fileCount / 500) * 8, 8)
    if (metrics.directoryCount > 5) score += 2

    // Documentation quality (20 points)
    if (metrics.hasReadme) score += 5
    if (metrics.hasChangelog) score += 5
    const mdFiles = metrics.filesByType["md"] || 0
    if (mdFiles > 2) score += 5
    if (metrics.hasWiki) score += 5

    // Testing & Quality (20 points)
    if (metrics.hasTests) score += 12
    const testRatio = metrics.testFiles / Math.max(metrics.fileCount, 1)
    if (testRatio > 0.1) score += 8
    if (metrics.hasGithubActions) score += 10

    // Community & Engagement (20 points)
    score += Math.min((metrics.stars / 200) * 8, 8)
    score += Math.min((metrics.contributors / 30) * 7, 7)
    score += Math.min((metrics.forks / 100) * 5, 5)

    // Maintenance & Activity (15 points)
    const daysLastUpdated = (Date.now() - new Date(metrics.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysLastUpdated < 7) score += 8
    else if (daysLastUpdated < 30) score += 6
    else if (daysLastUpdated < 90) score += 4
    else if (daysLastUpdated < 180) score += 2

    if (metrics.commitsLastMonth > 5) score += 5
    if (metrics.commitsLastWeek > 0) score += 2

    // Language diversity & frameworks
    const languageCount = Object.keys(metrics.languages).length
    score += Math.min(languageCount * 2, 5)
    if (metrics.frameworks.length > 0) score += 3

    // Branching strategy
    if (metrics.branches > 5) score += 3
    else if (metrics.branches > 2) score += 1

    if (metrics.archived) score -= 40
    if (metrics.disabled) score -= 35
    if (metrics.private) score -= 15
    if (metrics.commitCount === 0) score -= 20
    if (!metrics.hasReadme && metrics.fileCount > 50) score -= 10

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  private getTier(score: number): "Beginner" | "Intermediate" | "Advanced" | "Expert" {
    if (score >= 85) return "Expert"
    if (score >= 70) return "Advanced"
    if (score >= 50) return "Intermediate"
    return "Beginner"
  }

  private calculateDimensions(metrics: RepositoryMetrics): DimensionScore[] {
    return [
      {
        name: "Code Quality",
        score: this.calculateCodeQuality(metrics),
        description: "Organization, structure, and consistency",
        color: "#00f0ff",
      },
      {
        name: "Documentation",
        score: this.calculateDocumentation(metrics),
        description: "README, guides, and inline documentation",
        color: "#b537f2",
      },
      {
        name: "Testing",
        score: this.calculateTesting(metrics),
        description: "Test coverage and automation",
        color: "#00ff88",
      },
      {
        name: "Git Practices",
        score: this.calculateGitPractices(metrics),
        description: "Branching, commits, and PR patterns",
        color: "#ff6b35",
      },
      {
        name: "Community",
        score: this.calculateCommunity(metrics),
        description: "Engagement and contributor growth",
        color: "#f7b801",
      },
    ]
  }

  private calculateCodeQuality(metrics: RepositoryMetrics): number {
    let score = 60
    const languageCount = Object.keys(metrics.languages).length
    score += Math.min(languageCount * 3, 10)
    if (metrics.hasIssues) score += 5
    if (metrics.frameworks.length > 0) score += 8
    if (metrics.directoryCount > 10) score += 8
    else if (metrics.directoryCount > 5) score += 5
    else if (metrics.directoryCount > 2) score += 2
    if (metrics.fileCount < 100) score += 5
    else if (metrics.fileCount > 1000) score -= 5
    return Math.min(score, 100)
  }

  private calculateDocumentation(metrics: RepositoryMetrics): number {
    let score = 30
    if (metrics.hasReadme) score += 30
    if (metrics.hasChangelog) score += 20
    if (metrics.hasContributing) score += 15
    if (metrics.hasWiki) score += 10
    const mdFiles = metrics.filesByType["md"] || 0
    if (mdFiles > 5) score += 10
    else if (mdFiles > 2) score += 5
    return Math.min(score, 100)
  }

  private calculateTesting(metrics: RepositoryMetrics): number {
    let score = 40
    if (metrics.hasTests) {
      score += 35
      const testRatio = metrics.testFiles / Math.max(metrics.fileCount, 1)
      if (testRatio > 0.2) score += 15
      else if (testRatio > 0.1) score += 10
      else if (testRatio > 0.05) score += 5
    }
    if (metrics.hasGithubActions) score += 20
    return Math.min(score, 100)
  }

  private calculateGitPractices(metrics: RepositoryMetrics): number {
    let score = 50
    if (metrics.commitCount > 500) score += 20
    else if (metrics.commitCount > 100) score += 15
    else if (metrics.commitCount > 20) score += 8
    const daysSinceLastCommit = (Date.now() - new Date(metrics.pushedAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceLastCommit < 7) score += 15
    else if (daysSinceLastCommit < 30) score += 10
    else if (daysSinceLastCommit < 90) score += 5
    if (metrics.branches > 8) score += 10
    else if (metrics.branches > 3) score += 5
    if (metrics.prsMerged > 20) score += 10
    else if (metrics.prsMerged > 5) score += 5
    return Math.min(score, 100)
  }

  private calculateCommunity(metrics: RepositoryMetrics): number {
    let score = 40
    score += Math.min((metrics.stars / 500) * 30, 30)
    score += Math.min((metrics.contributors / 50) * 20, 20)
    score += Math.min((metrics.forks / 200) * 20, 20)
    return Math.min(score, 100)
  }

  async analyze(metrics: RepositoryMetrics): Promise<AnalysisResult> {
    const score = this.calculateScore(metrics)
    const tier = this.getTier(score)
    const dimensions = this.calculateDimensions(metrics)

    // Generate AI-powered content using Gemini
    const [summary, { strengths, weaknesses }, roadmap] = await Promise.all([
      generateAnalysisSummary(metrics, score),
      generateStrengthsAndWeaknesses(metrics),
      generateRoadmapItems(metrics, score),
    ])

    return {
      score,
      tier,
      summary,
      strengths,
      weaknesses,
      dimensions,
      metrics,
      roadmap: roadmap as RoadmapItem[],
    }
  }
}

export const analysisEngine = new AnalysisEngine()
