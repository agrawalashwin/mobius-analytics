'use client'

import { useState, ReactNode } from 'react'
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material'
import {
  Menu as MenuIcon,
  AttachMoney,
  Business,
  Psychology,
  TrendingUp,
  Close,
} from '@mui/icons-material'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const drawerWidth = 260

const navItems: any[] = []

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const pathname = usePathname()
  const router = useRouter()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  // Legacy drawer removed; top navigation only
  const drawer = null

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top App Bar (no left nav) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'saturate(180%) blur(8px)',
        }}
      >
        <Toolbar sx={{ display: 'flex', gap: 2, backdropFilter: 'saturate(180%) blur(8px)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <TrendingUp sx={{ color: 'primary.main' }} />
            <Typography variant="h6" color="text.primary" fontWeight={700}>
              Mobius Analytics
            </Typography>
          </Box>

          {/* Top navigation */}
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                color={isActive ? 'primary' : 'inherit'}
                startIcon={item.icon}
                sx={{
                  position: 'relative',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 700 : 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 1,
                  '&:hover': { color: 'primary.main', backgroundColor: 'transparent' },
                  '&::after': isActive ? {
                    content: '""',
                    position: 'absolute',
                    left: 10,
                    right: 10,
                    bottom: -6,
                    height: 2,
                    borderRadius: 2,
                    backgroundColor: 'primary.main',
                  } : {},
                }}
              >
                {item.label}
              </Button>
            )
          })}
          <Button
            variant="contained"
            color="primary"
            href="https://calendly.mobiusengine.ai"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ ml: 1, borderRadius: 999, px: 2.2, py: 0.8, fontWeight: 800,
              backgroundImage: 'linear-gradient(180deg, #5B8CFF 0%, #2970FF 100%)',
              boxShadow: '0 8px 16px rgba(41,112,255,0.24)',
              '&:hover': { backgroundImage: 'linear-gradient(180deg, #6C98FF 0%, #2B68F7 100%)', boxShadow: '0 10px 20px rgba(41,112,255,0.28)' }
            }}
          >
            Contact Sales
          </Button>
        </Toolbar>
      </AppBar>

      {/* No left drawer; top navigation only */}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          backgroundImage: 'radial-gradient(80% 140px at 50% 0, rgba(41,112,255,0.10), rgba(0,0,0,0) 72%)',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2, sm: 3, md: 5 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  )
}

