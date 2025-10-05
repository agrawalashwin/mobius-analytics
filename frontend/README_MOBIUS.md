# 🚀 Mobius Analytics Frontend

**Modern, responsive, modular chart platform for AI/ML job market analytics**

## ✨ Features

- ✅ **Material Design 3** - Clean, minimalist UI
- ✅ **Fully Responsive** - Mobile-first design (xs, sm, md, lg, xl breakpoints)
- ✅ **Modular Charts** - Drop-in chart system with auto-discovery
- ✅ **Smooth Animations** - Framer Motion for buttery transitions
- ✅ **Question-Based Titles** - Charts framed as questions for clarity
- ✅ **Real-time Data** - TanStack Query with caching & auto-refresh
- ✅ **TypeScript** - Full type safety
- ✅ **Mock Data** - Development mode without BigQuery

## 🏗️ Architecture

```
frontend/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home (redirects to /salaries)
│   ├── salaries/            # Salary analytics page
│   ├── companies/           # Company analytics page
│   └── skills/              # Skills analytics page
│
├── charts/                   # 🎯 MODULAR CHARTS (drop-in)
│   ├── ai-salary-premium/
│   │   ├── config.ts        # Chart metadata
│   │   └── index.tsx        # Chart component
│   ├── ai-roles-salary/
│   └── top-companies-hiring/
│
├── components/               # Shared UI components
│   ├── AppShell.tsx         # Navigation + layout
│   ├── ChartRenderer.tsx    # Dynamic chart loader
│   ├── ChartContainer.tsx   # Chart wrapper (responsive)
│   ├── ChartSkeleton.tsx    # Loading state
│   └── ChartError.tsx       # Error state
│
└── lib/                      # Core utilities
    ├── types.ts             # TypeScript types
    ├── theme.ts             # Material Design theme
    ├── bigquery.ts          # Data fetching
    ├── data-fetcher.ts      # TanStack Query hooks
    ├── registry.ts          # Chart registry
    ├── chart-loader.ts      # Dynamic imports
    └── init-charts.ts       # Chart initialization
```

## 🎨 Design System

### Responsive Breakpoints
- **xs**: 0px - 600px (Mobile)
- **sm**: 600px - 900px (Tablet)
- **md**: 900px - 1200px (Desktop)
- **lg**: 1200px - 1536px (Large Desktop)
- **xl**: 1536px+ (Extra Large)

### Chart Widths
- **full**: 100% on all screens
- **half**: 100% (xs/sm), 50% (md+)
- **third**: 100% (xs), 50% (sm), 33.33% (md+)

### Colors (Material Design)
- **Primary**: #1976d2 (Blue)
- **Secondary**: #9c27b0 (Purple)
- **Success**: #2e7d32 (Green)
- **Warning**: #ed6c02 (Orange)
- **Error**: #d32f2f (Red)

### Animations
- **Duration**: 200ms (short), 300ms (medium), 500ms (long)
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Chart Animations**: 1000ms ease-out

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
```
http://localhost:3000
```

The app will use **mock data** by default (no BigQuery needed for development).

## 📊 Adding a New Chart

### Step 1: Create Chart Folder
```bash
mkdir -p charts/my-new-chart
```

### Step 2: Create Config (`charts/my-new-chart/config.ts`)
```typescript
import { ChartConfig } from '@/lib/types'

export const chartConfig: ChartConfig = {
  id: 'my-new-chart',
  name: 'Is This Chart Awesome?', // ❓ Question format!
  description: 'A brief description of what this chart shows',
  category: 'salaries', // salaries | companies | skills | trends
  tags: ['ai', 'ml', 'comparison'],
  
  data: {
    source: 'bigquery',
    view: 'my_bigquery_view',
    refreshInterval: 3600, // seconds
  },
  
  display: {
    type: 'line', // line | bar | area | pie | scatter | heatmap
    width: 'half', // full | half | third
    height: 400,
    responsive: true,
    showLegend: true,
    showGrid: true,
    animate: true,
  },
  
  author: 'your-name',
  version: '1.0.0',
  createdAt: '2025-10-05',
}
```

### Step 3: Create Component (`charts/my-new-chart/index.tsx`)
```typescript
'use client'

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { useChartData } from '@/lib/data-fetcher'
import { ChartContainer } from '@/components/ChartContainer'
import { ChartSkeleton } from '@/components/ChartSkeleton'
import { ChartError } from '@/components/ChartError'
import { ChartProps } from '@/lib/types'
import { chartConfig } from './config'

export default function MyNewChart({ config = chartConfig }: ChartProps) {
  const { data, loading, error, refetch } = useChartData(config.data)
  
  if (loading) return <ChartSkeleton />
  if (error) return <ChartError error={error} onRetry={refetch} />
  
  return (
    <ChartContainer
      title={config.name}
      description={config.description}
      onRefresh={refetch}
      width={config.display.width}
      height={config.display.height}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Line dataKey="value" stroke="#1976d2" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
```

