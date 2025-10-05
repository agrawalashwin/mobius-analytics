'use client'

import { Box, Typography } from '@mui/material'
import { AppShell } from '@/components/AppShell'

export default function CompaniesPage() {
  return (
    <AppShell>
      <Typography variant="h4" component="h1" gutterBottom>
        Company Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Coming soon: Company hiring trends and insights
      </Typography>
    </AppShell>
  )
}
