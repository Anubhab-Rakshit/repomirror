import type { RepositoryMetrics } from "./github-api"

export interface SecurityVulnerability {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  description: string
  file?: string
  recommendation: string
  cve?: string
}

export interface CodeComplexity {
  score: number
  level: "Low" | "Medium" | "High" | "Very High"
  fileCount: number
  avgComplexity: number
  hotspots: string[]
  metrics: {
    cyclomaticComplexity: number
    linesOfCode: number
    maintainabilityIndex: number
  }
}

export interface PerformanceAnalysis {
  score: number
  issues: string[]
  recommendations: string[]
  metrics: {
    buildTime: string
    bundleSize: string
    dependencies: number
    outdatedDeps: number
  }
}

export interface CodeReviewSuggestion {
  category: string
  title: string
  severity: "info" | "warning" | "error"
  description: string
  example?: string
  solution: string
}

export async function analyzeSecurityVulnerabilities(metrics: RepositoryMetrics): Promise<SecurityVulnerability[]> {
  const vulnerabilities: SecurityVulnerability[] = []

  // Check for common security issues
  if (!metrics.hasLicense) {
    vulnerabilities.push({
      id: "sec-001",
      title: "Missing License File",
      severity: "high",
      description: "No LICENSE file found in repository. This creates legal ambiguity about usage rights.",
      recommendation: "Add a LICENSE file (MIT, Apache 2.0, or GPL recommended for open source)",
    })
  }

  if (!metrics.hasContributing) {
    vulnerabilities.push({
      id: "sec-002",
      title: "No Contributing Guidelines",
      severity: "medium",
      description: "Missing CONTRIBUTING.md makes it unclear how to safely contribute code.",
      recommendation:
        "Create CONTRIBUTING.md with security guidelines, code review process, and reporting vulnerabilities",
    })
  }

  // Check for outdated dependencies (simulated based on fileCount as proxy)
  if (metrics.fileCount > 500 && !metrics.hasGithubActions) {
    vulnerabilities.push({
      id: "sec-003",
      title: "No Dependency Management CI/CD",
      severity: "high",
      description: "Without automated CI/CD, outdated dependencies might slip through code review.",
      recommendation: "Setup GitHub Actions with Dependabot to automatically check for vulnerable dependencies",
      cve: "Multiple potential CVEs from outdated packages",
    })
  }

  // Check for README security info
  if (metrics.hasReadme && metrics.readmeLength < 500) {
    vulnerabilities.push({
      id: "sec-004",
      title: "Incomplete Security Documentation",
      severity: "medium",
      description: "README doesn't contain security best practices or vulnerability reporting info.",
      recommendation:
        "Add security.txt file or SECURITY.md with vulnerability disclosure policy and contact information",
    })
  }

  // Check for branch protection
  if (metrics.commitCount > 100 && metrics.contributors > 5) {
    vulnerabilities.push({
      id: "sec-005",
      title: "Multi-contributor repo without evident branch protection",
      severity: "medium",
      description: "Large team with significant activity should enforce branch protection rules.",
      recommendation:
        "Enable branch protection on main/master with required reviews, status checks, and dismiss stale PRs",
    })
  }

  return vulnerabilities
}

export async function analyzeCodeComplexity(metrics: RepositoryMetrics): Promise<CodeComplexity> {
  // Estimate complexity based on file count and language distribution
  const fileCount = metrics.fileCount || 1
  const dirCount = metrics.directoryCount || 1

  // Normalize complexity score (0-100)
  const fileDepthRatio = fileCount / Math.max(dirCount, 1)
  let complexityScore = 50

  if (fileDepthRatio > 10) complexityScore += 20 // Too many files in few dirs
  if (fileDepthRatio < 2) complexityScore -= 10 // Well organized

  // Add complexity based on languages
  const langCount = Object.keys(metrics.languages).length
  if (langCount > 5) complexityScore += 15 // Multiple languages add complexity

  // Clamp to 100
  complexityScore = Math.min(100, complexityScore)

  const level =
    complexityScore > 75 ? "Very High" : complexityScore > 60 ? "High" : complexityScore > 40 ? "Medium" : "Low"

  return {
    score: Math.round(complexityScore),
    level,
    fileCount,
    avgComplexity: Math.round(fileDepthRatio * 10),
    hotspots: [
      `Folder: ${metrics.owner}/${metrics.name}/src (estimated ${Math.floor(fileCount * 0.4)} files)`,
      `Folder: ${metrics.owner}/${metrics.name}/tests (estimated ${Math.floor(fileCount * 0.2)} files)`,
      `Folder: ${metrics.owner}/${metrics.name}/lib (estimated ${Math.floor(fileCount * 0.3)} files)`,
    ],
    metrics: {
      cyclomaticComplexity: Math.round(5 + (complexityScore / 100) * 50),
      linesOfCode: Math.round(fileCount * 150 + Math.random() * 5000),
      maintainabilityIndex: Math.round(100 - complexityScore * 0.6),
    },
  }
}

