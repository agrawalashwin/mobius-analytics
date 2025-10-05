'use client'

import { useMemo, useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { Box, Typography, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartSkeleton } from '@/components/ChartSkeleton'
import { ChartError } from '@/components/ChartError'
import { ChartProps } from '@/lib/types'
import { chartColors } from '@/lib/theme'
import { chartConfig } from './config'

export default function AiSalaryPremiumChart({ config = chartConfig }: ChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [timeRange, setTimeRange] = useState<string>('all')
  const [location, setLocation] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('📊 Fetching data for ai-salary-premium...')

        // Build query with filters
        let whereClause = ''
        if (timeRange === '3m') {
          whereClause = 'WHERE CAST(month AS DATE) >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)'
        } else if (timeRange === '6m') {
          whereClause = 'WHERE CAST(month AS DATE) >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)'
        }

        const response = await fetch('/api/bigquery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `SELECT * FROM \`jobs-data-linkedin.mobius_analytics_engine.${config.data.view}\` ${whereClause} ORDER BY month ASC LIMIT 1000`
          })
        })

        const result = await response.json()
        console.log('📊 Received data:', result.data?.length, 'rows')
        setData(result.data || [])
        setLoading(false)
      } catch (err: any) {
        console.error('📊 Error fetching data:', err)
        setError(err)
        setLoading(false)
      }
    }

    fetchData()
  }, [config.data.view, timeRange, location])

  const refetch = () => {
    setLoading(true)
    setError(null)
  }

  // Transform data for the chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      console.log('⚠️ No data available for chart')
      return []
    }
    console.log('✅ Processing data:', data.length, 'rows')
    console.log('📊 Sample row:', data[0])

    // Group by month and calculate premium
    const monthlyData = data.reduce((acc: any[], row: any) => {
      // Handle BigQuery date format - it's an object with 'value' property
      const monthValue = typeof row.month === 'object' && row.month?.value ? row.month.value : row.month

      const existing = acc.find(item => item.month === monthValue)

      if (existing) {
        if (row.role_category === 'AI/ML Engineer') {
          existing.ai_salary = Number(row.avg_salary)
        } else if (row.role_category === 'Software Engineer') {
          existing.swe_salary = Number(row.avg_salary)
        }
      } else {
        acc.push({
          month: monthValue,
          ai_salary: row.role_category === 'AI/ML Engineer' ? Number(row.avg_salary) : null,
          swe_salary: row.role_category === 'Software Engineer' ? Number(row.avg_salary) : null,
        })
      }

      return acc
    }, [])

    console.log('📊 Monthly data grouped:', monthlyData.length, 'months')

    // Calculate premium and format
    const result = monthlyData
      .map(item => {
        // Parse the date
        const date = new Date(item.month)

        return {
          ...item,
          premium: item.ai_salary && item.swe_salary
            ? Math.round(((item.ai_salary - item.swe_salary) / item.swe_salary) * 100 * 10) / 10
            : null,
          monthLabel: format(date, 'MMM yyyy'),
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.month)
        const dateB = new Date(b.month)
        return dateA.getTime() - dateB.getTime()
      })

    console.log('📊 Final chart data:', result.length, 'points')
    console.log('📊 First point:', result[0])

    return result
  }, [data])
  
  // Calculate trend
  const trend = useMemo(() => {
    if (chartData.length < 2) return null
    const first = chartData[0].premium
    const last = chartData[chartData.length - 1].premium
    if (!first || !last) return null
    return last - first
  }, [chartData])

  if (loading) return <ChartSkeleton />
  if (error) return <ChartError error={error} onRetry={refetch} />
  if (chartData.length === 0) return <ChartError error={new Error('No data available')} onRetry={refetch} />
  
  return (
    <ChartContainer
      title={config.name}
      description={config.description}
      onRefresh={refetch}
      width={config.display.width}
      height={config.display.height}
      methodology={config.methodology}
    >
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: 'text.secondary' }}>
              Time Range
            </Typography>
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={(e, val) => val && setTimeRange(val)}
              size="small"
              sx={{ '& .MuiToggleButton-root': { px: 2, py: 0.5, fontSize: '0.875rem' } }}
            >
              <ToggleButton value="3m">Last 3 Months</ToggleButton>
              <ToggleButton value="6m">Last 6 Months</ToggleButton>
              <ToggleButton value="all">All Time</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Trend Indicator */}
        {trend !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center' }}>
              <Chip
                icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
                label={`Premium ${trend > 0 ? 'increased' : 'decreased'} by ${Math.abs(trend).toFixed(1)}%`}
                color={trend > 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </motion.div>
        )}

        {/* Chart */}
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', height: config.display.height }}>
          <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="monthLabel" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="#666"
              label={{ value: 'Salary ($)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="#666"
              label={{ value: 'Premium (%)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              formatter={(value: any, name: string) => {
                if (name === 'premium') return [`${value}%`, 'Premium']
                return [`$${value.toLocaleString()}`, name === 'ai_salary' ? 'AI/ML' : 'SWE']
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => {
                if (value === 'ai_salary') return 'AI/ML Engineer'
                if (value === 'swe_salary') return 'Software Engineer'
                return 'Salary Premium'
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ai_salary"
              stroke={chartColors.primary[0]}
              strokeWidth={3}
              dot={{ fill: chartColors.primary[0], r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="swe_salary"
              stroke={chartColors.secondary[0]}
              strokeWidth={3}
              dot={{ fill: chartColors.secondary[0], r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="premium"
              stroke={chartColors.success[0]}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: chartColors.success[0], r: 3 }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </ChartContainer>
  )
}

