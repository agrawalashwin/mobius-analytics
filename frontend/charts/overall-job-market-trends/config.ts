import { ChartConfig } from '@/lib/types'

export const chartConfig: ChartConfig = {
  id: 'overall-job-market-trends',
  name: 'Overall Job Market Trends',
  description: '4-week moving average of US job posting volume since April 2025',
  category: 'trends',
  tags: ['trends', 'market', 'weekly', 'volume'],
  
  data: {
    source: 'bigquery',
    view: 'weekly_job_market_trends',
    refreshInterval: 3600,
  },
  
  query: `
    SELECT
      week_start,
      state,
      seniority_level,
      role_type,
      SUM(job_count) as job_count,
      SUM(unique_companies) as unique_companies,
      SUM(remote_jobs) as remote_jobs
    FROM \`jobs-data-linkedin.mobius_analytics_engine.weekly_job_market_trends\`
    GROUP BY week_start, state, seniority_level, role_type
    ORDER BY week_start ASC
  `,
  
  display: {
    type: 'line',
    width: 'full',
    height: 400,
    responsive: true,
    showLegend: true,
    colors: {
      primary: ['#2970FF', '#5B8CFF', '#1B4DFF'],
      gradient: ['#2970FF', '#5B8CFF', '#8BA8FF', '#B4C7FF'],
    },
  },
  
  methodology: `
    **Data Source**: All 6M+ job postings from LinkedIn since April 2025
    
    **Time Granularity**: Weekly aggregation (Monday-Sunday)
    
    **What This Shows**:
    - Overall job market health and trends
    - Weekly posting volume across all industries
    - Breakdown by state, seniority, and role type
    
    **Filters Available**:
    - State: Filter by specific US states
    - Role Type: Technical vs Non-Technical positions
    - Seniority: Junior, Mid-Level, Senior, Lead/Principal, Management
    
    **Why This Matters**:
    - Shows broader job market trends beyond just AI/ML
    - Helps contextualize AI/ML demand within overall market
    - Identifies seasonal patterns and market shifts
    
    **Data Refresh**: Updated every 2 days with new postings
    
    **Note**: Excludes recruiting agencies (Dice, Jobot, CyberCoders, etc.)
  `
}

