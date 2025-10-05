import { ChartConfig } from '@/lib/types'

export const chartConfig: ChartConfig = {
  id: 'salary-by-role-type',
  name: 'How Do AI/ML Role Types Compare in Salary?',
  description: 'Compare median salaries across different AI/ML specializations',
  category: 'salaries',
  tags: ['salaries', 'roles', 'ai', 'ml', 'comparison'],
  
  data: {
    source: 'bigquery',
    view: 'ai_ml_subcategory_analysis',
    refreshInterval: 3600,
  },
  
  query: `
    SELECT 
      ai_ml_subcategory,
      COUNT(*) as job_count,
      ROUND(AVG(max_salary), 0) as avg_salary,
      ROUND(APPROX_QUANTILES(max_salary, 100)[OFFSET(50)], 0) as median_salary,
      ROUND(APPROX_QUANTILES(max_salary, 100)[OFFSET(25)], 0) as p25_salary,
      ROUND(APPROX_QUANTILES(max_salary, 100)[OFFSET(75)], 0) as p75_salary
    FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_jobs_with_salary\`
    WHERE ai_ml_subcategory IS NOT NULL
      AND ai_ml_subcategory != 'Other AI/ML'
    GROUP BY ai_ml_subcategory
    HAVING job_count >= 50
    ORDER BY median_salary DESC
  `,
  
  display: {
    type: 'bar',
    width: 'full',
    height: 450,
    responsive: true,
    showLegend: true,
    showGrid: true,
    animate: true,
  },
  
  author: 'mobius-analytics',
  version: '1.0.0',
  createdAt: '2025-10-05',
  dependencies: ['recharts'],
  methodology:
    'Compares median salaries across AI/ML role types (ML Engineer, LLM/GenAI Engineer, AI Engineer, etc.). Shows median with 25th-75th percentile range. Only includes roles with 50+ job postings for statistical significance.',
}

