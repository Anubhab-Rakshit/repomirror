"use client"

import { useState } from "react"
import Hero from "@/components/hero"
import RepositoryInput from "@/components/repository-input"

export default function Page() {
  const [showAnalyzer, setShowAnalyzer] = useState(false)

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 -z-10">
        {/* Main gradient mesh */}
        <div className="absolute inset-0 gradient-mesh-bg opacity-30" />

        {/* Morphing blob shapes */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full morphing-blob blur-3xl" />
        <div
          className="absolute top-1/3 -right-40 w-80 h-80 bg-magenta-500/20 rounded-full morphing-blob blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500/20 rounded-full morphing-blob blur-3xl"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full morphing-blob blur-3xl"
          style={{ animationDelay: "1s" }}
        />

        {/* Floating code snippets in background */}
        <div className="absolute top-20 right-20 text-xs font-mono text-cyan-400/30 blur-sm opacity-50 pointer-events-none transform -rotate-12">
          <div>const analyze = () =&gt; {}</div>
          <div className="mt-2">// Your code, decoded</div>
        </div>
        <div className="absolute bottom-32 left-10 text-xs font-mono text-purple-400/30 blur-sm opacity-50 pointer-events-none transform rotate-12">
          <div>async function* scan()</div>
          <div className="mt-2">yield insights</div>
        </div>
      </div>

      <div className="relative z-10">
        {!showAnalyzer ? <Hero onGetStarted={() => setShowAnalyzer(true)} /> : <RepositoryInput />}
      </div>
    </main>
  )
}
