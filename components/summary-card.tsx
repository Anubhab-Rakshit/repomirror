"use client"

import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { Sparkles } from "lucide-react"

interface SummaryCardProps {
  summary: string
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="glass p-6 rounded-xl border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-white">AI Analysis Summary</h3>
      </div>

      <div className="text-gray-300 leading-relaxed">
        <TypeAnimation sequence={[summary, 1000]} wrapper="p" speed={50} cursor={false} />
      </div>
    </motion.div>
  )
}
