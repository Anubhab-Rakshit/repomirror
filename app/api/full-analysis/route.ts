import { type NextRequest, NextResponse } from "next/server"
import { fetchRepositoryMetrics } from "@/lib/github-api"
import {
  analyzeSecurityVulnerabilities,
  analyzeCodeComplexity,
  analyzePerformance,
  generateCodeReviewSuggestions,
} from "@/lib/security-analysis"

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json()

    if (!owner || !repo) {
      return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 })
    }

    const metrics = await fetchRepositoryMetrics(owner, repo)

    const [vulnerabilities, complexity, performance, suggestions] = await Promise.all([
      analyzeSecurityVulnerabilities(metrics),
      analyzeCodeComplexity(metrics),
      analyzePerformance(metrics),
      generateCodeReviewSuggestions(metrics),
    ])

    return NextResponse.json(
      {
        metrics,
        analysis: {
          vulnerabilities,
          complexity,
          performance,
          suggestions,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Full analysis error:", error)
    return NextResponse.json({ error: "Failed to complete analysis" }, { status: 500 })
  }
}
