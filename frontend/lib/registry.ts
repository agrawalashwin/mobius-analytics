// Chart registry - auto-discovers all charts
import { ChartConfig, ChartRegistry } from './types'

// This will be populated dynamically
export const chartRegistry: ChartRegistry = {}

/**
 * Register a chart in the registry
 */
export function registerChart(config: ChartConfig) {
  chartRegistry[config.id] = config
}

/**
 * Get all charts
 */
export function getAllCharts(): ChartConfig[] {
  return Object.values(chartRegistry)
}

/**
 * Get charts by category
 */
export function getChartsByCategory(category: string): ChartConfig[] {
  return Object.values(chartRegistry).filter(c => c.category === category)
}

/**
 * Get chart by ID
 */
export function getChartById(id: string): ChartConfig | undefined {
  return chartRegistry[id]
}

/**
 * Get charts by tag
 */
export function getChartsByTag(tag: string): ChartConfig[] {
  return Object.values(chartRegistry).filter(c => c.tags.includes(tag))
}

/**
 * Search charts by name or description
 */
export function searchCharts(query: string): ChartConfig[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(chartRegistry).filter(
    c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get chart categories
 */
export function getCategories(): string[] {
  const categories = new Set(Object.values(chartRegistry).map(c => c.category))
  return Array.from(categories)
}

/**
 * Get all tags
 */
export function getAllTags(): string[] {
  const tags = new Set<string>()
  Object.values(chartRegistry).forEach(c => {
    c.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
}

