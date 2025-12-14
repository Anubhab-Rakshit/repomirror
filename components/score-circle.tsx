"use client"

import type { AnalysisResult } from "@/lib/analysis-engine"
import { motion } from "framer-motion"

interface ScoreCircleProps {
  analysis: AnalysisResult
}

export default function ScoreCircle({ analysis }: ScoreCircleProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return { gradient: "from-green-400 to-emerald-500", hex: "#22c55e" }
    if (score >= 65) return { gradient: "from-cyan-400 to-blue-500", hex: "#00f0ff" }
    if (score >= 45) return { gradient: "from-yellow-400 to-orange-500", hex: "#f7b801" }
    return { gradient: "from-red-400 to-pink-500", hex: "#ff6b6b" }
  }

  const colors = getScoreColor(analysis.score)
  const circumference = 2 * Math.PI * 70

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Expert":
        return "text-green-400"
      case "Advanced":
        return "text-cyan-400"
      case "Intermediate":
        return "text-yellow-400"
      default:
        return "text-red-400"
    }
  }

  return (
    <div className="glass p-8 rounded-xl border border-purple-500/30 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-8 text-white">Repository Score</h2>

      {/* Circular progress */}
      <div className="relative w-56 h-56 mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />

          {/* Progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={colors.hex}
            strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: (circumference * (100 - analysis.score)) / 100 }}
            transition={{ duration: 2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            {analysis.score}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-sm text-gray-400 mt-2"
          >
            out of 100
          </motion.div>
        </div>
      </div>

      {/* Tier badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className={`px-6 py-2 rounded-full border-2 ${getTierColor(analysis.tier)} border-current text-center font-bold text-lg`}
      >
        {analysis.tier} Level
      </motion.div>

      {/* Tier description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="text-gray-400 text-sm mt-4 text-center max-w-xs"
      >
        {analysis.tier === "Expert" && "Exceptional repository with industry-leading practices"}
        {analysis.tier === "Advanced" &&
          "Well-structured repository with solid engineering practices and good documentation"}
        {analysis.tier === "Intermediate" && "Decent repository with room for improvement in testing and docs"}
        {analysis.tier === "Beginner" && "Early stage repository that needs foundational improvements"}
      </motion.p>
    </div>
  )
}
