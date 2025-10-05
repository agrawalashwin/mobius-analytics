'use client'

import { AppShell } from '@/components/AppShell'
import { Box, Typography, Container } from '@mui/material'

export default function CompareAIMLvsSWEPage() {
  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            AI/ML vs Software Engineer Comparison
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Detailed salary comparison coming soon...
          </Typography>
        </Box>
      </Container>
    </AppShell>
  )
}

