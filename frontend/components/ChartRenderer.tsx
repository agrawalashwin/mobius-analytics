'use client'

import { loadChart, getAvailableChartIds } from '@/lib/chart-loader'
import { ChartError } from './ChartError'

interface ChartRendererProps {
  chartId: string
}

export function ChartRenderer({ chartId }: ChartRendererProps) {
  console.log('🔍 ChartRenderer for:', chartId)
  console.log('📊 Available chart IDs:', getAvailableChartIds())

  // Load the component directly - no need for config lookup
  const ChartComponent = loadChart(chartId)

  if (!ChartComponent) {
    console.error(`❌ Chart component not found: ${chartId}`)
    console.log('📊 Available:', getAvailableChartIds())
    return <ChartError error={new Error(`Chart not found: ${chartId}`)} />
  }

  console.log('✅ Rendering chart:', chartId)
  return <ChartComponent />
}

