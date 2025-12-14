# RepoMirror

The ultimate AI-powered repository analysis and code quality assessment platform.

**Live Demo:** https://repomirror-indol.vercel.app/

---

## Overview

RepoMirror is an intelligent repository analyzer that provides deep insights into your GitHub projects. Using advanced AI analysis powered by Google Gemini, it evaluates code quality, security, complexity, and provides actionable recommendations to help developers improve their codebases.

Unlike traditional code quality tools, RepoMirror offers:
- AI-generated insights that understand context and best practices
- Comprehensive security vulnerability detection
- Code complexity and maintainability analysis
- Smart performance profiling suggestions
- Professional PDF report generation
- Repository comparison and leaderboards

---

## Key Features

### Core Analysis
- **Repository Scoring** - Comprehensive scoring system (0-100) evaluating code quality, documentation, testing, and git practices
- **Dimension Breakdown** - Detailed metrics for Code Quality, Documentation, Testing, Git Practices, and Community Engagement
- **AI Analysis Summary** - Intelligent summaries powered by Google Gemini API understanding your repository's strengths and weaknesses

### Advanced Features
- **Security Analysis** - Detects missing security practices, vulnerability risks, and provides remediation guidance
- **Code Complexity Analysis** - Estimates cyclomatic complexity, maintainability index, and identifies complexity hotspots
- **Performance Profiling** - Analyzes bundle size, dependency bloat, and performance bottlenecks with optimization suggestions
- **Code Review Suggestions** - AI-powered recommendations across code style, error handling, documentation, and performance

### Additional Tools
- **Repository Comparison** - Compare multiple repositories side-by-side with detailed metrics
- **Leaderboard** - Discover top repositories ranked by quality score, stars, and community engagement
- **PDF Export** - Generate professional analysis reports with all metrics and insights
- **Development Roadmap** - Structured improvement plan with prioritized tasks to reach Expert level

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI**: React 19 with Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **API**: Next.js Route Handlers
- **AI**: Google Generative AI (Gemini API)
- **Data Source**: GitHub API (REST)
- **Caching**: In-memory cache with 24-hour TTL
- **Rate Limiting**: 3 requests per minute to prevent quota exhaustion

### DevOps
- **Hosting**: Vercel
- **Database**: In-memory storage (extensible to Supabase)
- **Version Control**: Git

---

## How It Works

1. **Enter Repository URL** - Paste your GitHub repository URL (owner/repo format)
2. **Analyze** - RepoMirror fetches repository data and runs comprehensive analysis
3. **View Results** - Get detailed metrics, AI insights, and actionable recommendations
4. **Compare & Export** - Compare with other repos and export professional reports

### Analysis Metrics

- **Code Quality (0-100)**: Organization, structure, and consistency
- **Documentation (0-100)**: README, guides, and inline documentation
- **Testing (0-100)**: Test coverage and automation setup
- **Git Practices (0-100)**: Branching, commits, and PR patterns
- **Community (0-100)**: Engagement, contributors, and issue management
- **Overall Score**: Weighted average of all dimensions

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- GitHub Token (for API access)
- Google Gemini API Key

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/repomirror.git
cd repomirror

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your API keys
# GITHUB_TOKEN=your_github_token
# GEMINI_API_KEY=your_gemini_api_key

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

### Environment Variables

\`\`\`env
# GitHub API Authentication
GITHUB_TOKEN=your_github_personal_access_token

# Google Generative AI
GEMINI_API_KEY=your_google_gemini_api_key

# Optional: Custom domain for redirects
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

---

## Features in Detail

### Repository Scoring System
RepoMirror evaluates repositories across five key dimensions:

1. **Code Quality** - Evaluates repository structure, code organization, consistency, and adherence to best practices
2. **Documentation** - Checks for comprehensive README, API docs, guides, and inline comments
3. **Testing** - Assesses test coverage, test automation, and CI/CD pipeline maturity
4. **Git Practices** - Reviews branching strategy, commit messages, pull request patterns, and code review process
5. **Community** - Evaluates contributor growth, community guidelines, issue management, and engagement

Each dimension is scored 0-100, and the overall score is a weighted average designed to guide developers toward production-ready repositories.

### AI-Powered Insights
Using Google Gemini API, RepoMirror generates contextual analysis that:
- Identifies patterns in your codebase
- Recommends specific improvements
- Highlights strengths to build upon
- Suggests industry best practices

### Security Analysis
Detects critical issues including:
- Missing LICENSE file
- Absent CONTRIBUTING guidelines
- No CI/CD workflow automation
- Unprotected main branches
- Outdated dependencies with vulnerabilities

### Performance Profiling
Analyzes:
- Build and bundle sizes
- Dependency tree optimization
- Package maintenance status
- Language-specific performance patterns

---

## Roadmap

- User accounts and analysis history
- GitHub Actions integration for auto-analysis
- Slack notifications for analysis results
- VS Code extension for inline analysis
- CLI tool for terminal-based analysis
- Custom scoring rules and weights
- Team collaboration features
- Historical trend tracking
- Real-time webhook-based analysis

---

## API Reference

### POST /api/analyze
Analyzes a GitHub repository and returns comprehensive metrics.

**Request:**
\`\`\`json
{
  "owner": "facebook",
  "repo": "react"
}
\`\`\`

**Response:**
\`\`\`json
{
  "score": 85,
  "dimensions": {
    "codeQuality": 85,
    "documentation": 80,
    "testing": 75,
    "gitPractices": 90,
    "community": 85
  },
  "aiSummary": "...",
  "security": [...],
  "complexity": {...},
  "roadmap": [...]
}
\`\`\`

### GET /leaderboard
Fetches top repositories ranked by various metrics.

### POST /api/export-pdf
Generates a professional PDF report of an analysis.

---

## Performance

- Analysis time: 2-5 seconds per repository
- Caching: 24-hour cache for repeated analyses
- Rate limiting: 3 requests per minute (Gemini free tier)
- Zero database dependency for scalability

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Troubleshooting

### "API Quota Exceeded"
The Gemini free tier has rate limits. Use cached results or wait before analyzing another repository.

### "404 Repository Not Found"
Ensure the repository is public and the URL format is correct (owner/repo).

### GitHub API Rate Limit
Free tier has 60 requests/hour. Use a GitHub personal access token to increase to 5000/hour.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see LICENSE file for details

---

## Author

Created with focus on developer experience and actionable insights.

---

## Support

- GitHub Issues: Report bugs and request features
- Documentation: Full guides at https://repomirror-indol.vercel.app/docs
- Email: support@repomirror.dev

---

## Acknowledgments

- Google Generative AI for powerful analysis capabilities
- GitHub API for repository data
- Open source community for amazing tools and libraries

---

**Made with by the RepoMirror Team**
