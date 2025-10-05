# Analytics Views Documentation

**Dataset**: `jobs-data-linkedin.mobius_analytics_engine`  
**Created**: October 4, 2025  
**Purpose**: Bite-sized, highly aggregated views for live dashboards and data site

---

## 📊 Overview

This dataset contains **17 analytical views** designed for high-performance dashboard queries. All views are pre-aggregated and optimized for fast rendering in BI tools.

**Base Data**: 1,069,033 jobs with salary data ($100K-$2M range)

---

## 🗂️ View Catalog

### Base View
1. **all_jobs_data_has_salary_info** - Foundation view with all jobs having salary >$100K

### Non-Time Series Views (Dimensional Analysis)
2. **salary_distribution_by_bands** - Salary distribution across 6 bands
3. **salary_by_company_job_family** - Company × Job Family matrix
4. **salary_by_state_job_family** - State × Job Family matrix
5. **salary_by_work_model_job_family** - Work Model × Job Family matrix
6. **salary_by_seniority_job_family** - Seniority × Job Family matrix
7. **salary_by_company_type_job_family** - Company Type × Job Family matrix

### Time Series Views (Trend Analysis)
8. **monthly_salary_trends_by_job_family** - Monthly trends by job family
9. **monthly_salary_trends_by_company** - Monthly trends by top companies
10. **monthly_salary_trends_by_band** - Monthly trends by salary band
11. **monthly_salary_trends_by_state** - Monthly trends by state
12. **monthly_posting_volume_salary_metrics** - Overall monthly metrics

### Advanced Analysis Views
13. **salary_compression_by_seniority** - Salary compression analysis
14. **top_paying_companies_by_job_family** - Top payers by job family
15. **remote_salary_premium_analysis** - Remote vs onsite salary comparison
16. **big_tech_vs_startup_salary_comparison** - Big tech vs startup comparison
17. **salary_benchmarks_by_industry** - Industry salary benchmarks

---

## 📋 Detailed View Specifications

### 1. all_jobs_data_has_salary_info
**Type**: Base View  
**Purpose**: Foundation view with all jobs having disclosed salary >$100K and ≤$2M

**Filters**:
- `max_salary IS NOT NULL`
- `max_salary > 100000`
- `max_salary <= 2000000`

**Columns**: 67 fields (all core data + boolean flags)  
**Row Count**: 1,069,033  
**Use Case**: Source for all other views, detailed job exploration

---

### 2. salary_distribution_by_bands
**Type**: Aggregated Summary  
**Purpose**: Overall salary distribution across 6 bands

**Dimensions**: salary_band  
**Metrics**: job_count, avg_salary, median_salary, remote_jobs, big_tech_jobs, engineering_jobs, unique_companies

**Sample Data**:
| Salary Band | Jobs | Avg Salary | Median | % of Total |
|-------------|------|------------|--------|------------|
| 100K-150K | 418,399 | $126,536 | $125,000 | 39.14% |
| 150K-200K | 296,999 | $176,489 | $176,000 | 27.78% |
| 200K-300K | 281,478 | $239,955 | $234,700 | 26.33% |
| 300K-500K | 65,300 | $367,224 | $352,300 | 6.11% |
| 500K-1M | 6,237 | $692,859 | $650,000 | 0.58% |
| 1M-2M | 620 | $1,488,532 | $1,441,311 | 0.06% |

**Dashboard Use**: KPI cards, pie charts, distribution charts

---

### 3. salary_by_company_job_family
**Type**: Dimensional Matrix  
**Purpose**: Salary analysis by company and job family

**Dimensions**: data_company, job_family  
**Metrics**: job_count, avg_salary, median_salary, min_salary, max_salary, remote_jobs, hybrid_jobs, onsite_jobs  
**Filters**: job_count >= 5 (statistical significance)

**Use Cases**:
- Company salary benchmarking
- Job family comparison within companies
- Remote work availability by company

**Dashboard Use**: Heatmaps, comparison tables, company profiles

---

### 4. salary_by_state_job_family
**Type**: Geographic Matrix  
**Purpose**: Salary analysis by state and job family

**Dimensions**: data_location_state, data_location_country, job_family  
**Metrics**: job_count, avg_salary, median_salary, unique_companies, remote_jobs, big_tech_jobs  
**Filters**: job_count >= 10

**Use Cases**:
- Geographic salary comparison
- Cost of living adjustments
- Market analysis by location

**Dashboard Use**: Choropleth maps, state comparison tables

---

### 5. salary_by_work_model_job_family
**Type**: Work Model Analysis  
**Purpose**: Compare salaries across remote/hybrid/onsite models

