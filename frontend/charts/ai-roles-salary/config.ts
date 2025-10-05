import { ChartConfig } from '@/lib/types'

export const chartConfig: ChartConfig = {
  id: 'ai-roles-salary',
  name: 'Which AI/ML Roles Pay the Most?',
  description: 'Compare average salaries across different AI/ML specializations',
  category: 'salaries',
  tags: ['ai', 'ml', 'roles', 'comparison', 'specialization'],
  
  data: {
    source: 'bigquery',
    view: 'ai_ml_subcategory_analysis',
    refreshInterval: 3600,
  },
  
  display: {
    type: 'bar',
    width: 'full',
    height: 400,
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
    'Weighted average salary by AI/ML subcategory using job counts as weights. Salaries derived from listed ranges (midpoint) and normalized to annual. Outliers removed ($100k$2M). Titles may vary by company.',
}

