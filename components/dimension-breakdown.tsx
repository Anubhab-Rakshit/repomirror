"use client"

import type { DimensionScore } from "@/lib/analysis-engine"
import { motion } from "framer-motion"
import { TrendingUp, BarChart3 } from "lucide-react"

interface DimensionBreakdownProps {
  dimensions: DimensionScore[]
}

export default function DimensionBreakdown({ dimensions }: DimensionBreakdownProps) {
  const getScoreStatus = (score: number) => {
    if (score >= 85) return { status: "Excellent", color: "from-green-500 to-emerald-500", textColor: "text-green-400" }
    if (score >= 70) return { status: "Good", color: "from-cyan-500 to-blue-500", textColor: "text-cyan-400" }
    if (score >= 50) return { status: "Fair", color: "from-yellow-500 to-orange-500", textColor: "text-yellow-400" }
    return { status: "Needs Work", color: "from-red-500 to-orange-500", textColor: "text-red-400" }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <motion.section
      className="py-20 px-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Dimension Breakdown</h2>
          <p className="text-gray-400">Detailed analysis across six key evaluation dimensions</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {dimensions.map((dimension, index) => {
            const { status, color, textColor } = getScoreStatus(dimension.score)
            const animationDelay = index * 0.05

            return (
              <motion.div key={dimension.name} variants={itemVariants} className="group relative">
                {/* Card background with gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative glass p-6 rounded-2xl border border-purple-500/30 group-hover:border-cyan-500/50 transition-all duration-300 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {dimension.name}
                      </h3>
                      <p className="text-sm text-gray-400">{dimension.description}</p>
                    </div>
                    <div className={`text-right ml-4 ${textColor}`}>
                      <div className="text-3xl font-bold">{dimension.score}</div>
                      <div className="text-xs font-semibold text-gray-400 mt-1">{status}</div>
                    </div>
                  </div>

                  {/* Circular progress indicator */}
                  <div className="relative mb-6">
                    <svg className="w-full h-24" viewBox="0 0 200 100">
                      {/* Background circle */}
                      <path
                        d="M 20 80 Q 100 20 180 80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-700"
                      />
                      {/* Progress circle */}
                      <motion.path
                        d="M 20 80 Q 100 20 180 80"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: dimension.score / 100 }}
                        transition={{ duration: 1.5, delay: animationDelay, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: dimension.color, stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: "#00f0ff", stopOpacity: 0.5 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
                    <div className="text-left">
                      <p className="text-xs text-gray-500 mb-1">Current</p>
                      <p className="text-lg font-bold text-white">{dimension.score}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Target</p>
                      <p className="text-lg font-bold text-cyan-400">100%</p>
                    </div>
                  </div>

                  {/* Improvement indicator */}
                  {dimension.score < 100 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: animationDelay + 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-700/50 flex items-center gap-2 text-sm text-yellow-400"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Room for improvement</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Overall insights */}
        <motion.div
          variants={itemVariants}
          className="mt-12 glass p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"
        >
          <div className="flex items-start gap-4">
            <BarChart3 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Analysis Summary</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your repository scores across all dimensions are above average. Focus on improving Testing and Community
                engagement to reach Expert status. Each dimension contributes equally to your overall score.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
