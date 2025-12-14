"use client"

import { motion } from "framer-motion"
import { TrendingUp, AlertCircle } from "lucide-react"

interface StrengthsWeaknessesProps {
  strengths: string[]
  weaknesses: string[]
}

export default function StrengthsWeaknesses({ strengths, weaknesses }: StrengthsWeaknessesProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Strengths */}
      <motion.div
        className="glass p-8 rounded-xl border border-green-500/30 hover:border-green-500/60 transition-all duration-300"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h3 className="text-2xl font-bold text-white">Strengths</h3>
        </div>

        <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
          {strengths.map((strength, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{strength}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Weaknesses */}
      <motion.div
        className="glass p-8 rounded-xl border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="w-6 h-6 text-amber-400" />
          <h3 className="text-2xl font-bold text-white">Areas to Improve</h3>
        </div>

        <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
          {weaknesses.map((weakness, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{weakness}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
