'use client'

import { useEffect, useState } from 'react'
import { Box, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartSkeleton } from '@/components/ChartSkeleton'
import { ChartError } from '@/components/ChartError'
import { ChartProps } from '@/lib/types'
import { chartColors } from '@/lib/theme'
import { config } from './config'

interface ChartData {
  salary_band: string
  job_count: number
  avg_salary: number
  median_salary: number
  remote_jobs: number
  unique_companies: number
}

export default function SalaryDistributionChart({ config: configProp }: ChartProps) {
  const chartConfig = configProp || config
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [metric, setMetric] = useState<string>('job_count')
  const [showRemote, setShowRemote] = useState<boolean>(true)

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

        setData(result.data || [])
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
            View By
          </Typography>
          <ToggleButtonGroup
            value={metric}
            exclusive
            onChange={(e, val) => val && setMetric(val)}
            size="small"
            sx={{ '& .MuiToggleButton-root': { px: 2, py: 0.5, fontSize: '0.875rem' } }}
          >
            <ToggleButton value="job_count">Total Jobs</ToggleButton>
            <ToggleButton value="unique_companies">Companies</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', height: chartConfig.height }}>
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="salary_band" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Number of Jobs', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.96)', 
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              fontSize: 13
            }}
            formatter={(value: number, name: string) => {
              if (name === 'job_count') return [value.toLocaleString(), 'Jobs']
              if (name === 'avg_salary') return [`$${Math.round(value / 1000)}K`, 'Avg Salary']
              if (name === 'median_salary') return [`$${Math.round(value / 1000)}K`, 'Median Salary']
              if (name === 'remote_jobs') return [value.toLocaleString(), 'Remote Jobs']
              if (name === 'unique_companies') return [value.toLocaleString(), 'Companies']
              return [value, name]
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: 20, fontSize: 13 }}
            formatter={(value) => {
              if (value === 'job_count') return 'Total Jobs'
              if (value === 'remote_jobs') return 'Remote Jobs'
              return value
            }}
          />
          <Bar dataKey={metric} name={metric} radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors.gradient[index % chartColors.gradient.length]} />
            ))}
          </Bar>
          {showRemote && <Bar dataKey="remote_jobs" name="remote_jobs" fill={chartColors.primary[1]} radius={[8, 8, 0, 0]} />}
        </BarChart>
      </ResponsiveContainer>
      </Box>
    </ChartContainer>
  )
}

