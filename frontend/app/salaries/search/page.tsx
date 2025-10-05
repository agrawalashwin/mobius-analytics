'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { Box, Typography, Container, Chip, CircularProgress } from '@mui/material'
import { Search } from '@mui/icons-material'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Search sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
          Search Results
        </Typography>
        {query && (
          <Chip
            label={`Searching for: "${query}"`}
            color="primary"
            sx={{ fontSize: '1rem', py: 2.5, px: 1 }}
          />
        )}
        <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
          Search functionality coming soon...
        </Typography>
      </Box>
    </Container>
  )
}

export default function SalariesSearchPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      }>
        <SearchContent />
      </Suspense>
    </AppShell>
  )
}

