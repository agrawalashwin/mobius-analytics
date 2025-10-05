import { ChartConfig } from '@/lib/types'

export const chartConfig: ChartConfig = {
  id: 'test-chart',
  name: 'Is This Test Chart Working?',
  description: 'Simple test chart to verify rendering',
  category: 'salaries',
  tags: ['test'],
  
  data: {
    source: 'static',
  },
  
  display: {
    type: 'bar',
    width: 'full',
    height: 400,
    responsive: true,
    showLegend: false,
    showGrid: false,
    animate: false,
  },
  
  author: 'mobius-analytics',
  version: '1.0.0',
  createdAt: '2025-10-05',
}

