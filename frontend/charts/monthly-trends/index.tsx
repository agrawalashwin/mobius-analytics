'use client'

import { useEffect, useState } from 'react'
import { Box, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartSkeleton } from '@/components/ChartSkeleton'
import { ChartError } from '@/components/ChartError'
import { ChartProps } from '@/lib/types'
import { chartColors } from '@/lib/theme'
import { config } from './config'

interface ChartData {
  month: { value: string } | string
  ai_ml_jobs: number
  ai_ml_avg_salary: number
  ai_ml_median_salary: number
}

export default function MonthlyTrendsChart({ config: configProp }: ChartProps) {
  const chartConfig = configProp || config
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [metric, setMetric] = useState<string>('jobs')
  const [salaryType, setSalaryType] = useState<string>('median')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bigquery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: chartConfig.query })
        })

        const result = await response.json()

        if (result.error) {
          setError(new Error(result.error))
          return
        }

        // Parse BigQuery date format
        const parsedData = (result.data || []).map((row: ChartData) => {
          const monthValue = typeof row.month === 'object' ? row.month.value : row.month
          const date = new Date(monthValue)
          return {
            month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            monthSort: date.getTime(),
            ai_ml_jobs: Number(row.ai_ml_jobs) || 0,
            ai_ml_avg_salary: Number(row.ai_ml_avg_salary) || 0,
            ai_ml_median_salary: Number(row.ai_ml_median_salary) || 0
          }
        }).sort((a: any, b: any) => a.monthSort - b.monthSort)

        console.log('Monthly Trends Data:', parsedData)
        setData(parsedData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [chartConfig.query])

  const refetch = () => {
    setLoading(true)
    setError(null)
  }

  if (loading) return <ChartSkeleton />
  if (error) return <ChartError error={error} onRetry={refetch} />
  if (!data || data.length === 0) return <ChartError error={new Error('No data available')} />

  const salaryDataKey = salaryType === 'median' ? 'ai_ml_median_salary' : 'ai_ml_avg_salary'

  return (
    <ChartContainer
      title={chartConfig.title}
      description={chartConfig.description}
      onRefresh={refetch}
      width={chartConfig.width}
      height={chartConfig.height}
      methodology={chartConfig.methodology}
    >
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: 'text.secondary' }}>
            Salary Metric
          </Typography>
          <ToggleButtonGroup
            value={salaryType}
            exclusive
            onChange={(e, val) => val && setSalaryType(val)}
            size="small"
            sx={{ '& .MuiToggleButton-root': { px: 2, py: 0.5, fontSize: '0.875rem' } }}
          >
            <ToggleButton value="median">Median</ToggleButton>
            <ToggleButton value="average">Average</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', height: chartConfig.height }}>
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            label={{ value: 'AI/ML Job Postings', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            domain={[0, 'auto']}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            label={{ value: 'Salary ($K)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
            domain={[100000, 'auto']}
            tickFormatter={(value) => `$${Math.round(value / 1000)}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              fontSize: 13
            }}
            formatter={(value: number, name: string) => {
              if (name === 'AI/ML Jobs') {
                return [value.toLocaleString(), name]
              }
              return [`$${Math.round(value / 1000)}K`, name]
            }}
          />
          <Legend wrapperStyle={{ paddingTop: 20, fontSize: 13 }} />
          <Bar
            yAxisId="left"
            dataKey="ai_ml_jobs"
            fill={chartColors.primary[0]}
            name="AI/ML Jobs"
            radius={[8, 8, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={salaryDataKey}
            stroke={chartColors.primary[3]}
            strokeWidth={3}
            dot={{ r: 4 }}
            name={salaryType === 'median' ? 'Median Salary' : 'Avg Salary'}
          />
        </ComposedChart>
      </ResponsiveContainer>
      </Box>
    </ChartContainer>
  )
}

