"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, AlertCircle, Info } from "lucide-react"
import type { SecurityVulnerability } from "@/lib/security-analysis"

interface SecurityPanelProps {
  vulnerabilities: SecurityVulnerability[]
}

const severityConfig = {
  critical: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", icon: AlertTriangle },
  high: { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: AlertCircle },
  medium: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: Info },
  low: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: Info },
}

export default function SecurityPanel({ vulnerabilities }: SecurityPanelProps) {
  const criticalCount = vulnerabilities.filter((v) => v.severity === "critical").length
  const highCount = vulnerabilities.filter((v) => v.severity === "high").length

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Security Analysis</h2>
        <p className="text-gray-400">
          {criticalCount > 0 ? `${criticalCount} critical issues found` : "No critical security issues"}
        </p>
      </div>

      {vulnerabilities.length === 0 ? (
        <motion.div className="p-8 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <h3 className="font-semibold text-green-400">No vulnerabilities detected</h3>
            <p className="text-sm text-gray-400">Keep up with security best practices</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {vulnerabilities.map((vuln, i) => {
            const config = severityConfig[vuln.severity]
            const Icon = config.icon

            return (
              <motion.div
                key={vuln.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-lg border ${config.bg} ${config.border} hover:border-opacity-60 transition-all`}
              >
                <div className="flex gap-4">
                  <Icon className={`w-6 h-6 flex-shrink-0 ${config.color}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{vuln.title}</h3>
                        <p className="text-sm text-gray-300 mb-3">{vuln.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded ${config.bg}`}>
                            Severity: {vuln.severity.toUpperCase()}
                          </span>
                          {vuln.cve && <span className="text-xs px-2 py-1 rounded bg-red-500/10">CVE: {vuln.cve}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded bg-black/50 border border-gray-700">
                      <p className="text-sm text-gray-300">
                        <span className="text-cyan-400 font-semibold">Fix:</span> {vuln.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
