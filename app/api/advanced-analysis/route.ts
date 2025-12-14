import { type NextRequest, NextResponse } from "next/server"
import {
  analyzeSecurityVulnerabilities,
  analyzeCodeComplexity,
  analyzePerformance,
  generateCodeReviewSuggestions,
} from "@/lib/security-analysis"
import { fetchRepositoryMetrics } from "@/lib/github-api"

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json()

    if (!owner || !repo) {
      return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 })
    }

    const metrics = await fetchRepositoryMetrics(owner, repo)

    const [vulnerabilities, complexity, performance, codeReview] = await Promise.all([
      analyzeSecurityVulnerabilities(metrics),
      analyzeCodeComplexity(metrics),
      analyzePerformance(metrics),
      generateCodeReviewSuggestions(metrics),
    ])

    return NextResponse.json(
      {
        vulnerabilities,
        complexity,
        performance,
        codeReview,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Advanced analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze repository" }, { status: 500 })
  }
}
