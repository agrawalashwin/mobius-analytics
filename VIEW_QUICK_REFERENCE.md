# Analytics Views - Quick Reference Card

**Dataset**: `jobs-data-linkedin.mobius_analytics_engine`

---

## 🎯 View Selector Guide

### "I want to show..."

#### **Overall salary distribution**
→ `salary_distribution_by_bands`
- 6 salary bands
- Job counts, averages, medians
- Remote/big tech breakdowns

#### **Company comparison**
→ `salary_by_company_job_family`
- Company × Job Family matrix
- Min/max/avg/median salaries
- Work model breakdowns

#### **Geographic analysis**
→ `salary_by_state_job_family`
- State × Job Family matrix
- Regional comparisons
- Company counts by location

#### **Remote vs onsite comparison**
→ `salary_by_work_model_job_family` or `remote_salary_premium_analysis`
- Work model salary differences
- Premium/discount percentages
- Job counts by model

#### **Career progression**
→ `salary_by_seniority_job_family` or `salary_compression_by_seniority`
- Seniority level progression
- Salary ranges by level
- Compression detection

#### **Company type comparison**
→ `salary_by_company_type_job_family` or `big_tech_vs_startup_salary_comparison`
- Big Tech vs Startup vs Enterprise
- Salary premiums
- Job counts by type

#### **Monthly trends**
→ `monthly_posting_volume_salary_metrics`
- Overall market metrics
- Month-over-month changes
- Volume and salary trends

#### **Company-specific trends**
→ `monthly_salary_trends_by_company`
- Top companies only (100+ jobs)
- Monthly hiring patterns
- Salary evolution

#### **Job family trends**
→ `monthly_salary_trends_by_job_family`
- Engineering, Sales, Finance, etc.
- Monthly salary changes
- Demand shifts

#### **Salary band evolution**
→ `monthly_salary_trends_by_band`
- Band distribution over time
- Migration between bands
- Compression detection

#### **Top payers**
→ `top_paying_companies_by_job_family`
- Highest paying companies
- By job family
- Ranked by average salary

#### **Industry benchmarks**
→ `salary_benchmarks_by_industry`
- TECH, HLTH, FIN, etc.
- Industry × Job Family
- Quartile ranges

---

## 📊 Common Dashboard Patterns

### KPI Card Dashboard
```sql
-- Total jobs with salary data
SELECT COUNT(*) as total_jobs
FROM `mobius_analytics_engine.all_jobs_data_has_salary_info`;

-- Average salary
SELECT ROUND(AVG(max_salary), 0) as avg_salary
FROM `mobius_analytics_engine.all_jobs_data_has_salary_info`;

-- Remote percentage
SELECT 
  ROUND(COUNTIF(is_remote) * 100.0 / COUNT(*), 1) as remote_pct
FROM `mobius_analytics_engine.all_jobs_data_has_salary_info`;
```

### Salary Distribution Chart
```sql
SELECT * 
FROM `mobius_analytics_engine.salary_distribution_by_bands`
ORDER BY salary_band;
```

### Monthly Trend Line
```sql
SELECT 
  month,
  avg_salary,
  total_jobs
FROM `mobius_analytics_engine.monthly_posting_volume_salary_metrics`
ORDER BY month;
```

### Top 10 Companies Table
```sql
SELECT 
  data_company,
  job_family,
  avg_salary,
  job_count
FROM `mobius_analytics_engine.top_paying_companies_by_job_family`
WHERE job_family = 'Engineering & IT'
ORDER BY avg_salary DESC
LIMIT 10;
```

### Geographic Heatmap
```sql
SELECT 
  data_location_state,
  job_family,
  avg_salary,
  job_count
FROM `mobius_analytics_engine.salary_by_state_job_family`
WHERE job_family = 'Engineering & IT'
ORDER BY avg_salary DESC;
```

---

## 🔍 Filter Examples

### By Job Family
```sql
WHERE job_family = 'Engineering & IT'
WHERE job_family LIKE '%Data%'
WHERE job_family IN ('Engineering & IT', 'Product & Design')
```

### By Salary Band
```sql
WHERE salary_band = '200K-300K'
WHERE salary_band IN ('300K-500K', '500K-1M')
```

