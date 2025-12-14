/**
 * GitHub API utilities for fetching repository data
 * Collects comprehensive metrics about repositories for analysis
 */

interface GitHubResponse {
  data?: any
  message?: string
}

// Types for repository data
export interface RepositoryMetrics {
  // Basic info
  id: number
  name: string
  owner: string
  description: string
  url: string
  createdAt: string
  updatedAt: string
  pushedAt: string

  // Size and structure
  stars: number
  forks: number
  watchers: number
  issuesOpen: number
  language: string
  languages: Record<string, number>
  size: number

  // Code metrics
  hasWiki: boolean
  hasIssues: boolean
  hasDiscussions: boolean
  hasPages: boolean
  hasDownloads: boolean
  archived: boolean
  disabled: boolean
  private: boolean

  // Files and structure
  fileCount: number
  directoryCount: number
  mainBranch: string
  defaultBranch: string
  branches: number
  contributors: number
  filesByType: Record<string, number>
  configFiles: string[]

  // Documentation
  hasReadme: boolean
  hasLicense: boolean
  hasChangelog: boolean
  hasContributing: boolean
  topics: string[]

  // Tests
  hasTests: boolean
  testFiles: number
  testFrameworks: string[]

  // CI/CD
  hasGithubActions: boolean
  hasWorkflows: number
  prsMerged: number
  prAverageReviewHours: number

  // Dependencies
  dependenciesTotal: number
  dependenciesOutdated: number
  frameworks: string[]

  // Commits
  commitCount: number
  latestCommitDate: string
  latestCommitMessage: string
  commitsLastWeek: number
  commitsLastMonth: number
}

class GitHubAPI {
  private baseUrl = "https://api.github.com"
  private token = process.env.GITHUB_TOKEN

