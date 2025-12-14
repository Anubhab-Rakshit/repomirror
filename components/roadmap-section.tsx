"use client"

import type { RoadmapItem } from "@/lib/analysis-engine"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, ChevronDown, Code2, FileText, TestTube, Zap, GitBranch, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RoadmapSectionProps {
  roadmapItems: RoadmapItem[]
  targetScore: number
  currentScore: number
}

type Priority = "Critical" | "High" | "Medium" | "Low"

export default function RoadmapSection({ roadmapItems, targetScore, currentScore }: RoadmapSectionProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set())
  const [expandedItem, setExpandedItem] = useState<number | null>(null)

  const toggleTask = (index: number) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedTasks(newCompleted)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Code Quality":
        return <Code2 className="w-4 h-4" />
      case "Documentation":
        return <FileText className="w-4 h-4" />
      case "Testing":
        return <TestTube className="w-4 h-4" />
      case "DevOps":
        return <Zap className="w-4 h-4" />
      case "Performance":
        return <GitBranch className="w-4 h-4" />
      default:
        return <Code2 className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Code Quality":
        return "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
      case "Documentation":
        return "bg-purple-500/10 border-purple-500/30 text-purple-400"
      case "Testing":
        return "bg-green-500/10 border-green-500/30 text-green-400"
      case "DevOps":
        return "bg-orange-500/10 border-orange-500/30 text-orange-400"
      case "Performance":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400"
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "Critical":
        return "text-red-400"
      case "High":
        return "text-orange-400"
      case "Medium":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const groupedByPriority = {
    Critical: roadmapItems.filter((item) => item.priority === "Critical"),
    High: roadmapItems.filter((item) => item.priority === "High"),
    Medium: roadmapItems.filter((item) => item.priority === "Medium"),
  }

  const totalItems = roadmapItems.length
  const completionPercentage = totalItems > 0 ? Math.round((completedTasks.size / totalItems) * 100) : 0
  const estimatedScoreGain =
    totalItems > 0 ? Math.round(((targetScore - currentScore) / totalItems) * completedTasks.size) : 0
  const projectedScore = Math.min(targetScore, currentScore + estimatedScoreGain)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.section
      className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-4xl font-bold mb-2 text-white">Your Development Roadmap</h2>
          <p className="text-gray-400 mb-8">Follow these steps to improve your repository and reach Expert level</p>

          {/* Progress cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Completion", value: `${completionPercentage}%`, icon: "🎯" },
              { label: "Tasks Completed", value: `${completedTasks.size}/${totalItems}`, icon: "✅" },
              { label: "Current Score", value: currentScore, icon: "📊" },
              { label: "Projected Score", value: `${projectedScore}/${targetScore}`, icon: "🚀" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass p-6 rounded-xl border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-xs text-gray-500 mb-2">{stat.label}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* No items state */}
        {totalItems === 0 ? (
          <motion.div variants={itemVariants} className="glass p-12 rounded-xl border border-purple-500/30 text-center">
            <Flame className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">All Set!</h3>
            <p className="text-gray-400">Your repository is in excellent shape. No immediate improvements needed.</p>
          </motion.div>
        ) : (
          <>
            {/* Priority sections */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              {Object.entries(groupedByPriority).map(([priority, items]) => {
                if (items.length === 0) return null

                const priorityColor = priority === "Critical" ? "red" : priority === "High" ? "orange" : "yellow"
                const glowColor =
                  priority === "Critical"
                    ? "shadow-red-500/20"
                    : priority === "High"
                      ? "shadow-orange-500/20"
                      : "shadow-yellow-500/20"

                return (
                  <motion.div key={priority} variants={itemVariants}>
                    <div className={`mb-4 flex items-center gap-2`}>
                      <div className={`w-1 h-6 rounded-full bg-${priorityColor}-500`} />
                      <h3 className={`text-xl font-bold text-${priorityColor}-400`}>
                        {priority === "Critical" && "🔴"} {priority === "High" && "🟠"} {priority === "Medium" && "🟡"}{" "}
                        {priority} Priority
                      </h3>
                      <span className="text-sm text-gray-500 ml-auto">{items.length} tasks</span>
                    </div>

                    <div className={`space-y-4 pl-4 border-l-2 border-${priorityColor}-500/30`}>
                      {items.map((item, itemIndex) => {
                        const globalIndex = roadmapItems.indexOf(item)
                        const isCompleted = completedTasks.has(globalIndex)

                        return (
                          <motion.div
                            key={itemIndex}
                            layout
                            className={`glass rounded-lg border transition-all duration-300 overflow-hidden ${
                              isCompleted
                                ? "border-green-500/50 bg-green-500/5"
                                : "border-gray-700/50 hover:border-cyan-500/50"
                            } ${glowColor}`}
                          >
                            {/* Task header */}
                            <button
                              onClick={() => setExpandedItem(expandedItem === globalIndex ? null : globalIndex)}
                              className="w-full px-6 py-4 flex items-start justify-between hover:bg-white/5 transition-colors"
                            >
                              {/* Left side - checkbox and title */}
                              <div className="flex items-start gap-4 flex-1 text-left">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleTask(globalIndex)
                                  }}
                                  className="flex-shrink-0 mt-1"
                                >
                                  {isCompleted ? (
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      className="text-green-400"
                                    >
                                      <CheckCircle2 className="w-6 h-6" />
                                    </motion.div>
                                  ) : (
                                    <Circle className="w-6 h-6 text-gray-600 hover:text-cyan-400 transition-colors" />
                                  )}
                                </button>

                                <div className="flex-1">
                                  <h4
                                    className={`font-bold text-lg ${isCompleted ? "text-gray-400 line-through" : "text-white"}`}
                                  >
                                    {item.title}
                                  </h4>
                                  <p className={`text-sm mt-1 ${isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                                    {item.description}
                                  </p>

                                  {/* Tags */}
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    <div
                                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${getCategoryColor(item.category)}`}
                                    >
                                      {getCategoryIcon(item.category)}
                                      {item.category}
                                    </div>
                                    <div
                                      className={`px-2 py-1 rounded text-xs border ${getPriorityColor(item.priority as Priority)} border-current/30`}
                                    >
                                      {item.difficulty}
                                    </div>
                                    <div className="px-2 py-1 rounded text-xs border border-purple-500/30 text-purple-400">
                                      {item.timeEstimate}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right side - expand button */}
                              <motion.div
                                animate={{ rotate: expandedItem === globalIndex ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex-shrink-0 ml-4"
                              >
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              </motion.div>
                            </button>

                            {/* Expanded details */}
                            <AnimatePresence>
                              {expandedItem === globalIndex && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border-t border-gray-700/50 px-6 py-4 bg-black/20"
                                >
                                  <div className="space-y-4">
                                    {/* Impact */}
                                    <div>
                                      <h5 className="text-sm font-bold text-cyan-400 mb-2">Impact</h5>
                                      <p className="text-sm text-gray-300">{item.impact}</p>
                                    </div>

                                    {/* Action items */}
                                    <div>
                                      <h5 className="text-sm font-bold text-green-400 mb-2">Get Started</h5>
                                      <ul className="text-sm text-gray-300 space-y-2">
                                        <li>1. Review the recommended tools and resources for this category</li>
                                        <li>2. Start with the easiest subtask to build momentum</li>
                                        <li>3. Create a GitHub issue or PR to track progress</li>
                                        <li>4. Ask for community feedback when ready</li>
                                      </ul>
                                    </div>

                                    {/* Mark complete button */}
                                    {!isCompleted && (
                                      <Button
                                        onClick={() => toggleTask(globalIndex)}
                                        size="sm"
                                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 w-full"
                                      >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Mark as Complete
                                      </Button>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Gamification section */}
            <motion.div variants={itemVariants} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: "🏆",
                  label: "Achievements",
                  value: completionPercentage > 50 ? "Halfway There!" : "In Progress",
                },
                { icon: "⚡", label: "Current Streak", value: "Keep it up!" },
                { icon: "🎯", label: "Target Score", value: `${projectedScore}/${targetScore}` },
              ].map((achievement, i) => (
                <div
                  key={i}
                  className="glass p-6 rounded-lg border border-purple-500/30 text-center hover:border-cyan-500/50 transition-all"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-sm text-gray-400">{achievement.label}</div>
                  <div className="text-lg font-bold text-white mt-2">{achievement.value}</div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.section>
  )
}
