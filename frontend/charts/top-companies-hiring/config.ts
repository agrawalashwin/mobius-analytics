import { ChartConfig } from '@/lib/types'

export const chartConfig: ChartConfig = {
  id: 'top-companies-hiring',
  name: 'Which Companies Are Hiring the Most AI/ML Engineers?',
  description: 'Top 25 companies by AI/ML job postings - filter by month',
  category: 'companies',
  tags: ['companies', 'hiring', 'ai', 'ml', 'volume'],

  data: {
    source: 'bigquery',
    view: 'ai_ml_top_companies',
    refreshInterval: 3600,
  },

  query: `
    SELECT
      data_company,
      FORMAT_TIMESTAMP('%b', data_posted) as month,
      COUNT(*) as job_count,
      AVG(max_salary) as avg_salary
    FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_jobs_with_salary\`
    WHERE data_company IS NOT NULL
      AND data_posted IS NOT NULL
    GROUP BY data_company, month
  `,

  display: {
    type: 'bar',
    width: 'full',
    height: 600,
    responsive: true,
    showLegend: false,
    showGrid: true,
    animate: true,
  },

  author: 'mobius-analytics',
  version: '1.0.0',
  createdAt: '2025-10-05',
  dependencies: ['recharts'],
  methodology:
    'Top 25 companies by number of AI/ML postings with salary info. Filter by month to see hiring trends. Jobs = count of posts; Avg salary is weighted by postings. Company names are normalized where possible; subsidiaries may be grouped. Salaries reflect posted values.',
}

