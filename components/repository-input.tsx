"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Github, Loader, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import AnalysisLoading from "@/components/analysis-loading"
import { useRouter } from "next/navigation"

export default function RepositoryInput() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [repoInfo, setRepoInfo] = useState<{ owner: string; name: string } | null>(null)

  const parseGitHubUrl = (githubUrl: string): { owner: string; name: string } | null => {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)\/?$/)
    if (match) {
      return { owner: match[1], name: match[2].replace(".git", "") }
    }
    return null
  }

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Please enter a GitHub repository URL")
      return
    }

    // Validate GitHub URL
    const githubUrlRegex = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+\/?$/
    if (!githubUrlRegex.test(url)) {
      setError("Please enter a valid GitHub repository URL")
      return
    }

    setError("")
    setIsLoading(true)

    // Parse repo info
    const parsed = parseGitHubUrl(url)
    if (parsed) {
      setRepoInfo(parsed)
      setAnalyzing(true)
    }
  }

  if (analyzing && repoInfo) {
    return (
      <AnalysisLoading
        repoName={repoInfo.name}
        repoOwner={repoInfo.owner}
        repoUrl={url}
        onComplete={(analysisData) => {
          router.push(`/results?url=${encodeURIComponent(url)}`)
        }}
        onError={(errorMsg) => {
          setAnalyzing(false)
          setIsLoading(false)
          setError(errorMsg)
        }}
      />
    )
  }

  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Analyze Your Repository</h2>
          <p className="text-gray-400 text-lg">Paste your GitHub repository URL to get started</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {/* Input field */}
          <div className="relative group">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError("")
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAnalyze()
                }
              }}
              placeholder="https://github.com/username/repository"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-input border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Github className="absolute right-4 top-4 text-gray-500 w-6 h-6" />
          </div>

          {/* Error message */}
          {error && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm">
              {error}
            </motion.p>
          )}

          {/* Analyze button */}
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full py-4 text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-semibold rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Starting Analysis...
              </>
            ) : (
              <>
                Analyze Repository
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Example repos */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-purple-500/20"
        >
          <p className="text-gray-400 text-sm mb-4">Try these examples:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "https://github.com/vercel/next.js",
              "https://github.com/facebook/react",
              "https://github.com/torvalds/linux",
              "https://github.com/rails/rails",
            ].map((example) => (
              <button
                key={example}
                onClick={() => {
                  setUrl(example)
                  setError("")
                }}
                className="glass px-4 py-2 text-left text-sm text-gray-400 hover:text-cyan-400 rounded-lg border border-purple-500/30 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
