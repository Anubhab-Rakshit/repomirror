"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Users, Star } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface LeaderboardEntry {
  rank: number
  owner: string
  repo: string
  score: number
  tier: string
  stars: number
  contributors: number
  language: string
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [filter, setFilter] = useState<"score" | "stars" | "contributors">("score")

  useEffect(() => {
    // Mock leaderboard data
    const mockData: LeaderboardEntry[] = [
      {
        rank: 1,
        owner: "vercel",
        repo: "next.js",
        score: 98,
        tier: "Expert",
        stars: 120000,
        contributors: 450,
        language: "TypeScript",
      },
      {
        rank: 2,
        owner: "torvalds",
        repo: "linux",
        score: 96,
        tier: "Expert",
        stars: 180000,
        contributors: 28000,
        language: "C",
      },
      {
        rank: 3,
        owner: "facebook",
        repo: "react",
        score: 95,
        tier: "Expert",
        stars: 210000,
        contributors: 1500,
        language: "JavaScript",
      },
      {
        rank: 4,
        owner: "golang",
        repo: "go",
        score: 94,
        tier: "Expert",
        stars: 120000,
        contributors: 2000,
        language: "Go",
      },
      {
        rank: 5,
        owner: "python",
        repo: "cpython",
        score: 92,
        tier: "Advanced",
        stars: 60000,
        contributors: 2300,
        language: "C",
      },
    ]

    setEntries(mockData)
  }, [])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Expert":
        return "from-yellow-500 to-yellow-600"
      case "Advanced":
        return "from-purple-500 to-purple-600"
      default:
        return "from-blue-500 to-blue-600"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-5xl font-bold">Repository Leaderboard</h1>
          </div>
          <p className="text-gray-400 text-lg">Top-rated repositories based on code quality metrics</p>
        </motion.div>

        {/* Filter buttons */}
        <div className="flex gap-4 mb-8">
          {["score", "stars", "contributors"].map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                  : "bg-gray-900 text-gray-300 hover:bg-gray-800"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Leaderboard entries */}
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-lg border border-cyan-500/30 hover:border-cyan-500/70 transition-all group"
              style={{
                background: "rgba(0, 240, 255, 0.03)",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />

              <div className="relative p-6 flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
                      {entry.rank}
                    </div>
                    <div className="text-xs text-gray-500">Rank</div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {entry.owner}/{entry.repo}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {entry.stars.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {entry.contributors.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300">{entry.language}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-4xl font-bold bg-gradient-to-r ${getTierColor(entry.tier)} bg-clip-text text-transparent mb-2`}
                  >
                    {entry.score}
                  </div>
                  <div className="text-sm text-gray-400">{entry.tier}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
