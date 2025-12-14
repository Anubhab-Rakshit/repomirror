"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Github, Code2, Zap } from "lucide-react"

interface HeroProps {
  onGetStarted: () => void
}

export default function Hero({ onGetStarted }: HeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [displayText, setDisplayText] = useState("")
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; id: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const exampleRepoUrl = "https://github.com/username/repo"
  const trailIdRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })

        setMouseTrail((prev) => {
          const newTrail = [
            ...prev.slice(-20),
            {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
              id: trailIdRef.current++,
            },
          ]
          return newTrail
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= exampleRepoUrl.length) {
        setDisplayText(exampleRepoUrl.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const lineDotVariants = {
    animate: {
      offsetDistance: ["0%", "100%"],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  }

  const statsData = [
    {
      label: "10,000+",
      description: "REPOS ANALYZED",
      size: "large",
      rotation: -5,
      icon: Github,
    },
    {
      label: "95%",
      description: "ACCURACY",
      size: "medium",
      rotation: 8,
      icon: Zap,
    },
    {
      label: "< 30s",
      description: "INSTANT",
      size: "small",
      rotation: -3,
      icon: Code2,
    },
  ]

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
    >
      {/* Diagonal section divider */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,240,255,0.3)" />
            <stop offset="50%" stopColor="rgba(181,55,242,0.3)" />
            <stop offset="100%" stopColor="rgba(255,0,110,0.3)" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Diagonal connecting line with animated dots */}
        <motion.line
          x1="100"
          y1="50"
          x2="1100"
          y2="750"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Animated dots along the line */}
        <motion.circle cx="100" cy="50" r="6" fill="rgba(0,240,255,0.6)" variants={lineDotVariants} animate="animate" />
        <motion.circle
          cx="100"
          cy="50"
          r="4"
          fill="rgba(0,240,255,0.3)"
          variants={lineDotVariants}
          animate="animate"
          style={{ animationDelay: "0.5s" }}
        />
      </svg>

      {mouseTrail.map((point) => (
        <motion.div
          key={point.id}
          className="fixed w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 pointer-events-none"
          style={{
            left: point.x,
            top: point.y,
            zIndex: 5,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.8 }}
        />
      ))}

      <div className="relative z-10 w-full">
        <motion.div
          className="absolute top-20 left-0 md:left-10"
          initial={{ opacity: 0, x: -100, rotate: -5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-2"
            style={{ fontWeight: 800 }}
            animate={{
              textShadow: ["0 0 20px rgba(0,240,255,0)", "0 0 30px rgba(0,240,255,0.5)", "0 0 20px rgba(0,240,255,0)"],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            YOUR
            <br />
            CODE,
          </motion.h1>
        </motion.div>

        {/* BOTTOM-RIGHT HEADLINE */}
        <motion.div
          className="absolute bottom-40 md:bottom-32 right-0 md:right-10 text-right"
          initial={{ opacity: 0, x: 100, rotate: 5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.h1
            className="text-7xl md:text-9xl font-black leading-none tracking-tighter bg-gradient-to-b from-cyan-400 via-purple-500 to-magenta-600 bg-clip-text text-transparent"
            style={{ fontWeight: 800 }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            DECODED.
          </motion.h1>
        </motion.div>

        {/* CENTER SECTION - Input and tilted card */}
        <motion.div
          className="flex justify-center items-center min-h-screen"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full max-w-2xl">
            <motion.div
              className="iso-card mb-12 p-6 md:p-8 backdrop-blur-lg border border-cyan-500/40 rounded-2xl bg-black/30 group"
              style={{
                transform: "perspective(1200px) rotateX(5deg) rotateY(-3deg) rotateZ(-15deg)",
              }}
              whileHover={{
                transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
                boxShadow: "0 20px 60px rgba(0,240,255,0.3)",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                AI mentor that reads your repository like a senior developer would
              </p>

              {/* Animated glowing border */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{
                  boxShadow: [
                    "inset 0 0 20px rgba(0,240,255,0.2)",
                    "inset 0 0 40px rgba(181,55,242,0.3)",
                    "inset 0 0 20px rgba(0,240,255,0.2)",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>

            {/* Terminal-style input */}
            <motion.div
              className="relative mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="terminal-input scan-effect rounded-lg p-4 md:p-5 flex items-center gap-3 relative overflow-hidden group">
                <span className="text-cyan-400 text-sm md:text-base font-mono">$</span>
                <input
                  type="text"
                  value={displayText}
                  readOnly
                  placeholder="https://github.com/username/repo"
                  className="flex-1 bg-transparent outline-none text-cyan-400 font-mono text-sm md:text-base placeholder-cyan-600/50"
                />
                {displayText.length < exampleRepoUrl.length && (
                  <span className="cursor-blink text-cyan-400 text-xl">|</span>
                )}
              </div>

              {/* Holographic scan effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.2), transparent)",
                  animation: "scan-lines 2s infinite",
                }}
              />
            </motion.div>

            <motion.button
              onClick={onGetStarted}
              className="morph-btn w-full py-4 md:py-5 px-8 font-black text-lg md:text-xl tracking-wider relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #00f0ff 0%, #b537f2 100%)",
                color: "#000",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
                  transform: "translateX(-100%)",
                }}
                animate={{
                  transform: ["translateX(-100%)", "translateX(100%)"],
                }}
                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
              />
              ANALYZE
            </motion.button>

            {/* Hint text */}
            <p className="text-center text-gray-400 text-xs md:text-sm mt-4 font-mono">Press Enter or click ANALYZE</p>
          </div>
        </motion.div>

        {/* Bento-grid Stats Section with twisted cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-32 mb-20 px-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {statsData.map((stat, idx) => {
            const Icon = stat.icon
            const sizeClasses = {
              large: "md:col-span-1 md:row-span-2",
              medium: "md:col-span-1",
              small: "md:col-span-1",
            }

            return (
              <motion.div
                key={idx}
                className={`iso-card rounded-2xl p-6 md:p-8 border border-cyan-500/30 backdrop-blur-sm bg-black/20 overflow-hidden group hover:border-purple-500/60 transition-all duration-300 ${sizeClasses[stat.size as keyof typeof sizeClasses]}`}
                style={{
                  transform: `perspective(1000px) rotateX(3deg) rotateY(${-stat.rotation}deg) rotateZ(${stat.rotation}deg)`,
                }}
                whileHover={{
                  transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
                  boxShadow: "0 20px 50px rgba(0,240,255,0.2)",
                }}
                transition={{ duration: 0.4 }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                />

                <div className="relative z-10">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 mb-4 group-hover:text-purple-400 transition-colors duration-300" />

                  <motion.div
                    className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text mb-3"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 * idx }}
                    viewport={{ once: true }}
                  >
                    {stat.label}
                  </motion.div>

                  <p className="text-gray-400 text-xs md:text-sm font-black tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                    {stat.description}
                  </p>
                </div>

                {/* Moving diagonal lines background */}
                <motion.div
                  className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  style={{
                    background:
                      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,240,255,0.03) 10px, rgba(0,240,255,0.03) 20px)",
                  }}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Floating language/tech icons in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { icon: "🐍", top: "15%", left: "5%", delay: 0 },
            { icon: "⚛️", top: "20%", right: "8%", delay: 0.5 },
            { icon: "🦀", top: "60%", left: "10%", delay: 1 },
            { icon: "💎", top: "65%", right: "5%", delay: 0.3 },
            { icon: "🐹", top: "40%", left: "3%", delay: 0.8 },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="absolute text-4xl md:text-5xl opacity-20 filter blur-md"
              style={{ top: item.top, left: item.left || "auto", right: item.right || "auto" }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                delay: item.delay,
              }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
