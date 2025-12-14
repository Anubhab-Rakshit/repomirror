"use client"

import type { AnalysisResult } from "@/lib/analysis-engine"
import { motion } from "framer-motion"
import { Copy, Share2, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ScoreCircle from "@/components/score-circle"
import DimensionBreakdown from "@/components/dimension-breakdown"
import SummaryCard from "@/components/summary-card"
import StrengthsWeaknesses from "@/components/strengths-weaknesses"

interface ResultsDashboardProps {
  analysis: AnalysisResult
}

export default function ResultsDashboard({ analysis }: ResultsDashboardProps) {
  const handleCopySummary = async () => {
    await navigator.clipboard.writeText(analysis.summary)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `GitGrade Analysis: ${analysis.metrics.owner}/${analysis.metrics.name}`,
        text: analysis.summary,
        url: window.location.href,
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const recentActivity = analysis.metrics.commitsLastMonth > 0 ? "Active" : "Inactive"
  const qualityScore = analysis.dimensions.find((d) => d.name === "Code Quality")?.score || 0
  const docScore = analysis.dimensions.find((d) => d.name === "Documentation")?.score || 0
  const testScore = analysis.dimensions.find((d) => d.name === "Testing")?.score || 0

  return (
    <motion.section
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full mb-4">
                <span className="text-blue-400 text-xs font-medium">Repository Analysis</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {analysis.metrics.owner}/{analysis.metrics.name}
              </h1>
              <p className="text-gray-400">{analysis.metrics.description || "No description available"}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCopySummary}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={handleShare} className="bg-blue-600 hover:bg-blue-500 text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Quick metrics bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Stars", value: analysis.metrics.stars, icon: "⭐" },
              { label: "Contributors", value: analysis.metrics.contributors, icon: "👥" },
              { label: "Commits", value: analysis.metrics.commitCount, icon: "💾" },
              { label: "Status", value: recentActivity, icon: "📊" },
              { label: "Score", value: `${analysis.score}/100`, icon: "🎯" },
            ].map((metric, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-all"
              >
                <div className="text-2xl mb-2">{metric.icon}</div>
                <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
                <div className="font-bold text-white">{metric.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Score circle */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <ScoreCircle analysis={analysis} />
          </motion.div>

          {/* Summary and insights */}
          <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
            <SummaryCard summary={analysis.summary} />

            {/* Key insights */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Key Insights
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Code Quality",
                    value: qualityScore,
                    status: qualityScore >= 75 ? "good" : qualityScore >= 50 ? "fair" : "needs-work",
                  },
                  {
                    label: "Documentation",
                    value: docScore,
                    status: docScore >= 75 ? "good" : docScore >= 50 ? "fair" : "needs-work",
                  },
                  {
                    label: "Testing",
                    value: testScore,
                    status: testScore >= 75 ? "good" : testScore >= 50 ? "fair" : "needs-work",
                  },
                ].map((insight, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      {insight.status === "good" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : insight.status === "fair" ? (
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-sm text-gray-300">{insight.label}</span>
                    </div>
                    <span className="font-bold text-white">{insight.value}/100</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dimension breakdown */}

        {/* Strengths and Weaknesses */}
        <motion.div variants={itemVariants}>
          <StrengthsWeaknesses strengths={analysis.strengths} weaknesses={analysis.weaknesses} />
        </motion.div>
      </div>
    </motion.section>
  )
}
