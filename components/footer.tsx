"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Zap } from "lucide-react"

export default function Footer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [nodes, setNodes] = useState<{ x: number; y: number; id: number }[]>([])

  useEffect(() => {
    // Generate random nodes for circuit board effect
    const newNodes = [...Array(8)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setNodes(newNodes)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const hexagons = [
    { label: "Product", icon: "📦" },
    { label: "Features", icon: "⚡" },
    { label: "Pricing", icon: "💎" },
    { label: "Docs", icon: "📚" },
    { label: "API", icon: "🔌" },
    { label: "Blog", icon: "✍️" },
  ]


  return (
    <footer onMouseMove={handleMouseMove} className="relative bg-black overflow-hidden pt-32 pb-8">
      {/* ANIMATED STARFIELD BACKGROUND */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* CIRCUIT BOARD EFFECT */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
        {nodes.map((node, i) => (
          <g key={i}>
            {nodes.slice(i + 1).map((otherNode) => (
              <motion.line
                key={`${i}-${otherNode.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${otherNode.x}%`}
                y2={`${otherNode.y}%`}
                stroke="url(#gradient)"
                strokeWidth="1"
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random(),
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            ))}
          </g>
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#b537f2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* THREE-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* LEFT ZONE - THE VAULT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
            style={{ transform: "perspective(1000px) rotateY(-3deg)" }}
          >
            <div
              className="relative p-8 rounded-2xl overflow-hidden group"
              style={{
                background: "rgba(10, 10, 10, 0.8)",
                border: "1px solid rgba(0, 240, 255, 0.3)",
                boxShadow: "0 0 30px rgba(0, 240, 255, 0.1)",
              }}
            >
              {/* SCANNING LINE EFFECT */}
              <motion.div
                className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />

              <motion.div whileHover={{ scale: 1.1 }} className="w-12 h-12 mb-4">
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                  GR
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-2">RepoMirror</h3>
              <p className="text-gray-400 text-sm mb-6">Code analysis from the future</p>

              {/* STATUS INDICATOR */}
              <motion.div
                className="flex items-center gap-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-gray-400">All systems operational</span>
              </motion.div>
            </div>
          </motion.div>

          {/* CENTER ZONE - THE GRID (HEXAGONS) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="grid grid-cols-2 gap-4">
              {hexagons.map((hex, i) => (
                <motion.div
                  key={i}
                  className="relative h-20 rounded-lg overflow-hidden group cursor-pointer"
                  style={{
                    background: "rgba(10, 10, 10, 0.8)",
                    border: "1px solid rgba(0, 240, 255, 0.2)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(0, 240, 255, 0.6)",
                    boxShadow: "0 0 20px rgba(0, 240, 255, 0.3)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative h-full flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">{hex.icon}</span>
                    <span className="text-xs font-semibold text-gray-300 text-center">{hex.label}</span>
                  </div>

                  {/* GLOW ON HOVER */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    whileHover={{
                      boxShadow: ["0 0 0px rgba(0, 240, 255, 0)", "0 0 20px rgba(0, 240, 255, 0.5)"],
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT ZONE - THE TERMINAL */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1"
            style={{ transform: "perspective(1000px) rotateY(3deg)" }}
          >
            <div
              className="p-6 rounded-lg font-mono text-sm"
              style={{
                background: "rgba(0, 20, 30, 0.9)",
                border: "1px solid rgba(0, 240, 255, 0.5)",
                boxShadow: "0 0 30px rgba(0, 240, 255, 0.1) inset",
              }}
            >
              <div className="text-cyan-400 mb-4">
                <span className="text-yellow-400">root</span>
                <span className="text-gray-500">@</span>
                <span className="text-purple-400">repomirror</span>
                <span className="text-gray-500">:~$</span>
              </div>

              <motion.form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubscribed(true)
                  setTimeout(() => setSubscribed(false), 3000)
                }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-400">{subscribed ? "✓" : ">"}</span>
                  <input
                    type="email"
                    placeholder="subscribe your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-none outline-none text-green-400 placeholder-gray-600 flex-1 text-xs"
                  />
                </div>

                {subscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-xs"
                  >
                    ✓ Subscribed successfully
                  </motion.div>
                )}
              </motion.form>
            </div>
          </motion.div>
        </div>

        {/* SOCIAL ORBIT */}
        <motion.div
          className="relative w-full h-40 flex items-center justify-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative w-32 h-32">
            {/* ORBIT CIRCLE */}
            <motion.div
              className="absolute inset-0 border border-cyan-500/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />

            {/* CENTER ICON */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center"
              >
                <Zap className="w-4 h-4 text-white" />
              </motion.div>
            </div>

            {/* ORBITING ICONS */}
          
          </div>
        </motion.div>

        {/* BOTTOM BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-cyan-500/20 pt-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono">
            <div>© 2025 RepoMirror | Crafted with AI</div>
            <div className="flex gap-4">
              {["Privacy", "Terms", "Security"].map((link, i) => (
                <motion.button
                  key={i}
                  whileHover={{ color: "#00f0ff" }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {link}
                  {i < 2 && <span className="ml-2">•</span>}
                </motion.button>
              ))}
            </div>
            <div className="text-gray-600">⚡ Deployed 3m ago</div>
          </div>
        </motion.div>
      </div>

      {/* SCROLL TO TOP BUTTON */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full z-40 flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #00f0ff, #b537f2)",
          boxShadow: "0 0 30px rgba(0, 240, 255, 0.3)",
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 50px rgba(0, 240, 255, 0.5)",
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
          ↑
        </motion.div>
      </motion.button>
    </footer>
  )
}
