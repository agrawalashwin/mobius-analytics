'use client'

import { Card, CardContent, Typography, Button, Box, Alert } from '@mui/material'
import { ErrorOutline, Refresh } from '@mui/icons-material'
import { motion } from 'framer-motion'

interface ChartErrorProps {
  error: Error | null
  onRetry?: () => void
}

export function ChartError({ error, onRetry }: ChartErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card elevation={2}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
              textAlign: 'center',
              gap: 2,
            }}
          >
            <ErrorOutline 
              sx={{ 
                fontSize: 64, 
                color: 'error.main',
                opacity: 0.7,
              }} 
            />
            
            <Typography variant="h6" color="text.primary">
              Unable to Load Chart
            </Typography>
            
            <Alert severity="error" sx={{ maxWidth: 500 }}>
              {error?.message || 'An unexpected error occurred'}
            </Alert>
            
            {onRetry && (
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={onRetry}
                sx={{ mt: 1 }}
              >
                Try Again
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

