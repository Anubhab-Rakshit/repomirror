"use client"

import type React from "react"
import RepoMirrorLogo from "@/components/logo"
import { Menu, X } from "lucide-react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState("home")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Home", href: "/", id: "home" },
    { label: "Features", href: "/features", id: "features" },
    { label: "Pricing", href: "#pricing", id: "pricing" },
    { label: "Docs", href: "/docs", id: "docs" },
  ]

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <>
      {/* FLOATING PILL NAVBAR */}
      <motion.div
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${isScrolled ? "top-2 right-2" : ""}`}
      >
        {/* OUTER GLOW */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 opacity-20 blur-2xl" />

        {/* MAIN PILL CONTAINER */}
        <motion.div
          className="relative flex items-center gap-4 px-6 py-3 rounded-full"
          style={{
            background: "rgba(10, 10, 10, 0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(0, 240, 255, 0.3)",
            boxShadow: `
              0 0 30px rgba(0, 240, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
          }}
          whileHover={{
            boxShadow: `0 0 50px rgba(0, 240, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
          }}
        >
          {/* LOGO ICON */}
          <motion.div
            className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <RepoMirrorLogo size="sm" animated={false} className="w-4 h-4" />
          </motion.div>

          {/* NAV LINKS - Hidden on mobile, visible on md+ */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, idx) => (
              <motion.div key={item.id} className="relative">
                <Link
                  href={item.href}
                  onClick={() => setActiveLink(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeLink === item.id ? "text-white" : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {item.label}
                </Link>

                {activeLink === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA BUTTON */}
          <motion.div className="relative overflow-hidden rounded-full" whileHover={{ scale: 1.05 }}>
            <motion.button
              className="relative px-4 py-2 text-xs font-bold text-white rounded-full hidden sm:block"
              style={{
                background: "linear-gradient(135deg, #00f0ff, #b537f2, #ff006e)",
                backgroundSize: "200% 200%",
              }}
              whileHover={{
                backgroundPosition: "200% 0",
              }}
              transition={{ duration: 0.6 }}
            >
              Try Now
            </motion.button>
          </motion.div>

          {/* MOBILE MENU TOGGLE */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-cyan-500/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4 text-cyan-400" />}
          </motion.button>

          {/* FLOATING PARTICLES */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + i,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ))}
        </motion.div>

        {/* MOBILE MENU */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-full right-0 mt-2 ${isMobileMenuOpen ? "block" : "hidden"}`}
        >
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(10, 10, 10, 0.9)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(0, 240, 255, 0.3)",
              minWidth: "200px",
            }}
          >
            {navItems.map((item) => (
              <motion.div key={item.id} whileHover={{ x: 4 }}>
                <Link
                  href={item.href}
                  onClick={() => {
                    setActiveLink(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeLink === item.id
                      ? "text-cyan-400 bg-cyan-500/10"
                      : "text-gray-400 hover:text-white hover:bg-gray-900/50"
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* SCROLL PROGRESS INDICATOR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 z-40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isScrolled ? 0.3 : 0 }}
        origin="left"
        transition={{ duration: 0.3 }}
      />
    </>
  )
}
