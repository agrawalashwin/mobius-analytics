"use client"

import { useState } from "react"
import { Box, Typography, ToggleButtonGroup, ToggleButton, Stack } from "@mui/material"

interface ChartSectionIntroProps {
  onLevelChange?: (level: string) => void
  onRegionChange?: (region: string) => void
}

export function ChartSectionIntro({ onLevelChange, onRegionChange }: ChartSectionIntroProps) {
  const [level, setLevel] = useState<string>('all')
  const [region, setRegion] = useState<string>('us')

  const handleLevelChange = (event: React.MouseEvent<HTMLElement>, newLevel: string | null) => {
    if (newLevel !== null) {
      setLevel(newLevel)
      onLevelChange?.(newLevel)
    }
  }

  const handleRegionChange = (event: React.MouseEvent<HTMLElement>, newRegion: string | null) => {
    if (newRegion !== null) {
      setRegion(newRegion)
      onRegionChange?.(newRegion)
    }
  }

  return (
    <Box
      component="section"
      sx={{
        mb: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 4 },
        textAlign: 'center',
      }}
    >
      {/* H2 - Chart section intro */}
      <Typography
        component="h2"
        variant="h4"
        sx={{
          fontWeight: 800,
          letterSpacing: "-0.015em",
          lineHeight: 1.2,
          mb: 1,
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
          color: 'text.primary',
        }}
      >
        Are AI/ML Engineers Earning More Than Software Engineers?
      </Typography>

      {/* Caption */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 3,
          fontSize: { xs: '0.9rem', sm: '0.95rem' },
        }}
      >
        Rolling 12-week median; toggle by Level and Region.
      </Typography>

      {/* Toggles */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        {/* Level Toggle */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mb: 1,
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Level
          </Typography>
          <ToggleButtonGroup
            value={level}
            exclusive
            onChange={handleLevelChange}
            aria-label="Experience level filter"
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 2,
                py: 0.75,
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="all" aria-label="All levels">
              All
            </ToggleButton>
            <ToggleButton value="l3" aria-label="Level 3">
              L3
            </ToggleButton>
            <ToggleButton value="l4" aria-label="Level 4">
              L4
            </ToggleButton>
            <ToggleButton value="l5" aria-label="Level 5">
              L5
            </ToggleButton>
            <ToggleButton value="l6" aria-label="Level 6">
              L6
            </ToggleButton>
            <ToggleButton value="l7" aria-label="Level 7">
              L7
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Region Toggle */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mb: 1,
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Region
          </Typography>
          <ToggleButtonGroup
            value={region}
            exclusive
            onChange={handleRegionChange}
            aria-label="Region filter"
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 2,
                py: 0.75,
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="us" aria-label="United States">
              US
            </ToggleButton>
            <ToggleButton value="bay-area" aria-label="Bay Area">
              Bay Area
            </ToggleButton>
            <ToggleButton value="nyc" aria-label="New York City">
              NYC
            </ToggleButton>
            <ToggleButton value="eu" aria-label="Europe">
              EU
            </ToggleButton>
            <ToggleButton value="remote" aria-label="Remote">
              Remote
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>

      {/* Current selection display */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
          fontSize: '0.8rem',
        }}
      >
        Showing: <strong>{level === 'all' ? 'All levels' : level.toUpperCase()}</strong> • <strong>{region === 'us' ? 'US' : region === 'bay-area' ? 'Bay Area' : region === 'nyc' ? 'NYC' : region === 'eu' ? 'EU' : 'Remote'}</strong>
      </Typography>
    </Box>
  )
}

