"use client"

import { Box, Typography, Stack, Button, Avatar } from "@mui/material"
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline"

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
}

export function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <Box
      sx={{
        position: "relative",
        mb: { xs: 3, sm: 5 },
        px: { xs: 2, sm: 4 },
        py: { xs: 4, sm: 7 },
        borderRadius: 4,
        background: "linear-gradient(180deg, rgba(41,112,255,0.05) 0%, rgba(41,112,255,0.00) 100%)",
        textAlign: "center",
      }}
    >
      {/* Trust pill */}
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.25, py: 0.5, borderRadius: 999, backgroundColor: 'rgba(41,112,255,0.08)', border: '1px solid', borderColor: 'rgba(41,112,255,0.25)', mb: 1.5 }}>
        <Stack direction="row" spacing={-0.6} sx={{ mr: 0.5 }}>
          <Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>A</Avatar>
          <Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>B</Avatar>
          <Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>C</Avatar>
        </Stack>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>Trusted by 1M+ users</Typography>
      </Box>

      {eyebrow && (
        <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 1, fontWeight: 800 }}>
          {eyebrow}
        </Typography>
      )}

      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          mb: 1,
          fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.25rem' },
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, mx: 'auto', mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      {/* Primary CTA */}
      <Stack spacing={1} alignItems="center">
        <Button variant="contained" color="primary" size="large" href="#dashboard"
          sx={{ borderRadius: 999, px: 3, py: 1.25, fontWeight: 800 }}>
          Get Started For Free
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <CheckCircleOutline fontSize="small" sx={{ color: 'primary.main' }} /> No credit card required
        </Typography>
      </Stack>
    </Box>
  )
}

