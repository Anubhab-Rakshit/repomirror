"use client"

import { motion } from "framer-motion"
import { MessageSquare, AlertCircle, Info } from "lucide-react"
import type { CodeReviewSuggestion } from "@/lib/security-analysis"

interface CodeReviewPanelProps {
  suggestions: CodeReviewSuggestion[]
}

const severityIcon = {
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
}

const severityColor = {
  error: "text-red-500 bg-red-500/10 border-red-500/30",
  warning: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
  info: "text-blue-500 bg-blue-500/10 border-blue-500/30",
}

export default function CodeReviewPanel({ suggestions }: CodeReviewPanelProps) {
  const categories = Array.from(new Set(suggestions.map((s) => s.category)))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">AI Code Review Suggestions</h2>
        <p className="text-gray-400">Automated recommendations for code quality improvement</p>
      </div>

      {categories.map((category, catIdx) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: catIdx * 0.1 }}
          className="space-y-3"
        >
          <h3 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {category}
          </h3>

          {suggestions
            .filter((s) => s.category === category)
            .map((suggestion, i) => {
              const Icon = severityIcon[suggestion.severity]

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-lg border ${severityColor[suggestion.severity]}`}
                >
                  <div className="flex gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-gray-300 mb-2">{suggestion.description}</p>

                      {suggestion.example && (
                        <div className="bg-black/50 rounded p-3 mb-3 font-mono text-xs text-gray-300 overflow-x-auto">
                          {suggestion.example}
                        </div>
                      )}

                      <div className="text-sm">
                        <span className="font-semibold text-cyan-400">Solution:</span>
                        <p className="text-gray-300 mt-1">{suggestion.solution}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </motion.div>
      ))}
    </motion.div>
  )
}
