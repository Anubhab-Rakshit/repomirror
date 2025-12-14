"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Share2, FileText } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PDFExportPage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleExport = async () => {
    if (!repoUrl) {
      setError("Please enter a repository URL")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const element = document.createElement("a")
      element.href = url
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      element.download = match ? `gitgrade-${match[1]}-${match[2]}.html` : "gitgrade-report.html"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate PDF")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-8 h-8 text-cyan-500" />
            <h1 className="text-5xl font-bold">Export Report</h1>
          </div>
          <p className="text-gray-400 text-lg">Generate professional reports for your repositories</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-lg p-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Repository URL</label>
              <input
                type="text"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-cyan-500/50 rounded-lg focus:border-cyan-400 outline-none text-white placeholder-gray-600"
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {isLoading ? "Generating..." : "Download Report"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 border border-cyan-500/50 rounded-lg font-semibold hover:border-cyan-400"
              >
                <Share2 className="w-5 h-5" />
                Share Report
              </motion.button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-cyan-500/20">
            <h3 className="text-xl font-bold mb-4">Report Contents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Repository Overview",
                "Quality Score & Breakdown",
                "Git Metrics",
                "Dimension Analysis",
                "AI Summary",
                "Recommendations",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
