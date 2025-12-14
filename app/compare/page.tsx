"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, GitCompare, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ComparePage() {
  const [repos, setRepos] = useState<Array<{ url: string; data: any }>>([])
  const [viewMode, setViewMode] = useState<"comparison" | "history">("comparison")
  const [inputUrl, setInputUrl] = useState("")

  const addRepository = async () => {
    if (!inputUrl) return

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      })

      const data = await response.json()
      if (data.success) {
        setRepos([...repos, { url: inputUrl, data: data.data }])
        setInputUrl("")
      }
    } catch (error) {
      console.error("Failed to add repository:", error)
    }
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 gradient-mesh-bg opacity-10" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full morphing-blob blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full morphing-blob blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GitCompare className="w-10 h-10 text-cyan-400" />
              <h1 className="text-4xl md:text-5xl font-bold">Repository Comparison</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Compare multiple repositories side-by-side or track improvement over time
            </p>
          </motion.div>

          {/* View Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-4 mb-12 justify-center"
          >
            <Button
              onClick={() => setViewMode("comparison")}
              className={`px-6 py-2 rounded-lg transition-all ${
                viewMode === "comparison"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-purple-500/30 text-gray-300 hover:bg-purple-500/50"
              }`}
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Compare Repos
            </Button>
            <Button
              onClick={() => setViewMode("history")}
              className={`px-6 py-2 rounded-lg transition-all ${
                viewMode === "history"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-purple-500/30 text-gray-300 hover:bg-purple-500/50"
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Track History
            </Button>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="flex-1 px-4 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-all"
              />
              <Button
                onClick={addRepository}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </Button>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="min-h-[60vh]"
          >
            {repos.length === 0 ? (
              <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-2xl p-12 flex flex-col items-center justify-center">
                <div className="text-center">
                  <GitCompare className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
                  <h2 className="text-2xl font-bold text-white mb-2">No Repositories Yet</h2>
                  <p className="text-gray-400 mb-6 max-w-md">
                    {viewMode === "comparison"
                      ? "Add two or more repositories to compare their metrics side-by-side"
                      : "Track how your repository scores improve over time by analyzing it periodically"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map((repo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass p-6 rounded-xl border border-cyan-500/30 hover:border-cyan-500/60 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white mb-2">{repo.url.split("/").pop()}</h3>
                    <p className="text-sm text-gray-400 mb-4">{repo.url}</p>
                    <div className="bg-purple-500/10 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-cyan-400">{repo.data.score}</div>
                      <div className="text-xs text-gray-400">{repo.data.tier}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
