"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { AnalysisResult } from "@/lib/analysis-engine"
import ResultsDashboard from "@/components/results-dashboard"
import RoadmapSection from "@/components/roadmap-section"
import MetricsDashboard from "@/components/metrics-dashboard"
import DimensionBreakdown from "@/components/dimension-breakdown"
import { Loader } from "lucide-react"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) {
      setError("No repository URL provided")
      setIsLoading(false)
      return
    }

    const fetchAnalysis = async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        })

        if (!response.ok) {
          throw new Error("Failed to analyze repository")
        }

        const data = await response.json()
        if (data.success) {
          setAnalysis(data.data)
        } else {
          throw new Error(data.error || "Analysis failed")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalysis()
  }, [url])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
          <Loader className="w-12 h-12 text-cyan-400" />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-xl border border-red-500/30 max-w-md"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-colors"
          >
            Go Back
          </a>
        </motion.div>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <ResultsDashboard analysis={analysis} />

      <DimensionBreakdown dimensions={analysis.dimensions} />

      <RoadmapSection
        roadmapItems={
          analysis.roadmap && analysis.roadmap.length > 0 ? analysis.roadmap : generateDefaultRoadmap(analysis)
        }
        targetScore={95}
        currentScore={analysis.score}
      />
      <MetricsDashboard metrics={analysis.metrics} />
    </main>
  )
}

function generateDefaultRoadmap(analysis: AnalysisResult) {
  const items = []

  if (!analysis.metrics.hasReadme) {
    items.push({
      title: "Create Comprehensive README",
      description: "Document your project with setup instructions and examples",
      difficulty: "Easy" as const,
      priority: "Critical" as const,
      timeEstimate: "2-3 hours",
      category: "Documentation" as const,
      impact: "Increases user adoption and contributor confidence",
    })
  }

  if (!analysis.metrics.hasTests) {
    items.push({
      title: "Add Test Suite",
      description: "Implement unit tests for core functionality",
      difficulty: analysis.metrics.fileCount > 100 ? ("Hard" as const) : ("Medium" as const),
      priority: "Critical" as const,
      timeEstimate: analysis.metrics.fileCount > 100 ? "20-40 hours" : "8-16 hours",
      category: "Testing" as const,
      impact: "Prevent regressions and increase code reliability",
    })
  }

  if (!analysis.metrics.hasGithubActions) {
    items.push({
      title: "Setup CI/CD Pipeline",
      description: "Configure GitHub Actions for automated testing",
      difficulty: "Medium" as const,
      priority: "High" as const,
      timeEstimate: "4-6 hours",
      category: "DevOps" as const,
      impact: "Automate quality checks and deployment",
    })
  }

  return items
}
