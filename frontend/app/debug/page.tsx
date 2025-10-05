'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material'
import { AppShell } from '@/components/AppShell'
import { getAllCharts } from '@/lib/registry'
import { getMockData, shouldUseMockData } from '@/lib/bigquery'
import { useChartData } from '@/lib/data-fetcher'

export default function DebugPage() {
  const [charts, setCharts] = useState<any[]>([])
  const [useMock, setUseMock] = useState(false)
  const [mockDataSample, setMockDataSample] = useState<any>(null)
  
  // Test data fetching
  const { data, loading, error } = useChartData({
    source: 'bigquery',
    view: 'monthly_ai_vs_swe_salary_trends',
  })
  
  useEffect(() => {
    setCharts(getAllCharts())
    setUseMock(shouldUseMockData())
    setMockDataSample(getMockData('monthly_ai_vs_swe_salary_trends'))
  }, [])
  
  return (
    <AppShell>
      <Typography variant="h4" gutterBottom>
        Debug Information
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Environment */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Environment
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="USE_MOCK_DATA" 
                secondary={process.env.NEXT_PUBLIC_USE_MOCK_DATA || 'not set'} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="shouldUseMockData()" 
                secondary={useMock ? 'true' : 'false'} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="NODE_ENV" 
                secondary={process.env.NODE_ENV} 
              />
            </ListItem>
          </List>
        </Paper>
        
        {/* Registered Charts */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Registered Charts ({charts.length})
          </Typography>
          <List>
            {charts.map((chart) => (
              <ListItem key={chart.id}>
                <ListItemText 
                  primary={chart.id} 
                  secondary={chart.name} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        
        {/* Mock Data Sample */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mock Data Sample
          </Typography>
          <Typography variant="body2" component="pre" sx={{ overflow: 'auto' }}>
            {JSON.stringify(mockDataSample, null, 2)}
          </Typography>
        </Paper>
        
        {/* Data Fetcher Test */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Data Fetcher Test
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Loading" 
                secondary={loading ? 'true' : 'false'} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Error" 
                secondary={error ? error.message : 'none'} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Data Rows" 
                secondary={data?.length || 0} 
              />
            </ListItem>
          </List>
          {data && data.length > 0 && (
            <Typography variant="body2" component="pre" sx={{ overflow: 'auto', mt: 2 }}>
              {JSON.stringify(data.slice(0, 3), null, 2)}
            </Typography>
          )}
        </Paper>
      </Box>
    </AppShell>
  )
}

