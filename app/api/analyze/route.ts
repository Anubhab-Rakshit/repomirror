import { type NextRequest, NextResponse } from "next/server"
import { githubAPI } from "@/lib/github-api"
import { analysisEngine } from "@/lib/analysis-engine"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid request: URL is required" }, { status: 400 })
    }

    // Parse GitHub URL
    const match = url.match(/github\.com\/([^/]+)\/([^/\s]+)\/?$/)
    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub URL format. Expected: https://github.com/owner/repo" },
        { status: 400 },
      )
    }

    const [, owner, repo] = match

    if (!owner || !repo || owner.length === 0 || repo.length === 0) {
      return NextResponse.json({ error: "Invalid repository owner or name" }, { status: 400 })
    }

    console.log(`[v0] Analyzing repository: ${owner}/${repo}`)

    // Fetch repository metrics
    const startTime = Date.now()
    const metrics = await githubAPI.getCompleteMetrics(owner, repo)
    const metricsTime = Date.now() - startTime

    console.log(`[v0] Metrics fetched in ${metricsTime}ms`)

    // Generate AI-powered analysis using Gemini
    const analysisStartTime = Date.now()
    const analysis = await analysisEngine.analyze(metrics)
    const analysisTime = Date.now() - analysisStartTime

    console.log(`[v0] Analysis completed in ${analysisTime}ms`)

    return NextResponse.json({
      success: true,
      data: analysis,
      timing: { metricsMs: metricsTime, analysisMs: analysisTime },
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze repository",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