**Dimensions**: work_model (Remote/Hybrid/Onsite), job_family  
**Metrics**: job_count, avg_salary, median_salary, p25_salary, p75_salary, unique_companies, big_tech_jobs  
**Filters**: job_count >= 10

**Use Cases**:
- Remote work salary analysis
- Work model preferences
- Salary premium/discount analysis

**Dashboard Use**: Bar charts, comparison tables, scatter plots

---

### 6. salary_by_seniority_job_family
**Type**: Seniority Analysis  
**Purpose**: Salary progression by seniority level

**Dimensions**: data_seniority_level, job_family  
**Metrics**: job_count, avg_salary, median_salary, min_salary, max_salary, unique_companies, remote_jobs, big_tech_jobs  
**Filters**: job_count >= 10

**Use Cases**:
- Career progression analysis
- Salary growth expectations
- Seniority benchmarking

**Dashboard Use**: Line charts (progression), comparison tables

---

### 7. salary_by_company_type_job_family
**Type**: Company Type Analysis  
**Purpose**: Compare salaries across company types

**Dimensions**: company_type (Big Tech/Startup/Enterprise/Consulting/Agency), job_family  
**Metrics**: job_count, avg_salary, median_salary, p25_salary, p75_salary, unique_companies, remote_jobs  
**Filters**: job_count >= 10

**Use Cases**:
- Company type comparison
- Startup vs big tech analysis
- Career path decisions

**Dashboard Use**: Bar charts, box plots, comparison tables

---

### 8. monthly_salary_trends_by_job_family
**Type**: Time Series  
**Purpose**: Track salary trends over time by job family

**Dimensions**: month, job_family  
**Metrics**: job_count, avg_salary, median_salary, unique_companies, remote_jobs, big_tech_jobs  
**Filters**: job_count >= 5

**Use Cases**:
- Salary inflation tracking
- Seasonal trends
- Market demand shifts

**Dashboard Use**: Line charts, area charts, trend analysis

---

### 9. monthly_salary_trends_by_company
**Type**: Time Series  
**Purpose**: Track salary trends by top companies (100+ jobs)

**Dimensions**: month, data_company  
**Metrics**: job_count, avg_salary, median_salary, remote_jobs, engineering_jobs  
**Filters**: Companies with 100+ total jobs, monthly job_count >= 3

**Use Cases**:
- Company hiring trends
- Competitive salary tracking
- Market positioning

**Dashboard Use**: Multi-line charts, company comparison

---

### 10. monthly_salary_trends_by_band
**Type**: Time Series + Band Analysis  
**Purpose**: Track how salary bands evolve over time

**Dimensions**: month, salary_band, job_family  
**Metrics**: job_count, avg_salary, unique_companies, remote_jobs  
**Filters**: job_count >= 5

**Use Cases**:
- Salary compression detection
- Band migration analysis
- Market shifts

**Dashboard Use**: Stacked area charts, band distribution over time

---

### 11. monthly_salary_trends_by_state
**Type**: Geographic Time Series  
**Purpose**: Track salary trends by state over time

**Dimensions**: month, data_location_state, data_location_country  
**Metrics**: job_count, avg_salary, median_salary, unique_companies, remote_jobs, big_tech_jobs, engineering_jobs  
**Filters**: job_count >= 10

**Use Cases**:
- Regional market trends
- Geographic arbitrage opportunities
- State-level analysis

**Dashboard Use**: Animated maps, state trend lines

---

### 12. monthly_posting_volume_salary_metrics
**Type**: Overall Time Series  
**Purpose**: High-level monthly metrics across all dimensions

**Dimensions**: month  
**Metrics**: total_jobs, avg_salary, median_salary, p25_salary, p75_salary, unique_companies, remote_jobs, hybrid_jobs, onsite_jobs, big_tech_jobs, startup_jobs, engineering_jobs, data_jobs

**Sample Data** (Last 6 Months):
| Month | Total Jobs | Avg Salary | Median | Remote % |
|-------|------------|------------|--------|----------|
| Oct 2025 | 22,198 | $186,717 | $164,120 | 20.0% |
| Sep 2025 | 149,255 | $187,986 | $170,000 | 20.3% |
| Aug 2025 | 227,601 | $190,458 | $176,000 | 18.2% |
| Jul 2025 | 210,434 | $188,301 | $170,000 | 20.1% |
| Jun 2025 | 205,297 | $189,225 | $170,000 | 19.3% |
| May 2025 | 174,267 | $189,114 | $170,000 | 18.4% |

