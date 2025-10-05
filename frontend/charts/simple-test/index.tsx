'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, Paper } from '@mui/material'

export default function SimpleTestChart() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🚀 SimpleTestChart mounted')
    
    const fetchData = async () => {
      try {
        console.log('🔍 Fetching data...')
        const response = await fetch('/api/bigquery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'SELECT * FROM `jobs-data-linkedin.mobius_analytics_engine.monthly_ai_vs_swe_salary_trends` LIMIT 5'
          })
        })
        
        const result = await response.json()
        console.log('✅ Got result:', result)
        setData(result)
        setLoading(false)
      } catch (err) {
        console.error('❌ Error:', err)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <Paper sx={{ p: 3, minHeight: 400 }}>
      <Typography variant="h5" gutterBottom>Simple Test Chart</Typography>
      
      {loading && <Typography>Loading...</Typography>}
      
      {!loading && data && (
        <Box>
          <Typography variant="h6">Success!</Typography>
          <Typography>Rows: {data.data?.length || 0}</Typography>
          <Typography component="pre" sx={{ fontSize: 10, overflow: 'auto', mt: 2 }}>
            {JSON.stringify(data, null, 2)}
          </Typography>
        </Box>
      )}
      
      {!loading && !data && (
        <Typography color="error">No data received</Typography>
      )}
    </Paper>
  )
}

