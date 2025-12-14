"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Zap, Code2, GitBranch, FileText, BarChart3 } from "lucide-react"

interface AnalysisPhase {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
  status: "pending" | "active" | "completed"
}

interface AnalysisLoadingProps {
  repoName: string
  repoOwner: string
  repoUrl: string
  onComplete: (data: any) => void
  onError: (error: string) => void
}

export default function AnalysisLoading({ repoName, repoOwner, repoUrl, onComplete, onError }: AnalysisLoadingProps) {
  const [phases, setPhases] = useState<AnalysisPhase[]>([
    {
      id: "fetch",
      title: "Fetching Repository",
      description: "Retrieving repository metadata and structure",
      icon: <Zap className="w-5 h-5" />,
      progress: 0,
      status: "active",
    },
    {
      id: "code",
      title: "Analyzing Code",
      description: "Evaluating code quality and complexity",
      icon: <Code2 className="w-5 h-5" />,
      progress: 0,
      status: "pending",
    },
    {
      id: "git",
      title: "Analyzing Git History",
      description: "Examining commits and contributions",
      icon: <GitBranch className="w-5 h-5" />,
      progress: 0,
      status: "pending",
    },
    {
      id: "docs",
      title: "Checking Documentation",
      description: "Evaluating README and inline comments",
      icon: <FileText className="w-5 h-5" />,
      progress: 0,
      status: "pending",
    },
    {
      id: "metrics",
      title: "Generating Insights",
      description: "Creating personalized recommendations",
      icon: <BarChart3 className="w-5 h-5" />,
      progress: 0,
      status: "pending",
    },
  ])

  const [liveStats, setLiveStats] = useState<{
    fileCount: number
    languageCount: number
    commitCount: number
  }>({
    fileCount: 0,
    languageCount: 0,
    commitCount: 0,
  })

  useEffect(() => {
    const analyzeRepository = async () => {
      try {
        // Simulate phase progression while API is being called
        const phaseInterval = setInterval(() => {
          setPhases((prev) => {
            const newPhases = [...prev]
            let allComplete = true

            for (let i = 0; i < newPhases.length; i++) {
              if (newPhases[i].status === "pending" && newPhases[i - 1]?.status === "completed") {
                newPhases[i].status = "active"
                break
              }

              if (newPhases[i].status === "active") {
                newPhases[i].progress += Math.random() * 25
                if (newPhases[i].progress >= 100) {
                  newPhases[i].progress = 100
                  newPhases[i].status = "completed"
                }
                allComplete = false
              } else if (newPhases[i].status === "pending") {
                allComplete = false
              }
            }

            return newPhases
          })
        }, 300)

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: repoUrl }),
        })

        clearInterval(phaseInterval)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || errorData.error || "Failed to analyze repository")
        }

        const analysisResult = await response.json()

        // Update stats with real data
        if (analysisResult.success && analysisResult.data) {
          const metrics = analysisResult.data.metrics
          setLiveStats({
            fileCount: metrics.fileCount,
            languageCount: Object.keys(metrics.languages).length,
            commitCount: metrics.commitCount,
          })
        }

        // Complete all phases
        setPhases((prev) =>
          prev.map((phase) => ({
            ...phase,
            progress: 100,
            status: "completed",
          })),
        )

        // Wait a moment before completing
        await new Promise((resolve) => setTimeout(resolve, 800))
        onComplete(analysisResult.data)
      } catch (error) {
        console.error("Analysis error:", error)
        onError(error instanceof Error ? error.message : "Failed to analyze repository")
      }
    }

    analyzeRepository()
  }, [repoUrl, onComplete, onError])

  const totalProgress = Math.round((phases.reduce((sum, p) => sum + p.progress, 0) / (phases.length * 100)) * 100)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full relative z-10"
      >
        {/* Repository header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            <span className="text-gray-400">Analyzing</span>{" "}
            <span className="text-cyan-400 font-mono">
              {repoOwner}/{repoName}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-500 text-sm"
          >
            This usually takes 15-30 seconds
          </motion.p>
        </div>

        {/* Main progress visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass p-8 rounded-xl border border-purple-500/30 mb-8"
        >
          {/* Circular progress */}
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                {/* Progress circle */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 70 * (100 - totalProgress)) / 100 }}
                  transition={{ duration: 0.3 }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#b537f2" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-white">{totalProgress}%</div>
                <div className="text-xs text-gray-500 mt-1">Complete</div>
              </div>
            </div>
          </div>

          {/* Phase indicators */}
          <div className="space-y-3">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  phase.status === "completed"
                    ? "border-green-500/50 bg-green-500/5"
                    : phase.status === "active"
                      ? "border-cyan-500/50 bg-cyan-500/5"
                      : "border-gray-700/30 bg-transparent"
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {phase.status === "completed" ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                  ) : phase.status === "active" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="text-cyan-400"
                    >
                      {phase.icon}
                    </motion.div>
                  ) : (
                    <div className="text-gray-600">{phase.icon}</div>
                  )}
                </div>

                {/* Text content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white">{phase.title}</h3>
                    {phase.status === "active" && (
                      <span className="text-xs text-cyan-400">{Math.round(phase.progress)}%</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{phase.description}</p>

                  {/* Progress bar */}
                  {(phase.status === "active" || phase.status === "completed") && (
                    <motion.div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(phase.progress, 100)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live stats cards with REAL data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "Files Scanned", value: liveStats.fileCount || "..." },
            { label: "Languages Found", value: liveStats.languageCount || "..." },
            { label: "Commits Analyzed", value: liveStats.commitCount || "..." },
          ].map((stat, i) => (
            <div key={i} className="glass p-3 rounded-lg border border-purple-500/30 text-center text-xs">
              <motion.div className="font-bold text-cyan-400 text-lg">{stat.value}</motion.div>
              <div className="text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