**Use Cases**:
- Executive dashboard
- Market overview
- Trend spotting

**Dashboard Use**: KPI cards, summary charts, executive reports

---

### 13. salary_compression_by_seniority
**Type**: Advanced Analysis  
**Purpose**: Detect salary compression across seniority levels

**Dimensions**: job_family, data_seniority_level  
**Metrics**: job_count, avg_salary, median_salary, p10_salary, p90_salary, unique_companies  
**Filters**: job_count >= 20  
**Ordering**: By seniority progression (Internship → Executive)

**Use Cases**:
- Identify salary compression issues
- Career progression analysis
- Compensation equity analysis

**Dashboard Use**: Waterfall charts, progression lines, gap analysis

---

### 14. top_paying_companies_by_job_family
**Type**: Ranking Analysis  
**Purpose**: Identify highest-paying companies by job family

**Dimensions**: data_company, job_family  
**Metrics**: job_count, avg_salary, median_salary, max_salary_offered, remote_jobs, visa_friendly_jobs  
**Filters**: job_count >= 10  
**Ordering**: By avg_salary DESC within each job_family

**Use Cases**:
- Job search optimization
- Competitive intelligence
- Salary negotiation data

**Dashboard Use**: Top N lists, ranking tables, company profiles

---

### 15. remote_salary_premium_analysis
**Type**: Comparative Analysis  
**Purpose**: Calculate remote vs onsite salary premium/discount

**Dimensions**: job_family, data_location_state  
**Metrics**: remote_jobs, onsite_jobs, avg_remote_salary, avg_onsite_salary, salary_difference, premium_percentage  
**Filters**: remote_jobs >= 10 AND onsite_jobs >= 10

**Use Cases**:
- Remote work compensation strategy
- Geographic arbitrage
- Work model decisions

**Dashboard Use**: Premium/discount charts, scatter plots, comparison tables

---

### 16. big_tech_vs_startup_salary_comparison
**Type**: Comparative Analysis  
**Purpose**: Compare big tech vs startup compensation

**Dimensions**: job_family, data_seniority_level  
**Metrics**: big_tech_jobs, startup_jobs, avg_big_tech_salary, avg_startup_salary, salary_difference, premium_percentage  
**Filters**: big_tech_jobs >= 5 AND startup_jobs >= 5

**Use Cases**:
- Career path decisions
- Company type comparison
- Compensation strategy

**Dashboard Use**: Side-by-side comparisons, premium charts

---

### 17. salary_benchmarks_by_industry
**Type**: Industry Analysis  
**Purpose**: Salary benchmarks across industries

**Dimensions**: industry, job_family  
**Metrics**: job_count, avg_salary, median_salary, p25_salary, p75_salary, unique_companies, remote_jobs  
**Filters**: job_count >= 20

**Use Cases**:
- Industry comparison
- Career transitions
- Market positioning

**Dashboard Use**: Industry comparison tables, heatmaps

---

## 🎯 Dashboard Use Case Matrix

| View | KPI Cards | Charts | Tables | Maps | Filters |
|------|-----------|--------|--------|------|---------|
| salary_distribution_by_bands | ✅ | ✅ Pie, Bar | ✅ | ❌ | Band |
| salary_by_company_job_family | ✅ | ✅ Heatmap | ✅ | ❌ | Company, Family |
| salary_by_state_job_family | ✅ | ✅ Bar | ✅ | ✅ Choropleth | State, Family |
| salary_by_work_model_job_family | ✅ | ✅ Bar, Box | ✅ | ❌ | Work Model, Family |
| monthly_posting_volume_salary_metrics | ✅ | ✅ Line, Area | ✅ | ❌ | Month |
| salary_compression_by_seniority | ❌ | ✅ Waterfall | ✅ | ❌ | Family, Seniority |
| remote_salary_premium_analysis | ✅ | ✅ Scatter | ✅ | ❌ | Family, State |

---

## 💡 Query Performance Tips

1. **All views are pre-aggregated** - No need for additional GROUP BY
2. **Use WHERE clauses** to filter dimensions (e.g., `WHERE job_family = 'Engineering & IT'`)
3. **Views include HAVING filters** - Only statistically significant data included
4. **Salary values are rounded** - No decimal precision needed
5. **Time series views** - Already sorted by month DESC

---

## 🔄 Refresh Strategy

**Views are dynamic** - They automatically reflect changes in the base table  
**Base table updates**: Every 2 days  
**No manual refresh needed** - Views always show current data

---

**Last Updated**: October 4, 2025  
**Maintained By**: Data Engineering Team

