// Dynamic chart loader
'use client'

import { lazy, ComponentType } from 'react'
import { ChartProps } from './types'
import { registerChart } from './registry'

// Import all charts statically for Next.js
import AiSalaryPremiumChart from '@/charts/ai-salary-premium/index'
import AiRolesSalaryChart from '@/charts/ai-roles-salary/index'
import TopCompaniesHiringChart from '@/charts/top-companies-hiring/index'
import SalaryDistributionChart from '@/charts/salary-distribution/index'
import MonthlyTrendsChart from '@/charts/monthly-trends/index'
import AiMlSkillsDemandChart from '@/charts/aiml-skills-demand/index'
import CompanyJobListingsChart from '@/charts/company-job-listings/index'
import SalaryByRoleTypeChart from '@/charts/salary-by-role-type/index'
import OverallJobMarketTrendsChart from '@/charts/overall-job-market-trends/index'
import TestChart from '@/charts/test-chart/index'
import SimpleTestChart from '@/charts/simple-test/index'

// Import chart configs
import { chartConfig as aiSalaryPremiumConfig } from '@/charts/ai-salary-premium/config'
import { chartConfig as aiRolesSalaryConfig } from '@/charts/ai-roles-salary/config'
import { chartConfig as topCompaniesHiringConfig } from '@/charts/top-companies-hiring/config'
import { config as salaryDistributionConfig } from '@/charts/salary-distribution/config'
import { config as monthlyTrendsConfig } from '@/charts/monthly-trends/config'
import { config as aimlSkillsDemandConfig } from '@/charts/aiml-skills-demand/config'
import { chartConfig as companyJobListingsConfig } from '@/charts/company-job-listings/config'
import { chartConfig as salaryByRoleTypeConfig } from '@/charts/salary-by-role-type/config'
import { chartConfig as overallJobMarketTrendsConfig } from '@/charts/overall-job-market-trends/config'
import { chartConfig as testChartConfig } from '@/charts/test-chart/config'
import { chartConfig as simpleTestConfig } from '@/charts/simple-test/config'

// Chart registry map
const chartComponents: Record<string, ComponentType<ChartProps>> = {
  'ai-salary-premium': AiSalaryPremiumChart,
  'ai-roles-salary': AiRolesSalaryChart,
  'top-companies-hiring': TopCompaniesHiringChart,
  'salary-distribution': SalaryDistributionChart,
  'monthly-trends': MonthlyTrendsChart,
  'aiml-skills-demand': AiMlSkillsDemandChart,
  'company-job-listings': CompanyJobListingsChart,
  'salary-by-role-type': SalaryByRoleTypeChart,
  'overall-job-market-trends': OverallJobMarketTrendsChart,
  'test-chart': TestChart,
  'simple-test': SimpleTestChart,
}

// Register all charts immediately
registerChart(aiSalaryPremiumConfig)
registerChart(aiRolesSalaryConfig)
registerChart(topCompaniesHiringConfig)
registerChart(salaryDistributionConfig)
registerChart(monthlyTrendsConfig)
registerChart(aimlSkillsDemandConfig)
registerChart(companyJobListingsConfig)
registerChart(salaryByRoleTypeConfig)
registerChart(overallJobMarketTrendsConfig)
registerChart(testChartConfig)
registerChart(simpleTestConfig)

console.log('✅ Charts registered in chart-loader:', Object.keys(chartComponents))

/**
 * Load a chart component
 */
export function loadChart(chartId: string): ComponentType<ChartProps> {
  const component = chartComponents[chartId]

  if (!component) {
    console.error(`❌ Chart component not found: ${chartId}`)
    console.log('📊 Available components:', Object.keys(chartComponents))
    // Return a lazy-loaded error component
    return lazy(() =>
      import('@/components/ChartError').then(mod => ({
        default: () => mod.ChartError({ error: new Error(`Chart not found: ${chartId}`) })
      }))
    )
  }

  console.log('✅ Loaded chart component:', chartId)
  return component
}

/**
 * Get all available chart IDs
 */
export function getAvailableChartIds(): string[] {
  return Object.keys(chartComponents)
}