### Step 4: Register Chart (`lib/init-charts.ts`)
```typescript
import { chartConfig as myNewChart } from '@/charts/my-new-chart/config'

export function initializeCharts() {
  registerChart(myNewChart) // Add this line
  // ... other charts
}
```

### Step 5: Add to Page
```typescript
// app/salaries/page.tsx
<Grid item xs={12} md={6}>
  <ChartRenderer chartId="my-new-chart" />
</Grid>
```

**Done!** 🎉 Your chart is now live and responsive!

## 📱 Mobile Responsiveness

All components are mobile-first:

### Navigation
- **Mobile**: Hamburger menu with drawer
- **Desktop**: Fixed sidebar

### Charts
- **Mobile**: Full width, stacked vertically
- **Tablet**: 2 columns for half-width charts
- **Desktop**: 3 columns for third-width charts

### Typography
- **Mobile**: Smaller font sizes (0.875rem - 1rem)
- **Desktop**: Standard sizes (1rem - 1.25rem)

### Spacing
- **Mobile**: Compact padding (8px - 16px)
- **Desktop**: Comfortable padding (16px - 32px)

## 🎯 Chart Best Practices

### 1. Question-Based Titles
✅ **Good**: "Are AI Salaries Declining?"  
❌ **Bad**: "AI Salary Trends"

### 2. Responsive Charts
Always use `ResponsiveContainer` from Recharts:
```typescript
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={data}>...</LineChart>
</ResponsiveContainer>
```

### 3. Loading States
Always show skeleton while loading:
```typescript
if (loading) return <ChartSkeleton />
```

### 4. Error Handling
Always provide retry option:
```typescript
if (error) return <ChartError error={error} onRetry={refetch} />
```

### 5. Animations
Use gentle animations (1000ms ease-out):
```typescript
<Line 
  animationDuration={1000}
  animationEasing="ease-out"
/>
```

## 🔧 Configuration

### Environment Variables (`.env.local`)
```bash
# Use mock data (true = no BigQuery needed)
NEXT_PUBLIC_USE_MOCK_DATA=true

# BigQuery (only if USE_MOCK_DATA=false)
NEXT_PUBLIC_GCP_PROJECT_ID=jobs-data-linkedin
NEXT_PUBLIC_BQ_DATASET_ID=mobius_analytics_engine
```

### Mock Data
Add mock data in `lib/bigquery.ts`:
```typescript
export function getMockData(view: string): BigQueryRow[] {
  const mockDataMap: Record<string, BigQueryRow[]> = {
    my_view: [
      { month: '2025-01-01', value: 100 },
      { month: '2025-02-01', value: 150 },
    ],
  }
  return mockDataMap[view] || []
}
```

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Material-UI (MUI) v6
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Emotion (CSS-in-JS)
- **TypeScript**: Full type safety
- **BigQuery**: Google Cloud BigQuery client

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
```bash
vercel deploy
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### Change Theme Colors
Edit `lib/theme.ts`:
```typescript
primary: {
  main: '#1976d2', // Change this
}
```

### Change Chart Colors
Edit `lib/theme.ts`:
```typescript
export const chartColors = {
  primary: ['#1976d2', '#42a5f5', ...],
}
```

### Change Breakpoints
Edit `lib/theme.ts`:
```typescript
breakpoints: {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
}
```

## 🐛 Troubleshooting

### Charts not loading?
1. Check `lib/init-charts.ts` - is your chart registered?
2. Check console for errors
3. Verify chart ID matches folder name

### Data not showing?
1. Check `.env.local` - is `USE_MOCK_DATA=true`?
2. Check `lib/bigquery.ts` - is mock data defined?
3. Check browser console for fetch errors

### Mobile layout broken?
1. Check `ChartContainer` - using responsive width?
2. Check Grid spacing - using `spacing={{ xs: 2, md: 3 }}`?
3. Test on actual device or Chrome DevTools

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Material-UI Docs](https://mui.com/)
- [Recharts Docs](https://recharts.org/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [TanStack Query Docs](https://tanstack.com/query/latest)

## 🎉 You're Ready!

Start building beautiful, responsive charts! 🚀

