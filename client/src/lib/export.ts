import type { Analysis } from './api';

export interface ExportData {
  niche: string;
  keyword: string;
  overallScore: number;
  competitionScore: number;
  profitabilityScore: number;
  channelCount: number | null;
  createdAt: string;
}

/**
 * Convert analysis data to CSV format
 */
export function analysesToCSV(analyses: Analysis[]): string {
  const headers = [
    'Niche',
    'Keyword',
    'Overall Score',
    'Competition Score',
    'Profitability Score',
    'Channel Count',
    'Created At'
  ];

  const rows = analyses.map((analysis) => [
    analysis.niche?.name ?? 'Unknown',
    analysis.keyword?.term ?? 'N/A',
    analysis.overallScore.toString(),
    analysis.competitionScore.toString(),
    analysis.profitabilityScore.toFixed(2),
    analysis.channelCount?.toString() ?? 'N/A',
    new Date(analysis.createdAt).toISOString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Download data as CSV file
 */
export function downloadCSV(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate PDF-like HTML content for printing
 * Note: For actual PDF generation, you would typically use a library like jsPDF or html2pdf
 */
export function generatePDFContent(analyses: Analysis[]): string {
  const now = new Date().toLocaleDateString();

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Niche Analysis Report - ${now}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      color: #1a1a1a;
    }
    h1 {
      font-size: 24px;
      border-bottom: 2px solid #1a1a1a;
      padding-bottom: 10px;
    }
    h2 {
      font-size: 18px;
      margin-top: 30px;
      color: #444;
    }
    .meta {
      color: #666;
      font-size: 12px;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    tr:nth-child(even) {
      background-color: #fafafa;
    }
    .score-high {
      color: #16a34a;
      font-weight: 600;
    }
    .score-medium {
      color: #ca8a04;
      font-weight: 600;
    }
    .score-low {
      color: #dc2626;
      font-weight: 600;
    }
    .summary {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .summary-item {
      text-align: center;
    }
    .summary-value {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
    }
    .summary-label {
      font-size: 12px;
      color: #666;
    }
    @media print {
      body {
        padding: 20px;
      }
      table {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <h1>Niche Analysis Report</h1>
  <p class="meta">Generated on ${now} | ${analyses.length} analyses included</p>

  <div class="summary">
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-value">${analyses.length}</div>
        <div class="summary-label">Total Analyses</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${Math.round(analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length || 0)}</div>
        <div class="summary-label">Average Score</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${analyses.filter((a) => a.overallScore >= 70).length}</div>
        <div class="summary-label">High Performers</div>
      </div>
    </div>
  </div>

  <h2>Analysis Results</h2>
  <table>
    <thead>
      <tr>
        <th>Niche</th>
        <th>Keyword</th>
        <th>Score</th>
        <th>Competition</th>
        <th>Profitability</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      ${analyses
        .map(
          (analysis) => `
        <tr>
          <td>${analysis.niche?.name ?? 'Unknown'}</td>
          <td>${analysis.keyword?.term ?? 'N/A'}</td>
          <td class="${analysis.overallScore >= 70 ? 'score-high' : analysis.overallScore >= 40 ? 'score-medium' : 'score-low'}">${analysis.overallScore}</td>
          <td>${analysis.competitionScore}</td>
          <td>$${analysis.profitabilityScore.toFixed(2)}</td>
          <td>${new Date(analysis.createdAt).toLocaleDateString()}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>Score Distribution</h2>
  <table>
    <thead>
      <tr>
        <th>Score Range</th>
        <th>Count</th>
        <th>Percentage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="score-high">70-100 (High)</td>
        <td>${analyses.filter((a) => a.overallScore >= 70).length}</td>
        <td>${Math.round((analyses.filter((a) => a.overallScore >= 70).length / analyses.length) * 100 || 0)}%</td>
      </tr>
      <tr>
        <td class="score-medium">40-69 (Medium)</td>
        <td>${analyses.filter((a) => a.overallScore >= 40 && a.overallScore < 70).length}</td>
        <td>${Math.round((analyses.filter((a) => a.overallScore >= 40 && a.overallScore < 70).length / analyses.length) * 100 || 0)}%</td>
      </tr>
      <tr>
        <td class="score-low">0-39 (Low)</td>
        <td>${analyses.filter((a) => a.overallScore < 40).length}</td>
        <td>${Math.round((analyses.filter((a) => a.overallScore < 40).length / analyses.length) * 100 || 0)}%</td>
      </tr>
    </tbody>
  </table>

  <p class="meta" style="margin-top: 40px; text-align: center;">
    Generated by Niche Scout | https://niche-scout.app
  </p>
</body>
</html>
  `;
}

/**
 * Open PDF content in a new window for printing/saving
 */
export function openPDFPreview(analyses: Analysis[]): void {
  const content = generatePDFContent(analyses);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    // Allow time for content to render before print dialog
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

/**
 * Export analyses in the specified format
 */
export function exportAnalyses(analyses: Analysis[], format: 'csv' | 'pdf'): void {
  if (format === 'csv') {
    const csvData = analysesToCSV(analyses);
    downloadCSV(csvData, `niche-analysis-${new Date().toISOString().split('T')[0]}`);
  } else {
    openPDFPreview(analyses);
  }
}
