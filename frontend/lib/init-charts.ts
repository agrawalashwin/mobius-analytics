// Initialize and register all charts
import { registerChart, getAllCharts, chartRegistry } from './registry'

// Import all chart configs
import { chartConfig as aiSalaryPremium } from '@/charts/ai-salary-premium/config'
import { chartConfig as aiRolesSalary } from '@/charts/ai-roles-salary/config'
import { chartConfig as topCompaniesHiring } from '@/charts/top-companies-hiring/config'

let initialized = false

/**
 * Register all charts
 * This function should be called once at app startup
 */
export function initializeCharts() {
  if (initialized) {
    console.log('⚠️ Charts already initialized')
    return
  }

  try {
    console.log('🔄 Initializing charts...')

    registerChart(aiSalaryPremium)
    console.log('✅ Registered:', aiSalaryPremium.id)

    registerChart(aiRolesSalary)
    console.log('✅ Registered:', aiRolesSalary.id)

    registerChart(topCompaniesHiring)
    console.log('✅ Registered:', topCompaniesHiring.id)

    initialized = true

    const charts = getAllCharts()
    console.log('✅ Charts initialized:', charts.length)
    console.log('📊 Available charts:', Object.keys(chartRegistry))
  } catch (error) {
    console.error('❌ Failed to initialize charts:', error)
  }
}

// Initialize immediately on module load
initializeCharts()

