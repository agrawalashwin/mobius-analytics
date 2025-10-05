#!/usr/bin/env node

/**
 * CLI tool to create a new chart
 * Usage: node scripts/create-chart.js
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  console.log('\n🎨 Create a New Chart\n')

  // Get chart details
  const name = await question('Chart name (question format): ')
  const description = await question('Description: ')
  const category = await question('Category (salaries/companies/skills/trends): ')
  const view = await question('BigQuery view name: ')
  const chartType = await question('Chart type (line/bar/area/pie): ')
  const width = await question('Width (full/half/third): ')

  const id = toKebabCase(name)
  const chartDir = path.join(__dirname, '..', 'charts', id)

  // Create directory
  if (fs.existsSync(chartDir)) {
    console.error(`\n❌ Chart "${id}" already exists!`)
    rl.close()
    return
  }

  fs.mkdirSync(chartDir, { recursive: true })

  // Create config.ts
  const configContent = `import { ChartConfig } from '@/lib/types'

export const chartConfig: ChartConfig = {
  id: '${id}',
  name: '${name}',
  description: '${description}',
  category: '${category}',
  tags: ['${category}'],
  
  data: {
    source: 'bigquery',
    view: '${view}',
    refreshInterval: 3600,
  },
  
  display: {
    type: '${chartType}',
    width: '${width}',
    height: 400,
    responsive: true,
    showLegend: true,
    showGrid: true,
    animate: true,
  },
  
  author: 'mobius-analytics',
  version: '1.0.0',
  createdAt: '${new Date().toISOString().split('T')[0]}',
}
`

  fs.writeFileSync(path.join(chartDir, 'config.ts'), configContent)

  // Create index.tsx
  const componentContent = `'use client'

import { useMemo } from 'react'
import { ${getChartImports(chartType)} } from 'recharts'
import { Box } from '@mui/material'
import { useChartData } from '@/lib/data-fetcher'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartSkeleton } from '@/components/ChartSkeleton'
import { ChartError } from '@/components/ChartError'
import { ChartProps } from '@/lib/types'
import { chartColors } from '@/lib/theme'
import { chartConfig } from './config'

export default function ${toPascalCase(id)}Chart({ config = chartConfig }: ChartProps) {
  const { data, loading, error, refetch } = useChartData(config.data)
  
  if (loading) return <ChartSkeleton />
  if (error) return <ChartError error={error} onRetry={refetch} />
  if (data.length === 0) return <ChartError error={new Error('No data available')} />
  
  return (
    <ChartContainer
      title={config.name}
      description={config.description}
      onRefresh={refetch}
      width={config.display.width}
      height={config.display.height}
    >
      <Box sx={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          ${getChartTemplate(chartType)}
        </ResponsiveContainer>
      </Box>
    </ChartContainer>
  )
}
`

  fs.writeFileSync(path.join(chartDir, 'index.tsx'), componentContent)

  // Create README
  const readmeContent = `# ${name}

${description}

## Data Source
- **View**: \`${view}\`
- **Refresh**: Every hour

## Usage
\`\`\`tsx
<ChartRenderer chartId="${id}" />
\`\`\`

## Configuration
See \`config.ts\` for chart configuration.
`

  fs.writeFileSync(path.join(chartDir, 'README.md'), readmeContent)

  console.log(`\n✅ Chart created successfully!`)
  console.log(`\n📁 Location: charts/${id}/`)
  console.log(`\n📝 Next steps:`)
  console.log(`   1. Edit charts/${id}/index.tsx to customize the chart`)
  console.log(`   2. Add to lib/init-charts.ts:`)
  console.log(`      import { chartConfig as ${toCamelCase(id)} } from '@/charts/${id}/config'`)
  console.log(`      registerChart(${toCamelCase(id)})`)
  console.log(`   3. Add to a page:`)
  console.log(`      <ChartRenderer chartId="${id}" />`)
  console.log(`\n🚀 Happy charting!\n`)

  rl.close()
}

function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function toCamelCase(str) {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function getChartImports(type) {
  const imports = {
    line: 'LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer',
    bar: 'BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell',
    area: 'AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer',
    pie: 'PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer',
  }
  return imports[type] || imports.line
}

function getChartTemplate(type) {
  const templates = {
    line: `<LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis tick={{ fontSize: 12 }} stroke="#666" />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={chartColors.primary[0]} 
              strokeWidth={3}
              animationDuration={1000}
            />
          </LineChart>`,
    bar: `<BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis tick={{ fontSize: 12 }} stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell key={\`cell-\${index}\`} fill={chartColors.primary[index % 5]} />
              ))}
            </Bar>
          </BarChart>`,
    area: `<AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis tick={{ fontSize: 12 }} stroke="#666" />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={chartColors.primary[0]} 
              fill={chartColors.primary[1]}
              animationDuration={1000}
            />
          </AreaChart>`,
    pie: `<PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={\`cell-\${index}\`} fill={chartColors.gradient[index % 10]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>`,
  }
  return templates[type] || templates.line
}

main().catch(console.error)

