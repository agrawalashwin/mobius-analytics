import { ChartConfig } from '@/lib/types'

export const chartConfig: ChartConfig = {
  id: 'company-job-listings',
  name: 'Browse AI/ML Jobs by Company',
  description: 'Select a company to see all their AI/ML job postings with links',
  category: 'companies',
  tags: ['companies', 'jobs', 'listings', 'ai', 'ml'],
  
  data: {
    source: 'bigquery',
    view: 'ai_ml_jobs_with_salary',
    refreshInterval: 3600,
  },
  
  query: `
    WITH top_companies AS (
      SELECT 
        data_company,
        COUNT(*) as total_jobs
      FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_jobs_with_salary\`
      WHERE data_company IS NOT NULL
      GROUP BY data_company
      ORDER BY total_jobs DESC
      LIMIT 20
    )
    SELECT 
      j.data_company,
      j.data_job_title,
      j.data_location_city,
      j.data_location_state,
      j.max_salary,
      j.ai_ml_subcategory,
      j.title_level,
      j.data_posted,
      j.data_url,
      j.is_remote
    FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_jobs_with_salary\` j
    INNER JOIN top_companies tc ON j.data_company = tc.data_company
    WHERE j.data_company IS NOT NULL
      AND j.data_job_title IS NOT NULL
    ORDER BY j.data_company, j.data_posted DESC
  `,
  
  display: {
    type: 'table',
    width: 'full',
    height: 600,
    responsive: true,
    showLegend: false,
    showGrid: true,
    animate: false,
  },
  
  author: 'mobius-analytics',
  version: '1.0.0',
  createdAt: '2025-10-05',
  dependencies: ['@mui/material'],
  methodology:
    'Shows all AI/ML job postings from top 20 companies. Select a company to filter jobs. Includes job title, location, salary, role type, seniority level, posting date, and direct link to apply.',
}