### By Company Type
```sql
WHERE company_type = 'Big Tech'
WHERE company_type IN ('Big Tech', 'Startup')
```

### By Work Model
```sql
WHERE work_model = 'Remote'
WHERE work_model IN ('Remote', 'Hybrid')
```

### By Location
```sql
WHERE data_location_state = 'California'
WHERE data_location_country = 'United States'
WHERE data_location_state IN ('California', 'New York', 'Washington')
```

### By Time Period
```sql
WHERE month >= '2025-07-01'
WHERE month BETWEEN '2025-06-01' AND '2025-09-01'
WHERE month = DATE_TRUNC(CURRENT_DATE(), MONTH)
```

---

## 💡 Pro Tips

### Performance
1. **Views are pre-aggregated** - No need for GROUP BY
2. **Use WHERE to filter** - Don't re-aggregate
3. **All salary values rounded** - No decimals needed
4. **Statistical filters applied** - Only significant data included

### Data Quality
1. **HAVING filters** ensure minimum job counts
2. **NULL values filtered** where appropriate
3. **Outliers removed** (salary >$2M excluded)
4. **Duplicates handled** in base view

### Best Practices
1. **Start with summary views** for overview
2. **Drill down to detailed views** for analysis
3. **Use time series** for trend detection
4. **Combine views** for multi-dimensional analysis

---

## 📈 View Complexity Guide

### Simple (Direct Query)
- `salary_distribution_by_bands`
- `monthly_posting_volume_salary_metrics`

### Medium (1-2 Filters)
- `salary_by_company_job_family`
- `salary_by_state_job_family`
- `monthly_salary_trends_by_job_family`

### Advanced (Multiple Dimensions)
- `salary_compression_by_seniority`
- `remote_salary_premium_analysis`
- `big_tech_vs_startup_salary_comparison`

---

## 🎨 Visualization Recommendations

| View | Best Chart Type |
|------|----------------|
| salary_distribution_by_bands | Pie, Donut, Bar |
| salary_by_company_job_family | Heatmap, Table |
| salary_by_state_job_family | Choropleth Map, Bar |
| salary_by_work_model_job_family | Grouped Bar, Box Plot |
| monthly_posting_volume_salary_metrics | Line, Area |
| monthly_salary_trends_by_job_family | Multi-line, Area |
| salary_compression_by_seniority | Waterfall, Line |
| top_paying_companies_by_job_family | Horizontal Bar, Table |
| remote_salary_premium_analysis | Scatter, Bar |

---

## 🚀 Quick Start Queries

### 1. Market Overview
```sql
SELECT * FROM `mobius_analytics_engine.salary_distribution_by_bands`;
```

### 2. Recent Trends (Last 3 Months)
```sql
SELECT * 
FROM `mobius_analytics_engine.monthly_posting_volume_salary_metrics`
WHERE month >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)
ORDER BY month DESC;
```

### 3. Top 20 Paying Companies for Engineering
```sql
SELECT * 
FROM `mobius_analytics_engine.top_paying_companies_by_job_family`
WHERE job_family = 'Engineering & IT'
ORDER BY avg_salary DESC
LIMIT 20;
```

### 4. California Salary Analysis
```sql
SELECT * 
FROM `mobius_analytics_engine.salary_by_state_job_family`
WHERE data_location_state = 'California'
ORDER BY avg_salary DESC;
```

### 5. Remote Work Premium
```sql
SELECT 
  job_family,
  AVG(premium_percentage) as avg_premium
FROM `mobius_analytics_engine.remote_salary_premium_analysis`
GROUP BY job_family
ORDER BY avg_premium DESC;
```

---

## 📞 Need Help?

**Can't find the right view?**
- Check [ANALYTICS_VIEWS_DOCUMENTATION.md](ANALYTICS_VIEWS_DOCUMENTATION.md) for full specs
- See [ANALYTICS_ENGINE_SUMMARY.md](ANALYTICS_ENGINE_SUMMARY.md) for use cases

**Query not working?**
- Verify column names in view definition
- Check filter syntax
- Ensure data exists for your filters

**Performance issues?**
- Views are already optimized
- Avoid re-aggregating
- Use WHERE instead of HAVING

---

**Last Updated**: October 4, 2025  
**Quick Reference Version**: 1.0

