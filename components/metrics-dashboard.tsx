"use client"

import type { RepositoryMetrics } from "@/lib/github-api"
import { motion } from "framer-motion"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Code2, GitBranch, Users, Star, Zap, FileText, Calendar, Cpu, Shield } from "lucide-react"

interface MetricsDashboardProps {
  metrics: RepositoryMetrics
}

export default function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  const allLanguageData = Object.entries(metrics.languages || {})
    .map(([name, bytes]) => ({
      name,
      value: bytes,
      percentage: Math.round((bytes / Object.values(metrics.languages || {}).reduce((a, b) => a + b, 1)) * 100),
    }))
    .sort((a, b) => b.value - a.value)

  const activityData = [
    { name: "Stars", value: metrics.stars },
    { name: "Forks", value: metrics.forks },
    { name: "Contributors", value: metrics.contributors },
    { name: "Issues", value: metrics.issuesOpen },
  ]

  const COLORS = ["#00f0ff", "#b537f2", "#00ff88", "#ff6b35", "#f7b801", "#ff88ff", "#00d9ff", "#7c3aed"]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const daysOld = Math.round((Date.now() - new Date(metrics.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const daysSinceLastUpdate = Math.round((Date.now() - new Date(metrics.updatedAt).getTime()) / (1000 * 60 * 60 * 24))

  const improvements = [
    metrics.fileCount > 500 &&
      metrics.directoryCount < 8 && {
        title: "Improve Directory Structure",
        desc: `You have ${metrics.fileCount} files but only ${metrics.directoryCount} directories. Organize by feature/domain.`,
        severity: "high",
      },
    !metrics.hasTests && {
      title: "Add Test Coverage",
      desc: `No test files detected. Start with 10-20% coverage of critical paths.`,
      severity: "critical",
    },
    !metrics.hasReadme && {
      title: "Write Comprehensive README",
      desc: "Missing README - critical for user adoption and contributor onboarding.",
      severity: "critical",
    },
    !metrics.hasGithubActions && {
      title: "Setup CI/CD Pipeline",
      desc: "No GitHub Actions detected. Automate testing and deployment.",
      severity: "high",
    },
    metrics.dependenciesTotal > 50 && {
      title: "Audit Dependencies",
      desc: `${metrics.dependenciesTotal} dependencies detected. Review for unused packages.`,
      severity: "medium",
    },
    !metrics.hasChangelog && {
      title: "Maintain CHANGELOG",
      desc: "Missing CHANGELOG.md - helps users track project updates.",
      severity: "medium",
    },
  ].filter(Boolean)

  return (
    <motion.section
      className="py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Deep Dive Analytics</h2>
          <p className="text-gray-400">Comprehensive repository metrics and recommendations</p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-12 bg-slate-800/50 border border-slate-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-cyan-400" />
            Complete Language Breakdown
          </h3>

          {allLanguageData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pie chart */}
              <div className="lg:col-span-1">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={allLanguageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {allLanguageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* All languages list with details */}
              <div className="lg:col-span-2">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allLanguageData.map((lang, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="bg-slate-700/30 p-4 rounded-lg hover:bg-slate-700/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                          <span className="font-semibold text-white">{lang.name}</span>
                        </div>
                        <span className="text-sm font-bold text-cyan-400">{lang.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-600/30 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${lang.percentage}%`,
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{(lang.value / 1024 / 1024).toFixed(1)} MB</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">No language data available</div>
          )}
        </motion.div>

        {/* Main metrics grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Community Activity */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Community Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(15,23,42,0.9)", border: "1px solid rgba(0,240,255,0.3)" }}
                />
                <Bar dataKey="value" fill="#00f0ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Timeline & Maintenance */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-white">Timeline</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Created", value: `${daysOld} days ago`, icon: "📅" },
                { label: "Last Updated", value: `${daysSinceLastUpdate} days ago`, icon: "⏱️" },
                { label: "Total Commits", value: metrics.commitCount, icon: "💾" },
                { label: "Commits (Last Month)", value: metrics.commitsLastMonth, icon: "📈" },
              ].map((item, i) => (
                <div key={i} className="border-b border-slate-700/50 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      {item.icon} {item.label}
                    </span>
                    <span className="font-bold text-white">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Repository Health */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Repository Health</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Files", value: metrics.fileCount, color: "cyan" },
                { label: "Directories", value: metrics.directoryCount, color: "blue" },
                { label: "Contributors", value: metrics.contributors, color: "green" },
                { label: "Branches", value: metrics.branches, color: "purple" },
              ].map((item, i) => (
                <div key={i} className={`bg-${item.color}-500/10 border border-${item.color}-500/30 p-3 rounded-lg`}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <span className={`font-bold text-${item.color}-400`}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {improvements.length > 0 && (
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-orange-400" />
              Actionable Improvements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvements.map((improvement, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={`p-6 rounded-xl border ${
                    improvement.severity === "critical"
                      ? "bg-red-500/10 border-red-500/30"
                      : improvement.severity === "high"
                        ? "bg-orange-500/10 border-orange-500/30"
                        : "bg-yellow-500/10 border-yellow-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-white">{improvement.title}</h4>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        improvement.severity === "critical"
                          ? "bg-red-500/30 text-red-300"
                          : improvement.severity === "high"
                            ? "bg-orange-500/30 text-orange-300"
                            : "bg-yellow-500/30 text-yellow-300"
                      }`}
                    >
                      {improvement.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{improvement.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed features grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: FileText, label: "README", value: metrics.hasReadme ? "Present" : "Missing", color: "cyan" },
            { icon: Shield, label: "License", value: metrics.hasLicense ? "Present" : "Missing", color: "green" },
            {
              icon: Cpu,
              label: "Tests",
              value: metrics.hasTests ? `${metrics.testFiles} files` : "None",
              color: "purple",
            },
            {
              icon: Zap,
              label: "CI/CD",
              value: metrics.hasGithubActions ? `${metrics.hasWorkflows} workflows` : "Not setup",
              color: "orange",
            },
            { icon: GitBranch, label: "Branches", value: metrics.branches, color: "blue" },
            { icon: Users, label: "Contributors", value: metrics.contributors, color: "pink" },
          ].map((metric, i) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`bg-slate-800/50 border border-slate-700 hover:border-${metric.color}-500/50 rounded-lg p-4 transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className={`w-5 h-5 text-${metric.color}-400`} />
                </div>
                <div className={`text-${metric.color}-400 text-xs font-medium mb-1`}>{metric.label}</div>
                <div className="text-lg font-bold text-white">{metric.value}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
