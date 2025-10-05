// Data fetching hooks using TanStack Query
'use client'

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchBigQueryData, formatChartData, getMockData, shouldUseMockData } from './bigquery'
import { ChartData } from './types'

interface UseChartDataOptions {
  source: 'bigquery' | 'api' | 'static'
  view?: string
  query?: string
  params?: Record<string, any>
  refreshInterval?: number
}

interface ChartDataResult {
  data: ChartData[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch chart data with caching and automatic refetching
 */
export function useChartData(options: UseChartDataOptions): ChartDataResult {
  const { source, view, query, params, refreshInterval } = options

  console.log('🎯 useChartData called with:', { source, view, query: query?.substring(0, 50) })

  const queryResult: UseQueryResult<ChartData[], Error> = useQuery({
    queryKey: ['chart-data', view, query, params],
    queryFn: async () => {
      console.log('🔄 Fetching data for view:', view)
      console.log('🔧 shouldUseMockData:', shouldUseMockData())
      console.log('🔧 NEXT_PUBLIC_USE_MOCK_DATA:', process.env.NEXT_PUBLIC_USE_MOCK_DATA)

      // Use mock data in development
      if (shouldUseMockData() && view) {
        console.log('📦 Using mock data for:', view)
        const mockData = getMockData(view)
        console.log('📦 Mock data rows:', mockData.length)
        const formatted = formatChartData(mockData)
        console.log('✅ Formatted data rows:', formatted.length)
        return formatted
      }

      // Fetch from BigQuery
      if (source === 'bigquery') {
        console.log('🔍 Fetching from BigQuery for view:', view)
        const result = await fetchBigQueryData({ view, query, params })
        console.log('✅ BigQuery returned:', result.data.length, 'rows')
        return formatChartData(result.data)
      }

      // Fetch from API
      if (source === 'api') {
        const response = await fetch(`/api/data/${view}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        return await response.json()
      }

      // Static data
      console.log('⚠️ No data source matched, returning empty array')
      return []
    },
    staleTime: refreshInterval ? refreshInterval * 1000 : 5 * 60 * 1000, // Default 5 minutes
    refetchInterval: refreshInterval ? refreshInterval * 1000 : false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: true, // Explicitly enable the query
  })

  console.log('🎯 useChartData result:', {
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isError: queryResult.isError,
    dataLength: queryResult.data?.length || 0,
    status: queryResult.status,
  })

  return {
    data: queryResult.data || [],
    loading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  }
}

/**
 * Hook to fetch multiple chart datasets
 */
export function useMultipleChartData(
  options: UseChartDataOptions[]
): ChartDataResult[] {
  const results = options.map(opt => useChartData(opt))
  return results
}

/**
 * Hook to fetch data with custom transformation
 */
export function useTransformedChartData<T>(
  options: UseChartDataOptions,
  transform: (data: ChartData[]) => T
): {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
} {
  const { data, loading, error, refetch } = useChartData(options)
  
  return {
    data: data.length > 0 ? transform(data) : null,
    loading,
    error,
    refetch,
  }
}

