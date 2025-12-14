"use client"

import { motion } from "framer-motion"
import { TrendingUp, Code2, Zap } from "lucide-react"
import type { CodeComplexity } from "@/lib/security-analysis"

interface ComplexityPanelProps {
  complexity: CodeComplexity
}

export default function ComplexityPanel({ complexity }: ComplexityPanelProps) {
  const levelColor = {
    Low: "text-green-500",
    Medium: "text-yellow-500",
    High: "text-orange-500",
    "Very High": "text-red-500",
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Code Complexity Analysis</h2>
        <p className="text-gray-400">Evaluate code structure and maintainability metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-lg bg-gray-900/50 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-cyan-500" />
            <span className="text-gray-400">Complexity Score</span>
          </div>
          <div className={`text-4xl font-bold ${levelColor[complexity.level]}`}>{complexity.score}</div>
          <div className="text-sm text-gray-400 mt-1">{complexity.level}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-lg bg-gray-900/50 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Code2 className="w-5 h-5 text-purple-500" />
            <span className="text-gray-400">Files</span>
          </div>
          <div className="text-4xl font-bold text-purple-500">{complexity.fileCount}</div>
          <div className="text-sm text-gray-400 mt-1">Total files</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-lg bg-gray-900/50 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span className="text-gray-400">Maintainability</span>
          </div>
          <div className="text-4xl font-bold text-orange-500">{complexity.metrics.maintainabilityIndex}</div>
          <div className="text-sm text-gray-400 mt-1">Index score</div>
        </motion.div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-lg bg-gradient-to-br from-gray-900/50 to-black border border-cyan-500/20"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Detailed Metrics
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Cyclomatic Complexity</span>
            <span className="text-white font-semibold">{complexity.metrics.cyclomaticComplexity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Lines of Code (Est.)</span>
            <span className="text-white font-semibold">{complexity.metrics.linesOfCode.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Avg File Complexity</span>
            <span className="text-white font-semibold">{complexity.avgComplexity.toFixed(1)}</span>
          </div>
        </div>
      </motion.div>

      {complexity.hotspots.length > 0 && (
        <motion.div whileHover={{ scale: 1.02 }} className="p-6 rounded-lg bg-gray-900/50 border border-orange-500/30">
          <h3 className="font-semibold mb-4 text-orange-400">Complexity Hotspots</h3>
          <ul className="space-y-2">
            {complexity.hotspots.map((spot, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-orange-500">•</span>
                {spot}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  )
}
