'use client'

import { Card, CardContent, Skeleton, Box } from '@mui/material'
import { motion } from 'framer-motion'

// Deterministic heights to avoid hydration mismatch
const barHeights = ['60%', '80%', '50%', '90%', '70%', '65%', '85%', '75%']

export function ChartSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card elevation={2}>
        <CardContent>
          {/* Title skeleton */}
          <Skeleton
            variant="text"
            width="60%"
            height={32}
            sx={{ mb: 1 }}
          />

          {/* Description skeleton */}
          <Skeleton
            variant="text"
            width="40%"
            height={20}
            sx={{ mb: 3 }}
          />

          {/* Chart skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 300 }}>
            {barHeights.map((height, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width="12%"
                height={height}
                sx={{
                  borderRadius: 1,
                  animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

