'use client'

import { useMemo, useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ErrorBar } from 'recharts'
import { Box } from '@mui/material'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartSkeleton } from '@/components/ChartSkeleton'
import { ChartError } from '@/components/ChartError'
import { ChartProps } from '@/lib/types'
import { chartColors } from '@/lib/theme'
import { chartConfig } from './config'

export default function SalaryByRoleTypeChart({ config = chartConfig }: ChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bigquery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: config.query })
        })

        const result = await response.json()

        if (result.error) {
          setError(new Error(result.error))
          return
        }

        setData(result.data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [config.query])

  const refetch = () => {
    setLoading(true)
    setError(null)
  }

  // Process data for error bars
  const chartData = useMemo(() => {
    return data.map(row => ({
      role: row.ai_ml_subcategory,
      median: row.median_salary,
      avg: row.avg_salary,
      p25: row.p25_salary,
      p75: row.p75_salary,
      jobs: row.job_count,
      // Calculate error bar values (distance from median)
      errorLow: row.median_salary - row.p25_salary,
      errorHigh: row.p75_salary - row.median_salary,
    }))
  }, [data])

  if (loading) return <ChartSkeleton />
  if (error) return <ChartError error={error} onRetry={refetch} />
  if (!data || data.length === 0) return <ChartError error={new Error('No data available')} />

  return (
    <ChartContainer
      title={config.name}
      description={config.description}
      onRefresh={refetch}
      width={config.display.width}
      height={config.display.height}
      methodology={config.methodology}
    >
      <Box sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        height: config.display.height,
        overflowX: { xs: 'auto', md: 'visible' },
        overflowY: 'hidden'
      }}>
        <Box sx={{ minWidth: { xs: 600, md: '100%' }, height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 80, left: 120, bottom: 20 }}
              layout="vertical"
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              hide
            />
            <YAxis
              type="category"
              dataKey="role"
              tick={{ fontSize: 11, fill: '#666' }}
              stroke="#666"
              width={110}
              interval={0}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 13
              }}
              formatter={(value: number, name: string) => {
                if (name === 'median') return [`$${Math.round(value / 1000)}K`, 'Median Salary']
                return [value, name]
              }}
              labelFormatter={(label) => {
                const item = chartData.find(d => d.role === label)
                return `${label} (${item?.jobs.toLocaleString()} jobs)`
              }}
            />
            <Bar 
              dataKey="median"
              name="median"
              radius={[0, 8, 8, 0]}
              label={{ 
                position: 'right', 
                formatter: (value: number) => `$${Math.round(value / 1000)}K`,
                fontSize: 11,
                fill: '#666'
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors.primary[index % chartColors.primary.length]} />
              ))}
              <ErrorBar 
                dataKey="errorLow" 
                width={4} 
                strokeWidth={2} 
                stroke="#666"
                direction="x"
              />
              <ErrorBar 
                dataKey="errorHigh" 
                width={4} 
                strokeWidth={2} 
                stroke="#666"
                direction="x"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </Box>
      </Box>
    </ChartContainer>
  )
}

