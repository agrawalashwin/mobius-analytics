"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Stack, Button, TextField, InputAdornment, Chip, Link as MuiLink } from "@mui/material"
import { Search, TrendingUp, ArrowForward } from "@mui/icons-material"

interface SalariesHeroProps {
  medianTC?: string
  premiumVsSWE?: string
  lastUpdated?: string
}

export function SalariesHero({ medianTC, premiumVsSWE, lastUpdated }: SalariesHeroProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Track analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'hero_search_submit', {
          query: searchQuery.trim()
        })
      }
      // Route to search results
      router.push(`/salaries/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleCTAClick = (cta: string, elementId: string) => {
    // Track analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'hero_cta_click', {
        cta: cta
      })
    }
    // Scroll to element
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        mb: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 4 },
        py: { xs: 5, sm: 8, md: 10 },
        background: "linear-gradient(180deg, rgba(41,112,255,0.04) 0%, rgba(41,112,255,0.00) 100%)",
        textAlign: "center",
      }}
    >
      {/* Trust pill */}
      <Box sx={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 1, 
        px: 1.5, 
        py: 0.6, 
        borderRadius: 999, 
        backgroundColor: 'rgba(41,112,255,0.08)', 
        border: '1px solid', 
        borderColor: 'rgba(41,112,255,0.25)', 
        mb: 2 
      }}>
        <TrendingUp sx={{ fontSize: 16, color: 'primary.main' }} />
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.75rem' }}>
          From over 5M+ AI Enriched Job Postings Data
        </Typography>
      </Box>

      {/* H1 - Only one on page */}
      <Typography
        component="h1"
        sx={{
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          mb: 2,
          fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
          color: 'text.primary',
        }}
      >
        What Do AI/ML Engineers Earn Today?
      </Typography>

      {/* Subhead */}
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          maxWidth: 720, 
          mx: 'auto', 
          mb: 3,
          fontSize: { xs: '1rem', sm: '1.1rem' },
          lineHeight: 1.6,
        }}
      >
        See real-time salaries, premiums vs Software Engineers, and where pay is rising fastest. Filter by city, level, company, and skill.
      </Typography>



      {/* Primary & Secondary CTAs */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 1.5 }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={<ArrowForward />}
          onClick={() => handleCTAClick('Explore AI/ML Salaries', 'ai-roles-section')}
          aria-label="Explore AI/ML Salaries"
          sx={{
            borderRadius: 999,
            px: 3,
            py: 1.25,
            fontWeight: 800,
            minWidth: { xs: '100%', sm: 'auto' },
          }}
        >
          Explore AI/ML Salaries
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => handleCTAClick('Compare to Software Engineer', 'comparison-section')}
          aria-label="Compare AI/ML to Software Engineer salaries"
          sx={{
            borderRadius: 999,
            px: 3,
            py: 1.25,
            fontWeight: 700,
            minWidth: { xs: '100%', sm: 'auto' },
          }}
        >
          Compare to Software Engineer
        </Button>
      </Stack>

      {/* Microcopy under CTAs */}
      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ 
          display: 'block',
          mb: 4,
          fontSize: '0.8rem',
        }}
      >
        Free & No Login Required
      </Typography>


    </Box>
  )
}

