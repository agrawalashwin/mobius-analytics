'use client'

import { Box, Typography } from '@mui/material'
import { AppShell } from '@/components/AppShell'

export default function TrendsPage() {
  return (
    <AppShell>
      <Typography variant="h4" component="h1" gutterBottom>
        Market Trends
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Coming soon: Job market trends and predictions
      </Typography>
    </AppShell>
  )
}
