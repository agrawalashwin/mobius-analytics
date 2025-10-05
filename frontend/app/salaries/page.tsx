'use client'

import { useState, useEffect } from 'react'
import { Grid, Box } from '@mui/material'
import { AppShell } from '@/components/AppShell'
import { ChartRenderer } from '@/components/ChartRenderer'
import { SalariesHero } from '@/components/SalariesHero'
import { DashboardSection } from '@/components/DashboardSection'

export default function SalariesPage() {
  const [medianTC, setMedianTC] = useState<string>()
  const [premiumVsSWE, setPremiumVsSWE] = useState<string>()
  const [lastUpdated, setLastUpdated] = useState<string>()

  // Fetch hero stats from BigQuery
  useEffect(() => {
    const fetchHeroStats = async () => {
      try {
        const response = await fetch('/api/bigquery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              SELECT
                ROUND(AVG(ai_ml_median_salary), 0) as median_tc,
                ROUND(AVG(premium_percentage), 1) as premium_pct,
                MAX(month) as last_updated
              FROM \`jobs-data-linkedin.mobius_analytics_engine.monthly_ai_vs_swe_salary_trends\`
              WHERE CAST(month AS DATE) >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)
            `
          })
        })

        const result = await response.json()
        if (result.data && result.data.length > 0) {
          const stats = result.data[0]
          setMedianTC(stats.median_tc ? `$${Math.round(stats.median_tc / 1000)}K` : undefined)
          setPremiumVsSWE(stats.premium_pct ? stats.premium_pct.toString() : undefined)

          // Format date
          if (stats.last_updated) {
            const dateValue = stats.last_updated.value || stats.last_updated
            const date = new Date(dateValue)
            setLastUpdated(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))
          }
        }
      } catch (error) {
        console.error('Failed to fetch hero stats:', error)
      }
    }

    fetchHeroStats()
  }, [])

  return (
    <AppShell>
      <SalariesHero
        medianTC={medianTC}
        premiumVsSWE={premiumVsSWE}
        lastUpdated={lastUpdated}
      />

      {/* Comparison Section */}
      <Box id="comparison-section" sx={{ mb: 6 }}>
        <DashboardSection>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            <Grid xs={12}>
              <ChartRenderer chartId="ai-salary-premium" />
            </Grid>
          </Grid>
        </DashboardSection>
      </Box>

      {/* AI Roles Section */}
      <Box id="ai-roles-section" sx={{ mb: 6 }}>
        <DashboardSection>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            <Grid xs={12}>
              <ChartRenderer chartId="monthly-trends" />
            </Grid>
            <Grid xs={12}>
              <ChartRenderer chartId="salary-by-role-type" />
            </Grid>
            <Grid xs={12}>
              <ChartRenderer chartId="aiml-skills-demand" />
            </Grid>
            <Grid xs={12}>
              <ChartRenderer chartId="top-companies-hiring" />
            </Grid>
            <Grid xs={12}>
              <ChartRenderer chartId="company-job-listings" />
            </Grid>
          </Grid>
        </DashboardSection>
      </Box>
    </AppShell>
  )
}
