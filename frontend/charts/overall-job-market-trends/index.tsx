'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Chip, FormControl, InputLabel, Select, MenuItem, OutlinedInput, CircularProgress } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { chartConfig as config } from './config'
import { ChartContainer } from '@/components/ChartContainer'

interface WeeklyData {
  week_start: string
  state: string
  seniority_level: string
  role_type: string
  job_count: number
  unique_companies: number
  remote_jobs: number
}

const chartColors = {
  primary: '#2970FF',
  light: '#5B8CFF',
  dark: '#1B4DFF',
}

export default function OverallJobMarketTrendsChart() {
  const [data, setData] = useState<WeeklyData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedRoleType, setSelectedRoleType] = useState<string>('All')
  const [selectedSeniority, setSelectedSeniority] = useState<string>('All')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bigquery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: config.query }),
        })
        const result = await response.json()
        setData(result.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Get unique values for filters
  const allStates = Array.from(new Set(data.map(d => d.state).filter(Boolean))).sort()

  const roleTypes = ['All', 'Technical', 'Non-Technical']

  // Get unique seniority levels from data - exclude experience-based rare values
  const uniqueSeniorityLevels = Array.from(new Set(data.map(d => d.seniority_level).filter(Boolean)))
    .filter(level => !level.includes('_TO_') && !level.includes('LESS_THAN') && !level.includes('MONTHS'))
    .sort()
  const seniorityLevels = ['All', ...uniqueSeniorityLevels]

  // Debug: Log filter options
  console.log('Filter options:')
  console.log('- Seniority levels:', seniorityLevels)
  console.log('- States:', allStates.length)

  // Debug: Total jobs calculation
  const totalJobsInData = data.reduce((sum, d) => sum + d.job_count, 0)
  console.log('📊 Total jobs in raw data:', totalJobsInData.toLocaleString())

  // Filter and aggregate data
  const filteredData = data.filter(d => {
    const stateMatch = selectedStates.length === 0 || selectedStates.includes(d.state)
    const roleMatch = selectedRoleType === 'All' || d.role_type === selectedRoleType
    const seniorityMatch = selectedSeniority === 'All' || d.seniority_level === selectedSeniority
    return stateMatch && roleMatch && seniorityMatch
  })

  // Aggregate by week - use a Map for better performance
  const weeklyMap = new Map<string, { job_count: number; unique_companies: number; remote_jobs: number }>()

  filteredData.forEach(curr => {
    // Normalize the week_start date to handle BigQuery format
    const dateValue = typeof curr.week_start === 'string' ? curr.week_start : (curr.week_start as any).value
    const weekKey = dateValue

    const existing = weeklyMap.get(weekKey)
    if (existing) {
      existing.job_count += curr.job_count
      existing.unique_companies += curr.unique_companies
      existing.remote_jobs += curr.remote_jobs
    } else {
      weeklyMap.set(weekKey, {
        job_count: curr.job_count,
        unique_companies: curr.unique_companies,
        remote_jobs: curr.remote_jobs,
      })
    }
  })

  // Convert map to array
  const weeklyAggregated = Array.from(weeklyMap.entries()).map(([week_start, data]) => ({
    week_start,
    ...data
  }))

  // Sort by date
  const sortedData = weeklyAggregated
    .sort((a, b) => {
      const dateA = typeof a.week_start === 'string' ? a.week_start : (a.week_start as any).value
      const dateB = typeof b.week_start === 'string' ? b.week_start : (b.week_start as any).value
      return new Date(dateA).getTime() - new Date(dateB).getTime()
    })

  // Calculate 4-week moving average and linear trend
  const movingAverageWindow = 4
  const chartData = sortedData.map((d, index) => {
    const startIndex = Math.max(0, index - movingAverageWindow + 1)
    const window = sortedData.slice(startIndex, index + 1)
    const avgJobCount = window.reduce((sum, item) => sum + item.job_count, 0) / window.length

    // Handle BigQuery date format
    const dateValue = typeof d.week_start === 'string' ? d.week_start : (d.week_start as any).value
    const date = new Date(dateValue)

    return {
      ...d,
      week: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      job_count: Math.round(avgJobCount),
      raw_job_count: d.job_count,
      index: index, // For trend line calculation
    }
  })

  // Calculate linear regression trend line
  const n = chartData.length
  const sumX = chartData.reduce((sum, d, i) => sum + i, 0)
  const sumY = chartData.reduce((sum, d) => sum + d.job_count, 0)
  const sumXY = chartData.reduce((sum, d, i) => sum + i * d.job_count, 0)
  const sumX2 = chartData.reduce((sum, d, i) => sum + i * i, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Add trend line values to chart data
  const chartDataWithTrend = chartData.map((d, i) => ({
    ...d,
    trend: Math.round(slope * i + intercept)
  }))

  // Debug: Log aggregation results
  if (chartDataWithTrend.length > 0) {
    console.log('Weekly aggregation results:')
    console.log('- Raw data rows:', data.length)
    console.log('- After filtering:', filteredData.length)
    console.log('- After weekly aggregation:', weeklyAggregated.length)
    console.log('- Final chart data points:', chartDataWithTrend.length)
    console.log('\nFirst 10 weeks:', chartDataWithTrend.slice(0, 10).map(d => ({
      week: d.week,
      raw: d.raw_job_count,
      smoothed: d.job_count,
      trend: d.trend
    })))
  }

  if (loading) {
    return (
      <ChartContainer
        title={config.name}
        description={config.description}
        width={config.display.width}
        height={config.display.height}
        methodology={config.methodology}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 400,
          gap: 2
        }}>
          <CircularProgress size={48} thickness={4} sx={{ color: chartColors.primary }} />
          <Typography variant="body2" color="text.secondary">
            Loading job market data...
          </Typography>
        </Box>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer
      title={config.name}
      description={config.description}
      width={config.display.width}
      height={config.display.height}
      methodology={config.methodology}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Filters and Summary - All in one row */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* State Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel shrink>State</InputLabel>
            <Select
              multiple
              value={selectedStates}
              onChange={(e) => setSelectedStates(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              input={<OutlinedInput notched label="State" />}
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) return <em>All States</em>
                if (selected.length <= 3) return selected.join(', ')
                return `${selected.length} states selected`
              }}
            >
              <MenuItem
                value="__select_all__"
                onClick={(e) => {
                  e.stopPropagation()
                  if (selectedStates.length === allStates.length) {
                    setSelectedStates([])
                  } else {
                    setSelectedStates(allStates)
                  }
                }}
                sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}
              >
                {selectedStates.length === allStates.length ? '✓ Deselect All' : 'Select All'}
              </MenuItem>
              {allStates.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Role Type Filter */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel shrink>Role Type</InputLabel>
            <Select
              value={selectedRoleType}
              onChange={(e) => setSelectedRoleType(e.target.value)}
              notched
              label="Role Type"
              displayEmpty
            >
              {roleTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Seniority Filter */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel shrink>Seniority</InputLabel>
            <Select
              value={selectedSeniority}
              onChange={(e) => setSelectedSeniority(e.target.value)}
              notched
              label="Seniority"
              displayEmpty
            >
              {seniorityLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Summary Stats */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label={`${chartDataWithTrend.reduce((sum, d) => sum + d.job_count, 0).toLocaleString()} jobs`}
              color="primary"
              size="small"
            />
            {selectedStates.length > 0 && (
              <Chip
                label={`${selectedStates.length} state${selectedStates.length > 1 ? 's' : ''}`}
                variant="outlined"
                size="small"
                onDelete={() => setSelectedStates([])}
              />
            )}
          </Box>
        </Box>

        {/* Chart */}
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', height: { xs: 350, sm: 400, md: config.display.height } }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartDataWithTrend}
              margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: '#666' }}
                stroke="#666"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#666' }}
                stroke="#666"
                tickFormatter={(value) => value.toLocaleString()}
                label={{ value: 'Job Postings', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.96)',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                formatter={(value: number) => [value.toLocaleString(), 'Jobs']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="job_count"
                name="Weekly Job Postings (4-week MA)"
                stroke={chartColors.primary}
                strokeWidth={3}
                dot={{ fill: chartColors.primary, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="trend"
                name="Trend Line"
                stroke="#FF6B6B"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </ChartContainer>
  )
}

