'use client'

import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material'
import { InfoOutlined, Refresh, Download } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ChartContainerProps {
  title: string // Question format
  description?: string
  children: ReactNode
  onRefresh?: () => void
  onDownload?: () => void
  width?: 'full' | 'half' | 'third'
  height?: number
  methodology?: string
}

export function ChartContainer({
  title,
  description,
  children,
  onRefresh,
  onDownload,
  width = 'full',
  height = 400,
  methodology,
}: ChartContainerProps) {
  // Responsive width mapping
  const widthMap = {
    full: { xs: '100%', sm: '100%', md: '100%' },
    half: { xs: '100%', sm: '100%', md: '50%' },
    third: { xs: '100%', sm: '50%', md: '33.333%' },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ width: '100%' }}
    >
      <Box sx={{ width: widthMap[width], p: { xs: 0.5, sm: 1 } }}>
        <Card
          elevation={0}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'rgba(16, 24, 40, 0.08)',
            borderRadius: 3,
            backgroundImage: 'linear-gradient(180deg, rgba(41,112,255,0.04), rgba(41,112,255,0))',
            transition: 'box-shadow 200ms ease, transform 200ms ease',
            boxShadow: '0 1px 2px rgba(16,24,40,0.06)',
            '&:hover': { boxShadow: '0 12px 24px rgba(41,112,255,0.12), 0 2px 8px rgba(16,24,40,0.06)', transform: 'translateY(-2px)' }
          }}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              p: { xs: 2, sm: 2.5, md: 3 },
              '&:last-child': { pb: { xs: 2, sm: 2.5, md: 3 } },
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: { xs: 1.5, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 },
              }}
            >
              <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 0.5,
                    letterSpacing: '-0.006em',
                    fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.3rem' },
                  }}
                >
                  {title}
                </Typography>

                {description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    {description}
                  </Typography>
                )}
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {description && (
                  <Tooltip title="Chart Information">
                    <IconButton size="small" color="default">
                      <InfoOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {onRefresh && (
                  <Tooltip title="Refresh Data">
                    <IconButton size="small" onClick={onRefresh} color="primary">
                      <Refresh fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {onDownload && (
                  <Tooltip title="Download Chart">
                    <IconButton size="small" onClick={onDownload} color="primary">
                      <Download fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>

            {/* Chart Content */}
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: 250, sm: 300, md: height },
                width: '100%',
                overflow: 'hidden',
                fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
              }}
            >
              {children}
            </Box>

            {/* Methodology & Caveats */}
            {methodology && (
              <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Methodology & caveats
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, display: 'block' }}>
                  {methodology}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  )
}

