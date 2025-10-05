import { ChartConfig } from '@/lib/types'

export const config: ChartConfig = {
  id: 'salary-distribution',
  title: 'How Are Salaries Distributed Across the Market?',
  description: 'Distribution of job postings across salary bands',
  width: 'full',
  height: 400,
  query: `
    SELECT 
      salary_band,
      job_count,
      avg_salary,
      median_salary,
      remote_jobs,
      unique_companies
    FROM \`jobs-data-linkedin.mobius_analytics_engine.salary_distribution_by_bands\`
    ORDER BY 
      CASE salary_band
        WHEN '$100K-$150K' THEN 1
        WHEN '$150K-$200K' THEN 2
        WHEN '$200K-$300K' THEN 3
        WHEN '$300K-$500K' THEN 4
        WHEN '$500K-$1M' THEN 5
        WHEN '$1M+' THEN 6
      END
  `,
  methodology: `
    **Data Source**: 1,069,033 jobs with disclosed salaries between $100K-$2M
    
    **Salary Bands**: Jobs are grouped into 6 bands based on maximum salary
    
    **Metrics**:
    - Job Count: Total number of postings in each band
    - Average Salary: Mean of all salaries in the band
    - Median Salary: 50th percentile salary
    - Remote Jobs: Count of remote-eligible positions
    - Unique Companies: Number of distinct employers
    
    **Filters Applied**: Only jobs with valid salary data, excluding outliers above $2M
  `
}

