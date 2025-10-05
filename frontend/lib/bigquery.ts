// BigQuery client for fetching data
import { BigQueryRow, BigQueryResponse } from './types'

const PROJECT_ID = process.env.NEXT_PUBLIC_GCP_PROJECT_ID || 'jobs-data-linkedin'
const DATASET_ID = process.env.NEXT_PUBLIC_BQ_DATASET_ID || 'mobius_analytics_engine'

interface QueryOptions {
  view?: string
  query?: string
  params?: Record<string, any>
  maxResults?: number
}

/**
 * Fetch data from BigQuery
 * This will call our Next.js API route which handles the actual BigQuery connection
 */
export async function fetchBigQueryData(options: QueryOptions): Promise<BigQueryResponse> {
  const { view, query, params, maxResults = 1000 } = options
  
  try {
    // Build the query
    let sql = query
    if (!sql && view) {
      sql = `SELECT * FROM \`${PROJECT_ID}.${DATASET_ID}.${view}\` LIMIT ${maxResults}`
    }
    
    if (!sql) {
      throw new Error('Either view or query must be provided')
    }
    
    // Call our API route
    const response = await fetch('/api/bigquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: sql,
        params,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch data from BigQuery')
    }
    
    const result = await response.json()
    
    return {
      data: result.data || [],
      totalRows: result.totalRows || 0,
      cached: result.cached || false,
    }
  } catch (error) {
    console.error('BigQuery fetch error:', error)
    throw error
  }
}

/**
 * Format BigQuery row data for charts
 */
export function formatChartData(rows: BigQueryRow[]): any[] {
  return rows.map(row => {
    const formatted: any = {}
    
    for (const [key, value] of Object.entries(row)) {
      // Handle different data types
      if (value === null || value === undefined) {
        formatted[key] = null
      } else if (typeof value === 'object' && 'value' in value) {
        // BigQuery returns some values wrapped in objects
        formatted[key] = value.value
      } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        // Try to parse dates
        formatted[key] = new Date(value)
      } else {
        formatted[key] = value
      }
    }
    
    return formatted
  })
}

/**
 * Mock data for development (when BigQuery is not available)
 */
export function getMockData(view: string): BigQueryRow[] {
  const mockDataMap: Record<string, BigQueryRow[]> = {
    monthly_ai_vs_swe_salary_trends: [
      { month: '2025-04-01', role_category: 'AI/ML Engineer', avg_salary: 231465, job_count: 851 },
      { month: '2025-04-01', role_category: 'Software Engineer', avg_salary: 200906, job_count: 6198 },
      { month: '2025-05-01', role_category: 'AI/ML Engineer', avg_salary: 233619, job_count: 2291 },
      { month: '2025-05-01', role_category: 'Software Engineer', avg_salary: 206117, job_count: 14253 },
      { month: '2025-06-01', role_category: 'AI/ML Engineer', avg_salary: 221124, job_count: 3646 },
      { month: '2025-06-01', role_category: 'Software Engineer', avg_salary: 203416, job_count: 17043 },
      { month: '2025-07-01', role_category: 'AI/ML Engineer', avg_salary: 230021, job_count: 3045 },
      { month: '2025-07-01', role_category: 'Software Engineer', avg_salary: 205608, job_count: 17493 },
      { month: '2025-08-01', role_category: 'AI/ML Engineer', avg_salary: 226456, job_count: 4766 },
      { month: '2025-08-01', role_category: 'Software Engineer', avg_salary: 205337, job_count: 17455 },
      { month: '2025-09-01', role_category: 'AI/ML Engineer', avg_salary: 225167, job_count: 3494 },
      { month: '2025-09-01', role_category: 'Software Engineer', avg_salary: 199921, job_count: 12689 },
    ],
    ai_ml_subcategory_analysis: [
      { ai_ml_subcategory: 'ML Engineer', job_count: 8764, avg_salary: 224190 },
      { ai_ml_subcategory: 'LLM/GenAI Engineer', job_count: 3809, avg_salary: 219524 },
      { ai_ml_subcategory: 'AI Engineer', job_count: 3384, avg_salary: 224672 },
      { ai_ml_subcategory: 'Deep Learning Engineer', job_count: 384, avg_salary: 243039 },
      { ai_ml_subcategory: 'AI/ML Research', job_count: 492, avg_salary: 238298 },
      { ai_ml_subcategory: 'MLOps Engineer', job_count: 232, avg_salary: 211568 },
    ],
    ai_ml_top_companies: [
      { data_company: 'Google', job_count: 660, avg_salary: 226836 },
      { data_company: 'Apple', job_count: 696, avg_salary: 286611 },
      { data_company: 'Microsoft', job_count: 450, avg_salary: 233209 },
      { data_company: 'Meta', job_count: 320, avg_salary: 211048 },
      { data_company: 'Amazon', job_count: 550, avg_salary: 235383 },
      { data_company: 'NVIDIA', job_count: 222, avg_salary: 317233 },
      { data_company: 'TikTok', job_count: 268, avg_salary: 283750 },
      { data_company: 'Uber', job_count: 294, avg_salary: 216779 },
    ],
  }
  
  return mockDataMap[view] || []
}

/**
 * Check if we should use mock data (for development)
 */
export function shouldUseMockData(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
         process.env.NODE_ENV === 'development'
}

