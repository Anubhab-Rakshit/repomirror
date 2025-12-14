import { type NextRequest, NextResponse } from "next/server"
import { fetchRepositoryMetrics } from "@/lib/github-api"
import { analysisEngine } from "@/lib/analysis-engine"

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json()

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 })
    }

    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
    }

    const owner = match[1]
    const repo = match[2].replace(".git", "")

    const metrics = await fetchRepositoryMetrics(owner, repo)
    const analysis = await analysisEngine.analyze(metrics)

    const htmlContent = generatePDFHTML(metrics, analysis, owner, repo)

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="gitgrade-${owner}-${repo}.html"`,
      },
    })
  } catch (error) {
    console.error("PDF export error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate PDF" },
      { status: 500 },
    )
  }
}

function generatePDFHTML(metrics: any, analysis: any, owner: string, repo: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>GitGrade Report - ${owner}/${repo}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          color: #fff;
          padding: 40px;
          line-height: 1.6;
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: rgba(20, 20, 35, 0.95);
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 12px;
          padding: 40px;
        }
        
        .header {
          border-bottom: 2px solid rgba(0, 240, 255, 0.5);
          padding-bottom: 30px;
          margin-bottom: 30px;
        }
        
        .logo {
          font-size: 28px;
          font-weight: bold;
          background: linear-gradient(135deg, #00f0ff, #b537f2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        
        .repo-title {
          font-size: 24px;
          margin: 15px 0;
        }
        
        .repo-url {
          color: #00f0ff;
          font-size: 14px;
          font-family: monospace;
        }
        
        .section {
          margin: 30px 0;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #00f0ff;
          margin-bottom: 15px;
          border-left: 4px solid #b537f2;
          padding-left: 12px;
        }
        
        .score-display {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(0, 240, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .score-number {
          font-size: 48px;
          font-weight: bold;
          background: linear-gradient(135deg, #00f0ff, #b537f2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .score-info {
          flex: 1;
        }
        
        .score-tier {
          font-size: 18px;
          font-weight: bold;
          color: #00ff88;
          margin-bottom: 5px;
        }
        
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .metric-card {
          background: rgba(0, 240, 255, 0.05);
          border: 1px solid rgba(0, 240, 255, 0.2);
          padding: 15px;
          border-radius: 8px;
        }
        
        .metric-label {
          color: #aaa;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        
        .metric-value {
          font-size: 20px;
          font-weight: bold;
          color: #00f0ff;
        }
        
        .bar-chart {
          margin: 20px 0;
        }
        
        .bar-item {
          margin-bottom: 15px;
        }
        
        .bar-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        .bar-background {
          background: rgba(100, 100, 120, 0.2);
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #00f0ff, #b537f2);
          border-radius: 4px;
        }
        
        .summary-text {
          background: rgba(0, 240, 255, 0.05);
          padding: 15px;
          border-left: 3px solid #b537f2;
          border-radius: 4px;
          color: #ddd;
          line-height: 1.8;
        }
        
        .recommendation-list {
          list-style: none;
        }
        
        .recommendation-list li {
          padding: 10px 0;
          padding-left: 25px;
          position: relative;
          color: #ddd;
        }
        
        .recommendation-list li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #00f0ff;
          font-weight: bold;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 240, 255, 0.2);
          text-align: center;
          color: #888;
          font-size: 12px;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .container {
            border: none;
            background: white;
            color: #000;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">GitGrade</div>
          <div class="repo-title">${owner}/${repo}</div>
          <div class="repo-url">https://github.com/${owner}/${repo}</div>
          <div style="color: #888; font-size: 12px; margin-top: 10px;">
            Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Repository Score</div>
          <div class="score-display">
            <div class="score-number">${Math.round(analysis.score)}</div>
            <div class="score-info">
              <div class="score-tier">${analysis.tier}</div>
              <div style="color: #aaa; font-size: 14px;">Overall repository quality assessment</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Repository Metrics</div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-label">Stars</div>
              <div class="metric-value">${metrics.stars || 0}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Forks</div>
              <div class="metric-value">${metrics.forks || 0}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Contributors</div>
              <div class="metric-value">${metrics.contributors?.length || 0}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Language</div>
              <div class="metric-value" style="font-size: 14px;">${Object.keys(metrics.languages || {})[0] || "Unknown"}</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Dimension Breakdown</div>
          <div class="bar-chart">
            ${analysis.dimensions
              .map(
                (dim: any) => `
              <div class="bar-item">
                <div class="bar-label">
                  <span>${dim.name}</span>
                  <span>${Math.round(dim.score)}/100</span>
                </div>
                <div class="bar-background">
                  <div class="bar-fill" style="width: ${Math.round(dim.score)}%"></div>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">AI Analysis Summary</div>
          <div class="summary-text">
            ${(analysis.summary || "No summary available").replace(/\n/g, "<br/>")}
          </div>
        </div>
        
        <div class="footer">
          <p>GitGrade - AI-Powered Repository Analysis</p>
          <p>Report generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `
}
