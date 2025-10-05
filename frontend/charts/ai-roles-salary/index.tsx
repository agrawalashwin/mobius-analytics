'use client'

import { useMemo, useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { motion } from 'framer-motion'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartSkeleton } from '@/components/ChartSkeleton'
import { ChartError } from '@/components/ChartError'
import { ChartProps } from '@/lib/types'
import { chartColors } from '@/lib/theme'
import { chartConfig } from './config'

export default function AiRolesSalaryChart({ config = chartConfig }: ChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [sortBy, setSortBy] = useState<string>('salary')
  const [topN, setTopN] = useState<number>(10)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bigquery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `SELECT * FROM \`jobs-data-linkedin.mobius_analytics_engine.${config.data.view}\` LIMIT 1000`
          })
        })

        const result = await response.json()
        setData(result.data || [])
        setLoading(false)
      } catch (err: any) {
        setError(err)
        setLoading(false)
      }
    }

    fetchData()
  }, [config.data.view])

  const refetch = () => {
    setLoading(true)
    setError(null)
  }
  
  // Aggregate and sort data
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    // Group by subcategory and sum
    const aggregated = data.reduce((acc: any[], row: any) => {
      const existing = acc.find(item => item.role === row.ai_ml_subcategory)
      
      if (existing) {
        existing.totalJobs += row.job_count || 0
        existing.totalSalary += (row.avg_salary || 0) * (row.job_count || 0)
      } else {
        acc.push({
          role: row.ai_ml_subcategory,
          totalJobs: row.job_count || 0,
          totalSalary: (row.avg_salary || 0) * (row.job_count || 0),
        })
      }
      
      return acc
    }, [])
    
    // Calculate weighted average and format
    const formatted = aggregated
      .map(item => ({
        role: item.role,
        salary: Math.round(item.totalSalary / item.totalJobs),
        jobs: item.totalJobs,
      }))

    // Sort based on filter
    const sorted = sortBy === 'salary'
      ? formatted.sort((a, b) => b.salary - a.salary)
      : formatted.sort((a, b) => b.jobs - a.jobs)

    // Return top N
    return sorted.slice(0, topN)
  }, [data, sortBy, topN])
  
  if (loading) return <ChartSkeleton />
  if (error) return <ChartError error={error} onRetry={refetch} />
  if (chartData.length === 0) return <ChartError error={new Error('No data available')} />
  
  return (
    <ChartContainer
      title={config.name}
      description={config.description}
      onRefresh={refetch}
      width={config.display.width}
      height={config.display.height}
      methodology={config.methodology}
    >
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: 'text.secondary' }}>
            Sort By
          </Typography>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={(e, val) => val && setSortBy(val)}
            size="small"
            sx={{ '& .MuiToggleButton-root': { px: 2, py: 0.5, fontSize: '0.875rem' } }}
          >
            <ToggleButton value="salary">Highest Salary</ToggleButton>
            <ToggleButton value="volume">Most Jobs</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: 'text.secondary' }}>
            Show Top
          </Typography>
          <ToggleButtonGroup
            value={topN}
            exclusive
            onChange={(e, val) => val && setTopN(val)}
            size="small"
            sx={{ '& .MuiToggleButton-root': { px: 2, py: 0.5, fontSize: '0.875rem' } }}
          >
            <ToggleButton value={5}>5</ToggleButton>
            <ToggleButton value={10}>10</ToggleButton>
            <ToggleButton value={15}>15</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', height: config.display.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 80 }}
            layout="horizontal"
            barCategoryGap="30%"
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="role"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 11 }}
              stroke="#666"
              interval={0}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
              label={{ value: 'Average Salary ($)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              formatter={(value: any, name: string) => {
                if (name === 'salary') return [`$${value.toLocaleString()}`, 'Avg Salary']
                return [value.toLocaleString(), 'Jobs']
              }}
              labelFormatter={(label) => label}
            />
            <Bar
              dataKey="salary"
              radius={[8, 8, 0, 0]}
              animationDuration={900}
              animationEasing="ease-out"
              barSize={28}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={chartColors.gradient[index % chartColors.gradient.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </ChartContainer>
  )
}

