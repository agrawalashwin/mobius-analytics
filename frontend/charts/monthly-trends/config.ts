import { ChartConfig } from '@/lib/types'

export const config: ChartConfig = {
  id: 'monthly-trends',
  title: 'How Have AI/ML Job Postings and Salaries Trended Over Time?',
  description: 'Monthly AI/ML job volume (bars) and median salaries (line)',
  width: 'full',
  height: 400,
  query: `
    SELECT
      month,
      job_count as ai_ml_jobs,
      avg_salary as ai_ml_avg_salary,
      median_salary as ai_ml_median_salary
    FROM \`jobs-data-linkedin.mobius_analytics_engine.monthly_ai_vs_swe_salary_trends\`
    WHERE role_category = 'AI/ML Engineer'
    ORDER BY month ASC
  `,
  methodology: `
    **Time Period**: April 2025 - October 2025

    **What This Shows**:
    - Bars: Number of AI/ML job postings per month
    - Line: Median salary for AI/ML roles

    **Why This Matters**:
    - Rising job volume indicates growing demand for AI/ML talent
    - Salary trends show market compensation changes over time
    - Divergence between volume and salary can signal market dynamics

    **Data Refresh**: Updated every 2 days with new postings

    **Note**: Only includes AI/ML Engineer roles with disclosed salaries ($100K-$2M)
  `
}

