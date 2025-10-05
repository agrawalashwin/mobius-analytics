import { ChartConfig } from '@/lib/types'

export const chartConfig: ChartConfig = {
  id: 'simple-test',
  name: 'Simple Test',
  description: 'Testing data fetch',
  data: {
    source: 'bigquery',
    view: 'monthly_ai_vs_swe_salary_trends',
  },
  display: {
    type: 'line',
    width: 'full',
    height: 400,
  },
}

