'use client'

import { useMemo, useState, useEffect } from 'react'
import { 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Chip,
  IconButton
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartSkeleton } from '@/components/ChartSkeleton'
import { ChartError } from '@/components/ChartError'
import { ChartProps } from '@/lib/types'
import { chartConfig } from './config'

interface JobListing {
  data_company: string
  data_job_title: string
  data_location_city: string
  data_location_state: string
  max_salary: number
  ai_ml_subcategory: string
  title_level: string
  data_posted: { value: string } | string
  data_url: string
  is_remote: boolean
}

export default function CompanyJobListingsChart({ config = chartConfig }: ChartProps) {
  const [data, setData] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('all')

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
        
        // Auto-select first company
        if (result.data && result.data.length > 0) {
          setSelectedCompany(result.data[0].data_company)
        }
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

  // Get unique companies
  const companies = useMemo(() => {
    const uniqueCompanies = Array.from(new Set(data.map(job => job.data_company)))
    return uniqueCompanies.sort()
  }, [data])

  // Get unique months from data
  const months = useMemo(() => {
    const uniqueMonths = Array.from(new Set(data.map(job => {
      const dateStr = typeof job.data_posted === 'object' ? job.data_posted.value : job.data_posted
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    })))
    return uniqueMonths.sort()
  }, [data])

  // Get unique states from data
  const states = useMemo(() => {
    const uniqueStates = Array.from(new Set(
      data
        .filter(job => job.data_location_state && !job.is_remote)
        .map(job => job.data_location_state)
    ))
    return uniqueStates.sort()
  }, [data])

  // Get unique job titles from selected company
  const jobTitles = useMemo(() => {
    const companyJobs = data.filter(job => job.data_company === selectedCompany)
    const uniqueTitles = Array.from(new Set(companyJobs.map(job => job.data_job_title)))
    return uniqueTitles.sort()
  }, [data, selectedCompany])

  // Filter jobs by all selected filters
  const filteredJobs = useMemo(() => {
    if (!selectedCompany) return []

    return data.filter(job => {
      // Company filter
      if (job.data_company !== selectedCompany) return false

      // Month filter
      if (selectedMonth !== 'all') {
        const dateStr = typeof job.data_posted === 'object' ? job.data_posted.value : job.data_posted
        const date = new Date(dateStr)
        const jobMonth = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        if (jobMonth !== selectedMonth) return false
      }

      // State filter
      if (selectedState !== 'all') {
        if (selectedState === 'Remote') {
          if (!job.is_remote) return false
        } else {
          if (job.is_remote || job.data_location_state !== selectedState) return false
        }
      }

      // Job title filter
      if (selectedJobTitle !== 'all') {
        if (job.data_job_title !== selectedJobTitle) return false
      }

      return true
    })
  }, [data, selectedCompany, selectedMonth, selectedState, selectedJobTitle])

  const formatDate = (dateValue: { value: string } | string) => {
    const dateStr = typeof dateValue === 'object' ? dateValue.value : dateValue
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatSalary = (salary: number) => {
    if (!salary) return 'Not disclosed'
    return `$${Math.round(salary / 1000)}K`
  }

  const truncateTitle = (title: string, maxLength: number = 30) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + '...'
  }

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
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Filters */}
        <Box sx={{ mb: 3, px: { xs: 1, sm: 0 } }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 200, md: 250 }, flexGrow: { xs: 1, sm: 0 } }} size="small">
              <InputLabel shrink>Company</InputLabel>
              <Select
                value={selectedCompany}
                label="Company"
                onChange={(e) => {
                  setSelectedCompany(e.target.value)
                  setSelectedJobTitle('all') // Reset job title when company changes
                }}
                size="small"
                notched
                displayEmpty
              >
                {companies.map(company => (
                  <MenuItem key={company} value={company}>
                    {company}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: { xs: '45%', sm: 130, md: 150 }, flexGrow: { xs: 1, sm: 0 } }} size="small">
              <InputLabel shrink>Month Posted</InputLabel>
              <Select
                value={selectedMonth}
                label="Month Posted"
                onChange={(e) => setSelectedMonth(e.target.value)}
                size="small"
                notched
                displayEmpty
              >
                <MenuItem value="all">All Months</MenuItem>
                {months.map(month => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: { xs: '45%', sm: 120, md: 150 }, flexGrow: { xs: 1, sm: 0 } }} size="small">
              <InputLabel shrink>State</InputLabel>
              <Select
                value={selectedState}
                label="State"
                onChange={(e) => setSelectedState(e.target.value)}
                size="small"
                notched
                displayEmpty
              >
                <MenuItem value="all">All States</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
                {states.map(state => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: { xs: '100%', sm: 200, md: 250 }, flexGrow: { xs: 1, sm: 0 } }} size="small">
              <InputLabel shrink>Job Title</InputLabel>
              <Select
                value={selectedJobTitle}
                label="Job Title"
                onChange={(e) => setSelectedJobTitle(e.target.value)}
                size="small"
                disabled={!selectedCompany}
                notched
                displayEmpty
              >
                <MenuItem value="all">All Titles</MenuItem>
                {jobTitles.map(title => (
                  <MenuItem key={title} value={title}>
                    {truncateTitle(title, 40)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>

        {/* Jobs Table */}
        <TableContainer component={Paper} sx={{ maxHeight: { xs: 400, sm: 450, md: 500 }, overflowX: 'auto' }}>
        <Table stickyHeader size="small" sx={{ minWidth: { xs: 600, sm: 700, md: 800 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Job Title</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Role Type</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Level</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Salary</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Posted</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredJobs.map((job, index) => (
              <TableRow 
                key={index}
                sx={{ '&:hover': { bgcolor: 'grey.50' } }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500 }}
                    title={job.data_job_title}
                  >
                    {truncateTitle(job.data_job_title)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={job.ai_ml_subcategory} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {job.title_level}
                  </Typography>
                </TableCell>
                <TableCell>
                  {job.is_remote ? (
                    <Chip label="Remote" size="small" color="success" sx={{ fontSize: '0.7rem' }} />
                  ) : (
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {`${job.data_location_city || ''}, ${job.data_location_state || ''}`}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {formatSalary(job.max_salary)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                    {formatDate(job.data_posted)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    component="a"
                    href={job.data_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'primary.main' }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </ChartContainer>
  )
}

