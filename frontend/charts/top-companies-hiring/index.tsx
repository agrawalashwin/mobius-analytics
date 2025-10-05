'use client'

import { useMemo, useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Box, ToggleButton, ToggleButtonGroup, Typography, Chip } from '@mui/material'
import { motion } from 'framer-motion'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartSkeleton } from '@/components/ChartSkeleton'
import { ChartError } from '@/components/ChartError'
import { ChartProps } from '@/lib/types'
import { chartColors } from '@/lib/theme'
import { chartConfig } from './config'

export default function TopCompaniesHiringChart({ config = chartConfig }: ChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bigquery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: config.query || `SELECT * FROM \`jobs-data-linkedin.mobius_analytics_engine.${config.data.view}\` LIMIT 1000`
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
  }, [config.data.view, config.query])

  const refetch = () => {
    setLoading(true)
    setError(null)
  }
  
  const handleMonthToggle = (month: string) => {
    setSelectedMonths(prev =>
      prev.includes(month)
        ? prev.filter(m => m !== month)
        : [...prev, month]
    )
  }

  // Aggregate and get top 25
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Filter by selected months
    const filteredData = data.filter(row => selectedMonths.includes(row.month))

    // Group by company
    const aggregated = filteredData.reduce((acc: any[], row: any) => {
      const existing = acc.find(item => item.company === row.data_company)

      if (existing) {
        existing.jobs += row.job_count || 0
        existing.totalSalary += (row.avg_salary || 0) * (row.job_count || 0)
      } else {
        acc.push({
          company: row.data_company,
          jobs: row.job_count || 0,
          totalSalary: (row.avg_salary || 0) * (row.job_count || 0),
        })
      }

      return acc
    }, [])

    // Calculate average salary and get top 25
    return aggregated
      .map(item => ({
        company: item.company,
        jobs: item.jobs,
        avgSalary: Math.round(item.totalSalary / item.jobs),
      }))
      .sort((a, b) => b.jobs - a.jobs)
      .slice(0, 25)
  }, [data, selectedMonths])
  
  if (loading) return <ChartSkeleton />
  if (error) return <ChartError error={error} onRetry={refetch} />
  if (chartData.length === 0) return <ChartError error={new Error('No data available')} />
  
  const availableMonths = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

  return (
    <ChartContainer
      title={config.name}
      description={config.description}
      onRefresh={refetch}
      width={config.display.width}
      height={config.display.height}
      methodology={config.methodology}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Month Filter */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, alignItems: 'center', px: { xs: 1, sm: 0 } }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>
            Filter by Month (Multi-select)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {availableMonths.map(month => (
              <Chip
                key={month}
                label={month}
                onClick={() => handleMonthToggle(month)}
                color={selectedMonths.includes(month) ? 'primary' : 'default'}
                variant={selectedMonths.includes(month) ? 'filled' : 'outlined'}
                size="small"
                sx={{
                  fontWeight: selectedMonths.includes(month) ? 700 : 400,
                  cursor: 'pointer',
                  fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' }, textAlign: 'center' }}>
            Selected: {selectedMonths.length} month{selectedMonths.length !== 1 ? 's' : ''} • Showing top 25 companies
          </Typography>
        </Box>

        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', height: { xs: 500, sm: 550, md: config.display.height } }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 80, left: 180, bottom: 20 }}
              layout="vertical"
              barCategoryGap="15%"
              barGap={2}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="company"
              tick={{ fontSize: 10, fill: '#666' }}
              stroke="#666"
              width={170}
              interval={0}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              formatter={(value: any, name: string) => {
                if (name === 'jobs') return [value.toLocaleString(), 'Jobs']
                if (name === 'avgSalary') return [`$${value.toLocaleString()}`, 'Avg Salary']
                return [value, name]
              }}
            />
            <Bar
              dataKey="jobs"
              radius={[0, 8, 8, 0]}
              animationDuration={900}
              animationEasing="ease-out"
              barSize={20}
              label={{
                position: 'right',
                formatter: (value: number) => value.toLocaleString(),
                fontSize: 11,
                fill: '#666'
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors.primary[index % chartColors.primary.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </Box>
      </Box>
    </ChartContainer>
  )
}