  /**
   * Get repository basic information
   */
  async getRepository(owner: string, repo: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching repository:", error)
      throw error
    }
  }

  /**
   * Get repository languages
   */
  async getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/languages`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return {}
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching languages:", error)
      return {}
    }
  }

  /**
   * Get commit statistics
   */
  async getCommitStats(owner: string, repo: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/commits?per_page=1&sort=committer-date`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return { count: 0, latest: null }
      }

      const commits = await response.json()
      return {
        count: commits.length > 0 ? commits[0]?.commit?.committer?.date : null,
        latest: commits[0] || null,
      }
    } catch (error) {
      console.error("Error fetching commits:", error)
      return { count: 0, latest: null }
    }
  }

  /**
   * Get repository contents (file listing)
   */
  async getDirectoryContents(owner: string, repo: string, path = ""): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contents${path ? `/${path}` : ""}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return []
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching directory contents:", error)
      return []
    }
  }

  /**
   * Get file content from repository
   */
  async getFileContent(owner: string, repo: string, path: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      if (data.encoding === "base64") {
        return Buffer.from(data.content, "base64").toString("utf-8")
      }
      return data.content
    } catch (error) {
      console.error("Error fetching file content:", error)
      return null
    }
  }

  /**
   * Get contributors information
   */
  async getContributors(owner: string, repo: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contributors?per_page=10`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return []
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching contributors:", error)
      return []
    }
  }

  /**
   * Check if file exists in repository
   */
  async fileExists(owner: string, repo: string, path: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`, {
        headers: this.getHeaders(),
      })

      return response.ok
    } catch (error) {
      return false
    }
  }

  /**
   * Get workflows (GitHub Actions)
   */
  async getWorkflows(owner: string, repo: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/actions/workflows`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.workflows || []
    } catch (error) {
      console.error("Error fetching workflows:", error)
      return []
    }
  }

  /**
   * Get repository topics
   */
  async getTopics(owner: string, repo: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/topics`, {
        headers: {
          ...this.getHeaders(),
          Accept: "application/vnd.github.mercy-preview+json",
        },
      })

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.names || []
    } catch (error) {
      console.error("Error fetching topics:", error)
      return []
    }
  }

  /**
   * Get repository tree with accurate file/directory counts
   */
  async getRepositoryTree(owner: string, repo: string): Promise<any> {
    try {
      // Get main branch first
      const repoData = await this.getRepository(owner, repo)
      const branch = repoData.default_branch

      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return { tree: [], truncated: false }
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching repository tree:", error)
      return { tree: [], truncated: false }
    }
  }

  /**
   * Analyze file structure and get accurate counts
   */
  async analyzeFileStructure(
    owner: string,
    repo: string,
  ): Promise<{
    fileCount: number
    directoryCount: number
    filesByType: Record<string, number>
    testFiles: number
    configFiles: string[]
  }> {
    try {
      const tree = await this.getRepositoryTree(owner, repo)

      if (!tree.tree || tree.tree.length === 0) {
        return {
          fileCount: 0,
          directoryCount: 0,
          filesByType: {},
          testFiles: 0,
          configFiles: [],
        }
      }

      let fileCount = 0
      let directoryCount = 0
      const filesByType: Record<string, number> = {}
      let testFiles = 0
      const configFiles: string[] = []

      const testPatterns = /\.(test|spec)\.(js|ts|jsx|tsx|py|java|go|rb)$/i
      const configPatterns =
        /^(\.?)(dockerfile|docker-compose|\.env|package\.json|\.github|pyproject\.toml|setup\.py|Cargo\.toml|go\.mod|pom\.xml)$/i

      tree.tree.forEach((item: any) => {
        if (item.type === "tree") {
          directoryCount++
        } else if (item.type === "blob") {
          fileCount++

          const ext = item.path.split(".").pop() || "unknown"
          filesByType[ext] = (filesByType[ext] || 0) + 1

          if (testPatterns.test(item.path)) {
            testFiles++
          }

          if (configPatterns.test(item.path)) {
            configFiles.push(item.path)
          }
        }
      })

      return {
        fileCount,
        directoryCount,
        filesByType,
        testFiles,
        configFiles,
      }
    } catch (error) {
      console.error("Error analyzing file structure:", error)
      return {
        fileCount: 0,
        directoryCount: 0,
        filesByType: {},
        testFiles: 0,
        configFiles: [],
      }
    }
  }

  /**
   * Get branch information
   */
  async getBranches(owner: string, repo: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/branches?per_page=100`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return []
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching branches:", error)
      return []
    }
  }

  /**
   * Get pull request statistics
   */
  async getPullRequestStats(owner: string, repo: string): Promise<any> {
    try {
      // Get merged PRs
      const response = await fetch(
        `${this.baseUrl}/repos/${owner}/${repo}/pulls?state=closed&per_page=100&sort=updated`,
        {
          headers: this.getHeaders(),
        },
      )

      if (!response.ok) {
        return { merged: 0, average_review_time: 0 }
      }

      const prs = await response.json()

      let totalReviewTime = 0
      let reviewCount = 0

      prs.forEach((pr: any) => {
        if (pr.merged_at && pr.created_at) {
          const reviewTime = new Date(pr.merged_at).getTime() - new Date(pr.created_at).getTime()
          totalReviewTime += reviewTime
          reviewCount++
        }
      })

      return {
        merged: prs.length,
        average_review_time: reviewCount > 0 ? totalReviewTime / reviewCount / (1000 * 60 * 60) : 0,
      }
    } catch (error) {
      console.error("Error fetching PR stats:", error)
      return { merged: 0, average_review_time: 0 }
    }
  }

  /**
   * Analyze package.json and detect dependencies
   */
  async analyzeDependencies(
    owner: string,
    repo: string,
  ): Promise<{
    outdated: number
    vulnerable: number
    total: number
    frameworks: string[]
  }> {
    try {
      const packageJson = await this.getFileContent(owner, repo, "package.json")

      if (!packageJson) {
        return { outdated: 0, vulnerable: 0, total: 0, frameworks: [] }
      }

      const parsed = JSON.parse(packageJson)
      const allDeps = {
        ...parsed.dependencies,
        ...parsed.devDependencies,
      }

      const frameworks: string[] = []
      const knownFrameworks = {
        react: "React",
        vue: "Vue",
        angular: "Angular",
        express: "Express",
        fastapi: "FastAPI",
        django: "Django",
        nextjs: "Next.js",
      }

      Object.keys(allDeps).forEach((dep) => {
        Object.entries(knownFrameworks).forEach(([key, name]) => {
          if (dep.includes(key)) {
            frameworks.push(name)
          }
        })
      })

      return {
        total: Object.keys(allDeps).length,
        outdated: 0, // Would need npm API for actual data
        vulnerable: 0, // Would need security API
        frameworks: [...new Set(frameworks)],
      }
    } catch (error) {
      console.error("Error analyzing dependencies:", error)
      return { outdated: 0, vulnerable: 0, total: 0, frameworks: [] }
    }
  }

  /**
   * Get commit activity pattern
   */
  async getCommitActivity(
    owner: string,
    repo: string,
  ): Promise<{
    last_week: number
    last_month: number
    last_year: number
  }> {
    try {
      const since = new Date()
      since.setFullYear(since.getFullYear() - 1)

      const activityResponse = await fetch(
        `${this.baseUrl}/repos/${owner}/${repo}/commits?since=${since.toISOString()}&per_page=100`,
        {
          headers: this.getHeaders(),
        },
      )

      if (!activityResponse.ok) {
        return { last_week: 0, last_month: 0, last_year: 0 }
      }

      const commits = await activityResponse.json()

      const now = Date.now()
      const week = 7 * 24 * 60 * 60 * 1000
      const month = 30 * 24 * 60 * 60 * 1000

      let lastWeek = 0
      let lastMonth = 0
      let lastYear = 0

      commits.forEach((commit: any) => {
        const commitTime = new Date(commit.commit.author.date).getTime()
        const diff = now - commitTime

        if (diff < week) lastWeek++
        if (diff < month) lastMonth++
        if (diff < 365 * 24 * 60 * 60 * 1000) lastYear++
      })

      return { last_week: lastWeek, last_month: lastMonth, last_year: lastYear }
    } catch (error) {
      console.error("Error fetching commit activity:", error)
      return { last_week: 0, last_month: 0, last_year: 0 }
    }
  }

  /**
   * Build complete metrics object from all API calls
   */
  async getCompleteMetrics(owner: string, repo: string): Promise<RepositoryMetrics> {
    try {
      const [
        repoData,
        languages,
        contributors,
        workflows,
        topics,
        branches,
        fileStructure,
        prStats,
        dependencies,
        commitActivity,
      ] = await Promise.all([
        this.getRepository(owner, repo),
        this.getLanguages(owner, repo),
        this.getContributors(owner, repo),
        this.getWorkflows(owner, repo),
        this.getTopics(owner, repo),
        this.getBranches(owner, repo),
        this.analyzeFileStructure(owner, repo),
        this.getPullRequestStats(owner, repo),
        this.analyzeDependencies(owner, repo),
        this.getCommitActivity(owner, repo),
      ])

      // Check for common files
      const [hasReadme, hasLicense, hasChangelog, hasContributing, hasTests] = await Promise.all([
        this.fileExists(owner, repo, "README.md"),
        this.fileExists(owner, repo, "LICENSE"),
        this.fileExists(owner, repo, "CHANGELOG.md"),
        this.fileExists(owner, repo, "CONTRIBUTING.md"),
        this.fileExists(owner, repo, "test"),
      ])

      // Get commit count (approx)
      const commitStats = await this.getCommitStats(owner, repo)

      const metrics: RepositoryMetrics = {
        id: repoData.id,
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description || "",
        url: repoData.html_url,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        pushedAt: repoData.pushed_at,

        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        issuesOpen: repoData.open_issues_count,
        language: repoData.language || "Unknown",
        languages,
        size: repoData.size,

        hasWiki: repoData.has_wiki,
        hasIssues: repoData.has_issues,
        hasDiscussions: repoData.has_discussions,
        hasPages: repoData.has_pages,
        hasDownloads: repoData.has_downloads,
        archived: repoData.archived,
        disabled: repoData.disabled,
        private: repoData.private,

        fileCount: fileStructure.fileCount,
        directoryCount: fileStructure.directoryCount,
        mainBranch: repoData.default_branch,
        defaultBranch: repoData.default_branch,
        branches: branches.length,
        contributors: contributors.length,
        filesByType: fileStructure.filesByType,
        configFiles: fileStructure.configFiles,

        hasReadme,
        hasLicense,
        hasChangelog,
        hasContributing,
        topics,

        hasTests,
        testFiles: fileStructure.testFiles,
        testFrameworks: this.detectTestFrameworks(fileStructure.filesByType),

        hasGithubActions: workflows.length > 0,
        hasWorkflows: workflows.length,
        prsMerged: prStats.merged,
        prAverageReviewHours: Math.round(prStats.average_review_time * 10) / 10,
        dependenciesTotal: dependencies.total,
        dependenciesOutdated: dependencies.outdated,
        frameworks: dependencies.frameworks,
        commitCount: commitStats.count || 0,
        latestCommitDate: commitStats.latest?.commit?.author?.date || "",
        latestCommitMessage: commitStats.latest?.commit?.message || "",
        commitsLastWeek: commitActivity.last_week,
        commitsLastMonth: commitActivity.last_month,
      }

      return metrics
    } catch (error) {
      console.error("Error getting complete metrics:", error)
      throw error
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    }

    if (this.token) {
      headers.Authorization = `token ${this.token}`
    }

    return headers
  }

  private detectTestFrameworks(filesByType: Record<string, number>): string[] {
    const frameworks: string[] = []

    // Detect based on file extensions and common patterns
    if (filesByType["test"] || filesByType["spec"]) {
      frameworks.push("Jest/Vitest")
    }
    if (filesByType["py"]) {
      frameworks.push("pytest/unittest")
    }
    if (filesByType["go"]) {
      frameworks.push("testing")
    }

    return frameworks
  }
}

export const githubAPI = new GitHubAPI()

export async function fetchRepositoryMetrics(owner: string, repo: string): Promise<RepositoryMetrics> {
  return githubAPI.getCompleteMetrics(owner, repo)
}
