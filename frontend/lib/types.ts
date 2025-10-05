// Core types for the chart system

export interface ChartConfig {
  id: string
  name: string // Question format: "Are AI salaries declining?"
  description: string
  category: 'salaries' | 'companies' | 'skills' | 'trends'
  tags: string[]
  
  // Data configuration
  data: {
    source: 'bigquery' | 'api' | 'static'
    view?: string
    query?: string
    refreshInterval?: number // seconds
    params?: Record<string, any>
  }
  
  // Display configuration
  display: {
    type: 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'heatmap'
    width: 'full' | 'half' | 'third'
    height: number
    responsive: boolean
    showLegend?: boolean
    showGrid?: boolean
    animate?: boolean
  }
  
  // Metadata
  author: string
  version: string
  createdAt: string
  updatedAt?: string
  dependencies?: string[]

  // Explain the data and metrics shown in the chart
  methodology?: string
}

export interface ChartData {
  [key: string]: any
}

export interface ChartProps {
  config?: ChartConfig
  data?: ChartData[]
  loading?: boolean
  error?: Error | null
}

// BigQuery response types
export interface BigQueryRow {
  [key: string]: any
}

export interface BigQueryResponse {
  data: BigQueryRow[]
  totalRows: number
  cached: boolean
}

// Chart registry types
export interface ChartRegistry {
  [chartId: string]: ChartConfig
}

// Theme types for Material Design
export interface ChartTheme {
  primary: string
  secondary: string
  success: string
  warning: string
  error: string
  info: string
  background: string
  surface: string
  text: {
    primary: string
    secondary: string
    disabled: string
  }
}

