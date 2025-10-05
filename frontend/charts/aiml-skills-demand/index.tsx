'use client'

import { useEffect, useState } from 'react'
import { Box, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartSkeleton } from '@/components/ChartSkeleton'
import { ChartError } from '@/components/ChartError'
import { ChartProps } from '@/lib/types'
import { chartColors } from '@/lib/theme'
import { config } from './config'

export default function AiMlSkillsDemandChart({ config: configProp }: ChartProps) {
  const chartConfig = configProp || config
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [salaryCohort, setSalaryCohort] = useState<string>('all')
  const [topN, setTopN] = useState<number>(15)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Build query based on salary cohort
        let salaryFilter = ''
        if (salaryCohort === '150-200k') {
          salaryFilter = 'WHERE avg_salary BETWEEN 150000 AND 200000'
        } else if (salaryCohort === '200-250k') {
          salaryFilter = 'WHERE avg_salary BETWEEN 200000 AND 250000'
        } else if (salaryCohort === '250k+') {
          salaryFilter = 'WHERE avg_salary >= 250000'
        }

        const query = `
          WITH skills_unpivot AS (
            SELECT 'Python' as skill, SUM(mentions_python) as mentions, AVG(avg_salary) as avg_salary FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'TensorFlow', SUM(mentions_tensorflow), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'PyTorch', SUM(mentions_pytorch), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'Kubernetes', SUM(mentions_kubernetes), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'Docker', SUM(mentions_docker), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'AWS', SUM(mentions_aws), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'Spark', SUM(mentions_spark), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'SQL', SUM(mentions_sql), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'Airflow', SUM(mentions_airflow), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'MLflow', SUM(mentions_mlflow), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'LangChain', SUM(mentions_langchain), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'Scikit-learn', SUM(mentions_sklearn), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'Keras', SUM(mentions_keras), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'Deep Learning', SUM(mentions_deep_learning), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
            UNION ALL
            SELECT 'NLP', SUM(mentions_nlp), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\` ${salaryFilter}
          )
          SELECT
            skill,
            mentions as job_count,
            ROUND(avg_salary, 0) as avg_salary
          FROM skills_unpivot
          WHERE mentions > 0
          ORDER BY mentions DESC
          LIMIT 20
        `

        const response = await fetch('/api/bigquery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        })

        const result = await response.json()

        if (result.error) {
          setError(new Error(result.error))
          return
        }

        setData(result.data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [salaryCohort])

  const refetch = () => {
    setLoading(true)
    setError(null)
  }

  if (loading) return <ChartSkeleton />
  if (error) return <ChartError error={error} onRetry={refetch} />
  if (!data || data.length === 0) return <ChartError error={new Error('No data available')} />

  // Sort and limit data
  const sortedData = [...data]
    .sort((a, b) => b.job_count - a.job_count)
    .slice(0, topN)

  return (
    <ChartContainer
      title={chartConfig.title}
      description={chartConfig.description}
      onRefresh={refetch}
      width={chartConfig.width}
      height={chartConfig.height}
      methodology={chartConfig.methodology}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Filters */}
        <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, mb: 3, justifyContent: 'center', flexWrap: 'wrap', px: { xs: 1, sm: 0 } }}>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>
              Salary Cohort
            </Typography>
            <ToggleButtonGroup
              value={salaryCohort}
              exclusive
              onChange={(e, val) => val && setSalaryCohort(val)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: { xs: 1, sm: 1.5, md: 2 },
                  py: 0.5,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                },
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="150-200k">$150-200K</ToggleButton>
              <ToggleButton value="200-250k">$200-250K</ToggleButton>
              <ToggleButton value="250k+">$250K+</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>
              Show Top
            </Typography>
            <ToggleButtonGroup
              value={topN}
              exclusive
              onChange={(e, val) => val && setTopN(val)}
              size="small"
              sx={{ '& .MuiToggleButton-root': { px: { xs: 1.5, sm: 2 }, py: 0.5, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' } } }}
            >
              <ToggleButton value={10}>10</ToggleButton>
              <ToggleButton value={15}>15</ToggleButton>
              <ToggleButton value={20}>20</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Box sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          height: { xs: 400, sm: 450, md: chartConfig.height },
          overflowX: { xs: 'auto', md: 'visible' },
          overflowY: 'hidden'
        }}>
          <Box sx={{ minWidth: { xs: 600, md: '100%' }, height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                margin={{ top: 20, right: 80, left: 120, bottom: 20 }}
                layout="vertical"
              >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="skill"
              tick={{ fontSize: 11, fill: '#666' }}
              stroke="#666"
              width={110}
              interval={0}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 13
              }}
              formatter={(value: number, name: string) => {
                if (name === 'job_count') return [value.toLocaleString(), 'Job Postings']
                if (name === 'avg_salary') return [`$${Math.round(value / 1000)}K`, 'Avg Salary']
                return [value, name]
              }}
            />
            <Bar
              dataKey="job_count"
              name="job_count"
              radius={[0, 8, 8, 0]}
              label={{
                position: 'right',
                formatter: (value: number) => value.toLocaleString(),
                fontSize: 11,
                fill: '#666'
              }}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors.gradient[index % chartColors.gradient.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </Box>
        </Box>
      </Box>
    </ChartContainer>
  )
}