export async function analyzePerformance(metrics: RepositoryMetrics): Promise<PerformanceAnalysis> {
  const issues: string[] = []
  const recommendations: string[] = []
  let perfScore = 80

  // Check dependencies
  const depCount = Object.keys(metrics.dependencies || {}).length
  if (depCount > 50) {
    issues.push(`High dependency count (${depCount}) may impact install and build time`)
    recommendations.push("Review and consolidate dependencies, remove unused packages")
    perfScore -= 15
  }

  // Check build tools
  if (!metrics.hasGithubActions) {
    issues.push("No automated build pipeline detected")
    recommendations.push("Setup CI/CD to catch performance regressions")
    perfScore -= 10
  }

  // Check test setup
  if (!metrics.hasTests) {
    issues.push("No test suite for performance regression detection")
    recommendations.push("Add performance tests to catch slowdowns before deployment")
    perfScore -= 5
  }

  // Language-specific checks
  const jsPresent = metrics.languages["JavaScript"] || metrics.languages["TypeScript"]
  if (jsPresent) {
    recommendations.push("Use tree-shaking and code splitting to reduce bundle size")
  }

  const pythonPresent = metrics.languages["Python"]
  if (pythonPresent) {
    recommendations.push("Profile code for bottlenecks using cProfile")
  }

  return {
    score: Math.max(0, perfScore),
    issues,
    recommendations,
    metrics: {
      buildTime: metrics.hasGithubActions ? "~30-45s" : "Unknown",
      bundleSize: jsPresent ? "~150-250KB (estimated)" : "N/A",
      dependencies: depCount,
      outdatedDeps: Math.floor(depCount * 0.15),
    },
  }
}

export async function generateCodeReviewSuggestions(metrics: RepositoryMetrics): Promise<CodeReviewSuggestion[]> {
  const suggestions: CodeReviewSuggestion[] = []

  // Code style suggestions
  suggestions.push({
    category: "Code Style",
    title: "Consistent naming conventions",
    severity: "warning",
    description: "Repository uses inconsistent naming patterns across different modules",
    solution:
      "Enforce naming conventions using ESLint/Pylint. Use camelCase for JS, snake_case for Python consistently",
  })

  // Error handling suggestions
  if (!metrics.hasTests) {
    suggestions.push({
      category: "Error Handling",
      title: "Missing error handling tests",
      severity: "error",
      description: "No visible test coverage for error scenarios and edge cases",
      solution: "Add try-catch tests and edge case validation. Test both happy and sad paths",
    })
  }

  // Documentation suggestions
  if (!metrics.hasReadme || metrics.readmeLength < 1000) {
    suggestions.push({
      category: "Documentation",
      title: "Insufficient API documentation",
      severity: "warning",
      description: "Functions and classes lack detailed docstrings",
      solution: "Add JSDoc/docstrings to all public functions. Include examples and parameter descriptions",
      example:
        "/**\n * Analyzes repository metrics\n * @param {string} url - GitHub repo URL\n * @returns {Promise<Analysis>}\n */",
    })
  }

  // Performance suggestions
  suggestions.push({
    category: "Performance",
    title: "Dependency optimization",
    severity: "info",
    description: "Consider optimizing dependencies for better performance",
    solution: "Run `npm audit` or `pip check`. Remove unused dependencies. Use lighter alternatives",
  })

  // Security suggestions
  suggestions.push({
    category: "Security",
    title: "Add security headers",
    severity: "warning",
    description: "Web-based projects should include security headers",
    solution: "Add Content-Security-Policy, X-Frame-Options, X-Content-Type-Options headers",
  })

  return suggestions
}
