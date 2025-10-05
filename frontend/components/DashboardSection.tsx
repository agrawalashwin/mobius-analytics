"use client"

import { Box } from "@mui/material"
import { ReactNode } from "react"

interface DashboardSectionProps {
  children: ReactNode
  id?: string
}

export function DashboardSection({ children, id = "dashboard" }: DashboardSectionProps) {
  return (
    <Box id={id}
      sx={{
        position: 'relative',
        borderRadius: 4,
        p: { xs: 1.5, sm: 2, md: 2.5 },
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        // Soft glow ring similar to inspiration
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: -2,
          pointerEvents: 'none',
          borderRadius: 16,
          background: 'radial-gradient(60% 40% at 50% 0%, rgba(50,104,145,0.15), rgba(50,104,145,0) 70%)',
          zIndex: 0,
        },
        '& > *': { position: 'relative', zIndex: 1 },
      }}
    >
      {children}
    </Box>
  )
}

