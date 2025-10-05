import { ChartConfig } from '@/lib/types'

export const chartConfig: ChartConfig = {
  id: 'ai-salary-premium',
  name: 'Are AI/ML Engineers Earning More Than Software Engineers?',
  description: 'Track the salary premium of AI/ML roles compared to traditional software engineering positions over time',
  category: 'salaries',
  tags: ['ai', 'swe', 'comparison', 'trends', 'premium'],
  
  data: {
    source: 'bigquery',
    view: 'monthly_ai_vs_swe_salary_trends',
    refreshInterval: 3600, // 1 hour
  },
  
  display: {
    type: 'line',
    width: 'full',
    height: 400,
    responsive: true,
    showLegend: true,
    showGrid: true,
    animate: true,
  },
  
  author: 'mobius-analytics',
  version: '1.0.0',
  createdAt: '2025-10-05',
  dependencies: ['recharts', 'date-fns'],
  methodology:
    'Monthly averages from job posts with salary info. Premium = (AI/ML avg salary − SWE avg salary) / SWE avg salary. Outliers filtered ($100k–$2M). Salaries are posted amounts, not COL-adjusted. Time reflects posting month.',
}

