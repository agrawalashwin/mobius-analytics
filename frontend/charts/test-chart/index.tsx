'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartProps } from '@/lib/types'
import { chartConfig } from './config'
import { shouldUseMockData } from '@/lib/bigquery'

export default function TestChart({ config = chartConfig }: ChartProps) {
  const [mounted, setMounted] = useState(false)
  const [testData, setTestData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    console.log('🧪 TestChart mounted!')
    console.log('🧪 USE_MOCK_DATA:', process.env.NEXT_PUBLIC_USE_MOCK_DATA)
    console.log('🧪 shouldUseMockData():', shouldUseMockData())

    // Test API call
    const testAPI = async () => {
      try {
        console.log('🧪 Testing BigQuery API...')
        const response = await fetch('/api/bigquery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'SELECT * FROM `jobs-data-linkedin.mobius_analytics_engine.monthly_ai_vs_swe_salary_trends` LIMIT 3'
          })
        })

        const result = await response.json()
        console.log('🧪 API Response:', result)
        setTestData(result)
        setLoading(false)
      } catch (err: any) {
        console.error('🧪 API Error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    testAPI()
  }, [])

  if (!mounted) return <CircularProgress />

  return (
    <ChartContainer
      title="🧪 API Test Chart"
      description="Testing BigQuery API connection"
      width={config.display.width}
      height={config.display.height}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          p: 3,
        }}
      >
        {loading ? (
          <>
            <CircularProgress />
            <Typography>Testing API...</Typography>
          </>
        ) : error ? (
          <>
            <Typography variant="h4" color="error">❌ Error</Typography>
            <Typography color="error">{error}</Typography>
          </>
        ) : testData?.data ? (
          <>
            <Typography variant="h3" color="success.main">✅ API WORKS!</Typography>
            <Typography variant="body1">Received {testData.data.length} rows</Typography>
            <Box component="pre" sx={{ fontSize: 10, overflow: 'auto', maxWidth: '100%' }}>
              {JSON.stringify(testData.data[0], null, 2)}
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h4" color="warning.main">⚠️ No Data</Typography>
            <Typography>API returned but no data</Typography>
            <Box component="pre" sx={{ fontSize: 10 }}>
              {JSON.stringify(testData, null, 2)}
            </Box>
          </>
        )}
      </Box>
    </ChartContainer>
  )
}

